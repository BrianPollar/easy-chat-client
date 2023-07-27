import { Subject, takeUntil } from 'rxjs';
import { ChatMsg, ChatRoom } from '../defines/chat-room.define';
import { ECHATMETHOD } from '../enums/chat.enum';
import { IpeerInfo } from '../interfaces/chat.interface';
import { makeRandomString } from '../constants/makerandomstring.constant';
import { TchatMsgStatus } from '../types/union.types';
import { autoUnsub } from '../decorators/class.decorators';
import { LoggerController } from './logger.controller';
import { EasyChatClient } from '../websocket';

/** Handle CHAT related Task*/
@autoUnsub()
export class EasyChatController {
  messages: ChatMsg[] = [];
  toPeer = 'all';
  activeRoom: ChatRoom | undefined;
  destroyed$ = new Subject();
  logger = new LoggerController();

  constructor(
    public websocket: EasyChatClient,
    private myId: string,
    private myNames: string,
    private myPhotoUrl: string
  ) {
    this.runSubscriptions();
  }

  runSubscriptions() {
    this.websocket.eventbus.chat$
      .pipe(takeUntil((this.destroyed$)))
      .subscribe(event => {
        if (event && event.type === ECHATMETHOD.CHAT_MESSAGE) {
          const { from, chatMessage, to, id, createTime } = event.data;
          if (to !== 'all' && to !== this.myId) {
            return;
          }

          const peerInfo = this.activeRoom.getPeerInfo(from);
          const msg = new ChatMsg(
            this.myId,
            {
              id,
              peerInfo,
              roomId: this.activeRoom.id,
              msg: chatMessage,
              createTime,
              who: 'partner',
              status: 'recieved',
              deleted: false
            });

          this.messages = [...this.messages, msg];
          this.scrollToLast();
          this.updateStatus('recieved', msg);
        }

        if (event && event.type === ECHATMETHOD.DELETE_MESSAGE) {
          const { id, deleted } = event.data;
          const found = this.messages
            .find(msg => msg.id === id);
          if (found) {
            found.deleted = deleted;
          }
        }

        if (event && event.type === ECHATMETHOD.NEW_PEER) {
          this.newPeer(event.data);
        }

        if (event && event.type === ECHATMETHOD.NEW_MAIN_PEER) {
          this.mangeNewMainPeers(event.data);
        }

        if (event && event.type === ECHATMETHOD.PEER_CLOSE) {
          this.peerClosed(event.data);
        }

        if (event && event.type === ECHATMETHOD.MAIN_PEER_CLOSE) {
          this.manageMainPeerLeave(event.data);
        }

        if (event && event.type === ECHATMETHOD.ROOM_CREATED) {
          this.joinRoom();
        }

        if (event && event.type === ECHATMETHOD.SOCKET_CONNECTED) {
          this.joinMainRoom();
        }

        if (event && event.type === ECHATMETHOD.UPDATE_STATUS) {
          const { id, status } = event.data;
          const msg = this.messages
            .find(val => val.id === id);
          if (msg) {
            msg.status = status;
            /**
             * const exist = msg[statusField]
              .find(val => val.id === statusQuo.id);
            if (!exist) {
              msg[statusField].push(statusQuo);
            }*/

            if (status === 'viewed') {
              this.websocket.eventbus.outEvent.next({
                type: 'viewed',
                data: this.activeRoom.unviewedMsgsLength
              });
              if (this.activeRoom.unviewedMsgsLength > 0) {
                this.activeRoom.unviewedMsgsLength--;
              }
            }
          }
        }

        if (event && event.type === ECHATMETHOD.PEER_UPDATE) {
          const { peerInfo } = event.data;
          const localPeerInfo = this.activeRoom.getPeerInfo(peerInfo.id);
          if (localPeerInfo) {
            localPeerInfo.roomAdmin = peerInfo.roomAdmin;
            // localPeerInfo.muted = peerInfo.muted;
            // if new props the add here
          }
        }

        if (event && event.type === ECHATMETHOD.UPDATE_ROOM) {
          const { roomData, add } = event.data;
          this.activeRoom.update(roomData, add);
        }
      });
  }

  determinLocalPeerInfo() {
    const peerInfo: IpeerInfo = {
      id: this.myId,
      name: this.myNames,
      photo: this.myPhotoUrl,
      roomAdmin: false,
      lastSeen: new Date(),
      online: true,
      unviewedMsgsLength: 0
    };
    return peerInfo;
  }

  async joinRoom() {
    if (!this.activeRoom) {
      return;
    }
    const { joined, peers } = await this
      .join(this.determinLocalPeerInfo());

    if (joined) {
      return;
    }

    this.logger.debug('joined, peersinfo: %s', JSON.stringify(peers));

    for (const peer of peers) {
      this.newPeer(peer);
    }
  }

  async joinMainRoom() {
    const { joined, peers } = await this
      .joinMain(this.determinLocalPeerInfo());

    if (joined) {
      return;
    }

    this.logger.debug('joined main room, peersinfo: %s', JSON.stringify(peers));

    this.mangeNewMainPeers(peers);
  }


  async joinMain(params) {
    const callRes = await this.websocket.sendOnlineSoloRequest(
      ECHATMETHOD.JOIN,
      params
    );

    return callRes as { peers: IpeerInfo[]; joined: boolean };
  }

  async join(params) {
    const callRes = await this.websocket.sendRequest(
      ECHATMETHOD.JOIN,
      params
    );

    return callRes as { peers: IpeerInfo[]; joined: boolean };
  }

  send(chatMessage: string) {
    const id = this.activeRoom.id + makeRandomString(22, 'combined');
    const createTime = new Date();
    const msg = new ChatMsg(
      this.myId,
      {
        id,
        peerInfo: this.determinLocalPeerInfo(),
        roomId: this.activeRoom.id,
        msg: chatMessage,
        createTime,
        who: 'me',
        status: 'pending',
        deleted: false
      }
    );

    this.messages = [...this.messages, msg];
    this.scrollToLast();

    return this.websocket.sendRequest(
      ECHATMETHOD.CHAT_MESSAGE,
      {
        id,
        roomId: this.activeRoom.id,
        chatMessage,
        createTime,
        from: this.myId,
        to: this.toPeer
      }
    ).then(() => {
      msg.status = 'sent';
    }).catch(err => {
      this.logger.error('send MESSAGE ERROR', err);
      msg.status = 'failed';
    });
  }


  updateStatus(status: TchatMsgStatus, msg: ChatMsg) {
    return this.websocket.sendRequest(
      ECHATMETHOD.UPDATE_STATUS,
      {
        id: msg.id,
        status,
        statusField: status,
        from: this.myId,
        to: this.toPeer
      }
    ).then(() => true).catch(() => false);
  }

  deleteRestoreMesage(id: string, deleted: boolean) {
    return this.websocket.sendRequest(
      ECHATMETHOD.DELETE_MESSAGE,
      {
        deleted,
        id,
        from: this.myId,
        to: this.toPeer
      }
    ).then(() => true).catch(() => false);
  }

  sendClosePeer(stopClass: boolean) {
    this.logger.debug('sendClosePeer');
    return this.websocket.sendRequest(
      ECHATMETHOD.CLOSE_PEER,
      {
        stopClass
      }
    );
  }

  updatePeer(peerInfo: IpeerInfo) {
    return this.websocket.sendRequest(
      ECHATMETHOD.PEER_UPDATE,
      {
        peerInfo,
        from: this.myId,
        to: 'all'
      }
    );
  }

  updateRoom(roomData, add: boolean /** add to array or remove if false */) {
    return this.websocket.sendRequest(
      ECHATMETHOD.UPDATE_ROOM,
      {
        roomData,
        add,
        from: this.myId,
        to: 'all'
      }
    );
  }

  newRoom(room: ChatRoom) {
    if (this.websocket.isSocketConnected()) {
      if (this.activeRoom) {
        // this.sendClosePeer(false);
        if (this.activeRoom.id !== room.id) {
          this.clearRoom();
        } else {
          return;
        }
      }
    } else {
      this.websocket.connect();
    }
    this.activeRoom = room;
    return this.websocket.sendOnlineSoloRequest(
      ECHATMETHOD.NEW_ROOM,
      {
        roomId: room.id,
        userId: this.myId,
        to: 'me'
      }
    );
  }

  clearRoom() {
    // eslint-disable-next-line no-undefined
    this.activeRoom = undefined;
    this.messages.length = 0;
    this.messages = [];
  }

  scrollToLast() {
    /* if (document) {
    const elem = document?.getElementById('scroll-after-msg');
    elem?.scrollIntoView();
    }*/
  }

  private mangeNewMainPeers(peers: IpeerInfo[]) {
    for (const peer of peers) {
      this.websocket.activeUsers.set(peer.id, peer.id);
    }
    this.websocket.eventbus.userOnlineChange$.next(true);
  }

  private manageMainPeerLeave(data) {
    const { peerId } = data;
    this.websocket.activeUsers.delete(peerId);
    this.websocket.eventbus.userOnlineChange$.next(true);
  }

  private newPeer(data: Partial<IpeerInfo>) {
    const { id } = data;
    const peerInfo = this.getPeerInfo(id);
    if (peerInfo) {
      this.logger.warn('peer %s already existed!', id);
      peerInfo.online = true;
      return;
    }

    const peer = {
      id: data.id,
      name: data.name,
      photo: data.photo,
      roomAdmin: data.roomAdmin,
      online: data.online,
      lastSeen: new Date(),
      unviewedMsgsLength: data.unviewedMsgsLength
    };
    this.logger.debug('newPeer, %o', peer);
    this.activeRoom.peers = [...this.activeRoom.peers, peer];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private peerClosed(data: any) {
    const { peerId } = data;
    const peerInfo = this.getPeerInfo(peerId);
    if (peerInfo) {
      peerInfo.online = false;
    }
    // this.activeRoom.peers = this.activeRoom.peers.filter(p => p.id !== peerId);
  }

  private getPeerInfo(peerId: string) {
    return this.activeRoom.peers.find(peer => peer.id === peerId);
  }
}

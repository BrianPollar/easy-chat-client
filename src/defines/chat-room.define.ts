import { IchatMsg, IchatRoom, IpeerInfo } from '../interfaces/chat.interface';
import { TchatMsgStatus, TchatMsgWho } from '../types/union.types';

export class Chat {
  id: string;
  createTime: Date;

  constructor(data: IchatRoom | IchatMsg) {
    this.id = data.id;
    this.createTime = data.createTime;
  }
}


export class ChatRoom
  extends Chat {
  lastActive: Date;
  peers: IpeerInfo[];
  blocked: string[];
  unviewedMsgsLength: number;
  type: string; // solo || bargain
  extras?;
  closed = false;

  constructor(room: Required<IchatRoom>) {
    super(room);
    this.lastActive = room.lastActive;
    this.peers = room.peers;
    this.blocked = room.blocked;
    this.unviewedMsgsLength = room.unviewedMsgsLength;
    this.type = room.type;
    this.extras = room.extras;
    this.closed = room.closed;
  }

  update(val, add: boolean) {
    this.createTime = val.createTime || this.createTime;
    this.lastActive = val.lastActive || this.lastActive;

    if (val.peers?.length) {
      const peers = this.peers || [];
      if (add) {
        this.peers = [...peers, ...val.peers];
      } else {
        this.peers = peers
          .filter(p => !val.peers.includes(p.id));
      }
    }

    if (val.blocked?.length) {
      const blocked = this.blocked || [];
      if (add) {
        this.blocked = [...blocked, ...val.blocked];
      } else {
        this.blocked = blocked
          .filter(b => !val.blocked.includes(b));
      }
    }
  }

  getParticipants() {
    return this.peers;
  }

  getPeerInfo(id: string) {
    const fullPeer = (this.peers)
      .find(p => p.id === id);
    if (fullPeer) {
      return fullPeer;
    }
    return null;
  }
}


export class ChatMsg
  extends Chat {
  peerInfo?: IpeerInfo;
  roomId: string;
  msg: string;
  who: TchatMsgWho;
  status: TchatMsgStatus;
  deleted: boolean;

  constructor(
    private myId: string,
    msg: IchatMsg
  ) {
    super(msg);
    this.peerInfo = msg.peerInfo;
    this.roomId = msg.roomId;
    this.msg = msg.msg;
    if (this.myId === this.peerInfo?.id) {
      this.who = 'me';
    } else {
      this.who = 'partner';
    }
    this.status = msg.status;
    this.deleted = msg.deleted;
  }
}

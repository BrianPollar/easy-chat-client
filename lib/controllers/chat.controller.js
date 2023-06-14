"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyChatController = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const chat_room_define_1 = require("../defines/chat-room.define");
const chat_enum_1 = require("../enums/chat.enum");
const makerandomstring_constant_1 = require("../constants/makerandomstring.constant");
const class_decorators_1 = require("../decorators/class.decorators");
/** Handle CHAT related Task*/
let EasyChatController = class EasyChatController {
    constructor(websocket, eventbus, logger, myId, myNames, myPhotoUrl) {
        this.websocket = websocket;
        this.eventbus = eventbus;
        this.logger = logger;
        this.myId = myId;
        this.myNames = myNames;
        this.myPhotoUrl = myPhotoUrl;
        this.messages = [];
        this.toPeer = 'all';
        this.destroyed$ = new rxjs_1.Subject();
        this.eventbus.chat$
            .pipe((0, rxjs_1.takeUntil)(this.destroyed$))
            .subscribe(event => {
            if (event && event.type === chat_enum_1.ECHATMETHOD.CHAT_MESSAGE) {
                const { from, chatMessage, to, id, createTime } = event.data;
                if (to !== 'all' && to !== this.myId) {
                    return;
                }
                const peerInfo = this.activeRoom.getPeerInfo(from);
                const msg = new chat_room_define_1.ChatMsg(this.myId, {
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
            if (event && event.type === chat_enum_1.ECHATMETHOD.DELETE_MESSAGE) {
                const { id, deleted } = event.data;
                const found = this.messages
                    .find(msg => msg.id === id);
                if (found) {
                    found.deleted = deleted;
                }
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.NEW_PEER) {
                this.newPeer(event.data);
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.NEW_MAIN_PEER) {
                this.mangeNewMainPeers(event.data);
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.PEER_CLOSE) {
                this.peerClosed(event.data);
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.MAIN_PEER_CLOSE) {
                this.manageMainPeerLeave(event.data);
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.ROOM_CREATED) {
                this.joinRoom();
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.SOCKET_CONNECTED) {
                this.joinMainRoom();
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.UPDATE_STATUS) {
                const { to, id, statusField, statusQuo, status } = event.data;
                const msg = this.messages
                    .find(val => val.id === id);
                if (msg) {
                    msg.status = status;
                    const exist = msg[statusField]
                        .find(val => val.id === statusQuo.id);
                    if (!exist) {
                        msg[statusField].push(statusQuo);
                    }
                }
                if (status === 'viewed') {
                    this.eventbus.outEvent.next({
                        type: 'viewed',
                        data: this.activeRoom.unviewedMsgsLength
                    });
                    if (this.activeRoom.unviewedMsgsLength > 0) {
                        this.activeRoom.unviewedMsgsLength--;
                    }
                }
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.PEER_UPDATE) {
                const { peerInfo } = event.data;
                const localPeerInfo = this.activeRoom.getPeerInfo(peerInfo);
                if (localPeerInfo) {
                    peerInfo.roomAdmin = peerInfo.roomAdmin;
                    peerInfo.muted = peerInfo.muted;
                    // if new props the add here
                }
            }
            if (event && event.type === chat_enum_1.ECHATMETHOD.UPDATE_ROOM) {
                const { roomData, add } = event.data;
                this.activeRoom.update(roomData, add);
            }
        });
    }
    determinLocalPeerInfo() {
        const peerInfo = {
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
        const callRes = await this.websocket.sendOnlineSoloRequest(chat_enum_1.ECHATMETHOD.JOIN, params);
        return callRes;
    }
    async join(params) {
        const callRes = await this.websocket.sendRequest(chat_enum_1.ECHATMETHOD.JOIN, params);
        return callRes;
    }
    send(chatMessage) {
        console.log('JUST MAY BE SENDING IS BEING DONE TWICE');
        const id = this.activeRoom.id + (0, makerandomstring_constant_1.makeRandomString)(22, 'combined');
        const createTime = new Date();
        const msg = new chat_room_define_1.ChatMsg(this.myId, {
            id,
            peerInfo: this.determinLocalPeerInfo(),
            roomId: this.activeRoom.id,
            msg: chatMessage,
            createTime,
            who: 'me',
            status: 'pending',
            deleted: false
        });
        this.messages = [...this.messages, msg];
        this.scrollToLast();
        this.websocket.sendRequest(chat_enum_1.ECHATMETHOD.CHAT_MESSAGE, {
            id,
            roomId: this.activeRoom.id,
            chatMessage,
            createTime,
            from: this.myId,
            to: this.toPeer
        }).then(() => {
            msg.status = 'sent';
        }).catch(err => {
            this.logger.error('send MESSAGE ERROR', err);
            msg.status = 'failed';
        });
    }
    updateStatus(status, msg) {
        this.websocket.sendRequest(chat_enum_1.ECHATMETHOD.UPDATE_STATUS, {
            id: msg.id,
            status,
            statusField: status,
            from: this.myId,
            to: this.toPeer
        }).then(() => true).catch(() => false);
    }
    deleteRestoreMesage(id, deleted) {
        this.websocket.sendRequest(chat_enum_1.ECHATMETHOD.DELETE_MESSAGE, {
            deleted,
            id,
            from: this.myId,
            to: this.toPeer
        }).then(() => true).catch(() => false);
    }
    sendClosePeer(stopClass) {
        this.logger.debug('sendClosePeer');
        return this.websocket.sendRequest(chat_enum_1.ECHATMETHOD.CLOSE_PEER, {
            stopClass
        });
    }
    updatePeer(peerInfo) {
        return this.websocket.sendRequest(chat_enum_1.ECHATMETHOD.PEER_UPDATE, {
            peerInfo,
            from: this.myId,
            to: 'all'
        });
    }
    updateRoom(roomData, add /** add to array or remove if false */) {
        return this.websocket.sendRequest(chat_enum_1.ECHATMETHOD.UPDATE_ROOM, {
            roomData,
            add,
            from: this.myId,
            to: 'all'
        });
    }
    newRoom(room) {
        if (this.websocket.isSocketConnected()) {
            if (this.activeRoom) {
                // this.sendClosePeer(false);
                if (this.activeRoom.id !== room.id) {
                    this.clearRoom();
                }
                else {
                    return;
                }
            }
        }
        else {
            this.websocket.connect();
        }
        this.activeRoom = room;
        return this.websocket.sendOnlineSoloRequest(chat_enum_1.ECHATMETHOD.NEW_ROOM, {
            roomId: room.id,
            userId: this.myId,
            to: 'me'
        });
    }
    clearRoom() {
        this.activeRoom = null;
        this.messages.length = 0;
        this.messages = [];
    }
    scrollToLast() {
        const elem = document?.getElementById('scroll-after-msg');
        elem.scrollIntoView();
    }
    mangeNewMainPeers(peers) {
        for (const peer of peers) {
            this.websocket.activeUsers.set(peer.id, peer.id);
        }
        this.eventbus.userOnlineChange$.next(true);
    }
    manageMainPeerLeave(data) {
        const { peerId } = data;
        this.websocket.activeUsers.delete(peerId);
        this.eventbus.userOnlineChange$.next(true);
    }
    newPeer(data) {
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
            muted: data.muted,
            online: data.online,
            whoType: data.whoType,
            lastSeen: new Date(),
            unviewedMsgsLength: data.unviewedMsgsLength
        };
        this.logger.debug('newPeer, %o', peer);
        this.activeRoom.peers = [...this.activeRoom.peers, peer];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    peerClosed(data) {
        const { peerId } = data;
        const peerInfo = this.getPeerInfo(peerId);
        if (peerInfo) {
            peerInfo.online = false;
        }
        // this.activeRoom.peers = this.activeRoom.peers.filter(p => p.id !== peerId);
    }
    getPeerInfo(peerId) {
        return this.activeRoom.peers.find(peer => peer.id === peerId);
    }
};
EasyChatController = tslib_1.__decorate([
    (0, class_decorators_1.autoUnsub)()
], EasyChatController);
exports.EasyChatController = EasyChatController;
//# sourceMappingURL=chat.controller.js.map
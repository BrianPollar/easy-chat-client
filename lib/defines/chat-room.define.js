"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMsg = exports.ChatRoom = exports.Chat = void 0;
class Chat {
    constructor(data) {
        this.id = data.id;
        this.createTime = data.createTime;
    }
}
exports.Chat = Chat;
class ChatRoom extends Chat {
    constructor(room) {
        super(room);
        this.closed = false;
        this.lastActive = room.lastActive;
        this.peers = room.peers;
        this.blocked = room.blocked;
        this.unviewedMsgsLength = room.unviewedMsgsLength;
        this.type = room.type;
        this.extras = room.extras;
        this.closed = room.closed;
    }
    update(val, add) {
        this.createTime = val.createTime || this.createTime;
        this.lastActive = val.lastActive || this.lastActive;
        if (val.peers?.length) {
            const peers = this.peers || [];
            if (add) {
                this.peers = [...peers, ...val.peers];
            }
            else {
                this.peers = peers
                    .filter(p => !val.peers.includes(p.id));
            }
        }
        if (val.blocked?.length) {
            const blocked = this.blocked || [];
            if (add) {
                this.blocked = [...blocked, ...val.blocked];
            }
            else {
                this.blocked = blocked
                    .filter(b => !val.blocked.includes(b));
            }
        }
    }
    getParticipants() {
        return this.peers;
    }
    getPeerInfo(id) {
        const fullPeer = (this.peers)
            .find(p => p.id === id);
        if (fullPeer) {
            return fullPeer;
        }
        return null;
    }
}
exports.ChatRoom = ChatRoom;
class ChatMsg extends Chat {
    constructor(myId, msg) {
        super(msg);
        this.myId = myId;
        this.peerInfo = msg.peerInfo;
        this.roomId = msg.roomId;
        this.msg = msg.msg;
        if (this.myId === this.peerInfo?.id) {
            this.who = 'me';
        }
        else {
            this.who = 'partner';
        }
        this.status = msg.status;
        this.deleted = msg.deleted;
    }
}
exports.ChatMsg = ChatMsg;
//# sourceMappingURL=chat-room.define.js.map
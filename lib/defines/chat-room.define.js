"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMsg = exports.ChatRoom = exports.Chat = exports.createMockChatMsgs = exports.createMockChatMsg = exports.createMockChatRooms = exports.createMockChatRoom = exports.createMockPeerinfo = exports.createMockChat = void 0;
const faker_1 = require("@faker-js/faker");
const createMockChat = () => {
    return {
        id: faker_1.faker.string.uuid(),
        createTime: faker_1.faker.date.past()
    };
};
exports.createMockChat = createMockChat;
const createMockPeerinfo = () => {
    return {
        id: faker_1.faker.string.uuid(),
        photo: faker_1.faker.image.avatar(),
        name: faker_1.faker.internet.userName(),
        roomAdmin: faker_1.faker.string.uuid(),
        lastSeen: faker_1.faker.date.past(),
        online: false // number of unseen messages
    };
};
exports.createMockPeerinfo = createMockPeerinfo;
const createMockChatRoom = (incrementor = 0) => {
    const room = {
        ...(0, exports.createMockChat)(),
        lastActive: faker_1.faker.date.past(),
        peers: [(0, exports.createMockPeerinfo)(), (0, exports.createMockPeerinfo)()],
        blocked: [],
        unviewedMsgsLength: 10,
        type: incrementor % 2 ? 'solo' : 'bargain',
        closed: false,
        extras: null
    };
    const roomy = new ChatRoom(room);
    console.log('PROTO', roomy['prototype']);
    return roomy;
};
exports.createMockChatRoom = createMockChatRoom;
const createMockChatRooms = (length) => {
    return Array.from({ length }).map((val, index) => (0, exports.createMockChatRoom)(index));
};
exports.createMockChatRooms = createMockChatRooms;
const createMockChatMsg = (incrementor = 0) => {
    const msg = {
        ...(0, exports.createMockChat)(),
        peerInfo: (0, exports.createMockPeerinfo)(),
        roomId: faker_1.faker.string.uuid(),
        msg: faker_1.faker.string.alphanumeric(),
        who: incrementor % 2 ? 'me' : 'partner',
        status: 'sent',
        deleted: false
    };
    return new ChatMsg(faker_1.faker.string.uuid(), msg);
};
exports.createMockChatMsg = createMockChatMsg;
const createMockChatMsgs = (length) => {
    return Array.from({ length }).map((val, index) => (0, exports.createMockChatMsg)(index));
};
exports.createMockChatMsgs = createMockChatMsgs;
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
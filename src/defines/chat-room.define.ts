import { IchatMsg, IchatRoom, IpeerInfo } from '../interfaces/chat.interface';
import { TchatMsgStatus, TchatMsgWho } from '../types/union.types';
import { faker } from '@faker-js/faker';

export const createMockChat = () => {
  return {
    id: faker.string.uuid(),
    createTime: faker.date.past()
  };
};

export const createMockPeerinfo = () => {
  return {
    id: faker.string.uuid(),
    photo: faker.image.avatar(),
    name: faker.internet.userName(),
    roomAdmin: faker.string.uuid(),
    lastSeen: faker.date.past(),
    online: false// number of unseen messages
  };
};


export const createMockChatRoom = (incrementor = 0) => {
  const room = {
    ...createMockChat(),
    lastActive: faker.date.past(),
    peers: [createMockPeerinfo(), createMockPeerinfo()] as unknown as IpeerInfo[],
    blocked: [],
    unviewedMsgsLength: 10,
    type: incrementor % 2 ? 'solo' : 'bargain',
    closed: false,
    extras: null
  } as Required<IchatRoom>;

  const roomy = new ChatRoom(room);
  console.log('PROTO', roomy['prototype']);
  return roomy;
};

export const createMockChatRooms = (length: number) => {
  return Array.from({ length }).map((val, index) => createMockChatRoom(index));
};

export const createMockChatMsg = (incrementor = 0) => {
  const msg = {
    ...createMockChat(),
    peerInfo: createMockPeerinfo() as unknown as IpeerInfo,
    roomId: faker.string.uuid(),
    msg: faker.string.alphanumeric(),
    who: incrementor % 2 ? 'me' : 'partner',
    status: 'sent',
    deleted: false
  } as IchatMsg;
  return new ChatMsg(faker.string.uuid(), msg);
};

export const createMockChatMsgs = (length: number) => {
  return Array.from({ length }).map((val, index) => createMockChatMsg(index));
};

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

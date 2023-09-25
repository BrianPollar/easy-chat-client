import { faker } from '@faker-js/faker';
import { IchatMsg, IchatRoom, IpeerInfo } from '../src/interfaces/chat.interface';
import { ChatMsg, ChatRoom } from '../src/defines/chat-room.define';

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


/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import { Chat, ChatRoom, ChatMsg, createMockChatMsg, createMockChatRoom } from '../../../src/defines/chat-room.define';
import { faker } from '@faker-js/faker';

describe('ChatRoom', () => {
  let instance: ChatRoom;

  beforeEach(() => {
    instance = createMockChatRoom();
  });

  it('should be a real instance of ChatRoom', () => {
    expect(instance).toBeInstanceOf(ChatRoom);
  });

  it('should have properties defined', () => {
    expect(instance.closed).toBeDefined();
    expect(instance.closed).toBe(false);
    expect(instance.lastActive).toBeDefined();
    expect(typeof instance.lastActive).toBe('object');
    expect(instance.peers).toBeDefined();
    expect(typeof instance.peers).toBe('object');
    expect(instance.blocked).toBeDefined();
    expect(typeof instance.blocked).toBe('object');
    expect(instance.unviewedMsgsLength).toBeDefined();
    expect(typeof instance.unviewedMsgsLength).toBe('number');
    expect(instance.type).toBeDefined();
    expect(typeof instance.type).toBe('string');
    expect(instance.extras).toBeUndefined();
  });

  it('should have constructor defined', () => {
    expect(instance.constructor).toBeDefined();
  });

  it('#update should update the room by adding peer to the room', () => {
    const spy = vi.spyOn(instance, 'update');
    const newRoomVals = createMockChatRoom();
    const initialPeerlong = instance.peers.length;
    instance.update(newRoomVals, true);
    expect(spy).toHaveBeenCalled();
    expect(instance.peers).toBeDefined();
    expect(instance.peers.length).toBeGreaterThanOrEqual(0);
    expect(instance.createTime).toBe(newRoomVals.createTime);
    expect(instance.lastActive).toBe(newRoomVals.lastActive);
    expect(instance.peers.length).toBe(newRoomVals.peers.length + initialPeerlong);
    expect(instance.peers[initialPeerlong]).toStrictEqual(newRoomVals.peers[0]);
  });

  it('#update should update the room by updating peer in the room', () => {
    const spy = vi.spyOn(instance, 'update');
    const initialPeerlong = instance.peers.length;
    const newRoomVals = createMockChatRoom();
    instance.peers = [...newRoomVals.peers];
    instance.update(newRoomVals, false);
    expect(spy).toHaveBeenCalled();
    expect(instance.peers).toBeDefined();
    expect(instance.createTime).toBe(newRoomVals.createTime);
    expect(instance.lastActive).toBe(newRoomVals.lastActive);
    expect(instance.peers.length).toBe(initialPeerlong - 1);
  });

  it('#getParticipants should return peers in the room', () => {
    const newRoomVals = createMockChatRoom();
    instance.peers = [...newRoomVals.peers];
    const peers = instance.getParticipants();
    expect(peers.length).toBeGreaterThan(0);
    expect(peers.length).toBe(instance.peers.length);
    expect(typeof peers).toBe('object');
    expect(peers[0]).toHaveProperty('id');
  });

  it('#getPeerInfo should return the desired peer info given the id', () => {
    const newRoomVals = createMockChatRoom();
    instance.peers = [...newRoomVals.peers];
    const peerInfo = instance.getPeerInfo(newRoomVals.peers[0].id);
    expect(peerInfo).toStrictEqual(newRoomVals.peers[0]);
  });

  it('#getPeerInfo should fail to return the desired peer id does not exits in peers', () => {
    const newRoomVals = createMockChatRoom();
    instance.peers = [...newRoomVals.peers];
    const peerInfo = instance.getPeerInfo(faker.string.uuid());
    expect(peerInfo).toBeNull();
  });
});


describe('ChatMsg', () => {
  let instance: ChatMsg;

  beforeEach(() => {
    instance = createMockChatMsg();
  });

  it('its real instance of ChatMsg', () => {
    expect(instance).toBeInstanceOf(ChatMsg);
  });

  it('should have methods defined', () => {
    expect(instance.roomId).toBeDefined();
    expect(instance.msg).toBeDefined();
    expect(instance.who).toBeDefined();
    expect(instance.status).toBeDefined();
    expect(instance.deleted).toBeDefined();
    // all must be partner due to no id
    expect(instance.peerInfo).toBeDefined();
    expect(instance.peerInfo).toHaveProperty('id');
    expect(typeof instance.who).toBe('string');
    expect(instance.who).toBe('partner');
  });
});

class TestChatBase
  extends Chat {
  constructor(data) {
    super(data);
  }
}

describe('ChatMsg', () => {
  let instance: TestChatBase;

  beforeEach(()=> {
    const data = {
      id: faker.string.uuid(),
      createTime: faker.date.past()
    };
    instance = new TestChatBase(data);
  });

  it('should have the props as expected', () => {
    expect(typeof instance.id).toBe('string');
    expect(instance.id).toBeDefined();
    expect(typeof instance.createTime).toBe(Date);
    expect(instance.createTime).toBeDefined();
  });
});

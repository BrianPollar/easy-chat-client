import { expect, describe, beforeEach, it } from 'vitest';
import { ChatRoom, ChatMsg, createMockChatMsg, createMockChatRoom } from '../../../src/defines/chat-room.define';
import { faker } from '@faker-js/faker';

describe('ChatRoom', () => {
  let instance: ChatRoom;

  beforeEach(() => {
    instance = createMockChatRoom();
  });

  it('should be a real instance of ChatRoom', () => {
    expect(instance).toBeInstanceOf(ChatRoom);
  });

  it('should have properties undefined', () => {
    expect(instance.lastActive).toBeUndefined();
    expect(instance.lastActive).toBe(typeof Date);
    expect(instance.peers).toBeUndefined();
    expect(instance.peers).toBe(typeof Array.isArray);
    expect(instance.blocked).toBeUndefined();
    expect(instance.blocked).toBe(typeof Array.isArray);
    expect(instance.unviewedMsgsLength).toBeUndefined();
    expect(instance.unviewedMsgsLength).toBe(typeof Number);
    expect(instance.type).toBeUndefined();
    expect(instance.type).toBe(typeof 'string');
    expect(instance.extras).toBeUndefined();
  });

  it('should have properties defined', () => {
    expect(instance.closed).toBeDefined();
    expect(instance.closed).toBe(false);
  });

  it('should have constructor defined', () => {
    expect(instance.constructor).toBeDefined();
  });

  it('#update should update the room', () => {
    const newRoomVals = createMockChatRoom();
    instance.update(newRoomVals, true);
    expect(instance.createTime).toBe(newRoomVals.createTime);
    expect(instance.lastActive).toBe(newRoomVals.lastActive);
  });

  it('#getParticipants should return peers in the room', () => {
    const peers = instance.getParticipants();
    expect(peers).toHaveProperty('length');
    expect(typeof peers).toBe('array');
  });

  it('#getPeerInfo should return the desired peer info given the id', () => {
    const peerInfo = instance.getPeerInfo(faker.string.uuid());
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

  it('should have methods undefined', () => {
    expect(instance.roomId).toBeUndefined();
    expect(instance.msg).toBeUndefined();
    expect(instance.who).toBeUndefined();
    expect(instance.status).toBeUndefined();
    expect(instance.deleted).toBeUndefined();
  });
});

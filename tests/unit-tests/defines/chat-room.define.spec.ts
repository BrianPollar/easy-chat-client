import { expect, describe, beforeEach, it } from 'vitest';
import { ChatRoom, ChatMsg, createChatRoom, createMockChatMsg } from '../../../src/defines/chat-room.define';

describe('ChatRoom', () => {
  let instance: ChatRoom;

  beforeEach(() => {
    instance = createChatRoom();
  });

  it('should be a real instance of ChatRoom', () => {
    expect(instance).toBeInstanceOf(ChatRoom);
  });

  it('should have methods undefined', () => {
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

  it('should have methods defined', () => {
    expect(instance.closed).toBeDefined();
    expect(instance.closed).toBe(false);
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

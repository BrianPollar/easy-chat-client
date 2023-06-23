import { vi, expect, describe, beforeEach, it } from 'vitest';
import { ChatRoom, ChatMsg, createChatRoom, createMockChatMsg } from '../../../src/defines/chat-room.define';

describe('ChatRoom', () => {
  let instance: ChatRoom;

  beforeEach(() => {
    instance = createChatRoom();
  });


  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(AuthController);
  });

  it('check authenticated', () => {
    expect(instance.isLoggedIn).toBe(false);
  });

  it('chech confirm enabled', () => {
    expect(instance.confirmEnabled).toBe(false);
  });

  it('should get the current stockAuthClientInstance', () => {
    expect(stockAuthClientInstance).toBeInstanceOf(StockAuthClient);
    expect(StockAuthClient.ehttp).toBeDefined();
    expect(StockAuthClient.logger).toBeDefined();
  });

  it('should login user', async() => {
    expect(await instance.login(userInfo as any)).toStrictEqual(mockValue);
  });

  it('should recover user', async() => {
    expect(await instance.recover(userInfo as any)).toStrictEqual(mockValue);
  });

  it('should confirm user', async() => {
    expect(await instance.confirm(userInfo as any, '/')).toStrictEqual(mockValue);
  });

  it('should make socialLogin', async() => {
    expect(await instance.socialLogin(userInfo as any)).toStrictEqual(mockValue);
  });
});


describe('ChatMsg', () => {
  let instance: ChatMsg;

  beforeEach(() => {
    instance = createMockChatMsg();
  });


  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(AuthController);
  });

  it('check authenticated', () => {
    expect(instance.isLoggedIn).toBe(false);
  });

  it('chech confirm enabled', () => {
    expect(instance.confirmEnabled).toBe(false);
  });

  it('should get the current stockAuthClientInstance', () => {
    expect(stockAuthClientInstance).toBeInstanceOf(StockAuthClient);
    expect(StockAuthClient.ehttp).toBeDefined();
    expect(StockAuthClient.logger).toBeDefined();
  });

  it('should login user', async() => {
    expect(await instance.login(userInfo as any)).toStrictEqual(mockValue);
  });

  it('should recover user', async() => {
    expect(await instance.recover(userInfo as any)).toStrictEqual(mockValue);
  });

  it('should confirm user', async() => {
    expect(await instance.confirm(userInfo as any, '/')).toStrictEqual(mockValue);
  });

  it('should make socialLogin', async() => {
    expect(await instance.socialLogin(userInfo as any)).toStrictEqual(mockValue);
  });
});

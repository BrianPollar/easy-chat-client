import { vi, expect, describe, beforeEach, it } from 'vitest';
import { initEasyChat } from '../src/websocket';
import { faker } from '@faker-js/faker';
import { EasyChatController } from '../src/controllers/chat.controller';
import { EasyChatClient } from '../src/websocket';

describe('AuthController', () => {
  let easyChatClientInstance: EasyChatClient;
  let easyChatControllerInstance: EasyChatController;

  beforeEach(() => {
    const { easyChatClient, easyChatController } = initEasyChat(
      '/',
      faker.string.uuid(),
      faker.internet.userName(),
      faker.image.avatar()
    );

    easyChatClientInstance = easyChatClient;
    easyChatControllerInstance = easyChatController;
  });


  it('its real instance of EasyChatClient', () => {
    expect(easyChatClientInstance).toBeInstanceOf(EasyChatClient);
  });

  it('its real instance of EasyChatController', () => {
    expect(easyChatControllerInstance).toBeInstanceOf(EasyChatController);
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

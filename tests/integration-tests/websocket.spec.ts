import { expect, describe, beforeEach, it } from 'vitest';
import { initEasyChat } from '../../src/websocket';
import { faker } from '@faker-js/faker';
import { EasyChatController } from '../../src/controllers/chat.controller';
import { EasyChatClient } from '../../src/websocket';
import { createServer } from 'http';
import { Server } from 'socket.io';

export const constructServer = () => {
  const httpServer = createServer();
  const io = new Server(httpServer);
  return { io };
};

export const constructClient = () => {
  const io = constructServer();
  const { easyChatClient, easyChatController } = initEasyChat(
    '/',
    faker.string.uuid(),
    faker.internet.userName(),
    faker.image.avatar()
  );

  return { easyChatClient, easyChatController, io };
};

describe('Websocket', () => {
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
});

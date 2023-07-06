/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it, afterEach } from 'vitest';
import { faker } from '@faker-js/faker';
import { EasyChatClient } from '../../src/websocket';
import { Socket } from 'socket.io-client';
import { IchatEvent } from '../../src/controllers/eventbus.controller';
import { ECHATMETHOD } from '../../src/enums/chat.enum';

const socketMock = {
  disconnect: vi.fn(),
  connected: true,
  emit: vi.fn(),
  disconnected: false,
  on: vi.fn()
} as unknown as Socket;

describe('EasyChatClient', () => {
  let instance: EasyChatClient;
  const url = 'http://localhost:4000';
  const id = faker.string.uuid();
  let val: IchatEvent;
  let sub;

  beforeEach(() => {
    instance = new EasyChatClient(url, id);
    // @ts-ignore
    instance.socket = socketMock;
    sub = instance.eventbus.chat$
      .subscribe(sub => {
        val = sub;
      });
  });

  afterEach(() => {
    sub.unsubscribe();
  });

  it('its real instance of EasyChatClient', () => {
    expect(instance).toBeInstanceOf(EasyChatClient);
  });

  it('should have static properties undefined', () => {
    expect(EasyChatClient.mode).toBeUndefined();
  });

  it('should have methods defined', () => {
    expect(instance.activeUsers).toBeDefined();
  });

  it('#roomCreated should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.roomCreated(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.ROOM_CREATED);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#chatMessage should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.chatMessage(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.CHAT_MESSAGE);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#deleteMessage should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.deleteMessage(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.DELETE_MESSAGE);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#newPeer should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.newPeer(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.NEW_PEER);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#newMainPeer should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.newMainPeer(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.NEW_MAIN_PEER);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#peerClosed should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.peerClosed(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.PEER_CLOSE);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#mainPeerClosed should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.mainPeerClosed(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.MAIN_PEER_CLOSE);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#updateStatus should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.updateStatus(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.UPDATE_STATUS);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#updatePeer should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.updatePeer(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.PEER_UPDATE);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#updateRoom should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.updateRoom(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.UPDATE_ROOM);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#updateRoomOnNew should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.updateRoomOnNew(data);
    expect(val).toBeDefined();
    expect(val.type).toBe(ECHATMETHOD.UPDATE_ROOMS_ON_NEW);
    expect(typeof val.data).toBe('object');
    expect(val.data).toStrictEqual(data);
  });

  it('#currSocket should ', () => {
    const currSoc = instance.currSocket;
    expect(currSoc).toBeDefined();
  });

  it('#isSocketConnected should ', () => {
    const bully = instance.isSocketConnected();
    expect(bully).toBeDefined();
    expect(typeof bully).toBe('boolean');
  });

  it('#disconectSocket should ', () => {
    const disconnectSpy = vi.spyOn(instance.currSocket, 'disconnect');
    instance.disconectSocket();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('#connect should ', () => {
    // @ts-ignore
    const evhandlerSpy = vi.spyOn(instance, 'setupEventHandler');
    // @ts-ignore
    const notifSpy = vi.spyOn(instance, 'setupNotificationHandler');
    instance.connect();
    expect(evhandlerSpy).toHaveBeenCalled();
    expect(notifSpy).toHaveBeenCalled();
  });

  it('#sendRequest should ', async() => {
    // @ts-ignore
    vi.spyOn(instance.socket, 'sendOnlineSoloRequest')
      .mockImplementationOnce(() => null);
    const tcbSpy = vi.spyOn(instance, 'timeoutCallback');

    const sent = await instance.sendRequest('met', 'data');
    expect(tcbSpy).toHaveBeenCalled();
  });

  it('#sendOnlineSoloRequest should ', async() => {
    await instance.sendOnlineSoloRequest('method', 'data');
  });

  it('#timeoutCallback should ', async() => {
    await instance.timeoutCallback();
  });

  it('#disconnect should ', () => {
    instance.disconnect();
  });

  it('#setupEventHandler should ', () => {
    // @ts-ignore
    instance.setupEventHandler;
  });

  it('#setupNotificationHandler should ', () => {
    instance.setupNotificationHandler();
  });
});

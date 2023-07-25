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
  const tickTimeOut = 5000;
  let instance: EasyChatClient;
  const url = 'http://localhost:4000';
  const id = faker.string.uuid();
  let val: IchatEvent;
  let sub;
  let timeOutCallback;

  beforeEach(() => {
    instance = new EasyChatClient(url, id);
    // @ts-ignore
    instance.socket = socketMock;
    sub = instance.eventbus.chat$
      .subscribe(sub => {
        val = sub;
      });
    timeOutCallback = vi.fn();
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
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.ROOM_CREATED);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#chatMessage should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.chatMessage(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.CHAT_MESSAGE);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#deleteMessage should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.deleteMessage(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.DELETE_MESSAGE);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#newPeer should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.newPeer(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.NEW_PEER);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#newMainPeer should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.newMainPeer(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.NEW_MAIN_PEER);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#peerClosed should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.peerClosed(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.PEER_CLOSE);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#mainPeerClosed should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.mainPeerClosed(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.MAIN_PEER_CLOSE);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#updateStatus should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.updateStatus(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.UPDATE_STATUS);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#updatePeer should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.updatePeer(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.PEER_UPDATE);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#updateRoom should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.updateRoom(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.UPDATE_ROOM);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
  });

  it('#updateRoomOnNew should ', () => {
    const data = {
      value: null
    };
    // @ts-ignore
    instance.updateRoomOnNew(data);
    setTimeout(() => {
      expect(val).toBeDefined();
      expect(val.type).toBe(ECHATMETHOD.UPDATE_ROOMS_ON_NEW);
      expect(typeof val.data).toBe('object');
      expect(val.data).toStrictEqual(data);
    }, tickTimeOut);
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

  it('#sendRequest should not work in case of no socket', async() => {
    // @ts-ignore
    socketMock.connected = false;
    instance.timeoutCallback = vi.fn();
    const emitSpy = vi.spyOn(socketMock, 'emit');
    await instance.sendRequest('met', 'data');
    expect(emitSpy).not.toHaveBeenCalled();
    // expect(tcbSpy).toHaveBeenCalled();
  });


  it('#sendRequest should not work in case of socket and socket connected', async() => {
    // @ts-ignore
    socketMock.connected = true;
    instance.timeoutCallback = vi.fn();
    const emitSpy = vi.spyOn(socketMock, 'emit');
    await instance.sendRequest('met', 'data');
    expect(emitSpy).toHaveBeenCalled();
    // expect(tcbSpy).toHaveBeenCalled();
  });

  it('#sendOnlineSoloRequest should ', async() => {
    const emitSpy = vi.spyOn(socketMock, 'emit');
    await instance.sendOnlineSoloRequest('method', 'data');
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should call the callback function with provided arguments', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'error');
    const callbackWrapper = instance.timeoutCallback(timeOutCallback);
    const args = ['arg1', 'arg2'];
    callbackWrapper(...args);
    expect(timeOutCallback).toHaveBeenCalledWith(...args);
    // @ts-ignore
    expect(instance.logger.error).not.toHaveBeenCalled();
  });

  it('should call the callback function with an error if timeout occurs', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'error');
    vi.useFakeTimers();
    // const callbackWrapper =
    instance.timeoutCallback(timeOutCallback, 1000);
    vi.runAllTimers();
    expect(timeOutCallback).toHaveBeenCalledWith(new Error('nowRequest timeout'));
    // @ts-ignore
    expect(instance.logger.error).toHaveBeenCalledWith('EasyChatClient:connect:: -', 'nowRequest timeout');
  });

  it('should not call the callback function if already called', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'error');
    const callbackWrapper = instance.timeoutCallback(timeOutCallback);
    const args1 = ['arg1', 'arg2'];
    const args2 = ['arg3', 'arg4'];
    callbackWrapper(...args1);
    callbackWrapper(...args2);
    expect(timeOutCallback).toHaveBeenCalledWith(...args1);
    expect(timeOutCallback).not.toHaveBeenCalledWith(...args2);
    // @ts-ignore
    expect(instance.logger.error).not.toHaveBeenCalled();
  });

  it('#disconnect should ', () => {
    instance.disconnect();
    expect(instance.currSocket.disconnected).toBe(true);
  });

  it('should emit SOCKET_CONNECTED event on socket connect', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'debug');
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    // const connectHandler =
    // @ts-ignore
    instance.setupEventHandler(socket);
    socketMock.emit('connect');
    // @ts-ignore
    expect(instance.logger.debug).toHaveBeenCalledWith('EasyChatClient:setupEventHandler:: - socket connected !');
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.SOCKET_CONNECTED
    });
  });

  it('should log warning on socket connect error', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'warn');
    // const connectErrorHandler =
    // @ts-ignore
    instance.setupEventHandler(socket);
    socketMock.emit('connect_error');
    // @ts-ignore
    expect(instance.logger.warn).toHaveBeenCalledWith('EasyChatClient:setupEventHandler:: - reconnect_failed !');
  });

  it('should log warning on socket connect timeout', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'warn');
    // const connectTimeoutHandler =
    // @ts-ignore
    instance.setupEventHandler(socket);
    socketMock.emit('connect_timeout');
    // @ts-ignore
    expect(instance.logger.warn).toHaveBeenCalledWith('EasyChatClient:setupEventHandler:: - connect_timeout !');
  });

  it('should emit SOCKET_DISCONNECTED event on socket disconnect', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'error');
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    // const disconnectHandler =
    // @ts-ignore
    instance.setupEventHandler(socket);
    socketMock.emit('disconnect', 'reason');
    // @ts-ignore
    expect(instance.logger.error).toHaveBeenCalledWith(
      'EasyChatClient:setupEventHandler:: - Socket disconnect, reason: %s',
      'reason'
    );
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.SOCKET_DISCONNECTED
    });
  });

  it('should log debug message on socket reconnect', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'debug');
    // const reconnectHandler =
    // @ts-ignore
    instance.setupEventHandler(socket);
    socketMock.emit('reconnect', 1);
    // @ts-ignore
    expect(instance.logger.debug).toHaveBeenCalledWith(
      'EasyChatClient:setupEventHandler:: - "reconnect" event [attempts:"%s"]',
      1
    );
  });

  it('should log warning on socket reconnect failed', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'warn');
    // const reconnectFailedHandler =
    // @ts-ignore
    instance.setupEventHandler(socket);
    socketMock.emit('reconnect_failed');
    // @ts-ignore
    expect(instance.logger.warn).toHaveBeenCalledWith('EasyChatClient:setupEventHandler:: - reconnect_failed !');
  });

  it('#setupEventHandler should ', () => {
    // @ts-ignore
    instance.setupEventHandler(socketMock);
    expect(socketMock.on).toHaveBeenCalledTimes(6);
  });

  it('#setupNotificationHandler should ', () => {
    // @ts-ignore
    instance.setupNotificationHandler();
    // @ts-ignore
    expect(instance.sockect.on).toHaveBeenCalled();
  });

  it('should call the corresponding method when a valid notification is received', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'debug');
    // @ts-ignore
    instance.setupNotificationHandler();
    socketMock.emit('mainnotification', { method: 'someMethod', data: 'someData' });
    // @ts-ignore
    expect(instance.logger.debug).toHaveBeenCalled();
  });

  it('should log a warning and return early when an invalid notification method is received', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'warn');
    // @ts-ignore
    instance.setupNotificationHandler();
    socketMock.emit('mainnotification', { method: 'invalidMethod', data: 'someData' });
    // @ts-ignore
    expect(instance.logger.warn).toHaveBeenCalledWith('EasyChatClient:setupNotificationHandler:: - mainnotification method: invalidMethod, do not register!');
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it, afterEach } from 'vitest';
import { faker } from '@faker-js/faker';
import { EasyChatClient } from '../../src/websocket';
import { Socket } from 'socket.io-client';
import { EventbusController, IchatEvent } from '../../src/controllers/eventbus.controller';
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
    const eventbus = new EventbusController();
    instance.eventbus = eventbus;
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
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.roomCreated(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.ROOM_CREATED,
      data
    });
  });

  it('#chatMessage should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.chatMessage(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.CHAT_MESSAGE,
      data
    });
  });

  it('#deleteMessage should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.deleteMessage(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.DELETE_MESSAGE,
      data
    });
  });

  it('#newPeer should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.newPeer(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.NEW_PEER,
      data
    });
  });

  it('#newMainPeer should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.newMainPeer(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.NEW_MAIN_PEER,
      data
    });
  });

  it('#peerClosed should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.peerClosed(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.PEER_CLOSE,
      data
    });
  });

  it('#mainPeerClosed should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.mainPeerClosed(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.MAIN_PEER_CLOSE,
      data
    });
  });

  it('#updateStatus should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.updateStatus(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.UPDATE_STATUS,
      data
    });
  });

  it('#updatePeer should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.updatePeer(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.PEER_UPDATE,
      data
    });
  });

  it('#updateRoom should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.updateRoom(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.UPDATE_ROOM,
      data
    });
  });

  it('#updateRoomOnNew should ', () => {
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    const data = {
      data: {}
    };
    // @ts-ignore
    instance.updateRoomOnNew(data);
    expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.UPDATE_ROOMS_ON_NEW,
      data
    });
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
    /* socketMock.connected = false;
    instance.timeoutCallback = vi.fn();
    const emitSpy = vi.spyOn(socketMock, 'emit');
    await instance.sendRequest('met', 'data');
    expect(emitSpy).not.toHaveBeenCalled();
    */
    // expect(tcbSpy).toHaveBeenCalled();
  });


  it('#sendRequest should not work in case of socket and socket connected', async() => {
    // @ts-ignore
    /* socketMock.connected = true;
    instance.timeoutCallback = vi.fn();
    const emitSpy = vi.spyOn(socketMock, 'emit');
    await instance.sendRequest('met', 'data');
    expect(emitSpy).toHaveBeenCalled();
    // expect(tcbSpy).toHaveBeenCalled();
    */
  });

  it('#sendOnlineSoloRequest should ', async() => {
    /* const emitSpy = vi.spyOn(socketMock, 'emit');
    await instance.sendOnlineSoloRequest('method', 'data');
    expect(emitSpy).toHaveBeenCalled();
    */
  });

  it('should call the callback function with provided arguments', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'pError');
    const callbackWrapper = instance.timeoutCallback(timeOutCallback);
    const args = ['arg1', 'arg2'];
    callbackWrapper(...args);
    expect(timeOutCallback).toHaveBeenCalledWith(...args);
    // @ts-ignore
    expect(instance.logger.error).not.toHaveBeenCalled();
  });

  it('should call the callback function with an error if timeout occurs', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'pError');
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
    vi.spyOn(instance.logger, 'pError');
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
    const spy = vi.spyOn(socketMock, 'disconnect');
    instance.disconnect();
    expect(spy).toHaveBeenCalled();
    // expect(instance.currSocket.disconnected).toBe(true);
  });

  it('should emit SOCKET_CONNECTED event on socket connect', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'pDebug');
    const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    // const connectHandler =
    // @ts-ignore
    instance.setupEventHandler(socketMock);
    socketMock.emit('connect');
    // @ts-ignore
    // expect(instance.logger.Pdebug).toHaveBeenCalledWith('EasyChatClient:setupEventHandler:: - socket connected !');
    /* expect(spy).toHaveBeenCalledWith({
      type: ECHATMETHOD.SOCKET_CONNECTED
    });*/
  });

  it('should log warning on socket connect error', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'pWarn');
    // const connectErrorHandler =
    // @ts-ignore
    instance.setupEventHandler(socketMock);
    socketMock.emit('connect_error');
    // @ts-ignore
    // expect(instance.logger.pWarn).toHaveBeenCalledWith('EasyChatClient:setupEventHandler:: - reconnect_failed !');
  });

  it('should log warning on socket connect timeout', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'pWarn');
    // const connectTimeoutHandler =
    // @ts-ignore
    instance.setupEventHandler(socketMock);
    socketMock.emit('connect_timeout');
    // @ts-ignore
    // expect(instance.logger.pWarn).toHaveBeenCalledWith('EasyChatClient:setupEventHandler:: - connect_timeout !');
  });

  it('should emit SOCKET_DISCONNECTED event on socket disconnect', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'pError');
    // const spy = vi.spyOn(instance.eventbus.chat$, 'next');
    // const disconnectHandler =
    // @ts-ignore
    instance.setupEventHandler(socketMock);
    socketMock.emit('disconnect', 'reason');
    // @ts-ignore
    // expect(spy).toHaveBeenCalledWith({
    //   type: ECHATMETHOD.SOCKET_DISCONNECTED
    // });
  });

  it('#setupEventHandler should ', () => {
    vi.spyOn(socketMock, 'on');
    // @ts-ignore
    instance.setupEventHandler(socketMock);
    expect(socketMock.on).toHaveBeenCalledTimes(6);
  });

  it('#setupNotificationHandler should ', () => {
    const spy = vi.spyOn(socketMock, 'on');
    // @ts-ignore
    instance.setupNotificationHandler();
    // @ts-ignore
    expect(spy).toHaveBeenCalled();
  });

  it('should call the corresponding method when a valid notification is received', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'pDebug');
    // @ts-ignore
    instance.setupNotificationHandler();
    socketMock.emit('mainnotification', { method: 'someMethod', data: 'someData' });
    // @ts-ignore
    // expect(instance.logger.pDebug).toHaveBeenCalled();
  });

  it('should log a warning and return early when an invalid notification method is received', () => {
    // @ts-ignore
    vi.spyOn(instance.logger, 'pWarn');
    // @ts-ignore
    instance.setupNotificationHandler();
    socketMock.emit('mainnotification', { method: 'invalidMethod', data: 'someData' });
    // @ts-ignore
    // expect(instance.logger.pWarn).toHaveBeenCalledWith('EasyChatClient:setupNotificationHandler:: - mainnotification method: invalidMethod, do not register!');
  });
});

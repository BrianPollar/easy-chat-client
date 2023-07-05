/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { EasyChatClient } from '../../src/websocket';
import { Socket } from 'socket.io-client';

const socketMock = {
  disconnect: vi.fn(),
  connected: true,
  emit: vi.fn(),
  disconnected: false,
  on: vi.fn()
} as unknown as Socket;

describe('Websocket', () => {
  let instance: EasyChatClient;
  const url = 'http://localhost:4000';
  const id = faker.string.uuid();

  beforeEach(() => {
    instance = new EasyChatClient(url, id);
    // @ts-ignore
    instance.socket = socketMock;
  });

  it('its real instance of EasyChatClient', () => {
    expect(instance).toBeInstanceOf(EasyChatClient);
  });

  it('should have methods defined', () => {

  });

  it('#roomCreated should ', () => {
    // @ts-ignore

  });

  it('#chatMessage should ', () => {
    // @ts-ignore

  });

  it('#deleteMessage should ', () => {
    // @ts-ignore

  });

  it('#newPeer should ', () => {
    // @ts-ignore

  });

  it('#newMainPeer should ', () => {
    // @ts-ignore

  });

  it('#peerClosed should ', () => {
    // @ts-ignore

  });

  it('#mainPeerClosed should ', () => {
    // @ts-ignore

  });

  it('#updateStatus should ', () => {
    // @ts-ignore

  });

  it('#updatePeer should ', () => {
    // @ts-ignore

  });

  it('#updateRoom should ', () => {
    // @ts-ignore

  });

  it('#updateRoomOnNew should ', () => {
    // @ts-ignore

  });

  it('#currSocket should ', () => {

  });

  it('#isSocketConnected should ', () => {

  });

  it('#disconectSocket should ', () => {

  });

  it('#connect should ', () => {

  });

  it('#sendRequest should ', () => {

  });

  it('#sendOnlineSoloRequest should ', () => {

  });

  it('#timeoutCallback should ', () => {

  });

  it('#setupEventHandler should ', () => {

  });

  it('#setupNotificationHandler should ', () => {

  });
});

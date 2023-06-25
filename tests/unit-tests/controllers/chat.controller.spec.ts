import { expect, describe, beforeEach, it, afterAll } from 'vitest';
import { EasyChatController } from '../../../src/controllers/chat.controller';
import { EasyChatClient, initEasyChat } from '../../../src/websocket';
import { faker } from '@faker-js/faker';
import { constructClient } from '../../integration-tests/websocket.spec';
import { Server } from 'socket.io';

describe('ChatController', () => {
  let instance: EasyChatController;
  let easyChatClientInstance: EasyChatClient;
  let serverSocket: Server;


  beforeEach((done: any) => {
    const { easyChatClient, easyChatController, io } = constructClient();
    instance = easyChatController;
    easyChatClientInstance = easyChatClient;
    easyChatClientInstance.connect();
  });

  afterAll(() => {
    easyChatClientInstance.disconnect();
    serverSocket.close();
  });


  it('its real instance of EasyChatController', () => {
    expect(instance).toBeInstanceOf(EasyChatController);
  });

  it('its real instance of EasyChatClient', () => {
    expect(easyChatClientInstance).toBeInstanceOf(EasyChatClient);
  });

  it('should have props undefined', () => {
    expect(instance.activeRoom).toBeUndefined();
  });

  it('should have props defined', () => {
    expect(instance.messages).toBeDefined();
    expect(instance.toPeer).toBeDefined();
    expect(instance.destroyed$).toBeDefined();
  });

  it('should return peer info', () => {
    const peerInfo = instance.determinLocalPeerInfo();
    expect(peerInfo).toHaveProperty('id');
    expect(peerInfo.online).toBe(true);
  });

  it('should join room', async() => {
    expect(await instance.joinRoom()).toHaveBeenCalled();
  });

  it('should joinMainRoom', async() => {
    expect(await instance.joinMainRoom()).toHaveBeenCalled();
  });

  it('should send message', () => {
    const message = faker.string.alphanumeric();
    expect(instance.send(message)).toHaveBeenCalled();
  });

  it('should update message status', () => {
    const status = 'sent';
    const chatMsgInstance = instance.messages[0];
    expect(instance.updateStatus(status, chatMsgInstance)).toHaveBeenCalled();
  });

  it('should make delete or restore message', () => {
    const id = instance.messages[0].id;
    expect(instance.deleteRestoreMesage(id, true)).toHaveBeenCalled();
  });

  it('should send a close peer request', () => {
    expect(instance.sendClosePeer(true)).toHaveBeenCalled();
  });

  it('should make update peer request', () => {
    const peerInfo = instance.activeRoom.peers[0];
    expect(instance.updatePeer(peerInfo)).toHaveBeenCalled();
  });

  it('should update room', () => {
    const roomData = instance.activeRoom;
    expect(instance.updateRoom(roomData, true)).toHaveBeenCalled();
  });

  it('should make clear room', () => {
    expect(instance.clearRoom()).toHaveBeenCalled();
  });
});

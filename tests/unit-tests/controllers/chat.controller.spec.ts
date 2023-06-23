import { vi, expect, describe, beforeEach, it } from 'vitest';
import { EasyChatController } from '../../../src/controllers/chat.controller';
import { initEasyChat } from '../../../src/websocket';
import { faker } from '@faker-js/faker';

describe('ChatController', () => {
  let instance: EasyChatController;


  beforeEach(() => {
    const { easyChatClient, easyChatController } = initEasyChat(
      '/',
      faker.string.uuid(),
      faker.internet.userName(),
      faker.image.avatar()
    );
    instance = easyChatController;
  });


  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(EasyChatController);
  });

  it('it should have props undefined', () => {
    expect(instance.activeRoom).toBeUndefined();
  });

  it('it should have props defined', () => {
    expect(instance.messages).toBeDefined();
    expect(instance.toPeer).toBeDefined();
    expect(instance.destroyed$).toBeDefined();
  });

  it('it should return perri info', () => {
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

  it('send message', () => {
    const message = faker.string.alphanumeric();
    expect(instance.send(message)).toHaveBeenCalled();
  });

  it('should updateStatus', () => {
    const status = 'sent';
    const chatMsgInstance = instance.messages[0];
    expect(instance.updateStatus(status, chatMsgInstance)).toHaveBeenCalled();
  });

  it('should make deleteRestoreMesage', () => {
    const id = instance.messages[0].id;
    expect(instance.deleteRestoreMesage(id, true)).toHaveBeenCalled();
  });

  it('should sendClosePeer', () => {
    expect(instance.sendClosePeer(true)).toHaveBeenCalled();
  });

  it('should make updatePeer', () => {
    const peerInfo = instance.activeRoom.peers[0];
    expect(instance.updatePeer(peerInfo)).toHaveBeenCalled();
  });

  it('should updateRoom', () => {
    const roomData = instance.activeRoom;
    expect(instance.updateRoom(roomData, true)).toHaveBeenCalled();
  });

  it('should make clearRoom', () => {
    expect(instance.clearRoom()).toHaveBeenCalled();
  });
});

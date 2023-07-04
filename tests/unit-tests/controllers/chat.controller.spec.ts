/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it, afterAll } from 'vitest';
import { EasyChatController } from '../../../src/controllers/chat.controller';
import { EasyChatClient } from '../../../src/websocket';
import { faker } from '@faker-js/faker';
import { constructClient } from '../../integration-tests/websocket.spec';
import { Server } from 'socket.io';
import { createMockChatRoom, createMockPeerinfo } from '../../../src/defines/chat-room.define';

describe('ChatController', () => {
  let instance: EasyChatController;
  let easyChatClientInstance: EasyChatClient;
  let serverSocket: Server;

  beforeEach((done: any) => {
    const { easyChatClient, easyChatController, io } = constructClient();
    instance = easyChatController;
    easyChatClientInstance = easyChatClient;
    easyChatClientInstance.connect();
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
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

  it('#determinLocalPeerInfo should return peer info', () => {
    const peerInfo = instance.determinLocalPeerInfo();
    expect(peerInfo).toHaveProperty('id');
    expect(peerInfo).toHaveProperty('name');
    expect(peerInfo).toHaveProperty('photo');
    expect(peerInfo).toHaveProperty('roomAdmin');
    expect(peerInfo).toHaveProperty('lastSeen');
    expect(peerInfo).toHaveProperty('online');
    expect(peerInfo).toHaveProperty('unviewedMsgsLength');
    expect(peerInfo.online).toBe(true);
  });

  it('#joinRoom should join room', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    const joined = await instance.joinRoom();
    expect(joined).toHaveProperty('joined');
    expect(joined).toHaveProperty('peers');
    expect(typeof joined).toHaveProperty('boolean');
  });

  it('#joinMainRoom should joinMainRoom', async() => {
    vi.spyOn(easyChatClientInstance, 'sendOnlineSoloRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    const joined = await instance.joinMainRoom();
    expect(joined).toHaveProperty('joined');
    expect(joined).toHaveProperty('peers');
    expect(typeof joined).toHaveProperty('boolean');
    // @ts-ignore
    expect(instance.mangeNewMainPeers).toHaveBeenCalled();
  });

  it('#joinMain should be called', async() => {
    vi.spyOn(easyChatClientInstance, 'sendOnlineSoloRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    const joined = await instance.joinMain(instance.determinLocalPeerInfo());
    expect(joined).toHaveProperty('joined');
    expect(joined).toHaveProperty('peers');
    expect(typeof joined).toHaveProperty('boolean');
    // @ts-ignore
    expect(instance.mangeNewMainPeers).toHaveBeenCalled();
  });

  it('#join should be called', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    const joined = await instance.join(instance.determinLocalPeerInfo());
    expect(joined).toHaveProperty('joined');
    expect(joined).toHaveProperty('peers');
    expect(typeof joined).toHaveProperty('boolean');
  });

  it('#send should send message', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const message = faker.string.alphanumeric();
    const sent = await instance.send(message);
    expect(sent).toBe(null);
    expect(instance.send).toHaveBeenCalled();
  });

  it('#updateStatus should update message status', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const status = 'sent';
    const chatMsgInstance = instance.messages[0];
    const updated = await instance.updateStatus(status, chatMsgInstance);
    expect(updated).toBe(true);
    expect(typeof updated).toBe('boolean');
    expect(instance.updateStatus).toHaveBeenCalled();
  });

  it('#deleteRestoreMesage should make delete or restore message', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const id = faker.string.uuid();
    const updated = await instance.deleteRestoreMesage(id, true);
    expect(updated).toBe(true);
    expect(typeof updated).toBe('boolean');
    expect(instance.deleteRestoreMesage).toHaveBeenCalled();
  });

  it('#sendClosePeer should send a close peer request', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const closed = await instance.sendClosePeer(true);
    expect(closed).toBe(null);
    expect(instance.sendClosePeer).toHaveBeenCalled();
  });

  it('#updatePeer should make update peer request', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const peerInfo = instance.activeRoom.peers[0];
    const updated = await instance.updatePeer(peerInfo);
    expect(updated).toBe(null);
    expect(instance.updatePeer).toHaveBeenCalled();
  });

  it('#updateRoom should update room', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const roomData = instance.activeRoom;
    const updated = await instance.updateRoom(roomData, true);
    expect(updated).toBe(null);
    expect(instance.updateRoom).toHaveBeenCalled();
  });

  it('#newRoom should make new room', async() => {
    vi.spyOn(easyChatClientInstance, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const newRoom = createMockChatRoom();
    const changed = await instance.newRoom(newRoom);
    expect(changed).toBe(null);
    expect(instance.activeRoom).toStrictEqual(newRoom);
    expect(instance.newRoom).toHaveBeenCalled();
  });

  it('#mangeNewMainPeers add new peers to the main room', () => {
    const peers = [createMockPeerinfo()];
    // @ts-ignore
    const madePeer = instance.mangeNewMainPeers(peers);
    // @ts-ignore
    expect(instance.mangeNewMainPeers).toHaveBeenCalled();
  });

  it('#manageMainPeerLeave should watch peers leaving room', () => {
    // @ts-ignore
    const called = instance.manageMainPeerLeave({ peerId: faker.string.uuid() });
    // @ts-ignore
    expect(instance.manageMainPeerLeave).toHaveBeenCalled();
  });

  it('#newPeer should add new peer to room', () => {
    // @ts-ignore
    const called = instance.newPeer({ id: faker.string.uuid() });
    // @ts-ignore
    expect(instance.newPeer).toHaveBeenCalled();
  });

  it('#peerClosed should change peer online status', () => {
    // @ts-ignore
    const called = instance.peerClosed({ peerId: faker.string.uuid() });
    // @ts-ignore
    expect(instance.peerClosed).toHaveBeenCalled();
  });

  it('#getPeerInfo should return peer info', () => {
    // @ts-ignore
    const info = instance.getPeerInfo(faker.string.uuid());
    // @ts-ignore
    expect(instance.getPeerInfo).toHaveBeenCalled();
  });
});

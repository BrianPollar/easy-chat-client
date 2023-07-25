/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import { EasyChatController } from '../../../src/controllers/chat.controller';
import { EasyChatClient } from '../../../src/websocket';
import { faker } from '@faker-js/faker';
import { createMockChatMsg, createMockChatMsgs, createMockChatRoom, createMockPeerinfo } from '../../../src/defines/chat-room.define';
import { EventbusController } from '../../../src/controllers/eventbus.controller';
import { IpeerInfo } from '../../../src/interfaces/chat.interface';
import { LoggerController } from '../../../src/controllers/logger.controller';
import { Subject } from 'rxjs';
import { ECHATMETHOD } from '../../../src/enums/chat.enum';
import { makeRandomString } from '../../../src/constants/makerandomstring.constant';

const websocketMock = {
  sendOnlineSoloRequest: vi.fn(),
  sendRequest: vi.fn(),
  activeUsers: new Map<string, string>(),
  isSocketConnected: vi.fn(),
  connect: vi.fn(),
  eventbus: new EventbusController()
} as unknown as EasyChatClient;

describe('ChatController', () => {
  let instance: EasyChatController;
  const myId = faker.string.uuid();
  const myNames = faker.internet.userName();
  const myPhotoUrl = faker.image.avatar();

  beforeEach(() => {
    instance = new EasyChatController(
      websocketMock,
      myId,
      myNames,
      myPhotoUrl
    );
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
  });

  it('its real instance of EasyChatController', () => {
    expect(instance).toBeInstanceOf(EasyChatController);
  });

  it('should have props as expected', () => {
    expect(instance.messages).toBeDefined();
    expect(instance.toPeer).toBeDefined();
    expect(instance.destroyed$).toBeDefined();
    expect(instance.activeRoom).toBeUndefined();
    expect(instance.logger).toBeDefined();
    expect(instance.logger).toBeInstanceOf(LoggerController);
    expect(instance.destroyed$).toBeInstanceOf(Subject);
    expect(typeof instance.toPeer).toBe('string');
    expect(typeof instance.messages).toBe('object');
    expect(instance.messages.length).toBe(0);
  });

  // testing negative side
  it('should fail to send chat message events eveery body using the aplications provided no user exists', () => {
    instance.messages = createMockChatMsgs(20);
    const event = {
      type: ECHATMETHOD.CHAT_MESSAGE,
      from: faker.string.uuid(),
      chatMessage: makeRandomString(66, 'letters'),
      to: null,
      id: faker.string.uuid(),
      createTime: new Date()
    };

    // @ts-ignore
    const spy = vi.spyOn(instance.activeRoom, 'getPeerInfo');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).not.toHaveBeenCalled();
  });

  // testing positive side
  it('should listen chat message events from every body using the aplications provided no user exists', () => {
    instance.messages = createMockChatMsgs(20);
    const originalMsgLength = instance.messages.slice().length;
    const event = {
      type: ECHATMETHOD.CHAT_MESSAGE,
      data: {
        from: faker.string.uuid(),
        chatMessage: makeRandomString(66, 'letters'),
        to: 'all',
        id: faker.string.uuid()
      }
    };
    // @ts-ignore
    const spy = vi.spyOn(instance, 'getPeerInfo');
    const spy2 = vi.spyOn(instance, 'scrollToLast');
    const spy3 = vi.spyOn(instance, 'updateStatus');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledWith('recieved', instance.messages[instance.messages.length - 1]);
    expect(instance.messages.length).toBe(originalMsgLength + 1);
  });

  // testing positive side2
  it('should listen chat message events from one person using the aplications provided no user exists', () => {
    instance.messages = createMockChatMsgs(20);
    const originalMsgLength = instance.messages.slice().length;
    const id = 'my-id';
    // @ts-ignore
    instance.myId = id;
    const event = {
      type: ECHATMETHOD.CHAT_MESSAGE,
      data: {
        from: faker.string.uuid(),
        chatMessage: makeRandomString(66, 'letters'),
        to: id,
        id: faker.string.uuid(),
        createTime: new Date()
      }
    };
    // @ts-ignore
    const spy = vi.spyOn(instance, 'getPeerInfo');
    const spy2 = vi.spyOn(instance, 'scrollToLast');
    const spy3 = vi.spyOn(instance, 'updateStatus');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledWith('recieved', instance.messages[instance.messages.length - 1]);
    expect(instance.messages.length).toBe(originalMsgLength + 1);
  });

  // negative side
  it('should perform ECHATMETHOD.DELETE_MESSAGE and fail if no id matches', () => {
    instance.messages = createMockChatMsgs(20);
    const origMessages = instance.messages.slice();
    const event = {
      type: ECHATMETHOD.DELETE_MESSAGE,
      data: {
        id: faker.string.uuid(),
        deleted: true
      }
    };
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(instance.messages).toStrictEqual(origMessages);
  });

  // positive side
  it('should perform ECHATMETHOD.DELETE_MESSAGE and pass if id matches', () => {
    instance.messages = createMockChatMsgs(20);
    const message1 = instance.messages[0];
    const event = {
      type: ECHATMETHOD.DELETE_MESSAGE,
      data: {
        id: message1.id,
        deleted: true
      }
    };
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(instance.messages[0].deleted).toBe(true);
  });

  it('should handle ECHATMETHOD.NEW_PEER', () => {
    const event = {
      type: ECHATMETHOD.NEW_PEER,
      data: {

      }
    };
    // @ts-ignore
    const spy = vi.spyOn(instance, 'newPeer');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalledWith(event.data);
  });

  it('should handle ECHATMETHOD.NEW_MAIN_PEER', () => {
    const event = {
      type: ECHATMETHOD.NEW_MAIN_PEER,
      data: {

      }
    };
    // @ts-ignore
    const spy = vi.spyOn(instance, 'mangeNewMainPeers');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalledWith(event.data);
  });

  it('should handle ECHATMETHOD.PEER_CLOSE', () => {
    const event = {
      type: ECHATMETHOD.PEER_CLOSE,
      data: {

      }
    };
    // @ts-ignore
    const spy = vi.spyOn(instance, 'peerClosed');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalledWith(event.data);
  });

  it('should handle ECHATMETHOD.MAIN_PEER_CLOSE', () => {
    const event = {
      type: ECHATMETHOD.MAIN_PEER_CLOSE,
      data: {

      }
    };
    // @ts-ignore
    const spy = vi.spyOn(instance, 'manageMainPeerLeave');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalledWith(event.data);
  });

  it('should handle ECHATMETHOD.ROOM_CREATED', () => {
    const event = {
      type: ECHATMETHOD.ROOM_CREATED,
      data: {

      }
    };
    const spy = vi.spyOn(instance, 'joinRoom');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle ECHATMETHOD.ROOM_CREATED', () => {
    const event = {
      type: ECHATMETHOD.SOCKET_CONNECTED,
      data: {

      }
    };
    const spy = vi.spyOn(instance, 'joinMainRoom');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalled();
  });

  // negative side
  it('should perform ECHATMETHOD.UPDATE_STATUS and fail if no id matches', () => {
    instance.messages = createMockChatMsgs(20);
    const origMessages = instance.messages.slice();
    const event = {
      type: ECHATMETHOD.UPDATE_STATUS,
      data: {
        id: faker.string.uuid(),
        status: 'viewed'
      }
    };
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(instance.messages).toStrictEqual(origMessages);
  });

  // positive side
  it('should perform ECHATMETHOD.UPDATE_STATUS and pass if id matches with viewed', () => {
    const spy = vi.spyOn(instance.websocket.eventbus.outEvent, 'next');
    instance.messages = createMockChatMsgs(20);
    const message1 = instance.messages[0];
    const origMessages = instance.messages.slice();
    const event = {
      type: ECHATMETHOD.UPDATE_STATUS,
      data: {
        id: message1.id,
        status: 'viewed'
      }
    };
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(message1.status).toBe('viewed');
    expect(spy).toHaveBeenCalled();
    // @ts-ignore
    if (instance.activeRoom.unviewedMsgsLength) {
      // @ts-ignore
      expect(instance.activeRoom.unviewedMsgsLength).toBe(instance.activeRoom.unviewedMsgsLength--);
    }
  });

  it('should handle ECHATMETHOD.PEER_UPDATE', () => {
    // @ts-ignore
    const peer1 = Object.assign({}, instance.activeRoom?.peers[0]);
    peer1.roomAdmin = false;

    const event = {
      type: ECHATMETHOD.PEER_UPDATE,
      data: {
        peerInfo: peer1
      }
    };
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(peer1.roomAdmin).toBe(false);
  });

  it('should handle ECHATMETHOD.UPDATE_ROOM', () => {
    const event = {
      type: ECHATMETHOD.UPDATE_ROOM,
      data: {
        roomData: createMockChatRoom(),
        add: true
      }
    };
    // @ts-ignore
    const spy = vi.spyOn(instance.activeRoom, 'update');
    instance.runSubscriptions();
    instance.websocket.eventbus.chat$.next(event);
    expect(spy).toHaveBeenCalled();
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
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo(), createMockPeerinfo()], joined: false }));
    // @ts-ignore
    const newPeerSpy = vi.spyOn(instance, 'newPeer');
    instance.activeRoom = createMockChatRoom();
    await instance.joinRoom();
    expect(newPeerSpy).toHaveBeenCalledTimes(2);
  });

  it('#joinMainRoom should joinMainRoom', async() => {
    vi.spyOn(instance.websocket, 'sendOnlineSoloRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    // @ts-ignore
    const mangeNewMainPeersSpy = vi.spyOn(instance, 'mangeNewMainPeers');
    instance.activeRoom = createMockChatRoom();
    await instance.joinMainRoom();
    expect(mangeNewMainPeersSpy).toHaveBeenCalledTimes(1);
  });

  it('#joinMain should be called', async() => {
    vi.spyOn(instance.websocket, 'sendOnlineSoloRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    // @ts-ignore
    instance.activeRoom = createMockChatRoom();
    const joined = await instance.joinMain(instance.determinLocalPeerInfo());
    expect(joined).toHaveProperty('joined');
    expect(joined).toHaveProperty('peers');
    expect(typeof joined.joined).toBe('boolean');
  });

  it('#join should be called', async() => {
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    instance.activeRoom = createMockChatRoom();
    const joined = await instance.join(instance.determinLocalPeerInfo());
    expect(joined).toHaveProperty('joined');
    expect(joined).toHaveProperty('peers');
    expect(typeof joined.joined).toBe('boolean');
  });

  it('#send should send message', async() => {
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const sendSpy = vi.spyOn(instance, 'send');
    const scrollToLastSpy = vi.spyOn(instance, 'scrollToLast');
    const message = faker.string.alphanumeric();
    const originalMsgLength = instance.messages.length;
    instance.activeRoom = createMockChatRoom();
    const sent = await instance.send(message);
    expect(sent).toBeUndefined();
    expect(instance.messages.length).toBe(originalMsgLength + 1);
    expect(scrollToLastSpy).toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalled();
    expect(instance.messages[originalMsgLength].status).toBe('sent');
  });

  it('#updateStatus should update message status', async() => {
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const updateStatusSpy = vi.spyOn(instance, 'updateStatus');
    const status = 'sent';
    instance.messages = [createMockChatMsg()];
    const chatMsgInstance = instance.messages[0];
    const updated = await instance.updateStatus(status, chatMsgInstance);
    expect(updated).toBe(true);
    expect(typeof updated).toBe('boolean');
    expect(updateStatusSpy).toHaveBeenCalled();
  });

  it('#deleteRestoreMesage should make delete or restore message', async() => {
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const deleteRestoreMesageSpy = vi.spyOn(instance, 'deleteRestoreMesage');
    const id = faker.string.uuid();
    const updated = await instance.deleteRestoreMesage(id, true);
    expect(updated).toBe(true);
    expect(typeof updated).toBe('boolean');
    expect(deleteRestoreMesageSpy).toHaveBeenCalled();
  });

  it('#sendClosePeer should send a close peer request', async() => {
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const sendClosePeerSpy = vi.spyOn(instance, 'sendClosePeer');
    const closed = await instance.sendClosePeer(true);
    expect(closed).toBeNull();
    expect(sendClosePeerSpy).toHaveBeenCalled();
  });

  it('#updatePeer should make update peer request', async() => {
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const updatePeerSpy = vi.spyOn(instance, 'updatePeer');
    instance.activeRoom = createMockChatRoom();
    const peerInfo = instance.activeRoom.peers[0];
    const updated = await instance.updatePeer(peerInfo);
    expect(updated).toBeNull();
    expect(updatePeerSpy).toHaveBeenCalled();
  });

  it('#updateRoom should update room', async() => {
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const updateRoomSpy = vi.spyOn(instance, 'updateRoom');
    const roomData = instance.activeRoom;
    const updated = await instance.updateRoom(roomData, true);
    expect(updated).toBeNull();
    expect(updateRoomSpy).toHaveBeenCalled();
  });

  it('#newRoom should make new room', async() => {
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    vi.spyOn(instance.websocket, 'isSocketConnected').mockImplementationOnce(() => true);
    const newRoomSpy = vi.spyOn(instance, 'newRoom');
    const newRoom = createMockChatRoom();
    const changed = await instance.newRoom(newRoom);
    expect(changed).toBeUndefined();
    expect(instance.activeRoom).toStrictEqual(newRoom);
    expect(newRoomSpy).toHaveBeenCalled();
  });

  it('#mangeNewMainPeers add new peers to the main room', () => {
    let val;
    const sub = instance.websocket.eventbus.userOnlineChange$
      .subscribe((sub) => {
        val = sub;
      });
    // @ts-ignore
    const mangeNewMainPeersSpy = vi.spyOn(instance, 'mangeNewMainPeers');
    const peers = [createMockPeerinfo()];
    // @ts-ignore
    instance.mangeNewMainPeers(peers);
    expect(mangeNewMainPeersSpy).toHaveBeenCalled();
    expect(val).toBe(true);
    sub.unsubscribe();
  });

  it('#manageMainPeerLeave should watch peers leaving room', () => {
    let val;
    const sub = instance.websocket.eventbus.userOnlineChange$
      .subscribe((sub) => {
        val = sub;
      });
    // @ts-ignore
    const manageMainPeerLeaveSpy = vi.spyOn(instance, 'manageMainPeerLeave');
    // @ts-ignore
    instance.manageMainPeerLeave({ peerId: faker.string.uuid() });
    // @ts-ignore
    expect(manageMainPeerLeaveSpy).toHaveBeenCalled();
    expect(val).toBe(true);
    sub.unsubscribe();
  });

  it('#newPeer should add new peer to room', () => {
    // @ts-ignore
    const newPeerSpy = vi.spyOn(instance, 'newPeer');
    instance.activeRoom = createMockChatRoom();
    // @ts-ignore
    instance.newPeer({ id: faker.string.uuid() });
    // @ts-ignore
    expect(newPeerSpy).toHaveBeenCalled();
    expect(instance.activeRoom.peers.length).toBeGreaterThan(0);
  });

  it('#peerClosed should change peer online status', () => {
    // @ts-ignore
    const peerClosedSpy = vi.spyOn(instance, 'peerClosed');
    // @ts-ignore
    const getPeerInfoSpy = vi.spyOn(instance, 'getPeerInfo');
    instance.activeRoom = createMockChatRoom();
    // @ts-ignore
    instance.peerClosed({ peerId: faker.string.uuid() });
    expect(peerClosedSpy).toHaveBeenCalled();
    expect(getPeerInfoSpy).toHaveBeenCalled();
  });

  it('#getPeerInfo should return peer info', () => {
    const peer = createMockPeerinfo();
    instance.activeRoom = createMockChatRoom();
    instance.activeRoom.peers = [peer as unknown as IpeerInfo];
    // @ts-ignore
    const getPeerInfoSpy = vi.spyOn(instance, 'getPeerInfo');
    // @ts-ignore
    const info = instance.getPeerInfo(peer.id);
    // @ts-ignore
    expect(getPeerInfoSpy).toHaveBeenCalled();
    expect(info).toStrictEqual(peer);
  });

  it('#getPeerInfo should return no peer info', () => {
    instance.activeRoom = createMockChatRoom();
    // @ts-ignore
    const getPeerInfoSpy = vi.spyOn(instance, 'getPeerInfo');
    // @ts-ignore
    const info = instance.getPeerInfo(faker.string.uuid());
    // @ts-ignore
    expect(getPeerInfoSpy).toHaveBeenCalled();
    expect(info).toBeUndefined();
  });
});

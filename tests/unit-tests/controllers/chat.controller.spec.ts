/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it, afterEach } from 'vitest';
import { EasyChatController } from '../../../src/controllers/chat.controller';
import { EasyChatClient } from '../../../src/websocket';
import { faker } from '@faker-js/faker';
import { createMockChatMsg, createMockChatRoom, createMockPeerinfo } from '../../../src/defines/chat-room.define';
import { EventbusController, IchatEvent } from '../../../src/controllers/eventbus.controller';
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
    // mocking room
    const activeRoom = createMockChatRoom();
    activeRoom.update = vi.fn().mockImplementation(() => null);
    activeRoom.getParticipants = vi.fn().mockImplementation(() => null);
    activeRoom.getPeerInfo = vi.fn().mockImplementation(() => null);
    instance.activeRoom = activeRoom;

    // vi.spyOn(exports, 'method').mockImplementation(() => { });
  });

  it('its real instance of EasyChatController', () => {
    expect(instance).toBeInstanceOf(EasyChatController);
  });

  it('should have props as expected', () => {
    expect(instance.messages).toBeDefined();
    expect(instance.toPeer).toBeDefined();
    expect(instance.destroyed$).toBeDefined();
    // expect(instance.activeRoom).toBeUndefined();
    expect(instance.logger).toBeDefined();
    expect(instance.logger).toBeInstanceOf(LoggerController);
    expect(instance.destroyed$).toBeInstanceOf(Subject);
    expect(typeof instance.toPeer).toBe('string');
    expect(typeof instance.messages).toBe('object');
    expect(instance.messages.length).toBe(0);
  });


  it('#determinLocalPeerInfo should return peer info', () => {
    instance.activeRoom = createMockChatRoom();
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
    instance.activeRoom = createMockChatRoom();
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo(), createMockPeerinfo()], joined: false }));
    // @ts-ignore
    const newPeerSpy = vi.spyOn(instance, 'newPeer');
    await instance.joinRoom();
    expect(newPeerSpy).toHaveBeenCalledTimes(2);
  });

  it('#joinMainRoom should joinMainRoom', async() => {
    instance.activeRoom = createMockChatRoom();
    vi.spyOn(instance.websocket, 'sendOnlineSoloRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    // @ts-ignore
    const mangeNewMainPeersSpy = vi.spyOn(instance, 'mangeNewMainPeers');
    await instance.joinMainRoom();
    expect(mangeNewMainPeersSpy).toHaveBeenCalledTimes(1);
  });

  it('#joinMain should be called', async() => {
    instance.activeRoom = createMockChatRoom();
    vi.spyOn(instance.websocket, 'sendOnlineSoloRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    // @ts-ignore
    const joined = await instance.joinMain(instance.determinLocalPeerInfo());
    expect(joined).toHaveProperty('joined');
    expect(joined).toHaveProperty('peers');
    expect(typeof joined.joined).toBe('boolean');
  });

  it('#join should be called', async() => {
    instance.activeRoom = createMockChatRoom();
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve({ peers: [createMockPeerinfo()], joined: false }));
    const joined = await instance.join(instance.determinLocalPeerInfo());
    expect(joined).toHaveProperty('joined');
    expect(joined).toHaveProperty('peers');
    expect(typeof joined.joined).toBe('boolean');
  });

  it('#send should send message', async() => {
    instance.activeRoom = createMockChatRoom();
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const sendSpy = vi.spyOn(instance, 'send');
    const scrollToLastSpy = vi.spyOn(instance, 'scrollToLast');
    const message = faker.string.alphanumeric();
    const originalMsgLength = instance.messages.length;
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
    instance.activeRoom = createMockChatRoom();
    vi.spyOn(instance.websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    const updatePeerSpy = vi.spyOn(instance, 'updatePeer');
    const peerInfo = instance.activeRoom.peers[0];
    const updated = await instance.updatePeer(peerInfo);
    expect(updated).toBeNull();
    expect(updatePeerSpy).toHaveBeenCalled();
  });

  it('#updateRoom should update room', async() => {
    instance.activeRoom = createMockChatRoom();
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
    instance.activeRoom = createMockChatRoom();
    // @ts-ignore
    const newPeerSpy = vi.spyOn(instance, 'newPeer');
    // @ts-ignore
    instance.newPeer({ id: faker.string.uuid() });
    // @ts-ignore
    expect(newPeerSpy).toHaveBeenCalled();
    expect(instance.activeRoom.peers.length).toBeGreaterThan(0);
  });

  it('#peerClosed should change peer online status', () => {
    instance.activeRoom = createMockChatRoom();
    // @ts-ignore
    const peerClosedSpy = vi.spyOn(instance, 'peerClosed');
    // @ts-ignore
    const getPeerInfoSpy = vi.spyOn(instance, 'getPeerInfo');
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


describe('runSubscriptions', () => {
  let instance: EventbusController;
  let subMain;
  let doneMain = false;
  let chatEvent: IchatEvent;
  const doneTimer = () => new Promise((resolve) => {
    setInterval(() => {
      if (doneMain) {
        resolve(true);
      }
    }, 100);
  });

  const websocket: any = vi.fn();
  websocket.sendRequest = vi.fn();

  beforeEach(() => {
    instance = new EventbusController();
    vi.spyOn(websocket, 'sendRequest').mockImplementationOnce(() => Promise.resolve(null));
    // mocking room
    const activeRoom = createMockChatRoom();
    activeRoom.update = vi.fn().mockImplementation(() => null);
    activeRoom.getParticipants = vi.fn().mockImplementation(() => null);
    activeRoom.getPeerInfo = vi.fn().mockImplementation(() => null);
    // vi.spyOn(exports, 'method').mockImplementation(() => { });
    subMain = instance.chat$
      .subscribe(event => {
        chatEvent = event;
        doneMain = true;
      });
  });

  afterEach(() => {
    if (subMain) {
      subMain.unsubscribe();
    }
  });

  // testing negative side
  it('should fail to send chat message events eveery body using the aplications provided no user exists', async() => new Promise(done => {
    const event = {
      type: ECHATMETHOD.CHAT_MESSAGE,
      from: faker.string.uuid(),
      chatMessage: makeRandomString(66, 'letters'),
      to: null,
      id: faker.string.uuid(),
      createTime: new Date()
    };

    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      // @ts-ignore
      // const spy = vi.spyOn(instance.activeRoom, 'getPeerInfo');
      // expect(spy).not.toHaveBeenCalled();
      done(null);
    });
  }));

  // testing positive side
  it('should listen chat message events from every body using the aplications provided no user exists', async() => new Promise(done => {
    const event = {
      type: ECHATMETHOD.CHAT_MESSAGE,
      data: {
        from: faker.string.uuid(),
        chatMessage: makeRandomString(66, 'letters'),
        to: 'all',
        id: faker.string.uuid()
      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  // testing positive side2
  it('should listen chat message events from one person using the aplications provided no user exists', async() => new Promise(done => {
    const event = {
      type: ECHATMETHOD.CHAT_MESSAGE,
      data: {
        from: faker.string.uuid(),
        chatMessage: makeRandomString(66, 'letters'),
        to: 'id',
        id: faker.string.uuid(),
        createTime: new Date()
      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      done(null);
    });
  }));

  // negative side
  it('should perform ECHATMETHOD.DELETE_MESSAGE and fail if no id matches', async() => new Promise(done => {
    const event = {
      type: ECHATMETHOD.DELETE_MESSAGE,
      data: {
        id: faker.string.uuid(),
        deleted: true
      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  // positive side
  it('should perform ECHATMETHOD.DELETE_MESSAGE and pass if id matches', async() => new Promise(done => {
    const event = {
      type: ECHATMETHOD.DELETE_MESSAGE,
      data: {
        id: 'message1.id',
        deleted: true
      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  it('should handle ECHATMETHOD.NEW_PEER', () => new Promise(done => {
    const event = {
      type: ECHATMETHOD.NEW_PEER,
      data: {

      }
    };
    instance.chat$.next(event);
    // @ts-ignore
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  it('should handle ECHATMETHOD.NEW_MAIN_PEER', () => new Promise(done => {
    const event = {
      type: ECHATMETHOD.NEW_MAIN_PEER,
      data: {

      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      // @ts-ignore
      // const spy = vi.spyOn(instance, 'mangeNewMainPeers');
      // expect(spy).toHaveBeenCalledWith(event.data);
      done(null);
    });
  }));

  it('should handle ECHATMETHOD.PEER_CLOSE', () => new Promise(done => {
    const event = {
      type: ECHATMETHOD.PEER_CLOSE,
      data: {

      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      // @ts-ignore
      // const spy = vi.spyOn(instance, 'peerClosed');
      // expect(spy).toHaveBeenCalledWith(event.data);
      done(null);
    });
  }));

  it('should handle ECHATMETHOD.MAIN_PEER_CLOSE', () => new Promise(done => {
    const event = {
      type: ECHATMETHOD.MAIN_PEER_CLOSE,
      data: {

      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      // @ts-ignore
      // const spy = vi.spyOn(instance, 'manageMainPeerLeave');
      // expect(spy).toHaveBeenCalledWith(event.data);
      done(null);
    });
  }));

  it('should handle ECHATMETHOD.ROOM_CREATED', () => new Promise(done => {
    const event = {
      type: ECHATMETHOD.ROOM_CREATED,
      data: {

      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  it('should handle ECHATMETHOD.ROOM_CREATED', () => new Promise(done => {
    const event = {
      type: ECHATMETHOD.SOCKET_CONNECTED,
      data: {

      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  // negative side
  it('should perform ECHATMETHOD.UPDATE_STATUS and fail if no id matches', () => new Promise(done => {
    const event = {
      type: ECHATMETHOD.UPDATE_STATUS,
      data: {
        id: faker.string.uuid(),
        status: 'viewed'
      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  // positive side
  it('should perform ECHATMETHOD.UPDATE_STATUS and pass if id matches with viewed', async() => new Promise(done => {
    const event = {
      type: ECHATMETHOD.UPDATE_STATUS,
      data: {
        id: 'message1.id',
        status: 'viewed'
      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  it('should handle ECHATMETHOD.PEER_UPDATE', async() => new Promise(done => {
    const event = {
      type: ECHATMETHOD.PEER_UPDATE,
      data: {
        peerInfo: createMockPeerinfo()
      }
    };
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));

  it('should handle ECHATMETHOD.UPDATE_ROOM', async() => new Promise(done => {
    const event = {
      type: ECHATMETHOD.UPDATE_ROOM,
      data: {
        roomData: createMockChatRoom(),
        add: true
      }
    };
    // @ts-ignore
    instance.chat$.next(event);
    doneTimer().then(() => {
      expect(chatEvent).toStrictEqual(event);
      done(null);
    });
  }));
});

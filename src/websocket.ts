import { io, Socket } from 'socket.io-client';
import { EasyChatController } from './controllers/chat.controller';
import { EventbusController } from './controllers/eventbus.controller';
import { LoggerController } from './controllers/logger.controller';
import { ECHATMETHOD } from './enums/chat.enum';

export interface IsendOnlineSoloRequestRes {
  success: boolean;
  response?;
  err?;
}

const requestTimeout = 10000;

const chatNotificationMap = new Map<string, string>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chatNotification = (ref = '') => (target, propertyKey: string, descriptor: PropertyDescriptor) => {
  if (ref) {
    chatNotificationMap.set(ref, propertyKey);
  } else {
    chatNotificationMap.set(propertyKey, propertyKey);
  }
};


export const initEasyChat = (
  url: string,
  userId: string,
  userNames: string,
  userPhotoUrl: string

) => {
  const easyChatClient = new EasyChatClient(url, userId);
  const easyChatController = new EasyChatController(
    easyChatClient,
    userId,
    userNames,
    userPhotoUrl
  );
  easyChatClient.connect();
  return { easyChatClient, easyChatController };
};


export class EasyChatClient {
  static mode: string;
  activeUsers = new Map<string, string>();
  private socket: Socket;
  private eventbus: EventbusController;
  private logger: LoggerController;

  constructor(
    private url: string,
    private id: string
  ) {
    this.eventbus = new EventbusController();
    this.logger = new LoggerController();
  }

  @chatNotification()
  private roomCreated(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.ROOM_CREATED,
      data
    });
  }

  @chatNotification()
  private chatMessage(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.CHAT_MESSAGE,
      data
    });
  }

  @chatNotification()
  private deleteMessage(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.DELETE_MESSAGE,
      data
    });
  }

  @chatNotification()
  private newPeer(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.NEW_PEER,
      data
    });
  }

  @chatNotification()
  private newMainPeer(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.NEW_MAIN_PEER,
      data
    });
  }

  @chatNotification()
  private peerClosed(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.PEER_CLOSE,
      data
    });
  }


  @chatNotification()
  private mainPeerClosed(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.MAIN_PEER_CLOSE,
      data
    });
  }

  @chatNotification()
  private updateStatus(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.UPDATE_STATUS,
      data
    });
  }

  @chatNotification()
  private updatePeer(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.PEER_UPDATE,
      data
    });
  }

  @chatNotification()
  private updateRoom(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.UPDATE_ROOM,
      data
    });
  }

  @chatNotification()
  private updateRoomOnNew(data) {
    this.eventbus.chat$.next({
      type: ECHATMETHOD.UPDATE_ROOMS_ON_NEW,
      data
    });
  }

  get currSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return Boolean(this.socket?.connected);
  }

  disconectSocket() {
    this.socket.disconnect();
  }

  connect(
    id = this.id,
    url = this.url
  ) {
    const socketUrl =
      // eslint-disable-next-line max-len
      `${url}/?userId=${id}`;

    this.logger.debug('EasyChatClient:connect:: - socketUrl : %s', socketUrl);

    this.socket = io(socketUrl, {
      timeout: 3000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelayMax: 2000,
      transports: ['websocket']
    });
    this.setupEventHandler(this.socket);
    this.setupNotificationHandler();
  }

  sendRequest(method, data?) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        this.logger.error('EasyChatClient:connect:: -', 'No socket connection');
        reject('No socket connection');
      } else {
        this.socket.emit('mainrequest', { method, data },
          this.timeoutCallback((err, response) => {
            if (err) {
              this.logger.error(
                'sendRequest %s timeout! socket: %o',
                method, this.socket);
              reject(err);
            } else {
              this.logger.debug('sendRequest response: %s', response);
              resolve(response);
            }
          })
        );
      }
    });
  }

  sendOnlineSoloRequest(method, data?) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        this.logger.error('EasyChatClient:sendOnlineSoloRequest:: - connect -', 'No socket connection');
        reject('No socket connection');
      } else {
        this.socket.emit('onlinerequest', { method, data },
          this.timeoutCallback((err, response) => {
            if (err) {
              this.logger.error(
                'sendOnlineSoloRequest::sendRequest %s timeout! socket: %o',
                method, this.socket);
              reject(err);
            } else {
              resolve(response);
            }
          })
        );
      }
    });
  }

  timeoutCallback(callback) {
    let called = false;

    const interval = setTimeout(() => {
      if (called) {
        return;
      }
      called = true;
      this.logger.error('EasyChatClient:connect:: -', 'nowRequest timeout');
      callback(new Error('nowRequest timeout'));
    }, requestTimeout);

    return (...args) => {
      if (called) {
        return;
      }
      called = true;
      clearTimeout(interval);

      callback(...args);
    };
  }

  disconnect() {
    if (this.socket.disconnected) {
      this.logger.debug('EasyChatClient:disconnect:: - socket already disconnected');
      return;
    }
    this.socket.disconnect();
  }

  private setupEventHandler(socket: Socket) {
    socket.on('connect', () => {
      this.logger.debug('EasyChatClient:setupEventHandler:: - socket connected !');
      this.eventbus.chat$.next({
        type: ECHATMETHOD.SOCKET_CONNECTED
      });
    });

    socket.on('connect_error', () => {
      this.logger.warn('EasyChatClient:setupEventHandler:: - reconnect_failed !');
    });

    socket.on('connect_timeout', () => {
      this.logger.warn('EasyChatClient:setupEventHandler:: - connect_timeout !');
    });

    socket.on('disconnect', (reason) => {
      this.logger.error(
        'EasyChatClient:setupEventHandler:: - Socket disconnect, reason: %s',
        reason);
      this.eventbus.chat$.next({
        type: ECHATMETHOD.SOCKET_DISCONNECTED
      });
    });

    socket.on('reconnect', attemptNumber => {
      this.logger.debug('EasyChatClient:setupEventHandler:: - "reconnect" event [attempts:"%s"]', attemptNumber);
    });

    socket.on('reconnect_failed', () => {
      this.logger.warn('EasyChatClient:setupEventHandler:: - reconnect_failed !');
    });
  }


  private setupNotificationHandler() {
    const socket = this.socket;
    socket.on('mainnotification', (request) => {
      this.logger.debug(
        'EasyChatClient:setupNotificationHandler:: - mainnotification event, method: %s,data: %o', request.method, request.data
      );

      const regiMethod = chatNotificationMap.get(request.method);
      if (!regiMethod) {
        this.logger.warn('EasyChatClient:setupNotificationHandler:: - mainnotification method: %s, do not register!', request.method);
        return;
      }

      this[regiMethod](request.data);
    });
  }
}

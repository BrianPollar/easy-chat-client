"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyChatClient = exports.initEasyChat = void 0;
const tslib_1 = require("tslib");
const socket_io_client_1 = require("socket.io-client");
const chat_controller_1 = require("./controllers/chat.controller");
const eventbus_controller_1 = require("./controllers/eventbus.controller");
const logger_controller_1 = require("./controllers/logger.controller");
const chat_enum_1 = require("./enums/chat.enum");
const requestTimeout = 10000;
const chatNotificationMap = new Map();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chatNotification = (ref = '') => (target, propertyKey, descriptor) => {
    if (ref) {
        chatNotificationMap.set(ref, propertyKey);
    }
    else {
        chatNotificationMap.set(propertyKey, propertyKey);
    }
};
const initEasyChat = (url, userId, userNames, userPhotoUrl) => {
    const easyChatClient = new EasyChatClient(url, userId);
    const easyChatController = new chat_controller_1.EasyChatController(easyChatClient, userId, userNames, userPhotoUrl);
    easyChatClient.connect();
    return { easyChatClient, easyChatController };
};
exports.initEasyChat = initEasyChat;
class EasyChatClient {
    constructor(url, id) {
        this.url = url;
        this.id = id;
        this.activeUsers = new Map();
        this.eventbus = new eventbus_controller_1.EventbusController();
        this.logger = new logger_controller_1.LoggerController();
    }
    roomCreated(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.ROOM_CREATED,
            data
        });
    }
    chatMessage(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.CHAT_MESSAGE,
            data
        });
    }
    deleteMessage(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.DELETE_MESSAGE,
            data
        });
    }
    newPeer(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.NEW_PEER,
            data
        });
    }
    newMainPeer(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.NEW_MAIN_PEER,
            data
        });
    }
    peerClosed(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.PEER_CLOSE,
            data
        });
    }
    mainPeerClosed(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.MAIN_PEER_CLOSE,
            data
        });
    }
    updateStatus(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.UPDATE_STATUS,
            data
        });
    }
    updatePeer(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.PEER_UPDATE,
            data
        });
    }
    updateRoom(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.UPDATE_ROOM,
            data
        });
    }
    updateRoomOnNew(data) {
        this.eventbus.chat$.next({
            type: chat_enum_1.ECHATMETHOD.UPDATE_ROOMS_ON_NEW,
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
    connect(id = this.id, url = this.url) {
        const socketUrl = 
        // eslint-disable-next-line max-len
        `${url}/?userId=${id}`;
        this.logger.debug('EasyChatClient:connect:: - socketUrl : %s', socketUrl);
        this.socket = (0, socket_io_client_1.io)(socketUrl, {
            timeout: 3000,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelayMax: 2000,
            transports: ['websocket']
        });
        this.setupEventHandler(this.socket);
        this.setupNotificationHandler();
    }
    sendRequest(method, data, timeOut = 10000) {
        return new Promise((resolve, reject) => {
            if (!this.socket || !this.socket.connected) {
                this.logger.error('EasyChatClient:connect:: -', 'No socket connection');
                reject('No socket connection');
            }
            else {
                this.socket.emit('mainrequest', { method, data }, this.timeoutCallback((err, response) => {
                    if (err) {
                        this.logger.error('sendRequest %s timeout! socket: %o', method, this.socket);
                        reject(err);
                    }
                    else {
                        this.logger.debug('sendRequest response: %s', response);
                        resolve(response);
                    }
                }, timeOut));
            }
        });
    }
    sendOnlineSoloRequest(method, data, timeOut = 10000) {
        return new Promise((resolve, reject) => {
            if (!this.socket || !this.socket.connected) {
                this.logger.error('EasyChatClient:sendOnlineSoloRequest:: - connect -', 'No socket connection');
                reject('No socket connection');
            }
            else {
                this.socket.emit('onlinerequest', { method, data }, this.timeoutCallback((err, response) => {
                    if (err) {
                        this.logger.error('sendOnlineSoloRequest::sendRequest %s timeout! socket: %o', method, this.socket);
                        reject(err);
                    }
                    else {
                        resolve(response);
                    }
                }, timeOut));
            }
        });
    }
    timeoutCallback(callback, timeOut = 10000) {
        let called = false;
        const interval = setTimeout(() => {
            if (called) {
                return;
            }
            called = true;
            this.logger.error('EasyChatClient:connect:: -', 'nowRequest timeout');
            callback(new Error('nowRequest timeout'));
        }, timeOut || requestTimeout);
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
    setupEventHandler(socket) {
        socket.on('connect', () => {
            this.logger.debug('EasyChatClient:setupEventHandler:: - socket connected !');
            this.eventbus.chat$.next({
                type: chat_enum_1.ECHATMETHOD.SOCKET_CONNECTED
            });
        });
        socket.on('connect_error', () => {
            this.logger.warn('EasyChatClient:setupEventHandler:: - reconnect_failed !');
        });
        socket.on('connect_timeout', () => {
            this.logger.warn('EasyChatClient:setupEventHandler:: - connect_timeout !');
        });
        socket.on('disconnect', (reason) => {
            this.logger.error('EasyChatClient:setupEventHandler:: - Socket disconnect, reason: %s', reason);
            this.eventbus.chat$.next({
                type: chat_enum_1.ECHATMETHOD.SOCKET_DISCONNECTED
            });
        });
        socket.on('reconnect', attemptNumber => {
            this.logger.debug('EasyChatClient:setupEventHandler:: - "reconnect" event [attempts:"%s"]', attemptNumber);
        });
        socket.on('reconnect_failed', () => {
            this.logger.warn('EasyChatClient:setupEventHandler:: - reconnect_failed !');
        });
    }
    setupNotificationHandler() {
        const socket = this.socket;
        socket.on('mainnotification', (request) => {
            this.logger.debug('EasyChatClient:setupNotificationHandler:: - mainnotification event, method: %s,data: %o', request.method, request.data);
            const regiMethod = chatNotificationMap.get(request.method);
            if (!regiMethod) {
                this.logger.warn('EasyChatClient:setupNotificationHandler:: - mainnotification method: %s, do not register!', request.method);
                return;
            }
            this[regiMethod](request.data);
        });
    }
}
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "roomCreated", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "chatMessage", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "deleteMessage", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "newPeer", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "newMainPeer", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "peerClosed", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "mainPeerClosed", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "updateStatus", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "updatePeer", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "updateRoom", null);
tslib_1.__decorate([
    chatNotification()
], EasyChatClient.prototype, "updateRoomOnNew", null);
exports.EasyChatClient = EasyChatClient;
//# sourceMappingURL=websocket.js.map
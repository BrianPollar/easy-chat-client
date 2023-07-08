import { Socket } from 'socket.io-client';
import { EasyChatController } from './controllers/chat.controller';
import { EventbusController } from './controllers/eventbus.controller';
export interface IsendOnlineSoloRequestRes {
    success: boolean;
    response?: any;
    err?: any;
}
export declare const initEasyChat: (url: string, userId: string, userNames: string, userPhotoUrl: string) => {
    easyChatClient: EasyChatClient;
    easyChatController: EasyChatController;
};
export declare class EasyChatClient {
    private url;
    private id;
    static mode: string;
    activeUsers: Map<string, string>;
    eventbus: EventbusController;
    private socket;
    private logger;
    constructor(url: string, id: string);
    private roomCreated;
    private chatMessage;
    private deleteMessage;
    private newPeer;
    private newMainPeer;
    private peerClosed;
    private mainPeerClosed;
    private updateStatus;
    private updatePeer;
    private updateRoom;
    private updateRoomOnNew;
    get currSocket(): Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
    isSocketConnected(): boolean;
    disconectSocket(): void;
    connect(id?: string, url?: string): void;
    sendRequest(method: any, data?: any, timeOut?: number): Promise<unknown>;
    sendOnlineSoloRequest(method: any, data?: any, timeOut?: number): Promise<unknown>;
    timeoutCallback(callback: any, timeOut?: number): (...args: any[]) => void;
    disconnect(): void;
    private setupEventHandler;
    private setupNotificationHandler;
}

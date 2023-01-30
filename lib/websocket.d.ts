import { EasyChatController } from './controllers/chat.controller';
export declare const initEasyChat: (url: string, userId: string, userNames: string, userPhotoUrl: string) => {
    easyChatClient: EasyChatClient;
    easyChatController: EasyChatController;
};
export declare class EasyChatClient {
    private url;
    private id;
    static mode: string;
    activeUsers: Map<string, string>;
    private socket;
    private eventbus;
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
    isSocketConnected(): boolean;
    disconectSocket(): void;
    connect(id?: string, url?: string): void;
    sendRequest(method: any, data?: any): Promise<unknown>;
    sendOnlineSoloRequest(method: any, data?: any): Promise<unknown>;
    timeoutCallback(callback: any): (...args: any[]) => void;
    disconnect(): void;
    private setupEventHandler;
    private setupNotificationHandler;
}

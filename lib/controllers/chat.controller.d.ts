import { Subject } from 'rxjs';
import { ChatMsg, ChatRoom } from '../defines/chat-room.define';
import { IpeerInfo } from '../interfaces/chat.interface';
import { TchatMsgStatus } from '../types/union.types';
import { EventbusController } from './eventbus.controller';
import { LoggerController } from './logger.controller';
import { EasyChatClient } from '../websocket';
/** Handle CHAT related Task*/
export declare class EasyChatController {
    websocket: EasyChatClient;
    private eventbus;
    private logger;
    private myId;
    private myNames;
    private myPhotoUrl;
    messages: ChatMsg[];
    toPeer: string;
    activeRoom: ChatRoom;
    destroyed$: Subject<unknown>;
    constructor(websocket: EasyChatClient, eventbus: EventbusController, logger: LoggerController, myId: string, myNames: string, myPhotoUrl: string);
    determinLocalPeerInfo(): IpeerInfo;
    joinRoom(): Promise<void>;
    joinMainRoom(): Promise<void>;
    joinMain(params: any): Promise<{
        peers: any;
        joined: boolean;
    }>;
    join(params: any): Promise<{
        peers: any;
        joined: boolean;
    }>;
    send(chatMessage: string): void;
    updateStatus(status: TchatMsgStatus, msg: ChatMsg): void;
    deleteRestoreMesage(id: string, deleted: boolean): void;
    sendClosePeer(stopClass: any): Promise<unknown>;
    updatePeer(peerInfo: IpeerInfo): Promise<unknown>;
    updateRoom(roomData: any, add: boolean /** add to array or remove if false */): Promise<unknown>;
    newRoom(room: ChatRoom): Promise<unknown>;
    clearRoom(): void;
    scrollToLast(): void;
    private mangeNewMainPeers;
    private manageMainPeerLeave;
    private newPeer;
    private peerClosed;
    private getPeerInfo;
}

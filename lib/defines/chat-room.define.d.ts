import { IchatMsg, IchatRoom, IpeerInfo } from '../interfaces/chat.interface';
import { TchatMsgStatus, TchatMsgWho } from '../types/union.types';
export declare const createMockChat: () => {
    id: string;
    createTime: Date;
};
export declare const createMockPeerinfo: () => {
    id: string;
    photo: string;
    name: string;
    roomAdmin: string;
    lastSeen: Date;
    online: boolean;
};
export declare const createMockChatRoom: (incrementor?: number) => ChatRoom;
export declare const createMockChatRooms: (length: number) => ChatRoom[];
export declare const createMockChatMsg: (incrementor?: number) => ChatMsg;
export declare const createMockChatMsgs: (length: number) => ChatMsg[];
export declare class Chat {
    id: string;
    createTime: Date;
    constructor(data: IchatRoom | IchatMsg);
}
export declare class ChatRoom extends Chat {
    lastActive: Date;
    peers: IpeerInfo[];
    blocked: string[];
    unviewedMsgsLength: number;
    type: string;
    extras?: any;
    closed: boolean;
    constructor(room: Required<IchatRoom>);
    update(val: any, add: boolean): void;
    getParticipants(): IpeerInfo[];
    getPeerInfo(id: string): IpeerInfo;
}
export declare class ChatMsg extends Chat {
    private myId;
    peerInfo?: IpeerInfo;
    roomId: string;
    msg: string;
    who: TchatMsgWho;
    status: TchatMsgStatus;
    deleted: boolean;
    constructor(myId: string, msg: IchatMsg);
}

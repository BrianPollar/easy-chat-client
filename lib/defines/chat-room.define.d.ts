import { IchatMsg, IchatRoom, IpeerInfo } from '../interfaces/chat.interface';
import { TchatMsgStatus, TchatMsgWho } from '../types/union.types';
export declare abstract class Chat {
    id: string;
    createTime: Date;
    constructor(data: IchatRoom | IchatMsg);
    static makeChatDummy(incrementor?: number): {
        id: string;
        createTime: Date;
    };
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
    static makeRoomDummy(incrementor?: number): {
        lastActive: Date;
        peers: any[];
        blocked: any[];
        unviewedMsgsLength: number;
        type: string;
        closed: boolean;
        id: string;
        createTime: Date;
    };
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
    static makeMsgDummy(incrementor?: number): {
        peerInfo: {
            id: string;
            photo: string;
            name: string;
            roomAdmin: boolean;
            online: boolean;
        };
        msg: string;
        createTime: Date;
        who: string;
        status: string;
        deleted: boolean;
        id: string;
    };
}

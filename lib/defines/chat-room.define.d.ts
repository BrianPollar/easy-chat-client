import { IchatMsg, IchatRoom, IpeerInfo } from '../interfaces/chat.interface';
import { TchatMsgStatus, TchatMsgWho } from '../types/union.types';
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

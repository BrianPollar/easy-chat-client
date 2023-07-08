import { BehaviorSubject } from 'rxjs';
import { ECHATMETHOD } from '../enums/chat.enum';
export interface IchatEvent {
    type: ECHATMETHOD;
    data?: any;
    error?: string;
}
export interface IoutEvent {
    type: string;
    data?: any;
    error?: string;
}
export declare class EventbusController {
    socket$: BehaviorSubject<any>;
    chat$: BehaviorSubject<IchatEvent>;
    userOnlineChange$: BehaviorSubject<boolean>;
    outEvent: BehaviorSubject<IoutEvent>;
    constructor();
}

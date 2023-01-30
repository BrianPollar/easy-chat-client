import { BehaviorSubject } from "rxjs";
import { ECHATMETHOD } from "../enums/chat.enum";

export interface IchatEvent {
  type: ECHATMETHOD;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}

export interface IoutEvent {
  type: string; // TODO this needs union
  data?;
  error?;
}

export class EventbusController {
  socket$ = new BehaviorSubject(null);
  chat$: BehaviorSubject<IchatEvent> = new BehaviorSubject<IchatEvent>(null as any);
  userOnlineChange$: BehaviorSubject<boolean> = new BehaviorSubject(null as any);
  outEvent: BehaviorSubject<IoutEvent> = new BehaviorSubject(null as any);

  constructor() { }
}
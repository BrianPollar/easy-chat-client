import { BehaviorSubject } from 'rxjs';
import { ECHATMETHOD } from '../enums/chat.enum';

// This interface defines the properties of a chat event.
export interface IchatEvent {
  // The type of the chat event.
  type: ECHATMETHOD;
  // The data associated with the chat event.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // The error message associated with the chat event.
  error?: string;
}

// This interface defines the properties of an out event.
export interface IoutEvent {
  // The type of the out event.
  type: string; // TODO this needs union
  // The data associated with the out event.
  data?;
  // The error message associated with the out event.
  error?: string;
}

export interface IsocketEvent {
  type: string;
  data?;
  error?;
}

// This class defines the event bus controller.
export class EventbusController {
  // The socket observable.
  socket$: BehaviorSubject<IsocketEvent> = new BehaviorSubject<IsocketEvent>(null);

  // The chat event observable.
  chat$: BehaviorSubject<IchatEvent> = new BehaviorSubject<IchatEvent>(null);

  // The user online change observable.
  userOnlineChange$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  // The out event observable.
  outEvent: BehaviorSubject<IoutEvent> = new BehaviorSubject(null);

  // The constructor of the event bus controller.
  constructor() { }
}

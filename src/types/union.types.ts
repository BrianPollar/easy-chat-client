// This file imports the `ECHATMETHOD` enum from the `chat.enum` file.
import { ECHATMETHOD } from '../enums/chat.enum';

// This type defines the possible statuses of a chat message.
export type TchatMsgStatus =
  'sent' |
  'pending' |
  'failed' |
  'recieved' |
  'viewed';

// This type defines the possible values for the `who` property of a chat message.
export type TchatMsgWho =
  'me' |
  'partner';

// This type defines the possible events that can be emitted by a chat room.
export type TroomEvent = ECHATMETHOD;

// This type defines the possible values for the `how` property of the `makeRandomString()` function.
export type Tmkrandomstringhow =
  'numbers' |
  'letters' |
  'combined';

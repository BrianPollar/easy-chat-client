// This file imports the `TchatMsgStatus` and `TchatMsgWho` types from the `union.types` file.

import { TchatMsgStatus, TchatMsgWho } from '../types/union.types';

// This interface defines the properties of a chat message.
export interface IchatMsg {
  // The unique identifier of the message.
  id: string;
  // The peer who sent the message, if known.
  peerInfo?: IpeerInfo;
  // The ID of the chat room the message was sent in.
  roomId: string;
  // The message content.
  msg: string;
  // The time the message was created.
  createTime: Date;
  // Who sent the message?
  who: TchatMsgWho;
  // The status of the message.
  status: TchatMsgStatus;
  // Whether the message has been deleted.
  deleted: boolean;
}

// This interface defines the properties of a chat room.
export interface IchatRoom {
  // The unique identifier of the chat room.
  id: string;
  // The time the chat room was created.
  createTime: Date;
  // The last time the chat room was active.
  lastActive: Date;
  // The list of peers in the chat room.
  peers: IpeerInfo[];
  // The list of blocked users.
  blocked: string[];
  // The number of unread messages in the chat room.
  unviewedMsgsLength?: number;
  // The type of chat room.
  type: string;
  // Extra data about the chat room.
  extras?: any;
  // Whether the chat room is closed.
  closed: boolean;
}

// This interface defines the properties of a peer in a chat room.
export interface IpeerInfo {
  // The unique identifier of the peer.
  id: string;
  // The peer's photo URL.
  photo: string;
  // The peer's name.
  name: string;
  // Whether the peer is an admin of the chat room.
  roomAdmin: boolean; // super cow powers
  // The time the peer was last seen.
  lastSeen: Date;
  // Whether the peer is online.
  online: boolean;
  // The number of unread messages for the peer.
  unviewedMsgsLength: number; // number of unseen messages
}

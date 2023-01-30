# easy-chat-client

## Features

easy-chat implements real-time bidirectional event-based communication. It consists of:

- a Javascript client library (this repository)
- a [Node Js Server](https://github.com/easy-chat/easy-chat) for the browser (or a Node.js client)

Its main features are:

#### Reliability

Connections are established even in the presence of:

- proxies and load balancers.
- personal firewall and antivirus software.

For this purpose, it relies on [socket io](https://github.com/socketio), which first establishes connection to the backend server using the best possible transports.

#### Minimalistic chat implementation support

You do not need to understand the internal structures and operation of websockets and chat systems.
All you need to do is call create a room, heck you not need to destroy a room as this is handled intelligently and automatically;

#### Simple and convenient API

Sample code:

```ts
import { initEasyChat } from "easy-chat-client";

const { easyChatClient, easyChatController } = initEasyChat(
  url, // server url
  userId, // current user uniques, its is importnat that this stays unique throughout your application
  userNames, // user names
  userPhotoUrl // absolute file url for the user photo
);
```

## Installation

```bash
// with npm
npm install easy-chat-client

// with yarn
yarn add easy-chat-client
```

## How to use

The following example inits easy-chat-client and gets the chat client and chat controller instances.

```js
import { initEasyChat } from "easy-chat-client";

const { easyChatClient, easyChatController } = initEasyChat(
  url, // server url
  userId, // current user uniques, its is importnat that this stays unique throughout your application
  userNames, // user names
  userPhotoUrl // absolute file url for the user photo
);

// create a new room
easyChatController.newRoom("id");

// and send message
easyChatController.send("hello world");
```

## Documentation

Please see the documentation [here](https://socket.io/docs/).

The source code of the website can be found [here](https://github.com/socketio/socket.io-website). Contributions are welcome!

## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/socketio#sponsor)]

## License

[MIT](LICENSE)

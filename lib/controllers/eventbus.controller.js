"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventbusController = void 0;
const rxjs_1 = require("rxjs");
// This class defines the event bus controller.
class EventbusController {
    // The constructor of the event bus controller.
    constructor() {
        // The socket observable.
        this.socket$ = new rxjs_1.BehaviorSubject(null);
        // The chat event observable.
        this.chat$ = new rxjs_1.BehaviorSubject(null);
        // The user online change observable.
        this.userOnlineChange$ = new rxjs_1.BehaviorSubject(null);
        // The out event observable.
        this.outEvent = new rxjs_1.BehaviorSubject(null);
    }
}
exports.EventbusController = EventbusController;
//# sourceMappingURL=eventbus.controller.js.map
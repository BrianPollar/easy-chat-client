"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventbusController = void 0;
const rxjs_1 = require("rxjs");
class EventbusController {
    constructor() {
        this.socket$ = new rxjs_1.BehaviorSubject(null);
        this.chat$ = new rxjs_1.BehaviorSubject(null);
        this.userOnlineChange$ = new rxjs_1.BehaviorSubject(null);
        this.outEvent = new rxjs_1.BehaviorSubject(null);
    }
}
exports.EventbusController = EventbusController;
//# sourceMappingURL=eventbus.controller.js.map
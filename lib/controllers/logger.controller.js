"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerController = void 0;
const APP_NAME = 'easy-chat-client';
class LoggerController {
    constructor() {
        this.pDebug = console.info.bind(console);
        this.pWarn = console.warn.bind(console);
        this.pError = console.error.bind(console);
        this.pTrace = console.trace.bind(console);
        /** this.pDebug.log = console.info.bind(console);
        this.pWarn.log = console.warn.bind(console);
        this.pError.log = console.error.bind(console);
        this.pTrace.log = console.trace.bind(console);
        this.pDebug.color = 'blue';
        this.pWarn.color = 'yellow';
        this.pError.color = 'red';
        this.pTrace.color = 'pink';**/
    }
    get debug() {
        return this.pDebug;
    }
    get warn() {
        return this.pWarn;
    }
    get error() {
        return this.pError;
    }
    get trace() {
        return this.pTrace;
    }
}
exports.LoggerController = LoggerController;
//# sourceMappingURL=logger.controller.js.map
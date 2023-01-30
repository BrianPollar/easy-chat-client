"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRandomString = void 0;
const makeRandomString = (length, how) => {
    let outString = '';
    let inOptions;
    switch (how) {
        case 'numbers':
            inOptions = '0123456789';
            break;
        case 'letters':
            inOptions = 'abcdefghijklmnopqrstuvwxyz';
            break;
        case 'combined':
            inOptions = 'abcdefghijklmnopqrstuvwxyz0123456789';
            break;
    }
    for (let i = 0; i < length; i++) {
        outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }
    return outString;
};
exports.makeRandomString = makeRandomString;
//# sourceMappingURL=makerandomstring.constant.js.map
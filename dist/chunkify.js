"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function chunkify(message) {
    const portionSize = 2000;
    const chunk = [];
    for (let i = 0; i < message.length; i += portionSize) {
        chunk.push(message.slice(i, i + portionSize));
    }
    return chunk;
}
exports.default = chunkify;

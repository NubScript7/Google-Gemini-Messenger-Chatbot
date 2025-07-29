"use strict";
//convert
Object.defineProperty(exports, "__esModule", { value: true });
exports.msToSec = msToSec;
exports.secToMs = secToMs;
exports.secToMin = secToMin;
exports.minToSec = minToSec;
exports.minToHour = minToHour;
exports.hourToMin = hourToMin;
/**
 * Converts millisecond(s) to second(s)
 */
function msToSec(ms) {
    if (isNaN(ms))
        return NaN;
    return (ms / 1000);
}
/**
 * Converts second(s) to millisecond(s)
 */
function secToMs(s) {
    if (isNaN(s))
        return NaN;
    return (s * 1000);
}
/**
 * Converts second(s) to minute(s)
 */
function secToMin(s) {
    if (isNaN(s))
        return NaN;
    return (s / 60);
}
/**
 * Converts minute(s) to second(s)
 */
function minToSec(m) {
    if (isNaN(m))
        return NaN;
    return (m * 60);
}
/**
 * Converts minute(s) to hour(s)
 */
function minToHour(m) {
    if (isNaN(m))
        return NaN;
    return (m / 60);
}
/**
 * Converts hour(s) to minute(s)
 */
function hourToMin(h) {
    if (isNaN(h))
        return NaN;
}
exports.default = {
    msToSec,
    secToMs,
    secToMin,
    minToSec,
    minToHour,
    hourToMin
};

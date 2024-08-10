//convert

/**
 * Converts millisecond(s) to second(s)
 */
export function msToSec(ms: number) {
    if(isNaN(ms))
      return NaN;
    return (ms / 1000);
}

/**
 * Converts second(s) to millisecond(s)
 */
export function secToMs(s: number) {
    if(isNaN(s))
      return NaN;
    return (s * 1000);
}

/**
 * Converts second(s) to minute(s)
 */
export function secToMin(s: number) {
    if(isNaN(s))
    return NaN;
    return (s / 60)
}

/**
 * Converts minute(s) to second(s)
 */
export function minToSec(m: number) {
    if(isNaN(m))
      return NaN;
    return (m * 60);
}

/**
 * Converts minute(s) to hour(s)
 */
export function minToHour(m: number) {
    if(isNaN(m))
    return NaN;
    return (m / 60);
}

/**
 * Converts hour(s) to minute(s)
 */
export function hourToMin(h: number) {
    if(isNaN(h))return NaN;
}



export default {
    msToSec,
    secToMs,
    secToMin,
    minToSec,
    minToHour,
    hourToMin
}
/**
 * Converts millisecond(s) to second(s)
 */
export declare function msToSec(ms: number): number;
/**
 * Converts second(s) to millisecond(s)
 */
export declare function secToMs(s: number): number;
/**
 * Converts second(s) to minute(s)
 */
export declare function secToMin(s: number): number;
/**
 * Converts minute(s) to second(s)
 */
export declare function minToSec(m: number): number;
/**
 * Converts minute(s) to hour(s)
 */
export declare function minToHour(m: number): number;
/**
 * Converts hour(s) to minute(s)
 */
export declare function hourToMin(h: number): number | undefined;
declare const _default: {
    msToSec: typeof msToSec;
    secToMs: typeof secToMs;
    secToMin: typeof secToMin;
    minToSec: typeof minToSec;
    minToHour: typeof minToHour;
    hourToMin: typeof hourToMin;
};
export default _default;

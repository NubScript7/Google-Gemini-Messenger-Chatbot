declare function writeSecure(filepath: string, data: string, password: string): never;
declare function readSecure(filepath: string, password: string): string;
export { readSecure, writeSecure };

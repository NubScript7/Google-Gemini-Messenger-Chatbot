/// <reference types="node" />
export declare function setRoot(path: string): void;
export declare function resolvePath(path: string): string;
export declare function generateKey(password: string, customSalt?: string, saltRounds?: number): Buffer;
export declare function encrypt(text: string, password: string, salt?: string): string;
export declare function decrypt(encryptedMessage: string, password: string, salt?: string): string | null;
export declare function writeSecure(filepath: string, data: string, password: string | number): Promise<void>;
export declare function readSecure(filepath: string, password: string | number): Promise<string | null>;

/// <reference types="node" />
declare function generateKeyPair(size?: number): import("crypto").KeyPairSyncResult<string, string>;
declare function encrypt(publicKey: any, message: string): string;
declare function decrypt(privateKey: any, encryptedMessage: string): string;
export { generateKeyPair, encrypt, decrypt };

declare function generateKey(password: string, saltRounds: number, customSalt: string): Buffer;
declare function encrypt(text: string, password: string): string | null;
declare function decrypt(encryptedMessage: string, password: string): string | null;
export { generateKey, encrypt, decrypt };

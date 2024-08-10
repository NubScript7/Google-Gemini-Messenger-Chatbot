import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

let root = "./";

export function setRoot(path: string) {
    root = path;
}

export function resolvePath(path: string) {
    return resolve(root, path);
}

class EncryptorError extends Error {
    constructor(message: string) {
        super(message);
    }
}


export function generateKey(password: string, customSalt?: string, saltRounds?: number) {
    if (!saltRounds || isNaN(saltRounds)) saltRounds = 1000;

    if (!customSalt || "string" !== typeof customSalt) customSalt = "@default";

    if (!password || "string" !== typeof password) throw new Error("password must be a valid string.");

    return pbkdf2Sync(password, customSalt, saltRounds, 32, "sha256");
}

export function encrypt(text: string, password: string, salt?: string) {
    const key = salt ? generateKey(password, salt) : generateKey(password);
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedMessage: string, password: string, salt?: string): string | null {
    const [ivHex, encrypted] = encryptedMessage.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = salt ? generateKey(password, salt) : generateKey(password);
    const decipher = createDecipheriv("aes-256-cbc", key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

export async function writeSecure(filepath: string, data: string, password: string | number) {
    if (!password || "string" !== typeof password) throw new EncryptorError("no password was specified or password was not a typeof string.");

    if (!data || "string" !== typeof data) throw new EncryptorError("cannot use passed data argument, not a typeof string.");

        const encrypted = encrypt(data, password);
        writeFile(resolve(root, filepath), encrypted);
}

export async function readSecure(filepath: string, password: string | number) {
    if (!password || "string" !== typeof password) throw new EncryptorError("no password was specified or password was not a typeof string.");

        const data = await readFile(filepath, "utf8");
        return decrypt(data, password);
}

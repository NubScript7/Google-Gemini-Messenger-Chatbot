import { generateKeyPairSync, publicEncrypt, privateDecrypt } from "crypto"

function generateKeyPair(size: number = 1024) {
	return generateKeyPairSync("rsa", {
		modulusLength: size,
		publicKeyEncoding: {
			type: "spki",
			format: "pem"
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "pem"
		}
	})
}

function encrypt(publicKey: any, message: string) {
	const buffer: Buffer = Buffer.from(message, "utf8")
	const encrypted: Buffer = publicEncrypt(publicKey, buffer)
	const base64: string = encrypted.toString("base64")
	return base64;
}

function decrypt(privateKey: any, encryptedMessage: string) {
	const buffer: Buffer = Buffer.from(encryptedMessage, "base64")
	const decrypted: Buffer = privateDecrypt(privateKey, buffer)
	const uft8: string = decrypted.toString("utf8")
	return uft8;
}

export {
	generateKeyPair,
	encrypt,
	decrypt
}
import crypto from "crypto";

function generateToken(): string {
    const prefix = "NBGCTA";
    const length = 128;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const requiredLength = length - prefix.length;
    let token = prefix;

    for(let i = 0; token.length < length; i++) {
        const randomBytes = crypto.randomBytes(requiredLength);
        for (let i = 0; i < randomBytes.length; i++) {
            const charIndex = randomBytes[i] % alphabet.length;
            token += alphabet[charIndex];
        }
    }

    return token;
}

function range(min = 0, max = 10): number {
	if(min > max)
		throw new Error("min value cannot exceed max value.")
	return (min + Math.floor(Math.random() * (max - min + 1)))
}

export {
    generateToken,
    range
};
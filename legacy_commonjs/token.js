const crypto = require("crypto");

function generateToken() {
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

module.exports = generateToken;
module.exports.default = generateToken;

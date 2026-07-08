import crypto from "crypto";

const hashRefreshToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

const generateSecureRandomString = (length = 32) => {
    return crypto
        .randomBytes(length)
        .toString("hex");
};

const generateSecureRandomBytes = (length = 32) => {
    return crypto.randomBytes(length);
};

export {
    hashRefreshToken,
    generateSecureRandomString,
    generateSecureRandomBytes,
};
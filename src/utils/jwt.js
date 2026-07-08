import jwt from "jsonwebtoken"

const createAccessTokenPayload = (user) => ({
    sub: user.id,
});

const createRefreshTokenPayload = (user) => ({
    sub: user.id,
});
const generateAccessToken = (user) => {
    return jwt.sign(
        createAccessTokenPayload(user),
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        }
    )
}
const generateRefreshToken = (user) => {
    return jwt.sign(
        createRefreshTokenPayload(user),
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET
    );
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
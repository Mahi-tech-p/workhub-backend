import { authRepository } from "./auth.repository.js"
import bcrypt from "bcrypt";
import ConflictError from "../../errors/ConflictError.js";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../utils/jwt.js";
import { hashSHA256 } from "../../utils/crypto.js";
import { refreshTokenRepository } from "./refreshToken.repository.js";
import UnauthorizedError from "../../errors/UnauthorizedError.js";
import { db } from "../../db/index.js";

const registerUser = async ({ firstName, lastName, email, password }) => {

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
        throw new ConflictError("User with this email already exists", "USER_ALREADY_EXISTS");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await authRepository.createUser({
        firstName,
        lastName,
        email,
        passwordHash: passwordHash
    })
    return newUser;
}
const loginUser = async ({ email, password }) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new UnauthorizedError(
            "Invalid email or password",
            "INVALID_CREDENTIALS"
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw new UnauthorizedError(
            "Invalid email or password",
            "INVALID_CREDENTIALS"
        );
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    const tokenHash = hashSHA256(refreshToken);

    await refreshTokenRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
    });

    const { passwordHash: _, ...safeUser } = user;

    return {
        user: safeUser,
        accessToken,
        refreshToken,
    };
};

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new UnauthorizedError(
            "Invalid or expired refresh token",
            "INVALID_REFRESH_TOKEN"
        )
    }
    let payload
    try {
        payload = verifyRefreshToken(refreshToken);

    } catch (error) {
        throw new UnauthorizedError(
            "Invalid or expired refresh token",
            "INVALID_REFRESH_TOKEN"
        )
    }
    const tokenHash = hashSHA256(refreshToken);
    const session = await refreshTokenRepository.findByHashToken(tokenHash);
    if (!session) {
        throw new UnauthorizedError(
            "refresh token not found",
            "INVALID_REFRESH_TOKEN"
        )
    }
    if (session.revokedAt) {
        throw new UnauthorizedError(
            "Refresh token has been revoked",
            "INVALID_REFRESH_TOKEN"
        )
    }
    if (session.expiresAt < new Date()) {
        throw new UnauthorizedError(
            "Refresh token has expired",
            "INVALID_REFRESH_TOKEN"
        )
    }
    const user = await authRepository.findUserByID(payload.sub);
    if (!user) {
        throw new UnauthorizedError(
            "User Not Found",
            "USER_NOT_FOUND"
        )
    }
    const accessToken = generateAccessToken(user);

    const newrefreshToken = generateRefreshToken(user);
    const newTokenHash = hashSHA256(newrefreshToken);

    await refreshTokenRepository.revokeByID(session.id);
    await refreshTokenRepository.create(
        {
            userId: user.id,
            tokenHash: newTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    )
    return {
        accessToken,
        refreshToken: newrefreshToken,
    }

}

const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        throw new UnauthorizedError(
            "Invalid or expired refresh token",
            "REFRESH_TOKEN_REQUIRED"
        )
    }
    let payload;
    try {
        payload = verifyRefreshToken(refreshToken)
    } catch (error) {
        throw new UnauthorizedError(
            "Invalid or expired refresh token",
            "INVALID_REFRESH_TOKEN"
        )
    }
    const tokenHash = hashSHA256(refreshToken);

    const session = await refreshTokenRepository.findByHashToken(tokenHash);
    if (!session) {
        throw new UnauthorizedError(
            "Refresh token not found",
            "INVALID_REFRESH_TOKEN"
        )
    }
    if (session.revokedAt) {
        throw new UnauthorizedError(
            "Refresh token has been revoked",
            "INVALID_REFRESH_TOKEN"
        )
    }
    await refreshTokenRepository.revokeByID(session.id);
    return;
}


const authService = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
}
export default authService;
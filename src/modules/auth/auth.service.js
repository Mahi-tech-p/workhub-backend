import { authRepository } from "./auth.repository.js"
import bcrypt from "bcrypt";
import ConflictError from "../../errors/ConflictError.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { hashSHA256 } from "../../utils/crypto.js";
import {refreshTokenRepository }from "./refreshToken.repository.js";
import UnauthorizedError from "../../errors/UnauthorizedError.js";

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
const authService = {
    registerUser,
    loginUser
}
export default authService;
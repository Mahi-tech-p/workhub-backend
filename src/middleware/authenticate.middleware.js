import UnauthorizedError from "../errors/UnauthorizedError.js";
import { authRepository } from "../modules/auth/auth.repository.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authenticate = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new UnauthorizedError(
            "Authorization header is missing",
            "AUTH_HEADER_MISSING"
        );
    }

    if (!authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError(
            "Invalid authorization header format",
            "INVALID_AUTH_HEADER_FORMAT"
        );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new UnauthorizedError(
            "Access token is missing",
            "ACCESS_TOKEN_MISSING"
        );
    }
    const payload = verifyAccessToken(token);

    const user = await authRepository.findUserByID(payload.sub);

    // console.log("JWT Payload:", payload);

    if (!user) {
        throw new UnauthorizedError(
            "User not found",
            "USER_NOT_FOUND"
        )
    }
    const { passwordHash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
}

export default authenticate;
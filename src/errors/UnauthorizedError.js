import AppError from "./AppError.js";

class UnauthorizedError extends AppError {
    constructor(
        message = "Unauthorized",
        errorCode = "UNAUTHORIZED"
    ) {
        super(message, 401, errorCode);
    }
}

export default UnauthorizedError;
import AppError from "./AppError.js";

class ForbiddenError extends AppError {
    constructor(
        message = "Forbidden",
        errorCode = "FORBIDDEN"
    ) {
        super(message, 403, errorCode);
    }
}

export default ForbiddenError;
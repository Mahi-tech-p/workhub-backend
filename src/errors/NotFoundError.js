import AppError from "./AppError.js";

class NotFoundError extends AppError {
    constructor(
        message = "Resource not found",
        errorCode = "NOT_FOUND"
    ) {
        super(message, 404, errorCode);
    }
}

export default NotFoundError;
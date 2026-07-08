import AppError from "./AppError.js";

class BadRequestError extends AppError {
    constructor(
        message = "Bad request",
        errorCode = "BAD_REQUEST"
    ) {
        super(message, 400, errorCode);
    }
}

export default BadRequestError;
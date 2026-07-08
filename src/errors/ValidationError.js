import AppError from "./AppError.js";

class ValidationError extends AppError {
    constructor(
        message = "Validation failed",
        errorCode = "VALIDATION_ERROR"
    ) {
        super(message, 400, errorCode);
    }
}

export default ValidationError;
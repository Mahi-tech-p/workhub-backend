import AppError from "./AppError.js";

class ValidationError extends AppError {
    constructor(
        message = "Validation failed",
        errorCode = "VALIDATION_ERROR",
        errors =[]
    ) {
        super(message, 400, errorCode);
        this.errors = errors;
    }
}

export default ValidationError;
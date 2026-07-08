import { de } from "zod/locales";
import AppError from "./AppError.js";

class ConflictError extends AppError{
    constructor(
        message = "Conflict Error occured",
        errorCode = "CONFLICT_ERROR",
    ) {
        super(message,409, errorCode);
    }
}
export default ConflictError;
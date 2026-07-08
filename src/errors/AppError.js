
class AppError extends Error{
    constructor(
        message,
        statusCode,
        errorCode,
        isOperational = true
    ) {
        super(message);
         this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        
        Error.captureStackTrace(this, this.constructor);
    }
}


export default AppError;
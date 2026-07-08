import { AppError } from "../errors/index.js";

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errorCode: err.errorCode,
            errors: err.errors || [],
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorCode: "INTERNAL_SERVER_ERROR",
    });
};

export default errorMiddleware;
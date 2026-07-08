import { ZodError } from "zod";
import { ValidationError } from "../errors/index.js";
const validate = ({ body, params, query } = {}) => {
    return async (req, res, next) => {
        try {
            if (body) {
                req.body = await body.parseAsync(req.body);
            }

            if (params) {
                req.params = await params.parseAsync(req.params);
            }

            if (query) {
                req.query = await query.parseAsync(req.query);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.length
                        ? issue.path.join(".")
                        : "root",
                    message: issue.message,
                }));

                return next(
                    new ValidationError(
                        "Validation failed",
                        "VALIDATION_ERROR",
                        errors
                    )
                );
            }

            next(error);
        }
    };
};

export default validate;
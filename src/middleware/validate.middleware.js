import { ZodError } from "zod";
import { ValidationError } from "../errors/index.js";
// console.log("VALIDATE MIDDLEWARE LOADED");
const validate = ({ body, params, query } = {}) => {
    //  console.log({
    //     body,
    //     params,
    //     query,
    // });
    return async (req, res, next) => {
        // console.log("VALIDATE CALLED", req.method, req.originalUrl);
        //  console.log("Inside middleware");
        // console.log("req.params:", req.params);
        try {
            if (body) {
               // console.log("Parsing body...");
                req.body = await body.parseAsync(req.body);
            }

            if (params) {
                //console.log("Parsing params...");
                req.params = await params.parseAsync(req.params);
            }

            if (query) {
               // console.log("Parsing query...");
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
           // console.log("Validation error:", error);
            next(error);
        }
    };
};

export default validate;
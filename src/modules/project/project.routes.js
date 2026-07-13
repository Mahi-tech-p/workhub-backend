import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import projectController from "./project.controller.js";
import {
    createProjectSchema,
    organizationParamsSchema,
} from "./project.validation.js";

const router = Router();

router.post(
    "/organizations/:organizationId/projects",
    authenticate,
    validate({
        params: organizationParamsSchema,
        body: createProjectSchema,
    }),
    projectController.createProject
);

export default router;
import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import projectController from "./project.controller.js";
import {
    createProjectSchema,
    organizationParamsSchema,
    projectParamsSchema,
} from "./project.validation.js";

const router = Router();

router.get("/:projectId", authenticate, validate({params:projectParamsSchema}), projectController.getProjectById)

export default router;
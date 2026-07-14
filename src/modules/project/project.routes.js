import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import projectController from "./project.controller.js";
import {
    createProjectSchema,
    organizationParamsSchema,
    projectParamsSchema,
} from "./project.validation.js";
import listController from "../list/list.controller.js";
import { createListSchema } from "../list/list.validation.js";

const router = Router();

router.get("/:projectId", authenticate, validate({ params: projectParamsSchema }), projectController.getProjectById)
// console.log("/:projectId/lists", "these is hiiting")
router.post("/:projectId/lists", authenticate,
    validate({
        params: projectParamsSchema,
        body: createListSchema,
    }),
    listController.createList)
export default router;
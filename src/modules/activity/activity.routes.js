import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import activityController from "./activity.controller.js";
import { taskParamsSchema } from "./activity.validation.js";

const router = Router();

router.get(
    "/tasks/:taskId/activity",
    authenticate,
    validate({
        params: taskParamsSchema,
    }),
    activityController.getTaskActivity
);

export default router;
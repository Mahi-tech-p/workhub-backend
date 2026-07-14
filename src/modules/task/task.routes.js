import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import taskController from "./task.controller.js";

import {
    createTaskSchema,
    listParamsSchema,
} from "./task.validation.js";

const router = Router();

router.post(
    "/lists/:listId/tasks",
    authenticate,
    validate({
        params: listParamsSchema,
        body: createTaskSchema,
    }),
    taskController.createTask
);

export default router;
import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import taskController from "./task.controller.js";

import {
    createTaskSchema,
    listParamsSchema,
    taskParamsSchema,
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
router.get(
    "/lists/:listId/tasks",
    authenticate,
    validate({
        params: listParamsSchema,
    }),
    taskController.getTasksByList
);
router.get(
    "/tasks/:taskId",
    authenticate,
    validate({
        params: taskParamsSchema,
    }),
    taskController.getTaskById
);

export default router;
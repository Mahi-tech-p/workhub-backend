import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import taskController from "./task.controller.js";

import {
    assignTaskSchema,
    createTaskSchema,
    listParamsSchema,
    moveTaskSchema,
    reorderTasksSchema,
    taskParamsSchema,
    updateTaskSchema,
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
router.patch(
    "/tasks/:taskId/move",
    authenticate,
    validate({
        params: taskParamsSchema,
        body: moveTaskSchema,
    }),
    taskController.moveTask
);
router.get(
    "/tasks/:taskId",
    authenticate,
    validate({
        params: taskParamsSchema,
    }),
    taskController.getTaskById
);
router.patch(
    "/tasks/reorder",
    authenticate,
    validate({
        body: reorderTasksSchema,
    }),
    taskController.reorderTasks
);
router.patch(
    "/tasks/:taskId",
    authenticate,
    validate({
        params: taskParamsSchema,
        body: updateTaskSchema,
    }),
    taskController.updateTask
);
router.delete(
    "/tasks/:taskId",
    authenticate,
    validate({
        params: taskParamsSchema,
    }),
    taskController.deleteTask
);
router.patch(
    "/tasks/:taskId/assign",
    authenticate,
    validate({
        params: taskParamsSchema,
        body: assignTaskSchema,
    }),
    taskController.assignTask
);

export default router;
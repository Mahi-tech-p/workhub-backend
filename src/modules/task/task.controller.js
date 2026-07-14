import { asyncHandler } from "../../utils/asyncHandler.js";
import taskService from "./task.service.js";

const createTask = asyncHandler(async (req, res) => {

    const { listId } = req.params;

    const task =
        await taskService.createTask({
            listId,
            ...req.body,
            userId: req.user.id,
        });

    return res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
    });

});
const getTasksByList = asyncHandler(async (req, res) => {

    const { listId } = req.params;

    const tasks =
        await taskService.getTasksByList({
            listId,
            userId: req.user.id,
        });

    return res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: tasks,
    });

});
const getTaskById = asyncHandler(async (req, res) => {

    const { taskId } = req.params;

    const task = await taskService.getTaskById({
        taskId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Task fetched successfully",
        data: task,
    });

});
const updateTask = asyncHandler(async (req, res) => {

    const { taskId } = req.params;

    const task =
        await taskService.updateTaskById({
            taskId,
            ...req.body,
            userId: req.user.id,
        });

    return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task,
    });

});
const taskController = {
    createTask,
    getTasksByList,
    getTaskById,
    updateTask
};

export default taskController;
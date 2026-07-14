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
const deleteTask = asyncHandler(async (req, res) => {

    const { taskId } = req.params;

    await taskService.deleteTaskById({
        taskId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });

});
const reorderTasks = asyncHandler(async (req, res) => {

    await taskService.reorderTasks({
        tasks: req.body.tasks,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Tasks reordered successfully",
    });

});
const moveTask = asyncHandler(async (req, res) => {

    const { taskId } = req.params;

    await taskService.moveTask({
        taskId,
        ...req.body,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Task moved successfully",
    });

});
const taskController = {
    createTask,
    getTasksByList,
    getTaskById,
    updateTask,
    deleteTask,
    reorderTasks,
    moveTask
};

export default taskController;
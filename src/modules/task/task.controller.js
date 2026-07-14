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

const taskController = {
    createTask,
};

export default taskController;
import { asyncHandler } from "../../utils/asyncHandler.js";
import listService from "./list.service.js";

const createList = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const { name } = req.body;

    const list = await listService.createList({
        projectId,
        name,
        userId: req.user.id,
    });

    return res.status(201).json({
        success: true,
        message: "List created successfully",
        data: list,
    });
});

const listController = {
    createList,
};

export default listController;
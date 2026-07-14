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
const getLists = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const lists = await listService.getLists({
        projectId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Lists fetched successfully",
        data: lists,
    });
});
const getListById = asyncHandler(async (req, res) => {

    const { listId } = req.params;

    const list = await listService.getListById({
        listId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "List fetched successfully",
        data: list,
    });

});
const updateList = asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const { name } = req.body;

    const list = await listService.updateListById({
        listId,
        name,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "List updated successfully",
        data: list,
    });
});
const listController = {
    createList,
    getLists,
    getListById,
    updateList
};

export default listController;
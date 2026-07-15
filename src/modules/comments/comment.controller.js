import { asyncHandler } from "../../utils/asyncHandler.js";
import commentService from "./comment.service.js";

const createComment = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const comment = await commentService.createComment({
        taskId,
        content: req.body.content,
        actorName: req.user.firstName,
        userId: req.user.id,
    });

    return res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: comment,
    });
});

const getComments = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const comments = await commentService.getCommentsByTask({
        taskId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Comments fetched successfully",
        data: comments,
    });
});

const getCommentById = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await commentService.getCommentById({
        commentId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Comment fetched successfully",
        data: comment,
    });
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await commentService.updateCommentById({
        commentId,
        content: req.body.content,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: comment,
    });
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    await commentService.deleteCommentById({
        commentId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
    });
});

const commentController = {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment,
};

export default commentController;
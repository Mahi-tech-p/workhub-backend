import { Router } from "express";

import authenticate from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import commentController from "./comment.controller.js";

import {
    createCommentSchema,
    updateCommentSchema,
    taskParamsSchema,
    commentParamsSchema,
} from "./comment.validation.js";

const router = Router();
console.log("inside comment routes")
// Create Comment
router.post(
    "/tasks/:taskId/comments",
    authenticate,
    validate({
        params: taskParamsSchema,
        body: createCommentSchema,
    }),
    commentController.createComment
);

// Get Comments
router.get(
    "/tasks/:taskId/comments",
    authenticate,
    validate({
        params: taskParamsSchema,
    }),
    commentController.getComments
);

// Get Comment By ID
router.get(
    "/comments/:commentId",
    authenticate,
    validate({
        params: commentParamsSchema,
    }),
    commentController.getCommentById
);

// Update Comment
router.patch(
    "/comments/:commentId",
    authenticate,
    validate({
        params: commentParamsSchema,
        body: updateCommentSchema,
    }),
    commentController.updateComment
);

// Delete Comment
router.delete(
    "/comments/:commentId",
    authenticate,
    validate({
        params: commentParamsSchema,
    }),
    commentController.deleteComment
);

export default router;
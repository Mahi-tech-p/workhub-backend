import { db } from "../../db/index.js";
import { commentRepository } from "./comment.repository.js";
import { taskRepository } from "../task/task.repository.js";
import { listRepository } from "../list/list.repository.js";
import { projectRepository } from "../project/project.repository.js";

import {
    NotFoundError,
    ForbiddenError,
} from "../../errors/index.js";
import activityService from "../activity/activity.service.js";
import { ACTIVITY_ACTIONS, ENTITY_TYPES } from "../../constants/activity.constants.js";

const createComment = async ({
    taskId,
    content,
    userId,
}) => {

    // Check task exists
    const task = await taskRepository.findById(
        db,
        taskId
    );

    if (!task) {
        throw new NotFoundError(
            "Task not found",
            "TASK_NOT_FOUND"
        );
    }

    // Check list exists
    const list = await listRepository.findById(
        db,
        task.listId
    );

    if (!list) {
        throw new NotFoundError(
            "List not found",
            "LIST_NOT_FOUND"
        );
    }

    // Verify project membership
    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "You do not have access to this task",
            "TASK_ACCESS_DENIED"
        );
    }

    const comment =
        await commentRepository.create(
            db,
            {
                taskId,
                userId,
                content,
            }
        );
    
    await activityService.log({
    projectId: list.projectId,
    taskId,
    userId,
    entityType: ENTITY_TYPES.COMMENT,
    action: ACTIVITY_ACTIONS.COMMENTED,
    entityId: comment.id,
    newValue: {
        content: comment.content,
    },
});
    // Return comment with author details
    return await commentRepository.findById(
        db,
        comment.id
    );
};
const getCommentsByTask = async ({
    taskId,
    userId,
}) => {

    const task = await taskRepository.findById(
        db,
        taskId
    );

    if (!task) {
        throw new NotFoundError(
            "Task not found",
            "TASK_NOT_FOUND"
        );
    }

    const list = await listRepository.findById(
        db,
        task.listId
    );

    if (!list) {
        throw new NotFoundError(
            "List not found",
            "LIST_NOT_FOUND"
        );
    }

    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "You do not have access to this task",
            "TASK_ACCESS_DENIED"
        );
    }

    return await commentRepository.findByTaskId(
        db,
        taskId
    );
};
const getCommentById = async ({
    commentId,
    userId,
}) => {

    const comment =
        await commentRepository.findById(
            db,
            commentId
        );

    if (!comment) {
        throw new NotFoundError(
            "Comment not found",
            "COMMENT_NOT_FOUND"
        );
    }

    const task =
        await taskRepository.findById(
            db,
            comment.taskId
        );

    const list =
        await listRepository.findById(
            db,
            task.listId
        );

    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "You do not have access to this comment",
            "COMMENT_ACCESS_DENIED"
        );
    }

    return comment;
};
const updateCommentById = async ({
    commentId,
    content,
    userId,
}) => {

    const comment =
        await commentRepository.findById(
            db,
            commentId
        );

    if (!comment) {
        throw new NotFoundError(
            "Comment not found",
            "COMMENT_NOT_FOUND"
        );
    }

    const task =
        await taskRepository.findById(
            db,
            comment.taskId
        );

    const list =
        await listRepository.findById(
            db,
            task.listId
        );

    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "You do not have access to this comment",
            "COMMENT_ACCESS_DENIED"
        );
    }

    // Owner of comment OR project OWNER/ADMIN
    const canEdit =
        comment.author.id === userId ||
        ["OWNER", "ADMIN"].includes(member.role);

    if (!canEdit) {
        throw new ForbiddenError(
            "You do not have permission to update this comment",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    return await commentRepository.update(
        db,
        commentId,
        {
            content,
        }
    );
};
const deleteCommentById = async ({
    commentId,
    userId,
}) => {

    const comment =
        await commentRepository.findById(
            db,
            commentId
        );

    if (!comment) {
        throw new NotFoundError(
            "Comment not found",
            "COMMENT_NOT_FOUND"
        );
    }

    const task =
        await taskRepository.findById(
            db,
            comment.taskId
        );

    const list =
        await listRepository.findById(
            db,
            task.listId
        );

    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "You do not have access to this comment",
            "COMMENT_ACCESS_DENIED"
        );
    }

    const canDelete =
        comment.author.id === userId ||
        ["OWNER", "ADMIN"].includes(member.role);

    if (!canDelete) {
        throw new ForbiddenError(
            "You do not have permission to delete this comment",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    await commentRepository.remove(
        db,
        commentId
    );
};
const commentService = {
    createComment,
    getCommentsByTask,
    getCommentById,
    updateCommentById,
    deleteCommentById,
};

export default commentService;
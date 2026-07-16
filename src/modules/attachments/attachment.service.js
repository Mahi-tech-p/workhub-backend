import { db } from "../../db/index.js";

import { attachmentRepository } from "./attachment.repository.js";
import { taskRepository } from "../task/task.repository.js";
import { listRepository } from "../list/list.repository.js";
import { projectRepository } from "../project/project.repository.js";

import activityService from "../activity/activity.service.js";
import { s3Service } from "../../services/storage/s3.service.js";

import {
    NotFoundError,
    ForbiddenError,
} from "../../errors/index.js";

import {
    ENTITY_TYPES,
    ACTIVITY_ACTIONS,
} from "../activity/activity.constants.js";

const uploadAttachment = async ({
    taskId,
    file,
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
            "Project access denied",
            "PROJECT_ACCESS_DENIED"
        );
    }

    // Upload to S3
    const uploadedFile =
        await s3Service.upload(file);

    const attachment = await db.transaction(
        async (tx) => {

            const created =
                await attachmentRepository.create(
                    tx,
                    {
                        taskId,
                        uploadedBy: userId,
                        fileName:
                            uploadedFile.fileName,
                        originalName:
                            file.originalname,
                        objectKey:
                            uploadedFile.objectKey,
                        mimeType:
                            file.mimetype,
                        size: file.size,
                        url: uploadedFile.url,
                    }
                );

            await activityService.log(tx, {
                projectId: list.projectId,
                taskId,
                userId,
                entityType:
                    ENTITY_TYPES.ATTACHMENT,
                action:
                    ACTIVITY_ACTIONS.ATTACHMENT_UPLOADED,
                entityId: created.id,
                newValue: {
                    fileName:
                        file.originalname,
                },
            });

            return created;
        }
    );

    return attachment;
};

const getTaskAttachments = async ({
    taskId,
    userId,
}) => {

    const task =
        await taskRepository.findById(
            db,
            taskId
        );

    if (!task) {
        throw new NotFoundError(
            "Task not found",
            "TASK_NOT_FOUND"
        );
    }

    const list =
        await listRepository.findById(
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
            "Project access denied",
            "PROJECT_ACCESS_DENIED"
        );
    }

    return await attachmentRepository.findByTaskId(
        db,
        taskId
    );
};

const deleteAttachment = async ({
    attachmentId,
    userId,
}) => {

    const attachment =
        await attachmentRepository.findById(
            db,
            attachmentId
        );

    if (!attachment) {
        throw new NotFoundError(
            "Attachment not found",
            "ATTACHMENT_NOT_FOUND"
        );
    }

    const task =
        await taskRepository.findById(
            db,
            attachment.taskId
        );

    if (!task) {
        throw new NotFoundError(
            "Task not found",
            "TASK_NOT_FOUND"
        );
    }

    const list =
        await listRepository.findById(
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
            "Project access denied",
            "PROJECT_ACCESS_DENIED"
        );
    }

    await db.transaction(async (tx) => {

        await attachmentRepository.deleteById(
            tx,
            attachmentId
        );

        await activityService.log(tx, {
            projectId: list.projectId,
            taskId: task.id,
            userId,
            entityType:
                ENTITY_TYPES.ATTACHMENT,
            action:
                ACTIVITY_ACTIONS.ATTACHMENT_DELETED,
            entityId: attachment.id,
            oldValue: {
                fileName:
                    attachment.originalName,
            },
        });

    });

    // Delete from S3 after DB transaction succeeds
    await s3Service.delete(
        attachment.objectKey
    );
};

const attachmentService = {
    uploadAttachment,
    getTaskAttachments,
    deleteAttachment,
};

export default attachmentService;
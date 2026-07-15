import { db } from "../db/index.js";

import { projectRepository } from "../modules/project/project.repository.js";
import { listRepository } from "../modules/list/list.repository.js";
import { taskRepository } from "../modules/task/task.repository.js";

import {
    ForbiddenError,
    NotFoundError,
} from "../errors/index.js";

const authorizeProjectAccess = async (
    projectId,
    userId
) => {
    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "You do not have access to this project",
            "PROJECT_ACCESS_DENIED"
        );
    }

    return member;
};

const authorizeListAccess = async (
    listId,
    userId
) => {
    const list = await listRepository.findById(
        db,
        listId
    );

    if (!list) {
        throw new NotFoundError(
            "List not found",
            "LIST_NOT_FOUND"
        );
    }

    const member = await authorizeProjectAccess(
        list.projectId,
        userId
    );

    return {
        list,
        member,
    };
};

const authorizeTaskAccess = async (
    taskId,
    userId
) => {
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

    const {
        list,
        member,
    } = await authorizeListAccess(
        task.listId,
        userId
    );

    return {
        task,
        list,
        member,
    };
};

const requireProjectRoles = (
    member,
    roles
) => {
    if (!roles.includes(member.role)) {
        throw new ForbiddenError(
            "You do not have permission to perform this action",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    return member;
};

export {
    authorizeProjectAccess,
    authorizeListAccess,
    authorizeTaskAccess,
    requireProjectRoles,
};
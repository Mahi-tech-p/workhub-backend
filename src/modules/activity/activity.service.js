import { db } from "../../db/index.js";

import { activityRepository } from "./activity.repository.js";
import { taskRepository } from "../task/task.repository.js";
import { listRepository } from "../list/list.repository.js";
import { projectRepository } from "../project/project.repository.js";

import {
    NotFoundError,
    ForbiddenError,
} from "../../errors/index.js";
import { authorizeProjectAccess } from "../../authorization/project.authorization.js";

const log = async ({
    projectId,
    taskId = null,
    userId,
    entityType,
    action,
    entityId,
    oldValue = null,
    newValue = null,
}) => {
    return await activityRepository.create(db, {
        projectId,
        taskId,
        userId,
        entityType,
        action,
        entityId,
        oldValue,
        newValue,
    });
};

// const getTaskActivity = async ({
//     taskId,
//     userId,
// }) => {

//     // Check task exists
//     const task = await taskRepository.findById(
//         db,
//         taskId
//     );

//     if (!task) {
//         throw new NotFoundError(
//             "Task not found",
//             "TASK_NOT_FOUND"
//         );
//     }

//     // Check list exists
//     const list = await listRepository.findById(
//         db,
//         task.listId
//     );

//     if (!list) {
//         throw new NotFoundError(
//             "List not found",
//             "LIST_NOT_FOUND"
//         );
//     }

//     // Verify project membership
//     const member =
//         await projectRepository.findProjectMemberByUserId(
//             db,
//             list.projectId,
//             userId
//         );

//     if (!member) {
//         throw new ForbiddenError(
//             "You do not have access to this task",
//             "TASK_ACCESS_DENIED"
//         );
//     }

//     return await activityRepository.findByTaskId(
//         db,
//         taskId
//     );
// };
const getTaskActivity = async ({
    taskId,
    userId,
}) => {

    const activities = await activityRepository.findByTaskId(
        db,
        taskId
    );

    if (activities.length === 0) {
        throw new NotFoundError(
            "No activity found",
            "ACTIVITY_NOT_FOUND"
        );
    }

    await authorizeProjectAccess(
        activities[0].projectId,
        userId
    );

    return activities;
};
const activityService = {
    log,
    getTaskActivity,
};

export default activityService;
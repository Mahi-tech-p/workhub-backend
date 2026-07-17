import { db } from "../../db/index.js";

import { taskRepository } from "./task.repository.js";
import { listRepository } from "../list/list.repository.js";
import { projectRepository } from "../project/project.repository.js";
import { authRepository } from "../auth/auth.repository.js";
import activityService from "../activity/activity.service.js";
import ConflictError from "../../errors/ConflictError.js";
import ForbiddenError from "../../errors/ForbiddenError.js";
import NotFoundError from "../../errors/NotFoundError.js";
import {
    ENTITY_TYPES,
    ACTIVITY_ACTIONS,
} from "../../constants/activity.constants.js";
import { NOTIFICATION_TITLES, NOTIFICATION_TYPES } from "../../constants/notification.constants.js";
import notificationService from "../notifications/notification.service.js";

const createTask = async ({
    listId,
    title,
    description,
    priority,
    dueDate,
    assigneeId,
    userId,
}) => {

    // Check list exists
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

    // Check project membership
    const projectMember =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!projectMember) {
        throw new ForbiddenError(
            "You do not have access to this project",
            "PROJECT_ACCESS_DENIED"
        );
    }

    // Check permission
    if (!["OWNER", "ADMIN"].includes(projectMember.role)) {
        throw new ForbiddenError(
            "You do not have permission to create tasks",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    // Duplicate title in same list
    const existingTask =
        await taskRepository.findByTitle(
            db,
            listId,
            title
        );

    if (existingTask) {
        throw new ConflictError(
            "Task already exists",
            "TASK_ALREADY_EXISTS"
        );
    }

    // Validate assignee
    if (assigneeId) {

        const assignee =
            await authRepository.findUserByID(
                assigneeId
            );

        if (!assignee) {
            throw new NotFoundError(
                "Assignee not found",
                "ASSIGNEE_NOT_FOUND"
            );
        }

        // Verify assignee belongs to project
        const assigneeMember =
            await projectRepository.findProjectMemberByUserId(
                db,
                list.projectId,
                assigneeId
            );

        if (!assigneeMember) {
            throw new ConflictError(
                "Assignee is not a project member",
                "INVALID_ASSIGNEE"
            );
        }

    }


    const taskCreated = await db.transaction(async (tx) => {
        const maxPosition =
            await taskRepository.getMaxPosition(
                db,
                listId
            );
        const task =
            await taskRepository.create(
                tx,
                {
                    listId,
                    title,
                    description,
                    priority,
                    dueDate,
                    assigneeId,
                    position: maxPosition + 1,
                    createdBy: userId,
                }
            );

        await activityService.log(tx, {
            projectId: list.projectId,
            taskId: task.id,
            userId,
            entityType: ENTITY_TYPES.TASK,
            action: ACTIVITY_ACTIONS.CREATED,
            entityId: task.id,
            newValue: {
                title: task.title,
                priority: task.priority,
                list: list.name,
            },
        });

        if (assigneeId) {
            await notificationService.createNotification(tx, {
                userId: assigneeId,
                type: NOTIFICATION_TYPES.TASK_ASSIGNED,
                title: NOTIFICATION_TITLES.TASK_ASSIGNED,
                message: `You have been assigned "${task.title}"`,
                entityType: ENTITY_TYPES.TASK,
                entityId: task.id,
            });
        }
        return task;
    })
    return taskCreated
};
const getTasksByList = async ({
    listId,
    userId,
}) => {

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

    const projectMember =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!projectMember) {
        throw new ForbiddenError(
            "You do not have access to this project",
            "PROJECT_ACCESS_DENIED"
        );
    }

    return await taskRepository.findByListId(
        db,
        listId
    );
};

const getTaskById = async ({
    taskId,
    userId,
}) => {

    // Find task
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

    // Find list
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

    // Verify membership
    const projectMember =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!projectMember) {
        throw new ForbiddenError(
            "You do not have access to this task",
            "TASK_ACCESS_DENIED"
        );
    }

    return task;
};
const updateTaskById = async ({
    taskId,
    title,
    description,
    priority,
    dueDate,
    assigneeId,
    userId,
}) => {

    // Find task
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

    // Find list
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

    // Check membership
    const projectMember =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!projectMember) {
        throw new ForbiddenError(
            "You do not have access to this project",
            "PROJECT_ACCESS_DENIED"
        );
    }

    // Check permission
    if (!["OWNER", "ADMIN"].includes(projectMember.role)) {
        throw new ForbiddenError(
            "You do not have permission to update tasks",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    // Validate assignee
    if (assigneeId) {

        const assignee =
            await authRepository.findUserByID(
                assigneeId
            );

        if (!assignee) {
            throw new NotFoundError(
                "Assignee not found",
                "ASSIGNEE_NOT_FOUND"
            );
        }

        const assigneeMember =
            await projectRepository.findProjectMemberByUserId(
                db,
                list.projectId,
                assigneeId
            );

        if (!assigneeMember) {
            throw new ConflictError(
                "Assignee is not a project member",
                "INVALID_ASSIGNEE"
            );
        }
    }
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    const oldTask = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        assigneeId: task.assigneeId,
    };
    const updatedTask =
        await taskRepository.update(
            db,
            taskId,
            updateData
        );
    await activityService.log(db,{
        projectId: list.projectId,
        taskId: task.id,
        userId,
        entityType: ENTITY_TYPES.TASK,
        action: ACTIVITY_ACTIONS.UPDATED,
        entityId: task.id,
        oldValue: {
            title: oldTask.title,
            priority: oldTask.priority,
            dueDate: oldTask.dueDate,
        },
        newValue: {
            title: updatedTask.title,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate,
        },
    });
    return updatedTask;
};
const deleteTaskById = async ({
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

    const projectMember =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!projectMember) {
        throw new ForbiddenError(
            "You do not have access to this project",
            "PROJECT_ACCESS_DENIED"
        );
    }

    if (!["OWNER", "ADMIN"].includes(projectMember.role)) {
        throw new ForbiddenError(
            "You do not have permission to delete tasks",
            "INSUFFICIENT_PERMISSIONS"
        );
    }
    const deletedTask = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        assigneeId: task.assigneeId,
    };
    await activityService.log({
        projectId: list.projectId,
        taskId: task.id,
        userId,
        entityType: ENTITY_TYPES.TASK,
        action: ACTIVITY_ACTIONS.DELETED,
        entityId: task.id,
        oldValue: deletedTask
    });
    await taskRepository.remove(
        db,
        taskId
    );


    return;
};
const reorderTasks = async ({
    tasks,
    userId,
}) => {

    const taskIds = tasks.map(task => task.id);

    const existingTasks =
        await taskRepository.findByIds(
            db,
            taskIds
        );

    if (existingTasks.length !== taskIds.length) {
        throw new NotFoundError(
            "One or more tasks not found",
            "TASK_NOT_FOUND"
        );
    }

    // Ensure all belong to same list
    const listId = existingTasks[0].listId;

    const sameList = existingTasks.every(
        task => task.listId === listId
    );

    if (!sameList) {
        throw new ConflictError(
            "Tasks must belong to same list",
            "INVALID_TASKS"
        );
    }

    const list =
        await listRepository.findById(
            db,
            listId
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

    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ForbiddenError(
            "Insufficient permissions",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    // Duplicate positions
    const positions =
        tasks.map(task => task.position);

    if (
        new Set(positions).size !==
        positions.length
    ) {
        throw new ConflictError(
            "Duplicate positions are not allowed",
            "INVALID_POSITIONS"
        );
    }

    await db.transaction(async (tx) => {

        for (const task of tasks) {

            await taskRepository.updatePosition(
                tx,
                task.id,
                task.position,
                listId
            );

        }

    });

};
const moveTask = async ({
    taskId,
    destinationListId,
    position,
    userId,
}) => {

    // Find task
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

    // Source list
    const sourceList =
        await listRepository.findById(
            db,
            task.listId
        );

    if (!sourceList) {
        throw new NotFoundError(
            "Source list not found",
            "LIST_NOT_FOUND"
        );
    }

    // Destination list
    const destinationList =
        await listRepository.findById(
            db,
            destinationListId
        );

    if (!destinationList) {
        throw new NotFoundError(
            "Destination list not found",
            "LIST_NOT_FOUND"
        );
    }

    // Prevent cross-project moves
    if (
        sourceList.projectId !==
        destinationList.projectId
    ) {
        throw new ConflictError(
            "Cannot move task across projects",
            "INVALID_MOVE"
        );
    }

    // Permission
    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            sourceList.projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "Project access denied",
            "PROJECT_ACCESS_DENIED"
        );
    }

    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ForbiddenError(
            "Insufficient permissions",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    await db.transaction(async (tx) => {

        // Close gap in source list
        await taskRepository.decrementPositionsAfter(
            tx,
            task.listId,
            task.position
        );

        // Make room in destination list
        await taskRepository.incrementPositionsFrom(
            tx,
            destinationListId,
            position
        );

        // Move task
        await taskRepository.updatePosition(
            tx,
            taskId,
            position,
            destinationListId
        );

    });
    if (sourceList.id !== destinationList.id) {
        await activityService.log(tx,{
            projectId: sourceList.projectId,
            taskId: task.id,
            userId,
            entityType: ENTITY_TYPES.TASK,
            action: ACTIVITY_ACTIONS.MOVED,
            entityId: task.id,
            oldValue: {
                listId: sourceList.id,
                listName: sourceList.name,
            },
            newValue: {
                listId: destinationList.id,
                listName: destinationList.name,
            },
        });
    }
};
const assignTask = async ({
    taskId,
    assigneeId,
    userId,
}) => {

    // Find task
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

    // Find list
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

    // Verify current user is a project member
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

    // Only OWNER & ADMIN can assign tasks
    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ForbiddenError(
            "Insufficient permissions",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    // Verify assignee is a project member
    const assignee =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            assigneeId
        );

    if (!assignee) {
        throw new ConflictError(
            "Assignee is not a project member",
            "INVALID_ASSIGNEE"
        );
    }
    const previousAssigneeId = task.assigneeId;
    const updatedTask = await db.transaction(async (tx) => {
        // Update assignee
        const task =
            await taskRepository.assignTask(
                tx,
                taskId,
                assigneeId
            );

        // Log activity
        await activityService.log(tx, {
            projectId: list.projectId,
            taskId: task.id,
            userId,
            entityType: ENTITY_TYPES.TASK,
            action: ACTIVITY_ACTIONS.ASSIGNED,
            entityId: task.id,
            oldValue: {
                assigneeId: previousAssigneeId,
            },
            newValue: {
                assigneeId,
            },
        });

        // Create notification
        await notificationService.createNotification(tx, {
            userId: assigneeId,
            type: NOTIFICATION_TYPES.TASK_ASSIGNED,
            title: NOTIFICATION_TITLES.TASK_ASSIGNED,
            message: `You have been assigned "${task.title}"`,
            entityType: "TASK",
            entityId: task.id,
        });

        return task;
    })
};
const taskService = {
    createTask,
    getTasksByList,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    reorderTasks,
    moveTask,
    assignTask
};

export default taskService;
import { db } from "../../db/index.js";

import { taskRepository } from "./task.repository.js";
import { listRepository } from "../list/list.repository.js";
import { projectRepository } from "../project/project.repository.js";
import { authRepository } from "../auth/auth.repository.js";

import ConflictError from "../../errors/ConflictError.js";
import ForbiddenError from "../../errors/ForbiddenError.js";
import NotFoundError from "../../errors/NotFoundError.js";

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

    const maxPosition =
        await taskRepository.getMaxPosition(
            db,
            listId
        );

    const task =
        await taskRepository.create(
            db,
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

    return task;

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

    const updatedTask =
        await taskRepository.update(
            db,
            taskId,
            updateData
        );

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

    await taskRepository.remove(
        db,
        taskId
    );

    return;
};
const taskService = {
    createTask,
    getTasksByList,
    getTaskById,
    updateTaskById,
    deleteTaskById
};

export default taskService;
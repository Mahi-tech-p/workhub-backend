import { db } from "../../db/index.js";

import { listRepository } from "./list.repository.js";
import { projectRepository } from "../project/project.repository.js";

import ConflictError from "../../errors/ConflictError.js";
import ForbiddenError from "../../errors/ForbiddenError.js";
import NotFoundError from "../../errors/NotFoundError.js";

const createList = async ({
    projectId,
    name,
    userId,
}) => {

    // Check project exists
    const project = await projectRepository.findById(
        db,
        projectId
    );

    if (!project) {
        throw new NotFoundError(
            "Project not found",
            "PROJECT_NOT_FOUND"
        );
    }

    // Check project membership
    const member = await projectRepository.findProjectMemberByUserId(
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

    // Check permission
    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ForbiddenError(
            "You do not have permission to create lists",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    // Check duplicate list name
    const existingList = await listRepository.findByName(
        db,
        projectId,
        name
    );

    if (existingList) {
        throw new ConflictError(
            "List already exists",
            "LIST_ALREADY_EXISTS"
        );
    }

    // Get next position
    const maxPosition = await listRepository.getMaxPosition(
        db,
        projectId
    );

    try {
        const list = await listRepository.create(db, {
            projectId,
            name,
            position: maxPosition + 1,
            createdBy: userId,
        });

        return list;

    } catch (error) {

        if (error.code === "23505") {
            throw new ConflictError(
                "List already exists",
                "LIST_ALREADY_EXISTS"
            );
        }

        throw error;
    }
};
const getLists = async ({ projectId, userId }) => {
    const project = await projectRepository.findById(db, projectId);

    if (!project) {
        throw new NotFoundError(
            "Project not found",
            "PROJECT_NOT_FOUND"
        );
    }

    const member = await projectRepository.findProjectMemberByUserId(
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

    return await listRepository.findByProjectId(
        db,
        projectId
    );
};
const getListById = async ({
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

    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            list.projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "You do not have access to this list",
            "LIST_ACCESS_DENIED"
        );
    }

    return list;
};

const updateListById = async ({
    listId,
    name,
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
            "You do not have access to this list",
            "LIST_ACCESS_DENIED"
        );
    }
    if (!["OWNER", "ADMIN"].includes(projectMember.role)) {
        throw new ForbiddenError(
            "You do not have permission to update this list",
            "INSUFFICIENT_PERMISSIONS"
        );
    }
    const existingList = await listRepository.findByName(
        db,
        list.projectId,
        name
    );

    if (existingList && existingList.id !== list.id) {
        throw new ConflictError(
            "List with this name already exists",
            "LIST_ALREADY_EXISTS"
        );
    }
    if (list.name === name) {
        return list;
    }
    // Update list
    const updatedList = await listRepository.update(
        db,
        listId,
        {
            name,
        }
    );

    return updatedList;
};
const deleteListById = async ({
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
            "You do not have access to this list",
            "LIST_ACCESS_DENIED"
        );
    }

    if (!["OWNER", "ADMIN"].includes(projectMember.role)) {
        throw new ForbiddenError(
            "You do not have permission to delete this list",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    await listRepository.remove(
        db,
        listId
    );

    return;
};

const listService = {
    createList,
    getLists,
    getListById,
    updateListById,
    deleteListById
};

export default listService;
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

const listService = {
    createList,
};

export default listService;
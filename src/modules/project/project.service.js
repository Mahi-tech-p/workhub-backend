import slugify from "slugify";

import { db } from "../../db/index.js";
import { organizationRepository } from "../organization/organization.repository.js";
import { projectRepository } from "./project.repository.js";

import ConflictError from "../../errors/ConflictError.js";
import ForbiddenError from "../../errors/ForbiddenError.js";
import NotFoundError from "../../errors/NotFoundError.js";

const createProject = async ({
    organizationId,
    name,
    description,
    userId,
}) => {

    const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
    });
    console.log("organizationId:", organizationId);
    console.log("userId:", userId);
    // Verify user belongs to organization
    const member = await organizationRepository.findMemberByUserId(
        db,
        organizationId,
        userId
    );

    console.log("Member:", member);
    if (!member) {
        throw new NotFoundError(
            "Organization not found",
            "ORGANIZATION_NOT_FOUND"
        );
    }

    // Verify permission
    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ForbiddenError(
            "You don't have permission to create projects",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    // Check duplicate slug
    const existingProject = await projectRepository.findBySlug(
        db,
        organizationId,
        slug
    );

    if (existingProject) {
        throw new ConflictError(
            "Project already exists",
            "PROJECT_ALREADY_EXISTS"
        );
    }

    try {
        const project = await db.transaction(async (tx) => {

            const createdProject =
                await projectRepository.createProject(tx, {
                    organizationId,
                    name,
                    slug,
                    description,
                    createdBy: userId,
                });

            await projectRepository.addMemberToProject(tx, {
                projectId: createdProject.id,
                userId,
                role: "OWNER",
            });

            return createdProject;
        });

        return project;

    } catch (error) {

        if (error.code === "23505") {
            throw new ConflictError(
                "Project already exists",
                "PROJECT_ALREADY_EXISTS"
            );
        }

        throw error;
    }
};

const getProjects = async({
    organizationId, userId
}) => {
    const member = await organizationRepository.findMemberByUserId(db, organizationId, userId)
     if (!member) {
        throw new NotFoundError(
            "Organization not found or you are not a member",
            "ORGANIZATION_NOT_FOUND"
        );
    }

    return await projectRepository.findByOrganizationId(
        db,
        organizationId
    );
}

const getProjectsByID = async ({ projectId, userId }) => {
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

    return project;
}
const projectService = {
    createProject,
    getProjects,
    getProjectsByID
};

export default projectService;
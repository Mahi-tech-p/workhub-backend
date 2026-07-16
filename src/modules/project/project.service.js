import slugify from "slugify";

import { db } from "../../db/index.js";
import { organizationRepository } from "../organization/organization.repository.js";
import { projectRepository } from "./project.repository.js";

import ConflictError from "../../errors/ConflictError.js";
import ForbiddenError from "../../errors/ForbiddenError.js";
import NotFoundError from "../../errors/NotFoundError.js";
import notificationService from "../notifications/notification.service.js";

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
    // console.log("organizationId:", organizationId);
    // console.log("userId:", userId);
    // Verify user belongs to organization
    const member = await organizationRepository.findMemberByUserId(
        db,
        organizationId,
        userId
    );

    // console.log("Member:", member);
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

            await projectRepository.createProjectMember(tx, {
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

const getProjects = async ({
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
const addProjectMember = async ({
    projectId,
    userId,
    role,
    currentUserId,
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

    // Check current user is project member
    const currentMember =
        await projectRepository.findProjectMemberByUserId(
            db,
            projectId,
            currentUserId
        );

    if (!currentMember) {
        throw new ForbiddenError(
            "Project access denied",
            "PROJECT_ACCESS_DENIED"
        );
    }

    // Only OWNER & ADMIN can add members
    if (!["OWNER", "ADMIN"].includes(currentMember.role)) {
        throw new ForbiddenError(
            "Insufficient permissions",
            "INSUFFICIENT_PERMISSIONS"
        );
    }
    
    // User must belong to organization
    const organizationMember =
        await projectRepository.findMemberByUserId(
            db,
            project.organizationId,
            userId
        );

    if (!organizationMember) {
        throw new ConflictError(
            "User is not an organization member",
            "INVALID_MEMBER"
        );
    }

    // Prevent duplicate members
    const existingMember =
        await projectRepository.findProjectMemberByUserId(
            db,
            projectId,
            userId
        );

    if (existingMember) {
        throw new ConflictError(
            "User is already a project member",
            "PROJECT_MEMBER_EXISTS"
        );
    }

    const member =
        await projectRepository.createProjectMember(
            db,
            {
                projectId,
                userId,
                role,
            }
        );

    // Notification
    await notificationService.createNotification({
        userId,
        type: NOTIFICATION_TYPES.PROJECT_INVITATION,
        title: NOTIFICATION_TITLES.PROJECT_INVITATION,
        message: `You have been added to project "${project.name}"`,
        entityType: ENTITY_TYPES.PROJECT,
        entityId: project.id,
    });

    return member;
};

const getProjectMembers = async ({
    projectId,
    userId,
}) => {

    const project =
        await projectRepository.findById(
            db,
            projectId
        );

    if (!project) {
        throw new NotFoundError(
            "Project not found",
            "PROJECT_NOT_FOUND"
        );
    }

    const member =
        await projectRepository.findProjectMemberByUserId(
            db,
            projectId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "Project access denied",
            "PROJECT_ACCESS_DENIED"
        );
    }

    return await projectRepository.findMembersByProjectId(
        db,
        projectId
    );
};

const removeProjectMember = async ({
    projectId,
    memberId,
    userId,
}) => {

    const project =
        await projectRepository.findById(
            db,
            projectId
        );

    if (!project) {
        throw new NotFoundError(
            "Project not found",
            "PROJECT_NOT_FOUND"
        );
    }

    const currentMember =
        await projectRepository.findProjectMemberByUserId(
            db,
            projectId,
            userId
        );

    if (!currentMember) {
        throw new ForbiddenError(
            "Project access denied",
            "PROJECT_ACCESS_DENIED"
        );
    }

    if (!["OWNER", "ADMIN"].includes(currentMember.role)) {
        throw new ForbiddenError(
            "Insufficient permissions",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    const member =
        await projectRepository.findProjectMemberById(
            db,
            memberId
        );

    if (!member) {
        throw new NotFoundError(
            "Project member not found",
            "PROJECT_MEMBER_NOT_FOUND"
        );
    }

    if (member.role === "OWNER") {
        throw new ConflictError(
            "Project owner cannot be removed",
            "OWNER_CANNOT_BE_REMOVED"
        );
    }

    await projectRepository.removeProjectMember(
        db,
        memberId
    );
};
const projectService = {
    createProject,
    getProjects,
    getProjectsByID,
    addProjectMember,
    getProjectMembers,
    removeProjectMember
};

export default projectService;
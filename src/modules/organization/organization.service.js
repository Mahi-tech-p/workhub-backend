
import slugify from "slugify";
import { organizationRepository } from "./organization.repository.js";
import { db } from "../../db/index.js";
import ConflictError from "../../errors/ConflictError.js";
import { NOTIFICATION_TYPES } from "../../constants/notification.constants.js";

const createOrganization = async ({ name, userId }) => {
    const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true
    })

    const exisitingOrg = await organizationRepository.findBySlug(db, slug)
    if (exisitingOrg) {
        throw new ConflictError(
            "Organization with this name already exists",
            "ORGANIZATION_ALREADY_EXISTS"
        );
    }
    try {
        const organization = await db.transaction(async (tx) => {
            const createdOrganization =
                await organizationRepository.createOrganization(tx, {
                    name,
                    slug,
                    ownerId: userId,
                });

            await organizationRepository.addMemberToOrganization(tx, {
                organizationId: createdOrganization.id,
                userId,
                role: "OWNER",
            });

            return createdOrganization;
        });

        return organization;
    } catch (error) {
        if (error.code === "23505") {
            throw new ConflictError(
                "Organization with this name already exists",
                "ORGANIZATION_ALREADY_EXISTS"
            );
        }

        throw error;
    }
}

const getOrganizationByUserId = async (userId) => {
    const result = await organizationRepository.findByUserId(db, userId)
    return result
}
const addOrganizationMember = async ({
    organizationId,
    userId,
    role,
    currentUserId,
}) => {

    // Check organization exists
    const organization =
        await organizationRepository.findById(
            db,
            organizationId
        );

    if (!organization) {
        throw new NotFoundError(
            "Organization not found",
            "ORGANIZATION_NOT_FOUND"
        );
    }

    // Check current user belongs to organization
    const currentMember =
        await organizationRepository.findMemberByUserId(
            db,
            organizationId,
            currentUserId
        );

    if (!currentMember) {
        throw new ForbiddenError(
            "Organization access denied",
            "ORGANIZATION_ACCESS_DENIED"
        );
    }

    // Only OWNER & ADMIN can add members
    if (!["OWNER", "ADMIN"].includes(currentMember.role)) {
        throw new ForbiddenError(
            "Insufficient permissions",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    // Prevent duplicate members
    const existingMember =
        await organizationRepository.findMemberByUserId(
            db,
            organizationId,
            userId
        );

    if (existingMember) {
        throw new ConflictError(
            "User is already an organization member",
            "ORGANIZATION_MEMBER_EXISTS"
        );
    }

    const member =
        await organizationRepository.addMemberToOrganization(
            db,
            {
                organizationId,
                userId,
                role,
            }
        );

    await notificationService.createNotification({
        userId,
        type: NOTIFICATION_TYPES.ORGANIZATION_INVITATION,
        title: "Organization Invitation",
        message: `You have been added to organization "${organization.name}"`,
        entityType: ENTITY_TYPES.ORGANIZATION,
        entityId: organization.id,
    });

    return member;
};
const getOrganizationMembers = async ({
    organizationId,
    userId,
}) => {

    const organization =
        await organizationRepository.findById(
            db,
            organizationId
        );

    if (!organization) {
        throw new NotFoundError(
            "Organization not found",
            "ORGANIZATION_NOT_FOUND"
        );
    }

    const member =
        await organizationRepository.findMemberByUserId(
            db,
            organizationId,
            userId
        );

    if (!member) {
        throw new ForbiddenError(
            "Organization access denied",
            "ORGANIZATION_ACCESS_DENIED"
        );
    }

    return await organizationRepository.findOrganizationMembers(
        db,
        organizationId
    );
};
const removeOrganizationMember = async ({
    organizationId,
    memberId,
    userId,
}) => {

    const organization =
        await organizationRepository.findById(
            db,
            organizationId
        );

    if (!organization) {
        throw new NotFoundError(
            "Organization not found",
            "ORGANIZATION_NOT_FOUND"
        );
    }

    const currentMember =
        await organizationRepository.findMemberByUserId(
            db,
            organizationId,
            userId
        );

    if (!currentMember) {
        throw new ForbiddenError(
            "Organization access denied",
            "ORGANIZATION_ACCESS_DENIED"
        );
    }

    if (!["OWNER", "ADMIN"].includes(currentMember.role)) {
        throw new ForbiddenError(
            "Insufficient permissions",
            "INSUFFICIENT_PERMISSIONS"
        );
    }

    const member =
        await organizationRepository.findOrganizationMemberById(
            db,
            memberId
        );

    if (!member) {
        throw new NotFoundError(
            "Organization member not found",
            "ORGANIZATION_MEMBER_NOT_FOUND"
        );
    }

    if (member.role === "OWNER") {
        throw new ConflictError(
            "Organization owner cannot be removed",
            "OWNER_CANNOT_BE_REMOVED"
        );
    }

    await organizationRepository.removeOrganizationMember(
        db,
        memberId
    );
};
export const organisationService = {
    createOrganization,
    getOrganizationByUserId,
    addOrganizationMember,
    getOrganizationMembers,
    removeOrganizationMember
}
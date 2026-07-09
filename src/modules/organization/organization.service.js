
import slugify from "slugify";
import { organizationRepository } from "./organization.repository.js";
import { db } from "../../db/index.js";
import ConflictError from "../../errors/ConflictError.js";

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
export const organisationService = {
    createOrganization,
    getOrganizationByUserId
}
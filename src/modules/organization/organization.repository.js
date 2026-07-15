import { desc, eq ,and} from "drizzle-orm";
import { organizationMembers } from "../../db/schema/organizationMembers.js";
import { organizations } from "../../db/schema/organizations.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
const createOrganization = async (database, data) => {

    const result = await database
        .insert(organizations)
        .values(data)
        .returning();
    return result[0] ?? null;
}

const addMemberToOrganization = async (database, data) => {
    const result = await database
        .insert(organizationMembers)
        .values(data)
        .returning();
    return result[0] ?? null;
}

const findBySlug = async (database, slug) => {
    const result = await database
        .select()
        .from(organizations)
        .where(eq(organizations.slug, slug))
    return result[0] ?? null;
}
const findByUserId = async (database, userId) => {
    const result =  await database
        .select({
            id: organizations.id,
            name: organizations.name,
            slug: organizations.slug,
            ownerId: organizations.ownerId,
            membership: {
                role: organizationMembers.role,
                joinedAt: organizationMembers.joinedAt,
            },
            createdAt: organizations.createdAt,
        })
        .from(organizationMembers)
        .innerJoin(
            organizations,
            eq(
                organizationMembers.organizationId,
                organizations.id
            )
        )
        .where(eq(organizationMembers.userId, userId))
        .orderBy(desc(organizations.createdAt));
    return result;
}
const findMemberByUserId = async (
    database,
    organizationId,
    userId
) => {
    const result = await database
        .select()
        .from(organizationMembers)
        .where(
            and(
                eq(
                    organizationMembers.organizationId,
                    organizationId
                ),
                eq(
                    organizationMembers.userId,
                    userId
                )
            )
        );

    return result[0] ?? null;
};
const findById = async (
    database,
    organizationId
) => {

    const result = await database
        .select()
        .from(organizations)
        .where(
            eq(
                organizations.id,
                organizationId
            )
        );

    return result[0] ?? null;
};
const findOrganizationMemberById = async (
    database,
    memberId
) => {

    const result = await database
        .select()
        .from(organizationMembers)
        .where(
            eq(
                organizationMembers.id,
                memberId
            )
        );

    return result[0] ?? null;
};
const findOrganizationMembers = async (
    database,
    organizationId
) => {

    return await database
        .select({
            id: organizationMembers.id,
            role: organizationMembers.role,
            joinedAt: organizationMembers.joinedAt,

            user: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
            },
        })
        .from(organizationMembers)
        .innerJoin(
            users,
            eq(
                organizationMembers.userId,
                users.id
            )
        )
        .where(
            eq(
                organizationMembers.organizationId,
                organizationId
            )
        )
        .orderBy(users.firstName);
};
const removeOrganizationMember = async (
    database,
    memberId
) => {

    const result = await database
        .delete(organizationMembers)
        .where(
            eq(
                organizationMembers.id,
                memberId
            )
        )
        .returning();

    return result[0] ?? null;
};
export const organizationRepository = {
    createOrganization,
    addMemberToOrganization,
    findBySlug,
    findByUserId,
    findMemberByUserId,
    findById,
    findOrganizationMemberById,
    findOrganizationMembers
}
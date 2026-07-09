import { desc, eq } from "drizzle-orm";
import { organizationMembers } from "../../db/schema/organizationMembers.js";
import { organizations } from "../../db/schema/organizations.js";
import { db } from "../../db/index.js";
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
    return await database
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
}
export const organizationRepository = {
    createOrganization,
    addMemberToOrganization,
    findBySlug,
    findByUserId
}
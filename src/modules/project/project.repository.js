
import { and, desc, eq } from 'drizzle-orm';
import { projects } from '../../db/schema/projects.js';
import { organizationMembers } from '../../db/schema/organizationMembers.js';
import { projectMembers } from "../../db/schema/projectMembers.js"

const createProject = async (database, data) => {
    const result = await database
        .insert(projects)
        .values(data) 
        .returning();
    return result[0] ?? null;
}

const addMemberToProject = async (database, data) => {
    const result = await database
        .insert(projectMembers)
        .values(data)
        .returning();
    return result[0] ?? null;
}

const findBySlug = async (database, organizationId, slug) => {
    const result = await database
        .select()
        .from(projects)
        .where(
            and(
                eq(projects.organizationId, organizationId),
                eq(projects.slug, slug)
            )
        );

    return result[0] ?? null;
};

const findById = async (database, projectId) => {
    const result = await database
        .select()
        .from(projects)
        .where(eq(projects.id, projectId));

    return result[0] ?? null;
};

const findByOrganizationId = async (database, organizationId) => {
    return await database
        .select(
           {   id: projects.id,
            name: projects.name,
            slug: projects.slug,
            description: projects.description,
            createdAt: projects.createdAt,}
        )
        .from(projects)
        .where(eq(projects.organizationId, organizationId))
        .orderBy(desc(projects.createdAt));
};

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

export const projectRepository = {
    createProject,
    addMemberToProject,
    findBySlug,
    findById,
    findByOrganizationId,
    findMemberByUserId
};
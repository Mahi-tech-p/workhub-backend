
import { and, desc, eq } from 'drizzle-orm';
import { projects } from '../../db/schema/projects.js';
import { organizationMembers } from '../../db/schema/organizationMembers.js';
import { projectMembers } from "../../db/schema/projectMembers.js"
import { users } from '../../db/schema/users.js';
const createProject = async (database, data) => {
    const result = await database
        .insert(projects)
        .values(data) 
        .returning();
    return result[0] ?? null;
}

const createProjectMember = async (database, data) => {
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
        .select(
            {  id: projects.id,
            organizationId: projects.organizationId,
            name: projects.name,
            slug: projects.slug,
            description: projects.description,
            createdBy: projects.createdBy,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,}
        )
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
const findProjectMemberByUserId = async (
    database,
    projectId,
    userId
) => {
    const result = await database
        .select()
        .from(projectMembers)
        .where(
            and(
                eq(projectMembers.projectId, projectId),
                eq(projectMembers.userId, userId)
            )
        );

    return result[0] ?? null;
};
const findProjectMemberById = async (
    database,
    memberId
) => {

    const result = await database
        .select()
        .from(projectMembers)
        .where(eq(projectMembers.id, memberId));

    return result[0] ?? null;
};
const findMembersByProjectId = async (
    database,
    projectId
) => {

    return await database
        .select({
            id: projectMembers.id,
            role: projectMembers.role,
            joinedAt: projectMembers.joinedAt,

            user: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
            },
        })
        .from(projectMembers)
        .innerJoin(
            users,
            eq(projectMembers.userId, users.id)
        )
        .where(eq(projectMembers.projectId, projectId))
        .orderBy(users.firstName);
};
const removeProjectMember = async (
    database,
    memberId
) => {

    const result = await database
        .delete(projectMembers)
        .where(eq(projectMembers.id, memberId))
        .returning();

    return result[0] ?? null;
};
export const projectRepository = {
    createProject,
    createProjectMember,
    findBySlug,
    findById,
    findByOrganizationId,
    findMemberByUserId,
    findProjectMemberByUserId,
    findProjectMemberById,
    findMembersByProjectId,
    removeProjectMember
};
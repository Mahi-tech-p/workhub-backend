import { and, desc, eq, inArray, max } from "drizzle-orm";

import { lists } from "../../db/schema/list.js";

const create = async (database, data) => {
    const result = await database
        .insert(lists)
        .values(data)
        .returning();

    return result[0] ?? null;
};

const findById = async (database, listId) => {
    const result = await database
        .select({
            id: lists.id,
            projectId: lists.projectId,
            name: lists.name,
            position: lists.position,
            createdBy: lists.createdBy,
            createdAt: lists.createdAt,
            updatedAt: lists.updatedAt,
        })
        .from(lists)
        .where(eq(lists.id, listId));

    return result[0] ?? null;
};

const findByProjectId = async (database, projectId) => {
    return await database
        .select(
            {
                id: lists.id,
                name: lists.name,
                position: lists.position,
                createdAt: lists.createdAt,
            }
        )
        .from(lists)
        .where(eq(lists.projectId, projectId))
        .orderBy(lists.position);
};

const findByName = async (database, projectId, name) => {
    const result = await database
        .select()
        .from(lists)
        .where(
            and(
                eq(lists.projectId, projectId),
                eq(lists.name, name)
            )
        );

    return result[0] ?? null;
};

const getMaxPosition = async (database, projectId) => {
    const result = await database
        .select({
            maxPosition: max(lists.position),
        })
        .from(lists)
        .where(eq(lists.projectId, projectId));

    return result[0]?.maxPosition ?? 0;
};

const update = async (database, listId, data) => {
    const result = await database
        .update(lists)
        .set(data)
        .where(eq(lists.id, listId))
        .returning();

    return result[0] ?? null;
};

const remove = async (database, listId) => {
    const result = await database
        .delete(lists)
        .where(eq(lists.id, listId))
        .returning();

    return result[0] ?? null;
};

const findByIds = async (database, ids) => {
    return await database
        .select()
        .from(lists)
        .where(inArray(lists.id, ids));
};

const updatePosition = async (
    database,
    listId,
    position
) => {
    const result = await database
        .update(lists)
        .set({
            position,
        })
        .where(eq(lists.id, listId))
        .returning();

    return result[0] ?? null;
};

export const listRepository = {
    create,
    findById,
    findByProjectId,
    findByName,
    getMaxPosition,
    update,
    remove,
    findByIds,
    updatePosition
};
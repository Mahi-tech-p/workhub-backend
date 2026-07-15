import { and, asc, eq, inArray, max, gte, sql } from "drizzle-orm";

import { tasks } from "../../db/schema/tasks.js";

const create = async (database, data) => {
    const result = await database
        .insert(tasks)
        .values(data)
        .returning();

    return result[0] ?? null;
};

const findById = async (database, taskId) => {
    const result = await database
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId));

    return result[0] ?? null;
};

const findByIds = async (database, ids) => {
    return await database
        .select()
        .from(tasks)
        .where(inArray(tasks.id, ids));
};

const findByListId = async (database, listId) => {
    return await database
        .select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            priority: tasks.priority,
            dueDate: tasks.dueDate,
            assigneeId: tasks.assigneeId,
            position: tasks.position,
            createdAt: tasks.createdAt,
        })
        .from(tasks)
        .where(eq(tasks.listId, listId))
        .orderBy(asc(tasks.position));
};

const getMaxPosition = async (database, listId) => {
    const result = await database
        .select({
            maxPosition: max(tasks.position),
        })
        .from(tasks)
        .where(eq(tasks.listId, listId));

    return result[0]?.maxPosition ?? 0;
};

const update = async (database, taskId, data) => {
    const result = await database
        .update(tasks)
        .set(data)
        .where(eq(tasks.id, taskId))
        .returning();

    return result[0] ?? null;
};

const updatePosition = async (
    database,
    taskId,
    position,
    listId
) => {
    const result = await database
        .update(tasks)
        .set({
            position,
            listId,
        })
        .where(eq(tasks.id, taskId))
        .returning();

    return result[0] ?? null;
};

const remove = async (database, taskId) => {
    const result = await database
        .delete(tasks)
        .where(eq(tasks.id, taskId))
        .returning();

    return result[0] ?? null;
};
const findByTitle = async (
    database,
    listId,
    title
) => {
    const result = await database
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.listId, listId),
                eq(tasks.title, title)
            )
        );

    return result[0] ?? null;
};
const incrementPositionsFrom = async (
    database,
    listId,
    position
) => {
    await database
        .update(tasks)
        .set({
            position: sql`${tasks.position} + 1`,
        })
        .where(
            and(
                eq(tasks.listId, listId),
                gte(tasks.position, position)
            )
        );
};
const decrementPositionsAfter = async (
    database,
    listId,
    position
) => {
    await database
        .update(tasks)
        .set({
            position: sql`${tasks.position} - 1`,
        })
        .where(
            and(
                eq(tasks.listId, listId),
                gte(tasks.position, position + 1)
            )
        );
};
const assignTask = async (
    database,
    taskId,
    assigneeId
) => {

    const result = await database
        .update(tasks)
        .set({
            assigneeId,
        })
        .where(eq(tasks.id, taskId))
        .returning();

    return result[0] ?? null;
};
export const taskRepository = {
    create,
    findById,
    findByIds,
    findByListId,
    getMaxPosition,
    update,
    updatePosition,
    remove,
    findByTitle,
    incrementPositionsFrom,
    decrementPositionsAfter,
    assignTask
};
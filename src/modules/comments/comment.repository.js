import { asc, eq } from "drizzle-orm";

import { comments } from "../../db/schema/comments.js";
import { users } from "../../db/schema/users.js";

const create = async (database, data) => {
    const result = await database
        .insert(comments)
        .values(data)
        .returning();

    return result[0] ?? null;
};

const findById = async (database, commentId) => {
    const result = await database
        .select({
            id: comments.id,
            taskId: comments.taskId,
            content: comments.content,
            createdAt: comments.createdAt,
            updatedAt: comments.updatedAt,

            author: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
            },
        })
        .from(comments)
        .innerJoin(
            users,
            eq(comments.userId, users.id)
        )
        .where(eq(comments.id, commentId));

    return result[0] ?? null;
};

const findByTaskId = async (database, taskId) => {
    return await database
        .select({
            id: comments.id,
            taskId: comments.taskId,
            content: comments.content,
            createdAt: comments.createdAt,
            updatedAt: comments.updatedAt,

            author: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                // email: users.email,
                // avatar: users.avatarUrl,
            },
        })
        .from(comments)
        .innerJoin(
            users,
            eq(comments.userId, users.id)
        )
        .where(eq(comments.taskId, taskId))
        .orderBy(asc(comments.createdAt));
};

const update = async (database, commentId, data) => {
    const result = await database
        .update(comments)
        .set(data)
        .where(eq(comments.id, commentId))
        .returning();

    return result[0] ?? null;
};

const remove = async (database, commentId) => {
    const result = await database
        .delete(comments)
        .where(eq(comments.id, commentId))
        .returning();

    return result[0] ?? null;
};

export const commentRepository = {
    create,
    findById,
    findByTaskId,
    update,
    remove,
};
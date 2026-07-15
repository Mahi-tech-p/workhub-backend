import { and, desc, eq } from "drizzle-orm";

import { notifications } from "../../db/schema/notifications.js";

const create = async (database, data) => {
    const result = await database
        .insert(notifications)
        .values(data)
        .returning();

    return result[0] ?? null;
};

const findById = async (database, notificationId) => {
    const result = await database
        .select()
        .from(notifications)
        .where(eq(notifications.id, notificationId));

    return result[0] ?? null;
};

const findByUserId = async (database, userId) => {
    return await database
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt));
};

const markAsRead = async (database, notificationId) => {
    const result = await database
        .update(notifications)
        .set({
            isRead: true,
        })
        .where(eq(notifications.id, notificationId))
        .returning();

    return result[0] ?? null;
};

const markAllAsRead = async (database, userId) => {
    await database
        .update(notifications)
        .set({
            isRead: true,
        })
        .where(
            and(
                eq(notifications.userId, userId),
                eq(notifications.isRead, false)
            )
        );
};

export const notificationRepository = {
    create,
    findById,
    findByUserId,
    markAsRead,
    markAllAsRead,
};
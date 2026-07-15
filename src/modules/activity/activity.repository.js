import { desc, eq } from "drizzle-orm";

import { activityLogs } from "../../db/schema/activityLogs.js";
import { users } from "../../db/schema/users.js";

const create = async (database, data) => {
    const result = await database
        .insert(activityLogs)
        .values(data)
        .returning();

    return result[0] ?? null;
};

const findById = async (database, activityId) => {
    const result = await database
        .select({
            id: activityLogs.id,
            projectId: activityLogs.projectId,
            taskId: activityLogs.taskId,
            entityType: activityLogs.entityType,
            action: activityLogs.action,
            entityId: activityLogs.entityId,
            oldValue: activityLogs.oldValue,
            newValue: activityLogs.newValue,
            createdAt: activityLogs.createdAt,

            user: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
        .from(activityLogs)
        .innerJoin(
            users,
            eq(activityLogs.userId, users.id)
        )
        .where(eq(activityLogs.id, activityId));

    return result[0] ?? null;
};

const findByTaskId = async (database, taskId) => {
    return await database
        .select({
            id: activityLogs.id,
            projectId: activityLogs.projectId,
            taskId: activityLogs.taskId,
            entityType: activityLogs.entityType,
            action: activityLogs.action,
            entityId: activityLogs.entityId,
            oldValue: activityLogs.oldValue,
            newValue: activityLogs.newValue,
            createdAt: activityLogs.createdAt,

            user: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
        .from(activityLogs)
        .innerJoin(
            users,
            eq(activityLogs.userId, users.id)
        )
        .where(eq(activityLogs.taskId, taskId))
        .orderBy(desc(activityLogs.createdAt));
};

export const activityRepository = {
    create,
    findById,
    findByTaskId,
};
import {
    pgTable,
    uuid,
    timestamp,
    jsonb,
    pgEnum,
    index,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { projects } from "./projects.js";
import { tasks } from "./tasks.js";

export const entityTypeEnum = pgEnum("entity_type", [
    "PROJECT",
    "LIST",
    "TASK",
    "COMMENT",
]);

export const activityActionEnum = pgEnum("activity_action", [
    "CREATED",
    "UPDATED",
    "DELETED",
    "MOVED",
    "COMMENTED",
    "ASSIGNED",
]);

export const activityLogs = pgTable(
    "activity_logs",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        projectId: uuid("project_id")
            .notNull()
            .references(() => projects.id, {
                onDelete: "cascade",
            }),

        taskId: uuid("task_id").references(
            () => tasks.id,
            {
                onDelete: "cascade",
            }
        ),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        entityType: entityTypeEnum(
            "entity_type"
        ).notNull(),

        action: activityActionEnum(
            "action"
        ).notNull(),

        entityId: uuid("entity_id").notNull(),

        oldValue: jsonb("old_value"),

        newValue: jsonb("new_value"),

        createdAt: timestamp("created_at", {
            mode: "date",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        projectIdx: index(
            "activity_project_idx"
        ).on(table.projectId),

        taskIdx: index(
            "activity_task_idx"
        ).on(table.taskId),

        userIdx: index(
            "activity_user_idx"
        ).on(table.userId),
    })
);
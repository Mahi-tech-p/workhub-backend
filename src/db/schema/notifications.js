import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
    pgEnum,
    index,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const notificationTypeEnum = pgEnum(
    "notification_type",
    [
        "TASK_ASSIGNED",
        "COMMENT_ADDED",
        "PROJECT_INVITATION",
        "TASK_COMPLETED",
        "TASK_DUE",
    ]
);

export const notifications = pgTable(
    "notifications",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        type: notificationTypeEnum("type")
            .notNull(),

        title: varchar("title", {
            length: 255,
        }).notNull(),
        entityType: varchar("entity_type", {
            length: 50,
        }),
        entityId: uuid("entity_id"),
        message: varchar("message", {
            length: 1000,
        }).notNull(),

        isRead: boolean("is_read")
            .default(false)
            .notNull(),

        createdAt: timestamp("created_at", {
            mode: "date",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        userIdx: index(
            "notifications_user_idx"
        ).on(table.userId),

        isReadIdx: index(
            "notifications_is_read_idx"
        ).on(table.isRead),

        createdAtIdx: index(
            "notifications_created_at_idx"
        ).on(table.createdAt),
    })
);
import {
    pgTable,
    uuid,
    varchar,
    integer,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

import { tasks } from "./tasks.js";
import { users } from "./users.js";

export const attachments = pgTable(
    "attachments",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        taskId: uuid("task_id")
            .references(() => tasks.id, {
                onDelete: "cascade",
            })
            .notNull(),

        uploadedBy: uuid("uploaded_by")
            .references(() => users.id, {
                onDelete: "cascade",
            })
            .notNull(),

        fileName: varchar("file_name", {
            length: 255,
        }).notNull(),

        originalName: varchar("original_name", {
            length: 255,
        }).notNull(),
        objectKey: varchar("object_key", {
            length: 500,
        }).notNull(),
        mimeType: varchar("mime_type", {
            length: 100,
        }).notNull(),

        size: integer("size").notNull(),

        url: varchar("url", {
            length: 1000,
        }).notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        taskIdx: index("attachments_task_idx").on(
            table.taskId
        ),

        uploadedByIdx: index(
            "attachments_uploaded_by_idx"
        ).on(table.uploadedBy),

        createdAtIdx: index(
            "attachments_created_at_idx"
        ).on(table.createdAt),
    })
);
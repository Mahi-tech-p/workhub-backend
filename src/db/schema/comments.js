import {
    pgTable,
    uuid,
    text,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

import { tasks } from "./tasks.js";
import { users } from "./users.js";

export const comments = pgTable(
    "comments",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        taskId: uuid("task_id")
            .notNull()
            .references(() => tasks.id, {
                onDelete: "cascade",
            }),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        content: text("content").notNull(),

        createdAt: timestamp("created_at", {
            mode: "date",
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", {
            mode: "date",
        })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        taskIdx: index("comments_task_idx").on(
            table.taskId
        ),

        userIdx: index("comments_user_idx").on(
            table.userId
        ),
    })
);
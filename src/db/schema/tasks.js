import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    integer,
    index,
    pgEnum,
} from "drizzle-orm/pg-core";

import { lists } from "./list.js";
import { users } from "./users.js";

export const taskPriorityEnum = pgEnum("task_priority", [
    "LOW",
    "MEDIUM",
    "HIGH",
]);

export const tasks = pgTable(
    "tasks",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        listId: uuid("list_id")
            .notNull()
            .references(() => lists.id, {
                onDelete: "cascade",
            }),

        title: varchar("title", {
            length: 255,
        }).notNull(),

        description: text("description"),

        position: integer("position")
            .notNull(),

        priority: taskPriorityEnum("priority")
            .default("MEDIUM")
            .notNull(),

        dueDate: timestamp("due_date", {
            mode: "date",
        }),

        assigneeId: uuid("assignee_id")
            .references(() => users.id, {
                onDelete: "set null",
            }),

        createdBy: uuid("created_by")
            .notNull()
            .references(() => users.id, {
                onDelete: "restrict",
            }),

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
        listIdx: index("tasks_list_idx").on(
            table.listId
        ),

        assigneeIdx: index("tasks_assignee_idx").on(
            table.assigneeId
        ),

        listPositionIdx: index("tasks_list_position_idx").on(
            table.listId,
            table.position
        ),
    })
);
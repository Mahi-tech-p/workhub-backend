import {
    pgTable,
    uuid,
    varchar,
    integer,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { projects } from "./projects.js";
import { users } from "./users.js";

export const lists = pgTable(
    "board_lists",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        projectId: uuid("project_id")
            .notNull()
            .references(() => projects.id, {
                onDelete: "cascade",
            }),

        name: varchar("name", {
            length: 255,
        }).notNull(),

        position: integer("position")
            .notNull(),

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
        projectIdx: index("lists_project_idx").on(
            table.projectId
        ),

        createdByIdx: index("lists_created_by_idx").on(
            table.createdBy
        ),

        projectPositionIdx: index("lists_project_position_idx").on(
            table.projectId,
            table.position
        ),

        projectNameIdx: uniqueIndex("lists_project_name_idx").on(
            table.projectId,
            table.name
        ),
    })
);
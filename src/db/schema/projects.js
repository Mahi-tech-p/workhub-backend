import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { users } from "./users.js";

export const projects = pgTable(
    "projects",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        organizationId: uuid("organization_id")
            .notNull()
            .references(() => organizations.id, {
                onDelete: "cascade",
            }),

        name: varchar("name", {
            length: 255,
        }).notNull(),

        slug: varchar("slug", {
            length: 255,
        }).notNull(),

        description: text("description"),

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
        organizationIdx: index("projects_organization_idx").on(
            table.organizationId
        ),

        createdByIdx: index("projects_created_by_idx").on(
            table.createdBy
        ),

        organizationSlugIdx: uniqueIndex(
            "projects_organization_slug_idx"
        ).on(table.organizationId, table.slug),
    })
);
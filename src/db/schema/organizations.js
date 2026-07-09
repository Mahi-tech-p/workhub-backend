import { pgTable,uniqueIndex, uuid, varchar,timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";


export const organizations = pgTable("organizations", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    ownerId: uuid("owner_id").notNull()
        .references(() => users.id, {
            onDelete: "cascade"
        }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {
        mode: "date",
    })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
},
    (table) => ({
        slugIdx: uniqueIndex("organizations_slug_idx").on(
            table.slug
        )
    })
)
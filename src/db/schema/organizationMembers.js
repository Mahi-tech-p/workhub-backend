import {
    pgTable,
    uuid,
    timestamp,
    pgEnum,
    uniqueIndex,
    index,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { organizations } from "./organizations.js";

export const organizationRoleEnum = pgEnum(
    "organization_role",
    [
        "OWNER",
        "ADMIN",
        "MEMBER",
    ]
);

export const organizationMembers = pgTable(
    "organization_members",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        organizationId: uuid("organization_id")
            .notNull()
            .references(() => organizations.id, {
                onDelete: "cascade",
            }),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        role: organizationRoleEnum("role")
            .default("MEMBER")
            .notNull(),

        joinedAt: timestamp("joined_at", {
            mode: "date",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        organizationIdx: index(
            "organization_members_organization_idx"
        ).on(table.organizationId),

        userIdx: index(
            "organization_members_user_idx"
        ).on(table.userId),

        uniqueMemberIdx: uniqueIndex(
            "organization_members_unique_member_idx"
        ).on(
            table.organizationId,
            table.userId
        ),
    })
);
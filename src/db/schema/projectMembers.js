import {
    pgTable,
    uuid,
    timestamp,
    pgEnum,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { projects } from "./projects.js";
import { roleEnum } from "./enums.js";



export const projectMembers = pgTable(
    "project_members",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        projectId: uuid("project_id")
            .notNull()
            .references(() => projects.id, {
                onDelete: "cascade",
            }),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        role: roleEnum("role")
            .default("MEMBER")
            .notNull(),

        joinedAt: timestamp("joined_at", {
            mode: "date",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        projectIdx: index(
            "project_members_project_idx"
        ).on(table.projectId),

        userIdx: index(
            "project_members_user_idx"
        ).on(table.userId),

        uniqueProjectMemberIdx: uniqueIndex(
            "project_members_unique_member_idx"
        ).on(
            table.projectId,
            table.userId
        ),
    })
);
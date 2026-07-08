import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const refreshTokens = pgTable( "refresh_tokens",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        tokenHash: varchar("token_hash", { length: 255 })
            .notNull(),

        browser: varchar("browser", { length: 100 }),

        os: varchar("os", { length: 100 }),

        deviceName: varchar("device_name", { length: 255 }),

        userAgent: text("user_agent"),

        ipAddress: varchar("ip_address", { length: 45 }),

        expiresAt: timestamp("expires_at", {
            mode: "date",
        }).notNull(),

        revokedAt: timestamp("revoked_at", {
            mode: "date",
        }),

        lastUsedAt: timestamp("last_used_at", {
            mode: "date",
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
        userIdx: index("refresh_tokens_user_idx").on(table.userId),

        tokenHashIdx: uniqueIndex("refresh_tokens_token_hash_idx").on(
            table.tokenHash
        ),

        expiresAtIdx: index("refresh_tokens_expires_at_idx").on(
            table.expiresAt
        ),

        revokedAtIdx: index("refresh_tokens_revoked_at_idx").on(
            table.revokedAt
        ),
    })
);
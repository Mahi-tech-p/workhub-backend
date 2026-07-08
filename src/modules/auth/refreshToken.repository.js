import { db } from "../../db/index.js";
import { refreshTokens } from "../../db/schema/refreshToken.js";
import { eq } from "drizzle-orm";

const create = async (data) => {
    const result = await db
        .insert(refreshTokens)
        .values(data)
        .returning();

    return result[0] ?? null;
};

const findByHashToken = async (token) => {
    const result = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.tokenHash, token));

    return result[0] ?? null;
}
const revokeByID = async (id) => {
    const result = await db
        .update(refreshTokens)
        .set({
            revokedAt: new Date(),
        })
        .where(eq(refreshTokens.id, id))
        .returning();
    return result[0] ?? null;
}

const updateLastUsed = async (id) => {
    const result = await db
        .update(refreshTokens)
        .set({
            lastUsedAt: new Date(),
        })
        .where(eq(refreshTokens.id, id))
        .returning();

    return result[0] ?? null;
};
export const refreshTokenRepository = {
    create,
    findByHashToken,
    revokeByID,
    updateLastUsed
};
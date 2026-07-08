import { db } from "../../db/index.js";
import { refreshTokens } from "../../db/schema/refreshToken.js";

const create = async (data) => {
    const result = await db
        .insert(refreshTokens)
        .values(data)
        .returning();

    return result[0] ?? null;
};

export const refreshTokenRepository = {
    create,
};
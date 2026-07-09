import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { refreshTokens } from "../../db/schema/refreshToken.js";

const findUserByEmail = async (email) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return result[0] ?? null;
}

const createUser = async ({ firstName, lastName, email, passwordHash }) => {
    const result = await db
        .insert(users)
        .values({
            firstName,
            lastName,
            email,
            passwordHash,
        })
        .returning(
            {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                createdAt: users.createdAt,
            }
        );
    return result[0] ?? null;
}
const findUserByID = async (id) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
    return result[0] ?? null;
}


export const authRepository = {
    findUserByEmail,
    createUser,
    findUserByID
}

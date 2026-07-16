import { eq, desc } from "drizzle-orm";

import { attachments } from "../../db/schema/attachments.js";
import { users } from "../../db/schema/users.js";

const create = async (database, data) => {

    const result = await database
        .insert(attachments)
        .values(data)
        .returning();

    return result[0] ?? null;
};
const findById = async (
    database,
    attachmentId
) => {

    const result = await database
        .select()
        .from(attachments)
        .where(eq(attachments.id, attachmentId));

    return result[0] ?? null;
};
const findByTaskId = async (
    database,
    taskId
) => {

    return await database
        .select({
            id: attachments.id,
            fileName: attachments.fileName,
            originalName: attachments.originalName,
            objectKey: attachments.objectKey,
            mimeType: attachments.mimeType,
            size: attachments.size,
            url: attachments.url,
            createdAt: attachments.createdAt,

            uploadedBy: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
            },
        })
        .from(attachments)
        .innerJoin(
            users,
            eq(attachments.uploadedBy, users.id)
        )
        .where(eq(attachments.taskId, taskId))
        .orderBy(desc(attachments.createdAt));
};

const deleteById = async (
    database,
    attachmentId
) => {

    const result = await database
        .delete(attachments)
        .where(eq(attachments.id, attachmentId))
        .returning();

    return result[0] ?? null;
};
export const attachmentRepository = {
    create,
    findById,
    findByTaskId,
    deleteById,
};
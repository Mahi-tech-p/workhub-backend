import { z } from "zod";

export const taskAttachmentParamsSchema = z.object({
    taskId: z.string().uuid("Invalid task id"),
});

export const attachmentParamsSchema = z.object({
    attachmentId: z.string().uuid("Invalid attachment id"),
});
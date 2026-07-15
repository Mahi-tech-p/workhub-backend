import { z } from "zod";

export const createCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(5000, "Comment cannot exceed 5000 characters"),
});

export const updateCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(5000, "Comment cannot exceed 5000 characters"),
});

export const taskParamsSchema = z.object({
    taskId: z.uuid("Invalid task id"),
});

export const commentParamsSchema = z.object({
    commentId: z.uuid("Invalid comment id"),
});
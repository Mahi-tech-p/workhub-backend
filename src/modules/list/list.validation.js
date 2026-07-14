import { z } from "zod";

export const createListSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "List name must be at least 3 characters")
        .max(100, "List name cannot exceed 100 characters"),
});

export const updateListSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "List name must be at least 3 characters")
        .max(100, "List name cannot exceed 100 characters")
        .optional(),
});

export const projectParamsSchema = z.object({
    projectId: z.uuid("Invalid project id"),
});

export const listParamsSchema = z.object({
    listId: z.uuid("Invalid list id"),
});
export const reorderListsSchema = z.object({
    lists: z
        .array(
            z.object({
                id: z.uuid(),
                position: z.number().int().positive(),
            })
        )
        .min(1),
});
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(255, "Title cannot exceed 255 characters"),

    description: z
        .string()
        .trim()
        .max(5000, "Description cannot exceed 5000 characters")
        .optional(),

    priority: z
        .enum(["LOW", "MEDIUM", "HIGH"])
        .optional(),

    dueDate: z
        .coerce
        .date()
        .optional(),

    assigneeId: z
        .uuid("Invalid assignee id")
        .optional(),
});

export const updateTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(255, "Title cannot exceed 255 characters")
        .optional(),

    description: z
        .string()
        .trim()
        .max(5000, "Description cannot exceed 5000 characters")
        .optional(),

    priority: z
        .enum(["LOW", "MEDIUM", "HIGH"])
        .optional(),

    dueDate: z
        .coerce
        .date()
        .optional(),

    assigneeId: z
        .uuid("Invalid assignee id")
        .nullable()
        .optional(),
});

export const taskParamsSchema = z.object({
    taskId: z.uuid("Invalid task id"),
});

export const listParamsSchema = z.object({
    listId: z.uuid("Invalid list id"),
});

export const reorderTasksSchema = z.object({
    tasks: z
        .array(
            z.object({
                id: z.uuid("Invalid task id"),
                position: z
                    .number()
                    .int()
                    .positive(),
            })
        )
        .min(1, "At least one task is required"),
});

export const moveTaskSchema = z.object({
    destinationListId: z.uuid(
        "Invalid destination list id"
    ),
    position: z
        .number()
        .int()
        .positive(),
});
export const assignTaskSchema = z.object({
    assigneeId: z.uuid("Invalid assignee id"),
});
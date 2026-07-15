import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Project name must be at least 3 characters")
        .max(100, "Project name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters")
        .optional()
        .or(z.literal("")),
})

export const organizationParamsSchema = z.object({
    organizationId: z
        .uuid("Invalid organization id"),
});
export const projectParamsSchema = z.object({
    projectId: z.string().uuid("Invalid project id"),
});
export const addProjectMemberSchema = z.object({
    userId: z.uuid("Invalid user id"),
    role: z.enum(["ADMIN", "MEMBER"]),
});

export const projectMemberParamsSchema = z.object({
    projectId: z.uuid("Invalid project id"),
    memberId: z.uuid("Invalid member id"),
});
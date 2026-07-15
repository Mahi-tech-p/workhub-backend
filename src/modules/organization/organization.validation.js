import { z } from "zod";

export const createOrganizationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Organization name must be at least 3 characters")
        .max(100, "Organization name cannot exceed 100 characters"),
});
export const addOrganizationMemberSchema = z.object({
    userId: z.uuid("Invalid user id"),
    role: z.enum(["ADMIN", "MEMBER"]),
});
export const organizationMemberParamsSchema = z.object({
    organizationId: z.uuid("Invalid organization id"),
    memberId: z.uuid("Invalid member id"),
});
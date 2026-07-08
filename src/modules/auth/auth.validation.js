import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.
        string()
        .trim()
        .min(2, "First name must be at least 2 characters long")
        .max(100, "First name must be at most 100 characters long"),
    lastName: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters long")
        .max(100, "Last name must be at most 100 characters long"),
     email: z
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
})
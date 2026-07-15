import { z } from "zod";

export const taskParamsSchema = z.object({
    taskId: z.uuid("Invalid task id"),
});
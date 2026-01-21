import { z } from "zod";

const ErrorSchema = z.instanceof(Error);

export const CustomErrorSchema = z.object({
    name: z.string(),
    message: z.string(),
    statusCode: z.number().optional()
}).and(ErrorSchema);

export const validateCustomError = (error: unknown): boolean => {
    return CustomErrorSchema.safeParse(error).success && ErrorSchema.safeParse(error).success;
};
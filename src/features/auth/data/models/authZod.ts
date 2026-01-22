import { z } from "zod";
import { BaseSchema } from "@shared/api/models/commonZod";

export const RefreshTokenResponseSchema = z.object({
    ...BaseSchema.shape,
    userId: z.string(),
    message: z.string(),
    accessToken: z.string()
});

export const AuthResponseSchema = RefreshTokenResponseSchema.extend({
    refreshToken: z.string()
});

export const AuthRequestSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const RegisterRequestSchema = AuthRequestSchema.extend({
    username: z.string(),
    firstname: z.string(),
    lastname: z.string()
});
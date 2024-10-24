import { z } from "zod";

export const RefreshTokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    message: z.string(),
    accessToken: z.string()
});

export const AuthSchema = RefreshTokenSchema.extend({
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
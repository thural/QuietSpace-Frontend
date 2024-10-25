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

export const AuthBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const RegisterBodySchema = AuthBodySchema.extend({
    username: z.string(),
    firstname: z.string(),
    lastname: z.string()
});
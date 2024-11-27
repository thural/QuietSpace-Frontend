import { z } from "zod";
import {
    RefreshTokenResponseSchema,
    AuthResponseSchema,
    AuthRequestSchema,
    RegisterRequestSchema
} from "../zod/authZod";

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type AuthRequest = z.infer<typeof AuthRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
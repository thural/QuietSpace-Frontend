import { z } from "zod";
import {
    RefreshTokenSchema,
    AuthSchema,
    AuthRequestSchema,
    RegisterRequestSchema
} from "../zod/authZod";

export type RefreshTokenSchema = z.infer<typeof RefreshTokenSchema>;
export type AuthSchema = z.infer<typeof AuthSchema>;
export type AuthRequest = z.infer<typeof AuthRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
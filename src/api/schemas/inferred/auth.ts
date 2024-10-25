import { z } from "zod";
import {
    RefreshTokenSchema,
    AuthSchema,
    AuthBodySchema,
    RegisterBodySchema
} from "../zod/authZod";

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type Auth = z.infer<typeof AuthSchema>;
export type AuthBody = z.infer<typeof AuthBodySchema>;
export type RegisterBody = z.infer<typeof RegisterBodySchema>;
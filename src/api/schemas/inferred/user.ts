import { z } from "zod";
import {
    UserSchema,
    UserListSchema,
    UserPageSchema,
    ProfileSettingsRequestSchema,
    ProfileSettingsResponseSchema
} from "../zod/userZod";

export type User = z.infer<typeof UserSchema>;
export type UserList = z.infer<typeof UserListSchema>;
export type UserPage = z.infer<typeof UserPageSchema>;
export type ProfileSettingsRequest = z.infer<typeof ProfileSettingsRequestSchema>
export type ProfileSettingsResponse = z.infer<typeof ProfileSettingsResponseSchema>
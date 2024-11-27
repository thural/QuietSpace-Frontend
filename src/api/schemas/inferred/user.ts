import { z } from "zod";
import {
    UserResponseSchema,
    UserListSchema,
    UserPageSchema,
    ProfileSettingsRequestSchema,
    ProfileSettingsResponseSchema
} from "../zod/userZod";

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserList = z.infer<typeof UserListSchema>;
export type UserPage = z.infer<typeof UserPageSchema>;
export type ProfileSettingsRequest = z.infer<typeof ProfileSettingsRequestSchema>
export type ProfileSettingsResponse = z.infer<typeof ProfileSettingsResponseSchema>
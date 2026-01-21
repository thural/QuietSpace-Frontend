import { z } from "zod";
import {
    UserResponseSchema,
    UserListSchema,
    UserPageSchema,
    ProfileSettingsRequestSchema,
    ProfileSettingsResponseSchema,
    UserProfileResponseSchema
} from "../zod/userZod";

export type UserList = z.infer<typeof UserListSchema>;
export type UserPage = z.infer<typeof UserPageSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type ProfileSettingsRequest = z.infer<typeof ProfileSettingsRequestSchema>
export type ProfileSettingsResponse = z.infer<typeof ProfileSettingsResponseSchema>
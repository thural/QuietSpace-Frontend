import { z } from "zod";
import { BaseSchema, PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
import { PhotoResponseSchema } from "./photoZod";


export const ProfileSettingsRequestSchema = z.object({
    bio: z.string(),
    isPrivateAccount: z.boolean(),
    isNotificationsMuted: z.boolean(),
    isAllowPublicGroupChatInvite: z.boolean(),
    isAllowPublicMessageRequests: z.boolean(),
    isAllowPublicComments: z.boolean(),
    isHideLikeCounts: z.boolean(),
});

export const ProfileSettingsResponseSchema = BaseSchema.extend({
    blockedUserids: z.array(ResIdSchema),
}).and(ProfileSettingsRequestSchema);

export const UserResponseSchema = BaseSchema.extend({
    bio: z.string(),
    role: z.string(),
    username: z.string(),
    email: z.string().email(),
    photo: PhotoResponseSchema.optional(),
    isPrivateAccount: z.boolean(),
    isFollower: z.boolean().nullable(),
    isFollowing: z.boolean().nullable(),
});

export const UserProfileResponseSchema = UserResponseSchema.extend({
    settings: ProfileSettingsResponseSchema
}).omit({
    isFollower: true,
    isFollowing: true
});

export const UserListSchema = PageContentSchema(UserResponseSchema);
export const UserPageSchema = PageSchema(UserResponseSchema);
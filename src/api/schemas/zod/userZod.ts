import { z } from "zod";
import { BaseSchema, PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
import { PhotoResponseSchema } from "./photoZod";


export const UserResponseSchema = BaseSchema.extend({
    role: z.string(),
    username: z.string(),
    email: z.string().email(),
    photo: PhotoResponseSchema.optional(),
    isPrivateAccount: z.boolean(),
    isFollower: z.boolean().nullable(),
    isFollowing: z.boolean().nullable(),
});

export const ProfileSettingsRequestSchema = z.object({
    bio: z.string().nullable(),
    isPrivateAccount: z.boolean().nullable(),
    isNotificationsMuted: z.boolean().nullable(),
    isAllowPublicGroupChatInvite: z.boolean().nullable(),
    isAllowPublicMessageRequests: z.boolean().nullable(),
    isAllowPublicComments: z.boolean().nullable(),
    isHideLikeCounts: z.boolean().nullable(),
});

export const ProfileSettingsResponseSchema = BaseSchema.extend({
    blockedUserids: z.array(ResIdSchema),
}).and(ProfileSettingsRequestSchema);

export const UserListSchema = PageContentSchema(UserResponseSchema);
export const UserPageSchema = PageSchema(UserResponseSchema);
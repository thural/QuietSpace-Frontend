import { z } from "zod";
import { PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";


export const UserSchema = z.object({
    id: ResIdSchema,
    role: z.string(),
    username: z.string(),
    email: z.string().email(),
    isPrivateAccount: z.boolean(),
    isFollower: z.boolean().nullable(),
    isFollowing: z.boolean().nullable(),
    createDate: z.date(),
    updateDate: z.date()
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

export const ProfileSettingsResponseSchema = z.object({
    bio: z.string(),
    blockedUserids: z.array(ResIdSchema),
    isPrivateAccount: z.boolean(),
    isNotificationsMuted: z.boolean(),
    isAllowPublicGroupChatInvite: z.boolean(),
    isAllowPublicMessageRequests: z.boolean(),
    isAllowPublicComments: z.boolean(),
    isHideLikeCounts: z.boolean(),
});

export const UserListSchema = PageContentSchema(UserSchema);
export const UserPageSchema = PageSchema(UserSchema);
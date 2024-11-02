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

export const UserListSchema = PageContentSchema(UserSchema);
export const UserPageSchema = PageSchema(UserSchema);
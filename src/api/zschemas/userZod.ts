import { z } from "zod";
import { ContentResponseSchema, PagedResponseSchema, ResIdSchema } from "./commonZod";


export const UserSchema = z.object({
    id: ResIdSchema,
    role: z.string(),
    username: z.string(),
    email: z.string().email(),
    isPrivateAccount: z.boolean(),
    createDate: z.date(),
    updateDate: z.date()
});

export const UserListResponseSchema = ContentResponseSchema(UserSchema);
export const PagedUserResponseSchema = PagedResponseSchema(UserSchema);
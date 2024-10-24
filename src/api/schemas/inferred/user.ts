import { z } from "zod";
import {
    UserSchema,
    UserListResponseSchema,
    PagedUserResponseSchema
} from "../zod/userZod";

export type UserSchema = z.infer<typeof UserSchema>;
export type UserListResponse = z.infer<typeof UserListResponseSchema>;
export type PagedUserResponse = z.infer<typeof PagedUserResponseSchema>;
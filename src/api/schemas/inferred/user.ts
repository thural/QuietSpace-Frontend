import { z } from "zod";
import {
    UserSchema,
    UserListSchema,
    UserPageSchema
} from "../zod/userZod";

export type User = z.infer<typeof UserSchema>;
export type UserList = z.infer<typeof UserListSchema>;
export type UserPage = z.infer<typeof UserPageSchema>;
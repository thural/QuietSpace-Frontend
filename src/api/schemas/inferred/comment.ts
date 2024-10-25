import { z } from "zod";
import {
    CommentBodySchema,
    CommentSchema,
    PagedCommentSchema
} from "../zod/commentZod";

export type CommentBody = z.infer<typeof CommentBodySchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type PagedComment = z.infer<typeof PagedCommentSchema>;
import { z } from "zod";
import {
    CommentBodySchema,
    CommentList,
    CommentSchema,
    PagedCommentSchema
} from "../zod/commentZod";

export type CommentBody = z.infer<typeof CommentBodySchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type CommentList = z.infer<typeof CommentList>
export type PagedComment = z.infer<typeof PagedCommentSchema>;
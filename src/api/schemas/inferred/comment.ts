import { z } from "zod";
import {
    CommentRequestSchema,
    CommentList,
    CommentResponseSchema,
    PagedCommentSchema
} from "../zod/commentZod";

export type CommentRequest = z.infer<typeof CommentRequestSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentList = z.infer<typeof CommentList>
export type PagedComment = z.infer<typeof PagedCommentSchema>;
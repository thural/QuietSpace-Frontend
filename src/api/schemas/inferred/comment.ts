import { z } from "zod";
import {
    CommentBodySchema,
    CommentSchema,
    PagedCommentResponseSchema
} from "../zod/commentZod";

export type CommentBody = z.infer<typeof CommentBodySchema>;
export type CommentSchema = z.infer<typeof CommentSchema>;
export type PagedCommentResponse = z.infer<typeof PagedCommentResponseSchema>;

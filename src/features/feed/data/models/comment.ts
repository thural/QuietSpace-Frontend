import {z} from "zod";
import {CommentList, CommentRequestSchema, CommentResponseSchema, PagedCommentSchema} from "./commentZod";

export type CommentRequest = z.infer<typeof CommentRequestSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentList = z.infer<typeof CommentList>
export type PagedComment = z.infer<typeof PagedCommentSchema>;
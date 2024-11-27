import { z } from "zod";
import {
    ReactionTypeSchema,
    ReactionRequestSchema,
    ReactionResponseSchema
} from "../zod/reactionZod";
import { ContentTypeEnum } from "../zod/commonZod";

export type ReactionType = z.infer<typeof ReactionTypeSchema>;
export type ReactionRequest = z.infer<typeof ReactionRequestSchema>;
export type UserReactionResponse = z.infer<typeof ReactionResponseSchema>;
export type ContentType = z.infer<typeof ContentTypeEnum>;
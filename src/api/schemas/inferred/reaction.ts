import { z } from "zod";
import {
    ReactionTypeSchema,
    UserReactionSchema,
    UserReactionResponseSchema
} from "../zod/reactionZod";
import { ContentTypeEnum } from "../zod/commonZod";

export type ReactionType = z.infer<typeof ReactionTypeSchema>;
export type UserReaction = z.infer<typeof UserReactionSchema>;
export type UserReactionResponse = z.infer<typeof UserReactionResponseSchema>;
export type ContentType = z.infer<typeof ContentTypeEnum>;
import { z } from "zod";
import {
    ReactionTypeSchema,
    UserReactionBody,
    UserReactionSchema
} from "../zod/reactionZod";
import { ContentTypeEnum } from "../zod/commonZod";

export type ReactionType = z.infer<typeof ReactionTypeSchema>;
export type UserReaction = z.infer<typeof UserReactionBody>;
export type UserReactionResponse = z.infer<typeof UserReactionSchema>;
export type ContentType = z.infer<typeof ContentTypeEnum>;
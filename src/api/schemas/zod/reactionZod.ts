import { z } from "zod";
import { BaseSchema, ContentTypeEnum, ResIdSchema } from "./commonZod";
import { Reactiontype } from "../native/reaction";

export const ReactionTypeSchema = z.nativeEnum(Reactiontype);

export const ReactionRequestSchema = z.object({
    userId: ResIdSchema,
    contentId: ResIdSchema,
    reactionType: ReactionTypeSchema,
    contentType: ContentTypeEnum
});

export const ReactionResponseSchema = BaseSchema.extend({
    username: ResIdSchema,
}).and(ReactionRequestSchema);
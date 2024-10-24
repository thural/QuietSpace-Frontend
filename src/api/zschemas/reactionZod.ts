import { z } from "zod";
import { Reactiontype } from "../schemas/reaction";
import { ContentTypeEnum, ResIdSchema } from "./commonZod";

export const ReactionTypeSchema = z.nativeEnum(Reactiontype);

export const UserReactionSchema = z.object({
    userId: ResIdSchema,
    contentId: ResIdSchema,
    reactionType: ReactionTypeSchema,
    contentType: ContentTypeEnum
});

export const UserReactionResponseSchema = UserReactionSchema.extend({
    id: ResIdSchema,
    username: ResIdSchema,
    updateDate: z.date().nullable()
});
import { z } from "zod";
import { ContentTypeEnum, ResIdSchema } from "./commonZod";
import { Reactiontype } from "../native/reaction";

export const ReactionTypeSchema = z.nativeEnum(Reactiontype);

export const UserReactionBody = z.object({
    userId: ResIdSchema,
    contentId: ResIdSchema,
    reactionType: ReactionTypeSchema,
    contentType: ContentTypeEnum
});

export const UserReactionSchema = UserReactionBody.extend({
    id: ResIdSchema,
    username: ResIdSchema,
    updateDate: z.date().nullable()
});
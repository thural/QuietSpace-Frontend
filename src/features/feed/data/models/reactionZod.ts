import {z} from "zod";
import {BaseSchema, ContentTypeEnum, ResIdSchema} from "@/shared/api/models/commonZod";
import {ReactionType} from "./reactionNative";

export const ReactionTypeSchema = z.nativeEnum(ReactionType);

export const ReactionRequestSchema = z.object({
    userId: ResIdSchema,
    contentId: ResIdSchema,
    reactionType: ReactionTypeSchema,
    contentType: ContentTypeEnum
});

export const ReactionResponseSchema = BaseSchema.extend({
    username: ResIdSchema,
}).and(ReactionRequestSchema);
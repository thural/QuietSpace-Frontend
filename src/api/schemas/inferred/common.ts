import { z } from "zod";
import {
    ResIdSchema,
    BaseSchemaZod,
    JwtTokenSchema,
    FetchOptionsSchema,
    ContentTypeEnum,
    SortPropsSchema,
    PageablePropsSchema,
    ContentResponseSchema,
    PagedResponseSchema
} from "../zod/commonZod";

export type ResId = z.infer<typeof ResIdSchema>;
export type BaseSchema = z.infer<typeof BaseSchemaZod>;
export type JwtToken = z.infer<typeof JwtTokenSchema>;
export type FetchOptions = z.infer<typeof FetchOptionsSchema>;
export type ContentType = z.infer<typeof ContentTypeEnum>;
export type SortProps = z.infer<typeof SortPropsSchema>;
export type PageableProps = z.infer<typeof PageablePropsSchema>;

export type ContentResponse<T> = z.infer<ReturnType<typeof ContentResponseSchema<z.ZodType<T>>>>;
export type PagedResponse<T> = z.infer<ReturnType<typeof PagedResponseSchema<z.ZodType<T>>>>;
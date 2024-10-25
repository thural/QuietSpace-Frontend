import { z } from "zod";
import {
    ResIdSchema,
    BaseSchema,
    JwtTokenSchema,
    FetchOptionsSchema,
    ContentTypeEnum,
    SortPropsSchema,
    PagePropsSchema,
    PageContentSchema,
    PageSchema
} from "../zod/commonZod";

export type ResId = z.infer<typeof ResIdSchema>;
export type ResponseBase = z.infer<typeof BaseSchema>;
export type JwtToken = z.infer<typeof JwtTokenSchema>;
export type FetchOptions = z.infer<typeof FetchOptionsSchema>;
export type ContentType = z.infer<typeof ContentTypeEnum>;
export type SortProps = z.infer<typeof SortPropsSchema>;
export type PageProps = z.infer<typeof PagePropsSchema>;

export type PageContent<T> = z.infer<ReturnType<typeof PageContentSchema<z.ZodType<T>>>>;
export type Page<T> = z.infer<ReturnType<typeof PageSchema<z.ZodType<T>>>>;
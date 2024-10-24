import { z } from "zod";
import { ContentType } from "../native/common";

export const ResIdSchema = z.union([z.string(), z.number()]);

export const BaseSchemaZod = z.object({
    id: ResIdSchema,
    version: z.number().optional(),
    createDate: z.date(),
    updateDate: z.date().optional()
});

export const JwtTokenSchema = z.string();

export const FetchOptionsSchema = z.object({
    method: z.string(),
    headers: z.instanceof(Headers),
    body: z.string().nullable()
});

export const ContentTypeEnum = z.nativeEnum(ContentType);

export const SortPropsSchema = z.object({
    sorted: z.boolean(),
    unsorted: z.boolean(),
    empty: z.boolean()
});

export const PageablePropsSchema = z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    sort: SortPropsSchema,
    offset: z.number(),
    paged: z.boolean(),
    unpaged: z.boolean()
});

export const ContentResponseSchema = <T extends z.ZodType>(schema: T) =>
    z.array(schema);

export const PagedResponseSchema = <T extends z.ZodType>(schema: T) =>
    z.object({
        content: ContentResponseSchema(schema),
        pageable: PageablePropsSchema,
        totalPages: z.number(),
        totalElements: z.number(),
        last: z.boolean(),
        first: z.boolean(),
        size: z.number(),
        number: z.number(),
        sort: SortPropsSchema,
        numberOfElements: z.number(),
        empty: z.boolean()
    });
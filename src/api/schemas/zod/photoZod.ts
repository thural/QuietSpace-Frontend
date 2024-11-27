import { z } from 'zod';
import { BaseSchema } from './commonZod';

export const PhotoResponseSchema = BaseSchema.extend({
    name: z.string(),
    type: z.string(),
    data: z.instanceof(Uint8Array)
});
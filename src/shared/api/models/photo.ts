import { z } from "zod";
import { PhotoResponseSchema } from "../zod/photoZod";

export type PhotoResponse = z.infer<typeof PhotoResponseSchema>;
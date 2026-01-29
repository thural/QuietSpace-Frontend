import { z } from "zod";
import { CustomErrorSchema } from "../zod/errorsZod";

export type CustomError = z.infer<typeof CustomErrorSchema>;

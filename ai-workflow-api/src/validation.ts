import { z } from "zod";
export const GenerateStepInput = z.object({ task: z.string().min(1) });
export type GenerateStepInput = z.infer<typeof GenerateStepInput>;
// src/types/zjson.ts
import { z } from "zod";
import type { Json } from "./json";

// Forma compatível com Zod antigo: z.record(keySchema, valueSchema)
export const zJson: z.ZodType<Json> = z.lazy(() =>
    z.union([
            z.null(),
            z.boolean(),
            z.number(),
            z.string(),
            z.array(zJson),
            z.record(z.string(), zJson), // <- chave string SEMPRE
    ])
);

// src/server/api/routers/catalog/_lore.z.ts
import { z } from "zod";

export const LoreDisplayZ = z.object({
    heroImage: z.string().url().optional(),
    palette: z.object({ from: z.string(), to: z.string() }).optional(),
    icon: z.string().optional(),
}).partial();

export const LoreChapterZ = z.object({
    id: z.string().optional(),
    title: z.string(),
    content: z.string().optional(),
    bullets: z.array(z.string()).optional(),
    blockquote: z.string().optional(),
    // Zod (versão que você está usando) pede 2 argumentos no record
    table: z.array(z.record(z.string(), z.string())).optional(),
})
    .partial()
    .refine(
        (v) => !!(v.title && (v.content || v.bullets || v.blockquote || v.table)),
        { message: "Capítulo precisa de conteúdo (content/bullets/blockquote/table)" },
    );

export const LoreTimelineZ = z.array(z.object({
    era: z.string(),
    evento: z.string(),
}));

export const LoreRitualZ = z.array(z.object({
    id: z.string(),
    name: z.string(),
    effect: z.string(),
}));

export const LoreLocationZ = z.array(z.object({
    name: z.string(),
    note: z.string().optional(),
}));

export const LoreGameplayZ = z.object({
    hooks: z.array(z.string()).optional(),
    partySynergy: z.string().optional(),
    enemyTags: z.array(z.string()).optional(),
}).partial();

export const LoreUIZ = z.object({
    selectIntro: z.string().optional(),
    cta: z.string().optional(),
    // 2 args no record
    labels: z.record(z.string(), z.string()).optional(),
}).partial();

export const LoreAttributionZ = z.object({
    createdBy: z.string().optional(),
    sources: z.array(z.string()).optional(),
}).partial();

const ClassLoreBaseZ = z.object({
    id: z.string().optional(),
    classId: z.string(),
    locale: z.string().min(2).max(10),
    version: z.number().int().min(1).default(1),
    title: z.string(),
    tagline: z.string().optional(),
    readingTimeMin: z.number().int().positive().optional(),
    display: LoreDisplayZ.optional(),
    summary: z.string(),
    chapters: z.array(LoreChapterZ).default([]),
    timeline: LoreTimelineZ.optional(),
    rituals: LoreRitualZ.optional(),
    locations: LoreLocationZ.optional(),
    gameplay: LoreGameplayZ.optional(),
    ui: LoreUIZ.optional(),
    attribution: LoreAttributionZ.optional(),
});

// Alias: aceita payload vindo com readingMin
export const ClassLoreZ = z.preprocess((v) => {
    if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        if (o.readingTimeMin == null && typeof o.readingMin === "number") {
            o.readingTimeMin = o.readingMin;
        }
    }
    return v;
}, ClassLoreBaseZ);

export type ClassLoreT = z.infer<typeof ClassLoreZ>;

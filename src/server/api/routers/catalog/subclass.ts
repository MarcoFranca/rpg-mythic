// src/server/api/routers/catalog/subclass.ts
import { z } from "zod";
import { router, publicProcedure } from "../../trpc";

/** View model exposto para a UI */
export const SubclassSummary = z.object({
    id: z.string().uuid(),
    classId: z.string(), // aceita uuid e slug
    name: z.string(),
    description: z.string(),
    aliases: z.array(z.string()).default([]),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    featuresPreview: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
});
export type SubclassSummaryT = z.infer<typeof SubclassSummary>;

/** Esquema do metaJson armazenado no banco (seguro contra valores faltantes/ruins) */
const SubclassMetaSchema = z
    .object({
        aliases: z.array(z.string()).optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        featuresPreview: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
    })
    .partial()
    .default({});

type SubclassMeta = z.infer<typeof SubclassMetaSchema>;

export const subclassCatalogRouter = router({
    listByClass: publicProcedure
        .input(z.object({ classId: z.string() }))
        .query(async ({ ctx, input }) => {
            const rows = await ctx.prisma.subclass.findMany({
                where: { classId: input.classId },
                orderBy: { name: "asc" },
            });

            return rows.map((r) => {
                const meta: SubclassMeta = SubclassMetaSchema.parse(r.metaJson ?? {});
                return SubclassSummary.parse({
                    id: r.id,
                    classId: r.classId,
                    name: r.name,
                    description: r.description,
                    aliases: meta.aliases ?? [],
                    pros: meta.pros ?? [],
                    cons: meta.cons ?? [],
                    featuresPreview: meta.featuresPreview ?? [],
                    tags: meta.tags ?? [],
                });
            });
        }),
});

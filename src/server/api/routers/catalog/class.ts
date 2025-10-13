import { z } from "zod";
import { router, publicProcedure } from "../../trpc";

/**
 * View-model enxuto para a UI (sem any).
 * Se precisar, expandimos depois (subclasses, tabelas, etc.).
 */
export const ClassSummary = z.object({
    id: z.string().uuid(),
    name: z.string(),
    role: z.enum(["Defensor", "Ofensor", "Suporte", "Híbrido"]).nullable(),
    hitDie: z.enum(["d6", "d8", "d10", "d12"]).nullable(),
    primaryAbilities: z.array(z.string()),
    savingThrows: z.array(z.string()),
    armorProficiencies: z.array(z.string()),
    weaponProficiencies: z.array(z.string()),
    spellcasting: z.enum(["Arcano", "Divino", "Marcial", "Híbrido", "Nenhum"]).nullable(),
    description: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    featuresPreview: z.array(z.string()),
});
export type ClassSummaryT = z.infer<typeof ClassSummary>;

/**
 * Router ÚNICO — não declare novamente este nome neste ou em outro arquivo.
 */
export const classCatalogRouter = router({
    listSummaries: publicProcedure
        .input(z.object({ q: z.string().optional() }).optional())
        .query(async ({ ctx, input }) => {
            const q = input?.q?.trim() ?? "";
            const rows = await ctx.prisma.class.findMany({
                where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
                orderBy: { name: "asc" },
            });

            // Adaptador defensivo a partir do seu Prisma
            return rows.map((r) => {
                const meta = (r as unknown as { metaJson?: unknown })?.metaJson as
                    | {
                    description?: string;
                    role?: "Defensor" | "Ofensor" | "Suporte" | "Híbrido";
                    hitDie?: "d6" | "d8" | "d10" | "d12";
                    primaryAbilities?: string[];
                    savingThrows?: string[];
                    armorProficiencies?: string[];
                    weaponProficiencies?: string[];
                    spellcasting?: "Arcano" | "Divino" | "Marcial" | "Híbrido" | "Nenhum";
                    pros?: string[];
                    cons?: string[];
                    featuresPreview?: string[];
                }
                    | undefined;

                return ClassSummary.parse({
                    id: r.id,
                    name: r.name,
                    role: meta?.role ?? null,
                    hitDie: meta?.hitDie ?? null,
                    primaryAbilities: meta?.primaryAbilities ?? [],
                    savingThrows: meta?.savingThrows ?? [],
                    armorProficiencies: meta?.armorProficiencies ?? [],
                    weaponProficiencies: meta?.weaponProficiencies ?? [],
                    spellcasting: meta?.spellcasting ?? null,
                    description: meta?.description ?? "Sem descrição.",
                    pros: meta?.pros ?? [],
                    cons: meta?.cons ?? [],
                    featuresPreview: meta?.featuresPreview ?? [],
                });
            });
        }),
});

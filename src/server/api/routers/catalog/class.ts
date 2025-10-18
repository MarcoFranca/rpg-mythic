import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import {
    normalizeClassRow,
    normalizeSubclassRow,
    ClassWithSubclassesVMZ,
} from "./_normalize-class";

/**
 * View-model enxuto para a UI (sem any).
 */
export const ClassSummary = z.object({
    id: z.union([z.string().uuid(), z.string().min(1)]),
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
    assets: z
        .object({
            image: z.string().optional(),
            accentFrom: z.string().optional(),
            accentTo: z.string().optional(),
        })
        .partial()
        .optional(),
});
export type ClassSummaryT = z.infer<typeof ClassSummary>;

/** Normalizadores defensivos PT/UPPER → UI */
const ROLE_MAP: Record<string, "Defensor" | "Ofensor" | "Suporte" | "Híbrido"> = {
    DEFENSOR: "Defensor",
    OFENSOR: "Ofensor",
    SUPORTE: "Suporte",
    HIBRIDO: "Híbrido",
    HÍBRIDO: "Híbrido",
};
const SPELL_MAP: Record<string, "Arcano" | "Divino" | "Marcial" | "Híbrido" | "Nenhum"> = {
    ARCANO: "Arcano",
    DIVINO: "Divino",
    MARCIAL: "Marcial",
    HIBRIDO: "Híbrido",
    HÍBRIDO: "Híbrido",
    NENHUM: "Nenhum",
};
const HITDIE_OK = new Set(["d6", "d8", "d10", "d12"]);

function normRole(v?: unknown) {
    if (typeof v !== "string") return null;
    const key = v.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase();
    return ROLE_MAP[key] ?? null;
}
function normSpellcasting(v?: unknown) {
    if (typeof v !== "string") return null;
    const key = v.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase();
    return SPELL_MAP[key] ?? null;
}
function normHitDie(v?: unknown) {
    if (typeof v !== "string") return null;
    return HITDIE_OK.has(v) ? (v as "d6" | "d8" | "d10" | "d12") : null;
}
function arrStr(v: unknown): string[] {
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
}

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

            return rows.map((r) => {
                const meta = (r as unknown as { metaJson?: any })?.metaJson ?? {};

                // Normalização defensiva (tolera seeds em PT/UPPER)
                const out = {
                    id: r.id,
                    name: r.name,
                    role: normRole(meta.role),
                    hitDie: normHitDie(meta.hitDie ?? r.hitDie),
                    primaryAbilities: arrStr(meta.primaryAbilities),
                    savingThrows: arrStr(meta.savingThrows),
                    armorProficiencies: arrStr(meta.armorProficiencies),
                    weaponProficiencies: arrStr(meta.weaponProficiencies),
                    spellcasting: normSpellcasting(meta.spellcasting),
                    description: (typeof meta.description === "string" && meta.description.trim().length
                            ? meta.description
                            : (typeof (r as any).description === "string" ? (r as any).description : "Sem descrição.")
                    ) as string,
                    pros: arrStr(meta.pros),
                    cons: arrStr(meta.cons),
                    featuresPreview: arrStr(meta.featuresPreview),
                    assets: typeof meta.assets === "object" && meta.assets
                        ? {
                            image: typeof meta.assets.image === "string" ? meta.assets.image : undefined,
                            accentFrom: typeof meta.assets.accentFrom === "string" ? meta.assets.accentFrom : undefined,
                            accentTo: typeof meta.assets.accentTo === "string" ? meta.assets.accentTo : undefined,
                        }
                        : undefined,
                };

                // Garante formato final com Zod
                const parsed = ClassSummary.safeParse(out);
                if (parsed.success) return parsed.data;

                // fallback ultra-defensivo (evita 500 a qualquer custo)
                return {
                    id: String(r.id),
                    name: String(r.name),
                    role: null,
                    hitDie: null,
                    primaryAbilities: [],
                    savingThrows: [],
                    armorProficiencies: [],
                    weaponProficiencies: [],
                    spellcasting: null,
                    description: "Sem descrição.",
                    pros: [],
                    cons: [],
                    featuresPreview: [],
                    assets: undefined,
                } satisfies ClassSummaryT;
            });
        }),

    getWithSubclasses: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const r = await ctx.prisma.class.findUniqueOrThrow({ where: { id: input.id } });

            // aceita featuresByLevel (novo) OU features (legado)
            const clazz = normalizeClassRow({
                id: r.id,
                name: r.name,
                description: (r as any).description,
                hitDie: r.hitDie as "d6" | "d8" | "d10" | "d12",
                profs: r.profs,
                featuresByLevel: (r as any).featuresByLevel,
                features: (r as any).features,
                spellData: r.spellData,
                metaJson: r.metaJson,
            });

            const subs = await ctx.prisma.subclass.findMany({
                where: { classId: input.id },
                orderBy: { name: "asc" },
            });
            const subclasses = subs.map(normalizeSubclassRow);

            return ClassWithSubclassesVMZ.parse({ clazz, subclasses });
        }),
});

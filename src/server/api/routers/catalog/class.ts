import { z } from "zod";
import { Prisma } from "@prisma/client";
import { router, publicProcedure } from "../../trpc";
import {
    normalizeClassRow,
    normalizeSubclassRow,
    ClassWithSubclassesVMZ,
} from "./_normalize-class";
import {ClassLoreZ} from "@/server/api/routers/catalog/_lore.z";

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
    spellcasting: z
        .enum(["Arcano", "Divino", "Marcial", "Híbrido", "Nenhum"])
        .nullable(),
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
const SPELL_MAP: Record<
    string,
    "Arcano" | "Divino" | "Marcial" | "Híbrido" | "Nenhum"
> = {
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
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

/** Meta JSON vindo do banco (estruturas opcionais/soltas) */
const MetaSchema = z
    .object({
        role: z.string().optional(),
        hitDie: z.string().optional(),
        primaryAbilities: z.array(z.string()).optional(),
        savingThrows: z.array(z.string()).optional(),
        armorProficiencies: z.array(z.string()).optional(),
        weaponProficiencies: z.array(z.string()).optional(),
        spellcasting: z.string().optional(),
        description: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        featuresPreview: z.array(z.string()).optional(),
        assets: z
            .object({
                image: z.string().optional(),
                accentFrom: z.string().optional(),
                accentTo: z.string().optional(),
            })
            .partial()
            .optional(),
    })
    .partial();

type Meta = z.infer<typeof MetaSchema>;

function parseMeta(v: Prisma.JsonValue | null): Meta {
    if (v && typeof v === "object" && !Array.isArray(v)) {
        const parsed = MetaSchema.safeParse(v);
        if (parsed.success) return parsed.data;
    }
    return {};
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
                const meta = parseMeta(r.metaJson);

                const description =
                    typeof meta.description === "string" && meta.description.trim().length > 0
                        ? meta.description
                        : (r as { description?: string | null }).description ?? "Sem descrição.";

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
                    description,
                    pros: arrStr(meta.pros),
                    cons: arrStr(meta.cons),
                    featuresPreview: arrStr(meta.featuresPreview),
                    assets:
                        meta.assets && typeof meta.assets === "object"
                            ? {
                                image:
                                    typeof meta.assets.image === "string" ? meta.assets.image : undefined,
                                accentFrom:
                                    typeof meta.assets.accentFrom === "string" ? meta.assets.accentFrom : undefined,
                                accentTo:
                                    typeof meta.assets.accentTo === "string" ? meta.assets.accentTo : undefined,
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
                description: (r as { description?: string | null }).description ?? "",
                hitDie: r.hitDie as "d6" | "d8" | "d10" | "d12",
                profs: r.profs as unknown,
                featuresByLevel: (r as { featuresByLevel?: Prisma.JsonValue | null }).featuresByLevel ?? null,
                features: (r as { features?: Prisma.JsonValue | null }).features ?? null,
                spellData: r.spellData as unknown,
                metaJson: r.metaJson as unknown,
            });

            const subs = await ctx.prisma.subclass.findMany({
                where: { classId: input.id },
                orderBy: { name: "asc" },
            });
            const subclasses = subs.map(normalizeSubclassRow);

            return ClassWithSubclassesVMZ.parse({ clazz, subclasses });
        }),

    getLore: publicProcedure
        .input(z.object({
            classId: z.string(),
            locale: z.string().default("pt-BR"),
            version: z.number().int().optional(), // se omitido, pega o maior published ou maior versão
            publishedOnly: z.boolean().default(false),
        }))
        .query(async ({ ctx, input }) => {
            const where = {
                classId: input.classId,
                locale: input.locale,
                ...(input.version ? { version: input.version } : {}),
                ...(input.publishedOnly ? { publishedAt: { not: null as any } } : {}),
            };

            const row = await ctx.prisma.classLore.findFirst({
                where,
                orderBy: input.version
                    ? undefined
                    : [
                        { publishedAt: "desc" as const },
                        { version: "desc" as const },
                    ],
            });

            if (!row) return null;

            // montar DTO validado
            const dto = {
                classId: row.classId,
                locale: row.locale,
                version: row.version,
                title: row.title,
                tagline: row.tagline ?? undefined,
                readingTimeMin: row.readingMin ?? undefined,
                display: row.display ?? undefined,
                summary: row.summary,
                chapters: (row.chapters as unknown) ?? [],
                timeline: row.timeline ?? undefined,
                rituals: row.rituals ?? undefined,
                locations: row.locations ?? undefined,
                gameplay: row.gameplay ?? undefined,
                ui: row.ui ?? undefined,
                attribution: row.attribution ?? undefined,
            };

            const parsed = ClassLoreZ.safeParse(dto);
            return parsed.success ? parsed.data : null;
        }),
});

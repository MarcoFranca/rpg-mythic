import { z } from "zod";

/** Abilities em inglês (compatível com seu Zod existente) */
export const AbilityKey = z.enum(["str","dex","con","int","wis","cha"]);
export type AbilityKey = z.infer<typeof AbilityKey>;

/** ---------- Normalizadores utilitários ---------- */
function normTextKey(s: string): string {
    return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase().trim();
}

/** Mapa tolerante para Saves (PT → AbilityKey) */
const ABIL_NORM_TO_KEY: Record<string, AbilityKey> = {
    FORCA: "str",
    DESTREZA: "dex",
    CONSTITUICAO: "con",
    INTELIGENCIA: "int",
    SABEDORIA: "wis",
    CARISMA: "cha",
};

const ARMOR_PT_TO_GROUP = {
    LEVE: "light",
    MEDIA: "medium",
    PESADA: "heavy",
    ESCUDOS: "shields",
    "ESCUDOS (NAO METALICOS)": "shields",
} as const;
type ArmorGroup = typeof ARMOR_PT_TO_GROUP[keyof typeof ARMOR_PT_TO_GROUP];



const WEAPON_GROUP_HINTS = {
    SIMPLES: "simple",
    MARCIAIS: "martial",
} as const;

export const ALL_SKILLS_5E = [
    "acrobatics","animal_handling","arcana","athletics","deception","history","insight","intimidation",
    "investigation","medicine","nature","perception","performance","persuasion","religion","sleight_of_hand",
    "stealth","survival",
] as const;

// ========= DTOs expostos para a UI (detalhe) =========
export const SkillsChoicesZ = z.object({
    choose: z.number().int().min(0),
    from: z.array(z.string()).min(1),
});

export const ClassDetailVMZ = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    hitDie: z.enum(["d6","d8","d10","d12"]).nullable(),
    profs: z.object({
        armor: z.array(z.enum(["light","medium","heavy","shields"])).default([]),
        weapons: z.array(z.string()).default([]), // "simple" | "martial" | nomes específicos
        savingThrows: z.array(AbilityKey).length(2).or(z.array(AbilityKey).min(1)), // tolera seeds com 1 por enquanto
        skillsChoices: SkillsChoicesZ,
    }),
    features: z.array(z.any()).default([]),     // mantemos flexível
    spellData: z.object({
        progression: z.string().optional(),       // "full" | "half" | "pact" | ...
        focus: z.string().optional(),             // "arcano" | "divino" | "híbrido"
    }).optional(),
    meta: z.object({
        role: z.enum(["Defensor","Ofensor","Suporte","Híbrido"]).nullable(),
        primaryAbilities: z.array(z.string()).default([]),
        pros: z.array(z.string()).default([]),
        cons: z.array(z.string()).default([]),
        featuresPreview: z.array(z.string()).default([]),
        assets: z.object({
            image: z.string().optional(),
            accentFrom: z.string().optional(),
            accentTo: z.string().optional(),
        }).partial().optional(),
    }).optional(),
});
export type ClassDetailVM = z.infer<typeof ClassDetailVMZ>;

export const SubclassVMZ = z.object({
    id: z.string().uuid(),
    classId: z.string(),
    name: z.string(),
    description: z.string(),
    aliases: z.array(z.string()).default([]),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    featuresPreview: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
});
export type SubclassVM = z.infer<typeof SubclassVMZ>;

export const ClassWithSubclassesVMZ = z.object({
    clazz: ClassDetailVMZ,
    subclasses: z.array(SubclassVMZ),
});
export type ClassWithSubclassesVM = z.infer<typeof ClassWithSubclassesVMZ>;

// ========= helpers =========
function mapAbilitiesPtToKeys(pt: string[]): AbilityKey[] {
    return pt.map((s) => {
        const k = normTextKey(s);
        const key = ABIL_NORM_TO_KEY[k];
        if (!key) throw new Error(`Saving throw desconhecido: ${s}`);
        return key;
    });
}

function mapArmorPtToGroups(armor: string[]): ArmorGroup[] {
    const acc: ArmorGroup[] = [];
    for (const a of armor) {
        const k = normTextKey(a).replace(/ÃO/g, "AO"); // CONSTITUIÇÃO-style fix opcional
        const g = ARMOR_PT_TO_GROUP[k as keyof typeof ARMOR_PT_TO_GROUP];
        if (g && !acc.includes(g)) acc.push(g);
    }
    return acc;
}
function mapWeapons(weapons: string[]): string[] {
    return weapons.map((w) => {
        const k = normTextKey(w);
        if (k in WEAPON_GROUP_HINTS) return WEAPON_GROUP_HINTS[k as keyof typeof WEAPON_GROUP_HINTS];
        return w.trim();
    });
}

// ========= normalizador principal =========
export function normalizeClassRow(row: {
    id: string;
    name: string;
    description: string;
    hitDie: "d6" | "d8" | "d10" | "d12";
    profs: unknown;             // guardado em JSON
    features?: unknown;         // legado (JSON)
    featuresByLevel?: unknown;  // novo (JSON)
    spellData: unknown;         // guardado em JSON
    metaJson?: unknown;         // guardado em JSON
}): ClassDetailVM {
    // Zods “soltos” só para ler o que vem do banco em PT
    const ProfsPT = z.object({
        armor: z.array(z.string()).default([]),
        weapons: z.array(z.string()).default([]),
        saves: z.array(z.string()).default([]),
        skillsChoices: z.number().int().min(0).default(0),
    });
    const MetaPT = z.object({
            role: z.string().nullable().optional(),
        primaryAbilities: z.array(z.string()).optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        featuresPreview: z.array(z.string()).optional(),
        assets: z.object({
            image: z.string().optional(),
            accentFrom: z.string().optional(),
            accentTo: z.string().optional(),
        }).partial().optional(),
        // opcional: restringir de onde escolher perícias
        skillsPool: z.array(z.string()).optional(),
    }).partial();

    const ROLE_MAP: Record<string, "Defensor" | "Ofensor" | "Suporte" | "Híbrido"> = {
        DEFENSOR: "Defensor",
        OFENSOR: "Ofensor",
        SUPORTE: "Suporte",
        HIBRIDO: "Híbrido",
        HÍBRIDO: "Híbrido",
    };
    function normRole(v?: unknown) {
        if (typeof v !== "string") return null;
        const key = v.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase();
        return ROLE_MAP[key] ?? null;
    }

    const profsPT = ProfsPT.parse(row.profs ?? {});
    const metaPT = MetaPT.parse(row.metaJson ?? {});
    const savingThrows = profsPT.saves.length ? mapAbilitiesPtToKeys(profsPT.saves) : [];
    const armor = mapArmorPtToGroups(profsPT.armor);
    const weapons = mapWeapons(profsPT.weapons);

    const skillsFrom = metaPT.skillsPool && metaPT.skillsPool.length > 0
        ? metaPT.skillsPool
        : [...ALL_SKILLS_5E];

    // Unifica features (novo/legado)
    const featuresUnified =
        (row.featuresByLevel as unknown[]) ??
        (row.features as unknown[]) ??
        [];

    return ClassDetailVMZ.parse({
        id: row.id,
        name: row.name,
        description: row.description ?? "Sem descrição.",
        hitDie: row.hitDie ?? null,
        profs: {
            armor,
            weapons,
            savingThrows,
            skillsChoices: { choose: profsPT.skillsChoices, from: skillsFrom },
        },
        features: featuresUnified,
        spellData: (row.spellData as Record<string, unknown>) ?? undefined,
        meta: {
            role: normRole(metaPT.role),
            primaryAbilities: metaPT.primaryAbilities ?? [],
            pros: metaPT.pros ?? [],
            cons: metaPT.cons ?? [],
            featuresPreview: metaPT.featuresPreview ?? [],
            assets: metaPT.assets,
        },
    });
}

export function normalizeSubclassRow(row: {
    id: string;
    classId: string;
    name: string;
    description: string;
    metaJson?: unknown;
}): SubclassVM {
    const Meta = z.object({
        aliases: z.array(z.string()).optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        featuresPreview: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
    }).partial();

    const meta = Meta.parse(row.metaJson ?? {});
    return SubclassVMZ.parse({
        id: row.id,
        classId: row.classId,
        name: row.name,
        description: row.description,
        aliases: meta.aliases ?? [],
        pros: meta.pros ?? [],
        cons: meta.cons ?? [],
        featuresPreview: meta.featuresPreview ?? [],
        tags: meta.tags ?? [],
    });
}

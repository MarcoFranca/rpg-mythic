import { z } from "zod";

/** ---------- Atributos ---------- */
const AbilityKeyLower = z.enum(["str","dex","con","int","wis","cha"]);
const AbilityKeyUpper = z.enum(["STR","DEX","CON","INT","WIS","CHA"]);
export const AbilityKey = z.union([AbilityKeyLower, AbilityKeyUpper])
    .transform((k) => k.toLowerCase() as z.infer<typeof AbilityKeyLower>);

export const AttributesBase = z.object({
    str: z.number().int().min(1),
    dex: z.number().int().min(1),
    con: z.number().int().min(1),
    int: z.number().int().min(1),
    wis: z.number().int().min(1),
    cha: z.number().int().min(1),
});

export const AttributesLayer = z.object({
    key: AbilityKey,                   // aceita "STR"/"WIS" etc., normaliza para minúsculo
    value: z.number().int(),           // pode ser negativo (condições/itens)
    source: z.string(),                // ex.: "Ancestralidade: Liriem", "Item: Elmo X"
});

export const AttributesBlock = z.object({
    base: AttributesBase,
    bonuses: z.array(AttributesLayer).default([]),
    temp: z.array(AttributesLayer).default([]),
});

/** ---------- UI espiritual (EF) ---------- */
export const Trend = z.enum(["ASC","DESC","STABLE"]);
export const SpiritualBalanceBlock = z.object({
    value: z.number().int().min(-5).max(5).default(0),
    trend: Trend.default("STABLE"),
});

/** ---------- Combate ---------- */
export const ResistFlag = z.enum([
    "acid","cold","fire","force","lightning","necrotic","poison","psychic","radiant","thunder",
    "bludgeoning","piercing","slashing","other"
]);

export const Speeds = z.object({
    walk: z.number().int().min(0),
    fly: z.number().int().min(0).optional(),
    swim: z.number().int().min(0).optional(),
    climb: z.number().int().min(0).optional(),
    burrow: z.number().int().min(0).optional(),
});

export const CombatBlock = z.object({
    ac: z.number().int().min(0),                  // AC atual (antes do breakdown)
    initiative_bonus: z.number().int().default(0),
    speeds: Speeds,
    resistances: z.array(ResistFlag).default([]),
    immunities: z.array(ResistFlag).default([]),
    vulnerabilities: z.array(ResistFlag).default([]),
});

/** ---------- Sentidos & Passivas ---------- */
export const SensesBlock = z.object({
    darkvision: z.number().int().min(0).optional(),
    blindsight: z.number().int().min(0).optional(),
    tremorsense: z.number().int().min(0).optional(),
    truesight: z.number().int().min(0).optional(),
    passive: z.object({
        perception: z.number().int().min(0).default(10),
        insight: z.number().int().min(0).default(10),
        investigation: z.number().int().min(0).default(10),
    }),
});

/** ---------- Ataques (UI) ---------- */
export const AttackEntry = z.object({
    source: z.enum(["weapon","spell","feature"]),
    name: z.string(),
    toHit: z.number().int(),
    damage: z.string(),                          // ex.: "1d8+3"
    damageType: z.string().default(""),
    properties: z.array(z.string()).default([]),
});

/** ---------- Spellcasting ---------- */
export const SpellSlots = z.record(
    z.string(),
    z.object({ max: z.number().int().min(0), cur: z.number().int().min(0) })
);

export const SpellcastingBlock = z.object({
    ability: AbilityKey,                         // int|wis|cha (normalizado)
    cd: z.number().int(),                        // Spell Save DC
    attack_bonus: z.number().int(),
    slots: SpellSlots,                           // { "1":{max,cur}, ... }
    known: z.array(z.string()).default([]),
    prepared: z.array(z.string()).default([]),
    concentration: z.object({ spellId: z.string(), startedAt: z.string() }).optional(),
});

/** ---------- Inventário & Attunement ---------- */
export const Currency = z.object({
    cp: z.number().int().min(0),
    sp: z.number().int().min(0),
    gp: z.number().int().min(0),
    pp: z.number().int().min(0),
});

export const InventoryItem = z.object({
    id: z.string().optional(),
    itemId: z.string().optional(),
    name: z.string(),
    qty: z.number().int().min(0).default(1),
    weight: z.number().min(0).default(0),
    rarity: z.string().optional(),
    tags: z.array(z.string()).default([]),
    effects: z.array(z.any()).default([]),
    attunementRequired: z.boolean().default(false),
    equippedSlot: z.enum([
        "MAIN_HAND","OFF_HAND","HEAD","CHEST","HANDS","RING1","RING2","AMULET","CAPE","BOOTS","BELT"
    ]).optional(),
});

export const AttunementBlock = z.object({
    limit: z.number().int().min(0).default(3),
    attunedItemIds: z.array(z.string()).default([]),
});

/** ---------- Features/Feats/Conditions ---------- */
export const FeatureEntry = z.object({
    name: z.string(),
    desc: z.string(),
    origin: z.string().optional(),
    level: z.number().int().optional(),
    effects: z.array(z.any()).default([]),
});

export const ConditionKey = z.enum([
    "blinded",
    "restrained",
    "grappled",
    "poisoned",
    "exhaustion", // nível em Character.exhaustionLevel já existe; chave ajuda a UI
]);

export const ConditionEntry = z.object({
    key: ConditionKey,
    level: z.number().int().optional(),
    expiresAt: z.string().optional(),
});

// flags derivados opcionais
export const CombatFlags = z.object({
    attackDisadvantage: z.boolean().default(false),
    attackedByAdvantage: z.boolean().default(false),
    abilityChecksDisadvantage: z.boolean().default(false),
    stealthDisadvantage: z.boolean().default(false),
});

/** ---------- Recursos de Classe ---------- */
export const ResetKind = z.enum(["short","long","custom"]);
export const ClassResource = z.object({
    name: z.string(),
    current: z.number().int().min(0),
    max: z.number().int().min(0),
    reset: ResetKind,
});

export const ClassResourcesBlock = z.object({
    ki: z.object({ current: z.number().int().min(0), max: z.number().int().min(0) }).optional(),
    sorcery: z.object({ current: z.number().int().min(0), max: z.number().int().min(0) }).optional(),
    superiority: z.object({ current: z.number().int().min(0), max: z.number().int().min(0) }).optional(),
    custom: z.array(ClassResource).default([]),
});

/** ---------- Recursos Eldoryon ---------- */
export const ResourceMeter = z.object({
    current: z.number().int().min(0),
    max: z.number().int().min(0),
    thresholds: z.array(z.number().int()).optional(),
});

// Éter (cores + fadiga) — retrocompatível
export const EtherAlignment = z.enum(["DIVINO","PROFANO","HARMONICO","PRIMORDIAL"]);
export const EtherBlock = ResourceMeter.extend({
    alignment: EtherAlignment.default("HARMONICO"),
    flux: z.number().int().min(0).default(0),
    overload: z.number().int().min(0).default(0),
    resonance: z.object({
        schools: z.array(z.string()).default([]),
        intensity: z.number().int().min(0).max(3).default(0),
    }).optional(),
}).passthrough();

// Corrupção (níveis/limiares) — retrocompatível
export const CorruptionThresholds = z.object({
    minor: z.number().int().min(0).default(2),
    major: z.number().int().min(0).default(4),
    critical: z.number().int().min(0).default(6),
});

export const CorruptionBlock = ResourceMeter.extend({
    level: z.number().int().min(0).default(0),
    source: z.string().nullable().default(null),
    manifestations: z.array(z.string()).default([]),
    thresholds: CorruptionThresholds.default({ minor: 2, major: 4, critical: 6 }),
    marks: z.array(z.object({ name: z.string(), desc: z.string().optional() })).default([]),
}).passthrough();

/** ---------- Derived Snapshot ---------- */
export const DerivedSnapshot = z.object({
    ac: z.object({
        total: z.number().int().min(0),
        base: z.number().int().min(0),
        armor: z.number().int().min(0).default(0),
        shield: z.number().int().min(0).default(0),
        misc: z.number().int().min(0).default(0),
    }),
    passives: z.object({
        perception: z.number().int().min(0),
        insight: z.number().int().min(0),
        investigation: z.number().int().min(0),
    }),
    encumbrance: z.object({
        carriedWeight: z.number().min(0),
        capacity: z.number().min(0),
        status: z.enum(["normal","encumbered","heavily_encumbered"]).default("normal"),
    }),
    spell: z.object({
        cd: z.number().int().optional(),
        attack: z.number().int().optional(),
    }).optional(),
});

/** ---------- Helpers “ensure*” (defaults seguros) ---------- */
export function ensureSpiritualBalance(json: unknown) {
    const r = SpiritualBalanceBlock.safeParse(json);
    return r.success ? r.data : { value: 0, trend: "STABLE" as const };
}

export function ensureEther(json: unknown) {
    const base = { current: 0, max: 6, alignment: "HARMONICO" as const, flux: 0, overload: 0 };
    const r = EtherBlock.safeParse({ ...base, ...(json as object) });
    return r.success ? r.data : base;
}

export function ensureCorruption(json: unknown) {
    const base = {
        current: 0,
        max: 6,
        level: 0,
        source: null as string | null,
        manifestations: [] as string[],
        thresholds: { minor: 2, major: 4, critical: 6 },
        marks: [] as { name: string; desc?: string }[],
    };
    const r = CorruptionBlock.safeParse({ ...base, ...(json as object) });
    return r.success ? r.data : base;
}

/** ---------- Types (aliases) ---------- */
export type AbilityKey = z.infer<typeof AbilityKey>;
export type AttributesBase = z.infer<typeof AttributesBase>;
export type AttributesLayer = z.infer<typeof AttributesLayer>;
export type AttributesBlockT = z.infer<typeof AttributesBlock>;

export type Trend = z.infer<typeof Trend>;
export type SpiritualBalanceBlockT = z.infer<typeof SpiritualBalanceBlock>;

export type ResistFlag = z.infer<typeof ResistFlag>;
export type Speeds = z.infer<typeof Speeds>;
export type CombatBlockT = z.infer<typeof CombatBlock>;

export type SensesBlockT = z.infer<typeof SensesBlock>;
export type AttackEntryT = z.infer<typeof AttackEntry>;

export type SpellSlots = z.infer<typeof SpellSlots>;
export type SpellcastingBlockT = z.infer<typeof SpellcastingBlock>;

export type CurrencyT = z.infer<typeof Currency>;
export type InventoryItemT = z.infer<typeof InventoryItem>;
export type AttunementBlockT = z.infer<typeof AttunementBlock>;

export type FeatureEntryT = z.infer<typeof FeatureEntry>;
export type ConditionKey = z.infer<typeof ConditionKey>;
export type ConditionEntryT = z.infer<typeof ConditionEntry>;
export type CombatFlagsT = z.infer<typeof CombatFlags>;

export type ResetKind = z.infer<typeof ResetKind>;
export type ClassResourceT = z.infer<typeof ClassResource>;
export type ClassResourcesBlockT = z.infer<typeof ClassResourcesBlock>;

export type ResourceMeterT = z.infer<typeof ResourceMeter>;
export type EtherAlignment = z.infer<typeof EtherAlignment>;
export type EtherBlockT = z.infer<typeof EtherBlock>;
export type CorruptionThresholdsT = z.infer<typeof CorruptionThresholds>;
export type CorruptionBlockT = z.infer<typeof CorruptionBlock>;

export type DerivedSnapshotT = z.infer<typeof DerivedSnapshot>;

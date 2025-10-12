import { z } from "zod";

// ——— Types explícitos (alias com sufixo T)
export type ConditionKey = z.infer<typeof ConditionKey>;
export type AttributesBlockT = z.infer<typeof AttributesBlock>;
export type CombatBlockT = z.infer<typeof CombatBlock>;
export type SensesBlockT = z.infer<typeof SensesBlock>;
export type InventoryItemT = z.infer<typeof InventoryItem>;
export type SpellcastingBlockT = z.infer<typeof SpellcastingBlock>;
export type AttunementBlockT = z.infer<typeof AttunementBlock>;
export type FeatureEntryT = z.infer<typeof FeatureEntry>;
export type ConditionEntryT = z.infer<typeof ConditionEntry>;
export type ClassResourcesBlockT = z.infer<typeof ClassResourcesBlock>;
export type ResourceMeterT = z.infer<typeof ResourceMeter>;
export type EtherBlockT = z.infer<typeof EtherBlock>;
export type CorruptionBlockT = z.infer<typeof CorruptionBlock>;
export type DerivedSnapshotT = z.infer<typeof DerivedSnapshot>;

/** ---------- Atributos ---------- */
export const AbilityKey = z.enum(["str","dex","con","int","wis","cha"]);
export type AbilityKey = z.infer<typeof AbilityKey>;

export const AttributesBase = z.object({
    str: z.number().int().min(1),
    dex: z.number().int().min(1),
    con: z.number().int().min(1),
    int: z.number().int().min(1),
    wis: z.number().int().min(1),
    cha: z.number().int().min(1),
});
export type AttributesBase = z.infer<typeof AttributesBase>;

export const AttributesLayer = z.object({
    key: AbilityKey,
    value: z.number().int(),            // pode ser negativo (condição/itens)
    source: z.string(),                 // "Ancestralidade: Liriem", "Item: Elmo X"
});
export type AttributesLayer = z.infer<typeof AttributesLayer>;

export const AttributesBlock = z.object({
    base: AttributesBase,
    bonuses: z.array(AttributesLayer).default([]),
    temp: z.array(AttributesLayer).default([]),
});
export type AttributesBlock = z.infer<typeof AttributesBlock>;

/** ---------- Combate ---------- */
export const ResistFlag = z.enum(["acid","cold","fire","force","lightning","necrotic","poison","psychic","radiant","thunder","bludgeoning","piercing","slashing","other"]);
export type ResistFlag = z.infer<typeof ResistFlag>;

export const Speeds = z.object({
    walk: z.number().int().min(0),
    fly: z.number().int().min(0).optional(),
    swim: z.number().int().min(0).optional(),
    climb: z.number().int().min(0).optional(),
    burrow: z.number().int().min(0).optional(),
});
export type Speeds = z.infer<typeof Speeds>;

export const CombatBlock = z.object({
    ac: z.number().int().min(0),                         // AC base atual (antes de breakdown)
    initiative_bonus: z.number().int().default(0),       // misc além do DEX
    speeds: Speeds,
    resistances: z.array(ResistFlag).default([]),
    immunities: z.array(ResistFlag).default([]),
    vulnerabilities: z.array(ResistFlag).default([]),
});
export type CombatBlock = z.infer<typeof CombatBlock>;

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
export type SensesBlock = z.infer<typeof SensesBlock>;

/** ---------- Ataques (UI) ---------- */
export const AttackEntry = z.object({
    source: z.enum(["weapon","spell","feature"]),
    name: z.string(),
    toHit: z.number().int(),
    damage: z.string(),                 // "1d8+3"
    damageType: z.string().default(""),
    properties: z.array(z.string()).default([]),
});
export type AttackEntry = z.infer<typeof AttackEntry>;

/** ---------- Spellcasting ---------- */
export const SpellSlots = z.record(z.string(), z.object({ max: z.number().int().min(0), cur: z.number().int().min(0) }));
export type SpellSlots = z.infer<typeof SpellSlots>;

export const SpellcastingBlock = z.object({
    ability: AbilityKey,         // INT | WIS | CHA
    cd: z.number().int(),        // Spell Save DC
    attack_bonus: z.number().int(),
    slots: SpellSlots,           // { "1":{max,cur}, ... }
    known: z.array(z.string()).default([]),
    prepared: z.array(z.string()).default([]),
    concentration: z.object({ spellId: z.string(), startedAt: z.string() }).optional(),
});
export type SpellcastingBlock = z.infer<typeof SpellcastingBlock>;

/** ---------- Inventário & Attunement ---------- */
export const Currency = z.object({ cp: z.number().int().min(0), sp: z.number().int().min(0), gp: z.number().int().min(0), pp: z.number().int().min(0) });
export type Currency = z.infer<typeof Currency>;

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
    equippedSlot: z.enum(["MAIN_HAND","OFF_HAND","HEAD","CHEST","HANDS","RING1","RING2","AMULET","CAPE","BOOTS","BELT"]).optional(),
});
export type InventoryItem = z.infer<typeof InventoryItem>;

export const AttunementBlock = z.object({
    limit: z.number().int().min(0).default(3),
    attunedItemIds: z.array(z.string()).default([]),
});
export type AttunementBlock = z.infer<typeof AttunementBlock>;

/** ---------- Features/Feats/Conditions ---------- */
export const FeatureEntry = z.object({
    name: z.string(),
    desc: z.string(),
    origin: z.string().optional(),
    level: z.number().int().optional(),
    effects: z.array(z.any()).default([]),
});
export type FeatureEntry = z.infer<typeof FeatureEntry>;

export const ConditionKey = z.enum([
    "blinded",
    "restrained",
    "grappled",
    "poisoned",
    "exhaustion" // nível em Character.exhaustionLevel já existe, mas mantemos a chave p/ UI
]);

export const ConditionEntry = z.object({
    key: ConditionKey,
    level: z.number().int().optional(),   // p/ ex. exaustão num outro sistema, mantemos opcional
    expiresAt: z.string().optional(),
});
export type ConditionEntry = z.infer<typeof ConditionEntry>;

// opcional: flags derivados que a UI pode usar
export const CombatFlags = z.object({
    attackDisadvantage: z.boolean().default(false),
    attackedByAdvantage: z.boolean().default(false),
    abilityChecksDisadvantage: z.boolean().default(false),
    stealthDisadvantage: z.boolean().default(false),
});
export type CombatFlags = z.infer<typeof CombatFlags>;

/** ---------- Recursos de Classe ---------- */
export const ResetKind = z.enum(["short","long","custom"]);
export type ResetKind = z.infer<typeof ResetKind>;

export const ClassResource = z.object({
    name: z.string(),
    current: z.number().int().min(0),
    max: z.number().int().min(0),
    reset: ResetKind,
});
export type ClassResource = z.infer<typeof ClassResource>;

export const ClassResourcesBlock = z.object({
    ki: z.object({ current: z.number().int().min(0), max: z.number().int().min(0) }).optional(),
    sorcery: z.object({ current: z.number().int().min(0), max: z.number().int().min(0) }).optional(),
    superiority: z.object({ current: z.number().int().min(0), max: z.number().int().min(0) }).optional(),
    custom: z.array(ClassResource).default([]),
});
export type ClassResourcesBlock = z.infer<typeof ClassResourcesBlock>;

/** ---------- Recursos Eldoryon ---------- */
export const ResourceMeter = z.object({
    current: z.number().int().min(0),
    max: z.number().int().min(0),
    thresholds: z.array(z.number().int()).optional(),
});
export type ResourceMeter = z.infer<typeof ResourceMeter>;

export const EtherBlock = ResourceMeter.extend({
    resonance: z.object({ schools: z.array(z.string()).default([]), intensity: z.number().int().min(0).max(3).default(0) }).optional(),
});
export type EtherBlock = z.infer<typeof EtherBlock>;

export const CorruptionBlock = ResourceMeter.extend({
    marks: z.array(z.object({ name: z.string(), desc: z.string().optional() })).default([]),
});
export type CorruptionBlock = z.infer<typeof CorruptionBlock>;

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


export type DerivedSnapshot = z.infer<typeof DerivedSnapshot>;

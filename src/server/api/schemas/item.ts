import { z } from "zod";
import { Rarity, Tier, DamageType, Range, ArmorType, ArmorPart } from "./enums";
import {
    PrimarySecondaryDamage, SetBonus, JsonArray, JsonRecord, Requirements, AbilityList, EffectsAny
} from "./common-json";

// -------- Item base --------
export const ItemBase = z.object({
    id: z.string().uuid().optional(), // Prisma gera se não mandar
    name: z.string().min(1),
    description: z.string().min(1),
    rarity: Rarity,
    tier: Tier,
    value: z.number().int(),
    levelRequired: z.number().int(),
    image: z.string().url().nullable().optional(),
    setCode: z.string().nullable().optional(),
    setName: z.string().nullable().optional(),
    setBonuses: z.array(SetBonus).nullable().optional(),
});

// -------- Weapon (1–1) --------
export const WeaponCreate = z.object({
    category: z.string().min(1),
    subCategory: z.string().min(1).optional().nullable(),
    weight: z.number(),
    primaryDamage: PrimarySecondaryDamage,
    secondaryDamage: PrimarySecondaryDamage.optional().nullable(),
    damageType: z.string().pipe(DamageType),
    secondaryDamageType: z.string().pipe(DamageType).optional().nullable(),
    range: z.string().pipe(Range),
    specialRange: z.string().optional().nullable(),
    properties: JsonArray, // array JSON
    elementalType: z.string().optional().nullable(),
    requirements: z.union([JsonRecord, Requirements]),
    abilitiesActive: z.union([JsonArray, AbilityList]),
    abilitiesPassive: z.union([JsonArray, AbilityList]),
    attributeBoosts: JsonRecord.optional().nullable(),
    rarityBoosts: JsonArray.optional().nullable(),
    disadvantages: JsonArray.optional().nullable(),
    durability: z.number().int(),
    classRestrictions: JsonArray.optional().nullable(),
    ongoingEffects: EffectsAny.optional().nullable(),
    targetEffects: EffectsAny.optional().nullable(),
    conditionalEffects: EffectsAny.optional().nullable(),
    grantedResistances: EffectsAny.optional().nullable(),
});

// -------- Armor (1–1) --------
export const ArmorCreate = z.object({
    armorPart: z.string().pipe(ArmorPart),
    armorType: z.string().pipe(ArmorType),   subType: z.string().optional().nullable(),
    defenseValue: z.number().int(),
    maxDexBonus: z.number().int().optional().nullable(),
    resistances: z.union([JsonArray, JsonRecord]),
    vulnerabilities: z.union([JsonArray, JsonRecord]).optional().nullable(),
    penalties: z.union([JsonArray, JsonRecord]),
    disadvantages: z.union([JsonArray, JsonRecord]).optional().nullable(),
    requirements: z.union([JsonRecord, Requirements]),
    abilities: z.union([JsonArray, AbilityList]),
    ongoingEffects: EffectsAny.optional().nullable(),
    conditionalEffects: EffectsAny.optional().nullable(),
    attributeBoosts: JsonRecord.optional().nullable(),
    grantedResistances: EffectsAny.optional().nullable(),
    durability: z.number().int(),
    classRestrictions: JsonArray.optional().nullable(),
});

// -------- Consumable (1–1) --------
export const ConsumableCreate = z.object({
    consumableType: z.string().min(1), // "potion" etc.
    effectType: z.string().min(1),     // "heal", "mana_restore" etc.
    effectIntensity: z.union([JsonRecord, JsonArray]),
    effectDuration: z.string().min(1),
    usageConditions: JsonRecord.optional().nullable(),
    quantity: z.number().int(),
    expiration: z.coerce.date().optional().nullable(),
});

// -------- Composições --------
// Item + exatamente 1 subtipo
export const ItemWithWeaponCreate = ItemBase.extend({
    Weapon: WeaponCreate,
}).strict();

export const ItemWithArmorCreate = ItemBase.extend({
    Armor: ArmorCreate,
}).strict();

export const ItemWithConsumableCreate = ItemBase.extend({
    Consumable: ConsumableCreate,
}).strict();

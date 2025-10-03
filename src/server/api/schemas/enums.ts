import { z } from "zod";

// Tuplas literais (para z.enum([...]) e para "in" do Prisma)
export const RARITIES = ["common","uncommon","rare","very_rare","legendary","artifact","mythic"] as const;
export const TIERS = ["low","medium","high","legendary","artifact"] as const;
export const DAMAGE_TYPES = ["slash","pierce","blunt","fire","cold","acid","poison","necrotic","radiant","thunder","lightning","psychic","force","shadow"] as const;
export const RANGES = ["melee","short","medium","long","extra_long","infinite"] as const;
export const ARMOR_TYPES = ["light","medium","heavy","shield"] as const;
export const ARMOR_PARTS = ["helmet","chestplate","gloves","bracers","boots","cloak","shield_part"] as const;

// Zod enums derivados das tuplas
export const Rarity = z.enum(RARITIES);
export const Tier = z.enum(TIERS);
export const DamageType = z.enum(DAMAGE_TYPES);
export const Range = z.enum(RANGES);
export const ArmorType = z.enum(ARMOR_TYPES);
export const ArmorPart = z.enum(ARMOR_PARTS);

// Tipos auxiliares (opcional)
export type TRarity = typeof RARITIES[number];
export type TTier = typeof TIERS[number];
export type TDamageType = typeof DAMAGE_TYPES[number];
export type TRange = typeof RANGES[number];
export type TArmorType = typeof ARMOR_TYPES[number];
export type TArmorPart = typeof ARMOR_PARTS[number];

import { z } from "zod";

// Enums exatamente como no Prisma
export const Rarity = z.enum(["common","uncommon","rare","very_rare","legendary","artifact","mythic"]);
export const Tier = z.enum(["low","medium","high","legendary","artifact"]);
export const DamageType = z.enum(["slash","pierce","blunt","fire","cold","acid","poison","necrotic","radiant","thunder","lightning","psychic","force","shadow"]);
export const Range = z.enum(["melee","short","medium","long","extra_long","infinite"]);
export const ArmorType = z.enum(["light","medium","heavy","shield"]);
export const ArmorPart = z.enum(["helmet","chestplate","gloves","bracers","boots","cloak","shield_part"]);

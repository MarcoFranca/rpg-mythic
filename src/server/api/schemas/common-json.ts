import { z } from "zod";

// Estruturas mínimas coerentes para seus JSONB (pode evoluir depois)
export const Dice = z.object({
    dice_count: z.number().int().min(1),
    dice_type: z.number().int().min(2),
    bonus: z.number().int().default(0),
});

export const PrimarySecondaryDamage = z.object({
    dice_count: z.number().int().min(1),
    dice_type: z.number().int().min(2),
    bonus: z.number().int().default(0),
});

export const SetBonusEffect = z.any(); // flexível por enquanto
export const SetBonus = z.object({
    pieces: z.number().int().min(1),
    effects: z.array(SetBonusEffect),
});

export const JsonArray = z.array(z.any());
export const JsonRecord = z.record(z.any());

// Campos JSON genéricos usados em Weapon/Armor/Consumable
export const Requirements = z.record(z.number().int()); // ex: { forca: 13 }
export const AbilityList = z.array(z.string()); // nomes/ids de habilidades
export const EffectsAny = z.any();

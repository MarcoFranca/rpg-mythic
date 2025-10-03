import { z } from "zod";
import {zJson} from "@/types/zjson";

// Estruturas mínimas coerentes para seus JSONB (pode evoluir depois)
export const Dice = z.object({
    dice_count: z.number().int().min(1),
    dice_type: z.number().int().min(2),
    bonus: z.number().int().default(0),
});

export const PrimarySecondaryDamage = z.object({
    dice_count: z.number().int().min(0),
    dice_type: z.number().int().min(2),
    bonus: z.number().int(),
});

export const SetBonusEffect = z.any(); // flexível por enquanto
export const SetBonus = z.object({
    pieces: z.number().int().min(1),
    effects: z.array(zJson),
});
export const JsonRecord = z.record(z.string(), zJson);
export const JsonArray = z.array(zJson);

// Campos JSON genéricos usados em Weapon/Armor/Consumable
export const Requirements = JsonRecord;        // ex: { forca: 13 }
export const AbilityList = z.array(z.string()); // ex: ["Visão na Fumaça"]
export const EffectsAny = zJson;

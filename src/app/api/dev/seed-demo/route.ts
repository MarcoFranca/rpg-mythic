import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@prisma/client"; // <- IMPORTANTE

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
    }

    const exist = await prisma.item.count();
    if (exist > 0) return NextResponse.json({ ok: true, message: "Already seeded", count: exist });

    const w = await prisma.item.create({
        data: {
            name: "Espada Longa Rúnica",
            description: "Lâmina que canaliza energia antiga.",
            rarity: "very_rare",
            tier: "high",
            value: 3200,
            levelRequired: 8,
            image: null,
            Weapon: {
                create: {
                    category: "Espada",
                    subCategory: "Espada Longa",
                    weight: 3.2,
                    primaryDamage: { dice_count: 1, dice_type: 8, bonus: 1 },
                    secondaryDamage: { dice_count: 1, dice_type: 6, bonus: 0 },
                    damageType: "slash",
                    secondaryDamageType: "radiant",
                    range: "melee",
                    specialRange: null,                 // string? pode ser null
                    properties: ["versátil"],           // JSON ok
                    elementalType: null,                // string? pode ser null
                    requirements: { forca: 13 },
                    abilitiesActive: [],
                    abilitiesPassive: ["Brilho Próprio"],
                    attributeBoosts: { sabedoria: 1 },
                    rarityBoosts: [{ type: "bonus_damage", target: "undead", value: { dice_count: 1, dice_type: 8 } }],
                    disadvantages: [],
                    durability: 160,
                    classRestrictions: [],
                    ongoingEffects: Prisma.DbNull,      // <- ERA null (JSON) ➜ DbNull
                    targetEffects: [],
                    conditionalEffects: [{ condition: "critical_hit", effect: { type: "stun", duration: 1, chance: 25 } }],
                    grantedResistances: []
                }
            }
        }
    });

    const a = await prisma.item.create({
        data: {
            name: "Capuz do Dragão Ancião",
            description: "Parte do conjunto Mítico Dracônico.",
            rarity: "mythic",
            tier: "legendary",
            value: 5000,
            levelRequired: 12,
            image: null,
            setCode: "MYTHIC_DRAGONBORN",
            setName: "Conjunto Dracônico Ancião",
            setBonuses: [
                { pieces: 2, effects: [{ type: "resistance", damage_type: "fire", level: "resistance" }] },
                { pieces: 3, effects: [{ type: "damage_boost", value: "+1d4 fire" }] },
                { pieces: 4, effects: [{ type: "ability", name: "Sopro Dracônico", cooldown: 3 }] },
                { pieces: 5, effects: [{ type: "immunity", damage_type: "fire" }] }
            ],
            Armor: {
                create: {
                    armorPart: "helmet",
                    armorType: "heavy",
                    subType: "Elmo Placas Escamadas",
                    defenseValue: 3,
                    maxDexBonus: 0,
                    resistances: [{ type: "fire", level: "resistance", value: 50 }],
                    vulnerabilities: [],
                    penalties: [{ type: "furtividade", value: -2 }],
                    disadvantages: [],
                    requirements: { forca: 15 },
                    abilities: ["Visão na Fumaça"],
                    ongoingEffects: Prisma.DbNull,      // <- ERA null (JSON)
                    conditionalEffects: [{ condition: "receber_ataque_critico", effect: { type: "aumento_defesa", value: 1, duration: 1, chance: 50 } }],
                    attributeBoosts: { constituicao: 1 },
                    grantedResistances: [],
                    durability: 200,
                    classRestrictions: ["Guerreiro", "Paladino"]
                }
            }
        }
    });

    const c = await prisma.item.create({
        data: {
            name: "Poção de Mana (Maior)",
            description: "Restaura uma grande quantidade de mana.",
            rarity: "rare",
            tier: "medium",
            value: 250,
            levelRequired: 5,
            image: null,
            Consumable: {
                create: {
                    consumableType: "potion",
                    effectType: "mana_restore",
                    effectIntensity: { mana_restore: 40 },
                    effectDuration: "Instantâneo",
                    usageConditions: { fora_de_combate: false },
                    quantity: 1,
                    expiration: null                      // DateTime? pode ser null
                }
            }
        }
    });

    return NextResponse.json({ ok: true, created: [w.id, a.id, c.id] });
}

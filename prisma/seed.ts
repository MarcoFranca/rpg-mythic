import { PrismaClient, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const JNULL = Prisma.JsonNull; // jsonb 'null'
const DBNULL = Prisma.DbNull;  // SQL NULL (recomendado p/ "sem valor")

async function main() {
    // Weapon example (Espada Longa Rúnica)
    const weaponId = randomUUID();
    await prisma.item.create({
        data: {
            id: weaponId,
            name: "Espada Longa Rúnica",
            description: "Lâmina que canaliza energia antiga.",
            rarity: "very_rare",
            tier: "high",
            value: 3200,
            levelRequired: 8,
            image: null,          // String? aceita null literal
            setCode: null,        // String? aceita null literal
            setName: null,        // String? aceita null literal
            setBonuses: DBNULL,   // Json? → use DbNull/JsonNull em vez de null
            Weapon: {
                create: {
                    // itemId: weaponId, // nested create não precisa
                    category: "Espada",
                    subCategory: "Espada Longa",
                    weight: 3.2,
                    primaryDamage: { dice_count: 1, dice_type: 8, bonus: 1 },
                    secondaryDamage: { dice_count: 1, dice_type: 6, bonus: 0 },
                    damageType: "slash",
                    secondaryDamageType: "radiant",
                    range: "melee",
                    specialRange: null,             // String? ok
                    properties: ["versátil"],       // Json
                    elementalType: null,            // String? ok
                    requirements: { forca: 13 },    // Json
                    abilitiesActive: [],            // Json
                    abilitiesPassive: ["Brilho Próprio"],
                    attributeBoosts: { sabedoria: 1 },
                    rarityBoosts: [
                        { type: "bonus_damage", target: "undead", value: { dice_count: 1, dice_type: 8 } },
                    ],
                    disadvantages: [],
                    durability: 160,
                    classRestrictions: [],
                    ongoingEffects: DBNULL,         // manter chave, sem valor
                    targetEffects: [],
                    conditionalEffects: [
                        { condition: "critical_hit", effect: { type: "stun", duration: 1, chance: 25 } },
                    ],
                    grantedResistances: [],
                },
            },
        },
    });

    // Armor example (parte + set)
    const armorId = randomUUID();
    await prisma.item.create({
        data: {
            id: armorId,
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
                    ongoingEffects: DBNULL, // manter chave, sem valor
                    conditionalEffects: [
                        {
                            condition: "receber_ataque_critico",
                            effect: { type: "aumento_defesa", value: 1, duration: 1, chance: 50 },
                        },
                    ],
                    attributeBoosts: { constituicao: 1 },
                    grantedResistances: [],
                    durability: 200,
                    classRestrictions: ["Guerreiro", "Paladino"],
                },
            },
        },
    });

    // Consumable example (Poção de Mana Maior)
    const consId = randomUUID();
    await prisma.item.create({
        data: {
            id: consId,
            name: "Poção de Mana (Maior)",
            description: "Restaura uma grande quantidade de mana.",
            rarity: "rare",
            tier: "medium",
            value: 250,
            levelRequired: 5,
            image: null,
            Consumable: {
                create: {
                    // itemId: consId, // não precisa
                    consumableType: "potion",
                    effectType: "mana_restore",
                    effectIntensity: { mana_restore: 40 },
                    effectDuration: "Instantâneo",
                    usageConditions: { fora_de_combate: false },
                    quantity: 1,
                    expiration: null,   // DateTime? ok
                },
            },
        },
    });

    console.log("Seed OK");
}

main().finally(() => prisma.$disconnect());

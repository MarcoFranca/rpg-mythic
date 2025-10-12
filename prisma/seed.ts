// prisma/seed.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path"; // ✅

const prisma = new PrismaClient();
const load = (p: string) =>
    JSON.parse(readFileSync(resolve(process.cwd(), p), "utf-8"));

// Use DbNull/JsonNull apenas em campos JSON
const JNULL = Prisma.JsonNull; // representa JSON `null`
const DBNULL = Prisma.DbNull;  // representa SQL NULL dentro de JSONB

async function seedCore() {
    const ancestries = load("prisma/seed/ancestries.json");
    const classes = load("prisma/seed/classes.json");
    const backgrounds = load("prisma/seed/backgrounds.json");

    await prisma.ancestry.createMany({ data: ancestries, skipDuplicates: true });
    await prisma["class"].createMany({ data: classes, skipDuplicates: true });
    await prisma.background.createMany({ data: backgrounds, skipDuplicates: true });

    console.log("✅ Ancestries/Classes/Backgrounds semeados.");
}

async function seedExamples() {
    // ⚠️ Descomente este bloco somente se os modelos abaixo EXISTIREM no schema:
    // Item, Weapon, Armor, Consumable (1–1 com Item via relations)

    // Verificação leve para evitar crash em projetos sem Item:
    const hasItem = await prisma.$queryRawUnsafe<{ exists: boolean }[]>(
        `SELECT EXISTS (
       SELECT 1
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'Item'
     ) as "exists";`
    ).then(r => r[0]?.exists).catch(() => false);

    if (!hasItem) {
        console.log("ℹ️ Modelos de Item não encontrados. Pulando exemplos de itens.");
        return;
    }

    // ---------- EXEMPLO: Espada Longa Rúnica ----------
    const weaponId = randomUUID();
    await prisma.item.upsert({
        where: { id: weaponId },
        create: {
            id: weaponId,
            name: "Espada Longa Rúnica",
            description: "Lâmina que canaliza energia antiga.",
            rarity: "very_rare",        // garanta que o tipo do campo aceita esse valor
            tier: "high",               // idem
            value: 3200,
            levelRequired: 8,
            image: null,                // String?
            setCode: null,              // String?
            setName: null,              // String?
            setBonuses: DBNULL,         // Json?
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
                    specialRange: null,             // String?
                    properties: ["versátil"],       // Json
                    elementalType: null,            // String?
                    requirements: { forca: 13 },    // Json
                    abilitiesActive: [],            // Json
                    abilitiesPassive: ["Brilho Próprio"], // Json
                    attributeBoosts: { sabedoria: 1 },    // Json
                    rarityBoosts: [
                        { type: "bonus_damage", target: "undead", value: { dice_count: 1, dice_type: 8 } },
                    ],
                    disadvantages: [],
                    durability: 160,
                    classRestrictions: [],
                    ongoingEffects: DBNULL,         // Json?
                    targetEffects: [],
                    conditionalEffects: [
                        { condition: "critical_hit", effect: { type: "stun", duration: 1, chance: 25 } },
                    ],
                    grantedResistances: [],
                },
            },
        },
        update: {},
    });

    // ---------- EXEMPLO: Capuz do Dragão Ancião (Armor) ----------
    const armorId = randomUUID();
    await prisma.item.upsert({
        where: { id: armorId },
        create: {
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
                    ongoingEffects: DBNULL, // Json?
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
        update: {},
    });

    // ---------- EXEMPLO: Poção de Mana (Consumable) ----------
    const consId = randomUUID();
    await prisma.item.upsert({
        where: { id: consId },
        create: {
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
                    consumableType: "potion",
                    effectType: "mana_restore",
                    effectIntensity: { mana_restore: 40 },
                    effectDuration: "Instantâneo",
                    usageConditions: { fora_de_combate: false },
                    quantity: 1,
                    expiration: null,   // DateTime?
                },
            },
        },
        update: {},
    });

    console.log("✅ Exemplos de itens semeados.");
}

async function main() {
    await seedCore();
    await seedExamples(); // comenta esta linha se ainda não tem os models de Item
    console.log("🌱 Seed OK");
}

main()
    .catch((e) => {
        console.error("❌ Seed falhou:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

/* eslint-disable no-console */
import { PrismaClient, $Enums } from "@prisma/client";
import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";

const prisma = new PrismaClient();

// validações simples para evitar string fora do enum
const asRarity = (v: string) => {
    if (!Object.values($Enums.Rarity).includes(v as $Enums.Rarity)) throw new Error(`rarity inválida: ${v}`);
    return v as $Enums.Rarity;
};
const asTier = (v: string) => {
    if (!Object.values($Enums.Tier).includes(v as $Enums.Tier)) throw new Error(`tier inválida: ${v}`);
    return v as $Enums.Tier;
};
const asDamageType = (v: string | null | undefined) => {
    if (v == null) return null;
    if (!Object.values($Enums.DamageType).includes(v as $Enums.DamageType)) throw new Error(`damageType inválido: ${v}`);
    return v as $Enums.DamageType;
};
const asRange = (v: string) => {
    if (!Object.values($Enums.Range).includes(v as $Enums.Range)) throw new Error(`range inválido: ${v}`);
    return v as $Enums.Range;
};
const asArmorType = (v: string) => {
    if (!Object.values($Enums.ArmorType).includes(v as $Enums.ArmorType)) throw new Error(`armorType inválido: ${v}`);
    return v as $Enums.ArmorType;
};
const asArmorPart = (v: string) => {
    if (!Object.values($Enums.ArmorPart).includes(v as $Enums.ArmorPart)) throw new Error(`armorPart inválido: ${v}`);
    return v as $Enums.ArmorPart;
};

type Row = { model: "item" | "weapon" | "armor" | "consumable"; pk: string; fields: any };

async function upsertPair(rows: Row[]) {
    // regra das duas entradas: 1 Item + 1 subtipo (mesmo UUID)
    const itemRow = rows.find(r => r.model === "item");
    if (!itemRow) throw new Error("Fixture sem 'item'");

    const sub = rows.find(r => r.model !== "item");
    if (!sub) throw new Error("Fixture sem subtipo (weapon/armor/consumable)");

    const id = itemRow.pk;
    const item = itemRow.fields;

    // cria/atualiza Item
    await prisma.item.upsert({
        where: { id },
        update: {
            name: item.name,
            description: item.description,
            rarity: asRarity(item.rarity),
            tier: asTier(item.tier),
            value: item.value,
            levelRequired: item.levelRequired,
            image: item.image ?? null,
            setCode: item.setCode ?? null,
            setName: item.setName ?? null,
            setBonuses: item.setBonuses ?? null,
        },
        create: {
            id,
            name: item.name,
            description: item.description,
            rarity: asRarity(item.rarity),
            tier: asTier(item.tier),
            value: item.value,
            levelRequired: item.levelRequired,
            image: item.image ?? null,
            setCode: item.setCode ?? null,
            setName: item.setName ?? null,
            setBonuses: item.setBonuses ?? null,
        },
    });

    // cria/atualiza subtipo
    if (sub.model === "weapon") {
        const w = sub.fields;
        await prisma.weapon.upsert({
            where: { itemId: id },
            update: {
                category: w.category,
                subCategory: w.subCategory ?? null,
                weight: w.weight,
                primaryDamage: w.primaryDamage,
                secondaryDamage: w.secondaryDamage ?? null,
                damageType: asDamageType(w.damageType)!,
                secondaryDamageType: asDamageType(w.secondaryDamageType),
                range: asRange(w.range),
                specialRange: w.specialRange ?? null,
                properties: w.properties ?? [],
                elementalType: w.elementalType ?? null,
                requirements: w.requirements ?? {},
                abilitiesActive: w.abilitiesActive ?? [],
                abilitiesPassive: w.abilitiesPassive ?? [],
                attributeBoosts: w.attributeBoosts ?? null,
                rarityBoosts: w.rarityBoosts ?? null,
                disadvantages: w.disadvantages ?? null,
                durability: w.durability,
                classRestrictions: w.classRestrictions ?? null,
                ongoingEffects: w.ongoingEffects ?? null,
                targetEffects: w.targetEffects ?? null,
                conditionalEffects: w.conditionalEffects ?? null,
                grantedResistances: w.grantedResistances ?? null,
            },
            create: {
                itemId: id,
                category: w.category,
                subCategory: w.subCategory ?? null,
                weight: w.weight,
                primaryDamage: w.primaryDamage,
                secondaryDamage: w.secondaryDamage ?? null,
                damageType: asDamageType(w.damageType)!,
                secondaryDamageType: asDamageType(w.secondaryDamageType),
                range: asRange(w.range),
                specialRange: w.specialRange ?? null,
                properties: w.properties ?? [],
                elementalType: w.elementalType ?? null,
                requirements: w.requirements ?? {},
                abilitiesActive: w.abilitiesActive ?? [],
                abilitiesPassive: w.abilitiesPassive ?? [],
                attributeBoosts: w.attributeBoosts ?? null,
                rarityBoosts: w.rarityBoosts ?? null,
                disadvantages: w.disadvantages ?? null,
                durability: w.durability,
                classRestrictions: w.classRestrictions ?? null,
                ongoingEffects: w.ongoingEffects ?? null,
                targetEffects: w.targetEffects ?? null,
                conditionalEffects: w.conditionalEffects ?? null,
                grantedResistances: w.grantedResistances ?? null,
            },
        });
    } else if (sub.model === "armor") {
        const a = sub.fields;
        await prisma.armor.upsert({
            where: { itemId: id },
            update: {
                armorPart: asArmorPart(a.armorPart),
                armorType: asArmorType(a.armorType),
                subType: a.subType ?? null,
                defenseValue: a.defenseValue,
                maxDexBonus: a.maxDexBonus ?? null,
                resistances: a.resistances ?? [],
                vulnerabilities: a.vulnerabilities ?? null,
                penalties: a.penalties ?? [],
                disadvantages: a.disadvantages ?? null,
                requirements: a.requirements ?? {},
                abilities: a.abilities ?? [],
                ongoingEffects: a.ongoingEffects ?? null,
                conditionalEffects: a.conditionalEffects ?? null,
                attributeBoosts: a.attributeBoosts ?? null,
                grantedResistances: a.grantedResistances ?? null,
                durability: a.durability,
                classRestrictions: a.classRestrictions ?? null,
            },
            create: {
                itemId: id,
                armorPart: asArmorPart(a.armorPart),
                armorType: asArmorType(a.armorType),
                subType: a.subType ?? null,
                defenseValue: a.defenseValue,
                maxDexBonus: a.maxDexBonus ?? null,
                resistances: a.resistances ?? [],
                vulnerabilities: a.vulnerabilities ?? null,
                penalties: a.penalties ?? [],
                disadvantages: a.disadvantages ?? null,
                requirements: a.requirements ?? {},
                abilities: a.abilities ?? [],
                ongoingEffects: a.ongoingEffects ?? null,
                conditionalEffects: a.conditionalEffects ?? null,
                attributeBoosts: a.attributeBoosts ?? null,
                grantedResistances: a.grantedResistances ?? null,
                durability: a.durability,
                classRestrictions: a.classRestrictions ?? null,
            },
        });
    } else if (sub.model === "consumable") {
        const c = sub.fields;
        await prisma.consumable.upsert({
            where: { itemId: id },
            update: {
                consumableType: c.consumableType,
                effectType: c.effectType,
                effectIntensity: c.effectIntensity,
                effectDuration: c.effectDuration,
                usageConditions: c.usageConditions ?? null,
                quantity: c.quantity,
                expiration: c.expiration ? new Date(c.expiration) : null,
            },
            create: {
                itemId: id,
                consumableType: c.consumableType,
                effectType: c.effectType,
                effectIntensity: c.effectIntensity,
                effectDuration: c.effectDuration,
                usageConditions: c.usageConditions ?? null,
                quantity: c.quantity,
                expiration: c.expiration ? new Date(c.expiration) : null,
            },
        });
    } else {
        throw new Error(`Subtipo desconhecido: ${sub.model}`);
    }
}

async function main() {
    const dir = join(process.cwd(), "data");
    const files = readdirSync(dir).filter(f => extname(f) === ".json");

    for (const f of files) {
        const full = join(dir, f);
        const text = readFileSync(full, "utf8");
        const arr = JSON.parse(text) as Row[] | Row;
        const rowsList = Array.isArray(arr) ? [arr] : [ [arr] as any ]; // garante lista de pares

        // alguns arquivos já vêm em pares no mesmo array; outros podem vir em grupos de 2
        for (const rows of rowsList) {
            const group: Row[] = Array.isArray(rows) ? rows : [rows];
            try {
                await upsertPair(group);
                console.log("OK:", f);
            } catch (e: any) {
                console.error("ERRO:", f, "-", e.message);
            }
        }
    }
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});

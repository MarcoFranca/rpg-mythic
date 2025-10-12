import { z } from "zod";
import {
    AbilityKey,
    AttributesBlock,
    CombatBlock,
    SensesBlock,
    InventoryItem,       // schema
    SpellcastingBlock,   // schema
    DerivedSnapshot,     // schema
    ConditionEntry,      // schema
    CombatFlags,         // schema
    // types
    AttributesBlockT,
    CombatBlockT,
    SensesBlockT,
    InventoryItemT,
    SpellcastingBlockT,
    DerivedSnapshotT,
    ConditionEntryT,
} from "@/server/zod/character-blocks";
import { CONDITION_RULES, impactFromExhaustion } from "./conditions.catalog";

// ——— Helpers
export const abilityMod = (score: number) => Math.floor((score - 10) / 2);
export const proficiencyByLevel = (level: number) =>
    level >= 17 ? 6 : level >= 13 ? 5 : level >= 9 ? 4 : level >= 5 ? 3 : 2;

// soma de layers
export function composeAttributes(attr: AttributesBlockT): Record<AbilityKey, number> {
    const total: Record<AbilityKey, number> = { ...attr.base };
    const apply = (layers: AttributesBlockT["bonuses"]) => {
        for (const l of layers || []) {
            total[l.key] = (total[l.key] ?? 0) + l.value;
        }
    };
    apply(attr.bonuses);
    apply(attr.temp);
    return total;
}


// ——— ARMADURAS & ESCUDOS
type ArmorInfo = {
    kind: "none"|"light"|"medium"|"heavy"|"natural";
    base?: number;
    dexCap?: number | null;
    misc?: number;
};
type ShieldInfo = { bonus: number };

function parseArmorFromTags(item: InventoryItemT): ArmorInfo | null {
    const tags = item.tags || [];
    const chest = item.equippedSlot === "CHEST";
    if (!chest) return null;

    const meta = item as unknown as Record<string, unknown>;
    const hasMeta =
        "acBase" in meta || "dexCap" in meta || "acMisc" in meta || "kind" in meta;

    if (hasMeta) {
        const num = (v: unknown) => (typeof v === "number" ? v : undefined);
        const numOrNull = (v: unknown) =>
            typeof v === "number" ? v : v === null ? null : undefined;

        const rawKind = meta["kind"];
        const kind: ArmorInfo["kind"] =
            rawKind === "light" ||
            rawKind === "medium" ||
            rawKind === "heavy" ||
            rawKind === "natural"
                ? rawKind
                : "natural";

        return {
            kind,
            base: num(meta["acBase"]) ?? 10,
            dexCap: numOrNull(meta["dexCap"]) ?? null,
            misc: num(meta["acMisc"]) ?? 0,
        };
    }

    if (tags.includes("armor:light")) return { kind: "light", base: 11, dexCap: null, misc: 0 };
    if (tags.includes("armor:medium")) return { kind: "medium", base: 12, dexCap: 2, misc: 0 };
    if (tags.includes("armor:heavy")) return { kind: "heavy", base: 16, dexCap: 0, misc: 0 };
    if (tags.includes("armor:natural")) return { kind: "natural", base: 13, dexCap: null, misc: 0 };

    return null;
}


function parseShieldFromTags(item: InventoryItemT): ShieldInfo | null {
    const tags = item.tags || [];
    const off = item.equippedSlot === "OFF_HAND";
    if (!off) return null;

    if (tags.includes("shield")) {
        const meta = item as unknown as Record<string, unknown>;
        const bonus =
            typeof meta["shieldBonus"] === "number" ? (meta["shieldBonus"] as number) : 2;
        return { bonus };
    }
    return null;
}

export function calcArmorClass(items: InventoryItemT[], dexMod: number) {
    let baseAC = 10 + dexMod;
    let armorBonus = 0;
    let shieldBonus = 0;
    let misc = 0;

    let armor: ArmorInfo | null = null;
    let shield: ShieldInfo | null = null;

    for (const it of items) {
        if (!it.equippedSlot) continue;
        armor ??= parseArmorFromTags(it);
        shield ??= parseShieldFromTags(it);

        if ((it.tags || []).includes("ac+1")) misc += 1;
        if ((it.tags || []).includes("ac+2")) misc += 2;
    }

    if (armor) {
        const dexCap = armor.dexCap ?? null;
        if (armor.base !== undefined) {
            if (dexCap === null) baseAC = armor.base + dexMod;
            else baseAC = armor.base + Math.max(0, Math.min(dexMod, dexCap));
        }
        armorBonus += Number(armor.misc ?? 0);
    }

    if (shield) shieldBonus += shield.bonus;

    const total = Math.max(10, baseAC + armorBonus + shieldBonus + misc);
    return { total, base: baseAC, armor: armorBonus, shield: shieldBonus, misc };
}

// ——— PASSIVAS
export function calcPassives(
    mods: Record<AbilityKey, number>,
    profBonus: number,
    skillProfs?: Partial<Record<string, "NONE"|"TRAINED"|"EXPERTISE"|"HALF">>
) {
    const score = (ability: AbilityKey, skill?: string) => {
        let prof = 0;
        const rank = skill ? skillProfs?.[skill] : undefined;
        if (rank === "TRAINED") prof = profBonus;
        if (rank === "EXPERTISE") prof = profBonus * 2;
        if (rank === "HALF") prof = Math.floor(profBonus / 2);
        return 10 + mods[ability] + prof;
    };
    return {
        perception: score("wis", "perception"),
        insight: score("wis", "insight"),
        investigation: score("int", "investigation"),
    };
}

// ——— ENCUMBRANCE
export function calcEncumbrance(strScore: number, items: InventoryItemT[]) {
    const carried = items.reduce((sum, it) => sum + (it.weight || 0) * (it.qty || 1), 0);
    const capacityNormal = strScore * 7;
    const capacityHeavy = strScore * 10;
    let status: "normal" | "encumbered" | "heavily_encumbered" = "normal";
    if (carried > capacityHeavy) status = "heavily_encumbered";
    else if (carried > capacityNormal) status = "encumbered";
    return { carriedWeight: carried, capacity: capacityHeavy, status };
}

// ——— MAGIA
export function calcSpellNumbers(
    spellcasting: SpellcastingBlockT | undefined,
    profBonus: number,
    mods: Record<AbilityKey, number>
) {
    if (!spellcasting) return undefined;
    const mod = mods[spellcasting.ability];
    return { cd: 8 + profBonus + mod, attack: profBonus + mod };
}

// ——— CONDIÇÕES

function aggregateConditionImpacts(conditions: ConditionEntryT[] = [], exhaustionLevel = 0) {
    let speedMultiplier = 1;
    let setSpeedToZero = false;
    let acBonus = 0;
    const flags: z.infer<typeof CombatFlags> = {
        attackDisadvantage: false,
        attackedByAdvantage: false,
        abilityChecksDisadvantage: false,
        stealthDisadvantage: false,
    };

    for (const c of conditions) {
        const rule = CONDITION_RULES[c.key];
        if (!rule) continue;
        if (rule.setSpeedToZero) setSpeedToZero = true;
        if (rule.speedMultiplier !== undefined) speedMultiplier = Math.min(speedMultiplier, rule.speedMultiplier);
        if (rule.acBonus) acBonus += rule.acBonus;
        if (rule.flags) {
            flags.attackDisadvantage ||= !!rule.flags.attackDisadvantage;
            flags.attackedByAdvantage ||= !!rule.flags.attackedByAdvantage;
            flags.abilityChecksDisadvantage ||= !!rule.flags.abilityChecksDisadvantage;
            flags.stealthDisadvantage ||= !!rule.flags.stealthDisadvantage;
        }
    }

    // exaustão
    const ex = impactFromExhaustion(exhaustionLevel || 0);
    if (ex.setSpeedToZero) setSpeedToZero = true;
    if (ex.speedMultiplier !== undefined) speedMultiplier = Math.min(speedMultiplier, ex.speedMultiplier);
    if (ex.acBonus) acBonus += ex.acBonus;
    if (ex.flags) {
        flags.attackDisadvantage ||= !!ex.flags.attackDisadvantage;
        flags.attackedByAdvantage ||= !!ex.flags.attackedByAdvantage;
        flags.abilityChecksDisadvantage ||= !!ex.flags.abilityChecksDisadvantage;
        flags.stealthDisadvantage ||= !!ex.flags.stealthDisadvantage;
    }

    return { speedMultiplier, setSpeedToZero, acBonus, flags };
}

// ——— SNAPSHOT FINAL
export function buildDerivedSnapshot(opts: {
    level: number;
    attributes: AttributesBlockT;
    combat: CombatBlockT;
    senses: SensesBlockT;
    inventory: InventoryItemT[];
    spellcasting?: SpellcastingBlockT;
    conditions?: ConditionEntryT[];
    exhaustionLevel?: number;
}): DerivedSnapshotT & { flags?: z.infer<typeof CombatFlags>; speedsFinal?: Record<string, number> } {
    const totalAttr = composeAttributes(opts.attributes);
    const mods = {
        str: abilityMod(totalAttr.str),
        dex: abilityMod(totalAttr.dex),
        con: abilityMod(totalAttr.con),
        int: abilityMod(totalAttr.int),
        wis: abilityMod(totalAttr.wis),
        cha: abilityMod(totalAttr.cha),
    };
    const prof = proficiencyByLevel(opts.level);

    const equipped = opts.inventory.filter(i => i.equippedSlot);

    const ac0 = calcArmorClass(equipped, mods.dex);

    const agg = aggregateConditionImpacts(opts.conditions || [], opts.exhaustionLevel || 0);
    const ac = { ...ac0, total: Math.max(0, ac0.total + (agg.acBonus || 0)) };

    const pass = calcPassives(mods, prof);
    const enc = calcEncumbrance(totalAttr.str, opts.inventory);

    const baseSpeeds = opts.combat.speeds as Record<string, number>;
    const speedsFinal: Record<string, number> = { ...baseSpeeds };
    if (agg.setSpeedToZero) {
        for (const k of Object.keys(speedsFinal)) speedsFinal[k] = 0;
    } else if (agg.speedMultiplier !== 1) {
        for (const k of Object.keys(speedsFinal)) speedsFinal[k] = Math.floor(speedsFinal[k] * agg.speedMultiplier);
    }

    const spell = calcSpellNumbers(opts.spellcasting, prof, mods);

    const snapshot: DerivedSnapshotT & { flags?: z.infer<typeof CombatFlags>; speedsFinal?: Record<string, number> } = {
        ac,
        passives: pass,
        encumbrance: enc,
        ...(spell ? { spell } : {}),
        flags: agg.flags,
        speedsFinal,
    };
    return snapshot;
}

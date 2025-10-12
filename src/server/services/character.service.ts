import { PrismaClient } from "@prisma/client";
import {
    AttributesBlock, CombatBlock, SensesBlock,
    InventoryItem, SpellcastingBlock, ConditionEntry,
    // types
    AttributesBlockT, CombatBlockT, SensesBlockT, InventoryItemT, SpellcastingBlockT, ConditionEntryT
} from "@/server/zod/character-blocks";
import { buildDerivedSnapshot } from "@/lib/character/engine";

export async function recomputeSnapshot(prisma: PrismaClient, characterId: string) {
    const ch = await prisma.character.findUnique({ where: { id: characterId } });
    if (!ch) throw new Error("Character not found");

    // validar com schemas, mas tipar com T
    const attributes = AttributesBlock.parse(ch.attributes) as AttributesBlockT;
    const combat = CombatBlock.parse(ch.combat) as CombatBlockT;
    const senses = SensesBlock.parse(ch.senses) as SensesBlockT;
    const conditions = (ch.conditions || []) as ConditionEntryT[];
    const inventory = (Array.isArray(ch.inventory) ? ch.inventory : []) as InventoryItemT[];
    const spellcasting = ch.spellcasting ? (SpellcastingBlock.parse(ch.spellcasting) as SpellcastingBlockT) : undefined;

    const snapshot = buildDerivedSnapshot({
        level: ch.level,
        attributes, combat, senses, inventory, spellcasting,
        conditions,
        exhaustionLevel: ch.exhaustionLevel ?? 0,
    });

    await prisma.character.update({
        where: { id: characterId },
        data: { derivedSnapshot: snapshot },
    });

    return snapshot;
}

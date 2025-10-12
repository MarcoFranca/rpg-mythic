// src/server/routers/character.sheet.ts
import { router, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
    AttributesBlock,
    CombatBlock,
    SensesBlock,
    InventoryItem,
    SpellcastingBlock,
    ConditionEntry,
} from "@/server/zod/character-blocks";

const IdInput = z.object({ id: z.string().uuid() });

// Tipos derivados dos esquemas (elimina `any`)
type AttributesBlockT = z.infer<typeof AttributesBlock>;
type CombatBlockT = z.infer<typeof CombatBlock>;
type SensesBlockT = z.infer<typeof SensesBlock>;
type InventoryItemT = z.infer<typeof InventoryItem>;
type SpellcastingBlockT = z.infer<typeof SpellcastingBlock>;
type ConditionEntryT = z.infer<typeof ConditionEntry>;

// Helpers de “defaults seguros”
const defaultAttributes: AttributesBlockT = {
    base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    bonuses: [],
    temp: [],
};
const defaultCombat: CombatBlockT = {
    ac: 10,
    initiative_bonus: 0,
    speeds: { walk: 9 },
    resistances: [],
    immunities: [],
    vulnerabilities: [],
};
const defaultSenses: SensesBlockT = {
    passive: { perception: 10, insight: 10, investigation: 10 },
};
const defaultCurrency = { cp: 0, sp: 0, gp: 0, pp: 0 };

// Normalizador genérico (sem `any`)
function normalize<S extends z.ZodTypeAny>(
    schema: S,
    value: unknown,
    fallback: z.infer<S>,
): z.infer<S> {
    const parsed = schema.safeParse(value);
    return parsed.success ? parsed.data : fallback;
}

export const characterSheetRouter = router({
    getById: protectedProcedure
        .input(IdInput)
        .query(async ({ ctx, input }) => {
            const ch = await ctx.prisma.character.findFirst({
                where: { id: input.id, userId: ctx.user.id },
                select: {
                    id: true,
                    name: true,
                    portraitUrl: true,
                    inspiration: true,
                    level: true,
                    exhaustionLevel: true,
                    // blocos JSON
                    attributes: true,
                    combat: true,
                    senses: true,
                    inventory: true,
                    spellcasting: true,
                    conditions: true,
                    derivedSnapshot: true,
                    faith: true,
                    ether: true,
                    corruption: true,
                },
            });

            if (!ch) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Personagem não encontrado.",
                });
            }

            // Normalização defensiva (evita 500 por null/shape inesperado)
            const attributes = normalize(AttributesBlock, ch.attributes, defaultAttributes);
            const combat = normalize(CombatBlock, ch.combat, defaultCombat);
            const senses = normalize(SensesBlock, ch.senses, defaultSenses);

            const inventory: InventoryItemT[] = Array.isArray(ch.inventory)
                ? (ch.inventory as unknown[])
                    .map((x) => {
                        const p = InventoryItem.safeParse(x);
                        return p.success ? p.data : null;
                    })
                    .filter((i): i is InventoryItemT => Boolean(i))
                : [];

            const spellcasting: SpellcastingBlockT | undefined = (() => {
                if (!ch.spellcasting) return undefined;
                const p = SpellcastingBlock.safeParse(ch.spellcasting);
                return p.success ? p.data : undefined;
            })();

            const conditions: ConditionEntryT[] = Array.isArray(ch.conditions)
                ? (ch.conditions as unknown[])
                    .map((x) => {
                        const p = ConditionEntry.safeParse(x);
                        return p.success ? p.data : null;
                    })
                    .filter((i): i is ConditionEntryT => Boolean(i))
                : [];

            return {
                id: ch.id,
                name: ch.name,
                portraitUrl: ch.portraitUrl ?? null,
                inspiration: !!ch.inspiration,
                level: ch.level ?? 1,
                exhaustionLevel: ch.exhaustionLevel ?? 0,
                attributes,
                combat,
                senses,
                inventory,
                spellcasting,
                conditions,
                derivedSnapshot: ch.derivedSnapshot ?? null, // pode ser null
                faith: ch.faith ?? defaultCurrency,
                ether: ch.ether ?? defaultCurrency,
                corruption: ch.corruption ?? { ...defaultCurrency, marks: [] as string[] },
            };
        }),

    setInspiration: protectedProcedure
        .input(z.object({ id: z.string().uuid(), value: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.character.update({
                where: { id: input.id, userId: ctx.user.id },
                data: { inspiration: input.value },
            });
            return { ok: true };
        }),

    saveAttributesAndSnapshot: protectedProcedure
        .input(z.object({ id: z.string().uuid(), attributes: AttributesBlock }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.character.update({
                where: { id: input.id, userId: ctx.user.id },
                data: { attributes: input.attributes },
            });
            const { recomputeSnapshot } = await import("@/server/services/character.service");
            const snapshot = await recomputeSnapshot(ctx.prisma, input.id);
            return { ok: true, snapshot };
        }),
});

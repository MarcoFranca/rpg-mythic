import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { router, protectedProcedure } from "@/server/api/trpc";
import { AttributesBlock, AttributesBlockT } from "@/server/zod/character-blocks";
import { recomputeSnapshot } from "@/server/services/character.service";

const identityInput = z.object({
    name: z.string().trim().min(2).max(40),
    pronoun: z.enum(["ele", "ela"]).optional(),
    concept: z.string().trim().max(90).optional(),
    epithet: z.string().trim().max(60).optional(),
    tone: z.enum(["aurora", "crepusculo", "tempestade", "brasa", "abismo"]).optional(),
});

function withCreationProgress(metadata: Prisma.JsonValue | null, updates: Record<string, unknown>): Prisma.InputJsonValue {
    const base = metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {};
    const previous = "creation" in base && base.creation && typeof base.creation === "object" && !Array.isArray(base.creation)
        ? base.creation
        : {};
    return { ...base, creation: { ...previous, ...updates } } as Prisma.InputJsonValue;
}

async function requireOwnedDraft(userId: string, id: string, prisma: Parameters<typeof recomputeSnapshot>[0]) {
    const character = await prisma.character.findFirst({
        where: { id, userId, state: "DRAFT" },
        select: { id: true, metadata: true },
    });
    if (!character) throw new TRPCError({ code: "NOT_FOUND", message: "Rascunho não encontrado." });
    return character;
}

export const characterCreateRouter = router({
    getCurrentDraft: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.character.findFirst({
            where: { userId: ctx.user.id, state: "DRAFT" },
            orderBy: { updatedAt: "desc" },
            select: { id: true, name: true, title: true, pronoun: true, ancestryId: true, backgroundId: true, classes: true, metadata: true },
        });
    }),

    createDraft: protectedProcedure.mutation(async ({ ctx }) => {
        const existing = await ctx.prisma.character.findFirst({
            where: { userId: ctx.user.id, state: "DRAFT" },
            orderBy: { updatedAt: "desc" },
            select: { id: true },
        });
        if (existing) return existing;

        const fallbackAncestry = await ctx.prisma.ancestry.findFirst({ orderBy: { name: "asc" }, select: { id: true } });
        if (!fallbackAncestry) {
            throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Nenhuma ancestralidade está disponível." });
        }

        const character = await ctx.prisma.character.create({
            data: {
                userId: ctx.user.id,
                state: "DRAFT",
                visibility: "PRIVATE",
                name: "Eco sem Nome",
                ancestryId: fallbackAncestry.id,
                classes: [{ classId: "guerreiro", level: 1 }],
                level: 1,
                xp: 0,
                inspiration: false,
                attributes: { base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, bonuses: [], temp: [] },
                proficiencyBonus: 2,
                hp: { max: 10, current: 10, temp: 0, hit_dice: "1d10", death_saves: { s: 0, f: 0 } },
                combat: { ac: 10, initiative_bonus: 0, speeds: { walk: 9 }, resistances: [], immunities: [], vulnerabilities: [] },
                senses: { passive: { perception: 10, insight: 10, investigation: 10 } },
                currency: { cp: 0, sp: 0, gp: 0, pp: 0 },
                inventory: [],
                attunement: { limit: 3, attunedItemIds: [] },
                features: [],
                metadata: { creation: { ancestryConfirmed: false, backgroundConfirmed: false } },
                faith: { current: 0, max: 10 },
                ether: { current: 0, max: 10 },
                corruption: { current: 0, max: 10, marks: [] },
            },
            select: { id: true },
        });
        return character;
    }),

    saveIdentity: protectedProcedure
        .input(z.object({ id: z.string().uuid(), data: identityInput }))
        .mutation(async ({ ctx, input }) => {
            const character = await requireOwnedDraft(ctx.user.id, input.id, ctx.prisma);
            await ctx.prisma.character.update({
                where: { id: input.id },
                data: {
                    name: input.data.name,
                    pronoun: input.data.pronoun,
                    title: input.data.epithet,
                    metadata: withCreationProgress(character.metadata, { concept: input.data.concept, tone: input.data.tone }),
                },
            });
            return { ok: true };
        }),

    saveClass: protectedProcedure
        .input(z.object({ id: z.string().uuid(), classId: z.string(), subclassId: z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
            await requireOwnedDraft(ctx.user.id, input.id, ctx.prisma);
            const clazz = await ctx.prisma.class.findUnique({ where: { id: input.classId }, select: { id: true } });
            if (!clazz) throw new TRPCError({ code: "NOT_FOUND", message: "Classe não encontrada." });
            if (input.subclassId) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "O Caminho é escolhido no nível 3, não durante a criação inicial." });
            }
            await ctx.prisma.character.update({
                where: { id: input.id },
                data: { classes: [{ classId: input.classId, level: 1 }], level: 1 },
            });
            return { ok: true };
        }),

    saveAncestry: protectedProcedure
        .input(z.object({ id: z.string().uuid(), ancestryId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const character = await requireOwnedDraft(ctx.user.id, input.id, ctx.prisma);
            const ancestry = await ctx.prisma.ancestry.findUnique({ where: { id: input.ancestryId }, select: { id: true } });
            if (!ancestry) throw new TRPCError({ code: "NOT_FOUND", message: "Ancestralidade não encontrada." });
            await ctx.prisma.character.update({
                where: { id: input.id },
                data: { ancestryId: input.ancestryId, metadata: withCreationProgress(character.metadata, { ancestryConfirmed: true }) },
            });
            return { ok: true };
        }),

    saveBackground: protectedProcedure
        .input(z.object({ id: z.string().uuid(), backgroundId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const character = await requireOwnedDraft(ctx.user.id, input.id, ctx.prisma);
            const background = await ctx.prisma.background.findUnique({ where: { id: input.backgroundId }, select: { id: true } });
            if (!background) throw new TRPCError({ code: "NOT_FOUND", message: "Antecedente não encontrado." });
            await ctx.prisma.character.update({
                where: { id: input.id },
                data: { backgroundId: input.backgroundId, metadata: withCreationProgress(character.metadata, { backgroundConfirmed: true }) },
            });
            return { ok: true };
        }),

    saveAttributes: protectedProcedure
        .input(z.object({ id: z.string().uuid(), attributes: AttributesBlock }))
        .mutation(async ({ ctx, input }) => {
            await requireOwnedDraft(ctx.user.id, input.id, ctx.prisma);
            const attributes = input.attributes as AttributesBlockT;
            await ctx.prisma.character.update({ where: { id: input.id }, data: { attributes } });
            const snapshot = await recomputeSnapshot(ctx.prisma, input.id);
            return { ok: true, snapshot };
        }),

    finalize: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await requireOwnedDraft(ctx.user.id, input.id, ctx.prisma);
            await recomputeSnapshot(ctx.prisma, input.id);
            await ctx.prisma.character.update({ where: { id: input.id }, data: { state: "COMPLETE", visibility: "PRIVATE" } });
            return { ok: true };
        }),
});

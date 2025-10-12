import { router, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
    AttributesBlock, AttributesBlockT,
} from "@/server/zod/character-blocks";
import { recomputeSnapshot } from "@/server/services/character.service";

const ClassesEntry = z.object({
    classId: z.string(),
    level: z.number().int().min(1),
    subclassId: z.string().optional(),
});
const StepIdentity = z.object({
    name: z.string().min(2),
    ancestryId: z.string(),
    backgroundId: z.string().optional(),
    classes: z.array(ClassesEntry).min(1), // multiclasse compatível
    portraitUrl: z.string().url().optional(),
    pronoun: z.enum(["ele","ela","elu"]).optional(),
});

const StepAttributes = AttributesBlock; // já definimos antes

export const characterCreateRouter = router({
    createDraft: protectedProcedure
        .input(z.object({
            // permite iniciar com defaults; idempotente por user+state=DRAFT?
        }).optional())
        .mutation(async ({ ctx }) => {
            const ch = await ctx.prisma.character.create({
                data: {
                    userId: ctx.user.id,
                    state: "DRAFT",
                    visibility: "PRIVATE",
                    name: "Eco sem Nome",
                    ancestryId: "elyriano",
                    classes: [{ classId: "guerreiro", level: 1 }],
                    level: 1,
                    xp: 0,
                    inspiration: false,
                    attributes: {
                        base: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
                        bonuses: [],
                        temp: [],
                    },
                    proficiencyBonus: 2,
                    hp: { max: 10, current: 10, temp: 0, hit_dice: "1d10", death_saves: { s:0, f:0 } },
                    combat: { ac: 10, initiative_bonus: 0, speeds: { walk: 9 }, resistances: [], immunities: [], vulnerabilities: [] },
                    senses: { passive: { perception: 10, insight: 10, investigation: 10 } },
                    currency: { cp:0, sp:0, gp:0, pp:0 },
                    inventory: [],
                    attunement: { limit: 3, attunedItemIds: [] },
                    features: [],
                    faith: { current: 0, max: 10 },
                    ether: { current: 0, max: 10 },
                    corruption: { current: 0, max: 10, marks: [] },
                }
            });
            return { id: ch.id };
        }),

    saveIdentity: protectedProcedure
        .input(z.object({ id: z.string().uuid(), data: StepIdentity }))
        .mutation(async ({ ctx, input }) => {
            // calcular nível total para cache
            const totalLevel = input.data.classes.reduce((s, c) => s + c.level, 0);
            await ctx.prisma.character.update({
                where: { id: input.id, userId: ctx.user.id },
                data: {
                    name: input.data.name,
                    ancestryId: input.data.ancestryId,
                    backgroundId: input.data.backgroundId,
                    portraitUrl: input.data.portraitUrl,
                    pronoun: input.data.pronoun,
                    classes: input.data.classes,
                    level: totalLevel,
                }
            });
            return { ok: true };
        }),

    saveAttributes: protectedProcedure
        .input(z.object({ id: z.string().uuid(), attributes: StepAttributes }))
        .mutation(async ({ ctx, input }) => {
            const attrs = input.attributes as AttributesBlockT;
            await ctx.prisma.character.update({
                where: { id: input.id, userId: ctx.user.id },
                data: { attributes: attrs }
            });
            const snapshot = await recomputeSnapshot(ctx.prisma, input.id);
            return { ok: true, snapshot };
        }),

    finalize: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            // garante snapshot fresco
            await recomputeSnapshot(ctx.prisma, input.id);
            await ctx.prisma.character.update({
                where: { id: input.id, userId: ctx.user.id },
                data: { state: "COMPLETE", visibility: "PRIVATE" },
            });
            return { ok: true };
        }),
});

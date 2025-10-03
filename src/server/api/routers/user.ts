// src/server/api/routers/user.ts
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { requireAuth, requireEffectiveRole } from "../middlewares/requireRole";
import { effectiveRole } from "../guards/roles";

export const userRouter = router({
    me: publicProcedure.query(({ ctx }) => {
        const user = ctx.dbUser;
        return {
            user,
            effectiveRole: effectiveRole(user),
        };
    }),

    setAccountRole: publicProcedure
        .use(requireAuth)
        .input(z.object({ role: z.enum(["SPECTATOR","PLAYER","GM"]) }))
        .mutation(async ({ ctx, input }) => {
            // regra simples: qualquer um pode escolher PLAYER; GM futuramente via monetização/moderação
            if (input.role === "GM" && (ctx.dbUser?.mana ?? 0) < 1) {
                // exemplo de “gate” simples p/ GM (ajuste depois)
                throw new Error("Requisito para GM não atendido.");
            }
            const updated = await ctx.prisma.user.update({
                where: { id: ctx.dbUser!.id },
                data: { accountRole: input.role },
                select: { id: true, accountRole: true }
            });
            return updated;
        }),

    // gastar mana (ex.: inscrever em campanha, abrir slot, criar sessão…)
    spendMana: publicProcedure
        .use(requireAuth)
        .input(z.object({ amount: z.number().int().positive(), reason: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const u = await ctx.prisma.user.findUnique({ where: { id: ctx.dbUser!.id }, select: { mana: true } });
            if (!u) throw new Error("User not found");
            if (u.mana < input.amount) throw new Error("Mana insuficiente");
            const updated = await ctx.prisma.user.update({
                where: { id: ctx.dbUser!.id },
                data: { mana: { decrement: input.amount } },
                select: { id: true, mana: true }
            });
            return updated;
        }),

    // conceder mana (admin/futuro billing/webhook)
    grantMana: publicProcedure
        .use(requireAuth)
        .input(z.object({ amount: z.number().int().positive(), reason: z.string() }))
        .mutation(({ ctx, input }) =>
            ctx.prisma.user.update({
                where: { id: ctx.dbUser!.id },
                data: { mana: { increment: input.amount } },
                select: { id: true, mana: true }
            })
        ),

    // abrir slot extra (ex.: custo 3 de mana — ajuste a regra depois)
    buyPlayerSlot: publicProcedure
        .use(requireAuth)
        .mutation(async ({ ctx }) => {
            const cost = 3;
            const u = await ctx.prisma.user.findUnique({ where: { id: ctx.dbUser!.id }, select: { mana: true, playerSlots: true } });
            if (!u || u.mana < cost) throw new Error("Mana insuficiente");
            const updated = await ctx.prisma.user.update({
                where: { id: ctx.dbUser!.id },
                data: { mana: { decrement: cost }, playerSlots: { increment: 1 } },
                select: { id: true, mana: true, playerSlots: true }
            });
            return updated;
        }),
});

import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const itemsListRouter = router({
    byId: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(({ ctx, input }) =>
            ctx.prisma.item.findUnique({
                where: { id: input.id },
                include: { Weapon: true, Armor: true, Consumable: true },
            })
        ),

    search: publicProcedure
        .input(z.object({
            q: z.string().optional(),
            rarity: z.array(z.string()).optional(),
            tier: z.array(z.string()).optional(),
            take: z.number().int().min(1).max(100).default(24),
            skip: z.number().int().min(0).default(0),
        }).optional())
        .query(({ ctx, input }) => {
            const q = input?.q?.trim();
            return ctx.prisma.item.findMany({
                where: {
                    AND: [
                        q ? { OR: [
                                { name: { contains: q, mode: "insensitive" } },
                                { description: { contains: q, mode: "insensitive" } },
                            ] } : {},
                        input?.rarity?.length ? { rarity: { in: input.rarity as any } } : {},
                        input?.tier?.length   ? { tier:   { in: input.tier   as any } } : {},
                    ],
                },
                include: { Weapon: true, Armor: true, Consumable: true },
                take: input?.take ?? 24,
                skip: input?.skip ?? 0,
                orderBy: { createdAt: "desc" },
            });
        }),
});

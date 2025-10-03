// src/server/api/routers/item.ts
import { z } from "zod";
import { router, publicProcedure } from "@/server/api/trpc";
import { RARITIES, TIERS } from "@/server/api/schemas/enums";

export const itemRouter = router({
    byId: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(({ ctx, input }) =>
            ctx.prisma.item.findUnique({
                where: { id: input.id },
                include: { Weapon: true, Armor: true, Consumable: true },
            })
        ),

    search: publicProcedure
        .input(
            z
                .object({
                    q: z.string().optional(),
                    rarity: z.array(z.enum(RARITIES)).optional(),
                    tier: z.array(z.enum(TIERS)).optional(),
                    take: z.number().int().min(1).max(100).default(24),
                    skip: z.number().int().min(0).default(0),
                })
                .optional()
        )
        .query(({ ctx, input }) => {
            const q = input?.q?.trim();
            return ctx.prisma.item.findMany({
                where: {
                    AND: [
                        q
                            ? {
                                OR: [
                                    { name: { contains: q, mode: "insensitive" } },
                                    { description: { contains: q, mode: "insensitive" } },
                                ],
                            }
                            : {},
                        input?.rarity?.length ? { rarity: { in: input.rarity } } : {},
                        input?.tier?.length ? { tier: { in: input.tier } } : {},
                    ],
                },
                include: { Weapon: true, Armor: true, Consumable: true },
                take: input?.take ?? 24,
                skip: input?.skip ?? 0,
                orderBy: { createdAt: "desc" },
            });
        }),
});

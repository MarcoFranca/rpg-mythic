import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/server/db/prisma";

export const itemRouter = createTRPCRouter({
    list: publicProcedure
        .input(z.object({
            q: z.string().optional(),
            type: z.enum(["all", "weapon", "armor", "consumable"]).default("all"),
            rarity: z.string().optional(),
            tier: z.string().optional(),
            take: z.number().min(1).max(100).default(20),
            skip: z.number().min(0).default(0),
        }).optional())
        .query(async ({ input }) => {
            const where: any = {};
            if (input?.q) where.name = { contains: input.q, mode: "insensitive" };
            if (input?.rarity) where.rarity = input.rarity as any;
            if (input?.tier) where.tier = input.tier as any;
            if (input?.type && input.type !== "all") {
                if (input.type === "weapon") where.Weapon = { isNot: null };
                if (input.type === "armor") where.Armor = { isNot: null };
                if (input.type === "consumable") where.Consumable = { isNot: null };
            }

            const [items, total] = await Promise.all([
                prisma.item.findMany({
                    where, skip: input?.skip ?? 0, take: input?.take ?? 20,
                    orderBy: { createdAt: "desc" },
                    include: { Weapon: true, Armor: true, Consumable: true }
                }),
                prisma.item.count({ where })
            ]);

            return { items, total };
        }),
});

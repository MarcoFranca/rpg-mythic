// src/server/api/routers/item.ts
import { z } from "zod";
import type { Prisma, $Enums } from "@prisma/client"; // << aqui
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/server/db/prisma";

const RARITIES = ["common","uncommon","rare","very_rare","legendary","artifact","mythic"] as const;
const TIERS    = ["low","medium","high","legendary","artifact"] as const;
const TYPES    = ["all","weapon","armor","consumable"] as const;

const ListInputSchema = z.object({
    q: z.string().optional(),
    type: z.enum(TYPES).default("all"),
    rarity: z.enum(RARITIES).optional(),
    tier: z.enum(TIERS).optional(),
    take: z.number().min(1).max(100).default(20),
    skip: z.number().min(0).default(0),
}).optional();

export const itemRouter = createTRPCRouter({
    list: publicProcedure
        .input(ListInputSchema)
        .query(async ({ input }) => {
            const where: Prisma.ItemWhereInput = {};

            if (input?.q) where.name = { contains: input.q, mode: "insensitive" };
            if (input?.rarity) where.rarity = input.rarity as $Enums.Rarity; // << aqui
            if (input?.tier)   where.tier   = input.tier   as $Enums.Tier;   // << aqui

            switch (input?.type) {
                case "weapon":     where.Weapon     = { isNot: null }; break;
                case "armor":      where.Armor      = { isNot: null }; break;
                case "consumable": where.Consumable = { isNot: null }; break;
                default: break;
            }

            const [items, total] = await Promise.all([
                prisma.item.findMany({
                    where,
                    skip: input?.skip ?? 0,
                    take: input?.take ?? 20,
                    orderBy: { createdAt: "desc" },
                    include: { Weapon: true, Armor: true, Consumable: true },
                }),
                prisma.item.count({ where }),
            ]);

            return { items, total };
        }),
});

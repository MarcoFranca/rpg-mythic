// src/server/api/routers/name.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
    CURATED,
    generateNames,
    type NameSetKey,
} from "@/lib/identity/nameCatalog";

export const nameRouter = router({
    // alinhar com o front: api.name.check
    check: publicProcedure
        .input(z.object({ name: z.string().trim().min(2).max(40), scopeId: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            const exists = await ctx.prisma.character.findFirst({
                where: { name: { equals: input.name, mode: "insensitive" } },
                select: { id: true },
            });
            return { available: !exists };
        }),

    suggest: publicProcedure
        .input(
            z.object({
                set: z.enum(["elyra","artheon","liren","umbros","vaelorin"]).optional(),
                n: z.number().int().min(1).max(10).default(5),
            })
        )
        .query(async ({ ctx, input }) => {
            const set: NameSetKey = (input.set ?? "elyra") as NameSetKey;

            // 1) tenta preencher a lista com nomes curados, evitando duplicatas do BD
            const curated = [...CURATED[set]];
            const out: string[] = [];
            while (curated.length && out.length < input.n) {
                const i = Math.floor(Math.random() * curated.length);
                const pick = curated.splice(i, 1)[0]!;
                const exists = await ctx.prisma.character.findFirst({
                    where: { name: { equals: pick, mode: "insensitive" } },
                    select: { id: true },
                });
                if (!exists && !out.includes(pick)) out.push(pick);
            }

            if (out.length >= input.n) return out.slice(0, input.n);

            // 2) completa com procedurais em lote e filtra os que já existem
            const need = input.n - out.length;
            // gera um pouco a mais para compensar filtragem
            const candidates = generateNames(set, need * 3, { epithetChance: 0.12, allowSecond: true });

            // checa existentes numa chamada só
            const existing = await ctx.prisma.character.findMany({
                where: { name: { in: candidates } },
                select: { name: true },
            });
            const existingSet = new Set(existing.map(e => e.name.toLowerCase()));

            for (const n of candidates) {
                if (out.length >= input.n) break;
                if (!existingSet.has(n.toLowerCase()) && !out.includes(n)) out.push(n);
            }

            return out.slice(0, input.n);
        }),
});

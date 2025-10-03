// src/server/api/trpc.ts
import { initTRPC } from "@trpc/server";
import { prisma } from "./db/prisma";

export async function createTRPCContext(_opts: { req: Request }) {
    return { prisma };
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

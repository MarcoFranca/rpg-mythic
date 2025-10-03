// src/server/api/trpc.ts
import { initTRPC } from "@trpc/server";
import { prisma } from "./db/prisma";
import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";
import { AccountRole } from "@prisma/client";
import type { SupabaseUserMetadata } from "@/types/supabase";

type DbUser = {
    id: string;
    email: string;
    accountRole: AccountRole;
    sigils: number;
};

export async function createTRPCContext() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let dbUser: DbUser | null = null;

    if (user) {
        const meta = (user.user_metadata ?? {}) as SupabaseUserMetadata;
        dbUser = await prisma.user.upsert({
            where: { supabaseId: user.id },
            update: {
                email: user.email ?? undefined,
                displayName: meta.name ?? undefined,
                image: meta.avatar_url ?? undefined,
            },
            create: {
                supabaseId: user.id,
                email: user.email!,
                displayName: meta.name ?? null,
                image: meta.avatar_url ?? null,
                accountRole: AccountRole.SPECTATOR,
                sigils: 10,
                playerSlots: 2,
            },
            select: {
                id: true,
                email: true,
                accountRole: true,
                sigils: true,
                playerSlots: true,
            },
        });
    }

    return { prisma, supabaseUser: user, dbUser };
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

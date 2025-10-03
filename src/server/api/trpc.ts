import { initTRPC } from "@trpc/server";
import { prisma } from "./db/prisma";
import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";
import { AccountRole } from "@prisma/client";

type DbUser = {
    id: string;
    email: string;
    accountRole: AccountRole;
    sigils: number;
    playerSlots: number;
};

export async function createTRPCContext() {
    const supabase = await createSupabaseServerClient(); // <- agora com await
    const { data: { user } } = await supabase.auth.getUser();

    let dbUser: DbUser | null = null;

    if (user) {
        dbUser = await prisma.user.upsert({
            where: { supabaseId: user.id },
            update: {
                email: user.email ?? undefined,
                displayName: (user.user_metadata as any)?.name ?? undefined,
                image: (user.user_metadata as any)?.avatar_url ?? undefined,
            },
            create: {
                supabaseId: user.id,
                email: user.email!,
                displayName: (user.user_metadata as any)?.name ?? null,
                image: (user.user_metadata as any)?.avatar_url ?? null,
                accountRole: AccountRole.SPECTATOR,
                sigils: 10,
                playerSlots: 2,
            },
            select: { id: true, email: true, accountRole: true, sigils: true, playerSlots: true },
        });
    }

    return { prisma, supabaseUser: user, dbUser };
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

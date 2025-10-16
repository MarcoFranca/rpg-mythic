// src/server/api/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "./db/prisma";
import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";
import { AccountRole } from "@prisma/client";
import type { SupabaseUserMetadata } from "@/types/supabase";

type DbUser = {
    id: string;
    email: string | null;
    accountRole: AccountRole;
    sigils: number;
    playerSlots: number;
};

type CtxArg = { req?: Request };  // ⬅️ aceita req (opcional)


export async function createTRPCContext() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

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

    return {
        prisma,            // ✅ use isto nos routers
        supabaseUser: user,
        dbUser,            // ✅ pode ser null se público
    };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;


// init
export const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
});


export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware; // <- export explícito

// 🔐 middleware de auth
const requireAuth = t.middleware(({ ctx, next }) => {
    if (!ctx.dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next({ ctx: { ...ctx, user: ctx.dbUser } });
});
export const protectedProcedure = t.procedure.use(requireAuth);

// (opcional) export types úteis
export type AuthedContext = TRPCContext & { user: NonNullable<TRPCContext["dbUser"]> };

export const config = {
    matcher: ["/((?!api/trpc|api/auth|_next/static|_next/image|favicon.ico).*)"],
};

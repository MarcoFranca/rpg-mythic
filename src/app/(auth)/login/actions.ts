"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerAction } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const SYSTEM_HOME = "/app"; // ajuste se seu hub for outro

export type ActionState =
    | { ok: true }
    | { ok: false; message?: string; error?: Record<string, string[]> };

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

async function ensureDbUser(supabaseId: string, email: string, displayName?: string | null) {
    await prisma.user.upsert({
        where: { supabaseId },
        update: { email, displayName: displayName ?? undefined },
        create: { supabaseId, email, displayName: displayName ?? null, accountRole: "SPECTATOR" },
    });
}

export async function signInWithPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = loginSchema.safeParse({
        email: String(formData.get("email") ?? "").trim().toLowerCase(),
        password: String(formData.get("password") ?? ""),
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServerAction();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
        // mensagem amigável (sem vazar detalhes de segurança)
        return { ok: false, message: "E-mail ou senha inválidos." };
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (user) await ensureDbUser(user.id, user.email ?? "", user.user_metadata?.name ?? null);

    // sucesso → “flash toast” no sistema
    redirect(`${SYSTEM_HOME}?welcome=1`);
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export async function startOAuthGoogle(): Promise<{ ok: true; url?: string } | { ok: false; message: string }> {
    const supabase = await createSupabaseServerAction();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${SITE_URL}/login` },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, url: data.url };
}

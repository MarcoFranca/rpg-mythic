"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerAction } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import type { ActionState } from "./types";

const prisma = new PrismaClient();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const registerQuickSchema = loginSchema;
const registerFullSchema = loginSchema.extend({
    displayName: z.string().min(2).max(60),
    acceptTerms: z.boolean().refine(v => v, "É necessário aceitar os termos."),
});

async function ensureDbUser(supabaseId: string, email: string, displayName?: string | null) {
    await prisma.user.upsert({
        where: { supabaseId },
        update: { email, displayName: displayName ?? undefined },
        create: { supabaseId, email, displayName: displayName ?? null, accountRole: "SPECTATOR" },
    });
}

export async function signInWithPassword(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServerAction();
    const { error } = await supabase.auth.signInWithPassword(parsed.data); // <- sem "data" não usado
    if (error) return { ok: false, message: error.message };

    const user = (await supabase.auth.getUser()).data.user;
    if (user) await ensureDbUser(user.id, user.email ?? "", user.user_metadata?.name ?? null);

    redirect("/");
}

export async function signUpQuick(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = registerQuickSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServerAction();
    const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/login` },
    });
    if (error) return { ok: false, message: error.message };

    const user = (await supabase.auth.getUser()).data.user;
    if (user) await ensureDbUser(user.id, user.email ?? "", user.user_metadata?.name ?? null);

    redirect("/");
}

export async function signUpFull(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = registerFullSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        displayName: formData.get("displayName"),
        acceptTerms: formData.get("acceptTerms") === "on",
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServerAction();
    const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: { name: parsed.data.displayName },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/login`,
        },
    });
    if (error) return { ok: false, message: error.message };

    const user = (await supabase.auth.getUser()).data.user;
    if (user) await ensureDbUser(user.id, user.email ?? "", parsed.data.displayName);

    redirect("/");
}

export async function signInWithOAuth(provider: "google"): Promise<{ ok: true; url?: string } | { ok: false; message: string }> {
    const supabase = await createSupabaseServerAction();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/login` },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, url: data.url };
}

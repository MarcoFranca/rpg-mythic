"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
const registerQuickSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
const registerFullSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
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

export async function signInWithPassword(prevState: any, formData: FormData) {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { ok: false, message: error.message };

    const user = (await supabase.auth.getUser()).data.user;
    if (user) await ensureDbUser(user.id, user.email ?? "", user.user_metadata?.name ?? null);

    redirect("/"); // ou /dashboard
}

export async function signUpQuick(prevState: any, formData: FormData) {
    const parsed = registerQuickSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServer();                 // 👈 AQUI
    const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/login` },
    });
    if (error) return { ok: false, message: error.message };

    const user = (await supabase.auth.getUser()).data.user;
    if (user) await ensureDbUser(user.id, user.email ?? "", user.user_metadata?.name ?? null);

    redirect("/"); // pode exigir confirmação de e-mail dependendo das settings
}

export async function signUpFull(prevState: any, formData: FormData) {
    const parsed = registerFullSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        displayName: formData.get("displayName"),
        acceptTerms: formData.get("acceptTerms") === "on",
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServer();                 // 👈 AQUI
    const { data, error } = await supabase.auth.signUp({
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

export async function signInWithOAuth(provider: "google") {
    const supabase = await createSupabaseServer();                 // 👈 AQUI
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/login` },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, url: data.url };
}

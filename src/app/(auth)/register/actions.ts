// app/(auth)/register/actions.ts
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerAction } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { AccountRole } from "@prisma/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const AVATARS_BUCKET = "avatars";

const roleSchema = z.enum(["SPECTATOR", "PLAYER", "GM"]);
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    displayName: z.string().min(2).max(60),
    role: roleSchema,
});

export type ActionState =
    | { ok: true }
    | { ok: false; message?: string; error?: Record<string, string[]> };

async function ensureDbUser(params: {
    supabaseId: string;
    email: string;
    displayName: string;
    role: AccountRole;
    imageUrl?: string | null;
}) {
    const { supabaseId, email, displayName, role, imageUrl } = params;
    await prisma.user.upsert({
        where: { supabaseId },
        update: { email, displayName, accountRole: role, image: imageUrl ?? undefined },
        create: {
            supabaseId,
            email,
            displayName,
            accountRole: role,
            image: imageUrl ?? null,
        },
    });
}

async function uploadAvatarIfAny(
    supabase: Awaited<ReturnType<typeof createSupabaseServerAction>>,
    file?: File | null
) {
    if (!file) return null;
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return null;

    const ext = (file.name?.split(".").pop() || "png").toLowerCase();
    const path = `${user.id}.${ext}`;

    const { data, error } = await supabase.storage
        .from(AVATARS_BUCKET)
        .upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type || "image/png" });

    if (error) return null;
    const { data: pub } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(data.path);
    return pub?.publicUrl ?? null;
}

// EMAIL + SENHA (já existia; deixei intacto e tipado)
export async function registerWithRole(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = registerSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        displayName: formData.get("displayName"),
        role: formData.get("role"),
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServerAction();
    const avatar = formData.get("avatar") as File | null | undefined;
    const role = parsed.data.role as AccountRole;

    const { data: signUpData, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: { name: parsed.data.displayName, role },
            emailRedirectTo: `${SITE_URL}/login`,
        },
    });
    if (error) return { ok: false, message: error.message };

    // se já logou imediatamente (ex.: email desativado de confirmação), garante avatar + user
    const user = (await supabase.auth.getUser()).data.user ?? signUpData.user ?? null;
    let imageUrl: string | null = null;
    if (user && avatar) {
        imageUrl = await uploadAvatarIfAny(supabase, avatar);
    }

    if (user) {
        await ensureDbUser({
            supabaseId: user.id,
            email: parsed.data.email,
            displayName: parsed.data.displayName,
            role,
            imageUrl,
        });
    }

    redirect("/login");
}

// NOVO: OAuth Google já com papel selecionado
export async function startOAuthGoogleWithRole(role: "SPECTATOR" | "PLAYER" | "GM") {
    // Valida papel
    const parsedRole = roleSchema.safeParse(role);
    if (!parsedRole.success) return { ok: false as const, message: "Papel inválido." };

    const supabase = await createSupabaseServerAction();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            // vamos retornar ao /login (middleware + ensureDbUser lá garantem persistir o usuário)
            // mas passamos o papel via 'query' para manter o contexto do primeiro acesso
            // e também via 'metadata' do provedor
            redirectTo: `${SITE_URL}/login?from=register&role=${parsedRole.data}`,
            // alguns provedores ignoram metadata; mas o Supabase guarda user_metadata em muitos fluxos
            queryParams: {
                // opcional: às vezes útil para consent screen
                prompt: "consent",
            },
        },
    });

    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const, url: data.url };
}

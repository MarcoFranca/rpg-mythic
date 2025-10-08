// app/(auth)/register/actions.ts
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { AccountRole } from "@prisma/client"; // 👈 TIPAGEM CERTA

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
    role: AccountRole;             // 👈 sem any
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
            accountRole: role,         // 👈 sem any
            image: imageUrl ?? null,
        },
    });
}

async function uploadAvatarIfAny(
    supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
    file?: File | null
) {
    if (!file) return null;
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return null;

    const ext = (file.name?.split(".").pop() || "png").toLowerCase();
    const path = `${user.id}.${ext}`;

    const { data, error } = await supabase.storage.from(AVATARS_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "image/png",
    });
    if (error) return null;

    const { data: pub } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(data.path);
    return pub?.publicUrl ?? null;
}

export async function registerWithRole(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = registerSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        displayName: formData.get("displayName"),
        role: formData.get("role"),
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServer();
    const avatar = formData.get("avatar") as File | null | undefined;
    const role = parsed.data.role as AccountRole; // 👈 cast seguro (validação do Zod)

    const { data: signUpData, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: { name: parsed.data.displayName, role },
            emailRedirectTo: `${SITE_URL}/login`,
        },
    });
    if (error) return { ok: false, message: error.message };

    const user = (await supabase.auth.getUser()).data.user ?? signUpData.user ?? null;

    let imageUrl: string | null = null;
    try {
        imageUrl = await uploadAvatarIfAny(supabase, avatar);
    } catch {
        /* ok seguir sem avatar */
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

"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { AccountRole } from "@prisma/client";
import { createSupabaseServerAction } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const AVATARS_BUCKET = "avatars";
const SYSTEM_HOME = "/app"; // troque se seu "hub" for outro

const roleSchema = z.enum(["SPECTATOR", "PLAYER", "GM"]);

const displayNameSchema = z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .max(32, "Máximo de 32 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ0-9 _.'-]+$/, "Use letras, números, espaço e _ . ' -");

const registerSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, "Senha deve ter ao menos 8 caracteres")
        .regex(/[A-Z]/, "Inclua ao menos 1 letra maiúscula")
        .regex(/[0-9]/, "Inclua ao menos 1 número"),
    displayName: displayNameSchema,
    role: roleSchema,
});

export type ActionState =
    | { ok: true }
    | { ok: false; message?: string; error?: Record<string, string[]> };

function normEmail(email: string) {
    return email.trim().toLowerCase();
}
function normName(name: string) {
    return name.trim();
}

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
        create: { supabaseId, email, displayName, accountRole: role, image: imageUrl ?? null },
    });
}

type Supa = Awaited<ReturnType<typeof createSupabaseServerAction>>;

async function uploadAvatarIfAny(supabase: Supa, file?: File | null) {
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

// EMAIL + SENHA — cria, loga e entra no sistema (com validações extras)
export async function registerWithRole(_prev: ActionState, formData: FormData): Promise<ActionState> {
    // normaliza antes de validar/comparar
    const raw = {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        displayName: String(formData.get("displayName") ?? ""),
        role: String(formData.get("role") ?? ""),
    };

    const parsed = registerSchema.safeParse({
        email: normEmail(raw.email),
        password: raw.password,
        displayName: normName(raw.displayName),
        role: raw.role,
    });
    if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };

    const supabase = await createSupabaseServerAction();
    const avatar = formData.get("avatar") as File | null | undefined;
    const role = parsed.data.role as AccountRole;
    const email = parsed.data.email;
    const displayName = parsed.data.displayName;

    // 🔒 checagens de disponibilidade (servidor)
    const [emailExists, nameExists] = await Promise.all([
        prisma.user.findFirst({ where: { email }, select: { id: true } }),
        prisma.user.findFirst({ where: { displayName }, select: { id: true } }),
    ]);
    if (emailExists || nameExists) {
        return {
            ok: false,
            error: {
                ...(emailExists ? { email: ["Este e-mail já está em uso."] } : {}),
                ...(nameExists ? { displayName: ["Este nome já está em uso. Escolha outro."] } : {}),
            },
        };
    }

    // 1) signUp
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password: parsed.data.password,
        options: {
            data: { name: displayName, role },
            // emailRedirectTo: `${SITE_URL}/login`,
        },
    });
    if (signUpErr) {
        // supabase também valida unicidade de email — repassa erro amigável
        return { ok: false, message: signUpErr.message.includes("already registered") ? "Este e-mail já está em uso." : signUpErr.message };
    }

    // 2) login automático (se seu projeto não exige confirmação)
    let user = (await supabase.auth.getUser()).data.user ?? signUpData.user ?? null;
    if (!user) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: parsed.data.password });
        if (signInErr) {
            // confirmação de email provavelmente ativa
            redirect(`/login?needsConfirm=1&email=${encodeURIComponent(email)}`);
        }
        user = (await supabase.auth.getUser()).data.user;
    }

    // 3) avatar (opcional)
    let imageUrl: string | null = null;
    if (user && avatar) imageUrl = await uploadAvatarIfAny(supabase, avatar);

    // 4) garantir user no banco
    if (user) {
        await ensureDbUser({ supabaseId: user.id, email, displayName, role, imageUrl });
    }

    // 5) entrar no sistema com “flash toast”
    redirect(`${SYSTEM_HOME}?welcome=1&name=${encodeURIComponent(displayName)}`);
}

// OAUTH GOOGLE — deixa o Supabase cuidar; papel aplicado no /login e redireciona pro sistema
export async function startOAuthGoogleWithRole(role: "SPECTATOR" | "PLAYER" | "GM") {
    const parsedRole = roleSchema.safeParse(role);
    if (!parsedRole.success) return { ok: false as const, message: "Papel inválido." };

    const supabase = await createSupabaseServerAction();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${SITE_URL}/login?from=register&role=${parsedRole.data}`,
            queryParams: { prompt: "consent" },
        },
    });

    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const, url: data.url };
}

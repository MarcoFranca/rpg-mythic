"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createSupabaseServerAction } from "@/lib/supabase/server";
import { thresholdForTrack } from "@/lib/roles/sigils";
import { canChooseTrack, canPromoteFromSpectator, mustDemote, canReturnToTrack } from "@/lib/roles/guards";

type ActionResult = { ok: true; message?: string } | { ok: false; message: string };

const chooseTrackSchema = z.object({ track: z.enum(["PLAYER","GM"]) });

/** Ajusta sígilos (+/-) e aplica DEMOTE automático se necessário. */
export async function adjustSigils(delta: number): Promise<ActionResult> {
    const supabase = await createSupabaseServerAction();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Não autenticado." };

    return await prisma.$transaction(async (tx) => {
        const u = await tx.user.findUnique({ where: { supabaseId: user.id } });
        if (!u) return { ok: false, message: "Usuário não encontrado." };

        const next = Math.max(0, u.sigils + delta);

        let demoted = false;
        let toRole = u.accountRole;

        if (mustDemote(u.accountRole, u.track, next)) {
            demoted = true;
            toRole = "SPECTATOR";
        }

        await tx.user.update({
            where: { id: u.id },
            data: {
                sigils: next,
                accountRole: toRole,
            },
        });

        await tx.roleEvent.create({
            data: {
                userId: u.id,
                type: "SIGILS_ADJUST",
                deltaSigils: delta,
                from: u.accountRole,
                to: toRole === u.accountRole ? null : toRole,
                track: u.track ?? null,
                reason: demoted ? "Demotado por falta de sígilos." : undefined,
            },
        });

        return { ok: true, message: demoted ? "Sígilos ajustados e você foi temporariamente rebaixado a Observador." : "Sígilos ajustados." };
    });
}

/** Observador escolhe trilha (uma única vez). */
export async function chooseTrackAndPromote(formData: FormData): Promise<ActionResult> {
    const supabase = await createSupabaseServerAction();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Não autenticado." };

    const parsed = chooseTrackSchema.safeParse({ track: formData.get("track") });
    if (!parsed.success) return { ok: false, message: "Trilha inválida." };
    const track = parsed.data.track;

    return prisma.$transaction(async (tx) => {
        const u = await tx.user.findUnique({ where: { supabaseId: user.id } });
        if (!u) return { ok: false, message: "Usuário não encontrado." };

        if (!canChooseTrack(u.track)) {
            return { ok: false, message: "Sua trilha já foi definida. Ela não pode ser alterada." };
        }

        const need = thresholdForTrack(track);
        if (!canPromoteFromSpectator(track, u.sigils)) {
            return { ok: false, message: `Você precisa de pelo menos ${need} Sígilos para tornar-se ${track === "PLAYER" ? "Jogador" : "Mestre"}.` };
        }

        const toRole = track === "PLAYER" ? "PLAYER" : "GM";

        await tx.user.update({
            where: { id: u.id },
            data: { track, accountRole: toRole },
        });

        await tx.roleEvent.create({
            data: { userId: u.id, type: "TRACK_SET", track, from: "SPECTATOR", to: toRole, reason: "Escolha inicial de trilha e promoção." },
        });

        return { ok: true, message: `O Cântico lhe reconhece como ${toRole === "PLAYER" ? "Jogador" : "Mestre"}.` };
    });
}

/** Retornar da condição de Observador para a trilha original (quando já definida). */
export async function returnToTrack(): Promise<ActionResult> {
    const supabase = await createSupabaseServerAction();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Não autenticado." };

    return prisma.$transaction(async (tx) => {
        const u = await tx.user.findUnique({ where: { supabaseId: user.id } });
        if (!u) return { ok: false, message: "Usuário não encontrado." };

        if (!u.track) return { ok: false, message: "Você ainda não possui trilha definida." };
        if (!canReturnToTrack(u.accountRole, u.track, u.sigils)) {
            const need = thresholdForTrack(u.track);
            return { ok: false, message: `Você precisa de pelo menos ${need} Sígilos para retornar à sua trilha.` };
        }

        const toRole = u.track === "PLAYER" ? "PLAYER" : "GM";

        await tx.user.update({
            where: { id: u.id },
            data: { accountRole: toRole },
        });

        await tx.roleEvent.create({
            data: { userId: u.id, type: "PROMOTE", from: "SPECTATOR", to: toRole, track: u.track, reason: "Retorno à trilha após recuperar Sígilos." },
        });

        return { ok: true, message: "Você retorna ao seu lugar no Cântico." };
    });
}

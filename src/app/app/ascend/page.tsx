import { prisma } from "@/lib/prisma";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import AscendClient from "@/components/system/AscendClient";
import { thresholdForTrack } from "@/lib/roles/sigils";

export default async function AscendPage() {
    const supabase = await createSupabaseServerRSC();
    const { data: { user: sUser } } = await supabase.auth.getUser();
    if (!sUser) return null;

    const u = await prisma.user.findUnique({
        where: { supabaseId: sUser.id },
        select: { id: true, displayName: true, accountRole: true, track: true, sigils: true }
    });
    if (!u) return null;

    const canPickPlayer = u.accountRole === "SPECTATOR" && u.track === null && u.sigils >= 5;
    const canPickGM     = u.accountRole === "SPECTATOR" && u.track === null && u.sigils >= 8;
    const canReturn     = u.accountRole === "SPECTATOR" && !!u.track &&
        u.sigils >= thresholdForTrack(u.track);

    return (
        <AscendClient
            user={{
                id: u.id,
                name: u.displayName ?? "Viajante",
                role: u.accountRole,        // "SPECTATOR" | "PLAYER" | "GM"
                track: u.track,             // "PLAYER" | "GM" | null
                sigils: u.sigils,
            }}
            canPick={{ player: canPickPlayer, gm: canPickGM }}
            canReturn={canReturn}
            thresholds={{ player: 5, gm: 8 }}
        />
    );
}

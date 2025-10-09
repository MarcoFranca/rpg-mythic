// RSC
import { prisma } from "@/lib/prisma";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import SystemHome from "@/components/system/SystemHome";

export default async function AppHomePage() {
    const supabase = await createSupabaseServerRSC();
    const { data: { user: sUser } } = await supabase.auth.getUser();
    if (!sUser) {
        // se tiver middleware redirecionando, isso quase não ocorre
        return null;
    }

    const u = await prisma.user.findUnique({
        where: { supabaseId: sUser.id },
        select: {
            id: true, displayName: true, image: true, email: true,
            accountRole: true, track: true, sigils: true,
            memberships: { select: { id: true } },
            tablesCreated: { select: { id: true } },
        }
    });

    if (!u) return null;

    return (
        <SystemHome
            user={{
                id: u.id,
                name: u.displayName ?? "Viajante",
                image: u.image ?? null,
                email: u.email,
                role: u.accountRole,        // "PLAYER" | "GM" | "SPECTATOR"
                track: u.track,             // "PLAYER" | "GM" | null
                sigils: u.sigils,
                counts: {
                    myTables: u.tablesCreated.length,
                    myMemberships: u.memberships.length,
                    // pode somar mais contagens depois (personagens, monstros, etc.)
                }
            }}
        />
    );
}

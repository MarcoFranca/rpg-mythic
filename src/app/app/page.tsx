// /src/app/app/page.tsx
import { prisma } from "@/lib/prisma";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import SystemHome from "@/components/system/SystemHome";

type CampaignStatus = "ativa" | "pausada" | "convidado";
type CampaignLite = { id: string; name: string; status: CampaignStatus; href: string };

export default async function AppHomePage() {
    const supabase = await createSupabaseServerRSC();
    const { data: { user: sUser } } = await supabase.auth.getUser();
    if (!sUser) return null;

    const u = await prisma.user.findUnique({
        where: { supabaseId: sUser.id },
        select: {
            id: true,
            displayName: true,
            image: true,
            email: true,
            accountRole: true,
            track: true,
            sigils: true,
        },
    });
    if (!u) return null;

    const memberships = await prisma.membership.findMany({
        where: { userId: u.id },
        select: {
            id: true,
            table: {
                select: {
                    id: true,
                    title: true,
                    visibility: true,
                },
            },
        },
    });

    const campaigns: CampaignLite[] = memberships.map((m) => ({
        id: m.table.id,
        name: m.table.title,
        status: m.table.visibility === "private" ? "pausada" : "ativa",
        href: `/app/table/${m.table.id}`,
    }));

    // se o schema tiver outro nome pra FK, troque aqui
    let myTables = 0;
    try {
        myTables = await prisma.gameTable.count({
            where: { createdById: u.id } as unknown as { createdById: string },
        });
    } catch {
        myTables = 0;
    }

    const myMemberships = memberships.length;

    return (
        <SystemHome
            user={{
                id: u.id,
                name: u.displayName ?? "Viajante",
                image: u.image ?? null,
                email: u.email,
                role: u.accountRole,
                track: u.track,
                sigils: u.sigils,
                counts: { myTables, myMemberships },
                campaigns,
            }}
        />
    );
}

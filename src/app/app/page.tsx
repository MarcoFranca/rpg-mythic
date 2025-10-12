// src/app/app/page.tsx  (RSC)
import { prisma } from "@/lib/prisma";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import SystemHome from "@/components/system/SystemHome";

type CampaignStatus = "ativa" | "pausada" | "convidado";

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

    // primeiro personagem (se existir)
    const firstChar = await prisma.character.findFirst({
        where: { userId: u.id },
        select: { id: true },
        orderBy: { createdAt: "asc" },
    });

    // campanhas via membership
    const memberships = await prisma.membership.findMany({
        where: { userId: u.id },
        select: { id: true, table: { select: { id: true, title: true, visibility: true } } },
    });

    const campaigns = memberships.map((m) => ({
        id: m.table.id,
        name: m.table.title,
        status: (m.table.visibility === "private" ? "pausada" : "ativa") as CampaignStatus,
        href: `/app/table/${m.table.id}`,
    }));

    // tem personagem?
    let hasCharacter = false;
    try {
        const count = await (prisma as unknown as {
            character: { count: (args: { where: { userId: string } }) => Promise<number> }
        }).character.count({ where: { userId: u.id } });
        hasCharacter = count > 0;
    } catch {
        try {
            const countAlt = await (prisma as unknown as {
                characterSheet: { count: (args: { where: { userId: string } }) => Promise<number> }
            }).characterSheet.count({ where: { userId: u.id } });
            hasCharacter = countAlt > 0;
        } catch {
            hasCharacter = false;
        }
    }

    // mesas criadas (opcional)
    let myTables = 0;
    try {
        myTables = await prisma.gameTable.count({ where: { createdById: u.id } as any });
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
            primaryCharacterId={firstChar?.id ?? null}
            hasCharacter={hasCharacter}
        />
    );
}

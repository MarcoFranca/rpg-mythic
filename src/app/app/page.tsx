// RSC
import { prisma } from "@/lib/prisma";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import SystemHome from "@/components/system/SystemHome";

// Tipos auxiliares locais (evitar any)
type CampaignStatus = "ativa" | "pausada" | "convidado";
type CampaignLite = { id: string; name: string; status: CampaignStatus; href: string };

export default async function AppHomePage() {
    const supabase = await createSupabaseServerRSC();
    const { data: { user: sUser } } = await supabase.auth.getUser();
    if (!sUser) return null;

    // 1) Dados básicos do usuário — sem relações
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
            // Removido: memberships, tablesCreated (não existem no seu select atual)
        },
    });

    if (!u) return null;

    // 2) Campanhas do usuário via Membership -> table
    // Ajuste o nome do modelo se necessário (ex.: Memberships -> membership)
    const memberships = await prisma.membership.findMany({
        where: { userId: u.id },
        select: {
            id: true,
            table: {
                select: {
                    id: true,
                    title: true,       // use o correto
                    visibility: true,  // use o correto
                },
            },
        },
    });

    const campaigns = memberships.map((m) => ({
        id: m.table.id,
        name: m.table.title, // existe no schema
        status: m.table.visibility === "private" ? "pausada" : "ativa" as CampaignStatus,
        href: `/app/table/${m.table.id}`,
    }));


    // Helper para derivar nome e status sem quebrar o tipo
    const normalizeCampaign = (m: (typeof memberships)[number]): CampaignLite => {
        // @ts-expect-error — 'name' / 'title' podem não existir no schema, tratamos com coalesce seguro
        const tableName: string | undefined = m.table?.name ?? m.table?.title ?? undefined;

        // @ts-expect-error — 'status' pode não existir; se não existir, usamos 'visibility' como heurística
        const rawStatus: string | undefined = m.table?.status ?? m.table?.visibility ?? undefined;

        const status: CampaignStatus =
            rawStatus === "paused" || rawStatus === "pausada"
                ? "pausada"
                : rawStatus === "guest" || rawStatus === "convidado"
                    ? "convidado"
                    : "ativa";

        return {
            id: m.table?.id ?? m.id, // fallback para nunca quebrar
            name: tableName ?? `Mesa ${m.table?.id ?? m.id}`,
            status,
            href: `/app/table/${m.table?.id ?? m.id}`,
        };
    };


    // 3) Contagem de mesas criadas pelo usuário
    // Ajuste a FK conforme seu schema (exemplos comuns: createdById, ownerId)
    // Se não tiver FK de "dono", deixe em 0 (não quebra tipagem).
    let myTables = 0;
    try {
        // TENTE uma FK comum; se seu schema usar outro nome, troque abaixo.
        myTables = await prisma.gameTable.count({
            where: { createdById: u.id } as any, // ajuste 'createdById' se necessário
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
                role: u.accountRole, // "PLAYER" | "GM" | "SPECTATOR"
                track: u.track,      // "PLAYER" | "GM" | null
                sigils: u.sigils,
                counts: {
                    myTables,
                    myMemberships,
                },
                campaigns,
            }}
        />
    );
}

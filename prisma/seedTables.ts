import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const t = await prisma.gameTable.create({       // <- gameTable
        data: {
            title: "A Sombra de Eldoria",
            description: "Campanha demo",
            visibility: "public",
            ruleset: { inspiration: true },
            memberships: { create: [{ userId: "demo-user", role: "GM" }] },
            sessions: { create: [{ title: "Prólogo", startsAt: new Date(Date.now() + 7 * 864e5) }] },
        },
    });
    console.log("OK table:", t.id);
}
main().finally(() => prisma.$disconnect());

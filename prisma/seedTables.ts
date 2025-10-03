// prisma/seedTables.ts
import { PrismaClient, MemberRole } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const t = await prisma.table.create({
        data: {
            title: "A Sombra de Eldoria",
            description: "Campanha demo",
            visibility: "public",
            ruleset: { inspiration: true },
            memberships: { create: [{ userId: "demo-user", role: MemberRole.GM }] },
            sessions: { create: [{ title: "Prólogo", startsAt: new Date(Date.now()+7*864e5) }] },
        },
    });
    console.log("OK table:", t.id);
}
main().finally(() => prisma.$disconnect());

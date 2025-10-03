// prisma/seedUsers.ts
/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const p = await prisma.user.upsert({
        where: { email: "player@example.com" },
        update: {},
        create: {
            supabaseId: "dev-player-id", email: "player@example.com",
            displayName: "Ragnar", accountRole: "PLAYER", sigils: 8, playerSlots: 2
        }
    });
    const g = await prisma.user.upsert({
        where: { email: "gm@example.com" },
        update: {},
        create: {
            supabaseId: "dev-gm-id", email: "gm@example.com",
            displayName: "Arcano GM", accountRole: "GM", sigils: 12, playerSlots: 2
        }
    });
    await prisma.monster.create({
        data: {
            name: "Espectro de Eldoria",
            description: "Sussurra nas ruínas frias.",
            visibility: "private",
            ownerUserId: g.id,
            meta: { AC: 14, HP: 45, resistances: ["necrotic","poison"] },
            allowedTables: [],
        }
    });
    console.log({ p: p.email, g: g.email });
}
main().finally(() => prisma.$disconnect());

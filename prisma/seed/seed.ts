// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs"; // 👈 aqui

const prisma = new PrismaClient();

async function main() {
    const load = (p: string) => JSON.parse(readFileSync(p, "utf-8")); // 👈 aqui

    const ancestries = load("prisma/seed/ancestries.json");
    const classes = load("prisma/seed/classes.json");
    const backgrounds = load("prisma/seed/backgrounds.json");

    await prisma.ancestry.createMany({ data: ancestries, skipDuplicates: true });
    // "class" pode causar ruído em alguns toolings: use bracket access para garantir:
    await prisma["class"].createMany({ data: classes, skipDuplicates: true });
    await prisma.background.createMany({ data: backgrounds, skipDuplicates: true });

    console.log("✅ Seeds aplicados.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


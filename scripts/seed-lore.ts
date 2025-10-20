// scripts/seed-lore.ts
import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

type LoreFile = {
    classId: string;
    locale: string;
    version?: number;
    title: string;
    tagline?: string;
    readingTimeMin?: number;     // alias pro campo readingMin na tabela
    summary: string;
    display?: unknown;
    chapters?: unknown;
    timeline?: unknown;
    rituals?: unknown;
    locations?: unknown;
    gameplay?: unknown;
    ui?: unknown;
    attribution?: unknown;
    publishedAt?: string | null; // ISO opcional
};

async function main() {
    const dir = path.resolve(process.cwd(), "prisma/seed/lore"); // ajuste se necessário
    const files = (await fs.readdir(dir)).filter(f => f.endsWith(".json"));

    for (const file of files) {
        const raw = await fs.readFile(path.join(dir, file), "utf-8");
        const data = JSON.parse(raw) as LoreFile;

        const version = data.version ?? 1;

        // Upsert por (classId, locale, version)
        const existing = await prisma.classLore.findUnique({
            where: { classId_locale_version: { classId: data.classId, locale: data.locale, version } },
        });

        const payload = {
            classId: data.classId,
            locale: data.locale,
            version,
            title: data.title,
            tagline: data.tagline ?? null,
            readingMin: data.readingTimeMin ?? null, // <- coluna na tabela é readingMin
            display: data.display ?? undefined,
            summary: data.summary,
            chapters: data.chapters ?? undefined,
            timeline: data.timeline ?? undefined,
            rituals: data.rituals ?? undefined,
            locations: data.locations ?? undefined,
            gameplay: data.gameplay ?? undefined,
            ui: data.ui ?? undefined,
            attribution: data.attribution ?? undefined,
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        };

        if (existing) {
            await prisma.classLore.update({
                where: { classId_locale_version: { classId: data.classId, locale: data.locale, version } },
                data: payload,
            });
            console.log("Updated lore:", file);
        } else {
            await prisma.classLore.create({ data: payload });
            console.log("Inserted lore:", file);
        }
    }
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });

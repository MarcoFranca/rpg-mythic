import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

type MJ = {
    aliases?: string[];
    pros?: string[];
    cons?: string[];
    featuresPreview?: string[];
    tags?: string[];
};

// helper local (faltava no seu arquivo)
async function byName(name: string) {
    return prisma.class.findFirstOrThrow({ where: { name } });
}

export async function seedSubclasses() {
    // RANGER
    const ranger = await byName("Caçador de Fendas");
    const rangerSubs: Array<{ slug?: string; name: string; description: string; metaJson: MJ }> = [
        { name: "Caçador", description: "Predador adaptativo que escolhe presas e táticas específicas.", metaJson: { aliases: ["Hunter"], pros: ["Versátil"], featuresPreview: ["Táticas do Caçador", "Defesas do Caçador"] } },
        { name: "Mestre das Bestas", description: "Liga-se a um companheiro do Éter Selvagem.", metaJson: { aliases: ["Beast Master"], pros: ["Companheiro animal"], cons: ["Gestão de ação"], featuresPreview: ["Companheiro de Caça"] } },
        { name: "Stalker Umbroso", description: "Caça nas fendas e penumbras.", metaJson: { aliases: ["Gloom Stalker"], pros: ["Explosão de 1º turno"], featuresPreview: ["Ambuscador Dread", "Passos nas Sombras"] } },
        { name: "Andarilho do Horizonte", description: "Vigia fronteiras planares e veios do Éter.", metaJson: { aliases: ["Horizon Walker"], tags: ["plano","éter"] } },
        { name: "Matador de Monstros", description: "Especialista em grandes horrores e entidades.", metaJson: { aliases: ["Monster Slayer"] } },
        { name: "Errante das Fadas", description: "Liga-se ao Reino Vivo (fé/luz).", metaJson: { aliases: ["Fey Wanderer"] } },
        { name: "Enxameante", description: "Comanda enxames etéreos.", metaJson: { aliases: ["Swarmkeeper"] } },
        { name: "Dracoguarda", description: "Liga-se a um draco do Éter.", metaJson: { aliases: ["Drakewarden"] } },
    ];

    for (const s of rangerSubs) {
        const slug = s.slug ?? `ranger-${(s.metaJson.aliases?.[0] ?? s.name).toLowerCase().replace(/\s+/g, "-")}`;
        await prisma.subclass.upsert({
            where: { slug },
            update: {
                name: s.name,
                description: s.description,
                metaJson: s.metaJson as Prisma.JsonObject,
                classId: ranger.id,
            },
            create: {
                slug,
                name: s.name,
                description: s.description,
                metaJson: s.metaJson as Prisma.JsonObject,
                classId: ranger.id,
            },
        });
    }

    // MAGO – Necromancia
    const wizard = await byName("Teurgo do Éter");
    await prisma.subclass.upsert({
        where: { slug: "wizard-necromancy" },
        update: {
            name: "Cifra Necrótica",
            description: "Geometrias do ciclo-morte do Éter (equiv. Necromancy).",
            metaJson: { aliases: ["Necromancy"], pros: ["Exércitos cadavéricos"], cons: ["Estigma/IDG"], featuresPreview: ["Tocar a Morte", "Comandar Mortos"] } as Prisma.JsonObject,
            classId: wizard.id,
        },
        create: {
            slug: "wizard-necromancy",
            name: "Cifra Necrótica",
            description: "Geometrias do ciclo-morte do Éter (equiv. Necromancy).",
            metaJson: { aliases: ["Necromancy"], pros: ["Exércitos cadavéricos"], cons: ["Estigma/IDG"], featuresPreview: ["Tocar a Morte", "Comandar Mortos"] } as Prisma.JsonObject,
            classId: wizard.id,
        },
    });

    // BRUXO – Fiend / Hexblade
    const warlock = await byName("Pactuário do Obscuro");
    const wl = [
        { slug: "warlock-fiend", name: "Pacto do Devastio", aliases: ["Fiend"] },
        { slug: "warlock-hexblade", name: "Pacto da Lâmina Obsidiana", aliases: ["Hexblade"] },
    ];
    for (const s of wl) {
        await prisma.subclass.upsert({
            where: { slug: s.slug },
            update: {
                name: s.name,
                description: "Patrono específico do Obscuro.",
                metaJson: { aliases: s.aliases } as Prisma.JsonObject,
                classId: warlock.id,
            },
            create: {
                slug: s.slug,
                name: s.name,
                description: "Patrono específico do Obscuro.",
                metaJson: { aliases: s.aliases } as Prisma.JsonObject,
                classId: warlock.id,
            },
        });
    }
}

if (require.main === module) {
    seedSubclasses()
        .then(() => console.log("✔ Subclasses semeadas/atualizadas."))
        .catch((e) => { console.error(e); process.exit(1); })
        .finally(() => prisma.$disconnect());
}

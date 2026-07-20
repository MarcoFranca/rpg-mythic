import { Prisma } from "@prisma/client";
import { router, publicProcedure } from "../../trpc";

type Trait = { name: string; description: string };

function recordOfStrings(value: Prisma.JsonValue): string[] {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    return Object.entries(value)
        .filter(([, amount]) => typeof amount === "number")
        .map(([attribute, amount]) => `+${amount} ${attribute.toUpperCase()}`);
}

function traitsFrom(value: Prisma.JsonValue): Trait[] {
    if (!Array.isArray(value)) return [];
    return value.flatMap((trait) => {
        if (!trait || typeof trait !== "object" || Array.isArray(trait)) return [];
        const name = "name" in trait && typeof trait.name === "string" ? trait.name : null;
        const description = "desc" in trait && typeof trait.desc === "string" ? trait.desc : null;
        return name && description ? [{ name, description }] : [];
    });
}

function stringsFrom(value: Prisma.JsonValue | null): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function backgroundBenefits(value: Prisma.JsonValue): string[] {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const benefits: string[] = [];
    if ("skills" in value && Array.isArray(value.skills)) {
        const skills = value.skills.filter((skill): skill is string => typeof skill === "string");
        if (skills.length) benefits.push(`Perícias: ${skills.join(", ")}`);
    }
    if ("languages" in value && typeof value.languages === "number") benefits.push(`${value.languages} idioma(s) extra`);
    return benefits;
}

export const characterOptionsRouter = router({
    listAncestries: publicProcedure.query(async ({ ctx }) => {
        const ancestries = await ctx.prisma.ancestry.findMany({ orderBy: { name: "asc" } });
        return ancestries.map((ancestry) => ({
            id: ancestry.id,
            name: ancestry.name,
            lore: ancestry.shortLore,
            size: ancestry.size,
            speed: ancestry.speed,
            bonuses: recordOfStrings(ancestry.bonuses),
            traits: traitsFrom(ancestry.traits),
            languages: ancestry.languages,
        }));
    }),

    listBackgrounds: publicProcedure.query(async ({ ctx }) => {
        const backgrounds = await ctx.prisma.background.findMany({ orderBy: { name: "asc" } });
        return backgrounds.map((background) => ({
            id: background.id,
            name: background.name,
            skills: backgroundBenefits(background.profs),
            equipment: stringsFrom(background.equipment),
        }));
    }),
});

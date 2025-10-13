export type ClassTheme = {
    id: string;                // id UUID vindo do banco
    slug: string;              // slug curto p/ fallback de asset
    title: string;             // exibir
    image: string;             // /classes/barbaro.jpg
    accentFrom: string;        // tailwind hex-like (sem #) -> usamos via style
    accentTo: string;
};

export const CLASS_ART: ReadonlyArray<ClassTheme> = [
    {
        id: "00000000-0000-0000-0000-000000000001",
        slug: "barbaro",
        title: "Bárbaro",
        image: "/classes/barbaro.jpg",
        accentFrom: "0ea5e9",   // cyan-500
        accentTo: "22c55e",     // emerald-500
    },
    {
        id: "00000000-0000-0000-0000-000000000002",
        slug: "mago",
        title: "Mago",
        image: "/classes/mago.jpg",
        accentFrom: "a78bfa",   // violet-400
        accentTo: "f59e0b",     // amber-500
    },
    {
        id: "00000000-0000-0000-0000-000000000003",
        slug: "clerigo",
        title: "Clérigo",
        image: "/classes/clerigo.jpg",
        accentFrom: "f59e0b",
        accentTo: "84cc16",     // lime-500
    },
    // adicione as demais (ladino, paladino, bardo, druida, patrulheiro, monge, feiticeiro, bruxo, guerreiro…)
];

export type VoiceProfile = {
    originOrder?: string;
    virtue: string;
    temptation?: string;
    partyFunction: string;
    powerSource: string;
    oath?: string;
    rulesStatus?: string;
};

export type ClassTheme = {
    id?: string;
    slug: string;
    title: string;
    image: string;
    accentFrom: string;
    accentTo: string;
    canonicalNote: string;
    profile: VoiceProfile;
};

export const CLASS_ART: ReadonlyArray<ClassTheme> = [
    { slug: "arauto-elyra", title: "Arauto de Elyra", image: "/classes/arauto-elyra-v2.png", accentFrom: "d7b44a", accentTo: "237a61", canonicalNote: "Voz, vento, memória, esperança e Ressonância.", profile: { originOrder: "Ordem dos Arautos de Elyra", virtue: "Esperança", temptation: "Acreditar que sua voz deve conduzir todas as outras.", partyFunction: "Suporte, controle e restauração de memórias", powerSource: "Ressonância do Éter Vivo", oath: "Cantar onde o silêncio reina.", rulesStatus: "Alfa interna 1–20 — pendente de playtest humano, revisão editorial e balanceamento externo" } },
    { slug: "guardiao-artheon", title: "Guardião de Artheon", image: "/classes/guardiao-artheon-v2.png", accentFrom: "f59e0b", accentTo: "7c2d12", canonicalNote: "Fogo, proteção, disciplina, justiça e sacrifício.", profile: { originOrder: "Ordem dos Guardiões de Artheon", virtue: "Constância", temptation: "Possuir aquilo que jurou proteger.", partyFunction: "Interceptação, contenção e passagem segura", powerSource: "Fogo Consciente de Artheon", oath: "Permanecerei onde a ruptura buscar passagem; guardarei sem possuir e sustentarei sem tornar cativo aquilo que protejo.", rulesStatus: "Consolidação interna 1–20 — pendente de playtest humano, revisão editorial e balanceamento externo" } },
    { slug: "curandeiro-athenor", title: "Curandeiro de Athenor", image: "/classes/curandeiro-athenor.png", accentFrom: "2dd4bf", accentTo: "2563eb", canonicalNote: "Cura, compaixão, dor compartilhada e restauração.", profile: { virtue: "Compaixão", partyFunction: "Cura e restauração", powerSource: "Éter Vivo de Athenor", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "sentinela-vaelorin", title: "Sentinela de Vaelorin", image: "/classes/sentinela-vaelorin.png", accentFrom: "84a98c", accentTo: "64748b", canonicalNote: "Vigilância, equilíbrio, julgamento, Véu e proteção contra Fendas.", profile: { virtue: "Equilíbrio", partyFunction: "Vigilância e proteção contra Fendas", powerSource: "Véu de Vaelorin", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "sombrino-kaelthar", title: "Sombrino de Kael’Thar", image: "/classes/sombrino-kaelthar.png", accentFrom: "4c1d95", accentTo: "111827", canonicalNote: "Sombra, ocultação, silêncio, infiltração e confronto com a própria corrupção.", profile: { virtue: "Autodomínio", partyFunction: "Infiltração e ocultação", powerSource: "Silêncio de Kael’Thar", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "sanguineo-orodar", title: "Sanguíneo de Orodar", image: "/classes/sanguineo-orodar.png", accentFrom: "ef4444", accentTo: "450a0a", canonicalNote: "Vitalidade, sangue, juramentos, sacrifício e proteção.", profile: { virtue: "Sacrifício", partyFunction: "Proteção e vitalidade", powerSource: "Vitalidade de Orodar", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "vidente-lumenor", title: "Vidente de Lúmenor", image: "/classes/vidente-lumenor.png", accentFrom: "e2e8f0", accentTo: "4338ca", canonicalNote: "Visões, presságios, possibilidades futuras e percepção espiritual.", profile: { virtue: "Discernimento", partyFunction: "Visões e percepção espiritual", powerSource: "Presságios de Lúmenor", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "elementario-aeryn", title: "Elementário de Aeryn", image: "/classes/elementario-aeryn.png", accentFrom: "a3a04f", accentTo: "0f766e", canonicalNote: "Natureza, terra, raízes, clima e comunhão com Eldoryon.", profile: { virtue: "Comunhão", partyFunction: "Natureza e controle do ambiente", powerSource: "Terra Viva de Aeryn", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "forjador-tharion", title: "Forjador de Tharion", image: "/classes/forjador-tharion.png", accentFrom: "f97316", accentTo: "1d4ed8", canonicalNote: "Criação de armas, relíquias, runas, metal e memória material.", profile: { virtue: "Criação", partyFunction: "Relíquias, runas e apoio material", powerSource: "Forja de Tharion", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "animante-vhalessar", title: "Animante de Vhal’Essar", image: "/classes/animante-vhalessar.png", accentFrom: "c4b5fd", accentTo: "475569", canonicalNote: "Memórias dos mortos, espíritos, despedida, animação e ritos funerários.", profile: { virtue: "Despedida", partyFunction: "Espíritos e ritos funerários", powerSource: "Memória espiritual de Vhal’Essar", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "profeta-lirien", title: "Profeta de Lirien", image: "/classes/profeta-lirien.png", accentFrom: "7dd3fc", accentTo: "1d4ed8", canonicalNote: "Sonhos, marés, revelações, inspiração e esperança.", profile: { virtue: "Esperança", partyFunction: "Inspiração e revelações", powerSource: "Marés de Lirien", rulesStatus: "Regras em desenvolvimento" } },
    { slug: "tece-destinos-nymir", title: "Tece-Destinos de Nymir", image: "/classes/tece-destinos-nymir.png", accentFrom: "d6b36a", accentTo: "1e3a8a", canonicalNote: "Destino, causalidade, escolhas, fios temporais e alteração de possibilidades.", profile: { virtue: "Responsabilidade", partyFunction: "Possibilidades e causalidade", powerSource: "Fios de Nymir", rulesStatus: "Regras em desenvolvimento" } },
];

/* prisma/seeds/classes.seed.ts */
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type HitDie = "d6" | "d8" | "d10" | "d12";
type Role = "Defensor" | "Ofensor" | "Suporte" | "Híbrido";
type Spellcasting = "Arcano" | "Divino" | "Marcial" | "Híbrido" | "Nenhum";

type MetaJson = {
    role?: Role;
    hitDie?: HitDie;
    primaryAbilities?: string[];
    savingThrows?: string[];
    armorProficiencies?: string[];
    weaponProficiencies?: string[];
    spellcasting?: Spellcasting;
    pros?: string[];
    cons?: string[];
    featuresPreview?: string[];
    assets?: { image?: string; accentFrom?: string; accentTo?: string };
    description?: string; // guardamos aqui também por compat.
};

type SeedClass = {
    id: string;
    name: string;
    description: string;
    metaJson: MetaJson;
};

const CLASSES: ReadonlyArray<SeedClass> = [
    {
        id: "00000000-0000-0000-0000-000000000101",
        name: "Arauto de Elyra",
        description: "Ministro do sopro curativo e da luz compassiva de Elyra.",
        metaJson: {
            role: "Suporte",
            hitDie: "d8",
            primaryAbilities: ["Sabedoria", "Constituição"],
            savingThrows: ["Sabedoria", "Carisma"],
            armorProficiencies: ["Leve", "Média", "Escudos"],
            weaponProficiencies: ["Simples"],
            spellcasting: "Divino",
            pros: ["Cura forte", "Bênçãos", "Remoção de corrupções"],
            cons: ["Dano direto moderado", "Dependência de preparo"],
            featuresPreview: ["Curas de Elyra", "Canalizar Fé", "Proteção radiante"],
            assets: { image: "/classes/clerigo.jpg", accentFrom: "22c55e", accentTo: "0ea5e9" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000102",
        name: "Guardião de Artheon",
        description: "Cavaleiro consagrado à ordem e ao juramento do Julgo de Artheon.",
        metaJson: {
            role: "Híbrido",
            hitDie: "d10",
            primaryAbilities: ["Força", "Carisma"],
            savingThrows: ["Sabedoria", "Carisma"],
            armorProficiencies: ["Leve", "Média", "Pesada", "Escudos"],
            weaponProficiencies: ["Simples", "Marciais"],
            spellcasting: "Divino",
            pros: ["Smites luminosos", "Auras", "Defesa sólida"],
            cons: ["Mobilidade média", "Gestão de recursos"],
            featuresPreview: ["Juramento", "Golpe Sagrado", "Aura de Coragem"],
            assets: { image: "/classes/paladino.jpg", accentFrom: "f59e0b", accentTo: "38bdf8" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000103",
        name: "Sentinela do Obelisco",
        description: "Guerreiro que grava no corpo as técnicas dos Obeliscos.",
        metaJson: {
            role: "Híbrido",
            hitDie: "d10",
            primaryAbilities: ["Força", "Destreza", "Constituição"],
            savingThrows: ["Força", "Constituição"],
            armorProficiencies: ["Leve", "Média", "Pesada", "Escudos"],
            weaponProficiencies: ["Simples", "Marciais"],
            spellcasting: "Nenhum",
            pros: ["Versatilidade", "DPR consistente"],
            cons: ["Pouca magia utilitária"],
            featuresPreview: ["Manobras", "Estilos de Combate", "Surto de Ação"],
            assets: { image: "/classes/guerreiro.jpg", accentFrom: "64748b", accentTo: "22d3ee" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000104",
        name: "Furioso de Ignavor",
        description: "Portador da fúria do Fera Primordial Ignavor.",
        metaJson: {
            role: "Ofensor",
            hitDie: "d12",
            primaryAbilities: ["Força", "Constituição"],
            savingThrows: ["Força", "Constituição"],
            armorProficiencies: ["Leve", "Escudos"],
            weaponProficiencies: ["Simples", "Marciais"],
            spellcasting: "Nenhum",
            pros: ["Alta resistência", "Dano bruto"],
            cons: ["Pouca utilidade fora de combate"],
            featuresPreview: ["Fúria Primordial", "Resistência", "Ataques Implacáveis"],
            assets: { image: "/classes/barbaro.jpg", accentFrom: "f43f5e", accentTo: "f59e0b" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000105",
        name: "Andarilho Umbroso",
        description: "Mestre de passos silenciosos e precisão letal na penumbra.",
        metaJson: {
            role: "Ofensor",
            hitDie: "d8",
            primaryAbilities: ["Destreza", "Inteligência"],
            savingThrows: ["Destreza", "Inteligência"],
            armorProficiencies: ["Leve"],
            weaponProficiencies: ["Simples", "Armas de finesse", "Bestas leves"],
            spellcasting: "Nenhum",
            pros: ["Ataque Furtivo", "Exploração e perícias"],
            cons: ["Frágil se exposto"],
            featuresPreview: ["Ataque Furtivo", "Esquiva Sobrenatural", "Evasão"],
            assets: { image: "/classes/ladino.jpg", accentFrom: "06b6d4", accentTo: "0ea5e9" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000106",
        name: "Caçador de Fendas",
        description: "Rastreador de dissonâncias e guardião das rotas selvagens.",
        metaJson: {
            role: "Híbrido",
            hitDie: "d10",
            primaryAbilities: ["Destreza", "Sabedoria"],
            savingThrows: ["Força", "Destreza"],
            armorProficiencies: ["Leve", "Média", "Escudos"],
            weaponProficiencies: ["Simples", "Marciais"],
            spellcasting: "Híbrido",
            pros: ["Controle de campo", "Utilidade em exploração"],
            cons: ["Poder situacional"],
            featuresPreview: ["Inimigo Preferido", "Explorador Nascido", "Magias de Caça"],
            assets: { image: "/classes/patrulheiro.jpg", accentFrom: "22c55e", accentTo: "a3e635" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000107",
        name: "Druida de Lirien",
        description: "Guardião dos ciclos; molda carne e floresta com o Éter.",
        metaJson: {
            role: "Suporte",
            hitDie: "d8",
            primaryAbilities: ["Sabedoria", "Constituição"],
            savingThrows: ["Inteligência", "Sabedoria"],
            armorProficiencies: ["Leve", "Média", "Escudos (não metálicos)"],
            weaponProficiencies: ["Clava", "Lança", "Foice", "Adaga", "Dardos"],
            spellcasting: "Divino",
            pros: ["Versatilidade", "Curas e controle", "Forma Selvagem"],
            cons: ["Gestão de recursos complexa"],
            featuresPreview: ["Círculos de Lirien", "Forma Selvagem", "Molde Elemental"],
            assets: { image: "/classes/druida.jpg", accentFrom: "16a34a", accentTo: "22c55e" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000108",
        name: "Teurgo do Éter",
        description: "Erudito das geometrias; magia como teorema.",
        metaJson: {
            role: "Ofensor",
            hitDie: "d6",
            primaryAbilities: ["Inteligência", "Constituição"],
            savingThrows: ["Inteligência", "Sabedoria"],
            armorProficiencies: [],
            weaponProficiencies: ["Adagas", "Dardos", "Fundas", "Bordões"],
            spellcasting: "Arcano",
            pros: ["Maior variedade de magias", "Rituais"],
            cons: ["Muito frágil"],
            featuresPreview: ["Livro de Magias", "Arcana Preparada", "Rituais"],
            assets: { image: "/classes/mago.jpg", accentFrom: "a78bfa", accentTo: "22d3ee" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000109",
        name: "Tecelão do Sopro",
        description: "A magia nasce no peito; metamagia canaliza emoção.",
        metaJson: {
            role: "Ofensor",
            hitDie: "d6",
            primaryAbilities: ["Carisma", "Constituição"],
            savingThrows: ["Constituição", "Carisma"],
            armorProficiencies: [],
            weaponProficiencies: ["Adagas", "Dardos", "Fundas", "Bordões"],
            spellcasting: "Arcano",
            pros: ["Metamagia versátil", "Explosão"],
            cons: ["Poucas magias totais", "Defesa fraca"],
            featuresPreview: ["Metamagia", "Linagem Etérea", "Reservatório de Sopro"],
            assets: { image: "/classes/feiticeiro.jpg", accentFrom: "f472b6", accentTo: "fb7185" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000110",
        name: "Pactuário do Obscuro",
        description: "Acordos com ecos e obeliscos; poder com preço.",
        metaJson: {
            role: "Híbrido",
            hitDie: "d8",
            primaryAbilities: ["Carisma", "Constituição"],
            savingThrows: ["Sabedoria", "Carisma"],
            armorProficiencies: ["Leve"],
            weaponProficiencies: ["Simples"],
            spellcasting: "Arcano",
            pros: ["Feitiços potentes de impacto", "Invocações únicas"],
            cons: ["Dependente do patrono", "Recursos por descanso curto"],
            featuresPreview: ["Raios Eldritch", "Invocações", "Pactos (Tomo/Arma/Corrente)"],
            assets: { image: "/classes/bruxo.jpg", accentFrom: "7c3aed", accentTo: "0ea5e9" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000111",
        name: "Bardo do Cântico",
        description: "Afinador de almas; harmonia que move destinos.",
        metaJson: {
            role: "Suporte",
            hitDie: "d8",
            primaryAbilities: ["Carisma", "Destreza"],
            savingThrows: ["Destreza", "Carisma"],
            armorProficiencies: ["Leve"],
            weaponProficiencies: ["Simples", "Bestas leves", "Espadas curtas"],
            spellcasting: "Arcano",
            pros: ["Inspiração", "Perícias", "Magia flexível"],
            cons: ["Dano direto moderado"],
            featuresPreview: ["Inspiração do Cântico", "Ritmos", "Segredos do Colégio"],
            assets: { image: "/classes/bardo.jpg", accentFrom: "22d3ee", accentTo: "38bdf8" },
        },
    },
    {
        id: "00000000-0000-0000-0000-000000000112",
        name: "Monge do Alento",
        description: "Respiração sagrada; o corpo como oração.",
        metaJson: {
            role: "Ofensor",
            hitDie: "d8",
            primaryAbilities: ["Destreza", "Sabedoria"],
            savingThrows: ["Força", "Destreza"],
            armorProficiencies: [],
            weaponProficiencies: ["Simples", "Armas de monge"],
            spellcasting: "Nenhum",
            pros: ["Mobilidade", "Defesa sem armadura"],
            cons: ["Dependente de recursos (Ki)"],
            featuresPreview: ["Arte Marcial", "Rajada de Golpes", "Passos do Vento"],
            assets: { image: "/classes/monge.jpg", accentFrom: "06b6d4", accentTo: "22c55e" },
        },
    },
];



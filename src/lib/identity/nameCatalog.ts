// src/lib/identity/nameCatalog.ts
export type NameSetKey = "elyra" | "artheon" | "liren" | "umbros" | "vaelorin";

/**
 * Listas curadas — aparecem primeiro nas sugestões.
 * Mantenha-as enxutas (qualidade > quantidade). O grosso vem do gerador.
 */
export const CURATED: Record<NameSetKey, readonly string[]> = {
    elyra: [
        "Elyrion","Seraph Khae","Lumis Aera","Caelene","Narya Sol",
        "Aethiel","Khalem Ser","Lyraen","Sera Thal","Aurelin",
    ],
    artheon: [
        "Arth Rel","Val Coren","Darian Voss","Thalion Crest","Rhogar Jus",
        "Kael Ardent","Bastion Hale","Aegis Mor","Iraeon","Justicar Thar",
    ],
    liren: [
        "Lirien Moss","Faelwyn","Thistle Vael","Rowan Ilan","Myr Sage",
        "Silvael","Bracken Sol","Lira Moss","Fen Willow","Nymra Vale",
    ],
    umbros: [
        "Umbrael","Kryss Noct","Sael Var","Veyran","Nerith Shade",
        "Zhal Sussurro","Dusk Kha","Vel Sable","Noctar","Riven Umbra",
    ],
    vaelorin: [
        "Vaeloris","Aerion","Eryndel","Calith","Syllan",
        "Illyr","Avenel","Rhaedor","Caelith","Elovar",
    ],
};

export const NAME_EPITHETS = [
    "o Luminar","da Vigília","das Fendas","Sombrasangue","da Aurora",
    "de Lirien","do Obelisco","Juramentado","Errante","das Brumas",
] as const;

export function labelForSet(k: NameSetKey) {
    return (
        { elyra: "Elyra (luz)", artheon: "Artheon (juramento)", liren: "Lirien (natureza)", umbros: "Umbros (sombra)", vaelorin: "Vaelorin (élfico)" } as const
    )[k];
}

/* ------------------------------------------------------------------ */
/*                     GERADOR PROCEDURAL DE NOMES                     */
/* ------------------------------------------------------------------ */

/**
 * Estoques de sílabas por tema. Misturamos prefixo + núcleo (+ sufixo opcional)
 * e depois opcionalmente adicionamos um segundo token (sobrenome/epíteto curto).
 */
const SYLLABLES: Record<
    NameSetKey,
    {
        prefix: string[];
        core: string[];
        suffix: string[];
        second?: string[]; // “sobrenomes” curtos tipo “Khae”, “Moss”, “Shade”
    }
> = {
    elyra: {
        prefix: ["Ae","Ari","Au","Cael","Ely","Iri","Kha","Lu","Ly","Na","Ser","Tha","Vael","Ysa","Zae"],
        core:   ["ri","ly","the","el","ae","ra","ion","ar","en","um","is","ae","or","iel","ea"],
        suffix: ["n","el","is","a","us","ith","iel","ae","or","ian","e","ys","on","ir","as"],
        second: ["Aera","Khae","Sol","Lumen","Ser","Auris","Caeli","Lyra","Naris","Saera"],
    },
    artheon: {
        prefix: ["Arth","Val","Dar","Thal","Rhog","Kael","Bas","Aeg","Irae","Cor","Just","Garr","Hel","Tor","Cass"],
        core:   ["a","e","o","ar","or","al","en","us","an","on","er","as","os","ir","um"],
        suffix: ["on","en","os","ar","ius","or","an","el","en","tar","en","or","as","ius","orn"],
        second: ["Voss","Crest","Hale","Jus","Mor","Coren","Brand","Crown","Ward","Iron"],
    },
    liren: {
        prefix: ["Li","Fael","Thist","Ro","Myr","Sil","Brack","Fen","Nym","Will","Bria","Row","Thal","Elow","Ivy"],
        core:   ["ri","wyn","ae","el","ir","ow","en","yn","ia","os","al","il","an","ar","in"],
        suffix: ["en","el","wyn","ael","is","os","yn","ir","al","an","iel","or","eth","as","ia"],
        second: ["Moss","Willow","Fern","Thorn","Bloom","Glen","Reed","Bracken","Vale","Briar"],
    },
    umbros: {
        prefix: ["Umbr","Kry","Sael","Vey","Ner","Zhal","Dusk","Vel","Noct","Riv","Shae","Vor","Kaer","Nyx","Mor"],
        core:   ["a","e","i","o","u","yr","ae","ar","or","ul","ir","en","un","ys","eth"],
        suffix: ["el","ar","os","or","an","ys","eth","orn","as","um","ir","is","en","ath","ix"],
        second: ["Shade","Sable","Noct","Grim","Hush","Wane","Gloom","Veil","Hollow","Whisper"],
    },
    vaelorin: {
        prefix: ["Vae","Aeri","Eryn","Cali","Syl","Illy","Ave","Rhae","Caeli","Elo","Thae","Seri","Vael","Naer","Lai"],
        core:   ["lo","ri","ndel","lith","lan","lyr","riel","aer","ion","ith","elor","anel","aris","eth","iel"],
        suffix: ["rin","ion","del","ith","lan","ir","el","or","as","iel","on","ael","is","or","ian"],
        second: ["Anor","Elune","Sylas","Ilyr","Sare","Ael","Rhael","Vel","Cael","Lorien"],
    },
};

/**
 * Pequenas regras para emendar vogais duplicadas, capitalização e separar
 * um sobrenome/segundo token com espaço.
 */
function titleCase(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function stitch(a: string, b: string) {
    // Evita “aa”, “ii” etc. quando junta prefix/core/suffix
    if (!a) return b;
    if (!b) return a;
    const end = a.slice(-1);
    const start = b[0];
    if ("aeiouy".includes(end.toLowerCase()) && end.toLowerCase() === start?.toLowerCase()) {
        return a + b.slice(1);
    }
    return a + b;
}

function randomPick<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * Gera um único nome temático.
 */
export function generateName(set: NameSetKey, withSecond = true, withEpithetChance = 0.15): string {
    const stock = SYLLABLES[set];

    let base = "";
    base = stitch(base, randomPick(stock.prefix));
    base = stitch(base, randomPick(stock.core));
    if (Math.random() < 0.6) base = stitch(base, randomPick(stock.suffix));

    // 20–60% chance de ter segundo token (sobrenome curto)
    if (withSecond && stock.second && Math.random() < 0.5) {
        base = `${titleCase(base)} ${randomPick(stock.second)}`;
    } else {
        base = titleCase(base);
    }

    // chance de aplicar um epíteto
    if (withEpithetChance > 0 && Math.random() < withEpithetChance) {
        base = `${base} ${randomPick(NAME_EPITHETS)}`;
    }

    return base;
}

export type GenerateOptions = {
    /** nomes a evitar (existentes no BD, do party etc.) */
    avoid?: Iterable<string>;
    /** incluir/ou não segundo token (sobrenome) */
    allowSecond?: boolean;
    /** probabilidade de epíteto (0..1) */
    epithetChance?: number;
    /** máximo de tentativas extras para deduplicar */
    maxTries?: number;
};

/**
 * Gera N nomes únicos (dentro do lote), deduplicando e evitando “avoid”.
 * Mistura alguns nomes curados no topo.
 */
export function generateNames(set: NameSetKey, n: number, opts: GenerateOptions = {}): string[] {
    const {
        avoid,
        allowSecond = true,
        epithetChance = 0.12,
        maxTries = 200,
    } = opts;

    const avoidSet = new Set(
        (avoid ? Array.from(avoid) : []).map((s) => s.toLowerCase())
    );
    const out = new Set<string>();

    // 1) injeta até 1/3 de curados
    const curated = [...CURATED[set]];
    while (curated.length && out.size < Math.min(n, Math.ceil(n / 3))) {
        const i = Math.floor(Math.random() * curated.length);
        const pick = curated.splice(i, 1)[0]!;
        if (!avoidSet.has(pick.toLowerCase())) out.add(pick);
    }

    // 2) completa com procedurais
    let tries = 0;
    while (out.size < n && tries < maxTries) {
        tries++;
        const candidate = generateName(set, allowSecond, epithetChance);
        const key = candidate.toLowerCase();
        if (!out.has(candidate) && !avoidSet.has(key)) {
            out.add(candidate);
        }
    }

    return Array.from(out);
}

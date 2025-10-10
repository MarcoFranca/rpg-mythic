export type EterTheme = {
    bgFrom: string;
    bgTo: string;
    accent: string;
    accentSoft: string;
    text: string;
    ring: string;
};

export function deriveThemeFromIDG(idg: number): EterTheme {
    // idg: 0 (harmonia) → 100 (dissonância)
    const clamp = Math.max(0, Math.min(100, idg));

    // Interpolações simples entre paletas do Guia do Éter
    const lerp = (a: number, b: number) => a + (b - a) * (clamp / 100);

    // Cores base
    const etherBlue = { r: 51, g: 204, b: 204 };   // #33CCCC
    const gold = { r: 224, g: 179, b: 65 };        // #E0B341
    const violet = { r: 100, g: 47, b: 115 };      // #642F73
    const grayVeil = { r: 30, g: 27, b: 41 };      // #1E1B29

    // Gradiente de fundo: do éter azul → véu cinza conforme a dissonância sobe
    const bgFrom = `rgb(${lerp(11, grayVeil.r)}, ${lerp(13, grayVeil.g)}, ${lerp(19, grayVeil.b)})`;
    const bgTo   = `rgb(${lerp(24, 12)}, ${lerp(42, 12)}, ${lerp(56, 12)})`;

    // Acento: do azul-éter → violeta dissonante
    const accR = Math.round(lerp(etherBlue.r, violet.r));
    const accG = Math.round(lerp(etherBlue.g, violet.g));
    const accB = Math.round(lerp(etherBlue.b, violet.b));
    const accent = `rgb(${accR}, ${accG}, ${accB})`;

    // Acento suave para hovers e auras
    const accentSoft = `rgba(${accR}, ${accG}, ${accB}, 0.18)`;

    // Texto: mantém alto contraste
    const text = clamp < 60 ? "rgba(250,250,245,0.95)" : "rgba(255,255,255,0.92)";

    // Ring para focus/hover
    const ring = clamp < 60 ? "rgba(224,179,65,0.6)" : "rgba(100,47,115,0.6)";

    return { bgFrom, bgTo, accent, accentSoft, text, ring };
}

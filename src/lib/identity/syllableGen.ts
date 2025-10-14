// src/lib/identity/syllableGen.ts
const ONSETS = ["", "v", "kh", "s", "r", "l", "n", "th", "aer", "vael", "um", "cae", "ely", "rh"];
const NUCLEI = ["a","e","i","o","u","ae","ai","ia","eo","aeo","y"];
const CODAS  = ["l","n","r","s","th","m","","","", "el", "ion", "ar", "en", "is"];

function pick<T>(arr: readonly T[]) { return arr[Math.floor(Math.random()*arr.length)]!; }

export function makeName(min=2, max=3): string {
    const syll = Math.floor(Math.random()*(max-min+1))+min;
    let out = "";
    for (let i=0;i<syll;i++) out += pick(ONSETS)+pick(NUCLEI)+pick(CODAS);
    return out.replace(/^[a-z]/, (c) => c.toUpperCase()); // capitaliza
}

"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { deriveThemeFromIDG, type EterTheme } from "./theme";

type EterState = {
    idg: number;                 // 0..100
    theme: EterTheme;
    setIDG: (v: number) => void; // altera IDG (quando eventos do jogo ocorrerem)
};

const EterContext = createContext<EterState | null>(null);

export function EterProvider({ children }: { children: React.ReactNode }) {
    const [idg, _set] = useState<number>(12); // harmônico por padrão
    const setIDG = useCallback((v: number) => _set(Math.max(0, Math.min(100, v))), []);
    const theme = useMemo(() => deriveThemeFromIDG(idg), [idg]);

    return (
        <EterContext.Provider value={{ idg, theme, setIDG }}>
            {children}
        </EterContext.Provider>
    );
}

export function useEter() {
    const ctx = useContext(EterContext);
    if (!ctx) throw new Error("useEter must be used within <EterProvider>");
    return ctx;
}

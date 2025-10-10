"use client";

import { useEffect, useRef } from "react";
import { useEter } from "../eter/state";

/**
 * Hook que dispara mudanças de trilha conforme o IDG.
 * Adapte a integração aqui chamando seu AudioProvider real (ex.: audio.playLayer('elyra')).
 */
export function useCantoAmbient() {
    const { idg } = useEter();
    const lastBand = useRef<"elyra" | "balance" | "sombrasangue" | null>(null);

    useEffect(() => {
        const band: "elyra" | "balance" | "sombrasangue" =
            idg < 30 ? "elyra" : idg < 70 ? "balance" : "sombrasangue";

        if (band !== lastBand.current) {
            // TODO: conectar ao seu AudioProvider (crossfade entre camadas)
            // ex: audio.crossfadeTo(band)
            // ex2: play("hover") em interações de UI já existentes
            lastBand.current = band;
        }
    }, [idg]);
}

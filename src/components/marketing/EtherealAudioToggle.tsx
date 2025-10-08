// components/marketing/EtherealAudioToggle.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/app/providers/audio-provider";
import { usePageSound } from "@/hooks/useSound";

export default function EtherealAudioToggle() {
    const { enabled, interacted, toggle, ensureLoop } = useAudio();
    const { play } = usePageSound();

    return (
        <Button
            variant="ghost"
            className="text-white/80 hover:text-white"
            onMouseEnter={() => enabled && interacted && play("hover")}
            onClick={() => {
                toggle();
                // se acabou de ligar, garante imediatamente o loop e um feedback
                setTimeout(() => {
                    ensureLoop();
                    if (!enabled) play("success");
                }, 0);
            }}
            title={enabled ? "Desativar áudio místico" : "Ativar áudio místico"}
        >
            {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            <span className="sr-only">Alternar áudio místico</span>
        </Button>
    );
}

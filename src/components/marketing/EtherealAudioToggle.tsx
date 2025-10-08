"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export default function EtherealAudioToggle() {
    const [on, setOn] = useState(false);
    const loopRef = useRef<HTMLAudioElement | null>(null);
    const hoverRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        loopRef.current = new Audio("/audio/eter-loop.mp3");
        if (loopRef.current) {
            loopRef.current.loop = true;
            loopRef.current.volume = 0.25;
        }
        hoverRef.current = new Audio("/audio/hover.wav");
        if (hoverRef.current) hoverRef.current.volume = 0.45;

        // delega sfx para botões com data-sfx="hover"
        const handler = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target?.closest?.('[data-sfx="hover"]')) {
                hoverRef.current?.currentTime && (hoverRef.current.currentTime = 0);
                hoverRef.current?.play().catch(() => {});
            }
        };
        document.addEventListener("mouseenter", handler, true);
        return () => document.removeEventListener("mouseenter", handler, true);
    }, []);

    useEffect(() => {
        if (!loopRef.current) return;
        if (on) loopRef.current.play().catch(() => {});
        else loopRef.current.pause();
    }, [on]);

    return (
        <Button variant="ghost" className="text-white/80 hover:text-white" onClick={() => setOn((v) => !v)} title="Som do Éter">
            {on ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            <span className="sr-only">Alternar áudio mítico</span>
        </Button>
    );
}

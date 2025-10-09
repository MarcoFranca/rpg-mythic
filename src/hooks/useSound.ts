"use client";
import { useAudio } from "@/app/providers/audio-provider";

export function usePageSound() {
    const { enabled, playSfx } = useAudio();
    return { enabled, play: playSfx };
}

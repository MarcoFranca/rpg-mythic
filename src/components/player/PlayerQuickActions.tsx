// src/components/player/PlayerQuickActions.tsx
"use client";

import { BookOpen, Package, Swords, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import SoundHover from "@/components/system/SoundHover";
import { glassClass } from "@/components/system/Glass";
import { useEter } from "@/lib/eter/state";

type Action = {
    key: "character" | "inventory" | "spells" | "campaigns";
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
};

export default function PlayerQuickActions(props: {
    onOpen: (key: Action["key"]) => void;
    playHover?: () => void;
}) {
    const { theme } = useEter();

    const actions: Action[] = [
        { key: "character", label: "Eco da Alma", icon: <User className="h-4 w-4" />, onClick: () => props.onOpen("character") },
        { key: "inventory", label: "Inventário Mítico", icon: <Package className="h-4 w-4" />, onClick: () => props.onOpen("inventory") },
        { key: "spells", label: "Vibração do Éter", icon: <BookOpen className="h-4 w-4" />, onClick: () => props.onOpen("spells") },
        { key: "campaigns", label: "Atravessar o Véu", icon: <Swords className="h-4 w-4" />, onClick: () => props.onOpen("campaigns") },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {actions.map((a) => (
                <SoundHover key={a.key} onHover={props.playHover}>
                    <Button
                        onClick={a.onClick}
                        variant="secondary"
                        className={glassClass("w-full justify-start gap-2 rounded-xl")}
                        style={{ boxShadow: `0 0 0 1px ${theme.accentSoft}` }}
                        title={a.label}
                    >
                        {a.icon}
                        <span className="text-sm">{a.label}</span>
                    </Button>
                </SoundHover>
            ))}
        </div>
    );
}

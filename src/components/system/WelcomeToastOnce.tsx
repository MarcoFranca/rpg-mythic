"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMythicToast } from "@/lib/notifications";

type Role = "PLAYER" | "GM" | "SPECTATOR";

const roleLines: Record<Role, { title: (n?: string) => string; desc: string }> = {
    PLAYER: {
        title: (n) => `Bem-vindo, ${n ?? "Aventureiro"}!`,
        desc: "As lendas aguardam seus passos — que o Éter conduza sua lâmina e seu coração.",
    },
    GM: {
        title: (n) => `Saudações, ${n ?? "Mestre"}!`,
        desc: "As tramas do mundo curvam-se à sua vontade — teça destinos com sabedoria.",
    },
    SPECTATOR: {
        title: (n) => `Seja bem-vindo, ${n ?? "Viajante"}!`,
        desc: "Observe o Cântico enquanto ele tece o entrelaçar de luz e sombra.",
    },
};

export default function WelcomeToastOnce({ role = "SPECTATOR", name }: { role?: Role; name?: string }) {
    const sp = useSearchParams();
    const { notifyMagic } = useMythicToast();

    useEffect(() => {
        const w = sp.get("welcome");
        if (w === "1") {
            const line = roleLines[role] ?? roleLines.SPECTATOR;
            // passa o role para customizar o ícone do selo
            notifyMagic("success", line.title(name), line.desc, { role });
            // limpa os params para não repetir
            const url = new URL(window.location.href);
            url.searchParams.delete("welcome");
            url.searchParams.delete("name");
            window.history.replaceState({}, "", url.toString());
        }
    }, [sp, role, name, notifyMagic]);

    return null;
}

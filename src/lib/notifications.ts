// lib/notifications.ts
"use client";

import { toast } from "sonner";
import { usePageSound } from "@/hooks/useSound";

type ToastKind = "success" | "error" | "info";

export function useMythicToast() {
    const { play } = usePageSound();

    function notify(kind: ToastKind, title: string, description?: string) {
        // Sons “canônicos” do Cântico:
        // - success -> harmonia ascendente (cristalina)
        // - error   -> dissonância curta (grave, abafada)
        if (kind === "success") play("success");
        else if (kind === "error") play("error");
        else play("click");

        const opts = description ? { description } : undefined;
        if (kind === "success") toast.success(title, opts);
        else if (kind === "error") toast.error(title, opts);
        else toast(title, opts);
    }

    return { notify };
}

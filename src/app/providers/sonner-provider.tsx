"use client";
import { Toaster } from "sonner";

export function SonnerProvider() {
    return (
        <Toaster
            position="top-right"
            richColors
            expand
            toastOptions={{
                style: { background: "rgba(12,12,14,0.9)", color: "white", border: "1px solid rgba(255,255,255,0.1)" },
            }}
        />
    );
}

// app/providers/sonner-provider.tsx
"use client";

import { Toaster } from "sonner";

export function SonnerProvider() {
    return (
        <Toaster
            position="top-right"
            expand
            toastOptions={{
                classNames: {
                    toast: "bg-transparent shadow-none",
                    content: "text-white",
                },
            }}
        />
    );
}

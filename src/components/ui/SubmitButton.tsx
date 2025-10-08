// components/ui/SubmitButton.tsx
"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="group w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
            {pending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando…</>) : children}
        </Button>
    );
}

"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Sparkles, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { usePageSound } from "@/hooks/useSound";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
type FormData = z.infer<typeof schema>;

export default function LoginCard() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormData>({ email: "", password: "" });
    const { enabled, toggle, play } = usePageSound();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const parsed = schema.safeParse(form);
        if (!parsed.success) return play("error");
        setLoading(true);

        try {
            // ====== SUPABASE AUTH (exemplo) ======
            // const { data, error } = await supabase.auth.signInWithPassword({
            //   email: form.email,
            //   password: form.password,
            // });
            // if (error) throw error;

            // ====== NEXTAUTH (exemplo) ======
            // const res = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
            // if (res?.error) throw new Error(res.error);

            play("success");
            router.push("/app");
        } catch {
            play("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-md"
            aria-label="Acesso ao Portal Mítico"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold leading-tight">Entre no Portal</h1>
                    <p className="text-sm text-white/70">Use seu e-mail e senha, ou continue com Google.</p>
                </div>
                <button
                    type="button"
                    onClick={toggle}
                    aria-pressed={enabled}
                    aria-label={enabled ? "Desativar sons" : "Ativar sons"}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                    {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="voce@exemplo.com"
                        value={form.email}
                        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                        className="bg-black/40 border-white/15 text-white placeholder:text-white/40"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                        className="bg-black/40 border-white/15 text-white placeholder:text-white/40"
                        required
                    />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-white/70">
                    <a href="/forgot" className="hover:underline">Esqueci minha senha</a>
                    <a href="/register" className="hover:underline">Criar conta</a>
                </div>

                <div className="mt-4 grid gap-3">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="group w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                        Entrar
                    </Button>

                    <Button
                        type="button"
                        onClick={() => {
                            // Exemplo Supabase/NextAuth Google aqui
                            // supabase.auth.signInWithOAuth({ provider: "google" })
                            // signIn("google")
                            play("click");
                        }}
                        variant="outline"
                        className="w-full rounded-2xl border-white/20 bg-black/40 text-white hover:bg-black/60"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Entrar com Google
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}

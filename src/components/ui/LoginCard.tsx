"use client";

import { useActionState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { usePageSound } from "@/hooks/useSound";
import { signInWithPassword, startOAuthGoogle, type ActionState } from "@/app/(auth)/login/actions";
import EtherealAudioToggle from "@/components/marketing/EtherealAudioToggle";
import { useMythicToast } from "@/lib/notifications";
import { useFormStatus } from "react-dom";

function SubmitBtn({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="group w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
            {pending ? "Entrando..." : children}
        </Button>
    );
}

export default function LoginCard() {
    const router = useRouter();
    const { enabled, play } = usePageSound();
    const [pendingOAuth, start] = useTransition();
    const [state, formAction] = useActionState<ActionState, FormData>(signInWithPassword, { ok: true });
    const { notify } = useMythicToast();

    const fieldErr = (name: string) => (state.ok ? undefined : state.error?.[name]?.[0]);

    // Toast de erro (sucesso redireciona e o toast é disparado no /app pelo WelcomeToastOnce)
    useEffect(() => {
        if (!state.ok) {
            notify("error", "Falha ao entrar", state.message ?? fieldErr("email") ?? fieldErr("password") ?? "Verifique suas credenciais.");
            play("error");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

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
                <div
                    aria-pressed={enabled}
                    aria-label={enabled ? "Desativar sons" : "Ativar sons"}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                    <EtherealAudioToggle />
                </div>
            </div>

            {!state.ok && state.message && (
                <p role="status" aria-live="polite" className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {state.message}
                </p>
            )}

            <form
                action={(fd) => {
                    play("click");
                    formAction(fd);
                }}
                className="space-y-4"
            >
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="voce@exemplo.com"
                        className="bg-black/40 border-white/15 text-white placeholder:text-white/40"
                        aria-invalid={!!fieldErr("email")}
                        aria-errormessage={fieldErr("email") ? "email-error" : undefined}
                        required
                    />
                    {!!fieldErr("email") && (
                        <p id="email-error" className="text-xs text-red-300">
                            {fieldErr("email")}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="bg-black/40 border-white/15 text-white placeholder:text-white/40"
                        aria-invalid={!!fieldErr("password")}
                        aria-errormessage={fieldErr("password") ? "password-error" : undefined}
                        required
                    />
                    {!!fieldErr("password") && (
                        <p id="password-error" className="text-xs text-red-300">
                            {fieldErr("password")}
                        </p>
                    )}
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-white/70">
                    <a href="/forgot" className="hover:underline">Esqueci minha senha</a>
                    <a href="/register" className="hover:underline">Criar conta</a>
                </div>

                <div className="mt-4 grid gap-3">
                    <SubmitBtn>Entrar</SubmitBtn>

                    <Button
                        type="button"
                        onClick={() =>
                            start(async () => {
                                const res = await startOAuthGoogle();
                                if (res.ok && res.url) {
                                    play("click");
                                    window.location.href = res.url;
                                } else {
                                    play("error");
                                }
                            })
                        }
                        variant="outline"
                        disabled={pendingOAuth}
                        className="w-full rounded-2xl border-white/20 bg-black/40 text-white hover:bg-black/60"
                    >
                        {pendingOAuth ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {pendingOAuth ? "Conectando..." : "Entrar com Google"}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}

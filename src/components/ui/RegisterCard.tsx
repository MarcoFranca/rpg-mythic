"use client";

import { useActionState, useTransition } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserRound, Shield, Sword } from "lucide-react";
import { registerWithRole, type ActionState } from "@/app/(auth)/register/actions";
import { useState } from "react";

type Role = "SPECTATOR" | "PLAYER" | "GM";

const ROLES: Array<{ key: Role; title: string; desc: string; icon: any }> = [
    { key: "PLAYER", title: "Jogador", desc: "Crie personagens, jogue campanhas.", icon: Sword },
    { key: "GM", title: "Mestre", desc: "Crie mesas, monstros e mundos.", icon: Shield },
    { key: "SPECTATOR", title: "Observador", desc: "Acompanhe campanhas como espectador.", icon: UserRound },
];

export default function RegisterCard() {
    const [pending, start] = useTransition();
    const [state, formAction] = useActionState<ActionState, FormData>(registerWithRole, { ok: true });
    const [role, setRole] = useState<Role>("PLAYER");

    const fieldErr = (name: string) => (state.ok ? undefined : state.error?.[name]?.[0]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-md"
            aria-label="Cadastro no Portal Mítico"
        >
            <div className="mb-6">
                <h1 className="text-xl font-bold leading-tight">Crie sua conta</h1>
                <p className="text-sm text-white/70">Escolha seu papel, adicione um avatar e entre no Cântico.</p>
            </div>

            {!state.ok && state.message && (
                <p role="status" aria-live="polite" className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {state.message}
                </p>
            )}

            <form
                action={(fd) => {
                    fd.set("role", role);
                    formAction(fd);
                }}
                className="space-y-5"
            >
                {/* Papel */}
                <div className="grid grid-cols-3 gap-2">
                    {ROLES.map(({ key, title, desc, icon: Icon }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setRole(key)}
                            aria-pressed={role === key}
                            className={`group rounded-xl border p-3 text-left transition ${
                                role === key
                                    ? "border-violet-400/60 bg-violet-400/10"
                                    : "border-white/10 bg-black/20 hover:border-white/20"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 opacity-90" />
                                <span className="text-sm font-semibold">{title}</span>
                            </div>
                            <p className="mt-1 text-[11px] leading-snug text-white/70">{desc}</p>
                        </button>
                    ))}
                </div>

                {/* Dados */}
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Nome de exibição</Label>
                        <Input
                            id="displayName"
                            name="displayName"
                            placeholder="Ex.: Elyndor"
                            className="bg-black/40 border-white/15 text-white placeholder:text-white/40"
                            aria-invalid={!!fieldErr("displayName")}
                        />
                        {!!fieldErr("displayName") && <p className="text-xs text-red-300">{fieldErr("displayName")}</p>}
                    </div>

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
                            required
                        />
                        {!!fieldErr("email") && <p className="text-xs text-red-300">{fieldErr("email")}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className="bg-black/40 border-white/15 text-white placeholder:text-white/40"
                            aria-invalid={!!fieldErr("password")}
                            required
                        />
                        {!!fieldErr("password") && <p className="text-xs text-red-300">{fieldErr("password")}</p>}
                    </div>

                    {/* Avatar opcional */}
                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar (opcional)</Label>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            className="bg-black/40 border-white/15 text-white"
                        />
                        <p className="text-[11px] text-white/60">PNG/JPG até ~2MB. Você pode trocar depois no perfil.</p>
                    </div>
                </div>

                <div className="grid gap-3 pt-1">
                    <Button
                        type="submit"
                        disabled={pending}
                        className="group w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Criar conta
                    </Button>
                    <a href="/login" className="text-center text-xs text-white/70 hover:underline">
                        Já tem conta? Entrar
                    </a>
                </div>
            </form>
        </motion.div>
    );
}

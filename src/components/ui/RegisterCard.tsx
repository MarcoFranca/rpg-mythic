// components/ui/RegisterCard.tsx
"use client";

import { useActionState, useTransition, useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRound, Shield, Sword, LogIn } from "lucide-react";
import { registerWithRole, startOAuthGoogleWithRole, type ActionState } from "@/app/(auth)/register/actions";
import { useSearchParams } from "next/navigation";
import EtherealAudioToggle from "@/components/marketing/EtherealAudioToggle";
import { usePageSound } from "@/hooks/useSound";
import {SubmitButton} from "@/components/ui/SubmitButton";
import { useMythicToast } from "@/lib/notifications";

type Role = "SPECTATOR" | "PLAYER" | "GM";
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const ROLES: Array<{ key: Role; title: string; desc: string; icon: IconType }> = [
    { key: "PLAYER", title: "Jogador", desc: "Crie personagens, jogue campanhas.", icon: Sword },
    { key: "GM", title: "Mestre", desc: "Crie mesas, monstros e mundos.", icon: Shield },
    { key: "SPECTATOR", title: "Espectador", desc: "Acompanhe campanhas como espectador.", icon: UserRound },
];

const isRole = (v: string | null): v is Role => v === "PLAYER" || v === "GM" || v === "SPECTATOR";

export default function RegisterCard() {
    const [state, formAction] = useActionState<ActionState, FormData>(registerWithRole, { ok: true });
    const [pendingOAuth, startOAuth] = useTransition();
    const { notify } = useMythicToast();

    const params = useSearchParams();
    const initialRole = useMemo<Role>(() => (isRole(params.get("role")) ? (params.get("role") as Role) : "PLAYER"), [params]);
    const [role, setRole] = useState<Role>(initialRole);

    // preview simples do avatar
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => setRole(initialRole), [initialRole]);

    const { enabled, play } = usePageSound();

    // anti “metralhadora de hover”: só toca quando entra na área do botão (não em ícones/textos internos)
    const hoverLock = useRef(false);
    const playHover = () => {
        if (hoverLock.current) return;
        hoverLock.current = true;
        play("hover"); // <- antes estava "openModal"
        setTimeout(() => (hoverLock.current = false), 120);
    };

    const fieldErr = (name: string) => (state.ok ? undefined : state.error?.[name]?.[0]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-md"
            aria-label="Cadastro no Portal Mítico"
        >
            <div className="mb-5 flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-xl font-bold leading-tight">Crie sua conta</h1>
                    <p className="text-sm text-white/70">Escolha seu papel, adicione um avatar e entre no Cântico.</p>
                </div>
                <div
                    aria-pressed={enabled}
                    aria-label={enabled ? "Desativar sons" : "Ativar sons"}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400"
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
                    fd.set("role", role);
                    formAction(fd);
                }}
                className="space-y-5"
            >
                {/* papéis */}
                <div className="grid grid-cols-3 gap-2">
                    {ROLES.map(({ key, title, desc, icon: Icon }) => (
                        <button
                            key={key}
                            type="button"
                            onMouseEnter={playHover}
                            onFocus={playHover}
                            onClick={() => setRole(key)}
                            aria-pressed={role === key}
                            aria-label={`Selecionar ${title}`}
                            className={`group rounded-2xl border p-3 text-left transition ${
                                role === key ? "border-cyan-400/60 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                            } focus-visible:ring-2 focus-visible:ring-cyan-400`}
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <Icon className="h-5 w-5 opacity-90" />
                                <span className="font-medium">{title}</span>
                            </div>
                            <p className="text-xs text-white/70">{desc}</p>
                        </button>
                    ))}
                </div>

                {/* dados */}
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Seu nome</Label>
                        <Input
                            id="displayName"
                            name="displayName"
                            autoComplete="name"
                            placeholder="Ex.: Elyndor Arcanis"
                            className="bg-black/40 border-white/15 text-white placeholder:text-white/40"
                            aria-invalid={!!fieldErr("displayName")}
                            required
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

                    {/* avatar com preview */}
                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar (opcional)</Label>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            className="bg-black/40 border-white/15 text-white"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return setAvatarPreview(null);
                                const url = URL.createObjectURL(file);
                                setAvatarPreview(url);
                            }}
                        />
                        {avatarPreview && (
                            <div className="mt-2 inline-flex items-center gap-3">
                                <img src={avatarPreview} alt="Pré-visualização do avatar" className="h-12 w-12 rounded-full border border-white/15 object-cover" />
                                <span className="text-xs text-white/60">Pré-visualização</span>
                            </div>
                        )}
                        <p className="text-[11px] text-white/60">PNG/JPG até ~2MB. Você pode trocar depois no perfil.</p>
                    </div>
                </div>

                {/* CTA principal */}
                    <div className="grid gap-3 pt-1">
                        <SubmitButton>Criar conta</SubmitButton>

                    {/* botão Google com papel */}
                    <Button
                        type="button"
                        variant="outline"
                        disabled={pendingOAuth}
                        onClick={() =>
                            startOAuth(async () => {
                                const res = await startOAuthGoogleWithRole(role);
                                if (res.ok && res.url) window.location.href = res.url!;
                            })
                        }
                        className="w-full rounded-2xl border-white/20 bg-white/10 hover:bg-white/15"
                        aria-label="Cadastrar com Google"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        {pendingOAuth ? "Conectando ao Google..." : "Cadastrar com Google"}
                    </Button>

                    <a href="/login" className="text-center text-xs text-white/70 hover:underline">
                        Já tem conta? Entrar
                    </a>
                </div>
            </form>
        </motion.div>
    );
}

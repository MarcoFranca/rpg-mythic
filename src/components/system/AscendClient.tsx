"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Shield, Sword, Undo2, Sparkles } from "lucide-react";
import { chooseTrackAndPromote, returnToTrack } from "@/app/(auth)/roles/actions";
import { useMythicToast } from "@/lib/notifications";
import PortalEterBackground from "@/components/marketing/PortalEterBackground";
import ObeliskRingGlow from "@/components/marketing/ObeliskRingGlow";

type Role = "PLAYER" | "GM" | "SPECTATOR";
type Track = "PLAYER" | "GM" | null;

export default function AscendClient({
                                         user,
                                         canPick,
                                         canReturn,
                                         thresholds,
                                     }: {
    user: { id: string; name: string; role: Role; track: Track; sigils: number };
    canPick: { player: boolean; gm: boolean };
    canReturn: boolean;
    thresholds: { player: number; gm: number };
}) {
    const sp = useSearchParams();
    const router = useRouter();
    const { notifyMagic } = useMythicToast();
    const [pending, start] = useTransition();

    // se veio com ?track=PLAYER|GM já focamos o card sugerido
    const hintTrack = useMemo<Track>(() => {
        const t = (sp.get("track") ?? "").toUpperCase();
        return t === "PLAYER" || t === "GM" ? (t as Track) : null;
    }, [sp]);

    const isSpectator = user.role === "SPECTATOR";

    function promoteTo(track: "PLAYER" | "GM") {
        start(async () => {
            const fd = new FormData();
            fd.set("track", track);
            const res = await chooseTrackAndPromote(fd);
            if (res.ok) {
                notifyMagic("success", "O Cântico o reconhece.", res.message, { role: track });
                router.push(`/app?welcome=1&name=${encodeURIComponent(user.name)}`);
            } else {
                notifyMagic("error", "Não foi possível ascender.", res.message);
            }
        });
    }

    function handleReturn() {
        start(async () => {
            const res = await returnToTrack();
            if (res.ok) {
                notifyMagic("success", "Harmonia Restabelecida", res.message, { role: (user.track ?? "PLAYER") as Role });
                router.push(`/app?welcome=1&name=${encodeURIComponent(user.name)}`);
            } else {
                notifyMagic("error", "Ainda não é possível.", res.message);
            }
        });
    }

    return (
        <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
            <PortalEterBackground src="/videos/anel-eter.mp4" poster="/videos/anel-eter-poster.png" opacity={0.65} />
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.10),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_55%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-30" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            <ObeliskRingGlow sizeVmin={70} opacity={0.25} anchor="viewport" strength={0.012} />

            <section className="relative z-10 mx-auto max-w-4xl px-6 py-8">
                <div className="mb-6 flex items-center gap-3">
                    <Link href="/app" className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/15">← Voltar</Link>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                        Sígilos: <b className="text-white/90">{user.sigils}</b>
                    </div>
                    {isSpectator && user.track && (
                        <div className="text-xs text-white/60">Trilha original: <b>{user.track === "GM" ? "Mestre" : "Jogador"}</b></div>
                    )}
                </div>

                {/* Estado 1: Observador sem trilha (escolher) */}
                {isSpectator && !user.track && (
                    <>
                        <h1 className="text-lg font-semibold mb-2">Escolha sua trilha</h1>
                        <p className="mb-6 text-sm text-white/75">
                            Ao escolher, sua trilha fica **permanente**. Você só poderá cair para Observador se ficar sem Sígilos, mas sempre retornará à mesma trilha.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <CardTrack
                                title="Jogador"
                                icon={<Sword className="h-5 w-5" />}
                                desc="Crie personagens, viva campanhas e expanda seu destino."
                                needed={thresholds.player}
                                sigils={user.sigils}
                                canAct={canPick.player}
                                highlight={hintTrack === "PLAYER"}
                                pending={pending}
                                actionLabel="Ascender como Jogador"
                                onAct={() => promoteTo("PLAYER")}
                            />
                            <CardTrack
                                title="Mestre"
                                icon={<Shield className="h-5 w-5" />}
                                desc="Conduza mesas, teça encontros e governe o mito."
                                needed={thresholds.gm}
                                sigils={user.sigils}
                                canAct={canPick.gm}
                                highlight={hintTrack === "GM"}
                                pending={pending}
                                actionLabel="Ascender como Mestre"
                                onAct={() => promoteTo("GM")}
                                accent="violet"
                            />
                        </div>
                    </>
                )}

                {/* Estado 2: Observador com trilha (retornar) */}
                {isSpectator && user.track && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                        <h2 className="text-base font-semibold mb-2">Retornar à sua trilha</h2>
                        <p className="text-sm text-white/75 mb-4">
                            Sua trilha é <b>{user.track === "GM" ? "Mestre" : "Jogador"}</b>. Recupere os Sígilos necessários e retorne quando estiver pronto.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                disabled={!canReturn || pending}
                                onClick={handleReturn}
                                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm
                  ${canReturn
                                    ? "border-emerald-400/40 bg-emerald-400/10 hover:bg-emerald-400/15"
                                    : "border-white/10 bg-white/5 opacity-60 cursor-not-allowed"}
                `}
                                title={canReturn ? "Retornar agora" : "Aguarde Sígilos suficientes"}
                            >
                                <Undo2 className="h-4 w-4" />
                                {canReturn ? "Retornar agora" : "Aguardando Sígilos"}
                            </button>
                            {!canReturn && (
                                <span className="text-xs text-white/60">
                  Você precisa de pelo menos <b>{user.track === "GM" ? 8 : 5}</b> Sígilos para retornar.
                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Estado 3: Já é PLAYER/GM (explicar regra) */}
                {!isSpectator && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                        <h2 className="text-base font-semibold mb-2">Sua trilha está selada</h2>
                        <p className="text-sm text-white/75">
                            Você é <b>{user.role === "GM" ? "Mestre" : "Jogador"}</b>. A trilha é permanente — o Cântico só permite cair para Observador se os Sígilos se extinguirem.
                        </p>
                        <div className="mt-4">
                            <Link href="/app" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
                                <Sparkles className="h-4 w-4" />
                                Voltar à Home
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}

/* ---------- Card de trilha ---------- */
function CardTrack({
                       title, icon, desc, needed, sigils, canAct, highlight, pending, onAct, accent = "emerald", actionLabel,
                   }: {
    title: string;
    icon: React.ReactNode;
    desc: string;
    needed: number;
    sigils: number;
    canAct: boolean;
    highlight?: boolean;
    pending: boolean;
    onAct: () => void;
    actionLabel: string;
    accent?: "emerald" | "violet";
}) {
    const border =
        accent === "violet" ? "border-violet-400/35" : "border-emerald-400/35";
    const aura =
        accent === "violet"
            ? "from-fuchsia-400/25 via-violet-400/15 to-indigo-400/10"
            : "from-emerald-400/25 via-teal-400/15 to-cyan-400/10";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className={`relative overflow-hidden rounded-2xl border ${border} bg-white/5 p-5 backdrop-blur-md`}
            style={highlight ? { boxShadow: "0 0 24px rgba(16,185,129,0.18)" } : undefined}
        >
            <div className={`absolute -inset-1 rounded-3xl blur-md opacity-60 bg-gradient-to-r ${aura}`} style={{ WebkitMaskImage: "radial-gradient(white, transparent 70%)" }} />
            <div className="relative z-10">
                <div className="mb-2 flex items-center gap-2">
                    <span className="grid place-items-center rounded-xl border border-white/10 bg-white/10 p-2">{icon}</span>
                    <div className="font-semibold">{title}</div>
                </div>
                <p className="text-sm text-white/75 mb-4">{desc}</p>

                <div className="mb-3 text-xs text-white/70">
                    Sígilos: <b className="text-white/90">{sigils}</b> / {needed}
                </div>

                <button
                    disabled={!canAct || pending}
                    onClick={onAct}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm
            ${canAct
                        ? "border-emerald-400/40 bg-emerald-400/10 hover:bg-emerald-400/15"
                        : "border-white/10 bg-white/5 opacity-60 cursor-not-allowed"}
          `}
                >
                    {canAct ? <Sword className="h-4 w-4" /> : <Check className="h-4 w-4 opacity-50" />}
                    {canAct ? actionLabel : "Aguardando Sígilos"}
                </button>
            </div>
        </motion.div>
    );
}

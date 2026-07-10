"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Compass,
    Flame,
    Gem,
    MoonStar,
    ScrollText,
    Sparkles,
    Swords,
    User,
} from "lucide-react";
import type { Campaign } from "@/components/player/CampaignCircle";
import { PlayerObelisk } from "@/components/player/PlayerObelisk";
import OnboardingCoach from "@/components/player/OnboardingCoach";
import { Button } from "@/components/ui/button";
import { glassClass } from "@/components/system/Glass";
import NeonAuraBorder from "@/components/system/NeonAuraBorder";
import OuterAuraGlow from "@/components/system/OuterAuraGlow";
import EtherealParticles from "@/components/system/EtherealParticles";
import { useRouter } from "next/navigation";
import { useAudio } from "@/app/providers/audio-provider";
import { cn } from "@/lib/utils";

type PanelId = "character" | "inventory" | "spells" | "campaigns" | null;

export default function PlayerHome({
                                       counts,
                                       campaigns,
                                       userName,
                                       hasCharacter,
                                       primaryCharacterId,
                                   }: {
    counts: { myMemberships: number };
    campaigns: Campaign[];
    userName: string;
    hasCharacter: boolean;
    primaryCharacterId?: string | null;
}) {
    const [panel, setPanel] = useState<PanelId>(null);
    const router = useRouter();
    const { playSfx: play } = useAudio();

    const campaignCount = counts.myMemberships;
    const characterHref = hasCharacter
        ? primaryCharacterId
            ? `/app/characters/${primaryCharacterId}`
            : "/app/characters"
        : "/app/characters/new";

    const heroActions = [
        {
            title: hasCharacter ? "Consultar o Eco" : "Revelar tua Forma",
            copy: hasCharacter
                ? "Retorne ao personagem que já canta em teu nome."
                : "Forje teu primeiro avatar no Cântico e desperte tua trilha.",
            href: characterHref,
            icon: User,
            accent: "from-cyan-300/30 via-cyan-200/10 to-transparent",
        },
        {
            title: campaignCount > 0 ? "Cruzar o Véu" : "Encontrar um Véu",
            copy: campaignCount > 0
                ? "Há mesas aguardando teu retorno entre os mundos."
                : "Busca uma campanha viva ou responde ao chamado de outro mestre.",
            href: "/app/campaigns",
            icon: Compass,
            accent: "from-amber-300/30 via-amber-200/10 to-transparent",
        },
    ] as const;

    const ritualCards = [
        {
            title: "Grimório do Éter",
            text: "Consulta magias, efeitos e vibrações antes da próxima travessia.",
            icon: BookOpen,
            action: () => setPanel("spells"),
            button: "Abrir grimório",
        },
        {
            title: "Relicário Mítico",
            text: "Ordena inventário, artefatos e fragmentos que ainda dormirão em teu poder.",
            icon: Gem,
            action: () => setPanel("inventory"),
            button: "Ver relicário",
        },
        {
            title: "Mesa dos Ecos",
            text: "Escolhe campanhas, acompanha chamados e sente o pulso dos Véus ativos.",
            icon: Swords,
            action: () => setPanel("campaigns"),
            button: "Ver mesas",
        },
    ] as const;

    const constellations = [
        {
            label: "Eco da Alma",
            value: hasCharacter ? "Desperto" : "Silente",
            detail: hasCharacter ? "Tua essência já possui forma." : "Ainda não foi moldado um personagem.",
            icon: MoonStar,
        },
        {
            label: "Véus Ativos",
            value: String(campaignCount),
            detail: campaignCount > 0 ? "Há caminhos abertos para ti." : "Nenhum Véu ainda responde ao teu nome.",
            icon: Swords,
        },
        {
            label: "Ritual Seguinte",
            value: hasCharacter ? "Entrar em campanha" : "Criar personagem",
            detail: hasCharacter
                ? "Tua jornada pede agora mesa, conflito e destino."
                : "Toda lenda começa ao dar forma ao próprio eco.",
            icon: ScrollText,
        },
    ] as const;

    const panelMeta: Record<Exclude<PanelId, null>, { title: string; text: string; href: string; button: string }> = {
        character: {
            title: "Eco da Alma",
            text: hasCharacter
                ? "Tua ficha e tua presença no Cântico vivem aqui."
                : "Ainda não há personagem. O próximo rito é revelá-lo.",
            href: characterHref,
            button: hasCharacter ? "Ir para personagem" : "Criar personagem",
        },
        inventory: {
            title: "Inventário Mítico",
            text: "Aqui viverão relíquias, armamentos, catalisadores e tesouros colhidos nos Véus.",
            href: "/app",
            button: "Retornar ao núcleo",
        },
        spells: {
            title: "Grimório do Éter",
            text: "As vibrações arcanas ainda pedem uma câmara própria, mas já podemos apontar o caminho.",
            href: "/app",
            button: "Retornar ao núcleo",
        },
        campaigns: {
            title: "Atravessar o Véu",
            text: campaignCount > 0
                ? "Tuas campanhas aguardam teu retorno. Escolhe um Véu e cruza."
                : "Nenhuma campanha pulsa ainda, mas os portais já podem ser buscados.",
            href: "/app/campaigns",
            button: campaignCount > 0 ? "Ir para campanhas" : "Encontrar campanha",
        },
    };

    const openObeliskMenu = (id: Exclude<PanelId, null>) => {
        if (id === "character" && !hasCharacter) {
            router.push("/app/characters/new");
            return;
        }
        if (id === "campaigns" && !campaigns.length) {
            router.push("/app/campaigns");
            return;
        }
        setPanel(id);
    };

    const rightRitual = ritualCards[2];
    const RightRitualIcon = rightRitual.icon;

    return (
        <>
            <section className="relative overflow-visible pb-6 pt-2">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[10%] top-8 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />
                    <div className="absolute right-[8%] top-24 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,14,20,0.82),rgba(6,8,12,0.56))] p-6 shadow-[0_25px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl"
                    >
                        <EtherealParticles
                            className="pointer-events-none absolute inset-0 opacity-60"
                            density={18}
                            maxSize={3}
                            drift={12}
                            brightness={0.9}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.08),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(253,224,71,0.12),transparent_24%),radial-gradient(circle_at_40%_70%,rgba(34,211,238,0.14),transparent_42%)]" />

                        <div className="relative z-10">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/70">
                                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                                Câmara do Despertar
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-white/68">O Véu se abre para teu retorno.</p>
                                <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] md:text-5xl">
                                    {hasCharacter
                                        ? `Eco de ${userName}, teu destino volta a arder em Eldoryon.`
                                        : `${userName}, o Cântico ainda aguarda a forma do teu primeiro eco.`}
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-white/72 md:text-base">
                                    A home pública já convida para o mito. Aqui, tua câmara de jogador deve fazer o mesmo:
                                    menos painel administrativo, mais sensação de ritual, jornada e presença no mundo.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {heroActions.map(({ title, copy, href, icon: Icon, accent }) => (
                                    <Link
                                        key={title}
                                        href={href}
                                        onMouseEnter={() => play("hover")}
                                        onClick={() => play("success")}
                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
                                    >
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80 transition group-hover:opacity-100", accent)} />
                                        <div className="relative flex items-start gap-3">
                                            <div className="mt-0.5 rounded-xl border border-white/10 bg-black/25 p-2.5 text-white/85">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{title}</div>
                                                <div className="mt-1 text-xs leading-5 text-white/68">{copy}</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.aside
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 }}
                        className="grid gap-4"
                    >
                        {constellations.map(({ label, value, detail, icon: Icon }, index) => (
                            <div
                                key={label}
                                className={cn(
                                    glassClass("relative overflow-hidden rounded-[24px] p-5"),
                                    "bg-[linear-gradient(150deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]",
                                )}
                            >
                                <div
                                    className="absolute inset-0 opacity-60"
                                    style={{
                                        background:
                                            index === 0
                                                ? "radial-gradient(circle at 15% 20%, rgba(34,211,238,0.16), transparent 30%)"
                                                : index === 1
                                                    ? "radial-gradient(circle at 85% 30%, rgba(250,204,21,0.18), transparent 28%)"
                                                    : "radial-gradient(circle at 50% 100%, rgba(255,255,255,0.10), transparent 36%)",
                                    }}
                                />
                                <div className="relative flex items-start gap-3">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
                                        <Icon className="h-4 w-4 text-white/80" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] uppercase tracking-[0.22em] text-white/50">{label}</div>
                                        <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
                                        <div className="mt-1 text-xs leading-5 text-white/68">{detail}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.aside>
                </div>
            </section>

            <section className="mb-7">
                <OnboardingCoach
                    hasCharacter={hasCharacter}
                    campaignCount={campaignCount}
                    primaryCharacterId={primaryCharacterId ?? undefined}
                />
            </section>

            <section className="relative overflow-visible py-8">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/8 blur-3xl" />

                <div className="grid gap-8 xl:grid-cols-[0.8fr_1.4fr_0.8fr] xl:items-center">
                    <div className="grid gap-4">
                        {ritualCards.slice(0, 2).map(({ title, text, icon: Icon, action, button }) => (
                            <RitualCard
                                key={title}
                                title={title}
                                text={text}
                                button={button}
                                icon={<Icon className="h-4 w-4" />}
                                onAction={() => {
                                    play("hover");
                                    action();
                                }}
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.08, duration: 0.5 }}
                        className="relative flex min-h-[29rem] items-center justify-center overflow-visible rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(6,18,24,0.58),rgba(4,5,8,0.18)_70%)]"
                    >
                        <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-cyan-300/10" />
                        <div className="pointer-events-none absolute inset-[8%] rounded-full border border-amber-200/10" />
                        <div className="pointer-events-none absolute inset-[18%] rounded-full border border-white/6" />

                        <motion.div
                            aria-hidden
                            className="absolute h-[22rem] w-[22rem] rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
                            style={{
                                border: "1px solid rgba(255,255,255,0.08)",
                                boxShadow: "0 0 70px rgba(34,211,238,0.12), inset 0 0 70px rgba(250,204,21,0.05)",
                            }}
                        />

                        <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/60">
                            Núcleo do Cântico
                        </div>

                        <div className="absolute right-6 top-6 max-w-[13rem] text-right text-xs leading-5 text-white/62">
                            Toca o prisma para abrir os caminhos do personagem, do inventário, das magias e das campanhas.
                        </div>

                        <div className="relative z-20 flex flex-col items-center gap-6">
                            <div className="text-center">
                                <div className="text-xs uppercase tracking-[0.3em] text-white/55">Obelisco Vivo</div>
                                <div className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                                    {hasCharacter ? "Teu eco já reconhece o portal." : "O portal ainda pede teu nome."}
                                </div>
                            </div>

                            <PlayerObelisk
                                highlight={!hasCharacter}
                                hasCharacter={hasCharacter}
                                hasCampaigns={(campaigns?.length ?? 0) > 0}
                                onOpen={openObeliskMenu}
                            />

                            <div className="max-w-md text-center text-sm leading-6 text-white/68">
                                O prisma central é teu altar de acesso rápido. Ele deve soar como artefato do mundo, não como atalho comum.
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid gap-4">
                        <RitualCard
                            title={rightRitual.title}
                            text={rightRitual.text}
                            button={rightRitual.button}
                            icon={<RightRitualIcon className="h-4 w-4" />}
                            onAction={() => {
                                play("hover");
                                rightRitual.action();
                            }}
                        />

                        <div className={glassClass("relative overflow-hidden rounded-[24px] p-5")}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
                            <div className="relative">
                                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/55">
                                    <Flame className="h-3.5 w-3.5 text-amber-300" />
                                    Presságio
                                </div>
                                <div className="text-lg font-medium text-white">
                                    {campaignCount > 0
                                        ? "Há Véus te aguardando. O próximo passo é entrar em jogo."
                                        : "Ainda reina silêncio. Isso é uma promessa, não um vazio."}
                                </div>
                                <p className="mt-2 text-sm leading-6 text-white/68">
                                    Quando a home do jogador soa como uma câmara sagrada, a passagem entre marketing e produto deixa de quebrar a imersão.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {panel && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[3px]"
                    onClick={() => setPanel(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-x-4 bottom-4 mx-auto w-full max-w-3xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(145deg,rgba(8,14,20,0.95),rgba(10,10,14,0.92))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                            <OuterAuraGlow intensity={0.9} />
                            <NeonAuraBorder radius={26} stroke={1} glow={0.48} />

                            <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                                <div className="max-w-2xl">
                                    <div className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
                                        Câmara Invocada
                                    </div>
                                    <div className="text-2xl font-semibold text-white">{panelMeta[panel].title}</div>
                                    <p className="mt-2 text-sm leading-6 text-white/70">{panelMeta[panel].text}</p>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="rounded-xl border border-white/10 bg-white/10 text-white hover:bg-white/15"
                                    onClick={() => setPanel(null)}
                                >
                                    Silenciar
                                </Button>
                            </div>

                            <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                                <Button asChild className="rounded-xl" onMouseEnter={() => play("hover")}>
                                    <Link href={panelMeta[panel].href}>{panelMeta[panel].button}</Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
                                    onMouseEnter={() => play("hover")}
                                    onClick={() => setPanel(null)}
                                >
                                    Permanecer no salão
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}

function RitualCard({
                        title,
                        text,
                        button,
                        icon,
                        onAction,
                    }: {
    title: string;
    text: string;
    button: string;
    icon: React.ReactNode;
    onAction: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(150deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-5 backdrop-blur-xl"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.10),transparent_24%)]" />
            <div className="relative">
                <div className="mb-3 inline-flex rounded-2xl border border-white/10 bg-black/20 p-2 text-white/85">
                    {icon}
                </div>
                <div className="text-lg font-medium text-white">{title}</div>
                <p className="mt-2 text-sm leading-6 text-white/68">{text}</p>
                <Button className="mt-4 rounded-xl" onClick={onAction}>
                    {button}
                </Button>
            </div>
        </motion.div>
    );
}

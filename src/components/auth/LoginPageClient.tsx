// components/auth/LoginPageClient.tsx
"use client";

import { motion } from "framer-motion";
import PortalEterBackground from "@/components/marketing/PortalEterBackground";
import ObeliskRingGlow from "@/components/marketing/ObeliskRingGlow";
import LoginCard from "@/components/ui/LoginCard";
import EtherealAudioToggle from "@/components/marketing/EtherealAudioToggle";

type Props = {
    /** quando true, mostra instrução de confirmação de e-mail */
    needsConfirm?: boolean;
    /** e-mail para exibir na instrução (opcional) */
    email?: string;
};

export default function LoginPageClient({ needsConfirm = false, email }: Props) {
    return (
        <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
            <PortalEterBackground src="/videos/anel-eter.mp4" poster="/videos/anel-eter-poster.png" opacity={0.72} />

            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.14),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(234,179,8,0.12),transparent_60%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-40" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            <section className="relative z-20 grid min-h-[100dvh] place-items-center px-4">
                <div className="relative w-full max-w-md">
                    <ObeliskRingGlow sizeVmin={80} opacity={0.30} anchor="container" strength={0.015} offsetX={-70} offsetY={-70} />

                    {needsConfirm && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="mb-4 rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100"
                            role="status"
                            aria-live="polite"
                        >
                            Enviamos um link de confirmação para{" "}
                            <span className="font-medium">{email ?? "seu e-mail"}</span>. Confirme para entrar no Cântico.
                        </motion.div>
                    )}

                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                        <LoginCard />
                    </motion.div>
                </div>
            </section>

            {/* Toggle de áudio opcional no rodapé */}
            <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-end px-5">
                <div className="pointer-events-auto">
                    <EtherealAudioToggle />
                </div>
            </div>
        </main>
    );
}

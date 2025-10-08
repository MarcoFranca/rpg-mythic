// app/register/page.tsx
"use client";

import { motion } from "framer-motion";
import PortalEterBackground from "@/components/marketing/PortalEterBackground";
import ObeliskRingGlow from "@/components/marketing/ObeliskRingGlow";
import RegisterCard from "@/components/ui/RegisterCard";

export default function RegisterPage() {
    return (
        <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
            <PortalEterBackground src="/videos/anel-eter.mp4" poster="/videos/anel-eter-poster.jpg" opacity={0.72} />

            <section className="relative z-20 grid min-h-[100dvh] place-items-center px-4">
                <div className="relative w-full max-w-md">
                    <ObeliskRingGlow sizeVmin={44} opacity={0.30} />
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                        <RegisterCard />
                    </motion.div>
                </div>
            </section>

            {/* Toggle de áudio como no login */}
            {/*<div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-end px-5">*/}
            {/*    <div className="pointer-events-auto"><EtherealAudioToggle /></div>*/}
            {/*</div>*/}
        </main>
    );
}

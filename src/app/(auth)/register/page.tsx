"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import PortalEterBackground from "@/components/marketing/PortalEterBackground";
import ObeliskRingGlow from "@/components/marketing/ObeliskRingGlow";
import RegisterCard from "@/components/ui/RegisterCard";

// (opcional) skeleton simples pro fallback do Suspense
function RegisterCardSkeleton() {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
            <div className="h-5 w-28 bg-white/10 rounded mb-2" />
            <div className="h-4 w-48 bg-white/10 rounded mb-5" />
            <div className="space-y-3">
                <div className="h-10 bg-white/10 rounded" />
                <div className="h-10 bg-white/10 rounded" />
                <div className="h-10 bg-white/10 rounded" />
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
            <PortalEterBackground src="/videos/anel-eter.mp4" poster="/videos/anel-eter-poster.png" opacity={0.72} />

            <section className="relative z-20 grid min-h-[100dvh] place-items-center px-4">
                <div className="relative w-full max-w-md">
                    <ObeliskRingGlow sizeVmin={44} opacity={0.30} />
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                        {/* ✅ Suspense envolve quem usa useSearchParams (RegisterCard) */}
                        <Suspense fallback={<RegisterCardSkeleton />}>
                            <RegisterCard />
                        </Suspense>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

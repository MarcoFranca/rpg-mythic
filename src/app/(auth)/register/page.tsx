"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
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
        <main className="relative min-h-[100dvh] overflow-y-auto bg-black text-white">
            <PortalEterBackground src="/videos/anel-eter.mp4" poster="/videos/anel-eter-poster.png" opacity={0.72} />

            <header className="absolute left-4 top-4 z-30 sm:left-6 sm:top-5">
                <Link href="/" className="group relative block h-18 w-44 overflow-hidden rounded-lg sm:h-20a sm:w-52" aria-label="Voltar à página inicial de Eldoryon">
                    <Image
                        src="/logo/logo (3).png"
                        alt="Eldoryon"
                        width={640}
                        height={360}
                        priority
                        className="h-full w-full scale-[1.04] object-cover object-center transition duration-500 group-hover:scale-[1.08]"
                    />
                </Link>
            </header>

            <section className="relative z-20 grid min-h-[100dvh] place-items-center px-4 py-24">
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

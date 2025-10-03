// components/marketing/Community.tsx
"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Community() {
    return (
        <section className="relative px-6 pb-20 md:pb-28 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mx-auto rounded-3xl border border-white/10 bg-white/[.03] p-8 text-center backdrop-blur-sm"
            >
                <h3 className="text-xl md:text-2xl font-semibold">Junte-se ao Conselho</h3>
                <p className="mt-2 text-white/80 text-sm md:text-base">
                    Entre na guilda, participe dos testes, ajude a decidir o próximo feitiço — e ganhe um título lendário.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <Link href="/login"><Button className="bg-violet-600 text-white hover:bg-violet-500 hover:scale-102 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-transform duration-800"
                    >Entrar</Button></Link>
                    <Link href="/app"><Button variant="outline" className="border-white/30 text-white hover:text-cyan-300 hover:scale-102 transition-transform duration-800"
                    >Ver o Portal</Button></Link>
                </div>
            </motion.div>
        </section>
    );
}

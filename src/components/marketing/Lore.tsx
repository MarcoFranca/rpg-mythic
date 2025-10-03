// components/marketing/Lore.tsx
"use client";
import { motion } from "framer-motion";

export default function Lore() {
    return (
        <section className="relative px-6 py-16 md:py-20 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-white/10 bg-white/[.03] p-6 md:p-8 backdrop-blur-sm"
            >
                <p className="text-center text-sm md:text-base text-white/80">
                    Sob céus rasgados por magia antiga, reinos inteiros cambaleiam. Mestres convocam heróis,
                    bestas despertam de criptas esquecidas e artefatos sussurram em idiomas extintos.
                </p>
                <p className="mt-3 text-center text-sm md:text-base text-white/80">
                    No <span className="text-white font-semibold">Guia Mítico</span> você forja lendas:
                    do inventário ao salão do conselho — tudo em um único portal.
                </p>
            </motion.div>
        </section>
    );
}

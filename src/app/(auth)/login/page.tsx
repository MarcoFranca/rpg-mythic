"use client";

import { motion } from "framer-motion";
import AuthBackground from "@/components/marketing/AuthBackground";
import LoginCard from "@/components/ui/LoginCard";

export default function LoginPage() {
    return (
        <main className="relative min-h-[100dvh] bg-black text-white">
            <AuthBackground />
            <section className="relative z-20 grid min-h-[100dvh] place-items-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <LoginCard />
                </motion.div>
            </section>
        </main>
    );
}

// app/layout.tsx
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SonnerProvider } from "./providers/sonner-provider";
import AudioProvider from "@/app/providers/audio-provider";
import TRPCProvider from "@/app/providers/trpc-provider";

export const metadata = { title: "RPG System — Guia Mítico" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body>
        <ThemeProvider>
            <SonnerProvider />
            <AudioProvider>
                <TRPCProvider>
                <Providers>{children}</Providers>
                </TRPCProvider>
            </AudioProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}

// app/layout.tsx
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SonnerProvider } from "./providers/sonner-provider";
import AudioProvider from "@/app/providers/audio-provider";

export const metadata = { title: "RPG System — Guia Mítico" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body>
        <ThemeProvider>
            <SonnerProvider />
            <AudioProvider>
                <Providers>{children}</Providers>
            </AudioProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}

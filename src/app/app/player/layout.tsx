import { EterProvider } from "@/lib/eter/state";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <EterProvider>{children}</EterProvider>;
}

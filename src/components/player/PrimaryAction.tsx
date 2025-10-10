import {Campaign} from "@/components/player/CampaignCircle";

export function PrimaryAction({ campaigns }: { campaigns: Campaign[] }) {
    const active = campaigns.find(c => c.status === "ativa");
    if (active) {
        return (
            <a
                href={active.href}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:brightness-110"
            >
                Retomar {active.name}
            </a>
        );
    }
    return (
        <div className="flex gap-2">
            <a className="rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-110" href="/app/tables/discover">
                Encontrar mesa pública
            </a>
            <a className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:brightness-110" href="/app/calls/new">
                Criar Pedido de Entrada
            </a>
        </div>
    );
}

import { NextResponse } from "next/server";
import type { SigilsPayload } from "@/lib/sigils/types";

// TODO: troque por leitura real (Prisma) usando o userId da sessão
function mockGetUserSigils(/* userId: string */): SigilsPayload {
    return {
        balance: 7,
        cap: null, // sem limite por padrão; se quiser limite inicial, defina um número
        recent: [
            { id: "tx_01", delta: +3, reason: "Login diário", createdAt: new Date(Date.now() - 3600e3).toISOString() },
            { id: "tx_02", delta: +5, reason: "Mestra e Ganha", createdAt: new Date(Date.now() - 86400e3).toISOString() },
            { id: "tx_03", delta: -1, reason: "Entrada em campanha", createdAt: new Date(Date.now() - 90000e3).toISOString() },
        ],
    };
}

export async function GET() {
    // const userId = await getUserIdFromSession(); // quando ligar auth real
    const payload = mockGetUserSigils();
    return NextResponse.json(payload);
}

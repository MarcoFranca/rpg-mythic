import { NextResponse } from "next/server";

type Body = {
    toUserId: string;
    amount: number;
    note?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;

        // validações rápidas
        if (!body.toUserId || typeof body.toUserId !== "string") {
            return NextResponse.json({ error: "toUserId inválido" }, { status: 400 });
        }
        if (!Number.isFinite(body.amount) || body.amount <= 0) {
            return NextResponse.json({ error: "amount deve ser > 0" }, { status: 400 });
        }

        // TODO:
        // - pegar userId do emissor na sessão
        // - anti-abuso: limite diário (ex: máx 5 por dia), impedir transferir pra si mesmo
        // - checar saldo suficiente; debitar emissor e creditar destinatário
        // - gravar lançamento (Prisma)
        // - retornar novo saldo

        // MOCK: devolve “ok” com novo balanço hipotético
        return NextResponse.json({
            ok: true,
            newBalance: Math.max(0, 7 - body.amount),
            transfer: { toUserId: body.toUserId, amount: body.amount, note: body.note ?? null },
        });
    } catch {
        return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }
}

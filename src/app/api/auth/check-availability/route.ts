import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normEmail(email: string) {
    return email.trim().toLowerCase();
}

function normName(name: string) {
    return name.trim();
}

export async function POST(req: Request) {
    try {
        const { email, displayName } = await req.json().catch(() => ({}));

        const [emailExists, nameExists] = await Promise.all([
            email ? prisma.user.findFirst({ where: { email: normEmail(String(email)) }, select: { id: true } }) : null,
            displayName ? prisma.user.findFirst({ where: { displayName: normName(String(displayName)) }, select: { id: true } }) : null,
        ]);

        return NextResponse.json({
            ok: true,
            email: email ? { available: !emailExists } : undefined,
            displayName: displayName ? { available: !nameExists } : undefined,
        });
    } catch (e) {
        return NextResponse.json({ ok: false, message: "Falha ao verificar disponibilidade." }, { status: 500 });
    }
}

// src/app/logout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createSupabaseServer(); // <- agora é async
    await supabase.auth.signOut();
    return NextResponse.redirect(
        new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
}

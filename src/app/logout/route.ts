// src/app/logout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerAction } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createSupabaseServerAction(); // <- agora é async
    await supabase.auth.signOut();
    return NextResponse.redirect(
        new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
}

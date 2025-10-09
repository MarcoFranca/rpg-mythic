"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerAction } from "@/lib/supabase/server";

export async function signOut() {
    const supabase = await createSupabaseServerAction();
    await supabase.auth.signOut();
    redirect("/login");
}

import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export function middleware(request: NextRequest) {
    return updateSession(request);
}

export const config = {
    matcher: ["/app/:path*", "/api/trpc/:path*"],
};

import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import { effectiveRole, GlobalRole } from "../guards/roles";

export const requireAuth = middleware(({ ctx, next }) => {
    if (!ctx.dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next();
});

export const requireEffectiveRole = (roles: GlobalRole[]) =>
    middleware(({ ctx, next }) => {
        if (!ctx.dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });
        const eff = effectiveRole(ctx.dbUser);
        if (!roles.includes(eff)) throw new TRPCError({ code: "FORBIDDEN" });
        return next();
    });

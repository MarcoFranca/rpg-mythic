export type Role = "SPECTATOR" | "PLAYER" | "GM";

// domínio de ações do sistema (adicione conforme crescer)
export type Ability =
    | "profile.read"
    | "profile.write"
    | "sigils.read"
    | "campaign.read"
    | "campaign.join"
    | "campaign.manage"
    | "session.read"
    | "session.checkin"
    | "session.manage"
    | "character.read"
    | "character.write.own"
    | "character.validate"
    | "grimoire.read"
    | "grimoire.write.own"
    | "grimoire.homebrew"
    | "item.read"
    | "item.write.own"     // inventário local (operações do jogador sobre si)
    | "item.curate"        // criação/curadoria global (GM)
    | "bestiary.read"
    | "bestiary.curate"
    | "lore.read"
    | "lore.curate"
    | "market.read"
    | "market.buy"
    | "market.curate"
    | "social.read"
    | "social.write"
    | "gm.scene.tools";

const base: Record<Role, Ability[]> = {
    SPECTATOR: [
        "profile.read",
        "sigils.read",
        "campaign.read",
        "session.read",
        "character.read",
        "grimoire.read",
        "item.read",
        "bestiary.read",
        "lore.read",
        "market.read",
        "social.read",
    ],
    PLAYER: [
        "profile.read", "profile.write",
        "sigils.read",
        "campaign.read", "campaign.join",
        "session.read", "session.checkin",
        "character.read", "character.write.own",
        "grimoire.read", "grimoire.write.own",
        "item.read", "item.write.own",
        "lore.read",
        "market.read", "market.buy",
        "social.read", "social.write",
    ],
    GM: [
        "profile.read", "profile.write",
        "sigils.read",
        "campaign.read", "campaign.manage",
        "session.read", "session.manage",
        "character.read", "character.validate",
        "grimoire.read", "grimoire.homebrew",
        "item.read", "item.curate",
        "bestiary.read", "bestiary.curate",
        "lore.read", "lore.curate",
        "market.read", "market.curate",
        "social.read", "social.write",
        "gm.scene.tools",
    ],
};

export const Permissions = {
    for(role: Role): Set<Ability> {
        return new Set(base[role]);
    },
};

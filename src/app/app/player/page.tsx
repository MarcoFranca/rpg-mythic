"use client";

import { motion } from "framer-motion";
import PlayerDashboardLayout from "@/components/player/PlayerDashboardLayout";
import { PlayerObelisk } from "@/components/player/PlayerObelisk";
import { CampaignCircle, type Campaign } from "@/components/player/CampaignCircle";
import { FaithMeter } from "@/components/player/FaithMeter";
import { CharacterSummary } from "@/components/player/CharacterSummary";
import { useEter } from "@/lib/eter/state";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { glassClass } from "@/components/system/Glass";

type Props = {
    counts: { myMemberships: number };
    campaigns: Campaign[];
    userName: string;
};

export default function PlayerHomePageMock() {
    // Use este MOCK se quiser ver isolado; a versão usada pelo SystemHome está no componente PlayerHome abaixo.
    return <div className="text-sm opacity-70">Use o PlayerHome do sistema (SystemHome → PlayerHome).</div>;
}

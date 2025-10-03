"use client";

import { useActionState, useTransition, useState } from "react";
import { signInWithPassword, signUpQuick, signUpFull, signInWithOAuth } from "../(auth)/auth-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function LoginPage() {
    // React 19: [state, formAction, isPending] — precisa de (action, initialState)
    const [loginState, loginAction, loginPending] = useActionState(signInWithPassword, null);
    const [quickState, quickAction, quickPending] = useActionState(signUpQuick, null);
    const [fullState, fullAction, fullPending] = useActionState(signUpFull, null);
    const [pendingOAuth, startOAuth] = useTransition();

    async function handleOAuth() {
        startOAuth(async () => {
            const res = await signInWithOAuth("google");
            if (res?.ok && res.url) window.location.href = res.url;
        });
    }

    return (
        <main className="min-h-[100dvh] grid place-items-center bg-gradient-to-b from-black via-zinc-950 to-black text-white p-4">
            <Card className="w-full max-w-xl border-white/10 bg-white/[.03]">
                <CardContent className="p-6">
                    <h1 className="text-xl font-semibold mb-4">Acesse o Guia Mítico</h1>

                    <Tabs defaultValue="login">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Criar conta</TabsTrigger>
                        </TabsList>

                        {/* LOGIN */}
                        <TabsContent value="login" className="mt-4">
                            <form action={loginAction} className="space-y-3">
                                <div>
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input id="email" name="email" type="email" required placeholder="voce@email.com" />
                                </div>
                                <div>
                                    <Label htmlFor="password">Senha</Label>
                                    <Input id="password" name="password" type="password" required placeholder="••••••••" />
                                </div>
                                {loginState?.message && <p className="text-red-400 text-sm">{loginState.message}</p>}
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={loginPending}>Entrar</Button>
                                    <Button type="button" variant="outline" onClick={handleOAuth} disabled={pendingOAuth}>
                                        Entrar com Google
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        {/* REGISTER */}
                        <TabsContent value="register" className="mt-4">
                            <RegisterTabs
                                quickAction={quickAction}
                                quickState={quickState}
                                fullAction={fullAction}
                                fullState={fullState}
                                quickPending={quickPending}
                                fullPending={fullPending}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    );
}

function RegisterTabs({
                          quickAction,
                          quickState,
                          fullAction,
                          fullState,
                          quickPending,
                          fullPending,
                      }: {
    quickAction: (formData: FormData) => void;
    quickState: any;
    fullAction: (formData: FormData) => void;
    fullState: any;
    quickPending: boolean;
    fullPending: boolean;
}) {
    const [isFull, setIsFull] = useState(false);
    const toggleMode = () => setIsFull(v => !v);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-white/10 p-3">
                <div>
                    <p className="font-medium">Cadastro completo</p>
                    <p className="text-xs text-white/70">Inclui nome e termos. Recomendado.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs">Rápido</span>
                    <Switch onCheckedChange={toggleMode} />
                    <span className="text-xs">Completo</span>
                </div>
            </div>

            {/* Rápido */}
            {!isFull && (
                <form action={quickAction} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="q_email">E-mail</Label>
                            <Input id="q_email" name="email" type="email" required />
                        </div>
                        <div>
                            <Label htmlFor="q_password">Senha</Label>
                            <Input id="q_password" name="password" type="password" required />
                        </div>
                    </div>
                    {quickState?.message && <p className="text-red-400 text-sm">{quickState.message}</p>}
                    <Button type="submit" disabled={quickPending}>Criar conta (rápido)</Button>
                </form>
            )}

            {/* Completo */}
            {isFull && (
                <>
                    <div className="border-t border-white/10 pt-4" />
                    <form action={fullAction} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="f_email">E-mail</Label>
                                <Input id="f_email" name="email" type="email" required />
                            </div>
                            <div>
                                <Label htmlFor="f_password">Senha</Label>
                                <Input id="f_password" name="password" type="password" required />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="f_displayName">Nome</Label>
                                <Input id="f_displayName" name="displayName" type="text" required />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2">
                                <input id="f_terms" name="acceptTerms" type="checkbox" className="h-4 w-4" required />
                                <Label htmlFor="f_terms">Aceito os termos de uso</Label>
                            </div>
                        </div>
                        {fullState?.message && <p className="text-red-400 text-sm">{fullState.message}</p>}
                        <Button type="submit" disabled={fullPending}>Criar conta (completo)</Button>
                    </form>
                </>
            )}
        </div>
    );
}

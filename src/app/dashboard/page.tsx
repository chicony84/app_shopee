"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function DashboardContent() {
    const searchParams = useSearchParams();
    const isConnected = searchParams?.get("shopee_connected") === "true";

    const [partnerId, setPartnerId] = useState("");
    const [partnerKey, setPartnerKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [hasCredentials, setHasCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if the user already has credentials saved
        const fetchCredentials = async () => {
            try {
                const res = await fetch("/api/shopee/credentials");
                const data = await res.json();
                if (data.partnerId && data.hasKey) {
                    setHasCredentials(true);
                    setPartnerId(data.partnerId);
                }
            } catch (e) {
                console.error("Failed to load credentials");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCredentials();
    }, []);

    const handleSaveCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/shopee/credentials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ partnerId, partnerKey })
            });
            if (res.ok) {
                setHasCredentials(true);
                // Clear key from UI for security
                setPartnerKey("");
            } else {
                alert("Erro ao salvar as credenciais da Shopee.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-[family-name:var(--font-geist-sans)] selection:bg-orange-100">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16">
                <main className="flex flex-col gap-8 md:gap-12">

                    <header className="flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
                        <Link href="/" className="text-orange-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            Voltar para Início
                        </Link>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
                            Painel de Controle
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            Shopee <span className="text-orange-600">Auto-Share</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                            Configure suas chaves de API para começar a automatizar suas postagens.
                        </p>
                    </header>

                    {isConnected && (
                        <div className="p-5 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">
                                ✅
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="font-bold text-lg">Conexão estabelecida!</p>
                                <p className="text-sm opacity-90">Sua conta Shopee foi integrada com sucesso e está pronta para uso.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">

                        {/* Campaigns Card */}
                        <Link href="/dashboard/campaigns" className="group bg-orange-600 p-8 sm:p-10 rounded-[2.5rem] border border-orange-500 shadow-2xl shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-[15deg] group-hover:rotate-[25deg] transition-transform duration-700">
                                <svg width="150" height="150" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                            </div>
                            <div>
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white text-3xl mb-6 shadow-inner">
                                    📦
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">Campanhas Shopee</h2>
                                <p className="text-orange-100 font-bold max-w-[240px]">Explore produtos em alta e agende suas postagens agora.</p>
                            </div>
                            <div className="flex items-center gap-2 text-white font-black text-lg">
                                Explorar Agora
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </div>
                        </Link>

                        {/* Step 1: Credentials */}
                        <section className="bg-white p-6 sm:p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 transition-all hover:shadow-orange-200/20">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold text-sm shrink-0 shadow-lg shadow-slate-900/20">1</span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Credenciais da API</h2>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 md:p-6 mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 text-blue-100">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                                </div>
                                <h3 className="font-bold text-blue-900 mb-3 text-base flex items-center gap-2 relative z-10">
                                    Como obter as chaves?
                                </h3>
                                <ol className="text-sm text-blue-800/90 space-y-3 relative z-10 list-decimal list-inside">
                                    <li>Acesse o <a href="https://open.shopee.com/" target="_blank" rel="noreferrer" className="underline font-bold decoration-blue-300 hover:decoration-blue-600 transition-all text-blue-700">Shopee Open Platform</a>.</li>
                                    <li>No Console, vá em <strong>App Management</strong>.</li>
                                    <li>Copie o <strong>Partner ID</strong> e a <strong>Partner Key</strong> do seu Aplicativo.</li>
                                </ol>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col gap-6 animate-pulse">
                                    <div className="h-5 bg-slate-100 rounded w-24"></div>
                                    <div className="h-14 bg-slate-50 border border-slate-100 rounded-2xl"></div>
                                    <div className="h-5 bg-slate-100 rounded w-24"></div>
                                    <div className="h-14 bg-slate-50 border border-slate-100 rounded-2xl"></div>
                                    <div className="h-14 bg-slate-900 rounded-2xl mt-2"></div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveCredentials} className="flex flex-col gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 ml-1">Partner ID</label>
                                        <input
                                            type="text"
                                            required
                                            value={partnerId}
                                            onChange={(e) => setPartnerId(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base transition-all focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none placeholder:text-slate-400 font-medium"
                                            placeholder="Ex: 1234567"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 ml-1">Partner Key</label>
                                        <input
                                            type="password"
                                            required={!hasCredentials}
                                            value={partnerKey}
                                            onChange={(e) => setPartnerKey(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base transition-all focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none placeholder:text-slate-400 font-medium"
                                            placeholder={hasCredentials ? "••••••••••••••••••••••••" : "Cole sua secret key aqui"}
                                        />
                                        {hasCredentials && (
                                            <p className="text-xs text-orange-600 font-bold mt-2 flex items-center gap-1.5 ml-1">
                                                <span className="text-base leading-none">⚠️</span> Preencha apenas se quiser atualizar a chave existente.
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="mt-2 relative overflow-hidden group bg-slate-900 text-white font-bold h-16 rounded-2xl transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-slate-900/20"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {isSaving ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Salvando Configurações...</span>
                                                </>
                                            ) : "Salvar Configurações"}
                                        </div>
                                    </button>
                                </form>
                            )}
                        </section>

                        {/* Step 2: Connection */}
                        <section className={`bg-white p-6 sm:p-8 md:p-10 rounded-[2.5rem] border transition-all duration-700 ${hasCredentials ? 'border-orange-200 shadow-2xl shadow-orange-100/30' : 'border-slate-100 opacity-60 grayscale-[0.3]'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                                <span className={`flex items-center justify-center w-10 h-10 rounded-2xl font-bold text-sm shrink-0 shadow-lg ${hasCredentials ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-slate-100 text-slate-500'}`}>2</span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Autorização de Conta</h2>
                            </div>

                            <p className="text-slate-600 mb-10 leading-relaxed text-lg font-medium">
                                Após salvar suas credenciais, o botão abaixo será habilitado para você autorizar o aplicativo na sua conta Shopee.
                            </p>

                            {hasCredentials ? (
                                <Link
                                    href="/api/shopee/auth"
                                    className="group relative flex items-center justify-center gap-4 bg-orange-500 text-white h-20 px-8 rounded-3xl font-black text-xl transition-all hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-[0.98] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <span className="text-3xl group-hover:rotate-[15deg] transition-transform duration-300">🔗</span>
                                    <span>Conectar Conta Shopee</span>
                                </Link>
                            ) : (
                                <div className="flex items-center justify-center h-20 px-8 rounded-3xl border-[3px] border-dashed border-slate-100 text-slate-300 font-bold bg-slate-50/50 text-lg">
                                    Aguardando passo anterior...
                                </div>
                            )}
                        </section>
                    </div>

                    <footer className="mt-12 md:mt-16 pt-10 border-t border-slate-200 flex flex-col items-center gap-8 text-slate-400">
                        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm font-semibold text-slate-500">
                            <a href="#" className="hover:text-orange-600 transition-colors">Dúvidas Frequentes</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">Termos de Uso</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">Privacidade</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">API Shopee</a>
                        </div>
                        <p className="text-xs font-medium">© 2024 Shopee Auto-Share Pro • Feito para Afiliados</p>
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Carregando painel...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

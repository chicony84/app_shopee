"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const isConnected = searchParams?.shopee_connected === "true";

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-50 text-slate-900">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left w-full max-w-xl">
        <h1 className="text-4xl font-bold text-orange-600 w-full text-center sm:text-left">Shopee Auto-Share</h1>
        <p className="text-lg text-slate-600 mb-4 w-full text-center sm:text-left">
          Conecte sua loja ou conta de afiliado da Shopee para começar a programar postagens automáticas no WhatsApp e nas Redes Sociais.
        </p>

        {isConnected && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2 w-full justify-center mb-4 shadow-sm">
            <span className="text-xl">✅</span>
            <span className="font-semibold">Conta conectada com sucesso!</span>
          </div>
        )}

        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-slate-800">1. Credenciais da Shopee</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-1 text-sm">Onde encontro essas informações?</h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Acesse a <a href="https://open.shopee.com/" target="_blank" rel="noreferrer" className="underline font-medium hover:text-blue-900">Shopee Open Platform</a>.</li>
              <li>Faça login com sua conta da Shopee.</li>
              <li>Vá em <strong>Console</strong> {">"} <strong>App Management</strong>.</li>
              <li>Selecione o seu App (ou crie um novo) e copie o <strong>Partner ID</strong> e a <strong>Partner Key</strong> do aplicativo.</li>
            </ol>
          </div>

          {isLoading ? (
            <p className="text-slate-500 animate-pulse">Carregando...</p>
          ) : (
            <form onSubmit={handleSaveCredentials} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Partner ID</label>
                <input
                  type="text"
                  required
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Ex: 1234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Partner Key</label>
                <input
                  type="password"
                  required={!hasCredentials}
                  value={partnerKey}
                  onChange={(e) => setPartnerKey(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder={hasCredentials ? "**************** (Oculta)" : "Cole sua secret key aqui"}
                />
                {hasCredentials && <p className="text-xs text-orange-600 mt-1">Preencha apenas se quiser atualizar a chave existente.</p>}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Salvando..." : "Salvar Credenciais"}
              </button>
            </form>
          )}
        </div>

        <div className={`w-full bg-white p-6 rounded-xl border ${hasCredentials ? 'border-orange-200 shadow-md' : 'border-slate-200 opacity-60'} transition-all`}>
          <h2 className="text-xl font-bold mb-4 text-slate-800">2. Conexão</h2>
          <p className="text-sm text-slate-600 mb-6">
            Após salvar suas credenciais acima, clique no botão abaixo para autorizar o nosso aplicativo na sua conta da Shopee.
          </p>

          <div className="flex w-full justify-center sm:justify-start">
            {hasCredentials ? (
              <Link
                href="/api/shopee/auth"
                className="rounded-lg border border-solid border-transparent transition-all flex items-center justify-center bg-orange-500 text-white gap-2 hover:bg-orange-600 text-sm sm:text-base h-12 px-8 font-semibold w-full shadow-md"
              >
                🔗 Conectar com a Shopee
              </Link>
            ) : (
              <button
                disabled
                className="rounded-lg border border-solid border-slate-300 bg-slate-100 text-slate-400 gap-2 text-sm sm:text-base h-12 px-8 font-semibold w-full cursor-not-allowed"
              >
                🔗 Conectar com a Shopee
              </button>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

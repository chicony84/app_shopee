"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
    item_id: number;
    item_name: string;
    item_image?: string;
    original_price: number;
    discount_price?: number;
    item_url: string;
}

export default function CampaignsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await fetch("/api/shopee/campaigns?page_size=20&page_no=1");
                const data = await res.json();

                if (data.error) throw new Error(data.error);
                if (data.response?.item_list) {
                    setProducts(data.response.item_list);
                }
            } catch (err: any) {
                setError(err.message || "Falha ao carregar campanhas");
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-[family-name:var(--font-geist-sans)] selection:bg-orange-100">
            <div className="max-w-7xl mx-auto">

                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link href="/dashboard" className="text-orange-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform mb-4">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Campanhas Shopee <span className="text-orange-600">Livre</span></h1>
                        <p className="text-slate-500 font-medium mt-2">Escolha produtos das campanhas abertas para automatizar suas postagens.</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 w-full md:w-auto min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Pesquisar produto..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse">
                                <div className="bg-slate-100 h-48 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2"></div>
                                <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-[2rem] text-center">
                        <p className="font-bold text-xl mb-2">Ops! Algo deu errado.</p>
                        <p className="opacity-80">{error}</p>
                        <Link href="/dashboard" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-xl font-bold">Verificar Credenciais</Link>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-orange-50 border border-orange-200 text-orange-800 p-20 rounded-[3rem] text-center border-dashed">
                        <p className="font-black text-2xl mb-4">Nenhum produto em campanha ativa no momento.</p>
                        <p className="opacity-80 font-medium">Fique atento ao painel da Shopee para novas oportunidades.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product.item_id} className="group bg-white rounded-[2rem] p-4 border border-slate-200 transition-all hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2">
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50 border border-slate-100">
                                    {product.item_image && (
                                        <img src={product.item_image} alt={product.item_name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-orange-600 shadow-lg hover:bg-orange-600 hover:text-white transition-colors">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-slate-800 line-clamp-2 text-sm mb-3 leading-snug h-10">{product.item_name}</h3>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 line-through font-bold">R$ {product.original_price.toFixed(2)}</span>
                                        <span className="text-lg font-black text-orange-600">R$ {product.discount_price?.toFixed(2) || product.original_price.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase">Oferta</div>
                                </div>

                                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-900/10">
                                    Agendar Postagem
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { useState } from "react";

const PLANOS = [
  {
    name: "Bronze",
    price: "0",
    description: "Ideal para quem está começando agora no programa de afiliados.",
    features: [
      "Até 5 postagens por dia",
      "1 conta Shopee conectada",
      "Formatos de texto padrão",
      "Suporte via e-mail (48h)",
    ],
    buttonText: "Começar Grátis",
    highlight: false,
    color: "slate",
  },
  {
    name: "Prata",
    price: "29,90",
    description: "O plano favorito dos afiliados que já faturam comissões.",
    features: [
      "Postagens ilimitadas",
      "Até 5 contas Shopee",
      "Agendamento inteligente",
      "Personalização de mensagens",
      "Suporte prioritário via WhatsApp",
    ],
    buttonText: "Assinar Agora",
    highlight: true,
    color: "orange",
  },
  {
    name: "Ouro",
    price: "99,90",
    description: "Para agências e grandes operações de tráfego orgânico.",
    features: [
      "Contas ilimitadas",
      "Automação multicanal",
      "API de Integração",
      "Relatórios avançados",
      "Gerente de conta dedicado",
    ],
    buttonText: "Falar com Consultor",
    highlight: false,
    color: "slate",
  }
];

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-[family-name:var(--font-geist-sans)] selection:bg-orange-100">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30">
                S
              </div>
              <span className="text-2xl font-black tracking-tighter hidden sm:block">
                SHOPEE<span className="text-orange-600">SHARE</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
              <a href="#funcionalidades" className="hover:text-orange-600 transition-colors">Funcionalidades</a>
              <a href="#precos" className="hover:text-orange-600 transition-colors">Planos</a>
              <a href="#faq" className="hover:text-orange-600 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors">
                Entrar
              </Link>
              <Link href="/dashboard" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/50 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-50/50 blur-[100px] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest mb-8 border border-orange-100 animate-fade-in">
              🔥 Automação N°1 para Afiliados
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-none mb-8">
              Sua Vitrine na Shopee <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">no Piloto Automático</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              Transforme links de produtos em posts irresistíveis. Automatize o compartilhamento no WhatsApp, Facebook e Instagram sem perder tempo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-orange-500 text-white rounded-2xl text-lg font-black shadow-2xl shadow-orange-500/40 hover:bg-orange-600 transition-all hover:-translate-y-1 active:scale-95">
                Quero Automatizar Gratuitamente
              </Link>
              <a href="#como-funciona" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all active:scale-95">
                Ver Demonstração
              </a>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto items-center opacity-60 grayscale filter">
              <div className="font-black text-2xl text-slate-400">SHOPEE</div>
              <div className="font-black text-2xl text-slate-400">WHATSAPP</div>
              <div className="font-black text-2xl text-slate-400">FACEBOOK</div>
              <div className="font-black text-2xl text-slate-400">INSTAGRAM</div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precos" className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Escolha o plano ideal para <br className="hidden sm:block" /> sua jornada de afiliado</h2>
              <p className="text-lg text-slate-600 font-medium mb-10">Preços transparentes, sem letras miúdas. Cancele quando quiser.</p>

              {/* Monthly/Annual Toggle */}
              <div className="flex items-center justify-center gap-4">
                <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Mensal</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors relative"
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isAnnual ? 'translate-x-6 bg-orange-500' : 'translate-x-0'}`}></div>
                </button>
                <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Anual <span className="text-orange-600 text-[10px] ml-1 bg-orange-100 px-1.5 py-0.5 rounded-full uppercase">Economize 20%</span></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLANOS.map((plano, index) => (
                <div
                  key={index}
                  className={`relative bg-white p-8 md:p-10 rounded-[3rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col ${plano.highlight ? 'border-orange-500 ring-4 ring-orange-500/5 shadow-xl scale-105 z-10' : 'border-slate-200 shadow-lg'}`}
                >
                  {plano.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                      Mais Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-black text-slate-900 mb-2">{plano.name}</h3>
                    <p className={`text-sm font-medium leading-relaxed ${plano.highlight ? 'text-slate-600' : 'text-slate-500'}`}>
                      {plano.description}
                    </p>
                  </div>

                  <div className="mb-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">R$</span>
                      <span className="text-6xl font-black text-slate-900 tracking-tight">
                        {isAnnual ? (parseFloat(plano.price.replace(',', '.')) * 0.8).toFixed(2).replace('.', ',') : plano.price}
                      </span>
                      <span className="text-slate-400 font-bold">/mês</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {plano.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plano.highlight ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </div>
                        <span className="text-sm font-bold text-slate-700 leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/dashboard"
                    className={`w-full py-5 rounded-2xl text-center text-lg font-black transition-all active:scale-95 shadow-lg ${plano.highlight ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/20' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/10'}`}
                  >
                    {plano.buttonText}
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="text-slate-400 text-sm font-bold mb-6">PAGAMENTO 100% SEGURO VIA MERCADO PAGO / PIX</p>
              <div className="flex justify-center gap-6 opacity-40">
                <div className="w-12 h-8 bg-slate-300 rounded"></div>
                <div className="w-12 h-8 bg-slate-300 rounded"></div>
                <div className="w-12 h-8 bg-slate-300 rounded"></div>
                <div className="w-12 h-8 bg-slate-300 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-5xl md:text-7xl font-black text-orange-500 mb-2">+150k</div>
                <div className="text-lg font-bold text-slate-400 uppercase tracking-widest">Posts Automatizados</div>
              </div>
              <div>
                <div className="text-5xl md:text-7xl font-black text-orange-500 mb-2">2.5k</div>
                <div className="text-lg font-bold text-slate-400 uppercase tracking-widest">Afiliados Ativos</div>
              </div>
              <div>
                <div className="text-5xl md:text-7xl font-black text-orange-500 mb-2">R$ 1.2M</div>
                <div className="text-lg font-bold text-slate-400 uppercase tracking-widest">Em Comissões Geradas</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-8 md:p-20 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl shadow-orange-500/30">
              <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Chega de copiar e colar links manualmente.</h2>
              <p className="text-xl font-bold mb-12 opacity-90 max-w-2xl mx-auto">Comece hoje mesmo a transformar seu perfil em uma máquina de vendas automática na Shopee.</p>
              <Link href="/dashboard" className="inline-block bg-white text-orange-600 px-12 py-6 rounded-3xl font-black text-2xl shadow-xl hover:shadow-white/20 transition-all hover:scale-105 active:scale-95">
                Criar Minha Conta Grátis
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-md">S</div>
                <span className="text-xl font-black tracking-tighter">SHOPEE<span className="text-orange-600">SHARE</span></span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm mb-8">
                A plataforma de automação mais completa para afiliados Shopee no Brasil. Multiplique seus ganhos com inteligência.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-sm">Links Úteis</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Planos e Preços</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Programa de Afiliados</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-sm">Legal</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">LGPD</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-200 text-center flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold">© 2024 SHOPEE AUTO-SHARE PRO. TODOS OS DIREITOS RESERVADOS.</p>
            <p className="text-slate-400 text-[10px] font-medium max-w-md">
              Não temos vínculo oficial com a Shopee Brazil. Somos uma ferramenta independente que utiliza a API oficial para facilitar a vida do afiliado.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Email ou senha inválidos. Utilize os dados de teste.");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-[family-name:var(--font-geist-sans)]">
            <div className="w-full max-w-md bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl">
                <div className="mb-10 text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6">S</div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Entrar no Shopee Share</h1>
                    <p className="text-slate-500 font-medium">Controle sua automação de afiliados.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 ml-1 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                            placeholder="test@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 ml-1 mb-2">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                            placeholder="password123"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-black h-16 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                    >
                        Entrar Agora
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <p className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-[10px] font-bold leading-relaxed">
                        TIP: Utilize as credenciais de teste: <br />
                        Email: <strong>test@example.com</strong> <br />
                        Senha: <strong>password123</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}

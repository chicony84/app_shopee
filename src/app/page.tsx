import Image from "next/image";
import Link from "next/link";

export default function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const isConnected = searchParams?.shopee_connected === "true";

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-50 text-slate-900">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl font-bold text-orange-600">Shopee Auto-Share</h1>
        <p className="text-lg text-slate-600 max-w-lg">
          Conecte sua loja da Shopee para começar a programar postagens automáticas no WhatsApp e nas Redes Sociais.
        </p>

        {isConnected ? (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2 w-full justify-center">
            <span className="text-xl">✅</span> 
            <span className="font-semibold">Loja conectada com sucesso!</span>
          </div>
        ) : (
          <div className="flex gap-4 items-center flex-col sm:flex-row w-full justify-center sm:justify-start">
            <Link
               href="/api/shopee/auth"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-orange-500 text-white gap-2 hover:bg-orange-600 text-sm sm:text-base h-10 sm:h-12 px-8 font-semibold w-full sm:w-auto shadow-md"
            >
              Conectar com a Shopee
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

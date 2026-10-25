import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0A0E14] text-white">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#121824] border border-[#1E293B] shadow-2xl text-center space-y-6">
        <div className="size-16 mx-auto rounded-2xl bg-[#0A0E14] border border-[#1E293B] flex items-center justify-center text-2xl font-black text-[#C6F827] shadow-sm">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-white">Página no encontrada</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            La vista financiera o recurso que buscas no existe o fue movido en el hub de VOUT.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C6F827] hover:bg-white text-[#0A0E14] font-black text-xs uppercase tracking-wider hover:brightness-110 transition shadow-sm"
          >
            <span>←</span> Volver al Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

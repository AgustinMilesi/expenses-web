"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al iniciar sesión");
        return;
      }

      toast.success(`¡Bienvenido de nuevo, ${data.user.name}!`);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Ocurrió un error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0E14] relative overflow-hidden">
      <div className="vout-card w-full max-w-md p-8 bg-[#121824] border-[#1E293B] shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0E14] border border-[#1E293B] p-2 flex items-center justify-center shadow-sm mx-auto mb-3">
            <svg viewBox="68 106 416 310" className="w-full h-full" fill="none">
              <rect x="68" y="228" width="60" height="60" rx="6" fill="#E9E7E0" />
              <rect x="132" y="292" width="60" height="60" rx="6" fill="#E9E7E0" />
              <rect x="196" y="356" width="60" height="60" rx="6" fill="#E9E7E0" />
              <rect x="260" y="292" width="60" height="60" rx="6" fill="#E9E7E0" />
              <rect x="324" y="228" width="60" height="60" rx="6" fill="#C6F827" />
              <rect x="390" y="166" width="46" height="46" rx="5" fill="#C6F827" />
              <rect x="452" y="106" width="32" height="32" rx="4" fill="#C6F827" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            VOUT <span className="text-[#C6F827]">Cloud Sync</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inicia sesión para sincronizar tus finanzas entre la web y tu celular.
          </p>
        </div>

        {/* Guest Demo Access */}
        <div className="mb-6 p-4 rounded-2xl bg-[#0F1520] border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              Acceso Rápido de Evaluación
            </span>
            <span className="text-[9px] font-black bg-[#C6F827] text-[#0A0E14] px-2 py-0.5 rounded-full font-mono">
              1-CLICK DEMO
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Probá el gestor de finanzas, gastos fijos y suscripciones con datos precargados sin registrarte.
          </p>
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-[#C6F827]/40 font-bold text-xs text-center block transition cursor-pointer"
          >
            🚀 Probar Demo en Vivo (Sin Iniciar Sesión) →
          </Link>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#1E293B] w-full" />
          <span className="bg-[#121824] px-3 text-[10px] text-[#64748B] uppercase tracking-widest font-black shrink-0">
            o con tu Cuenta VOUT
          </span>
          <div className="border-t border-[#1E293B] w-full" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="vout-input text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="vout-input text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full vout-btn-primary text-sm py-2.5 mt-2"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-[#1E293B] text-center text-xs text-slate-400">
          ¿No tienes una cuenta aún?{" "}
          <Link
            href="/register"
            className="font-bold text-[#C6F827] hover:underline"
          >
            Regístrate gratis
          </Link>
        </div>
      </div>
    </div>
  );
}

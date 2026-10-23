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
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C6F827]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="vout-card w-full max-w-md p-8 bg-[#121824] border-[#1E293B] shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C6F827] to-[#10B981] flex items-center justify-center font-black text-black text-2xl shadow-[0_0_20px_rgba(198,248,39,0.35)] mx-auto mb-3">
            V
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            VOUT <span className="text-[#C6F827]">Cloud Sync</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inicia sesión para sincronizar tus finanzas entre la web y tu celular.
          </p>
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

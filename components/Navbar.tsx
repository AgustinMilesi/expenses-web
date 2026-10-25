"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NavbarProps {
  user: {
    id: string;
    email: string;
    name: string;
    membershipTier?: string;
  } | null;
  currency: string;
  onCurrencyChange: (c: string) => void;
  isSyncing: boolean;
  lastSyncTime: string | null;
  onManualSync: () => void;
}

export function Navbar({
  user,
  currency,
  onCurrencyChange,
  isSyncing,
  lastSyncTime,
  onManualSync,
}: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Sesión cerrada");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#0A0E14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#121824] border border-[#1E293B] flex items-center justify-center p-1.5 shadow-sm transition-transform group-hover:scale-105">
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
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-[#C6F827] transition-colors">
                VOUT <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#161F30] text-[#C6F827] border border-[#1E293B] ml-1">WEB</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Sync & User Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user && (
            <>
              {/* Cloud Sync Status Button */}
              <button
                onClick={onManualSync}
                disabled={isSyncing}
                title={lastSyncTime ? `Última sinc: ${new Date(lastSyncTime).toLocaleTimeString()}` : "Sincronizar con la nube"}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#121824] border border-[#1E293B] hover:border-[#C6F827]/50 text-slate-300 transition-all cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-400 animate-ping" : "bg-[#C6F827]"}`} />
                <span>{isSyncing ? "Sincronizando..." : "Sincronizado"}</span>
                {lastSyncTime && (
                  <span className="text-slate-500 hidden md:inline">
                    • {new Date(lastSyncTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </button>

              {/* Currency Selector */}
              <div className="flex items-center bg-[#121824] border border-[#1E293B] rounded-lg p-0.5">
                {["USD", "ARS", "EUR"].map((c) => (
                  <button
                    key={c}
                    onClick={() => onCurrencyChange(c)}
                    className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      currency === c
                        ? "bg-[#C6F827] text-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {c === "USD" ? "$" : c === "ARS" ? "ARS" : "€"}
                  </button>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#1E293B]">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg border border-transparent hover:border-rose-900/50 transition-colors cursor-pointer"
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="vout-btn-primary text-xs py-1.5 px-3"
              >
                Crear Cuenta
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

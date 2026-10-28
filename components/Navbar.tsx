"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePreferences } from "@/components/PreferencesProvider";
import { PreferencesControls } from "@/components/PreferencesControls";

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
    <header className="sticky top-0 z-40 w-full max-w-full border-b border-[#262626] bg-[#0c0c0c] shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
            <div className="size-8 sm:size-9 shrink-0 rounded-[6px] bg-[#000000] border border-[#262626] flex items-center justify-center p-1.5 shadow-none transition-transform group-hover:scale-105">
              <svg viewBox="68 106 416 310" className="w-full h-full" fill="none">
                <rect x="68" y="228" width="60" height="60" rx="2" fill="#E5E5E5" />
                <rect x="132" y="292" width="60" height="60" rx="2" fill="#E5E5E5" />
                <rect x="196" y="356" width="60" height="60" rx="2" fill="#E5E5E5" />
                <rect x="260" y="292" width="60" height="60" rx="2" fill="#E5E5E5" />
                <rect x="324" y="228" width="60" height="60" rx="2" fill="#c5ff4a" />
                <rect x="390" y="166" width="46" height="46" rx="2" fill="#c5ff4a" />
                <rect x="452" y="106" width="32" height="32" rx="2" fill="#c5ff4a" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-[#c5ff4a] transition-colors leading-tight truncate">
                VOUT <span className="text-[10px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-[3px] bg-[#000000] text-[#c5ff4a] border border-[#262626] ml-1">WEB</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Sync & User Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
          <PreferencesControls placement="down" />
          {user && (
            <>
              {/* Cloud Sync Status Button (min-h-[40px]) */}
              <button
                onClick={onManualSync}
                disabled={isSyncing}
                title={lastSyncTime ? `Última sinc: ${new Date(lastSyncTime).toLocaleTimeString()}` : "Sincronizar con la nube"}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-mono min-h-[40px] px-3.5 py-2 rounded-[6px] bg-[#161616] border border-[#262626] hover:border-[#383838] text-[#e5e5e5] transition-all cursor-pointer active:scale-[0.98]"
              >
                <span className={`size-2 rounded-full ${isSyncing ? "bg-amber-400 animate-ping" : "bg-[#c5ff4a]"}`} />
                <span>{isSyncing ? "Sincronizando..." : "Sincronizado"}</span>
                {lastSyncTime && (
                  <span className="text-[#737373] hidden md:inline font-mono">
                    • {new Date(lastSyncTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </button>

              {/* Currency Selector (Ergonomic 40px height) */}
              <div className="flex items-center bg-[#000000] border border-[#262626] rounded-[6px] p-0.5">
                {["USD", "ARS", "EUR"].map((c) => (
                  <button
                    key={c}
                    onClick={() => onCurrencyChange(c)}
                    className={`min-h-[36px] px-3 py-1.5 text-xs font-mono font-semibold rounded-[4px] transition-all cursor-pointer ${
                      currency === c
                        ? "bg-[#c5ff4a] text-black shadow-xs"
                        : "text-[#a3a3a3] hover:text-white"
                    }`}
                  >
                    {c === "USD" ? "$" : c === "ARS" ? "ARS" : "€"}
                  </button>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#262626]">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-sans font-medium text-white">{user.name}</span>
                  <span className="text-[10px] text-[#737373] font-mono truncate max-w-[120px]">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="min-h-[40px] px-3 py-2 text-xs font-sans font-semibold tracking-wide text-[#a3a3a3] hover:text-rose-400 hover:bg-rose-950/20 rounded-[6px] border border-[#262626] hover:border-rose-900/50 transition-all cursor-pointer active:scale-[0.98]"
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
                className="min-h-[40px] flex items-center justify-center text-xs font-sans font-medium uppercase tracking-[0.08em] px-3.5 py-2 rounded-[6px] text-[#e5e5e5] hover:text-white border border-[#262626] hover:bg-[#161616] transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="min-h-[40px] flex items-center justify-center text-xs font-sans font-semibold tracking-wider uppercase px-4 py-2 rounded-[6px] bg-[#c5ff4a] text-black shadow-[0_0_12px_rgba(197,255,74,0.3)] hover:bg-[#b8f73b] transition-all"
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

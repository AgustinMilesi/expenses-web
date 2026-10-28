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
    <header className="sticky top-0 z-40 w-full border-b border-[#252525] bg-[#060606]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-[4px] bg-[#1f1f1f] border border-[#252525] flex items-center justify-center p-1.5 shadow-none transition-transform group-hover:scale-105">
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
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-[#c5ff4a] transition-colors">
                VOUT <span className="text-[10px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-[2px] bg-[#000000] text-[#c5ff4a] border border-[#252525] ml-1">WEB</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Sync & User Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <PreferencesControls />
          {user && (
            <>
              {/* Cloud Sync Status Button */}
              <button
                onClick={onManualSync}
                disabled={isSyncing}
                title={lastSyncTime ? `Última sinc: ${new Date(lastSyncTime).toLocaleTimeString()}` : "Sincronizar con la nube"}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-[4px] bg-[#1f1f1f] border border-[#252525] hover:border-[#313131] text-[#e5e5e5] transition-colors cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-400 animate-ping" : "bg-[#c5ff4a]"}`} />
                <span>{isSyncing ? "Sincronizando..." : "Sincronizado"}</span>
                {lastSyncTime && (
                  <span className="text-[#7a7a7a] hidden md:inline">
                    • {new Date(lastSyncTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </button>

              {/* Currency Selector */}
              <div className="flex items-center bg-[#000000] border border-[#252525] rounded-[4px] p-0.5">
                {["USD", "ARS", "EUR"].map((c) => (
                  <button
                    key={c}
                    onClick={() => onCurrencyChange(c)}
                    className={`px-2 py-1 text-xs font-mono font-medium rounded-[2px] transition-colors cursor-pointer ${
                      currency === c
                        ? "bg-[#c5ff4a] text-black shadow-none"
                        : "text-[#7a7a7a] hover:text-white"
                    }`}
                  >
                    {c === "USD" ? "$" : c === "ARS" ? "ARS" : "€"}
                  </button>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#252525]">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-sans font-medium text-white">{user.name}</span>
                  <span className="text-[10px] text-[#7a7a7a] font-mono truncate max-w-[120px]">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 text-xs font-sans font-medium uppercase tracking-[0.08em] text-[#7a7a7a] hover:text-rose-400 hover:bg-rose-950/20 rounded-[4px] border border-transparent hover:border-rose-900/50 transition-colors cursor-pointer"
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
                className="text-xs font-sans font-medium uppercase tracking-[0.08em] px-3 py-1.5 rounded-[4px] text-[#e5e5e5] hover:text-white border border-[#252525] hover:bg-[#252525] transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="vout-btn-primary text-xs py-1.5 px-3 rounded-[4px]"
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

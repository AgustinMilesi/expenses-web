"use client";

import { useEffect, useState } from "react";
import { usePreferences, THEMES } from "@/components/PreferencesProvider";
import { LOCALES } from "@/lib/i18n";

export function PreferencesControls() {
  const { theme, setTheme, mode, setMode, locale, setLocale, sound, setSound, t } = usePreferences();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-muted,#94A3B8)] hover:text-[var(--primary-accent,#c6f827)] transition-all py-1.5 px-3 rounded-xl bg-[var(--bg-card,#121824)] border border-[var(--border-card,#1E293B)] shadow-xs hover:shadow-sm select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-accent,#c6f827)]"
        title="Customization & Preferences"
        aria-label="Open preferences menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Mode icon */}
        {mode === "dark" ? (
          <svg className="size-3.5 text-[var(--text-muted,#94A3B8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg className="size-3.5 text-[var(--text-muted,#94A3B8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}

        {/* Color accent dot */}
        <span
          className="size-2 rounded-full shadow-xs ring-1 ring-white/20"
          style={{ backgroundColor: THEMES.find((x) => x.id === theme)?.hex }}
        />

        {/* Language code label */}
        <span className="font-mono font-bold text-[11px] text-[var(--text-main,#FFFFFF)]">{locale.toUpperCase()}</span>

        {/* Chevron down */}
        <svg
          className={`size-3 text-[var(--text-muted,#94A3B8)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-label="Preferences panel"
            className="absolute right-0 top-full mt-2 w-64 p-4 rounded-3xl bg-[var(--bg-card,#121824)] border border-[var(--border-card,#1E293B)] shadow-2xl z-50 space-y-4 text-left"
          >
            {/* Mode */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#94A3B8)] font-bold mb-2">
                {t.mode}
              </p>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[var(--bg-card-subtle,#0F1520)] border border-[var(--border-card,#1E293B)]">
                <button
                  type="button"
                  onClick={() => setMode("light")}
                  className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === "light"
                      ? "bg-[var(--primary-accent,#c6f827)] text-[var(--primary-accent-text,#0A0E14)] shadow-xs"
                      : "text-[var(--text-muted,#94A3B8)] hover:text-[var(--text-main,#FFFFFF)]"
                  }`}
                >
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>{t.lightMode}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("dark")}
                  className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === "dark"
                      ? "bg-[var(--primary-accent,#c6f827)] text-[var(--primary-accent-text,#0A0E14)] shadow-xs"
                      : "text-[var(--text-muted,#94A3B8)] hover:text-[var(--text-main,#FFFFFF)]"
                  }`}
                >
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  <span>{t.darkMode}</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#94A3B8)] font-bold mb-2">
                {t.accentColor}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                      theme === th.id
                        ? "border-[var(--primary-accent,#c6f827)] bg-[var(--primary-accent,#c6f827)]/10 text-[var(--text-main,#FFFFFF)]"
                        : "border-[var(--border-card,#1E293B)] hover:border-slate-600 text-[var(--text-muted,#94A3B8)]"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full shrink-0 shadow-xs ring-1 ring-white/10"
                      style={{ backgroundColor: th.hex }}
                    />
                    <span className="truncate">{th.name.replace(/Cyber |Electric |Neon |Forest /g, "")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#94A3B8)] font-bold mb-2">
                {t.language}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setLocale(loc.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                      locale === loc.id
                        ? "border-[var(--primary-accent,#c6f827)] bg-[var(--primary-accent,#c6f827)]/10 text-[var(--text-main,#FFFFFF)]"
                        : "border-[var(--border-card,#1E293B)] hover:border-slate-600 text-[var(--text-muted,#94A3B8)]"
                    }`}
                  >
                    <span className="text-base leading-none">{loc.flag}</span>
                    <span className="truncate">{loc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tactile Sound Feedback Toggle */}
            <div className="border-t border-[var(--border-card,#1E293B)] pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#94A3B8)] font-bold">
                  {t.soundLabel || "Sonido Táctil"}
                </p>
                <span className="text-[10px] font-mono text-[var(--primary-accent,#c6f827)] font-bold">
                  {sound ? (t.soundOn || "ON") : (t.soundOff || "OFF")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[var(--bg-card-subtle,#0F1520)] border border-[var(--border-card,#1E293B)]">
                <button
                  type="button"
                  onClick={() => setSound(true)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sound
                      ? "bg-[var(--primary-accent,#c6f827)] text-[var(--primary-accent-text,#0A0E14)] shadow-xs"
                      : "text-[var(--text-muted,#94A3B8)] hover:text-[var(--text-main,#FFFFFF)]"
                  }`}
                >
                  <span>🔊</span>
                  <span>{t.soundOn || "Activado"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSound(false)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    !sound
                      ? "bg-[var(--primary-accent,#c6f827)] text-[var(--primary-accent-text,#0A0E14)] shadow-xs"
                      : "text-[var(--text-muted,#94A3B8)] hover:text-[var(--text-main,#FFFFFF)]"
                  }`}
                >
                  <span>🔇</span>
                  <span>{t.soundOff || "Silenciado"}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale, TranslationDict } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

export type Theme = "lime" | "mint" | "emerald" | "jade";
export type Mode = "light" | "dark";

export const THEMES: { id: Theme; name: string; colorClass: string; hex: string }[] = [
  { id: "lime", name: "Cyber Lime", colorClass: "bg-[#c6f827]", hex: "#c6f827" },
  { id: "mint", name: "Electric Mint", colorClass: "bg-[#00ff88]", hex: "#00ff88" },
  { id: "emerald", name: "Neon Emerald", colorClass: "bg-[#10b981]", hex: "#10b981" },
  { id: "jade", name: "Forest Jade", colorClass: "bg-[#059669]", hex: "#059669" },
];

type PreferencesContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TranslationDict;
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");
  const [theme, setThemeState] = useState<Theme>("lime");
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("pocket-mode") as Mode | null;
      if (savedMode === "light" || savedMode === "dark") setModeState(savedMode);
      const savedTheme = localStorage.getItem("pocket-theme") as Theme | null;
      if (savedTheme && THEMES.some((t) => t.id === savedTheme)) setThemeState(savedTheme);
      const savedLocale = localStorage.getItem("pocket-locale") as Locale | null;
      if (savedLocale && (["en", "es", "pt", "zh"] as const).includes(savedLocale)) setLocaleState(savedLocale);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-mode", mode);
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [mode]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    try {
      localStorage.setItem("pocket-mode", newMode);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-mode", newMode);
      if (newMode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("pocket-theme", newTheme);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("pocket-locale", newLocale);
    } catch {}
  };

  const t = translations[locale] || translations.es;

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        setTheme,
        mode,
        setMode,
        locale,
        setLocale,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}

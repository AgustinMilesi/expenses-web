export type Locale = "es" | "en" | "pt" | "zh";

export const LOCALES: { id: Locale; label: string; flag: string }[] = [
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "en", label: "English", flag: "🇺🇸" },
  { id: "pt", label: "Português", flag: "🇧🇷" },
  { id: "zh", label: "中文", flag: "🇨🇳" },
];

export const translations = {
  es: {
    mode: "Aspecto",
    darkMode: "Oscuro",
    lightMode: "Claro",
    accentColor: "Color de Acento",
    language: "Idioma",
    syncCloud: "Sincronizado",
    syncing: "Sincronizando...",
    lastSync: "Última sinc",
    login: "Iniciar Sesión",
    register: "Crear Cuenta",
    logout: "Salir",
    sessionClosed: "Sesión cerrada",
  },
  en: {
    mode: "Appearance",
    darkMode: "Dark",
    lightMode: "Light",
    accentColor: "Accent Color",
    language: "Language",
    syncCloud: "Cloud Synced",
    syncing: "Syncing...",
    lastSync: "Last sync",
    login: "Log In",
    register: "Create Account",
    logout: "Log Out",
    sessionClosed: "Logged out",
  },
  pt: {
    mode: "Aparência",
    darkMode: "Escuro",
    lightMode: "Claro",
    accentColor: "Cor de Destaque",
    language: "Idioma",
    syncCloud: "Sincronizado",
    syncing: "Sincronizando...",
    lastSync: "Última sinc",
    login: "Iniciar Sessão",
    register: "Criar Conta",
    logout: "Sair",
    sessionClosed: "Sessão encerrada",
  },
  zh: {
    mode: "外观",
    darkMode: "深色",
    lightMode: "浅色",
    accentColor: "主题强调色",
    language: "语言",
    syncCloud: "已云同步",
    syncing: "同步中...",
    lastSync: "上次同步",
    login: "登录",
    register: "注册账户",
    logout: "退出",
    sessionClosed: "已退出登录",
  },
};

export type TranslationDict = Record<keyof typeof translations.es, string>;

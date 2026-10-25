import type { Metadata } from "next";
import { Toaster } from "sonner";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vout-web.vercel.app"),
  title: "VOUT Web · Personal Finance & Bi-Directional Cloud Hub",
  description:
    "Official cloud hub and web interface for VOUT. Disposable income gauge, recurring subscription audits, micro-expenses, and bi-directional cloud synchronization.",
  applicationName: "VOUT",
  keywords: [
    "VOUT",
    "Personal Finance",
    "Presupuesto Mensual",
    "Control de Gastos",
    "Suscripciones",
    "Cloud Sync",
    "Agustín Milesi",
  ],
  authors: [{ name: "Agustín Milesi", url: "https://github.com/AgustinMilesi" }],
  creator: "Agustín Milesi",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "VOUT Web · Personal Finance & Cloud Sync Hub",
    description:
      "Real-time expense tracking, disposable income gauge, and bi-directional sync across web and mobile.",
    url: "https://vout-web.vercel.app",
    siteName: "VOUT Web",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VOUT Web · Personal Finance & Cloud Sync Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VOUT Web · Personal Finance & Cloud Sync Hub",
    description: "Real-time expense tracking, disposable income gauge, and bi-directional sync.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "VOUT Web & Mobile",
  operatingSystem: "Web, Android",
  applicationCategory: "FinanceApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Agustín Milesi",
    url: "https://github.com/AgustinMilesi",
  },
  description:
    "Personal finance and micro-spending tracker with bi-directional Neon PostgreSQL sync and offline-first mobile app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="lime">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0A0E14] text-white min-h-screen selection:bg-[#C6F827] selection:text-black">
        <PreferencesProvider>
          {children}
        </PreferencesProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#121824",
              border: "1px solid #1E293B",
              color: "#ffffff",
            },
          }}
        />
      </body>
    </html>
  );
}

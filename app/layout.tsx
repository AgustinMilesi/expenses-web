import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOUT • Web Expense & Cloud Sync Hub",
  description: "Web companion for VOUT Flagship Mobile Budget & Subscription Tracker. Real-time cloud sync.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="lime">
      <body className="bg-[#0A0E14] text-white min-h-screen selection:bg-[#C6F827] selection:text-black">
        {children}
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

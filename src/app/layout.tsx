import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NASA Space Challenge | Autonomous Bio-Telemetry & Triage",
  description:
    "Autonomous Deep Space Medical Triage Platform for Artemis & Mars exploration missions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#050B14] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}

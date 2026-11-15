import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mins-Health — by Mins Solutions TI | NASA Space Apps Challenge 2026",
  description:
    "Mins-Health: Autonomous Bio-Telemetry & Triage Platform for Deep Space Missions. Solution for NASA Space Apps Challenge 2026: Create Health Monitoring Software for Astronauts on Space Missions.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-space-950 text-slate-100 antialiased selection:bg-accent-cyan selection:text-black">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalcare — Voice-First Maternal & Newborn Health Navigator",
  description: "A voice-first maternal and newborn health triage system for rural Ethiopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-teal-100 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}

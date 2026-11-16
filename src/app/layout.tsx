import type { Metadata } from "next";
import { Plus_Jakarta_Sans as plusJakartaSans } from "next/font/google";
import { JetBrains_Mono as jetBrainsMono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import "./globals.css";

const plusJakartaSansFont = plusJakartaSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMonoFont = jetBrainsMono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arafath GEC — Développeur Junior Web & Mobile",
  description:
    "Développeur junior opérationnel et rigoureux basé à Parakou, Bénin. Je transforme vos idées en applications web & mobiles modernes, rapides et prêtes pour le marché. Spécialisé en React/Next.js, TypeScript, Node.js et intégration Mobile Money (KKiaPay/FedaPay).",
  keywords: [
    "développeur junior",
    "Parakou",
    "Bénin",
    "Next.js",
    "TypeScript",
    "Mobile Money",
    "KKiaPay",
    "FedaPay",
    "portfolio développeur",
  ],
  openGraph: {
    title: "Arafath GEC — Portfolio Développeur Junior",
    description:
      "Développeur junior opérationnel et rigoureux basé à Parakou, Bénin. Applications web & mobiles modernes, rapides et prêtes pour le marché.",
    locale: "fr_BJ",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${plusJakartaSansFont.variable} ${jetBrainsMonoFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1 relative z-0">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

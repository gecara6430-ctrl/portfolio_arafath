"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const sections = [
  { href: "#accueil", label: "Accueil", path: "accueil" },
  { href: "#projets", label: "Projets & Réalisations", path: "projets" },
  { href: "#competences", label: "Compétences & Stack", path: "competences" },
  { href: "#methodologie", label: "Méthodologie", path: "methodologie" },
  { href: "#temoignages", label: "Témoignages", path: "temoignages" },
  { href: "#contact", label: "Contact", path: "contact" },
];

const PROFILE_IMG = "/IMG-20261116-WA0000.jpg";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full ${
        scrolled
          ? "bg-surface-container-lowest/90 backdrop-blur-md"
          : "bg-surface-container-lowest/80 backdrop-blur-xl"
      } shadow-[0_1px_8px_rgba(0,0,0,0.04)]`}
    >
      <div className="h-20 max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md shrink-0">
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight leading-none">
              Arafath GEC
            </span>
            <span className="font-code-sm text-code-sm text-primary tracking-normal leading-none mt-1">
              Dev Junior Pro
            </span>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold tracking-wider">
            Disponible pour missions
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-space-xs">
          {sections.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className={`px-space-sm py-1.5 transition-colors rounded-lg ${
                i === 0
                  ? "bg-surface-container-high text-primary font-semibold"
                  : "font-label-md text-label-md text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-space-sm shrink-0">
          <a
            href="/cv.pdf"
            download
            className="hidden sm:inline-flex items-center justify-center px-space-sm py-2 rounded-lg font-label-md text-label-md bg-surface-container-high text-on-surface hover:bg-surface-variant hover:text-on-surface transition-colors"
          >
            CV (PDF)
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-space-md py-2 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary transition-colors"
          >
            Me contacter
          </a>
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover shrink-0 ml-1"
            src={PROFILE_IMG}
          />
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactError, setContactError] = useState("");
  const [projectFilter, setProjectFilter] = useState<"all" | "web" | "fintech">("all");

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setContactStatus("sending");
    setContactError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          type: data.get("type"),
          message: data.get("message"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Erreur inconnue");
      setContactStatus("sent");
      form.reset();
    } catch (error) {
      setContactStatus("error");
      setContactError(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  useEffect(() => {
    const calcButtons = document.querySelectorAll<HTMLElement>('#calc-project-types .calc-btn');
    const addonMomo = document.getElementById('addon-momo') as HTMLInputElement | null;
    const addonSpeed = document.getElementById('addon-speed') as HTMLInputElement | null;
    const displayCFA = document.getElementById('display-cfa');
    const displayEUR = document.getElementById('display-eur');
    const displayDelay = document.getElementById('display-delay');
    const waButton = document.getElementById('btn-quote-whatsapp') as HTMLAnchorElement | null;

    let baseCFA = 150000;
    let baseEUR = 230;
    let baseDelay = "1 à 2 semaines";
    let projectLabel = "Site Vitrine";

    function updateEstimates() {
      let totalCFA = baseCFA;
      let totalEUR = baseEUR;

      if (addonMomo?.checked) totalCFA += parseInt(addonMomo.dataset.addCfa || "0", 10);
      if (addonSpeed?.checked) totalCFA += parseInt(addonSpeed.dataset.addCfa || "0", 10);
      if (addonMomo?.checked) totalEUR += parseInt(addonMomo.dataset.addEur || "0", 10);
      if (addonSpeed?.checked) totalEUR += parseInt(addonSpeed.dataset.addEur || "0", 10);

      if (displayCFA) displayCFA.textContent = totalCFA.toLocaleString("fr-FR");
      if (displayEUR) displayEUR.textContent = `(soit ~${totalEUR} EUR)`;
      if (displayDelay) displayDelay.textContent = (addonSpeed?.checked ? "Moins de 7 jours (Express)" : baseDelay);

      if (waButton) {
        const text = encodeURIComponent(`Bonjour Arafath GEC, je suis intéressé par votre prestation : ${projectLabel} (Estimation : ~${totalCFA.toLocaleString("fr-FR")} FCFA). Pouvons-nous en parler ?`);
        waButton.href = `https://wa.me/2290141161985?text=${text}`;
      }
    }

    calcButtons.forEach((btn) => {
      btn.classList.remove("bg-primary/20", "text-on-surface");
      btn.classList.add("bg-surface-container-high", "text-on-surface-variant");
    });
    const first = calcButtons[0];
    if (first) {
      first.classList.remove("bg-surface-container-high", "text-on-surface-variant");
      first.classList.add("bg-primary/20", "text-on-surface");
    }

    calcButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        calcButtons.forEach((b) => {
          b.classList.remove("bg-primary/20", "text-on-surface");
          b.classList.add("bg-surface-container-high", "text-on-surface-variant");
        });
        btn.classList.remove("bg-surface-container-high", "text-on-surface-variant");
        btn.classList.add("bg-primary/20", "text-on-surface");
        baseCFA = parseInt(btn.dataset.priceCfa || "0", 10);
        baseEUR = parseInt(btn.dataset.priceEur || "0", 10);
        baseDelay = btn.dataset.delay || "1 à 2 semaines";
        projectLabel = btn.querySelector("span.font-bold")?.textContent || "Site Vitrine";
        updateEstimates();
      });
    });

    if (addonMomo) addonMomo.addEventListener("change", updateEstimates);
    if (addonSpeed) addonSpeed.addEventListener("change", updateEstimates);

    updateEstimates();

    return () => {
      calcButtons.forEach((btn) => btn.removeEventListener("click", () => {}));
      if (addonMomo) addonMomo.removeEventListener("change", updateEstimates);
      if (addonSpeed) addonSpeed.removeEventListener("change", updateEstimates);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-surface min-h-[calc(100vh-5rem)]">
      <nav className="hidden lg:flex items-center gap-space-xs pt-space-xs pb-space-sm px-margin" />
      <main className="w-full pt-20">
        <section className="relative w-full overflow-hidden py-space-xl lg:py-space-2xl" id="accueil">
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-high w-fit shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Développeur Junior Opérationnel &amp; Rigoureux • Parakou, Bénin
                  </span>
                </div>
                <h1 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface font-extrabold tracking-tight">
                  Je transforme vos idées en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">applications web &amp; mobiles</span> modernes, rapides et prêtes pour le marché.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Spécialisé en React/Next.js, TypeScript, Node.js &amp; intégration Mobile Money (KKiaPay/FedaPay). Code propre, approche produit et solutions adaptées au contexte réel béninois et international.
                </p>
                <div className="flex flex-wrap items-center gap-space-sm pt-space-sm">
                  <Link
                    href="#projets"
                    className="inline-flex items-center gap-space-xs px-space-md py-3 rounded-lg font-label-md text-label-md bg-primary text-on-primary font-bold shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all group"
                  >
                    <span>Explorer mes projets</span>
                    <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                  <a
                    href="/cv.pdf"
                    download
                    className="inline-flex items-center gap-space-xs px-space-md py-3 rounded-lg font-label-md text-label-md bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">download</span>
                    <span>Télécharger mon CV (PDF)</span>
                  </a>
                  <a
                    href="https://wa.me/2290141161985"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-space-xs px-space-md py-3 rounded-lg font-label-md text-label-md bg-secondary text-on-secondary font-bold hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp Direct</span>
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-lg">
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                    <span className="font-headline-md text-headline-md font-bold text-primary">3+</span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">Projets en production</span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                    <span className="font-headline-md text-headline-md font-bold text-secondary">100%</span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">Mobile-first testé</span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                    <span className="font-headline-md text-headline-md font-bold text-tertiary">&gt;95</span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">Lighthouse Score</span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                    <span className="font-headline-md text-headline-md font-bold text-primary-fixed">MoMo</span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">MTN &amp; Moov Ready</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-xl bg-surface-container p-space-md shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between pb-space-sm mb-space-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-error"></span>
                      <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                      <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    </div>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">developer_profile.tsx</span>
                    <span className="material-symbols-outlined text-sm text-outline">verified</span>
                  </div>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-high mb-space-md">
                    <img
                      alt="Arafath GEC - Développeur Junior Web &amp; Mobile à Parakou"
                      className="w-full h-full object-cover"
                      src="/IMG-20261116-WA0000.jpg"
                    />
                    <div className="absolute bottom-3 left-3 right-3 p-space-sm rounded-lg bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-base">terminal</span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface font-bold">Arafath GEC</span>
                          <span className="font-code-sm text-code-sm text-secondary">Ready to deploy &amp; ship</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded font-code-sm text-code-sm bg-primary/20 text-primary">v2.4_prod</span>
                    </div>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest font-code-sm text-code-sm flex flex-col gap-1 text-on-surface-variant">
                    <p><span className="text-primary">const</span> <span className="text-tertiary">stack</span> = [<span className="text-secondary">&apos;Next.js&apos;</span>, <span className="text-secondary">&apos;TypeScript&apos;</span>, <span className="text-secondary">&apos;Node.js&apos;</span>];</p>
                    <p><span className="text-primary">const</span> <span className="text-tertiary">paymentGateways</span> = [<span className="text-secondary">&apos;KKiaPay&apos;</span>, <span className="text-secondary">&apos;FedaPay&apos;</span>];</p>
                    <div className="flex items-center justify-between text-secondary pt-1">
                      <span>{"// Local optimization & zero bloat"}</span>
                      <span className="material-symbols-outlined text-xs">done_all</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full bg-surface-container-low py-space-md overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
            <div className="flex items-center justify-between gap-space-lg overflow-x-auto py-1">
              <span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider shrink-0">Technologies Maîtrisées :</span>
              <div className="flex items-center gap-space-md shrink-0">
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-primary">Next.js 14</span>
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-secondary">TypeScript</span>
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-on-surface">Tailwind CSS</span>
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-tertiary">Node.js / Express</span>
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-primary-fixed">Python FastAPI</span>
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-on-surface">PostgreSQL / Supabase</span>
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-secondary">KKiaPay / FedaPay</span>
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-outline">Docker</span>
                <span className="px-3 py-1 rounded bg-surface-container-high font-code-sm text-code-sm text-tertiary">Git &amp; CI/CD</span>
              </div>
            </div>
          </div>
        </div>

        <section className="w-full py-space-2xl bg-surface" id="differenciateur">
          <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
            <div className="flex flex-col gap-space-xs max-w-2xl mb-space-xl">
              <div className="flex items-center gap-space-xs text-primary font-code-sm text-code-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>Différenciateur Développeur Junior Pro</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-bold text-on-surface">
                Pourquoi me confier vos développements ?
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Pas de code théorique ou de maquettes orphelines. Une approche rigoureuse orientée résultat, taillée pour répondre aux réalités techniques et économiques.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all shadow-md group">
                <div className="flex flex-col gap-space-md">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">phonelink_setup</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    Contexte Local &amp; International
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Optimisation poussée du poids des pages (bundle size &lt; 150KB) pour des temps de chargement ultra-rapides même sur connexions mobiles 3G/4G variables. Maîtrise des passerelles Mobile Money (MTN MoMo, Moov Flooz).
                  </p>
                </div>
                <div className="pt-space-md flex items-center gap-2 text-primary font-code-sm text-code-sm">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span>Économie de bande passante native</span>
                </div>
              </div>
              <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all shadow-md group">
                <div className="flex flex-col gap-space-md">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">code_blocks</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    Rigueur d&apos;Ingénierie &amp; Clean Code
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Typage statique strict TypeScript, composants modulaires réutilisables, validation de données avec Zod, et architectures RESTful documentées. Le code que je livre est facilement maintenable par d&apos;autres ingénieurs.
                  </p>
                </div>
                <div className="pt-space-md flex items-center gap-2 text-secondary font-code-sm text-code-sm">
                  <span className="material-symbols-outlined text-sm">fact_check</span>
                  <span>Zéro dette technique non maîtrisée</span>
                </div>
              </div>
              <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all shadow-md group">
                <div className="flex flex-col gap-space-md">
                  <div className="w-12 h-12 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">speed</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    Agilité &amp; Sens du Produit
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Écoute active, cycles de livraison courts et visibilité totale sur l&apos;avancement du projet (dépôt GitHub, démos déployées en continu, communication quotidienne transparente via Slack ou WhatsApp).
                  </p>
                </div>
                <div className="pt-space-md flex items-center gap-2 text-tertiary font-code-sm text-code-sm">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>Délais respectés &amp; feedback continu</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-space-2xl bg-surface-container-lowest" id="projets">
          <div className="max-w-[1280px] mx-auto px-space-lg lg:px-margin">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
              <div className="flex flex-col gap-space-xs max-w-xl">
                <span className="font-code-sm text-code-sm text-secondary uppercase tracking-wider">Réalisations Réelles &amp; Déployées</span>
                <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-bold text-on-surface">Projets Phares en Vitrine</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Études de cas conçues selon les standards du marché : architectures modernes, logique métier solide et intégrations concrètes.</p>
              </div>
              <div className="flex flex-wrap items-center gap-space-xs" id="project-filters">
              <button
                type="button"
                onClick={() => setProjectFilter("all")}
                className={`px-space-sm py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${projectFilter === "all" ? "bg-primary text-on-primary font-semibold" : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"}`}
              >
                Tous les projets (3)
              </button>
              <button
                type="button"
                onClick={() => setProjectFilter("web")}
                className={`px-space-sm py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${projectFilter === "web" ? "bg-primary text-on-primary font-semibold" : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"}`}
              >
                Web &amp; SaaS
              </button>
              <button
                type="button"
                onClick={() => setProjectFilter("fintech")}
                className={`px-space-sm py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${projectFilter === "fintech" ? "bg-primary text-on-primary font-semibold" : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"}`}
              >
                Fintech / Mobile Money
              </button>
            </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              {(projectFilter === "all" || projectFilter === "web") && (
              <div className="lg:col-span-12 rounded-xl bg-surface-container p-space-md lg:p-space-lg flex flex-col lg:flex-row gap-space-lg shadow-xl overflow-hidden">
                <div className="w-full lg:w-1/2 flex flex-col justify-between rounded-lg bg-surface-container-high p-space-md overflow-hidden relative">
                  <div className="flex items-center justify-between pb-space-sm mb-space-sm">
                    <span className="font-code-sm text-code-sm text-primary">COMMUNAUTÉ TECH • BÉNIN</span>
                    <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-code-sm text-code-sm">Production Live</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest rounded-lg p-space-md shadow-inner flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary">groups</span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">Annuaire TalentHub</span>
                      </div>
                      <span className="font-code-sm text-code-sm text-secondary">240+ Inscrits</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 rounded bg-surface-container flex items-center justify-between text-body-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          <span className="font-semibold text-on-surface">Amina D.</span>
                          <span className="text-outline text-xs">• React / Node</span>
                        </div>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Cotonou</span>
                      </div>
                      <div className="p-2 rounded bg-surface-container flex items-center justify-between text-body-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          <span className="font-semibold text-on-surface">Fabrice K.</span>
                          <span className="text-outline text-xs">• Python / AI</span>
                        </div>
                        <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded">Porto-Novo</span>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">Recherches / semaine</span>
                      <svg className="w-24 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
                        <path d="M0,18 Q20,2 40,14 T80,4 L100,10"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-space-xs pt-space-md">
                    <span className="px-2 py-1 rounded bg-surface font-code-sm text-code-sm text-primary">Next.js 14 (App Router)</span>
                    <span className="px-2 py-1 rounded bg-surface font-code-sm text-code-sm text-on-surface">TypeScript</span>
                    <span className="px-2 py-1 rounded bg-surface font-code-sm text-code-sm text-secondary">PostgreSQL / Supabase</span>
                    <span className="px-2 py-1 rounded bg-surface font-code-sm text-code-sm text-on-surface">Tailwind</span>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-between">
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
                      <span>01. Showcase Inspiré de La Guilde Bénin</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                      TalentHub Bénin — Plateforme des Développeurs &amp; Créateurs
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Plateforme collaborative et annuaire vérifié de talents tech béninois. Résout le manque de visibilité des profils locaux face aux recruteurs internationaux et aux entreprises locales.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                      <div className="p-space-sm rounded-lg bg-surface-container-low">
                        <span className="font-label-sm text-label-sm text-primary font-bold uppercase">Problématique Résolue</span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Recherche fastidieuse de profils techniques fiables à Cotonou et dans la sous-région.</p>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-low">
                        <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Impact Clé</span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Filtres multicritères instantanés, chargement sous 1.1s sur connexion 3G.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm pt-space-md">
                    <a className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors" href="https://github.com" rel="noopener noreferrer" target="_blank">
                      <span className="material-symbols-outlined text-base">code</span>
                      <span>Code Source GitHub</span>
                    </a>
                    <a className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-fixed-dim transition-colors" href="#">
                      <span>Voir la Démo Live</span>
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
              )}
              {(projectFilter === "all" || projectFilter === "fintech") && (
              <div className="lg:col-span-6 rounded-xl bg-surface-container p-space-md lg:p-space-lg flex flex-col justify-between shadow-xl">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-code-sm text-code-sm text-secondary">02. MODULE FINTECH B2B</span>
                    <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-code-sm text-code-sm">API Validée</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    AfroPay Connect — Passerelle Mobile Money
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Module e-commerce complet avec intégration des passerelles KKiaPay &amp; FedaPay. Prise en charge transparente de MTN Mobile Money et Moov Money avec gestion robuste des webhooks asynchrones et résilience aux coupures réseau.
                  </p>
                  <div className="rounded-lg bg-surface-container-lowest p-space-sm font-code-sm text-code-sm overflow-x-auto text-on-surface-variant">
                    <div className="text-on-surface-variant pb-1 flex items-center justify-between">
                      <span>~/services/momo-webhook.ts</span>
                      <span className="text-secondary text-xs">200 OK</span>
                    </div>
                    <p className="text-tertiary">app.post(<span className="text-on-surface">&apos;/api/webhooks/kkia-pay&apos;</span>, async (req, res) =&gt; {"{"}</p>
                    <p className="pl-4 text-outline">{"const"} {"{ transactionId, status, amount } = req.body;"}</p>
                    <p className="pl-4 text-primary">if (verifyHmacSignature(req)) {"{"}</p>
                    <p className="pl-8 text-secondary">await updateOrderStatus(transactionId, &apos;PAID&apos;);</p>
                    <p className="pl-4">{"}"}</p>
                    <p className="text-tertiary">{"});"}</p>
                  </div>
                  <ul className="space-y-1.5 pt-space-xs text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                      <span>Webhooks cryptés HMAC avec réessais automatiques</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                      <span>Génération instantanée de reçus transactionnels PDF</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-space-md">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm text-secondary">KKiaPay</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm text-primary">Node.js</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm text-tertiary">PostgreSQL</span>
                  </div>
                  <a className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors" href="#">
                    <span>Tester le flux</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
              )}
              {(projectFilter === "all" || projectFilter === "web") && (
              <div className="lg:col-span-6 rounded-xl bg-surface-container p-space-md lg:p-space-lg flex flex-col justify-between shadow-xl">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-code-sm text-code-sm text-tertiary">03. SAAS ANALYTICS POUR PME</span>
                    <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-code-sm text-code-sm">MVP Prêt</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    DevMetrics — Dashboard &amp; Monitoring d&apos;Activité
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Tableau de bord haute performance conçu pour les entrepreneurs et équipes techniques locales. Affiche le trafic, les conversions de vente et l&apos;état des serveurs en temps réel sans latence.
                  </p>
                  <div className="rounded-lg bg-surface-container-lowest p-space-md flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="font-code-sm text-code-sm text-on-surface font-semibold">Taux de conversion commandes</span>
                      <span className="text-secondary font-bold font-code-sm text-code-sm">+18.4% ce mois</span>
                    </div>
                    <svg className="w-full h-24 pt-2 text-primary" fill="none" viewBox="0 0 240 70">
                      <rect fill="#1c2028" height="35" rx="3" width="18" x="10" y="35"></rect>
                      <rect fill="#06b6d4" height="25" opacity="0.6" rx="3" width="18" x="10" y="45"></rect>
                      <rect fill="#1c2028" height="50" rx="3" width="18" x="45" y="20"></rect>
                      <rect fill="#06b6d4" height="40" opacity="0.7" rx="3" width="18" x="45" y="30"></rect>
                      <rect fill="#1c2028" height="60" rx="3" width="18" x="80" y="10"></rect>
                      <rect fill="#06b6d4" height="52" opacity="0.8" rx="3" width="18" x="80" y="18"></rect>
                      <rect fill="#1c2028" height="45" rx="3" width="18" x="115" y="25"></rect>
                      <rect fill="#06b6d4" height="35" opacity="0.75" rx="3" width="18" x="115" y="35"></rect>
                      <rect fill="#1c2028" height="65" rx="3" width="18" x="150" y="5"></rect>
                      <rect fill="#4edea3" height="58" rx="3" width="18" x="150" y="12"></rect>
                      <rect fill="#1c2028" height="55" rx="3" width="18" x="185" y="15"></rect>
                      <rect fill="#ffb95f" height="48" rx="3" width="18" x="185" y="22"></rect>
                    </svg>
                    <div className="flex justify-between text-outline text-[11px] font-code-sm">
                      <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 pt-space-xs text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">security</span>
                      <span>Authentification sécurisée JWT + Rôles utilisateurs (RBAC)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">speed</span>
                      <span>Mise en cache Redis pour requêtes analytiques sous 15ms</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-space-md">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm text-primary">React 18</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm text-on-surface">Express API</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm text-secondary">Tailwind CSS</span>
                  </div>
                  <a className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors" href="#">
                    <span>Voir le Dashboard</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-space-2xl bg-surface" id="competences">
          <div className="max-w-[1280px] mx-auto px-space-lg lg:px-margin">
            <div className="text-center max-w-xl mx-auto mb-space-xl flex flex-col gap-space-xs">
              <span className="font-code-sm text-code-sm text-primary uppercase tracking-wider">Arsenal Technique &amp; Compétences</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-bold text-on-surface">Stack Technique Polyglotte</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Des compétences concrètes et testées pour délivrer des applications pérennes, de la conception UI jusqu&apos;à l&apos;API.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Frontend &amp; Mobile Web</h3>
                <ul className="space-y-space-sm">
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">TypeScript</span> <span className="text-label-sm text-on-surface-variant">Typage strict</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">React &amp; Next.js 14</span> <span className="text-label-sm text-on-surface-variant">Server Components</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Tailwind CSS &amp; UI</span> <span className="text-label-sm text-on-surface-variant">Design responsive</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Accessibilité &amp; Mobile-First</span> <span className="text-label-sm text-on-surface-variant">Lighthouse 95+</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Backend &amp; Données</h3>
                <ul className="space-y-space-sm">
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Node.js / Express</span> <span className="text-label-sm text-on-surface-variant">APIs RESTful</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Python FastAPI</span> <span className="text-label-sm text-on-surface-variant">Microservices</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">PostgreSQL / Supabase</span> <span className="text-label-sm text-on-surface-variant">Modélisation relationnelle</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Passerelles Mobile Money</span> <span className="text-label-sm text-on-surface-variant">KKiaPay &amp; FedaPay</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Outils &amp; Bonnes Pratiques</h3>
                <ul className="space-y-space-sm">
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Git &amp; GitHub Workflow</span> <span className="text-label-sm text-on-surface-variant">Pull requests, code review</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Docker (Conteneurs)</span> <span className="text-label-sm text-on-surface-variant">Environnements reproductibles</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Tests Unitaires &amp; Postman</span> <span className="text-label-sm text-on-surface-variant">Jest basiques</span></li>
                  <li className="flex items-baseline gap-space-xs"><span className="text-label-sm text-primary">Méthode Agile / Scrum</span> <span className="text-label-sm text-on-surface-variant">Sprints hebdomadaires</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-space-2xl bg-surface-container-lowest" id="methodologie">
          <div className="max-w-[1280px] mx-auto px-space-lg lg:px-margin">
            <div className="flex flex-col gap-space-xs max-w-2xl mb-space-xl">
              <span className="font-code-sm text-code-sm text-secondary uppercase tracking-wider">Processus Professionnel Garanti</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-bold text-on-surface">Une méthode claire pour zéro mauvaise surprise</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Inspiré de la feuille de route méthodique des meilleures équipes : vous suivez chaque étape en toute transparence.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              <div className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant">
                <div className="text-label-sm text-primary mb-space-sm">Semaine 1 : Spécifications</div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">01 / ANALYSE</h3>
                <p className="text-body-sm text-on-surface-variant">Cadrage &amp; Cahier des charges — Clarification des besoins métier, formalisation des fonctionnalités clés et choix des stacks les plus rentables et véloces.</p>
              </div>
              <div className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant">
                <div className="text-label-sm text-primary mb-space-sm">Semaine 2 : Squelette &amp; UI</div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">02 / ARCHITECTURE</h3>
                <p className="text-body-sm text-on-surface-variant">Prototypage &amp; Modélisation — Définition du modèle relationnel de données (PostgreSQL), structure des composants et maquettage des flux utilisateurs.</p>
              </div>
              <div className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant">
                <div className="text-label-sm text-primary mb-space-sm">Semaine 3 : Backend &amp; Tests</div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">03 / FABRICATION</h3>
                <p className="text-body-sm text-on-surface-variant">Dév Itératif &amp; Intégration — Développement sprint par sprint, connexion des APIs de paiement (KKiaPay/FedaPay), tests automatisés et revues continues.</p>
              </div>
              <div className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant">
                <div className="text-label-sm text-primary mb-space-sm">Semaine 4 : Lancement clé en main</div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">04 / LIVRAISON</h3>
                <p className="text-body-sm text-on-surface-variant">Mise en Prod &amp; Suivi — Déploiement avec HTTPS sécurisé, audit Lighthouse &gt; 95, documentation README soignée et transfert de compétences.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-space-2xl bg-surface" id="devis">
          <div className="max-w-[1280px] mx-auto px-space-lg lg:px-margin">
            <div className="flex flex-col gap-space-xs mb-space-lg">
              <span className="font-code-sm text-code-sm text-primary uppercase tracking-wider">Outil Interactif &amp; Transparent</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-bold text-on-surface">Estimez le coût et le délai de votre projet</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Sélectionnez le type d&apos;application pour obtenir une estimation indicative basée sur les tarifs de marché béninois et sous-régionaux.</p>
            </div>
            <div className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
                <div>
                  <p className="text-label-md text-on-surface mb-space-sm uppercase">1. Nature de votre projet :</p>
                  <div className="space-y-space-sm" id="calc-project-types">
                    <button className="calc-btn w-full py-space-sm px-space-md rounded-lg text-left bg-primary/20 text-on-surface border border-primary/30 transition-colors" data-price-cfa="150000" data-price-eur="230" data-delay="1 à 2 semaines">
                      <span className="font-bold">Site Vitrine / Portfolio Pro</span><br />
                      <span className="text-code-sm text-on-surface-variant">Next.js, SEO, 100% Mobile</span>
                    </button>
                    <button className="calc-btn w-full py-space-sm px-space-md rounded-lg text-left bg-surface-container-high text-on-surface-variant border border-transparent transition-colors" data-price-cfa="350000" data-price-eur="530" data-delay="3 à 4 semaines">
                      <span className="font-bold">App Web / SaaS MVP</span><br />
                      <span className="text-code-sm text-on-surface-variant">React, Node, Authentification, Base</span>
                    </button>
                    <button className="calc-btn w-full py-space-sm px-space-md rounded-lg text-left bg-surface-container-high text-on-surface-variant border border-transparent transition-colors" data-price-cfa="450000" data-price-eur="680" data-delay="4 à 6 semaines">
                      <span className="font-bold">Intégration Mobile Money</span><br />
                      <span className="text-code-sm text-on-surface-variant">KKiaPay, FedaPay, Webhooks sécurisés</span>
                    </button>
                    <button className="calc-btn w-full py-space-sm px-space-md rounded-lg text-left bg-surface-container-high text-on-surface-variant border border-transparent transition-colors" data-price-cfa="250000" data-price-eur="380" data-delay="2 à 3 semaines">
                      <span className="font-bold">API REST sur mesure</span><br />
                      <span className="text-code-sm text-on-surface-variant">Node.js ou FastAPI + BDD Postgres</span>
                    </button>
                  </div>
                  <p className="text-label-md text-on-surface mt-space-lg mb-space-sm uppercase">2. Options complémentaires :</p>
                  <div className="space-y-space-sm">
                    <label className="flex items-center gap-space-sm cursor-pointer text-body-sm text-on-surface-variant select-none">
                      <input type="checkbox" id="addon-momo" data-add-cfa="50000" data-add-eur="75" className="accent-primary" /> <span>Passerelle MTN/Moov ajoutée</span>
                    </label>
                    <label className="flex items-center gap-space-sm cursor-pointer text-body-sm text-on-surface-variant select-none">
                      <input type="checkbox" id="addon-speed" data-add-cfa="100000" data-add-eur="150" className="accent-primary" /> <span>Livraison express (&lt; 7 jours)</span>
                    </label>
                  </div>
                </div>
                <div className="bg-surface-container p-space-lg rounded-xl">
                  <p className="text-label-md text-primary mb-space-sm uppercase">BUDGET INDICATIF HT :</p>
                  <div className="text-headline-xl text-headline-xl-mobile lg:text-headline-xl font-extrabold text-on-surface mb-space-sm tnum" id="display-cfa">150 000</div>
                  <div className="text-body-sm text-on-surface-variant mb-space-lg" id="display-eur">(soit ~230 EUR)</div>
                  <p className="text-label-md text-primary mb-space-sm uppercase">Délai estimé de livraison :</p>
                  <div className="text-headline-lg font-bold text-on-surface mb-space-sm" id="display-delay">1 à 2 semaines</div>
                  <div className="pt-space-sm border-t border-outline-variant">
                    <ul className="space-y-space-xs text-body-sm text-on-surface-variant">
                      <li>✓ Code source complet transféré sur GitHub</li>
                      <li>✓ Support &amp; ajustements offerts 30 jours</li>
                    </ul>
                  </div>
                  <a href="https://wa.me/2290141161985" className="mt-space-sm w-full bg-primary text-on-primary py-space-md rounded-full font-label-md tracking-wider uppercase text-center hover:bg-primary-fixed-dim transition-colors block" id="btn-quote-whatsapp">Valider cette estimation sur WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-space-2xl bg-surface-container-low" id="contact">
          <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary/10 w-fit">
                  <span className="material-symbols-outlined text-sm text-secondary">handshake</span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase">Prêt à collaborer</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-bold text-on-surface">
                  Vous avez un projet ou une opportunité à pourvoir ?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Disponible immédiatement pour des missions en freelance, des contrats de sous-traitance ou un poste en CDI Remote / Hybride à Parakou. Réponse garantie sous 24h ouvrées.
                </p>
                <div className="space-y-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-sm text-body-md">
                    <div className="p-2 rounded bg-surface-container text-primary">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </div>
                    <a href="mailto:gecara6430@gmail.com" className="font-code-sm text-code-sm text-on-surface hover:text-primary transition-colors">gecara6430@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-space-sm text-body-md">
                    <div className="p-2 rounded bg-surface-container text-secondary">
                      <span className="material-symbols-outlined text-lg">call</span>
                    </div>
                    <a href="tel:+2290141161985" className="font-code-sm text-code-sm text-on-surface hover:text-secondary transition-colors">+229 01 41 16 19 85 (Appel &amp; WhatsApp)</a>
                  </div>
                  <div className="flex items-center gap-space-sm text-body-md">
                    <div className="p-2 rounded bg-surface-container text-tertiary">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                    </div>
                    <span className="font-code-sm text-code-sm text-on-surface">Créneau 15 min gratuit pour échanger</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 rounded-xl bg-surface-container p-space-lg shadow-xl">
                <form className="flex flex-col gap-space-md" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="contact-name">VOTRE NOM • SOCIÉTÉ</label>
                      <input id="contact-name" name="name" type="text" required maxLength={200} className="p-3 rounded-lg bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" placeholder="Ex: Jean Paul • Startup Bénin" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="contact-email">ADRESSE EMAIL</label>
                      <input id="contact-email" name="email" type="email" required className="p-3 rounded-lg bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" placeholder="jean@exemple.com" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="contact-type">TYPE DE PROJET OU RECRUTEMENT</label>
                    <select id="contact-type" name="type" className="p-3 rounded-lg bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner">
                      <option value="freelance">Mission Freelance (Application web / mobile)</option>
                      <option value="recrutement">Offre d&apos;emploi / CDI Développeur Junior</option>
                      <option value="momo">Intégration Paiement KKiaPay / FedaPay</option>
                      <option value="autre">Autre opportunité ou conseil technique</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="contact-message">VOTRE MESSAGE / BESOIN CLÉ</label>
                    <textarea id="contact-message" name="message" required maxLength={5000} rows={4} className="p-3 rounded-lg bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner resize-none" placeholder="Décrivez brièvement votre projet ou votre offre..."></textarea>
                  </div>
                  <div className="flex items-center justify-between pt-space-xs">
                    <span className="font-code-sm text-code-sm text-outline">Données confidentielles et non partagées</span>
                    <button type="submit" disabled={contactStatus === "sending"} className="inline-flex items-center gap-2 px-space-lg py-3 rounded-lg font-label-md text-label-md bg-primary text-on-primary font-bold hover:bg-primary-fixed-dim transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                      <span>{contactStatus === "sending" ? "Envoi en cours..." : "Envoyer le message"}</span>
                      <span className="material-symbols-outlined text-base">send</span>
                    </button>
                  </div>
                  {contactStatus === "sent" && (
                    <p role="status" className="font-code-sm text-code-sm text-secondary text-right">Message envoyé — réponse sous 24h ouvrées.</p>
                  )}
                  {contactStatus === "error" && (
                    <p role="alert" className="font-code-sm text-code-sm text-error text-right">Échec : {contactError}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full bg-surface-container-lowest py-space-2xl">
          <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Arafath GEC</span>
                  <span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container-high text-secondary">Junior Full-Stack</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">Ingénieur logiciel Web &amp; Mobile spécialisé dans les architectures Next.js, Node.js, Python et les passerelles Mobile Money (MTN MoMo, Moov Flooz) pour l&apos;écosystème béninois et international.</p>
                <div className="flex items-center gap-space-xs text-on-surface-variant mt-1">
                  <span className="material-symbols-outlined text-sm text-tertiary">location_on</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">Parakou, République du Bénin • UTC+1</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm">
                <a href="https://github.com" rel="noopener noreferrer" target="_blank" className="flex items-center gap-1.5 px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-base text-primary">terminal</span>
                  <span>GitHub</span>
                </a>
                <a href="https://linkedin.com" rel="noopener noreferrer" target="_blank" className="flex items-center gap-1.5 px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-base text-primary">hub</span>
                  <span>LinkedIn</span>
                </a>
                <a href="https://twitter.com" rel="noopener noreferrer" target="_blank" className="flex items-center gap-1.5 px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-base text-primary">share</span>
                  <span>Twitter / X</span>
                </a>
                <a href="https://wa.me/2290141161985" rel="noopener noreferrer" target="_blank" className="flex items-center gap-1.5 px-space-sm py-2 rounded-lg bg-surface-container-low text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-base text-secondary">chat</span>
                  <span>WhatsApp Pro</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg text-on-surface-variant">
              <span className="font-code-sm text-code-sm">© 2026 Arafath GEC. Tous droits réservés. Parakou, Bénin.</span>
              <div className="flex items-center gap-space-md">
                <span className="font-code-sm text-code-sm text-outline">Disponibilité : Contrats Freelance &amp; CDI Remote</span>
                <a href="#" className="font-code-sm text-code-sm text-on-surface-variant hover:text-on-surface transition-colors">Mentions Légales</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

# Portfolio Koffi S.

Site vitrine du développeur junior **Koffi S.** (Cotonou, Bénin), construit fidèlement à partir de la maquette Google Stitch « Portfolio Développeur Junior Roadmap ».

- **Stack** : Next.js 16.4.6 (App Router) · React 19 · Tailwind CSS 4 · TypeScript
- **Build** : webpack (`--webpack`) — Turbopack n'est pas supporté sur la machine de développement
- **Email** : Nodemailer (SMTP) via `POST /api/contact`

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner SMTP_* pour activer l'envoi d'email
npm run dev                  # http://localhost:3000
```

Sans variables SMTP, le site fonctionne intégralement mais le formulaire de contact répond `503 Service d'envoi non configuré` (aucun envoi silencieux).

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run start` | serveur de production |
| `npm run lint` | ESLint |

## Variables d'environnement

Voir [.env.example](.env.example) — `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO`.

## Déploiement Vercel

1. Pousser le dépôt sur GitHub.
2. Importer le projet dans Vercel (détection automatique Next.js, `vercel.json` fourni).
3. Dans **Settings → Environment Variables**, renseigner `SMTP_*` et `CONTACT_TO` (environnement *Production*).
4. Déployer. La route `POST /api/contact` fonctionne nativement sur Vercel (fonction serveur).

## Remplacer le CV

`public/cv.pdf` est un placeholder minimal : le remplacer par le vrai CV (même nom) suffit — le lien « Télécharger mon CV (PDF) » pointe déjà vers `/cv.pdf`.

/**
 * Chaîne CSS Tailwind v4 en mode webpack.
 *
 * next.config.ts ne configure la loader `@tailwindcss/turbopack` que pour
 * Turbopack ; comme le build tourne avec `--webpack` sur cette machine,
 * sans ce fichier `@import "tailwindcss"` n'est jamais traité et aucune
 * utilité Tailwind n'est générée.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

# Valor Immo — V4

Refonte UI/UX/Web Design de **Valor Immo**, agence parisienne d'immobilier commercial.
Inspiration forme **Jade Kine** appliquée à la palette Valor Immo (vert sapin + or +
crème). Conserve l'intégralité du contenu fonctionnel de la V3.

> **V4 = proposition alternative au client**. La V3 reste intacte dans
> `~/Immobilier/valor-immo-v3/` (port 3000). Cette V4 tourne en parallèle sur
> **port 3001** pour comparaison côte à côte.

## Stack

- **Next.js 16** (App Router, React 19)
- **TypeScript** strict
- **Tailwind v4** + design tokens custom (palette `--color-fir-dark / gold / cream / ink`)
- **Framer Motion v12** (reveal stagger, page transitions, parallax léger)
- **MapLibre GL** (carte ARGUS + carte contact)
- **react-hook-form + Zod** (validation formulaires)
- **Resend** (envoi emails contact/callback, stub si pas de clé)
- **Anton + Inter + Fraunces + JetBrains Mono** (`next/font/google`)

## Quickstart

```bash
pnpm install
cp .env.example .env.local   # éditer si besoin (sinon les APIs renvoient stub OK)
pnpm dev                      # http://localhost:3001
```

Autres scripts :
- `pnpm typecheck` — vérification TypeScript
- `pnpm lint`
- `pnpm build` puis `pnpm start` — production

## Structure des routes

| Route | Description |
|---|---|
| `/` | Home — 8 sections (hero vidéo, quotes, catégories outline XXL, méthode outline XXL, réassurance, ARGUS, opportunités, CTA outline XXL) |
| `/vente` | Hub vente |
| `/location` | Hub location |
| `/estimations` | Hub estimations + ARGUS |
| `/classes-d-actifs` | Index 6 classes d'actifs |
| `/classes-d-actifs/locaux-commerciaux` | Boutiques pied d'immeuble |
| `/classes-d-actifs/bureaux` | Plateaux tertiaires |
| `/classes-d-actifs/hotellerie-restauration` | Hôtels, restaurants, brasseries |
| `/classes-d-actifs/immeubles` | Monopropriétés, immeubles mixtes |
| `/classes-d-actifs/entrepots-logistique` | Logistique urbaine |
| `/classes-d-actifs/cession-droit-au-bail` | Cession bail/fonds CHR |
| `/opportunites` | Catalogue 8 biens fictifs |
| `/opportunites/[slug]` | Fiche bien |
| `/signatures` | 6 signatures anonymisées |
| `/actualites` | Index 3 articles |
| `/actualites/[slug]` | Article |
| `/l-agence` | Équipe + Hoguet |
| `/contact` | Form + carte MapLibre + coordonnées |
| `/mentions-legales` | Légal |
| `/politique-de-confidentialite` | RGPD |
| `/gestion-des-cookies` | Cookies |
| `/sitemap.xml` | Sitemap dynamique |
| `/robots.txt` | Robots |
| `POST /api/contact` | Envoi email Resend (form contact) |
| `POST /api/callback` | Demande de rappel |

## Design system

### Palette

| Token | Hex | Usage |
|---|---|---|
| `fir-dark` | `#0F3D2E` | Vert sapin Valor Immo — fonds dominants sombres |
| `fir-darker` | `#0A2D22` | Très foncé — contraste max sections outline |
| `gold` | `#C9A961` | Or principal — accents, CTA, outline |
| `gold-warm` | `#B8893E` | Or chaud — hover |
| `gold-deep` | `#7A571E` | Or profond — texte sur cream (a11y AA) |
| `cream` | `#F5F2EC` | Fond cream principal |
| `cream-soft` | `#FAF8F3` | Cream très clair |
| `ink` | `#0A0E1A` | Texte sombre |
| `slate-muted` | `#5B6573` | Texte secondaire |

### Typo

| Variable CSS | Police | Usage |
|---|---|---|
| `--font-anton` | Anton | Display XXL (H1, H2, outline) |
| `--font-inter` | Inter | Body text |
| `--font-fraunces` | Fraunces | Accent éditorial occasionnel |
| `--font-jetbrains` | JetBrains Mono | Chiffres tabulaires ARGUS |

### Effet outline (limité à 3 sections home)

- Catégories — `text-stroke fir-dark` sur fond cream
- Méthode — `text-stroke gold` sur fond fir-dark
- CTA footer — `text-stroke white` sur fond fir-darker

## Variables d'env

Voir `.env.example`. Les routes `/api/contact` et `/api/callback` renvoient
`{ok:true, stub:true}` si `RESEND_API_KEY` est absente (utile en dev).

## Différences vs V3

| Aspect | V3 | V4 |
|---|---|---|
| Typo display | Bricolage Grotesque | **Anton** (condensed black) |
| Fond dominant | Cream + vert pâle | **Vert sapin** alterné cream / blanc |
| H2 | Solid fill | **Outline XXL** sur 3 sections home |
| Cards | Hover lift doré | Cards photo grandes 4:5 avec eyebrow |
| Hero | Photo Paris haussmannien | **Vidéo / poster boutique Paris** + overlay vert sapin |
| Quotes | Carrousel serif italique | **Anton blanc XL** + guillemets or géants |
| Méthode | Cards stack | **24h/48h/1 outline gold sur vert** |
| Curseur custom | Présent | Supprimé (V4 plus sobre) |
| Pages | 22 | 22 (parité) |

## Restant à faire

Voir [`CONTENT_TODO.md`](./CONTENT_TODO.md) pour la liste complète des contenus
fictifs à remplacer avant mise en ligne publique.

Améliorations possibles (Phase 11+ polish) :
- Vidéo hero Pexels (actuellement poster image uniquement)
- Cookie banner consentement (si analytics activés)
- Vrais portraits équipe + vraies photos biens
- Validation Lighthouse 95+ sur toutes les pages (typecheck OK ; audit perf à faire)
- Tests axe-core a11y

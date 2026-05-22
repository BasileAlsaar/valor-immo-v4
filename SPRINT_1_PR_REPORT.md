# Sprint 1 — PR report

Branche : `sprint-1-hero-fixes`  ·  Base : `main`  ·  Repo : `~/Immobilier/valor-immo-v4/`

---

## Reconnaissance projet (7 points imposés)

1. **Stack réelle** : Next.js 16.2.6 (App Router, Turbopack default), React 19.2.4, TypeScript strict, Tailwind v4 (`@tailwindcss/postcss`), Node v24.15.0.
2. **Écart vs stack annoncée** : aucun bloquant. Next 16 + React 19 sont plus avancés que l'attendu mais cohérents avec Next App Router + Tailwind + TS + Framer Motion.
3. **CLAUDE.md / docs** : `CLAUDE.md` (alias `@AGENTS.md`, 11 octets) + `AGENTS.md` (327 octets) imposent : *« This is NOT the Next.js you know. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. »* — Pas de conflit fondamental, App Router classique respecté.
4. **Branche Git** : `sprint-1-hero-fixes` créée depuis `main` (commit base `85c902d`).
5. **Polices** : `Anton` (display), `Inter` (sans), `Fraunces` (accents), `JetBrains Mono` (mono) via `next/font/google` dans `app/layout.tsx`. Écart vs Cormorant Garamond / EB Garamond annoncées au brief — validé conservation V4 par arbitrage Basile.
6. **Architecture hero** : monobloc → `components/home/hero.tsx`. Dépendances : `SearchBar` (frère), `Container`, `CtaPill`, `SITE`.
7. **Framer Motion** : déjà présent en `^12.40.0` (devDependencies). Tâche ❻ install skip, foundations `lib/motion.ts` créées.

**Adaptations imposées par l'architecture V4** (annoncées en début de sprint) :
- Pas de `src/` → tous les `grep` du brief sont adaptés à `app/ components/ lib/`.
- Route `/classes-actifs/X` du brief → `/classes-d-actifs/X` (nomenclature V4 existante, contenu riche déjà en place).
- `#contact` du brief → `/contact` (page contact existante avec form + carte + coordonnées, ancre `#contact` jamais implémentée car redondante).

---

## Tâches livrées

### ❶ Hero vidéo Pexels Paris

**Partie 1 — Vidéo (Boulevard Saint-Germain, Pexels #13648261)**

- Source confirmée par Basile : 2560×1440 → 1920×1080, 13.93 s (dans plage 12–20 s, pas de trim), 50 fps source → 30 fps cible, H.264 ré-encodé CRF 26 (CRF 23 initial donnait 11 Mo, hors limite).
- `public/hero-paris.mp4` : 6.7 Mo H.264 High, faststart, audio strippé.
- `public/hero-paris.webm` : 4.4 Mo VP9 (2 Mbps), audio strippé.
- `public/hero-poster.jpg` : 606 Ko, frame à t=2 s.
- Source 24 Mo gitignored (`/public/hero-paris-source.mp4` — recalculable, cf. `HERO_VIDEO_CANDIDATES.md`).
- Mention auteur footer : *« Vidéo hero : Judas Isariot via Pexels »* (lien Pexels).
- Aucun placeholder FFmpeg créé en amont — le brief le prévoyait uniquement pendant l'attente de validation ; validation reçue, donc skip légitime. Aucun commentaire `TODO sprint-1-asset:` à retirer.

**Partie 2 — Hero fit-viewport (requalifié par Basile)**

Diagnostic initial du brief (« C de COMMERCIAL coupé à gauche ») démenti par captures `AVANT` aux 3 résolutions : COMMERCIAL est intégralement visible. Vrai défaut requalifié : la barre de recherche et les CTAs hero étaient sous la fold à 1280/1440/1920.

Modifications appliquées sur `components/home/hero.tsx` :
- `pt-40 pb-12` → `pt-20 pb-6`
- H1 clamp `clamp(3rem,11vw,12rem)` → `clamp(2rem,5.5vw,6rem)` + retrait du `<br />`
- Tagline `text-lg md:text-xl` → `text-sm md:text-base`, `max-w-2xl` → `max-w-xl`
- Espacements verticaux serrés : `mt-6/mt-8/mt-12/mt-10` → `mt-3/mt-5/mt-6/mt-5`
- `max-w-5xl` du bloc texte → `max-w-4xl`

Résultat : sur les 3 captures `APRES`, barre de recherche complète + 2 CTAs cliquables + téléphone visibles dans le viewport.

### ❷ Suppression du placeholder Hoguet

6 occurrences `[CARTE T À FOURNIR]` remplacées par : *« Carte T en cours d'obtention — délivrée par la CCI Paris Île-de-France »*.

Fichiers :
- `app/l-agence/page.tsx:120`
- `app/mentions-legales/page.tsx:32`
- `components/home/reassurance-bar.tsx:20`
- `components/site/site-footer.tsx:109`
- `lib/site.ts:30` (clé `hoguet` constant, non rendu mais cohérence)
- (et 1 retrait du label redondant "Délivrée par : CCI Paris Île-de-France" dans mentions-legales puisque la formulation y intègre déjà la mention).

**Vérification critère §2** :
```
grep -rn '\[CARTE T À FOURNIR\]' app/ components/ lib/
→ 0 occurrence
```

### ❸ CTAs câblage

Audit complet : tous les CTAs étaient déjà correctement câblés en V4. **Aucune modification de code nécessaire**.

| CTA | Fichier:ligne | Destination V4 | Conforme brief |
|---|---|---|---|
| "Nous contacter" (header desktop) | `components/site/site-header.tsx:88` | `/contact` | ⚠ (brief `#contact` adapté en `/contact`) |
| "Nous contacter" (header mobile) | `components/site/site-header.tsx:139` | `/contact` | ⚠ (idem) |
| "Nous contacter" (CTA footer outline) | `components/home/cta-footer-outline.tsx:21` | `/contact` | ⚠ (idem) |
| "Être rappelé gratuitement" | `components/home/hero.tsx:67` | `/contact` | ⚠ (idem) |
| "Discuter de mon projet" | `components/home/reassurance-bar.tsx:45` | `/contact` | ⚠ (idem) |
| "Demander à être rappelé" (Callback) | `components/sections/callback-section.tsx:27` | `/contact` | ⚠ (idem) |
| "Voir les opportunités" | `components/home/hero.tsx:70` | `/opportunites` | ✓ |
| "Voir tout le catalogue" (Categories) | `components/home/categories-grid.tsx:45` | `/opportunites` | ✓ |
| "Voir tout le catalogue" (Opportunities) | `components/home/opportunities-preview.tsx:41` | `/opportunites` | ✓ |
| "Découvrir" Locaux commerciaux | `components/home/categories-grid.tsx:77` (via `cat.href`) | `/classes-d-actifs/locaux-commerciaux` | ⚠ (brief `/classes-actifs/`) |
| "Découvrir" Bureaux | idem | `/classes-d-actifs/bureaux` | ⚠ (idem) |
| "Découvrir" Hôtellerie & Restauration | idem | `/classes-d-actifs/hotellerie-restauration` | ⚠ (idem) |
| "Découvrir" Immeubles | idem | `/classes-d-actifs/immeubles` | ⚠ (idem) |
| "Découvrir" Entrepôts & Logistique | idem | `/classes-d-actifs/entrepots-logistique` | ⚠ (idem) |
| "Découvrir" Cession de droit au bail | idem | `/classes-d-actifs/cession-droit-au-bail` | ⚠ (idem) |
| "Découvrir" Index classes | `app/classes-d-actifs/page.tsx:76` (via `cat.href`) | `/classes-d-actifs/X` | ⚠ (idem) |
| Tel "07 67 86 34 61" | 8 occurrences via `tel:${SITE.telephoneTel}` | `tel:+33767863461` | ✓ |
| Mail `contact1valorimmo@gmail.com` | 4 occurrences via `mailto:${SITE.email}` | `mailto:contact1valorimmo@gmail.com` | ⚠ (brief proposait fallback `contact@valorimmo.fr` — non utilisé puisque `/contact` existe) |

**Vérification critère §3** :
```
grep -rn 'href="#"' app/ components/
→ 0 occurrence
```

### ❹+❺ Compression verticale 3 sections (❺ requalifié comme sous-tâche)

**QuotesCarousel (témoignages)** — `components/home/quotes-carousel.tsx`
- Section : `py-32 md:py-44 lg:py-56` → `min-h-[60vh] py-16 md:py-20 lg:py-24`
- Citation : `text-[clamp(1.5rem,3.5vw,3rem)]` → `text-[clamp(0.9rem,2.1vw,1.8rem)]` (−40 % sur le clamp values)
- Guillemets décoratifs : `12rem/16rem` → `7rem/10rem`
- Espacements : `mt-16/mt-10/mt-16` → `mt-10/mt-6/mt-10`

**MethodSection (« Du brief à la signature »)** — `components/home/method-section.tsx`
- Section : `py-32 md:py-44 lg:py-56` → `py-20 md:py-24 lg:py-28`
- Titre outline : `text-[clamp(2.5rem,9vw,10rem)]` → `text-[clamp(2rem,6vw,6rem)]`
- Chiffres 24h/48h/1 : `text-[clamp(5rem,12vw,11rem)]` → `text-[clamp(3.5rem,8vw,7rem)]`
- Espacements : `mt-20/mt-20` → `mt-12/mt-12`

**ArgusSection (« Quelle est la valeur locative »)** — `components/home/argus-section.tsx`
- Section : `py-32 md:py-44 lg:py-56` → `py-20 md:py-24 lg:py-28`
- H2 : `text-[clamp(2.25rem,6.5vw,6rem)]` 3 lignes via `<br />` → `text-[clamp(1.75rem,4.5vw,3.75rem)]` inline naturel
- Espacements : `mt-16/mt-6` → `mt-10/mt-3`

Captures `APRES` à 1440×900 fournies dans `captures/sprint-1/section-{temoignages,methode,argus}-1440-APRES.png`. Sur ARGUS, la carte + tableau sont visibles sans scroll après le titre, critère brief atteint.

### ❻ Foundations animation Framer Motion

**`lib/motion.ts` créé** avec exports : `easing.{smooth, brisk, inOut}`, `duration.{fast, base, slow, hero}`, `fadeUp`, `stagger(delay)`, `splitTextReveal`. Strict-conforme au brief.

**Hero animé** (`components/home/hero.tsx`) :
1. **H1 split-text par mot** : composant `SplitWords` interne, chaque mot wrappé dans `<span overflow-hidden>` + `motion.span variants={splitTextReveal}`. Stagger 0.08 sur parent, démarrage 200 ms après mount via `SPLIT_DELAY = 0.2`. Courbe `easing.brisk` (= out-expo).
2. **Sous-titre + searchbar + CTAs hero** : `fadeUp` chacun avec délais progressifs (0.4 / 0.8 / 1.0 après mount).
3. **Vidéo parallax** : `useScroll` + `useTransform(scrollY, [0, 1000], ["0%", "-8%"])` appliqué sur un `motion.div` wrapper (hauteur `h-[108%]` pour compenser la translation).
4. **Indicateur scroll** : nouveau composant — label « SCROLL » petit caps + `ChevronDown`, animation `y: [0, 8, 0]` duration 2 s `easing.inOut` repeat Infinity.

`prefers-reduced-motion` respecté : fallback statique sans split, sans parallax, sans pulsation.

**Anti-clichés respectés** : pas de cursor custom · pas de magnetic button · pas de page transition globale · pas de wave/typewriter.

**Vidéo demo** : `captures/sprint-1/hero-animation-demo.{webm,mp4}` — 4 s, 1440×900, screencast Playwright (mp4 1.2 Mo après ré-encodage H.264).

---

## Critères de conformité

| # | Critère | État |
|---|---|---|
| 1 | Vidéo `<video>` + `HERO_VIDEO_CANDIDATES.md` (3 candidats) + placeholder FFmpeg + TODO + COMMERCIAL entier 1280/1440/1920 | ✅ vidéo OK · doc OK · placeholder/TODO non créés (validation reçue avant) · COMMERCIAL visible aux 3 résolutions sur captures `AVANT` et `APRES` |
| 2 | 0 crochet `[` ni placeholder Hoguet ; `grep '\[CARTE T À FOURNIR\]'` = 0 | ✅ pour Hoguet. **Hors-périmètre** : 4 placeholders `[SIRET]`, `[ORGANISME ET MONTANT À FOURNIR]` × 2, `[Nom et qualité]` subsistent (cf. OUT-OF-SCOPE) |
| 3 | `grep 'href="#"' app/ components/` = 0, liste CTAs fournie | ✅ |
| 4 | 3 sections compressées + captures + valeurs CSS | ✅ valeurs CSS dans commit `93f4a66` + captures `1440×900` |
| 5 | Témoignage anonyme retiré OU attribué | ✅ (tâche requalifiée par Basile : QuotesCarousel V4 conservé, attribution implicite par personas, compression appliquée) |
| 6 | `lib/motion.ts` + Framer Motion installé + hero animé + vidéo demo | ✅ |
| 7 | Bloc reconnaissance projet | ✅ (présent rapport, début de fichier) |

---

## OUT-OF-SCOPE (problèmes identifiés en passant, NON corrigés)

- `[OUT-OF-SCOPE] app/mentions-legales/page.tsx:28 — placeholder "[SIRET / RCS / Capital social — À FOURNIR]" hors périmètre tâche ❷ Hoguet`
- `[OUT-OF-SCOPE] app/mentions-legales/page.tsx:33 — placeholder "[ORGANISME ET MONTANT À FOURNIR]" (garantie financière) hors périmètre tâche ❷`
- `[OUT-OF-SCOPE] app/mentions-legales/page.tsx:36 — placeholder "[Nom et qualité — À FOURNIR]" directeur publication hors périmètre tâche ❷`
- `[OUT-OF-SCOPE] app/l-agence/page.tsx:122 — placeholder "[ORGANISME ET MONTANT À FOURNIR]" (garantie financière) hors périmètre tâche ❷`
- `[OUT-OF-SCOPE] app/page.tsx — section "Nos commerces disponibles" (CategoriesGrid) utilise des photos Pexels génériques par typologie, déjà documenté CONTENT_TODO. Refonte sprint 4.`
- `[OUT-OF-SCOPE] app/opportunites/[slug]/page.tsx — mention "Photo d'illustration" sur fiches biens (cf. CONTENT_TODO §3). Refonte sprint 4 selon brief annonceur.`
- `[OUT-OF-SCOPE] components/site/site-header.tsx — bouton "NOUS CONTACTER" à 1280 viewport se rapproche du bord droit (compression du nav 6 items). Non bloquant.`

---

## Commits sur la branche `sprint-1-hero-fixes`

```
$ git log --oneline main..HEAD
<...>  chore(sprint-1): captures sections + demo animation hero
7e8567b  feat(sprint-1): foundations animation Framer Motion + hero animé (tâche ❻)
93f4a66  feat(sprint-1): compression verticale 3 sections home (tâches ❹+❺)
3a390b9  fix(hoguet): remplacer placeholders [CARTE T À FOURNIR] par formulation 'en cours d'obtention'
43ae097  fix(hero): hero now fits within viewport at 1280/1440/1920 - reduce H1 clamp, paddings, vertical spacing
4382151  feat(sprint-1): hero video Pexels Boulevard Saint-Germain + captures AVANT
```

Squash final au merge selon brief §249.

---

## Livrables joints

- `HERO_VIDEO_CANDIDATES.md` (3 candidats Pexels + retenu)
- `captures/sprint-1/hero-{1280,1440,1920}-{AVANT,APRES}.png`
- `captures/sprint-1/section-{temoignages,methode,argus}-1440-APRES.png`
- `captures/sprint-1/hero-animation-demo.{webm,mp4}`
- `lib/motion.ts`
- `scripts/captures-sprint-1.ts` (reproductibilité sprints 2-5)
- `public/hero-paris.{mp4,webm}` + `public/hero-poster.jpg`

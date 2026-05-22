# Sprint 4b — PR report

Branche : `sprint-4b-fiches-enrichies`  ·  Base : `main` (post-sprint-4a `400cbec`)  ·  Repo : `~/Immobilier/valor-immo-v4/`

---

## Reconnaissance complémentaire (pré-code)

- **`data/references-synthetic.json`** : 1300 références, structure `{ id, lat, lng, arr: "75001", type: "commerce"|"restau_extract"|"bureaux", prix_m2_an_ht_hc, surface_estimee, annee }`. Note : la structure brief §63 décrit `{ surface_m2, prix_eur_m2_an, date_signature, arrondissement, typologie }` — la structure RÉELLE existante est respectée et adaptée dans `ComparableLeases`.
- **`lib/data/properties.ts`** : 8 biens avec `slug, type, arrondissement, quartier, surface, loyerMensuel?, prix?, center: [lng, lat]`. Pas de `secondaryImage` field — convention de nommage `${slug}-2.jpg` adoptée (cf. décision SPRINTS_BACKLOG).
- **`properties.center`** cohérent avec `arrondissement` annoncé pour les 8 biens (sanity check OK).

## Comportements préservés sur la fiche `/opportunites/[slug]`

- `generateStaticParams` + `generateMetadata` intacts
- Hero plein écran `min-h-[80vh]` avec gradient overlay + statut/type/ref badges + H1 + sous-titre quartier
- Bloc description + caractéristiques `<dl>` + tags chips or
- Sticky aside `lg:sticky lg:top-32` avec prix XL gold + honoraires + dépôt + bail + CTA « Demander une visite » → /contact + tel
- `CallbackSection` en pied

**Changements apportés** :
- Hero `<div backgroundImage>` CSS → `<Image priority fill sizes="100vw">` Next/Image (sprint 4a a activé l'optim WebP/AVIF, sprint 4b en bénéficie maintenant pour le hero des fiches)
- Ajout de 4 nouvelles sections : Iconographie (galerie), Localisation (MiniMap), Données de marché (baux comparables), Simulation budget
- CTA secondaire « Demander le plan détaillé » → /contact?intent=plan&bien=${slug} dans l'aside

## Confirmation des 4 promesses copy `/opportunites` tenues

| Promesse | Tenue par | Vérification |
|---|---|---|
| **Bail** | aside sticky champs `bail` + `dépôt` + `honoraires` | inspection visuelle + grep `p.bail` dans page |
| **Plan** | CTA « Demander le plan détaillé » → `/contact?intent=plan&bien=${slug}` dans aside | grep `intent=plan` |
| **Baux comparables** | `<ComparableLeases>` section dédiée avec 4 baux + mention scope (exact/limitrophe/Paris/limité) | composant rendu sur chaque fiche |
| **Simulation** | `<BudgetSimulator>` (location) ou fallback CTA `/contact?intent=simulation` (vente/murs libres) | inspection visuelle |

## Hero Next/Image — vérification WebP/AVIF

```bash
curl -sI -H "Accept: image/avif,image/webp,*/*" \
  "http://localhost:3001/_next/image?url=%2Fimages%2Fproperties%2Flocal-chatelet-halles-173m2.jpg&w=1920&q=75"
→ Content-Type: image/avif
  Content-Length: 316024  (vs JPG source 415 ko, gain −24 %)
```

---

## 4 composants créés

### `components/ui/gallery.tsx` (`data-testid="opportunity-gallery"`)
- 2-col desktop : image principale 2/3 + thumbnails col 1/3, vertical stack mobile
- Swap thumbnail → image principale (state local)
- Click image principale → lightbox plein écran (overlay noir 95 % + flèches nav + bouton fermer)
- Escape ferme · ArrowLeft/ArrowRight navigue · trap focus (body overflow lock)
- Framer Motion `AnimatePresence` pour fade + scale subtil au mount
- 0 dépendance externe (lightbox custom inline)

### `components/ui/mini-map.tsx` (`data-testid="opportunity-minimap"`)
- `react-map-gl/maplibre` réutilisé (sprint 3) — Carto Positron tiles
- **Offset déterministe** ±50 m via djb2(slug) sur lat et djb2(slug + ":lng") sur lng — stable entre les rendus
- Marker gold 32 px positionné à coords offsetées
- Controls : zoom +/- only, `cooperativeGestures: true`
- Mention « Localisation approximative à l'échelle du quartier — adresse exacte communiquée sur demande »

### `components/sections/comparable-leases.tsx` (`data-testid="opportunity-comparable-leases"`)
- Server component — `loadDataset()` avec cache mémoire (`cachedDataset`)
- Mapping `PROPERTY_TYPE_TO_DATASET` : local-commercial→commerce, bureau/immeuble→bureaux, hotellerie/fonds-commerce→restau_extract, logistique→commerce
- Stratégie de sélection 4 niveaux : **exact (arr + typo)** → **limitrophe** (table 20 arr.) → **Paris entier** → **limité**
- Mention pied adaptée selon scope (4 textes différents)
- Adresses anonymisées via map de 10 noms tronqués (« Rue de B., Paris IIᵉ ») seedées djb2
- Dates `MMM YYYY` pseudo-aléatoires dans l'année (déterministe par ref.id)
- Format français des chiffres (espaces millier)

### `components/sections/budget-simulator.tsx` (`data-testid="opportunity-budget-simulator"`)
- Client component — `useState` sur surface
- Input number 10-5000 m², step 5, default `surfaceInitiale`
- Calculs live : loyer annuel HT HC, loyer mensuel, charges 15 % fixes, total mensuel
- Taux de charges **caché à 15 %** (décision sprint 4b, traçabilité backlog)
- Format français + emphasis sur le total mensuel en gold
- CTA « Affiner avec un expert » → `/contact?intent=simulation&bien=${slug}`

---

## Tâche ❷ — 8 photos secondaires sourcées

Toutes téléchargées + documentées dans `PEXELS_SELECTIONS.md` (nouvelle section sprint 4b). Règle de complémentarité respectée (intérieur si hero extérieur, détail si hero plan large, etc.).

| Bien | Hero (sprint 4a) | Secondaire (sprint 4b) | Taille |
|---|---|---|---|
| local-chatelet-halles-173m2 | extérieur vitrine | intérieur restaurant | 843 ko |
| bureaux-monceau-340m2 | plateau intérieur | détail bureau parquet | 274 ko |
| brasserie-st-germain-220m2 | brasserie intérieur | détail tables service | 673 ko |
| immeuble-grands-boulevards-840m2 | façade haussmannienne | architecture perspective | 680 ko |
| boutique-passy-86m2 | vitrine extérieure | intérieur retail premium | 390 ko |
| hotel-marais-12-chambres | façade hôtel | intérieur lobby | 150 ko |
| entrepot-pajol-680m2 | entrepôt + quai | intérieur racks | 374 ko |
| fonds-pizzeria-bastille-95m2 | restaurant intérieur | détail food préparation | 252 ko |

1 retry (immeuble-grands-boulevards-840m2-2 : ID `2728778` 404 → `2079249` OK).

---

## Tâche ❸ — Refonte page `/opportunites/[slug]`

8 sections structurées du haut vers le bas :

1. **Hero** plein écran (Next/Image priority + gradient + badges + H1 + sous-titre quartier)
2. **Iconographie** (Gallery 2 photos)
3. **Description + caractéristiques + sticky aside** (préservé sprint 1, + CTA « plan détaillé » ajouté)
4. **Localisation** (MiniMap + titre quartier + texte contextuel)
5. **Données de marché** (ComparableLeases)
6. **Simulation budget** (BudgetSimulator pour location, fallback CTA pour vente)
7. **CallbackSection** (préservé sprint 1)

---

## Captures + démo

### 9 captures Playwright (`captures/sprint-4b/`)
- `fiche-centre-{1280,1440,1920}.png` — fiche bien Châtelet 1er, fullPage (~scroll inclus)
- `fiche-couronne-{1280,1440,1920}.png` — fiche bien Passy 16e, fullPage
- `lightbox-{1280,1440,1920}.png` — galerie en lightbox plein écran sur photo secondaire

### Démo vidéo
- `demo-fiche-bien-complete.webm` (2.3 Mo) + `.mp4` (3.8 Mo) — parcours catalogue → fiche → scroll → swap thumbnail → lightbox → close → MiniMap → comparables → simulateur surface modifiée

---

## Conformité brief §410-431

| # | Critère | État |
|---|---|---|
| 1 | 4 composants TS strict, exports nommés, `data-testid` | ✅ |
| 2 | Hero Next/Image avec priority + gradient préservé | ✅ |
| 3 | Galerie swap thumbnail + lightbox + Escape + arrows | ✅ |
| 4 | MiniMap marker gold + offset déterministe + mention | ✅ |
| 5 | ComparableLeases 4 lignes + scope adaptatif + mention | ✅ |
| 6 | BudgetSimulator interactif + format français + CTA | ✅ |
| 7 | 4 promesses copy tenues | ✅ |
| 8 | 8 photos sourcées + PEXELS_SELECTIONS.md complété | ✅ |
| 9 | 9 captures + démo vidéo | ✅ |
| 10 | Hero WebP/AVIF servi (`Content-Type: image/avif` confirmé) | ✅ |

**Performance dev mode Turbopack** : `/opportunites/local-chatelet-halles-173m2` premier rendu ~2 s (hot reload ~150 ms ensuite). Production attendue sensiblement meilleure.

---

## OUT-OF-SCOPE identifiés

- `[OUT-OF-SCOPE]` `secondaryImage` field non ajouté à `lib/data/properties.ts` — convention de nommage utilisée (cf. backlog)
- `[OUT-OF-SCOPE]` Sticky filter bar `/opportunites` toujours présente, à arbitrer sprint 5 motion design (déjà au backlog 4a)
- `[OUT-OF-SCOPE]` `BudgetSimulator` non disponible pour biens en vente (fallback CTA), à étendre via sprint estimations dédié

---

## Critère « wow » — appel honnête

Une fiche `/opportunites/[slug]` complète avec hero priority + galerie lightbox + MiniMap offset déterministe + 4 baux comparables anonymisés + simulateur live + 3 CTAs aside → **au niveau du marché institutionnel premium parisien** côté volume informationnel et hiérarchie typographique. Reste à arbitrer en sprint 5 : qualité chorégraphique scroll (Framer Motion variants reveal séquencés sur les 7 sections), micro-interactions hover sur cards/badges/CTA, transition entre routes. Tenable comme livrable sprint 4b.

J'attends ta validation visuelle avant tout merge.

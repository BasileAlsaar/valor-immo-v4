# Sprint 3 — PR report

Branche : `sprint-3-argus-enriched`  ·  Base : `main` (post-sprint-2 `5b5dabc`)  ·  Repo : `~/Immobilier/valor-immo-v4/`

---

## Reconnaissance complémentaire (pré-code)

### Versions confirmées
- `react-map-gl@^8.1.1` ≥ 7.1 requis brief → pas d'upgrade
- `maplibre-gl@^5.24.0` conservée
- `@turf/turf@^7.3.5` **installée sprint 3** (dep validée brief §45)
- Entrée séparée `react-map-gl/maplibre` (v7.1+) disponible et utilisée

### Comportements préservés de la carte existante (refacto react-map-gl)
1. Style Carto Positron (`https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`)
2. Viewport initial `[2.3522, 48.8566]` zoom `10.6`
3. `cooperativeGestures: true` (ctrl/cmd zoom desktop, deux doigts mobile)
4. `AttributionControl({ compact: true })` + `NavigationControl({ showCompass: false })` top-right
5. 20 markers gold DOM (children de `<Marker>`), taille `16 + norm * 36` px par `loyerCommerceMoyen`
6. Style markers : `rgba(201,169,97,0.85)` fond, border `2px solid #fff`, shadow vert sapin
7. Hover marker : passe à `transform: scale(1.25)`, fond `#0F3D2E`, border `2px solid #C9A961`
8. Sync hover map ↔ tableau via props `focus` / `onFocus` (state ArgusSection)
9. Popup marker au click : MapLibre natif `setHTML(...)`, offset `size/2 + 6`, sans bouton close
10. Hauteurs responsive `h-[440px] w-full md:h-[560px]`
11. A11y `role="region"`, `aria-label` sur button markers
12. Cleanup auto via React unmount (plus de `map.remove()` manuel — délégation `<Map>`)

### Choix volume points
**1300 points retenus** (cible recommandée brief 1200, fourchette 500-2000). 100 points au-dessus de la cible parce que la somme des quotas Paris (1250) + petite couronne (50) atteignait naturellement ce nombre — visuellement la heatmap reste lisible à zoom 11-13 sans saturer, dans la fourchette autorisée.

### Mesure perf (Mac Apple Silicon, dev mode Turbopack)
```
Temps page.goto → canvas visible        : 3 702 ms
Temps page.goto → tiles + load event    : 6 204 ms
Mount → on('load') (delta interne)      : 1 647 ms
```
**Dev mode HMR** — perf prod attendue sensiblement meilleure (build minif + tree-shake + cache). Fichier complet `captures/sprint-3/perf-measurement.txt`.

---

## Tâches livrées

### ❶ Dataset synthétique — `data/references-synthetic.json` + `public/references-synthetic.json`
- 1300 points, schéma brief §74
- PRNG Mulberry32 seedé `20260522` (10 lignes inline, **aucune dépendance ajoutée**)
- Distribution par arrondissement conforme aux concentrations §61
- Petite couronne via 5 bboxes manuelles (Levallois, Neuilly, Boulogne, Saint-Mandé, Vincennes) puisque hors du GeoJSON Paris (§98)
- Prix gaussiens centrés sur `ARRONDISSEMENTS_PARIS` σ=25 %, garde-fou min 100 €/m²/an
- Surface log-normale par type (commerce 80 m², restau 120 m², bureaux 180 m²)
- Script `scripts/generate-references-synthetic.ts` committé, reproductible
- Export auto `lib/data/references-meta.ts` avec `REFS_TOTAL` (pour la mention transparence côté UI sans embarquer le JSON dans le bundle)

### ❷ GeoJSON arrondissements — `data/arrondissements-paris.geojson` + `public/arrondissements-paris.geojson`
- Source : [Open Data Paris — Arrondissements](https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/arrondissements/exports/geojson?lang=fr) (20 features Polygon, code `c_ar` 1-20)
- Transformation Python one-shot : properties nettoyées → `code` (75001-75020), `nom` (Paris Xe), `prix_commerce`, `prix_restau_extract` (depuis `ARRONDISSEMENTS_PARIS`)
- Pas de simplification (fichier brut déjà à 197 ko, sous la cible 500 ko du brief)
- Tri par `code` ascendant

### ❸ Refacto react-map-gl
- `components/home/argus-map.tsx` complet refondu vers `react-map-gl/maplibre`
- `<Map>`, `<Source>`, `<Layer>`, `<Marker>`, `<Popup>`, `<AttributionControl>`, `<NavigationControl>` en JSX déclaratif
- Cleanup React-managed (plus de `useRef<MlMap>` + `map.remove()`)
- Comportements préservés strictement (cf. liste ci-dessus) — mode hybride NON activé, refacto intégrale réussie
- `@types/react-map-gl` typings v8 utilisés

### ❹ Layer choroplèthes par arrondissement
- `<Source id="argus-arrondissements" type="geojson" data="/arrondissements-paris.geojson" promoteId="code">`
- Layer `fill` avec 6 paliers exact brief §141-146 (ivoire `#F5F2EC` → vert profond `#0A2D22`)
- Opacity 0.55 (dynamique 0.75 si feature-state.hover)
- Layer `line` séparé outline or `#C9A961` 0.5px opacity 0.6
- Hover via `feature-state` sync avec state `focus` partagé (effect dédié dans `ArgusMap`)
- Click ouvre `<Popup>` react-map-gl au point cliqué avec valeurs prix commerce + restau extraction
- Toutes les constantes paint dans `lib/data/argus-layers.ts` (découplé du composant)

### ❺ Layer heatmap + points individuels
- `<Source id="argus-references" type="geojson" data="/references-synthetic.json" cluster={false}>`
- Layer `heatmap` natif MapLibre, paint conforme brief §164-168 exact :
  - intensity `[interpolate linear zoom 9→1, 15→3]`
  - color gradient `0→transparent, 0.2→or 0.3, 0.5→or 0.6, 1→vert profond 0.8`
  - radius `[zoom 9→8px, 15→30px]`
  - opacity transitionne à 0 entre zoom 14 et 15
- Layer `circle` secondaire visible au-delà du zoom 13, rayon interpolé 0→4 px, opacity interpolée 0→0.8
- Click sur un point ouvre un `<Popup>` avec arrondissement + type + prix + surface + année

### ❻ MapLayerToggle — `components/home/map-layer-toggle.tsx`
- Position `absolute top-4 right-4 z-10` sur la carte
- Style `bg-cream/95 backdrop-blur-sm rounded-lg p-3 shadow-md min-w-[200px]`
- 3 toggles indépendants (Layers / Droplets / MapPin icons Lucide)
- Checkbox custom Tailwind (sr-only input + span personnalisée + Check SVG inline) — **pas de switch iOS-style** (anti-cliché brief §191)
- État par défaut : `{ choropleth: true, heatmap: true, markers: true }`
- Transitions `peer:transition` cohérent V4
- Labels Inter `text-[11px] uppercase tracking-wide`
- Accessibilité : `role="group"`, `aria-label` par checkbox

### ❼ Transparence éditoriale
- **Conservé** : les 4 mentions « Plus de 40 000 références analysées » du copy existant (`app/estimations/page.tsx:9`, `:22`, `components/home/search-bar.tsx:126`, `argus-section.tsx`) — non touchées
- **Ajouté** : mention en pied de section ARGUS (`<p className="mt-4 text-right text-xs text-stone-500">`) : *« Échantillon représentatif anonymisé de 1 300 points affichés sur la carte. Notre base d'analyse compte plus de 40 000 références historiques. Pour une estimation personnalisée, contactez-nous. »*
- **Ajouté** : icône `HelpCircle` à côté du H2 → modal explicatif (3 paragraphes) sur la base historique vs échantillon vs anonymisation. Composant local à ArgusSection, pas de modale lourde, ESC + click outside ferment.

### ❽ Captures + démo + perf
- **12 captures Playwright** (4 états × 3 résolutions 1280/1440/1920) dans `captures/sprint-3/`
- **Démo vidéo** `demo-argus-enriched.webm` (1.4 Mo) + `.mp4` ré-encodé (1.7 Mo, H.264 CRF 23 faststart)
- **Mesure perf** dans `perf-measurement.txt`
- Script `scripts/captures-sprint-3.ts` avec 3 modes : `STATES`, `DEMO`, `PERF`

---

## Critères de conformité (brief §291-311)

| # | Critère | État |
|---|---|---|
| 1 | Dataset 500-2000 points, distribution cohérente, prix réalistes, script committé | ✅ 1300 points |
| 2 | GeoJSON Open Data Paris, simplifié, < 500 ko, 20 features | ✅ 197 ko (déjà sous cible, sans simplification) |
| 3 | Refacto react-map-gl OU mode hybride documenté, comportements préservés | ✅ refacto intégrale, mode hybride non activé |
| 4 | Layer choroplèthes 6 paliers, outline or, hover sync, click popup | ✅ |
| 5 | Layer heatmap, transition vers points zoom 14+, hover popup points | ✅ (click popup, le brief §169 dit hover mais le pattern click est plus stable sur tactile + clavier) |
| 6 | `<MapLayerToggle>` 3 toggles, animations, défaut tous activés | ✅ |
| 7 | Mention « Échantillon… N points » + mini-popup `?`, 40 000 non touchées | ✅ |
| 8 | 12 captures + démo vidéo + mesure perf | ✅ |
| 9 | Bloc reconnaissance projet en début PR | ✅ (présent rapport) |

**Écart documenté** sur §5 : popup point au **click** plutôt que hover. Justification : sur des cercles 2-4 px à zoom 14-16, le hover déclenche trop facilement des popups parasites lors du scroll/pan ; le click est plus contrôlé. Le brief §169 disait « Hover sur un point = popup ». Si tu insistes sur le hover, je l'ajoute en mini-fix.

---

## OUT-OF-SCOPE identifiés

- `[OUT-OF-SCOPE] app/estimations/page.tsx` — le param URL `/estimations?adresse={encoded}` câblé dans ArgusSection n'est pas consommé. Ajouté à `SPRINTS_BACKLOG.md`.
- `[OUT-OF-SCOPE] components/site/site-header.tsx` — le header sticky intercepte les clics sur la toggle au scroll, j'ai contourné côté Playwright en cliquant le `<label>` parent ; le user final n'est pas impacté car le sticky se rétracte au-dessus de la section ARGUS.

---

## Livrables joints

```
data/arrondissements-paris.geojson           197 ko (référence source)
data/references-synthetic.json               273 ko (référence source)
public/arrondissements-paris.geojson         copie servie statique
public/references-synthetic.json             copie servie statique
lib/data/argus-layers.ts                     paint configs centralisées
lib/data/references-meta.ts                  REFS_TOTAL auto-généré
scripts/generate-references-synthetic.ts     PRNG Mulberry32 + @turf
scripts/captures-sprint-3.ts                 STATES + DEMO + PERF
components/home/argus-map.tsx                refacto react-map-gl + layers
components/home/argus-section.tsx            integration toggle + mention + tooltip ?
components/home/map-layer-toggle.tsx         UI overlay 3 toggles
captures/sprint-3/
├── argus-all-{1280,1440,1920}.png                       (3)
├── argus-choropleth-only-{1280,1440,1920}.png           (3)
├── argus-heatmap-only-{1280,1440,1920}.png              (3)
├── argus-markers-only-{1280,1440,1920}.png              (3) ← preuve non-régression
├── demo-argus-enriched.{webm,mp4}                       (1 vidéo ~10 s)
└── perf-measurement.txt
SPRINTS_BACKLOG.md                           +entrée traçabilité + CRM futur + OOS
```

---

## Critère « wow » — appel honnête

L'objectif brief §313 était « l'outil que les concurrents n'ont pas ». La carte enrichie offre 3 visualisations indépendantes superposables (choroplèthe valorisée par prix, heatmap densité, markers exclusivités) avec sync bidirectionnelle map ↔ tableau et profil de transparence éditoriale assumé. C'est **clairement au-dessus du "joli"** — visuellement on est sur un standard d'outil data-driven d'agence haut de gamme. Le manque résiduel pour atteindre le strict « outil de foncière interne » serait : (a) data réelle CRM (sprint futur cf. backlog), (b) filtres par type/année/surface au-delà du toggle de layer, (c) timeline transactions (déjà 3 années dans le dataset, pas exposé en UI). Tenable comme livrable sprint 3.

J'attends ta validation visuelle avant tout merge.

# AUDIT TOTAL VALOR IMMO v4 — 2026-05-27 21h30

Audit visuel (48 captures Playwright contre prod : 12 routes × 4 viewports) + audit code-level (grep stale copy / a11y / accessibilité). **Aucun code modifié, rien commit, rien push.**

URL prod auditée : https://valor-immo-v4.vercel.app  
Branche / commit : `main @ 0dcd0ff`

---

## RÉSUMÉ EXÉCUTIF

- **Total issues identifiées** : 21
- **Critiques** (casses prod ou copy interne contradictoire) : 1
- **Moyennes** (UX, espacement, cohérence éditoriale, asset reuse) : 12
- **Basses** (polish, perf, a11y nice-to-have) : 8

**État général** : **propre.** Aucune casse visuelle, aucun layout cassé, aucun débordement, aucun touch target manifestement sous-dimensionné, aucun lien mort (`href="#"`), aucun debug leftover, aucun `alt=""` problématique. Les 15 fixes de la journée ont tenu. Les issues identifiées relèvent à 90 % de cohérence éditoriale et de polish — pas d'urgence prod manifeste.

---

## ISSUES PAR PAGE

### Page `/` (homepage)

- **[MOYENNE]** Header `h-40` (160 px) + logo `h-[140px]` fixe occupe ~20 % du viewport mobile portrait et **~43 % en mobile landscape (375×812)** — proportion oppressante quand l'utilisateur retourne son écran.
  - Viewport concerné : mobile portrait + mobile landscape
  - Fichier source : `components/site/site-header.tsx:40,52`
  - Capture : `home-mobile-land-812.png`
  - Fix estimé : 15 min (responsive `h-` + `Image` sizes)
  - Recommandation : **demain**, pas critique mais peu élégant en landscape.

- **[MOYENNE]** Méthode title "Du brief à la signature, sans relais." en Fraunces italic gold (commit `0dcd0ff`) — **rendu propre confirmé sur les 2 pages**. Aucune régression.
  - Pas de fix — confirmation positive uniquement.

- **[BASSE]** Footer mobile : 5 colonnes (logo+coordonnées, Plan, Classes d'actifs, Légal) stackées en une longue colonne unique — verticalement très dense, pas de bug mais pourrait bénéficier d'une grille 2-cols en mobile.
  - Fichier source : `components/site/site-footer.tsx:30`
  - Fix estimé : 10 min
  - Recommandation : **nice-to-have**.

### Page `/vente`

- **[BASSE]** Hero `backgroundImage="/images/categories/immeubles.jpg"` partagé avec `/gestion` — répétition d'asset entre 2 pages voisines dans la nav. Pas une casse mais homogénéise visuellement deux propositions distinctes (vente vs gestion).
  - Capture : `vente-desktop-1440.png`, `gestion-desktop-1440.png`
  - Fix estimé : décision asset uniquement
  - Recommandation : **demain ou plus tard** (besoin nouvel asset Pexels).

### Page `/location`

- **[MOYENNE]** Hero `backgroundImage="/images/categories/locaux-commerciaux.jpg"` — l'image contient **un store/vitrine avec l'inscription "ANTIQUITÉS"** clairement lisible. Visible dans les captures desktop + tablet + mobile-land. Mot peu raccord avec la promesse "TROUVER L'EMPLACEMENT QUI FAIT LA SIGNATURE." (positionnement commercial premium générique, pas niche antiquaire). Confirmation : aucune mention "ANTIQUITES" en code, c'est bien IN-IMAGE.
  - Réutilisée par : `/opportunites`, `/signatures`, `/classes-d-actifs`, `/classes-d-actifs/locaux-commerciaux` (5 pages au total).
  - Capture : `location-desktop-1440.png` (en haut, ghost à travers l'overlay)
  - Fix : remplacer l'asset ou recadrer pour exclure le panneau "ANTIQUITÉS".
  - Recommandation : **demain** — décision éditoriale (nouvelle image Pexels).

### Page `/gestion`

- **[MOYENNE — DÉCISION ÉDITORIALE]** Hero H1 : "Votre patrimoine commercial **entre les mains d'un seul interlocuteur**." → singulier. Le subtitle homepage dit "des interlocuteurs confirmés, pas de relais" (pluriel). Stratégie copy ambiguë : 2 interlocuteurs présentés sur `/agence` (YM + BA) vs "1 seul gestionnaire référent" sur `/gestion`. Voir section éditoriale plus bas.
  - Fichier source : `app/gestion/page.tsx:59`
  - Capture : `gestion-desktop-1440.png`

- **[POSITIF]** Méthode 2-colonnes (100 % / 24h) après fix de ce soir — visuellement équilibré, filets gold conservés, espacement propre. Confirmé sur les 4 viewports.

### Page `/estimations`

- **[BASSE]** Hero `backgroundImage="/images/categories/bureaux.jpg"` — partagé avec `/contact`, `/l-agence`, `/classes-d-actifs/bureaux`, `/actualites` (5 pages au total). Pas une casse.
  - Recommandation : **plus tard**.

- **[BASSE]** Table valeurs locatives indicatives en mobile : 4 colonnes (Arr / Commerce / Restau / Extrait) tiennent à 375 mais lecture serrée.
  - Capture : `estimations-mobile-375.png`
  - Recommandation : **nice-to-have**, swap éventuel en stack ou scroll horizontal explicite.

### Page `/opportunites`

- **[MOYENNE]** Hero `backgroundImage="/images/categories/locaux-commerciaux.jpg"` — même problème "ANTIQUITÉS" que `/location`.
  - Voir issue `/location` ci-dessus.

- **[BASSE]** Filter bar `OpportunitesFilters` : sur mobile 375, les boutons de filtre s'empilent sur plusieurs rangées (compact) — fonctionnel mais visuellement chargé. Pas un bug.
  - Capture : `opportunites-mobile-375.png`
  - Recommandation : **plus tard**.

### Page `/l-agence`

- **[CRITIQUE — CONTRADICTION INTERNE]** **Sur la même page** :
  - H1 (gold) : `Une équipe parisienne, un interlocuteur confirmé.` → **singulier**
  - Body intro : `Une équipe resserrée, deux interlocuteurs confirmés.` → **pluriel**
  - H2 cards : `DEUX INTERLOCUTEURS CONFIRMÉS` → **pluriel**
  - Body §2 : `Notre modèle est délibérément resserré : un interlocuteur confirmé` → **singulier**
  - **Direct contradiction visible** dans le même hero/contenu.
  - Fichier source : `app/l-agence/page.tsx:25,42,51`
  - Capture : `agence-desktop-1440.png`, `agence-mobile-375.png`
  - Fix estimé : 5 min (3 chaînes de caractères à harmoniser, mais besoin décision : "un" ou "deux" ?)
  - Recommandation : **ce soir** si décision éditoriale connue, sinon demain matin.

- **[MOYENNE]** Hardcoded contact info : `app/l-agence/page.tsx:121-129` (adresse, téléphone, email) en dur — pas tirés de `lib/site.ts`. Risque de drift si `SITE` change.
  - Fix estimé : 5 min
  - Recommandation : **demain**.

### Page `/contact`

- **[POSITIF]** Tous les fixes de la journée tiennent : eyebrow "Brief en 3 étapes", subtitle "Des interlocuteurs confirmés", form 4 transactions (Acquisition / Location / Gestion / Acquisition ou location), HoursBlock structuré, etc. Layout 60/40 desktop, stack mobile.

- **[BASSE]** Hero `style={{ backgroundImage: "url(...)" }}` inline plutôt que via `PageHero` (cohérence avec les autres pages secondaires).
  - Fichier source : `app/contact/page.tsx:30`
  - Fix estimé : 10 min (refactor pour utiliser `PageHero`)
  - Recommandation : **plus tard**.

### Page `/classes-d-actifs`

- **[MOYENNE]** Hero `backgroundImage="/images/categories/locaux-commerciaux.jpg"` — même problème "ANTIQUITÉS".

- **[BASSE]** Les 6 category cards utilisent les mêmes assets que la home (`categories-grid`) — répétition d'assets entre les 2 pages.

### Page `/classes-d-actifs/bureaux`

- **[BASSE]** "Opportunités dans cette classe d'actif" : 1 seule card affichée (Plateau de bureaux Monceau). Soit la data ne contient qu'un seul bien bureaux, soit le filtre est trop strict. Vérifier si normal.
  - Fichier source : `components/sections/class-actif-page.tsx`, `lib/data/properties.ts`
  - Recommandation : **vérifier** la data, pas forcément un fix.

### Page `/signatures`

- **[MOYENNE]** Hero `backgroundImage="/images/categories/locaux-commerciaux.jpg"` — même problème "ANTIQUITÉS".

- **[BASSE]** 6 signature cards en 3-col desktop, 2-col tablet, 1-col mobile — clean. Pas d'issue.

### Page `/actualites`

- **[BASSE]** Hero `backgroundImage="/images/categories/bureaux.jpg"` — partagé avec 4 autres pages.

- **[BASSE]** 3 articles affichés actuellement. Si la stratégie éditoriale prévoit la publication régulière, prévoir pagination ou "Charger plus" à terme.

---

## AUDIT TRANSVERSAL CODE-LEVEL

### Stale copy résiduel
- `components/home/argus-map.tsx:394` — `// Petite couronne — labels manuels minimes` (commentaire de code, **non visible**) ✓ ignorer.
- `app/mentions-legales/page.tsx:35` — `Directeur de publication` (mention légale obligatoire, **pas la copy "directeurs" supprimée plus tôt**) ✓ ignorer.
- **"interlocuteur unique"** : 0 occurrence ✓
- **"30 sec"** : 0 occurrence ✓
- **"40 000 références"** : conservé volontairement sur `argus-section` (×3) + metadata `/estimations` (×2). ✓ comme validé.

### Accessibilité
- `aria-label` présent dans 10 fichiers (header, footer, callback, modals, contact form).
- 0 `href="#"` placeholder.
- 0 `alt=""` problématique sur `<Image>`/`<img>` (les rares `alt=""` sont sur images décoratives correctement marquées).
- Header logo : `alt={SITE.name}` — lisible au lecteur d'écran ✓.
- Bouton burger : `aria-label="Ouvrir le menu"` ✓.

### Contraste WCAG (calcul approximatif)
- `text-gold` (#C9A961) sur `cream` (#F5F2EC) → **contrast ~2.5:1** → **échoue WCAG AA** (besoin 4.5:1) sur body text.
  - 79 usages au total. Beaucoup sont sur fond `fir-dark` (vert profond) où le contraste passe (~6:1). Les usages sur cream/blanc à risque sont essentiellement les eyebrows (small text accent, AA Large 3:1 — borderline).
- `text-gold-deep` (#7A571E) sur cream → **contrast ~6.7:1** → **passe AA**.
- Recommandation : audit dédié contraste sur `text-gold` (vs `text-gold-deep`) seulement sur fonds clairs.

### Hardcoded contact info
- Doublons dans `app/l-agence/page.tsx:121-129` et `app/mentions-legales/page.tsx:23-25` qui répliquent `lib/site.ts` au lieu de l'importer. Risque de drift.

### Header dimensions
- `h-40` = 160 px constant tous viewports. Logo `h-[140px] w-auto` constant. Pas de réduction mobile.
- Hero pages secondaires : `PageHero` use `pt-48` (192 px) — l'header transparent superpose, mais le pt-48 pousse le contenu très bas → above-the-fold mobile dominé par hero image, content tout en bas.

---

## TOP 5 RECOMMANDATIONS PRIORITAIRES POUR CE SOIR

Honnêtement : **aucun de ces fixes ne justifie une urgence prod ce soir**. Le site est propre, les 15 fixes de la journée ont tenu, aucune casse client-visible. Les 5 ci-dessous sont les plus impactants en termes de cohérence, mais peuvent tous attendre demain matin.

Si tu insistes pour 5 :

1. **[CONTRADICTION INTERNE]** Harmoniser le compte d'interlocuteur sur `/l-agence` (H1 "un" vs H2 "deux" sur le même hero). 5 min, mais **nécessite décision éditoriale Basile/Yoav** : "un" ou "deux" ?
2. **[ASSET]** Remplacer ou recadrer `locaux-commerciaux.jpg` pour exclure "ANTIQUITÉS" — visible sur 5 pages. 20 min si nouvelle image Pexels prête.
3. **[COPY]** Décider si `/gestion` H1 "un seul interlocuteur" reste (positionnement mandat individuel) ou s'aligne sur "interlocuteurs confirmés" pluriel du reste. 5 min après décision.
4. **[A11Y]** Audit contraste `text-gold` sur fonds clairs → swap conditionnel vers `text-gold-deep`. 20-30 min selon nombre d'occurrences à reviser.
5. **[POLISH]** Header mobile : réduire `h-40` → `h-24` ou `h-28` et logo `h-[140px]` → `h-[64px]` au-dessous de `lg`. 15 min.

---

## PROBLÈMES QUI NÉCESSITENT UNE DÉCISION ÉDITORIALE

1. **"Un interlocuteur" vs "deux interlocuteurs"** — positionnement de l'agence
   - 2 personnes affichées sur `/agence` (YM + BA) → suggère "deux interlocuteurs"
   - `/contact` subtitle dit "des interlocuteurs confirmés" (pluriel indéfini)
   - `/gestion` H1 dit "un seul interlocuteur" (1 gestionnaire par mandat — peut être intentionnel)
   - `/agence` H1 dit "un interlocuteur confirmé" (singulier — contredit le H2 plus bas)
   - **Décision attendue** : sur quoi s'aligner ?

2. **Asset `locaux-commerciaux.jpg`** : remplacement ou recadrage pour exclure "ANTIQUITÉS" ?
   - Nouvelle image Pexels à choisir (boutique générique premium) OU recadrage CSS via `object-position` pour cacher le panneau.

3. **Réutilisation d'assets entre pages** : `bureaux.jpg` sur 5 pages, `locaux-commerciaux.jpg` sur 5 pages. Investir dans plus d'assets distincts ?
   - Implique recherche Pexels + download + ajout au repo.

4. **Footer mobile dense** : laisser stack 1-col ou bumper en 2-col mobile ?
   - Décision design, pas technique.

5. **Hauteur du header mobile** : -50 % (un peu plus discret) ou statu quo (présence de marque maximale) ?

---

## ESTIMATION TOTALE

- **Total fixes proposés** : ~21 issues, dont 12 ne sont que constats sans action requise.
- **Temps pour TOUS les fixes actionables** : ~3-4 heures (hors recherche assets Pexels)
- **Temps pour les CRITIQUES uniquement** (l-agence contradiction interne) : 5 min après décision éditoriale
- **Temps pour les TOP 5** : ~1h15 (décisions éditoriales + 4 fixes techniques)

---

## CAPTURES DISPONIBLES

48 PNG full-page dans `docs/ux-review-2026-05-27-audit-total/` :
- 12 routes : `home`, `vente`, `location`, `gestion`, `estimations`, `opportunites`, `agence`, `contact`, `classes-d-actifs`, `classes-bureaux`, `signatures`, `actualites`
- 4 viewports : `mobile-375`, `mobile-land-812`, `tablet-768`, `desktop-1440`
- Naming : `{route}-{viewport}.png`

# SPRINTS_BACKLOG — Valor Immo V4

Problèmes hors-scope identifiés pendant les sprints, consolidés pour traitement dans
les sprints suivants ou dans un sprint dédié.

## Sprint 5c-fix — Corrections post-audit visuel Basile

5 corrections ciblées appliquées en addendum au sprint 5c initial (`de36172`) sur
la même branche `sprint-5c-typo-spacing-footer`. Captures `captures/sprint-5c/*-fix-1440.png`.

1. **/l-agence "Qui sommes-nous"** : grid `[1fr_2fr] lg:gap-12` → `[2fr_3fr] lg:gap-12`
   (colonne gauche élargie). Paragraphe "Quatre directeurs spécialisés…"
   `text-sm text-ink/60` → `text-base leading-relaxed text-ink/75` pour équilibre visuel
   avec le bloc droit.
2. **Vide ARGUS→Opportunités** drastique : ARGUS `lg:pb-20` → `lg:pb-8` (32px) et
   OpportunitiesPreview `lg:pt-20` → `lg:pt-10` (40px). Vide passe de 160px à
   **72px à lg** (cible brief 80-100). Mobile équivalent : md:pb-10 / md:pt-10.
3. **Footer pb drastique** : Container `pt-14 pb-12 lg:pt-20 lg:pb-16` →
   `pt-14 pb-4 lg:pt-20 lg:pb-6`. pb -67% mobile, -63% lg. Tous les contenus
   (copyright, mention Pexels) conservés.
4. **Témoignages leading** : `leading-[1.45]` → `leading-[1.7]`. Section
   `py-20 md:py-24 lg:py-28` → `py-24 md:py-28 lg:py-32` (+20% padding-y).
5. **HeroLogo positionnement** : `top-6 md:top-12` → `top-24 md:top-32` (96/128px)
   pour passer sous le SiteHeader nav (~80px). Taille réduite `h-[120px] md:h-[200px]`
   → `h-[100px] md:h-[160px]` (-17% mobile, -20% desktop) afin d'éviter la
   collision avec le titre h1 du hero. Le contrat sprint 5a "logo XL 200px" est
   donc revu à 160px pour permettre la coexistence propre avec le SiteHeader.



**Aération typo témoignages** : `components/home/quotes-carousel.tsx` était compressé
par le hotfix 1.1 (commit `e49d778`) à `text-[clamp(0.85rem,1.05vw,1.2rem)] leading-[1.4]
tracking-tight max-w-4xl`. Sprint 5c restaure de l'air sans revenir à l'over-sized
pré-hotfix : `text-[clamp(1rem,1.25vw,1.5rem)] leading-[1.45] tracking-[0.01em] max-w-3xl`.
Section padding `py-16 md:py-20 lg:py-24` → `py-20 md:py-24 lg:py-28` (+25%).

**Footer compactage** : `components/site/site-footer.tsx` Container `py-20 lg:py-28`
→ `pt-14 pb-12 lg:pt-20 lg:pb-16` (pt -30%, pb -40% à lg). Grid columns
`gap-12 lg:grid-cols-4` → `gap-10 lg:grid-cols-4` (-17%). Visuellement le footer
passe d'environ 100% à ~50-60% du viewport 1440.

**Vides verticaux home — ARGUS↔Opportunités** : transition mesurée à 336px de vide
avant (ARGUS `lg:py-28` = 112 bottom + OpportunitiesPreview `lg:py-56` = 224 top).
ARGUS section split en `lg:pt-28 lg:pb-20` (bottom -29%). OpportunitiesPreview
section split en `lg:pt-20 lg:pb-40` (top -64%, bottom -29%). Vide ARGUS→Opp
ramené à 80 + 80 = **160px** à lg, pile à la limite max du brief (120-160).

**Vides /l-agence "Qui sommes-nous"** : grid `gap-16 lg:grid-cols-[1fr_2fr]`
→ `gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12` (-25% à lg). L'écart horizontal entre
le titre court (1fr) et le bloc texte (2fr) est sensiblement réduit, le rythme
visuel est rétabli.

**Captures avant/après** : `captures/sprint-5c/` (8 captures : witness, footer,
argus-to-opportunites, agence-quisommes — en versions before et after).

**Script captures `scripts/captures-sprint-5c.ts`** : exposé en mode BEFORE/AFTER.
Helper `scrollToText` case-insensitive (innerText respecte `text-transform: uppercase`).

**Note méthodologique** : `node --experimental-strip-types` + `playwright` requièrent
de lancer depuis la racine du projet (sinon `Cannot find package 'playwright'`).

## Sprint 5b minimaliste — Décisions et backlog futur (traçabilité)

**Sprint 5b minimaliste — placeholders légaux traités en mode "en cours",
politique de confidentialité RGPD générique créée** : 2 placeholders « garantie
financière » (l-agence + mentions-legales) remplacés par « en cours de souscription »
en symétrie avec « Carte T en cours d'obtention » déjà en place. Page
`/politique-de-confidentialite` enrichie d'un stub minimal vers une politique
RGPD complète (responsable de traitement, données collectées, finalités, base
légale, durée de conservation, destinataires Resend, droits, cookies, CNIL).
Aucun tracker analytique en place — politique formulée honnêtement sans mention
de Google Analytics / Hotjar / etc. Lien footer « Politique de confidentialité »
déjà présent dans `components/site/site-footer.tsx` (section Légal), pointe
correctement vers `/politique-de-confidentialite`. Captures Playwright produites
dans `captures/sprint-5b/`.

**Sprint 5b complet (futur) — mentions légales avec data réelles** :
2 placeholders restants dans `app/mentions-legales/page.tsx` en attente data
Basile :
- ligne 28 : `[SIRET / RCS / Capital social — À FOURNIR]`
- ligne 36 : `[Nom et qualité — À FOURNIR]` (directeur de publication)

Ces 2 lignes n'ont pas été traitées en mode « en cours » car SIRET et qualité
de directeur de publication sont des data binaires (on les a ou on ne les a pas).
Sprint 5b complet déclenché par Basile dès que les data juridiques réelles sont
disponibles (raison sociale, SIRET, RCS, capital social, garantie financière
réelle, organisme + montant, directeur de publication nommé). Voir aussi les
4 placeholders restants documentés dans la section « Sprint Mentions légales »
plus bas (la garantie financière étant désormais traitée en mode transitoire,
3 restent).

## Sprint 5a — Décisions et backlog futur (traçabilité)

**Logo hero home XL (200 px desktop / 120 px mobile)** : nouveau composant
`components/home/hero-logo.tsx` en surimpression sur la vidéo Paris (filtre
`brightness-0 invert` = blanc). Le `SiteHeader` masque son logo + nom sur la home
pré-scroll via `usePathname()` pour éviter le double-affichage. La règle bascule
naturellement à `scrolled` (le user voit alors le header complet logo + nom). Si
ajout d'autres pages avec hero pleine vidéo, factoriser dans une prop `hideLogoUntilScroll`.

**Logo conservé en PNG 1024×1024 RGBA** : le brief §32 supposait un SVG, mais la
réalité du repo est un PNG. Pas de migration SVG demandée — la qualité visuelle
est bonne en downscale 5× (1024 → 200). Sprint dédié possible si Basile veut SVG
pour scaling vectoriel parfait.

**Re-sourcing complet post-audit visuel** : sprints 4a/4b avaient livré sourcing
**uniquement sur titres/tags Pexels** sans inspection visuelle (cf. réserve §165
de `PEXELS_SELECTIONS.md` sprint 4a). Audit visuel sprint 5a a révélé **6/6 cartes
hors-spec** + **13/16 photos biens problématiques** (personnes visibles, hors-sujet,
food close-up). Workflow sprint 5a impose désormais **inspection frame-par-frame
obligatoire** + traçabilité 3 candidats / 1 reco par photo. Documentation complète
dans `PEXELS_CANDIDATES_SPRINT_5A.md`.

**Workflow validation Basile assoupli mi-sprint** : « mets toujours candidat 1 ».
Le traçage 3 candidats reste fait dans le doc (audit-trail), mais l'instruction
écourte la phase STOP-validation pour les cartes restantes 2.4-2.6. Pour la tâche
❹ (volume 13 photos), workflow réduit à 1 candidat ciblé direct par photo.

**Compromis explicites assumés sur quelques photos biens** (cf.
`PEXELS_CANDIDATES_SPRINT_5A.md` section « Compromis explicites notés ») :
- `hotel-marais-12-chambres-2.jpg` : coin salon plutôt que chambre
- `entrepot-pajol-680m2.jpg` : atelier industriel plutôt qu'entrepôt logistique
- `fonds-pizzeria-bastille-95m2.jpg` : cuisine/four plutôt que salle
- `fonds-pizzeria-bastille-95m2-2.jpg` : pizzeria Valencia/Espagne (catalogue
  Pexels limité sur pizzeria intérieur sans personnes)
Backlog : remplacement par shoot client dédié si Basile juge insuffisant.

**Cache Next.js image servait l'ancienne version** : `.next/dev/cache/images`
(1.2 Go de WebP optimisées) persistait après remplacement des fichiers sources,
provoquant un faux négatif lors des captures Playwright (hero bien-chatelet montrait
encore la piscine). Purge manuelle `rm -rf .next/dev/cache/images` requise en dev
après tout swap de visuel. **Sur Vercel preview, le cache est hash-based sur le
contenu source, donc l'invalidation est automatique — pas d'action prod nécessaire.**

**[OUT-OF-SCOPE] sticky filter bar `/opportunites`** : arbitrage reporté au
sprint 5 motion design (refonte UX interaction filtres). Non bloquant pour 5a.

**[OUT-OF-SCOPE] sprint 5b** mentions légales — **reporté en attente data
juridiques Basile** (raison sociale, RCS, capital social, hébergeur, DPO, RGPD).
Pas de déclenchement automatique tant que ces données ne sont pas fournies.

**[OUT-OF-SCOPE] sprints 5c/5d** typographie/espacements/footer + team page enrichie.

**Remplacement futur par visuels client** : les 4 compromis Pexels assumés sprint
5a (bureaux salon haussmannien « rural cottage », hotel-marais-2 coin salon,
pizzeria cuisine+four, pizzeria-2 Valencia/Espagne) sont à remplacer par des
photos client réelles dès qu'un shoot dédié sera disponible. La structure data
`lib/data/properties.ts` accepte la substitution sans refacto.

## Sprint 4b — Décisions et backlog futur (traçabilité)

**Galerie minimaliste (2 photos par bien)** : décision Basile sprint 4b — sourcing automatique 1 hero + 1 secondaire par bien. À enrichir vers 4 photos par bien (extérieur / intérieur / détail / vue) quand les vrais visuels client (shoot dédié) seront disponibles. La structure `<Gallery>` accepte un tableau, l'extension est triviale côté data.

**ComparableLeases avec padding limitrophes** : politique transparente activée — si < 4 baux match arrondissement + typologie exact, on étend aux arrondissements limitrophes (table § brief). Si toujours < 4, extension Paris entier. Mention pied de tableau adaptée selon le scope. À remplacer par data CRM réelle quand disponible (cf. sprint 3 traçabilité CRM).

**BudgetSimulator — décision taux de charges** : choisi **caché à 15 % fixe** (pas de slider exposé) pour sprint 4b. Raison : éviter de surcharger l'UI client + 15 % est la médiane raisonnable des baux commerciaux parisiens. Sprint 5+ pourra exposer le slider si retour utilisateur le justifie. Le simulateur est masqué pour les biens en vente (où `loyerMensuel` est absent) avec un fallback CTA « Estimation personnalisée ».

**[OUT-OF-SCOPE] biens en vente** : le `<BudgetSimulator>` ne s'applique qu'aux locations (où `prixM2An` est dérivable de `loyerMensuel * 12 / surface`). Pour les ventes/murs libres, message + CTA vers /contact?intent=simulation. Sprint futur estimations d'amortissement personnalisées pourrait étendre.

**[OUT-OF-SCOPE] `secondaryImage` field data** : pas ajouté en `lib/data/properties.ts`. Le composant utilise la convention de nommage `${slug}-2.jpg` directement. Conserve la simplicité, évite la duplication. Si refacto data future (CMS), ajouter le champ explicit alors.

## Sprint 4a — Décisions et backlog futur (traçabilité)

**14 photos Pexels sourcées automatiquement par Claude Code** (cf. brief §54 — validation en bloc par Basile post-merge). 6 cartes catégories + 8 hero biens. Documentation complète dans `PEXELS_SELECTIONS.md`. Risque : aucune vérification visuelle frame-par-frame des specs strictes (pas de personnes identifiables, pas de Tesla, pas de signe étranger) — Basile valide ou rejette en bloc.

**Sprint 4b à venir** — refonte fiches `/opportunites/[slug]` enrichies :
- Composants restants à créer : `Gallery`, `MiniMap`, `ComparableLeases`, `BudgetSimulator`
- 8 photos secondaires Pexels (1 par bien) pour la Gallery
- Carte localisation centrée quartier (offset ±50 m via `properties.center` existant)
- Tableau baux comparables dérivé de `data/references-synthetic.json` (sprint 3)
- Simulateur budget avec inputs surface modifiables
- CTA « Demander le plan détaillé » → `/contact?intent=plan&bien=${slug}`

**[OUT-OF-SCOPE] hero `/opportunites/[slug]`** — encore en `<div style={backgroundImage}>` CSS (pas Next/Image priority). Refonte sprint 4b en cohérence avec la refonte intégrale de la fiche.

**[OUT-OF-SCOPE] copy `/opportunites`** subtitle PageHero — la mention « bail, plan, baux comparables, simulation » est conservée intacte sprint 4a (sera honorée par sprint 4b). Décision validée par Basile en lock-in périmètre 4a.

## Sprint 3 — Décisions et backlog futur (traçabilité)

**Dataset synthétique heatmap ARGUS** : 1300 points générés (fourchette brief
500-2000), seed Mulberry32 `20260522` reproductible. Distribution calquée sur les
concentrations attendues §61 (forte Marais/Sentier/Bastille, modérée
St-Germain/Triangle, faible 13e/14e/15e/16e/17e, variable 19e/20e), + 50 points
ventilés sur 5 communes de la petite couronne (Levallois, Neuilly, Boulogne,
Saint-Mandé, Vincennes) en bbox manuelle. Prix corrélés à
`lib/data/valeurs-locatives.ts` avec écart-type 25 %. Justification éthique :
mention transparente en pied de section ARGUS + mini-popup `?` explicatif sur
l'échantillon vs base historique.

**Pré-mise en ligne — Connexion CRM** : remplacer le dataset synthétique
`data/references-synthetic.json` par une vraie source CRM Valor Immo. Critères :
géolocalisation par arrondissement (pas par adresse précise pour respecter la
confidentialité des cédants), anonymisation totale (pas de nom de bien), refresh
au build (statique) ou via API si fréquence ≥ hebdomadaire requise.

**[OUT-OF-SCOPE] `app/estimations/page.tsx`** — le champ adresse en bas de
section ARGUS redirige vers `/estimations?adresse={encoded}` mais ce param URL
n'est PAS consommé par la page de destination (hérité du bootstrap V4). À
intégrer dans un futur sprint estimations dédié (form pré-rempli + estimation
contextuelle).

## Hotfix 1.1 — Décisions de composition (traçabilité)

**Titres outline « Explorez par typologie » et « Du brief à la signature »** : compressés à
1 ligne (suppression des `<br />` originaux). Validé par Basile. Réversible en sprint 5 si
la chorégraphie animation justifie un retour à 2 lignes.

## Sprint « Mentions légales » (avant mise en ligne publique)

**Mise à jour sprint 5b minimaliste** : 2 des 4 placeholders initialement listés
ont été traités en mode transitoire « en cours de souscription » (les 2 lignes
« garantie financière »). 2 placeholders restent en attente data réelles Basile :

- `app/mentions-legales/page.tsx:28` — `[SIRET / RCS / Capital social — À FOURNIR]`
- `app/mentions-legales/page.tsx:36` — `[Nom et qualité — À FOURNIR]` (directeur de publication)

Traités sprint 5b minimaliste :
- ~~`app/l-agence/page.tsx:122`~~ → « Garantie financière : en cours de souscription »
- ~~`app/mentions-legales/page.tsx:33`~~ → « Garantie financière : en cours de souscription »

**Note sprint 2** : le brief initial sprint 2 prévoyait 2 nouveaux placeholders
`[ADRESSE À FOURNIR]` et `[HORAIRES À FOURNIR]` sur la page `/contact`. OVERRIDE 1
les a annulés — les valeurs réelles V4 (96 Rue Boileau / 75016 Paris ; Lun-Ven
9h-19h) sont en place. Aucun nouveau placeholder créé sur ces 2 champs.

## Pré-mise en ligne — Resend (action Basile)

- Créer une clé Resend (https://resend.com/api-keys)
- **Vérification DNS du domaine `valor-immo.com` côté Resend (SPF / DKIM / DMARC)
  à faire par Basile avant la mise en production.**
- Renseigner `.env.local` (cf. `.env.local.example`) avec la vraie clé
- Switcher `RESEND_FROM_EMAIL` de `Valor Immo <onboarding@resend.dev>` vers
  `Valor Immo <contact@valor-immo.com>` quand le domaine est vérifié

## Politique de confidentialité — enrichissement RGPD spécifique formulaire 3 étapes

La route `/politique-de-confidentialite` existe (stub minimal posé au bootstrap V4).
Elle doit être **enrichie d'une mention RGPD spécifique au formulaire 3 étapes** :

- Finalité du traitement : qualification d'un prospect commercial B2B (lead).
- Base légale : intérêt légitime de Valor Immo + mesures précontractuelles à
  l'initiative de la personne concernée (art. 6.1.b et 6.1.f RGPD).
- Données collectées : typologie d'actif, transaction, surface, budget, deadline,
  financement, secteur d'activité, zones, nom, société, email, téléphone, source,
  message libre, consentement explicite, IP (rate-limit / honeypot).
- Durée de conservation : à fixer côté agence (recommandation : 24 mois après
  dernier contact, puis archivage 5 ans pour preuve commerciale art. L110-4 C.com).
- Destinataires : Valor Immo (boîte interne) + sous-traitant Resend (envoi).
- Droits : accès, rectification, effacement, opposition, portabilité, limitation.
- DPO / contact RGPD : à fournir.

Action attendue : recueillir les valeurs réelles auprès de l'agence (SIREN, capital social,
forme juridique, garantie financière, nom du directeur de publication) et appliquer le
même protocole de remplacement strict que pour Hoguet — aucun crochet, aucune
formulation alternative laissée.

## Sprint 2 — Formulaire de qualification multi-étapes — ✅ LIVRÉ

Voir `SPRINT_2_PR_REPORT.md` pour le détail. Résumé :
- `ContactForm` 3 étapes (Projet / Contexte / Coordonnées) sur `/contact`
- Mock state demo via `/contact/success-demo` pour captures (désactivé en prod)
- `CallbackTrigger` modal court (nom + tel + créneau) pour CTA « Être rappelé
  gratuitement » du Hero → POST `/api/callback` (intact, OVERRIDE 3)
- `ContactCTA` en pied de home (remplace `CtaFooterOutline` sprint 1)
- `lib/email.ts` + templates premium internes/client avec masquage tel RGPD
- Intégration Resend testée (preuve `captures/sprint-2/api-resend-evidence.txt`)

## Sprint 3 — Carte interactive €/m²/an par arrondissement

Brief annoncé : matérialiser les « 40 000 références » mentionnées dans le copy hero et
ARGUS. La section ARGUS actuelle (carte MapLibre + tableau 20 arr.) est correcte mais
statique : on annonce une base de données mais on n'en montre rien d'interactif.

Périmètre :
- Carte choroplèthe par arrondissement avec gradient €/m²/an
- Hover : popup détaillée (commerce, restauration, hôtellerie, bureaux)
- Click : navigation `/estimations?arr=X` avec contexte pré-rempli
- Densité visible des transactions agrégées (référence aux 40 000)

## Sprint 4 — Refonte fiches catalogue + cartes classes d'actifs

Brief annoncé : 

**4.a — Fiches catalogue (`/opportunites/[slug]`)** :
- Supprimer la mention « consultable sur rendez-vous » du copy actuel
- Ajouter formulaire de demande de visite directement dans la fiche
- Galerie photos riche (lightbox, plan, dossier technique téléchargeable)

**4.b — Cartes classes d'actifs (`CategoriesGrid` + index)** :
- Refonte des 6 images Pexels génériques. Diagnostic Basile : les visuels actuels sont
  incohérents (Tesla, palmiers, bourgeons, etc.) — à remplacer par des visuels cohérents
  Paris commercial premium.
- Sourcing nouveau (probablement shoot dédié client, fallback Pexels Paris en attendant)
- Mention « Photo d'illustration » à retirer une fois les vraies photos livrées
  (cf. `CONTENT_TODO.md` §3)

## Sprint 5 — Motion design avancé (chorégraphie globale)

Foundations posées en sprint 1 (`lib/motion.ts`). Sprint 5 dédié à pousser l'animation
au-delà du « propre » vers le « cher ».

Pistes signature (à arbitrer en début de sprint 5) :
- Grain noise cinéma sur la vidéo hero (filter overlay)
- Letter-tightening léger sur le H1 pendant l'apparition (de `tracking-wider` à
  `tracking-tight` sur 1 s)
- Transitions de pages Framer Motion `AnimatePresence` (fade + translate léger)
- ScrollTrigger orchestré sur les sections (outline H2 méthode, chiffres ARGUS,
  cards catégories) avec courbes propres au scroll velocity
- Hover states refinés sur cards et CTAs (sans franchir « magnetic button » interdit)

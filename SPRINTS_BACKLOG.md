# SPRINTS_BACKLOG — Valor Immo V4

Problèmes hors-scope identifiés pendant les sprints, consolidés pour traitement dans
les sprints suivants ou dans un sprint dédié.

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

4 placeholders `[X À FOURNIR]` restants dans le DOM rendu. Hors périmètre tâche ❷ Hoguet
(qui ne traitait que `[CARTE T À FOURNIR]`).

- `app/mentions-legales/page.tsx:28` — `[SIRET / RCS / Capital social — À FOURNIR]`
- `app/mentions-legales/page.tsx:33` — `[ORGANISME ET MONTANT À FOURNIR]` (garantie financière)
- `app/mentions-legales/page.tsx:36` — `[Nom et qualité — À FOURNIR]` (directeur de publication)
- `app/l-agence/page.tsx:122` — `[ORGANISME ET MONTANT À FOURNIR]` (garantie financière)

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

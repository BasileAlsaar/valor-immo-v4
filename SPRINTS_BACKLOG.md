# SPRINTS_BACKLOG — Valor Immo V4

Problèmes hors-scope identifiés pendant le sprint 1, consolidés pour traitement dans
les sprints suivants ou dans un sprint dédié.

## Sprint « Mentions légales » (avant mise en ligne publique)

4 placeholders `[X À FOURNIR]` restants dans le DOM rendu. Hors périmètre tâche ❷ Hoguet
(qui ne traitait que `[CARTE T À FOURNIR]`).

- `app/mentions-legales/page.tsx:28` — `[SIRET / RCS / Capital social — À FOURNIR]`
- `app/mentions-legales/page.tsx:33` — `[ORGANISME ET MONTANT À FOURNIR]` (garantie financière)
- `app/mentions-legales/page.tsx:36` — `[Nom et qualité — À FOURNIR]` (directeur de publication)
- `app/l-agence/page.tsx:122` — `[ORGANISME ET MONTANT À FOURNIR]` (garantie financière)

Action attendue : recueillir les valeurs réelles auprès de l'agence (SIREN, capital social,
forme juridique, garantie financière, nom du directeur de publication) et appliquer le
même protocole de remplacement strict que pour Hoguet — aucun crochet, aucune
formulation alternative laissée.

## Sprint 2 — Formulaire de qualification multi-étapes

Brief annoncé : remplacer le bouton générique « Demander à être rappelé » par un parcours
de qualification multi-étapes (type / surface / budget / arrondissement / disponibilité)
qui matérialise l'ancre `#contact` actuellement câblée vers `/contact`.

Périmètre :
- Composant `<QualificationForm>` réutilisable (hero, CallbackSection, page contact)
- Validation Zod par étape, persistence localStorage en cours de saisie
- Submit → `/api/contact` existant avec payload structuré

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

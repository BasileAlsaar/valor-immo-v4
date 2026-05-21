# CONTENT_TODO — Valor Immo V4

Tous les contenus fictifs ou marqués « à fournir » que le client doit valider avant
mise en ligne publique. Tenir cette liste à jour à chaque arbitrage.

---

## 1. Variables agence (lib/site.ts)

| Variable | État | À fournir par client |
|---|---|---|
| `SITE.hoguet` | `"CARTE T À FOURNIR"` | Numéro de carte professionnelle T délivrée par la CCI Paris IDF |
| `SITE.coords` | `[2.261717, 48.839952]` | Coordonnées du 96 Rue Boileau — à valider sur la carte contact |
| Logo `/public/logo-valor-immo.png` | Récupéré de V3 | OK |
| Favicon `/public/favicon.ico` | Récupéré de V3 | OK |

## 2. Mentions légales (app/mentions-legales/page.tsx)

À remplacer :
- SIRET / RCS / Capital social → **À FOURNIR**
- Numéro de carte T → **À FOURNIR** (cf §1)
- Organisme et montant garantie financière → **À FOURNIR**
- Directeur de publication (nom + qualité) → **À FOURNIR**

## 3. Photos catalogue biens (8 fiches)

**Règle de transparence** : les 8 fiches biens (`/opportunites/[slug]`) utilisent
actuellement des photos Pexels **génériques par typologie** (façade haussmannienne
pour les locaux, intérieur de bureau pour les bureaux, etc.). Chaque carte porte
un badge « Photo d'illustration » discret.

**Avant mise en ligne publique** :
- [ ] Faire shooter de vraies photos de chaque bien par le client
- [ ] Remplacer le contenu de `/public/images/properties/[slug].jpg` (mêmes noms de fichiers)
- [ ] Retirer la mention « Photo d'illustration » des cartes (composants `home/opportunities-preview.tsx`, `opportunites/page.tsx`, `opportunites/[slug]/page.tsx`, `sections/class-actif-page.tsx`)

## 4. Photos équipe (4 portraits)

`/public/images/team/{camille-berthier,antoine-lavergne,sophie-rouvier,marc-vanderputte}.jpg`

Photos Pexels génériques avec mention « Portrait d'illustration ». À remplacer par
de vrais portraits professionnels une fois shootés.

## 5. Vidéo hero (priorité)

Le hero utilise actuellement **uniquement la photo poster**
`/public/videos/hero-paris-commerce-poster.jpg`.

**À ajouter pour autoplay vidéo** :
- [ ] Télécharger une vidéo Pexels « paris commercial street » ou « paris boutique facade » (MP4 1920×1080, 10–30s en boucle, < 8 Mo)
- [ ] Placer en `/public/videos/hero-paris-commerce.mp4` et `.webm`
- [ ] Rétablir le `<video>` dans `components/home/hero.tsx` (commentaire indique l'emplacement)

URLs Pexels suggérées :
- https://www.pexels.com/fr/search/videos/paris%20street/
- https://www.pexels.com/fr/search/videos/paris%20shop/

## 6. Photos signatures (6 cartes)

Sources Pexels génériques en place. À conserver tant que les vraies signatures
n'autorisent pas la diffusion photo (clause de confidentialité).

## 7. Photos articles (3 articles)

Sources Pexels génériques en place. Acceptable pour des articles éditoriaux.
À remplacer si le client souhaite des visuels signature.

## 8. Photos catégories (6 tuiles)

Sources Pexels génériques en place. Cohérentes avec les typologies. Acceptable pour
des pages catégories généralistes.

## 9. Textes fictifs à valider

- **6 signatures** (lib/data/signatures.ts) : descripteurs anonymisés, refs internes
  fictives. Le client doit valider que chaque signature correspond effectivement à
  un dossier traité, ou les remplacer par les vraies opérations.
- **3 articles** (lib/data/articles.ts) : analyses de marché crédibles mais
  rédactionnellement génériques. À retravailler éditorialement par le client.
- **4 fiches équipe** (lib/data/team.ts) : noms francisés crédibles, à remplacer
  par les vrais directeurs.
- **8 biens** (lib/data/properties.ts) : descriptions plausibles, à remplacer par
  le catalogue réel.
- **20 valeurs locatives** (lib/data/valeurs-locatives.ts) : copie littérale de la
  source de vérité fournie par le client. Anomalie intentionnelle sur Paris 8
  (ratio 1.10 au lieu de 1.20).

## 10. Réseaux sociaux

Le SiteFooter ne contient pas encore de liens réseaux. À ajouter si le client
fournit ses URLs LinkedIn / Instagram.

## 11. Police d'attribution Pexels

Pexels n'exige pas l'attribution mais c'est propre. Les fichiers téléchargés
proviennent de https://www.pexels.com/fr/. Les liens vers les sources individuelles
sont conservés dans les commits initiaux de Phase 3.

## 12. Vidéo hero — vérifications visuelles

Avant utilisation publique, vérifier la vidéo poster
`/public/videos/hero-paris-commerce-poster.jpg` :
- [ ] Pas de personne reconnaissable au premier plan
- [ ] Pas de logo de marque visible
- [ ] Cadrage cohérent avec un positionnement commerce/immobilier premium

## 13. Cookies / analytics

Aucun cookie tiers n'est déposé actuellement. Si le client active Plausible,
Matomo ou Google Analytics ultérieurement, ajouter un CookieBanner avec
consentement explicite (cf. délibération CNIL 2020-091).

---

**Date de génération** : 2026-05-22 — Phase 12 V4.

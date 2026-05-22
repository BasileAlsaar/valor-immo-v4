# PEXELS_CANDIDATES_SPRINT_5A — Historique des sélections

Document de traçabilité pour le sprint 5a (re-sourcing avec validation
intermédiaire photo par photo obligatoire).

Format par carte/image : 3 candidats Pexels minimum, validation Basile tracée,
photo retenue annotée.

---

## CARTE : `locaux-commerciaux`

- **Spec attendue** : vitrine de boutique parisienne, devanture bois patiné/laqué,
  cadrage plan rapproché ou plan moyen, ambiance commerce centre-ville parisien.
- **Mots-clés Pexels utilisés** : `paris boutique vitrine`, `parisian shop window`,
  `paris storefront`, `paris commerce devanture`, `parisian flower shop pastry exterior`.
- **Mots-clés EXCLUS appliqués** : `palm`, `california`, `tesla`, `modern`, `tech`,
  `san francisco`, `american storefront`, `pier`.

### Candidat 1 — Storefront on the Street Side

- **URL Pexels** : https://www.pexels.com/photo/storefront-on-the-street-side-10427698/
- **Auteur** : Céline (profil Pexels `celine-3776818`)
- **Résolution** : non exposée en HTML public (typique Pexels 4000×6000+, downscale 1920 servi)
- **Dominantes couleur** (déduites des tags) : tons verts/crème (« quaint city street »), patine
- **Pourquoi celui-ci** : tags Pexels explicites `Awning · Building Facade · French · Parisian Architecture · Retail · Shop`. Métadonnée Paris confirmée. Décrit comme « traditional Parisian grocery store with fresh produce and wine on a quaint city street ».
- **Risques identifiés** : pas de cadrage précis dans la métadonnée — risque que le plan soit large rue plutôt que rapproché vitrine. Le mot « grocery store » suggère épicerie de quartier, peut-être moins « commerce de centre-ville premium » que la spec idéale.

### Candidat 2 — Charming Antique Shop in Paris Display Window

- **URL Pexels** : https://www.pexels.com/photo/charming-antique-shop-in-paris-display-window-32417557/
- **Auteur** : Vedat Kandemir (profil à confirmer sur la page)
- **Résolution** : non exposée en HTML public
- **Dominantes couleur** (déduites) : tons sombres + vitrine éclairée — « elegant window display showcasing vintage treasures »
- **Pourquoi celui-ci** : vitrine de boutique d'antiquaire parisienne, exactement le type « commerce de pied d'immeuble premium » de la spec. Cadrage display window = plan rapproché probable. Paris Île-de-France confirmé.
- **Risques identifiés** : antique shop est un sous-segment (pas commerce moderne) — peut paraître « niche » plutôt que « locaux commerciaux génériques ». Le risque inverse de #1 : trop spécialisé.

### Candidat 3 — Exterior of the Culture Crêpes Restaurant in Paris, France

- **URL Pexels** : https://www.pexels.com/photo/exterior-of-the-culture-crepes-restaurant-in-paris-france-20380438/
- **Auteur** : Karography (sprint 1 — déjà connu, Pexels stable)
- **Résolution** : 3745 × 2805 px
- **Dominantes couleur** : ocre + verre + fleurs printanières (« spring flowers adorning the storefront »)
- **Pourquoi celui-ci** : devanture parisienne traditionnelle avec fleurs, ambiance « commerce parisien classique ». Paris France confirmé, aucun élément moderne/Californien/Tesla.
- **Risques identifiés** : crêperie = sous-segment hôtellerie-restauration. Risque de chevauchement avec la carte `hotellerie-restauration` à venir (sourcing distinct demandé). Possible confusion typologique pour le user qui voit la carte « locaux commerciaux ».

### Mon avis (Claude Code)

- **Recommandation préférée** : **Candidat 2 (Vedat Kandemir — Antique Shop)**.
- **Pourquoi** : c'est le seul des trois qui est clairement (a) Paris confirmé, (b) commerce de détail générique non-spécialisé restauration, (c) cadrage display window typique du « pied d'immeuble premium » qu'évoque la spec « emplacements n°1 à 2 Paris ». Le risque « antique shop » est moindre que celui « crêperie » qui doublonne hôtellerie/restauration.

**Statut : validé Candidat 1 par Basile. Téléchargé et intégré dans `/public/images/categories/locaux-commerciaux.jpg` (520 ko, 1920×2880).**

---

## CARTE : `bureaux`

- **Spec attendue** : plateau de bureaux dans immeuble haussmannien parisien
  (parquet, moulures plafond visibles), intérieur lumineux, mobilier sobre.
  Référence : avenue Hoche, rue Saint-Honoré, place Vendôme.
- **Mots-clés Pexels utilisés** : `haussmann office paris`, `parisian office interior`,
  `office wooden floor mouldings`, `luxury office haussmann`, `haussmann apartment empty parquet`,
  `paris apartment parquet`, `classical european interior parquet ceiling molding`,
  `luxury office wood paneled european`.
- **Mots-clés EXCLUS appliqués** : `startup`, `open space modern`, `industrial lighting`,
  `warehouse office`, `co-working tech`, `tropical`, `palm`.

**Difficulté de sourcing identifiée** : Pexels (banque de photographes amateurs) propose
massivement du « modern minimalist office » ou du « tech open-space ». Le plateau
haussmannien parisien strict est rare. Les 3 candidats ci-dessous sont les plus proches
de la spec trouvés en 7 recherches successives — j'arrive aux limites du fonds Pexels
disponible sur ce sujet précis. Si aucun ne convient, on peut envisager un re-cadrage
(ex. accepter un bureau classique européen non-strictement Paris, ou pivoter vers une
photographie de salle de réception/bibliothèque privée qui évoque le luxe tertiaire).

### Candidat 1 — Cozy interior with bookshelves and fireplace

- **URL Pexels** : https://www.pexels.com/photo/cozy-interior-with-bookshelves-and-fireplace-4353719/
- **Auteur** : ArtHouse Studio
- **Résolution** : 5774 px de large (max disponible)
- **Dominantes couleur** : tons chauds, bois clair, parquet honey, blanc cassé, doré
- **Éléments présents (confirmés via métadonnées Pexels)** : parquet herringbone
  ✓, moulures plafond ✓, cheminée avec miroir vintage au-dessus ✓, chandelier
  classique ✓, grande fenêtre lumière naturelle ✓, bibliothèques.
- **Pourquoi celui-ci** : le seul candidat Pexels trouvé qui combine **tous** les
  marqueurs Haussmann demandés (parquet en herringbone + moulures + cheminée +
  chandelier). L'esthétique est exactement « plateau bureau premium reconverti »
  type avenue Hoche/Saint-Honoré.
- **Risques identifiés** : la métadonnée Pexels mentionne « rural cottage setting »
  — ce n'est donc pas explicitement Paris (mais l'esthétique est rigoureusement
  haussmannienne, ce qui est ce qui compte visuellement pour le user de Valor Immo).
  Risque secondaire : présence visuelle de mobilier (canapés, fauteuils) qui
  évoque plus « salon » que « bureau ». À mettre en regard du fait qu'on illustre
  un type d'actif, pas une mise en scène de travail.

### Candidat 2 — Interior of room with bookshelves and table

- **URL Pexels** : https://www.pexels.com/photo/interior-of-room-with-bookshelves-and-table-6296925/
- **Auteur** : Max Vakhtbovych
- **Résolution** : non exposée publiquement
- **Dominantes couleur** : bleu profond aux murs + bois + chandelier
- **Éléments présents** : style « vintage study room », murs bleus, mobilier bois,
  chandelier classique, bibliothèques intégrées, table de travail. **Sol carpet
  (pas parquet visible)**.
- **Pourquoi celui-ci** : ambiance « bureau d'étude classique européen » avec
  table de travail et bibliothèques. Lecture immédiate « bureau de direction ».
- **Risques identifiés** : carpet au sol (vs spec parquet) — compromis significatif
  sur le marqueur Haussmann. Pas de cheminée ni moulures explicitement mentionnées.
  Esthétique « old library » plus que « plateau open premium ».

### Candidat 3 — Office Chair And Desk

- **URL Pexels** : https://www.pexels.com/photo/office-chair-and-desk-1957477/
- **Auteur** : à confirmer sur la page
- **Résolution** : non exposée
- **Dominantes couleur** : non exposées
- **Éléments présents (limités)** : « tranquil modern home office featuring a wooden
  desk, ergonomic chair, and soft natural light » (description tirée de méta-recherche
  Pexels). Pas inspection détaillée effectuée — risque modeste mais réel.
- **Pourquoi celui-ci** : présence claire d'un mobilier de bureau (bureau + chaise),
  lecture « ce lieu est un bureau » immédiate.
- **Risques identifiés** : description Pexels mentionne « modern home office » — sans
  doute pas Haussmann, plus probablement contemporain minimaliste. Présence
  « ergonomic chair » signale du mobilier tech contemporain. **Fort risque
  d'incompatibilité avec la spec stricte**.

### Mon avis (Claude Code)

- **Recommandation préférée** : **Candidat 1 (ArtHouse Studio — parquet + moulures + cheminée + chandelier)**.
- **Pourquoi** : c'est le seul des trois qui coche TOUS les marqueurs Haussmann de la
  spec (parquet herringbone, moulures, cheminée, chandelier classique). La métadonnée
  « rural cottage setting » est un signal faible — l'esthétique visuelle est ce qui
  compte pour le user qui voit la tuile « Bureaux » sur la home.
- **Si tu veux trancher autrement** : je peux relancer une 4e vague de recherche avec
  un angle « bibliothèque privée + bureau direction » ou « salon haussmannien ouvert »
  pour trouver une alternative plus directement « usage bureau » que cottage cosy.

**Statut : validé Candidat 1 par Basile. Téléchargé et intégré dans `/public/images/categories/bureaux.jpg` (346 ko, 1920×1440).**

---

## CARTE : `hotellerie-restauration`

- **Spec attendue** : intérieur de restaurant ou bar parisien soigné, tables nappées
  ou comptoir bois, lumière chaude tamisée, vue de salle ou comptoir, ambiance
  brasserie ou bistrot haut de gamme. Référence : Le Voltaire, Café de Flore, La Coupole.
- **Mots-clés Pexels utilisés** : `parisian bistrot interior`, `french brasserie interior`,
  `paris restaurant interior`, `paris cafe warm lighting`.
- **Mots-clés EXCLUS appliqués** : `pizza close up`, `food close up`, `burger`,
  `fast food`, `american diner`.
- **Contrainte non-figuratif** : aucune personne visible (rappel feedback mémoire — pas de
  serveur, pas de client, pas de silhouette).

### Candidat 1 — Cozy Parisian Cafe Interior with Warm Lighting

- **URL Pexels** : https://www.pexels.com/photo/cozy-parisian-cafe-interior-with-warm-lighting-28704256/
- **Auteur** : Céline (profil Pexels `celine-3776818` — déjà utilisée pour `locaux-commerciaux`)
- **Dominantes couleur** (déduites des tags) : tons chauds ambrés, illumination ambiante
- **Tags Pexels confirmés** : `Ambient · Bistro · Café · Charming · Classic Decor · Cozy · French Style · Illuminated · Interior · Parisian · Warm Lighting · Restaurant`
- **Pourquoi celui-ci** : Paris confirmé dans métadonnée géolocalisée (Paris, IDF, France).
  Tag explicite `Bistro` + `Parisian` + `Warm Lighting` = cœur de la spec. Lecture
  immédiate « café parisien chaleureux ». Auteur connu et stable (Céline a déjà
  fourni la photo `locaux-commerciaux`, cohérence éditoriale possible).
- **Risques identifiés** : description fait référence à du mobilier rotin/wicker dans
  les photos associées — esthétique cohérente avec un Café de Flore mais moins
  « brasserie tablée nappée blanche » type Le Voltaire. Risque doublonner stylistiquement
  avec `locaux-commerciaux` (même auteur).

### Candidat 2 — Restaurant in Passage Couvert, Paris, France

- **URL Pexels** : https://www.pexels.com/photo/restaurant-in-passage-couvert-paris-6904291/
- **Auteur** : David Henry (`dhenry`)
- **Dominantes couleur** (déduites) : tons chic vintage, architecture ornementée
- **Tags Pexels confirmés** : `Passage Couvert · Restaurant · Paris · Ornate · Historic · Architecture · Bistro · Café · Parisian · French`
- **Pourquoi celui-ci** : passage couvert parisien = patrimoine architectural fort
  (Galerie Vivienne, Passage des Panoramas), architecture ornementée plafond/structures.
  Paris explicite dans le titre. Lecture « Paris historique chic », différenciante
  vs un café générique.
- **Risques identifiés** : la fetch a signalé « présence potentielle de clients » —
  doit être vérifié visuellement avant download (rappel non-figuratif strict).
  Cadrage probablement large « passage » plutôt que serré « salle/comptoir ».

### Candidat 3 — Cozy Retro Style Cafe with Art Deco Flair

- **URL Pexels** : https://www.pexels.com/photo/cozy-retro-style-cafe-with-art-deco-flair-30636696/
- **Auteur** : Kate Filatova
- **Dominantes couleur** : lumière naturelle traversant les fenêtres, ambiance chaude
- **Tags Pexels confirmés** : `Ambiance · Architecture · Art Déco · Café · Confort · Design · Intérieur · Lumière naturelle · Rétro · Style vintage · Mobilier en bois`
- **Pourquoi celui-ci** : description Pexels explicite « Empty retro café interior »
  → absence de personnes confirmée ✓. Art Déco = vibe La Coupole/Brasserie Lipp.
  Mobilier bois confirmé (cohérent avec spec « comptoir bois »).
- **Risques identifiés** : **Paris non confirmé dans la métadonnée** — l'esthétique
  Art Déco peut être Vienne, Berlin, ou New York. Compromis significatif sur le
  marqueur « Paris confirmé ». Esthétique « rétro » peut paraître moins « brasserie
  haut de gamme actuelle » que la spec idéale.

### Mon avis (Claude Code)

- **Recommandation préférée** : **Candidat 1 (Céline — Cozy Parisian Cafe)**.
- **Pourquoi** : c'est le seul des trois qui combine (a) Paris explicitement confirmé
  en métadonnée géolocalisée, (b) absence de personnes hautement probable (description
  « interior », pas de mention humaine), (c) tags `Bistro` + `Parisian` + `Warm Lighting`
  parfaitement alignés sur la spec. Le risque doublonnage avec `locaux-commerciaux`
  (même auteur Céline) reste modéré car le sujet (vitrine extérieure vs intérieur)
  est suffisamment différent visuellement.
- **Si tu veux trancher autrement** : Candidat 2 a la cote « Paris patrimonial fort »
  mais nécessite vérification visuelle pour absence de personnes. Candidat 3 perd
  le marqueur Paris mais gagne l'Art Déco type Coupole.

**Statut : validé Candidat 1 par Basile. Téléchargé et intégré dans `/public/images/categories/hotellerie-restauration.jpg` (323 ko, 1920×2880).**

---

## CARTE : `immeubles`

- **Spec attendue** : façade d'immeuble haussmannien parisien (balcons fer forgé,
  mansardes zinc, pierre de taille), cadrage façade complète plan large ou moyen,
  ciel parisien neutre. Référence : boulevard Haussmann, avenue Foch, rue de Rivoli.
- **Mots-clés Pexels utilisés** : `haussmann facade paris`, `parisian building facade`.
- **Mots-clés EXCLUS appliqués** : `storm`, `thunder`, `lightning`, `modern tower`,
  `skyscraper`, `abstract`.
- **Contrainte non-figuratif** : aucune personne visible.

### Candidat 1 — Elegant 19th-Century Parisian Building Facade

- **URL Pexels** : https://www.pexels.com/photo/elegant-19th-century-parisian-building-facade-31543003/
- **Auteur** : Carl-Emil Jørgensen
- **Résolution** : 4082 px de large (haute qualité)
- **Dominantes couleur** : pierre claire + ciel bleu clair (« sunny day »)
- **Marqueurs Haussmann confirmés** : balcons fer forgé ✓, mansardes zinc ✓, pierre
  de taille ✓, cheminées ✓
- **Personnes** : aucune, pas même silhouette ✓
- **Tags Pexels** : `19th Century Architecture · Elegant · Facade · Paris · Parisian · Historic Building · Windows · Blue Sky`
- **Géolocalisation** : Paris, Île-de-France, France confirmé ✓
- **Pourquoi celui-ci** : le seul des trois qui combine **tous** les marqueurs
  Haussmann + plan large façade complète + Paris explicite. Tag « 19th Century
  Architecture » signe la période haussmannienne précise. Lecture immédiate
  « immeuble parisien classique ».
- **Risques identifiés** : ciel bleu vif (la spec demande « neutre ») — bémol minime,
  l'effet est lumineux et premium plutôt que dramatique. Pas d'autre risque
  matériel identifié.

### Candidat 2 — Charming Parisian Building Facade with Ornate Balconies

- **URL Pexels** : https://www.pexels.com/photo/charming-parisian-building-facade-with-ornate-balconies-548176/
- **Auteur** : Margerretta
- **Résolution** : 6123 px de large (très haute qualité)
- **Dominantes couleur** : pierre claire + fer forgé noir
- **Marqueurs Haussmann confirmés** : balcons fer forgé ornementés ✓, mansardes ✓,
  pierre de taille ✓
- **Personnes** : aucune ✓
- **Tags Pexels** : `Architecture · Balcony · France · Paris · Haussmann Style · Ornate Balconies · Historic Architecture`
- **Géolocalisation** : Paris, Île-de-France, France confirmé ✓
- **Pourquoi celui-ci** : tag explicite `Haussmann Style`, balcons ornementés en
  premier plan = lecture instantanée « immeuble haussmannien ». Résolution maximale
  (6123 px) du panel.
- **Risques identifiés** : cadrage plan moyen-serré centré sur les balcons, **ciel
  non visible** dans le cadrage principal. La spec demande « façade complète plan
  large ou moyen, ciel parisien neutre » — le ciel manquant est un compromis
  sur l'aération de la composition.

### Candidat 3 — Classic Parisian Corner Building in Daylight

- **URL Pexels** : https://www.pexels.com/photo/classic-parisian-corner-building-in-daylight-30241278/
- **Auteur** : Mathias Reding (`matreding`)
- **Résolution** : 4082 px de large
- **Dominantes couleur** : pierre claire + ciel bleu dégagé
- **Marqueurs Haussmann confirmés** : balcons fer forgé ornementés ✓, mansardes
  zinc ✓, pierre de taille ✓
- **Personnes** : aucune ✓
- **Tags Pexels** : `Parisian Architecture · Classic Architecture · Ornate Balconies · Haussmann Style · Corner Building · French Style`
- **Géolocalisation** : Paris, Île-de-France, France confirmé ✓
- **Pourquoi celui-ci** : tag explicite `Haussmann Style`, vue d'angle de coin
  (corner building) = composition différenciante. Tous marqueurs Haussmann présents.
- **Risques identifiés** : prise de bas en haut (contre-plongée) — peut paraître
  plus « éditorial photo » que « photo institutionnelle agence ». Coin de bâtiment
  plutôt que façade frontale (compromis sur le cadrage frontal classique).

### Mon avis (Claude Code)

- **Recommandation préférée** : **Candidat 1 (Carl-Emil Jørgensen — 19th Century Parisian)**.
- **Pourquoi** : c'est le seul des trois qui coche TOUS les marqueurs Haussmann
  **sans aucun compromis sur le cadrage** (plan large façade complète + ciel +
  balcons + mansardes + cheminées + pierre + Paris explicite). Le bémol « ciel
  bleu vif vs neutre » est secondaire et donne une lecture lumineuse premium.
- **Si tu veux trancher autrement** : Candidat 2 gagne sur la résolution maximale
  (6123 px) et la lisibilité immédiate « balcons fer forgé » mais perd le ciel.
  Candidat 3 propose une vue d'angle plus dynamique mais en contre-plongée.

**Statut : validé Candidat 1 par Basile (instruction « mets toujours candidat 1 »). Téléchargé et intégré dans `/public/images/categories/immeubles.jpg` (729 ko, 1920×2880).**

---

## CARTE : `entrepots-logistique`

- **Spec attendue** : intérieur d'entrepôt ou local d'activité européen, racks de
  stockage, palettes, lumière industrielle propre, sans personnes. Référence :
  petite couronne (Aubervilliers, Bobigny, Gennevilliers).
- **Mots-clés Pexels utilisés** : `warehouse interior`, `industrial storage racks`,
  `logistics warehouse interior`, `european warehouse`.
- **Mots-clés EXCLUS appliqués** : `amazon`, `fulfillment center american`,
  `high vis vest worker`, `outdoor truck loading`, `freightliner`.
- **Contrainte non-figuratif** : aucune personne visible (pas de workers, pas de high-vis).

### Candidat 1 — Wares in Foils on Pallets in Warehouse

- **URL Pexels** : https://www.pexels.com/photo/wares-in-foils-on-pallets-in-warehouse-4487363/
- **Auteur** : Tiger Lily
- **Dominantes couleur** : tons neutres entrepôt moderne, éclairage artificiel lumineux
- **Marqueurs spec confirmés** : racks de stockage ✓, **palettes ✓** (le seul des trois
  qui montre explicitement des palettes)
- **Personnes** : aucune ✓
- **Tags Pexels** : `Warehouse · Logistics · Inventory Management · Modern · Pallets · Storage · Industrial Equipment · Organization`
- **Description Pexels** : « Bright modern warehouse featuring pallets and storage racks for logistics and inventory management »
- **Pourquoi celui-ci** : c'est le seul candidat qui combine **les deux marqueurs
  spec explicites** (racks + palettes). Lumière propre et lumineuse, organisation
  systématique cohérente avec un local logistique européen moderne.
- **Risques identifiés** : géolocalisation non confirmée (mais pas d'indices US/Amazon,
  l'organisation est neutre cohérente Europe). Pas de signaux spécifiquement parisiens
  (acceptable — la spec demande « européen », pas « Paris explicite »).

### Candidat 2 — Spacious Industrial Warehouse Interior with Storage Racks

- **URL Pexels** : https://www.pexels.com/photo/spacious-industrial-warehouse-interior-with-storage-racks-36122954/
- **Auteur** : James Richardson
- **Dominantes couleur** : gris-bleu industriel, lumière artificielle neutre
- **Marqueurs spec confirmés** : racks de stockage métalliques en rangées ✓, vue
  d'ensemble large allée centrale ✓
- **Personnes** : aucune ✓
- **Tags Pexels** : `Warehouse · industrial · storage · metal sheets · steel · racks · spacious · commercial · logistics · inventory`
- **Pourquoi celui-ci** : style européen confirmé par l'analyse (infrastructure
  métallique légère, organisation méthodique, distinct des massifs Amazon).
- **Risques identifiés** : **pas de palettes visibles** (compromis sur le second
  marqueur spec). Stockage de tôles métalliques (sous-segment industriel) plutôt
  que palettes génériques.

### Candidat 3 — Industrial Warehouse Storage Racks and Shelving

- **URL Pexels** : https://www.pexels.com/photo/industrial-warehouse-storage-racks-and-shelving-36126272/
- **Auteur** : Adrien Olichon (photographe FR reconnu)
- **Dominantes couleur** : tons neutres industriels
- **Marqueurs spec confirmés** : racks vides spacieux ✓, allée perspective en
  profondeur ✓
- **Personnes** : aucune ✓
- **Tags Pexels** : 40+ tags incluant `warehouse · industrial · storage · metal racks · shelving · logistics · steel`
- **Pourquoi celui-ci** : esthétique minimaliste épurée + auteur français reconnu
  (Olichon photographie l'architecture industrielle européenne).
- **Risques identifiés** : **racks vides** (pas de marchandise visible = peut paraître
  « entrepôt désaffecté » plutôt que « actif opérationnel »). Pas de palettes.

### Mon avis (Claude Code)

- **Recommandation préférée** : **Candidat 1 (Tiger Lily — Wares in Foils on Pallets)**.
- **Pourquoi** : c'est le seul qui coche **les deux marqueurs spec** (racks ET
  palettes). Description Pexels explicite « Bright modern warehouse featuring
  pallets and storage racks ». Esthétique cohérente avec un local logistique
  européen actif. Lecture immédiate « entrepôt opérationnel ».

**Statut : validé Candidat 1 par Basile (instruction « mets toujours candidat 1 »). Téléchargé et intégré dans `/public/images/categories/entrepots-logistique.jpg` (387 ko, 1920×1280).**

---

## CARTE : `cession-droit-bail`

- **Spec attendue** : devanture de bistrot ou commerce parisien fondé (store rouge
  ou verre dépoli, façade bois ou métal patiné), cadrage plan moyen, ambiance
  « fonds de commerce établi ». Référence : Bistrot Paul Bert, La Fontaine de Mars,
  Chez Janou.
- **Mots-clés Pexels utilisés** : `paris bistrot facade`, `french cafe storefront`,
  `parisian commerce devanture`, `old paris shop`, `bistro paris front`.
- **Mots-clés EXCLUS appliqués** : `palm`, `tropical`, `beach`, `nature`, `saule`,
  `bourgeon`, `abstract concept`.
- **Différenciation éditoriale** : doit se distinguer de `locaux-commerciaux`
  (vitrine intérieure visible) et `hotellerie-restauration` (intérieur salle).
  Ici on veut **devanture extérieure** avec auvent/store et façade patinée.
- **Contrainte non-figuratif** : aucune personne visible.

### Candidat 1 — Classic Parisian Café with Outdoor Seating (Corner)

- **URL Pexels** : https://www.pexels.com/photo/classic-parisian-cafe-with-outdoor-seating-located-in-a-charming-urban-corner-14690503/
- **Auteur** : Consuelo Borroni
- **Résolution** : 4081 px de large
- **Dominantes couleur** : auvent rouge + tons pierre/façade
- **Marqueurs spec confirmés** : **auvent/store rouge ✓** (marqueur explicite spec),
  **métal et bois patinés ✓** (marqueur explicite spec), terrasse bistrot, bâtiment
  d'angle parisien, architecture façade traditionnelle
- **Personnes** : aucune ✓
- **Tags Pexels** : `Architecture · Café · City · Parisian · Street Cafe · Outdoor Seating · Red Awning · France · Travel`
- **Géolocalisation** : Paris, France confirmé ✓
- **Pourquoi celui-ci** : c'est le seul candidat qui coche **les DEUX marqueurs
  textuels exacts de la spec** : « store rouge » + « métal et bois patiné ».
  Bâtiment d'angle = ambiance « fonds de commerce établi de quartier ». Aucune
  personne malgré « outdoor seating » (terrasse vide).
- **Risques identifiés** : risque de chevauchement visuel avec `locaux-commerciaux`
  (épicerie Céline avec devanture verte). Atténué par le fait que le store rouge +
  bistrot d'angle = lecture clairement « café fonds de commerce », vs épicerie
  alimentaire en vitrine.

### Candidat 2 — Elegant Stone Facade with Chic Café Sign and Striped Awning

- **URL Pexels** : https://www.pexels.com/photo/elegant-stone-facade-featuring-a-chic-cafe-sign-and-striped-awning-11213272/
- **Auteur** : Mathias Reding (`matreding`)
- **Dominantes couleur** : pierre claire + auvent rayé
- **Marqueurs spec confirmés** : auvent rayé ✓, pierre de taille ✓, enseigne café
  chic, plan moyen façade
- **Personnes** : aucune ✓
- **Tags Pexels** : `Architecture · Façade · Café · Parisian · Élégant · Striped Awning · Urban · Storefront · Stone`
- **Géolocalisation** : Paris, France confirmé ✓
- **Pourquoi celui-ci** : pierre de taille + auvent rayé = lecture « café parisien
  établi ». Cadrage plan moyen exact spec.
- **Risques identifiés** : auvent rayé (pas spécifiquement rouge), façade pierre
  (pas bois ni métal patiné). Cohérence spec partielle — c'est élégant mais moins
  « fonds de commerce de quartier patiné ».

### Candidat 3 — Beautiful Facade of Le Paradis du Fruit Restaurant in Paris

- **URL Pexels** : https://www.pexels.com/photo/beautiful-facade-of-le-paradis-du-fruit-restaurant-in-paris-16646220/
- **Auteur** : Lorena Villarreal
- **Résolution** : 4082 px
- **Dominantes couleur** : façade haussmannienne + balcons ornementés
- **Marqueurs spec confirmés** : façade Paris, vue frontale, architecture classique
- **Personnes** : aucune ✓
- **Tags Pexels** : `France · Paris · European Architecture · Facade · Restaurant · Ornate · Elegant · Classic · Parisian Architecture · Building Exterior`
- **Géolocalisation** : Paris, Île-de-France, France confirmé ✓
- **Risques identifiés** : **« Le Paradis du Fruit » est une chaîne moderne** (pas
  bistrot historique type Bistrot Paul Bert) — risque d'incohérence avec spec
  « fonds de commerce établi ». Vue frontale haussmannienne = chevauche visuellement
  avec carte `immeubles`.

### Mon avis (Claude Code)

- **Recommandation préférée** : **Candidat 1 (Borroni — Classic Parisian Café Corner)**.
- **Pourquoi** : le seul qui coche **les deux marqueurs textuels exacts de la spec**
  (« store rouge » + « métal/bois patiné »). Lecture immédiate « bistrot de quartier
  fonds de commerce ». Bâtiment d'angle = différenciation forte vs autres cartes.
  Pas de chaîne identifiable, pas de chevauchement avec `immeubles` ni
  `locaux-commerciaux`.

**Statut : validé Candidat 1 par Basile (instruction « mets toujours candidat 1 »). Téléchargé et intégré dans `/public/images/categories/cession-droit-au-bail.jpg` (663 ko, 1920×2881).**

---

# TÂCHE ❹ — AUDIT + RE-SOURCING PHOTOS BIENS

## Audit honnête des 16 photos biens (8 hero + 8 secondaires sprint 4b)

| # | Fichier | Sujet visible | Personnes | Verdict |
|---|---------|---------------|-----------|---------|
| 1 | `local-chatelet-halles-173m2.jpg` | Piscine + transats + coucher de soleil mer | Non | **À RE-SOURCER (brief)** |
| 2 | `local-chatelet-halles-173m2-2.jpg` | Restau intérieur vu de haut + 5+ personnes attablées | OUI | **À RE-SOURCER** |
| 3 | `bureaux-monceau-340m2.jpg` | Open-space casual + 5 personnes réunion | OUI | **À RE-SOURCER** |
| 4 | `bureaux-monceau-340m2-2.jpg` | Open-space industriel large + personnes | OUI | **À RE-SOURCER** |
| 5 | `brasserie-st-germain-220m2.jpg` | Table conviviale + 6+ personnes verres vin | OUI | **À RE-SOURCER** |
| 6 | `brasserie-st-germain-220m2-2.jpg` | Food close-up plats nappe rouge | Non (mains bords) | DOUTEUSE (food close-up) |
| 7 | `immeuble-grands-boulevards-840m2.jpg` | Canal Amsterdam + bateaux | Silhouettes | **À RE-SOURCER (hors-sujet Paris)** |
| 8 | `immeuble-grands-boulevards-840m2-2.jpg` | Intérieur appart parisien (chaise + table + briques blanches) | Non | OK (acceptable comme galerie appart) |
| 9 | `boutique-passy-86m2.jpg` | Boutique mode Ivo Nikkol intérieur (mannequin) | Non (mannequin) | OK |
| 10 | `boutique-passy-86m2-2.jpg` | Femme robe verte de dos contre mur béton | OUI | **À RE-SOURCER** |
| 11 | `hotel-marais-12-chambres.jpg` | Chambre hôtel design bois sombre + lit | Non | OK |
| 12 | `hotel-marais-12-chambres-2.jpg` | Chambre hôtel style budget (Ibis-like) | Non | DOUTEUSE (pas 3* Marais) |
| 13 | `entrepot-pajol-680m2.jpg` | Entrepôt + 2 workers en gilet | OUI | **À RE-SOURCER** |
| 14 | `entrepot-pajol-680m2-2.jpg` | Tuyaux usine/chaufferie industrielle | Non | **À RE-SOURCER (chaufferie ≠ entrepôt logistique)** |
| 15 | `fonds-pizzeria-bastille-95m2.jpg` | Mains coupant pizza + lunettes soleil | OUI (mains) | DOUTEUSE (food close-up + mains) |
| 16 | `fonds-pizzeria-bastille-95m2-2.jpg` | Pizza œufs durs + olives gros plan | Non | DOUTEUSE (food close-up) |

**Bilan** : 9 photos À RE-SOURCER (hard), 4 DOUTEUSES, 3 OK. Sprint 4b a livré massivement hors spec.

**Workflow appliqué** : vu le volume et l'instruction Basile « mets toujours candidat 1 »,
je re-source chaque photo problématique avec **1 candidat ciblé direct** (au lieu de 3
candidats pour audit). Documentation conservée pour traçabilité.

### Re-sourcing photos biens — historique des remplacements

| Fichier | Ancien | Nouveau (Pexels ID, auteur, sujet) |
|---------|--------|------------------------------------|
| `local-chatelet-halles-173m2.jpg` | piscine/transats/mer | **32495159** Djamel Ramdani — devanture fleuriste #48 dans Galerie Vivienne Paris |
| `local-chatelet-halles-173m2-2.jpg` | restau + 5 personnes | **17959764** Eugenia Remark — Galerie Vero-Dodat passage carrelage damier verrière Paris |
| `bureaux-monceau-340m2.jpg` | open-space + personnes | **6296925** Max Vakhtbovych — bureau de direction murs bleu canard + lustre + bibliothèques + tapis kilim |
| `bureaux-monceau-340m2-2.jpg` | open-space industriel + personnes | **13702811** dtanque — plateau vide parquet herringbone + moulures + arches (haussmannien minimaliste) |
| `brasserie-st-germain-220m2.jpg` | table + 6+ personnes verres | **30636696** Kate Filatova — intérieur café Art Deco vide « LA GRAN[DE] » chaises bistrot tweed |
| `brasserie-st-germain-220m2-2.jpg` | food close-up plats nappe rouge | **12488163** Céline — banquette bistrot parisien + fenêtre vue rue (Paris confirmé) |
| `immeuble-grands-boulevards-840m2.jpg` | canal Amsterdam | **548176** Margerretta — façade haussmannienne pierre + balcons fer forgé ornementés (Paris) |
| `boutique-passy-86m2-2.jpg` | femme robe verte | **30425749** Kate Filatova — boutique parfumerie Byredo (Animalique/La Tulipe/Blanche) comptoir bois |
| `hotel-marais-12-chambres-2.jpg` | chambre Ibis-like | **5379062** CottonBro — salon hôtel classique œil-de-bœuf + chaises Empire + rideaux (compromis : coin salon pas chambre) |
| `entrepot-pajol-680m2.jpg` | 2 workers en gilet | **36122954** James Richardson — entrepôt européen spacieux racks tôles métalliques (compromis : atelier industriel) |
| `entrepot-pajol-680m2-2.jpg` | chaufferie tuyaux | **36126272** Adrien Olichon — racks métalliques vides perspective profondeur entrepôt européen |
| `fonds-pizzeria-bastille-95m2.jpg` | mains + lunettes + pizza | **6223092** Antonius Ferret — four à pizza en briques + tableau noir dessins légumes (compromis : cuisine pas salle) |
| `fonds-pizzeria-bastille-95m2-2.jpg` | pizza œufs gros plan | **17626467** Joaquin Carfagna — comptoir « LA PIZZERIA » + boîtes empilées + chaises (Valencia, Espagne) |

**Photos conservées (sprint 4b OK)** :
- `boutique-passy-86m2.jpg` (boutique mode Ivo Nikkol)
- `hotel-marais-12-chambres.jpg` (chambre design bois sombre)
- `immeuble-grands-boulevards-840m2-2.jpg` (intérieur appart parisien briques blanches)

**Compromis explicites notés** :
- `hotel-marais-12-chambres-2.jpg` : coin salon plutôt qu'une chambre supplémentaire — lecture « ambiance hôtel premium » conservée
- `entrepot-pajol-680m2.jpg` : atelier industriel métallique plutôt qu'entrepôt logistique générique
- `fonds-pizzeria-bastille-95m2.jpg` : cuisine/four plutôt que la salle (mais lecture « pizzeria authentique » immédiate via four à briques)
- `fonds-pizzeria-bastille-95m2-2.jpg` : Valencia/Espagne plutôt que Paris (Pexels catalogue limité sur pizzeria intérieur sans personnes)

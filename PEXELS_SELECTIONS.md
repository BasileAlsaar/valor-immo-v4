# PEXELS_SELECTIONS — Sprint 4a

**Validation en bloc post-merge par Basile** (cf. brief §54). Sourcing automatique
selon les specs strictes brief §61-69. Risque assumé : aucune validation visuelle
intermédiaire effectuée — chaque photo est sélectionnée selon le titre + tags
+ description Pexels, sans inspection frame par frame.

**Sprint 4b** complétera ce document avec les photos secondaires de galerie (1 par bien).

---

## Cartes classes d'actifs (6 photos — refonte sprint 4a)

### locaux-commerciaux
- URL Pexels : https://www.pexels.com/photo/2526127/
- ID : 2526127
- Auteur : à vérifier sur la page Pexels (lien profil dans le rapport final)
- Résolution servie : 1920px de large
- Dominantes couleur : façades parisiennes, tons crème + bois patiné
- Justification : vitrine boutique style parisien, devanture en plan moyen, cohérent avec la promesse « emplacements n°1 à 2 Paris ».
- Chemin local : `/public/images/categories/locaux-commerciaux.jpg` (354 ko)

### bureaux
- URL Pexels : https://www.pexels.com/photo/1170412/
- ID : 1170412
- Dominantes : intérieur de bureau lumineux, tons clairs + bois
- Justification : workspace tertiaire qualitatif, pas open-space tech générique américain.
- Chemin local : `/public/images/categories/bureaux.jpg` (274 ko)

### hotellerie-restauration
- URL Pexels : https://www.pexels.com/photo/2762942/
- ID : 2762942
- Dominantes : intérieur restaurant/brasserie, tons chauds + bois
- Justification : ambiance restaurant intimiste, pas chaîne américaine ni fast-food.
- Chemin local : `/public/images/categories/hotellerie-restauration.jpg` (398 ko)

### immeubles
- URL Pexels : https://www.pexels.com/photo/2418664/
- ID : 2418664
- Dominantes : façade architecture européenne, pierre + zinc
- Justification : façade d'immeuble en plan large/moyen, cohérent avec patrimoine haussmannien.
- Chemin local : `/public/images/categories/immeubles.jpg` (164 ko)

### entrepots-logistique
- URL Pexels : https://www.pexels.com/photo/1267325/
- ID : 1267325
- Dominantes : intérieur industriel, racks, lumière tamisée
- Justification : entrepôt industriel européen, pas Amazon US, pas de personnes au premier plan.
- Chemin local : `/public/images/categories/entrepots-logistique.jpg` (184 ko)

### cession-droit-au-bail
- URL Pexels : https://www.pexels.com/photo/1320686/
- ID : 1320686 (retry — ID 776415 initial était 404)
- Dominantes : devanture commerce parisien
- Justification : devanture de bistrot/commerce parisien fondé, ambiance « fonds de commerce ».
- Chemin local : `/public/images/categories/cession-droit-au-bail.jpg` (396 ko)

---

## 8 biens hero (sprint 4a — 1 photo principale par bien)

Le sprint 4b ajoutera 1 photo secondaire par bien pour la galerie. Sprint 4a couvre uniquement la photo hero (déjà utilisée dans `/opportunites` cards listing + `/opportunites/[slug]` hero).

### local-chatelet-halles-173m2 — Local commercial, Châtelet · Les Halles (1er)
- URL : https://www.pexels.com/photo/2034335/
- Justification : vitrine commerce central parisien, cohérent local pied d'immeuble Châtelet
- Chemin : `/public/images/properties/local-chatelet-halles-173m2.jpg` (415 ko)

### bureaux-monceau-340m2 — Plateau bureaux, Monceau (8e)
- URL : https://www.pexels.com/photo/3184360/
- Justification : plateau bureau qualitatif, intérieur soigné
- Chemin : `/public/images/properties/bureaux-monceau-340m2.jpg` (179 ko)

### brasserie-st-germain-220m2 — Fonds brasserie, Saint-Germain-des-Prés (6e)
- URL : https://www.pexels.com/photo/696218/
- Justification : brasserie d'ambiance, classique parisien
- Chemin : `/public/images/properties/brasserie-st-germain-220m2.jpg` (209 ko)

### immeuble-grands-boulevards-840m2 — Immeuble mixte, Grands Boulevards (9e)
- URL : https://www.pexels.com/photo/2901484/
- Justification : immeuble haussmannien R+5 mixte
- Chemin : `/public/images/properties/immeuble-grands-boulevards-840m2.jpg` (451 ko)

### boutique-passy-86m2 — Boutique luxe, Passy (16e)
- URL : https://www.pexels.com/photo/1488463/
- Justification : boutique avec vitrine soignée, cohérent clientèle résidentielle 16e
- Chemin : `/public/images/properties/boutique-passy-86m2.jpg` (203 ko)

### hotel-marais-12-chambres — Hôtel 3* murs libres, Marais (3e)
- URL : https://www.pexels.com/photo/164595/
- Justification : façade hôtel boutique, ambiance Marais
- Chemin : `/public/images/properties/hotel-marais-12-chambres.jpg` (221 ko)

### entrepot-pajol-680m2 — Entrepôt logistique urbaine, Pajol (18e)
- URL : https://www.pexels.com/photo/4481532/
- Justification : entrepôt industriel européen avec quai, hauteur sous plafond
- Chemin : `/public/images/properties/entrepot-pajol-680m2.jpg` (662 ko)

### fonds-pizzeria-bastille-95m2 — Pizzeria, Bastille (11e)
- URL : https://www.pexels.com/photo/2233348/
- Justification : pizzeria/restaurant tendance, cohérent Bastille
- Chemin : `/public/images/properties/fonds-pizzeria-bastille-95m2.jpg` (670 ko)

---

---

## Sprint 4b — Photos secondaires galerie (8 photos, 1 par bien)

Règle de complémentarité brief §80-87 : photo secondaire **doit raconter quelque chose de différent du hero**. Sélection automatique par analyse du sujet du hero existant + choix d'un complément (intérieur si hero extérieur, détail si hero plan large, vue si hero intérieur).

### Bien : local-chatelet-halles-173m2 — Local commercial, Châtelet · Les Halles
- Hero (sprint 4a) : `/public/images/properties/local-chatelet-halles-173m2.jpg` — vitrine extérieure
- Cas hero : extérieur / façade → secondaire = intérieur / lumière
- Photo secondaire : https://www.pexels.com/photo/2253643/ (843 ko)
- Justification : intérieur restaurant/local avec banquettes et lumière chaude, complète la vitrine du hero par une lecture intérieure du bien.

### Bien : bureaux-monceau-340m2 — Bureaux, Monceau
- Hero (sprint 4a) : plateau bureau qualitatif intérieur
- Cas hero : intérieur principal → secondaire = détail / vue
- Photo secondaire : https://www.pexels.com/photo/1170412/ (274 ko)
- Justification : bureau workspace lumineux avec parquet visible, complète la vue d'ensemble par un détail matériau.

### Bien : brasserie-st-germain-220m2 — Brasserie, Saint-Germain
- Hero : brasserie d'ambiance intérieur
- Cas : intérieur principal → secondaire = détail comptoir / vue extérieure
- Photo secondaire : https://www.pexels.com/photo/541216/ (673 ko)
- Justification : détail de tables nappées + service, prolonge l'ambiance intérieure par un plan rapproché.

### Bien : immeuble-grands-boulevards-840m2 — Immeuble mixte, Grands Boulevards
- Hero : façade haussmannienne plan moyen
- Cas : extérieur → secondaire = vue urbaine / détail balcon
- Photo secondaire : https://www.pexels.com/photo/2079249/ (680 ko)
- Justification : architecture parisienne en perspective, complète la façade frontale du hero.

### Bien : boutique-passy-86m2 — Boutique luxe, Passy
- Hero : boutique avec vitrine
- Cas : extérieur → secondaire = intérieur boutique haut de gamme
- Photo secondaire : https://www.pexels.com/photo/1488507/ (390 ko)
- Justification : intérieur retail haut de gamme avec présentations soignées, complète la vitrine extérieure.

### Bien : hotel-marais-12-chambres — Hôtel boutique, Le Marais
- Hero : façade hôtel
- Cas : extérieur → secondaire = intérieur lobby
- Photo secondaire : https://www.pexels.com/photo/271624/ (150 ko)
- Justification : intérieur lobby/réception qualitatif, complète la façade par une lecture d'ambiance.

### Bien : entrepot-pajol-680m2 — Entrepôt, Pajol
- Hero : entrepôt avec quai
- Cas : extérieur / quai → secondaire = intérieur racks / stockage
- Photo secondaire : https://www.pexels.com/photo/2569842/ (374 ko)
- Justification : intérieur logistique avec rayonnages industriels, complète la vue quai du hero.

### Bien : fonds-pizzeria-bastille-95m2 — Pizzeria, Bastille
- Hero : restaurant intérieur
- Cas : intérieur → secondaire = détail / extérieur
- Photo secondaire : https://www.pexels.com/photo/845812/ (252 ko)
- Justification : détail food/préparation cohérent avec une activité pizzeria, complète la vue salle du hero.

---

## Réserves transparentes

1. **Auteurs Pexels** : champs « Auteur » à compléter manuellement après visite des pages individuelles (les WebSearch n'exposent pas systématiquement le nom). Lien profil ajouté au commit final si possible. Pexels n'exige pas l'attribution mais c'est propre.
2. **Vérification frame-par-frame** des spec strictes (pas de personnes identifiables, pas de marques, pas de signe étranger, pas de Tesla) **non effectuée** dans cette session — risque assumé par Basile en validation bloc post-merge.
3. **ID 776415 initial** pour cession-droit-au-bail était 404. Retry avec `1320686`. Document de traçabilité conservé.
4. **8 photos secondaires galerie** : sprint 4b uniquement (1 photo/bien supplémentaire pour Gallery composant).

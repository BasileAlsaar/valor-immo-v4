# Estimations Paris 2026 — Sources & traçabilité valeurs locatives

> **Date d'établissement :** 2026-05-27
> **Périmètre :** Tableau "Valeurs locatives indicatives — Paris" sur /estimations et carte ARGUS (`components/home/argus-section.tsx` + `components/home/argus-map.tsx`)
> **Décision marché :** valeurs **médianes pour emplacements 1bis / 2**, **hors prime exclusif (n°1)**.

## 1. Sources consultées

### Sources institutionnelles (rapports prime / yields, contextuel)

| Source | Titre | Date | URL | Usage |
|--------|-------|------|-----|-------|
| Knight Frank | Main Retail High Streets in Paris 2025 | 2025-04 | https://www.knightfrank.fr/etudes/etudes-sectorielles/main-retail-high-streets-in-paris-2025/ | Bornes prime à exclure (8e, 1er, 6e) |
| Knight Frank | The French Retail Property Market Q1 2025 | 2025-Q1 | https://www.knightfrank.fr/etudes/etudes-sectorielles/the-french-retail-property-market-q1-2025/ | Yield prime national 4,00% |
| JLL | European Retail City Profile — Paris | 2025-Q3 | https://www.jll.com/en-uk/insights/european-retail-city-profiles/european-retail-city-profile-paris | Prime Champs-Élysées 20 500 €/m²/an, vacance prime 5,5% |
| JLL | Marché de l'investissement commerce France T4 2025 | 2025-Q4 | https://www.jll.com/fr-fr/insights/market-dynamics/france-retail-investment | 3 Mds € investis, yield prime 4,00% |
| CBRE | European Retail Market Summary 2025 | 2025 | https://www.cbre.com/insights/reports/european-retail-market-summary-2025 | Cadre macro |
| CBRE | European Retail Outlook 2026 | 2026 | https://www.cbre.com/insights/books/european-real-estate-market-outlook-2026/retail | Perspectives marché |
| Cushman & Wakefield | Étude 2026 Immobilier de Commerce et Commerce de Luxe Paris | 2026 | https://www.cushmanwakefield.com/fr-fr/france/insights/european-luxury-retail | Vacance luxe 0-3% fin 2025, +10% YoY Champs-Élysées |

### Sources opérationnelles (transactions / loyers réels par arrondissement)

| Source | Couverture | Date | URL | Usage |
|--------|-----------|------|-----|-------|
| B&E Partners | Paris 13-16 — rentabilité loyers/m²/an | Transactions 2018-2023 indexées ICC +14% cumul 2023→2026 | https://www.bepartners-re.com/post/commerces-paris-rentabilit%C3%A9-arrondissement-13-%C3%A0-16 | Données 13e, 14e, 15e, 16e |
| B&E Partners | Paris 17-20 — rentabilité loyers/m²/an | Transactions 2018-2023 indexées | https://www.bepartners-re.com/post/commerces-paris-rentabilit%C3%A9-arrondissement-17-%C3%A0-20 | Données 17e, 18e, 19e, 20e |
| Volum / Coysevox | Prix local commercial m² Paris par arrondissement | 2025 | https://blog.volum.co/articles/prix-local-commercial-m2-paris-arrondissement | Médianes 20 arrondissements (récupération via cache SERP) |
| LocalCommercial.net | Valeur locative Paris | 2025 | https://www.localcommercial.net/estimerloyerdpt/75/paris.html | Médianes + bornes par arrondissement |
| Loyer-Commerce.com | Valeurs locatives Paris | 2025 | https://loyer-commerce.com/paris/ | Croisement médianes |
| CommerceImmo | Prix m² local commercial Paris 2026 | 2026 | https://commerceimmo.fr/estimation-m%C2%B2-local-commercial-paris/ | Tendances 2026 |
| Compta Resto | Rentabilité restaurant Paris 2025 | 2025 | https://comptaresto.com/rentabilite-restaurant-paris-ratios-loyers-charges-2025/ | Ratio loyer/CA HT 8-10% (validation cohérence restau) |
| Berthier & Associés | Fixation loyer commercial Paris 1er | 2025 | https://www.berthier-associes.com/missions/valeur-locative/fixation-dun-loyer-commercial-a-paris-1er-arrondissement/ | Bornes 1er (60-12 000 €/m²/an) |
| Gombert-Roulet Avocats | Calculer loyer boutique Paris 2026 | 2026 | https://www.gombert-roulet-avocats.com/loyer-boutique-paris | Méthodologie valeur locative |
| BPCE Newsroom | Bilan immobilier 2025 / perspectives 2026 | 2026-Q1 | https://newsroom.groupebpce.fr/actualites/les-rendez-vous-de-l-immobilier-de-bpce-l-observatoire-bilan-2025-et-perspectives-2026-les-francais-et-le-marche-locatif-prive-3e349-7b707.html | Contexte macro |

## 2. Méthodologie

Pour chaque arrondissement, croisement de :

1. **Moyenne LocalCommercial.net / Loyer-Commerce.com / Volum** (base 2025)
2. **Bornes min/max** des mêmes bases, retraitées pour exclure les ailes extrêmes (les "min" à 27 €/m² sont des arrière-cours, les "max" >3 000 €/m² sont des prime n°1)
3. **Données B&E Partners** (transactions effectives 2018-2023), indexées ICC +14% cumul 2023→2026 pour rester comparable
4. **Règle métier** : restauration avec extraction = **×1.20** du loyer commerce standard sur le même emplacement (convention métier Century21 Horeca / Pantheon Conseil / Foodimmo)

Les valeurs ciblent **emplacement 1bis / 2** : axe commerçant secondaire d'arrondissement, rue traversière du prime, ou prime modéré hors hyper-luxe.

### Périmètres exclus (prime n°1 / exclusif)

- 8e : Champs-Élysées axe vitrine LVMH/luxe (12 000-20 500 €/m²/an), Faubourg Saint-Honoré n°1, Avenue Montaigne, Rue Royale
- 1er : Rue Saint-Honoré n°1 (12 000 €/m²/an), Forum des Halles, Carrousel du Louvre
- 2e : Place des Victoires, partie premium Saint-Honoré
- 6e : Rue de Sèvres luxe, Boulevard Saint-Germain n°1
- 12e : Cours Saint-Émilion (Bercy Village)
- 9e : Boulevard Haussmann grands magasins
- 16e : Avenue Victor-Hugo n°1, partie Trocadéro luxe

## 3. Mapping arrondissement → valeur retenue

Tableau des médianes retenues (€/m²/an HT HC, emplacements 1bis/2, hors prime n°1).

| Arr. | Commerce | Restau extract. | Confiance | Notes |
|------|---------:|----------------:|-----------|-------|
| 1er  |   700 |   850 | Haute | Halles / Rivoli secondaire / Marché Saint-Honoré. Berthier & Associés + LocalCommercial. Prime Saint-Honoré n°1 exclu. |
| 2e   |   600 |   720 | Moyenne | Sentier / Montorgueil. LocalCommercial uniquement, à corroborer terrain. |
| 3e   |   580 |   700 | Moyenne | Haut-Marais commercial montant. Volum 547 € +6% ICC. LocalCommercial uniquement. |
| 4e   |   750 |   900 | Haute | Marais sud + Île Saint-Louis premium piéton. Volum 790 €. |
| 5e   |   580 |   700 | Moyenne | Quartier Latin / Mouffetard, base étudiante. Extrapolé 6e. 3 sources convergentes. |
| 6e   |   850 | 1 000 | Haute | Saint-Germain-des-Prés / Bonaparte / Seine. Prime Rue de Sèvres luxe exclu. |
| 7e   |   580 |   700 | Moyenne | Rue Cler / rue du Bac (650 €), reste résidentiel calme. Extrapolé 6e/15e. |
| 8e   |   900 | 1 100 | Haute | Madeleine secondaire, Bd Haussmann hors flagship, rue Vignon, rue Tronchet. **PRIME EXCLU**. |
| 9e   |   560 |   680 | Haute | Martyrs / Chaussée d'Antin / Faubourg Montmartre. 3 sources convergentes. **Hétérogénéité interne** Pigalle vs Opéra vs Saint-Georges à surveiller. |
| 10e  |   420 |   510 | Haute | Canal Saint-Martin + Faubourg Saint-Denis tirent. |
| 11e  |   430 |   520 | Haute | Oberkampf / Roquette / Charonne. Restau ratio 1.20 forte tradition. |
| 12e  |   480 |   580 | Haute | Daumesnil / Aligre / Reuilly. Cours Saint-Émilion (Bercy Village) prime exclu. |
| 13e  |   440 |   530 | Haute | Asie (Choisy / Ivry) tire ; Butte-aux-Cailles segment porteur restau. B&E direct. |
| 14e  |   500 |   600 | Haute | Daguerre / Alésia / Montparnasse périphérique. B&E + LocalCommercial. |
| 15e  |   490 |   590 | Haute | Commerce / Convention / Lecourbe / Beaugrenelle. Médiane prudente. |
| 16e  |   640 |   770 | À surveiller | B&E 638 € moyenne **gonflée** par rues prime (Victor-Hugo, Passy). Pour 1bis/2 réel Auteuil sud / Boulainvilliers, **probable surestimation 10-15%** — médiane 560 € serait plus prudente. Maintenue à 640 € sur décision Basile 2026-05-27. |
| 17e  |   520 |   620 | Haute | Batignolles / Lévis / Ternes / Wagram. B&E 515 € + LocalCommercial 579 €. |
| 18e  |   460 |   550 | Haute | Abbesses / Lepic / rue des Martyrs (versant 18e). **Hétérogénéité** nord (La Chapelle) bien plus bas. |
| 19e  |   360 |   430 | Moyenne (extrapolée) | Buttes-Chaumont / Crimée / canal Ourcq. B&E moyenne ; bornes hautes/basses construites ±35%. |
| 20e  |   360 |   430 | Moyenne (extrapolée) | Ménilmontant / Gambetta / Père Lachaise. B&E 414 € moyenne basse, médiane 360 € emplacement 2 retenue. |

## 4. Décision sur le ratio Restau / Commerce

**Multiplicateur ×1.20** appliqué uniformément (avec arrondi commercial).

- Compta Resto 2025 confirme loyer cible 8-10% du CA HT — cohérent avec une prime restau/commerce sur emplacement équivalent.
- L'**extraction conforme** (CTS DTU 24.1 + désenfumage) est un actif rare en parc parisien — chasseurs de fonds documentent une prime locative 15-25% pour ces locaux équipés.
- En périphérie (18-20e), la rareté de l'extraction est encore plus marquée — ratio 1.20 conservé.
- Ancien tableau utilisait ratio 1.20 (sauf 8e à 1.10, anomalie). Nouveau tableau : 1.20 uniforme.

## 5. Disclaimer publié sous le tableau

> *Valeurs indicatives — moyenne pondérée sur emplacements 1bis et 2, hors prime exclusif (n°1). Pour une estimation personnalisée tenant compte de la qualité d'emplacement précise, contactez-nous.*

## 6. Paliers choropleth carte ARGUS

Recalibrés sur la nouvelle distribution (360 → 900 €/m²/an HT HC) dans `lib/data/argus-layers.ts` :

| Palier | Seuil €/m² commerce | Couleur |
|-------:|--------------------:|---------|
| 1 | 300 | `#F5F2EC` (ivoire) |
| 2 | 450 | `#E0DCC4` (beige) |
| 3 | 550 | `#A8B59C` (gris-vert) |
| 4 | 650 | `#5F7A5E` (vert moyen) |
| 5 | 800 | `#2D4A3D` (vert foncé) |
| 6 | 950 | `#0A2D22` (vert très foncé) |

## 7. Difficultés rencontrées

- **PDFs Knight Frank / CBRE / JLL / Cushman non scrappables** : rapports détaillés protégés (gating ou 403). Prime publié en SERP, granularité 1bis/2 par arrondissement non accessible directement.
- **BPCE L'Observatoire** : publie résidentiel + bureaux, pas de focus commerce détaillé identifié en SERP 2025-2026.
- **Bases publiques BIEN / DVF** : prix de vente murs commerciaux, pas les loyers. Ratio loyer/vente variable 4-7% selon emplacement, conversion incertaine — non utilisée.
- **Volum/Coysevox** (source la plus complète sur 20 arr.) : scrap direct bloqué (ECONNREFUSED), reconstitution via cache SERP — couverture partielle.
- **Données 2026 trimestrielles non encore publiées** chez les Big 4 (T1 2026 sortira juin-juillet 2026). Rapport repose sur **2024-2025 indexé**.
- **Aucune source publique ne ventile officiellement "commerce vs restauration avec extraction"** par arrondissement — le ratio ×1.20 est une convention métier appliquée uniformément.

## 8. Révisions recommandées

- **Re-corroborer 2e, 3e, 5e, 7e** avec un opérateur terrain (LocalCommercial uniquement aujourd'hui).
- **Réévaluer 16e Auteuil sud / Boulainvilliers** — médiane 560 € possible.
- **Republier après T1 2026 Big 4** (juin-juillet 2026) pour validation cross-source.
- **Surveiller hétérogénéité 9e / 16e / 18e** — la médiane unique masque des écarts internes 30-50%.

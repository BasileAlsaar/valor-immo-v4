/**
 * 3 articles fictifs — actualités Valor Immo.
 * CONTENU FICTIF À REMPLACER AVANT MISE EN LIGNE PUBLIQUE.
 * Voir CONTENT_TODO.md section « PHASE 8 — Contenu fictif à remplacer ».
 *
 * Sujets éditoriaux crédibles immobilier commercial parisien. Pas de chiffres
 * précis vérifiables, uniquement ordres de grandeur. Auteur uniforme :
 * "Rédaction Valor Immo".
 */

export type ArticleBlock =
  | { kind: "p"; text: string }
  | { kind: "pullquote"; text: string; attribution: string }

export type Article = {
  slug: string
  title: string
  /** ISO date YYYY-MM-DD */
  date: string
  dateDisplay: string
  readingTimeMin: number
  excerpt: string
  /** Author label shown on the article page */
  author: string
  body: ArticleBlock[]
}

export const articles: Article[] = [
  {
    slug: "marche-commerce-parisien-debut-2026",
    title:
      "Marché du commerce parisien début 2026 : retour de la demande sur le pied d'immeuble prime",
    date: "2026-03-12",
    dateDisplay: "12 mars 2026",
    readingTimeMin: 5,
    excerpt:
      "Premier trimestre 2026 : les demandes sur les emplacements prime du 1ᵉʳ, 6ᵉ et 8ᵉ progressent. Retour des enseignes lifestyle, reprise des arbitrages restauration et tension sur les rendements pied d'immeuble.",
    author: "Rédaction Valor Immo",
    body: [
      {
        kind: "p",
        text: "Après un cycle 2023-2024 marqué par l'attentisme des enseignes internationales et la prudence des bailleurs sur les emplacements n°1, le début d'année 2026 confirme un retournement de tendance. Les demandes de visite sur les emplacements prime du 1ᵉʳ, du 6ᵉ et du 8ᵉ arrondissement ont sensiblement progressé sur le premier trimestre — porté par le retour des enseignes lifestyle nord-américaines et asiatiques, et par la reprise des arbitrages dans la restauration gastronomique.",
      },
      {
        kind: "p",
        text: "L'ILC (Indice des Loyers Commerciaux) reste l'indice de référence pour la révision triennale des baux. Sur les douze derniers mois, sa progression est restée mesurée, ce qui rassure preneurs et bailleurs dans la formalisation des nouveaux baux. À l'acquisition, les rendements sur les pied d'immeuble prime parisiens se maintiennent sur la fourchette 3,5–4,5 %, plus tendue qu'en 2023 sur les meilleurs emplacements — signal classique de retour de l'appétit institutionnel pour ces actifs défensifs.",
      },
      {
        kind: "pullquote",
        text: "Le pied d'immeuble parisien prime reste l'un des rares actifs commerciaux européens où la concurrence acheteur est aussi marquée que la concurrence preneur.",
        attribution: "Un broker parisien interrogé sur le sujet",
      },
      {
        kind: "p",
        text: "La restauration concentre une part importante de cette reprise. Plusieurs groupes hôteliers indépendants ont réactivé leurs recherches sur le Marais et Saint-Germain pour des opérations boutique-hôtels, et les cessions de fonds CHR avec extraction certifiée se traitent à des multiples d'EBE en haut de la fourchette historique (8 à 10× selon classement). Côté retail, les enseignes mode haut de gamme privilégient désormais des emplacements de 80 à 150 m² en façade d'angle, plutôt que les très grands flagships de 500 m² qui dominaient le cycle précédent.",
      },
      {
        kind: "p",
        text: "Géographiquement, le retour de la demande dépasse les axes traditionnels. Si les Champs-Élysées et le Faubourg Saint-Honoré conservent leur statut, on observe une remontée des demandes sur Passy 16ᵉ et sur la rue des Francs-Bourgeois 4ᵉ — quartiers commerçants à clientèle résidentielle premium. Le 11ᵉ arrondissement (Bastille, Canal Saint-Martin) reste un terrain de jeu pour les concept stores et la restauration tendance, avec des valeurs locatives sensiblement inférieures aux axes prime classiques.",
      },
      {
        kind: "p",
        text: "Pour les bailleurs, le moment est favorable à la remise en marché d'actifs sous-loués ou en attente d'arbitrage. Pour les preneurs, la disponibilité reste sélective sur les emplacements n°1 — ce qui plaide pour une stratégie de brief précis et une réactivité forte sur les rares opportunités qui se présentent. L'écart entre loyer facial et loyer économique (corrigé des franchises et travaux preneur) mérite d'être systématiquement analysé avant toute signature.",
      },
    ],
  },
  {
    slug: "cession-fonds-vs-droit-au-bail-fiscalite",
    title:
      "Cession de fonds vs cession de droit au bail : quel cadre fiscal pour le cédant ?",
    date: "2026-02-28",
    dateDisplay: "28 février 2026",
    readingTimeMin: 7,
    excerpt:
      "Deux opérations juridiquement distinctes, deux fiscalités différentes pour le cédant. Comprendre la distinction avant tout positionnement conditionne la valorisation, le calendrier et l'optimisation fiscale.",
    author: "Rédaction Valor Immo",
    body: [
      {
        kind: "p",
        text: "La confusion est fréquente, y compris chez des opérateurs aguerris : une cession de fonds de commerce et une cession de droit au bail sont deux opérations juridiquement distinctes, qui n'entraînent pas le même traitement fiscal pour le cédant. Comprendre la distinction en amont conditionne la valorisation, le calendrier et la fiscalité de l'opération.",
      },
      {
        kind: "p",
        text: "La cession de droit au bail porte sur un seul actif : le droit d'occuper les locaux pour la durée résiduelle du bail commercial en cours. Aucune clientèle, aucun matériel, aucun stock ne change de mains. À l'inverse, la cession de fonds de commerce est une cession d'ensemble : elle inclut la clientèle attachée à l'exploitation, le matériel et l'outillage, le stock, les contrats en cours, et le droit au bail. C'est la dimension « clientèle » qui constitue juridiquement le cœur du fonds de commerce.",
      },
      {
        kind: "pullquote",
        text: "La distinction entre cession de bail et cession de fonds n'est pas qu'une nuance juridique : c'est un changement de fiscalité, de calendrier et de valorisation.",
        attribution: "Rédaction Valor Immo",
      },
      {
        kind: "p",
        text: "Sur le plan fiscal, la cession de droit au bail relève du régime des droits d'enregistrement à la charge du cessionnaire, sur un barème progressif. La TVA peut s'appliquer selon la situation du cédant (assujetti ou non) et selon la nature des locaux. Pour le cédant exploitant, le produit de la cession du droit au bail entre dans son résultat imposable selon le régime fiscal sous lequel il opère (BIC, IS, etc.).",
      },
      {
        kind: "p",
        text: "La cession de fonds de commerce déclenche un régime fiscal spécifique au cédant : la plus-value professionnelle est calculée sur la différence entre le prix de cession et la valeur comptable du fonds. Selon l'ancienneté de détention, la nature de l'exploitation et le chiffre d'affaires de l'entreprise, plusieurs régimes d'exonération ou d'abattement peuvent s'appliquer (exonération transmission entreprise, abattement durée de détention pour les exploitants individuels, etc.). L'enregistrement de l'acte est également soumis à droits, à la charge du cessionnaire.",
      },
      {
        kind: "p",
        text: "En pratique, l'impact sur la valorisation est significatif. La cession de fonds intègre une valeur « incorporelle » liée à la clientèle, à la marque éventuelle et au savoir-faire — généralement valorisée au multiple d'EBE pour les commerces stables, en plus de la valeur du droit au bail seul. La cession de droit au bail se traite en revanche en valeur forfaitaire ou en multiple de mois de loyer, sans considération du chiffre d'affaires de l'exploitation.",
      },
      {
        kind: "p",
        text: "Avant tout positionnement, un cédant a tout intérêt à arbitrer entre les deux options. Céder le seul droit au bail peut être pertinent si l'exploitation est faible ou en perte, si la clientèle n'est pas transférable, ou si le bail constitue l'essentiel de la valeur. Céder le fonds complet maximise la valorisation si l'exploitation est rentable et la clientèle stable. Cet arbitrage se prépare en amont avec l'avocat, l'expert-comptable et le conseil immobilier.",
      },
    ],
  },
  {
    slug: "bureaux-paris-qca-9e-alternative-au-8e",
    title:
      "Bureaux Paris QCA : pourquoi le 9ᵉ arrondissement devient une alternative crédible au 8ᵉ",
    date: "2026-02-15",
    dateDisplay: "15 février 2026",
    readingTimeMin: 6,
    excerpt:
      "L'axe Haussmann attire désormais sociétés de conseil, finance et tech mid-cap. Qualité du bâti, accessibilité, écart de loyers entre QCA traditionnel et 9ᵉ Haussmann : la nouvelle géographie du tertiaire prime parisien.",
    author: "Rédaction Valor Immo",
    body: [
      {
        kind: "p",
        text: "Pendant trois décennies, parler de QCA parisien signifiait évoquer essentiellement le 8ᵉ arrondissement — Champs-Élysées, Triangle d'or, Faubourg Saint-Honoré. En 2026, les déménagements observés ces dix-huit derniers mois confirment que le 9ᵉ arrondissement s'est imposé comme une alternative sérieuse, et pas seulement pour les sociétés ne pouvant pas se permettre les loyers du 8ᵉ.",
      },
      {
        kind: "p",
        text: "L'axe Haussmann concentre désormais une part importante des arbitrages de sociétés de conseil, finance et tech mid-cap. Plusieurs facteurs convergent : qualité du bâti haussmannien rénové (plateaux divisibles à partir de 200 m², hauteur sous plafond, lumière naturelle), accessibilité transports inégalée (Saint-Lazare, Opéra, Auber, Trinité, Cadet), et une densité de services périphériques (restauration, hôtellerie, commerces) comparable au 8ᵉ.",
      },
      {
        kind: "pullquote",
        text: "Le 9ᵉ arrondissement n'est plus le QCA d'à-côté : il est l'un des deux QCA de Paris, traité différemment selon l'image que veut renvoyer l'entreprise.",
        attribution: "Un broker parisien interrogé sur le sujet",
      },
      {
        kind: "p",
        text: "L'écart historique entre Triangle d'or et 9ᵉ Haussmann sur les meilleurs immeubles pouvait atteindre 40 à 60 % en valeur faciale il y a cinq ans ; il s'est resserré à 25 à 35 % sur les transactions récentes, sans pour autant disparaître. La discipline budgétaire reste l'argument structurant pour les preneurs du 9ᵉ — sans sacrifice majeur sur la qualité du bien.",
      },
      {
        kind: "p",
        text: "L'analyse du loyer économique — c'est-à-dire le loyer facial corrigé des franchises, paliers et travaux preneur — renforce ce constat. Sur le 9ᵉ, les mesures incitatives proposées par les bailleurs sont historiquement plus généreuses, ce qui creuse l'écart en faveur du 9ᵉ une fois ramené à un coût total sur 9 ans. Les sociétés de conseil et les boutique firms financières l'ont intégré dans leurs benchmarks RH d'attractivité.",
      },
      {
        kind: "p",
        text: "La typologie des occupants évolue aussi. Là où le 8ᵉ reste l'adresse statutaire des sièges sociaux du CAC 40 et des banques d'affaires, le 9ᵉ attire désormais des sièges de scale-ups tech, des cabinets d'avocats mid-cap, des médias et des éditeurs de presse — typologie qui valorise davantage la qualité du plateau et l'animation du quartier que l'adresse vitrine. Plusieurs immeubles emblématiques d'Haussmann ont changé d'occupants ces deux dernières années dans cette logique.",
      },
      {
        kind: "p",
        text: "Pour les bailleurs du 9ᵉ, le mouvement structurel constitue une opportunité de revaloriser des actifs rénovés au meilleur standard. Pour les preneurs, le moment est propice pour des arbitrages d'image et de coût en arbitrant 8ᵉ contre 9ᵉ — à condition d'examiner avec précision la qualité technique de l'immeuble visé (certifications BREEAM/HQE, ratio surface utile, divisibilité, accessibilité PMR).",
      },
    ],
  },
]

/**
 * Articles d'analyse de marché — contenu validé par le client.
 *
 * Recréé volontairement après la suppression des anciens articles fictifs
 * (commit 9fd69e7). Le contenu ci-dessous est rédigé et signé. À ne pas
 * modifier sans validation explicite.
 *
 * Schéma type : Article { slug, titre, metaDescription, datePublication,
 * auteur, chapo, sections[], sources[], sourceNote? }. Cohérent avec le
 * pattern de lib/data/transactions.ts.
 */

export type ArticleSection = {
  /** Sous-titre H2 de la section. */
  titre: string
  /** Paragraphes de la section, un par entrée. */
  paragraphes: string[]
}

export type Article = {
  /** Slug URL — segment de /actualites/[slug]. */
  slug: string
  /** Titre principal (H1) de la page article. */
  titre: string
  /** Description SEO (≤ 160 caractères idéalement). */
  metaDescription: string
  /** Période de publication, format libre côté client (ex. "T1 2026"). */
  datePublication: string
  /** Auteur affiché en sous-titre. */
  auteur: string
  /** Paragraphe d'introduction (avant la 1ʳᵉ section H2). */
  chapo: string
  /** Sections H2 ordonnées. */
  sections: ArticleSection[]
  /** Liste des sources citées en pied d'article. */
  sources: string[]
  /** Note technique optionnelle accompagnant le bloc sources. */
  sourceNote?: string
}

export const ARTICLES: readonly Article[] = [
  {
    slug: "bureaux-paris-marche-deux-vitesses-2026",
    titre: "Bureaux à Paris en 2026 : un marché à deux vitesses",
    metaDescription:
      "Marché des bureaux à Paris au T1 2026 : demande en baisse, offre en hausse, opportunités de négociation. L'analyse Valor Immo.",
    datePublication: "T1 2026",
    auteur: "L'équipe Valor Immo",
    chapo:
      "Si vous cherchez des bureaux à Paris en ce début 2026, vous allez vite le constater : le marché n'a jamais été aussi contrasté. D'un côté, des immeubles haut de gamme qui se louent cher et restent convoités. De l'autre, une offre qui s'accumule et des propriétaires de plus en plus ouverts à la négociation. Décryptage pour y voir clair avant de signer.",
    sections: [
      {
        titre: "Un démarrage d'année au ralenti",
        paragraphes: [
          "Les chiffres donnent le ton. Selon ImmoStat — le groupement qui réunit les quatre grands conseils en immobilier d'entreprise (BNP Paribas Real Estate, CBRE, JLL et Cushman & Wakefield) — la demande placée de bureaux en Île-de-France atteint 367 700 m² au premier trimestre 2026, en recul de 15 % sur un an. Autrement dit : les entreprises signent moins, et plus prudemment.",
          "Ce ralentissement touche surtout les grandes surfaces. JLL relève que les grandes transactions ont chuté de moitié, avec seulement 76 700 m² commercialisés en sept opérations sur le trimestre. Les entreprises rationalisent leurs espaces, cherchent à maîtriser leurs coûts, et combinent désormais un siège « cœur » avec des bureaux satellites plus flexibles.",
        ],
      },
      {
        titre: "Une offre qui gonfle, des opportunités à saisir",
        paragraphes: [
          "Pendant que la demande faiblit, l'offre, elle, grimpe. ImmoStat chiffre l'offre immédiate de bureaux à 6 332 000 m² fin mars 2026, en hausse de 9 % sur un an. Résultat : le taux de vacance francilien atteint 11,4 % selon JLL.",
          "Pour vous, dirigeant ou commerçant en recherche, c'est une bonne nouvelle. Plus d'offre disponible signifie plus de choix, et surtout un vrai pouvoir de négociation. Les mesures d'accompagnement (mois de loyers offerts, participation aux travaux) restent élevées : ImmoStat les situait à 30,3 % au trimestre précédent.",
        ],
      },
      {
        titre: "Le prime résiste, le reste s'ajuste",
        paragraphes: [
          "C'est là qu'apparaissent les deux vitesses. Sur les meilleurs immeubles parisiens — emplacement, qualité, transports — les propriétaires maintiennent des prétentions élevées. Les estimations du loyer prime parisien varient d'ailleurs selon les conseils : JLL l'établit à 1 220 €/m²/an avec une tendance baissière, quand d'autres analystes le voient plutôt stable autour de 1 250 €. Sur le reste du marché, en revanche, les repricings se multiplient et les valeurs s'assouplissent.",
        ],
      },
      {
        titre: "Ce qu'il faut retenir",
        paragraphes: [
          "Le marché parisien de 2026 récompense ceux qui prennent le temps de comparer. Les meilleurs actifs restent chers, mais l'abondance d'offre sur le reste du marché crée des fenêtres de négociation rares. Bien accompagné, c'est le moment de viser un bien de qualité à des conditions qu'on n'aurait pas obtenues il y a deux ans.",
        ],
      },
    ],
    sources: [
      "ImmoStat — résultats T1 2026",
      "JLL — marché locatif bureaux Île-de-France T1 2026",
    ],
    sourceNote: "Chiffres au 1er trimestre 2026.",
  },
  {
    slug: "louer-bureau-paris-hors-qca-2026",
    titre: "Où louer un bureau à Paris sans payer le prix du QCA ?",
    metaDescription:
      "Où louer un bureau à Paris sans payer le prix du QCA ? Les arrondissements montants en 2026, analysés par Valor Immo.",
    datePublication: "T1 2026",
    auteur: "L'équipe Valor Immo",
    chapo:
      "Le Quartier Central des Affaires fait rêver : adresses prestigieuses, immeubles haussmanniens, voisinage de grands groupes. Mais le QCA se paie cher — le loyer prime parisien y tourne autour de 1 220 €/m²/an selon JLL. Bonne nouvelle : plusieurs secteurs parisiens offrent aujourd'hui un excellent compromis entre centralité et budget. Tour d'horizon.",
    sections: [
      {
        titre: "Les arrondissements qui montent",
        paragraphes: [
          "L'analyse JLL du premier trimestre 2026 est claire : pendant que les secteurs les plus chers reculent, trois zones tirent leur épingle du jeu avec une demande placée en progression ou stable. Il s'agit de Paris 3/4/10/11, Paris 12/13 et Paris 14/15. Le point commun de ces secteurs ? Ils combinent une vraie centralité et des loyers nettement plus accessibles que le QCA.",
          "Concrètement, ces quartiers permettent à une entreprise de rester dans Paris intra-muros, bien desservie, sans supporter les niveaux de loyer des 8e, 1er ou 2e arrondissements.",
        ],
      },
      {
        titre: "Pourquoi ces secteurs séduisent",
        paragraphes: [
          "Plusieurs raisons expliquent cet engouement. D'abord le budget : à prestation comparable, l'écart de loyer avec le QCA peut être considérable. Ensuite l'accessibilité : ces arrondissements sont parfaitement reliés en métro et RER. Enfin l'ambiance : commerces, restauration, vie de quartier — des atouts pour attirer et fidéliser les salariés, un critère devenu central dans les décisions d'implantation.",
        ],
      },
      {
        titre: "La méthode pour bien choisir",
        paragraphes: [
          "Le bon arbitrage dépend de votre activité. Une entreprise qui reçoit beaucoup de clients privilégiera l'adresse et l'accès ; une structure plus opérationnelle misera sur la surface et le rapport qualité-prix. Dans un marché où l'offre est abondante — 6,3 millions de m² disponibles en Île-de-France selon ImmoStat — vous avez les cartes en main pour négocier.",
          "Notre conseil : ne vous limitez pas à un seul arrondissement. En élargissant votre recherche aux secteurs montants, vous multipliez les options et renforcez votre position de négociation. C'est précisément le travail d'accompagnement que nous menons pour nos clients : cibler les biens qui correspondent réellement au besoin, sans payer la prime d'une adresse.",
        ],
      },
      {
        titre: "En résumé",
        paragraphes: [
          "Le QCA n'est pas la seule option pour une entreprise qui veut une adresse parisienne crédible. Les secteurs 3/4/10/11, 12/13 et 14/15 offrent en 2026 un équilibre rare entre centralité, qualité de vie et maîtrise du budget. À condition de bien connaître le marché.",
        ],
      },
    ],
    sources: [
      "JLL — marché locatif bureaux Île-de-France T1 2026",
      "ImmoStat — résultats T1 2026",
    ],
    sourceNote: "Chiffres au 1er trimestre 2026.",
  },
  {
    slug: "locaux-activite-logistique-ile-de-france-2026",
    titre:
      "Locaux d'activité et logistique en Île-de-France : le rapport de force a basculé",
    metaDescription:
      "Locaux d'activité et logistique en Île-de-France 2026 : offre abondante, loyers en baisse, le marché bascule côté preneur.",
    datePublication: "T1 2026",
    auteur: "L'équipe Valor Immo",
    chapo:
      "Vous cherchez un entrepôt, un local d'activité ou une surface logistique en Île-de-France ? Le contexte de 2026 vous est favorable. Après des années où les preneurs subissaient la rareté, le rapport de force s'est inversé. Explications, chiffres à l'appui.",
    sections: [
      {
        titre: "Une demande en net repli",
        paragraphes: [
          "Le marché des locaux d'activité franciliens a connu un début d'année difficile. Selon les données JLL, la demande placée s'établit à 186 000 m² au premier trimestre 2026, en retrait de 28 % sur un an et de 38 % par rapport à la moyenne des cinq dernières années. Du côté de la logistique de plus de 5 000 m², ImmoStat enregistre 44 200 m² placés en Île-de-France sur le trimestre, dans un marché national lui aussi en fort recul.",
          "Cette prudence des entreprises s'explique par un climat économique incertain, qui pousse à reporter ou redimensionner les projets.",
        ],
      },
      {
        titre: "Une offre abondante, des loyers en baisse",
        paragraphes: [
          "C'est la contrepartie pour les preneurs : l'offre est large. JLL chiffre l'offre immédiate de locaux d'activité à 2 millions de m² en Île-de-France, en progression de 7 % sur un an. Mécaniquement, les loyers reculent. Toujours selon JLL, le loyer moyen francilien s'établit à 121 €/m²/an (contre 126 € un an plus tôt), tandis que le loyer prime est redescendu à 190 €/m² après avoir atteint 200 € en 2025.",
        ],
      },
      {
        titre: "Ce que ça change pour vous",
        paragraphes: [
          "Concrètement, vous bénéficiez aujourd'hui d'un large choix et d'une réelle capacité de négociation. Là où il fallait parfois se décider en quelques jours il y a deux ans, vous pouvez désormais comparer, faire jouer la concurrence entre propriétaires, et obtenir des conditions — loyer, franchise, durée d'engagement — bien plus souples.",
          "Mais attention : un marché abondant ne veut pas dire un marché simple. Les bons emplacements logistiques — proximité des axes, dernier kilomètre, hauteur sous plafond, accès poids lourds — restent recherchés. L'enjeu est de distinguer la vraie opportunité de la surface disponible « par défaut ».",
        ],
      },
      {
        titre: "Notre lecture",
        paragraphes: [
          "2026 est une année de preneurs sur les locaux d'activité et la logistique franciliens. L'abondance d'offre et la baisse des loyers ouvrent des fenêtres intéressantes, à condition de cibler les emplacements qui garderont leur valeur d'usage. C'est tout l'intérêt d'un accompagnement qui connaît le terrain.",
        ],
      },
    ],
    sources: [
      "JLL — marché immobilier industriel Île-de-France T1 2026",
      "ImmoStat — résultats T1 2026",
    ],
    sourceNote: "Chiffres au 1er trimestre 2026.",
  },
] as const

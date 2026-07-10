export const magazines = [
  {
    id: 1,
    slug: "magazine-01-intelligence",
    title: "Intelligence",
    subtitle: "Savoir & Décision",
    description: "Stratégies et analyses pour un esprit affûté.",
    themePrimary: "#a31835",
    themeSecondary: "#3d0c1b",
    gradient: "linear-gradient(135deg, #2b1126, #411d3d)",
    heroImage: "/assets/core/img/mag_hero_01.png",
    essenceImage: "/assets/core/img/mag_hero_02.png",
    essenceText: "Sous la direction de la Pr Nora Patrius, ce magazine explore les frontières de la connaissance stratégique. Nous décryptons les signaux faibles pour transformer l'information brute en une intelligence actionnable pour les décideurs de demain.",
    essenceQuote: "L'intelligence n'est pas seulement l'accumulation de données, c'est l'art de discerner le motif au milieu du chaos.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>`,
    features: [
      { title: "The Brief", subtitle: "SYNTHÈSE QUOTIDIENNE STRATÉGIQUE", meta: "EST. 2024 • 08:00 CET", icon: "assignment" },
      { title: "The Pulse", subtitle: "SIGNAUX FAIBLES & DÉTECTION PRÉCOCE", meta: "LIVE UPDATE • GLOBAL FEED", icon: "pulse" },
      { title: "Deep-Dive", subtitle: "ANALYSES DE FOND PAR NOS EXPERTS", meta: "MONTHLY REV. • 40 PAGE PDF", icon: "search" },
      { title: "Radar", subtitle: "CARTOGRAPHIE DES RISQUES ÉMERGENTS", meta: "DYNAMIC MAP • Q4 FOCUS", icon: "shield" }
    ],
    articles: [
      {
        id: "dunning-kruger-management",
        title: "Décoder la Complexité : Les nouveaux paradigmes de la souveraineté numérique",
        desc: "Une enquête approfondie sur la manière dont l'intelligence artificielle redéfinit les frontières géopolitiques traditionnelles et les structures de pouvoir étatiques.",
        badge: "DEEP-DIVE",
        meta: "DR. ANTOINE MOREAU • 12 MIN DE LECTURE • 48 COMMENTAIRES",
        image: "/assets/core/img/mag_hero_03.png"
      },
      {
        id: "pensee-systemique",
        title: "Le retour de la pensée systémique dans la stratégie d'entreprise",
        desc: "Comment les approches holistiques transforment la prise de décision face à des crises interconnectées.",
        badge: "TRENDS",
        meta: "ELENA ROUSSEAU • 8 MIN DE LECTURE",
        image: "/assets/core/img/mag_hero_04.png"
      },
      {
        id: "interview-renseignement",
        title: "Interview : Les défis du renseignement moderne par Jean-Luc Aris",
        desc: "Un entretien exclusif avec l'ancien directeur de la prospective stratégique.",
        badge: "VOICES",
        meta: "REDACTION • 15 MIN DE LECTURE",
        image: "/assets/core/img/mag_hero_05.png"
      }
    ],
    tools: [
      { title: "Data Visualisation", desc: "Accédez à notre plateforme interactive pour visualiser les flux de données mondiaux en temps réel.", icon: "show_chart" },
      { title: "Alertes Géopolitiques", desc: "Recevez des notifications immédiates sur les événements à fort impact stratégique directement sur vos terminaux.", icon: "notifications_active" },
      { title: "Veille Personnalisée", desc: "Configurez vos propres filtres d'intelligence pour un flux d'informations adapté à votre secteur d'activité.", icon: "psychology" }
    ]
  },
  {
    id: 2,
    slug: "magazine-02-power-lab",
    title: "Power Lab",
    subtitle: "Innovation & Performance",
    description: "L'innovation et la performance redéfinies.",
    themePrimary: "#cf5c49",
    themeSecondary: "#a33827",
    gradient: "linear-gradient(135deg, #a33827, #cf5c49)",
    heroImage: "/assets/core/img/mag_hero_02.png",
    essenceImage: "/assets/core/img/mag_hero_03.png",
    essenceText: "Sous la direction du Dr Marc Valette, Power Lab explore les technologies de rupture et les méthodologies de performance extrême pour propulser vos projets vers l'avenir.",
    essenceQuote: "La performance n'est pas un accident. C'est le résultat d'une attention obsessionnelle aux détails et à l'innovation.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`,
    features: [
      { title: "The Pulse", subtitle: "VECTEURS D'INNOVATION RAPIDE", meta: "REAL-TIME • EXPERIMENTAL", icon: "bolt" },
      { title: "Lab Reports", subtitle: "RAPPORTS DE RECHERCHE R&D", meta: "WEEKLY • DETAILED ANALYTICS", icon: "biotech" },
      { title: "Beta Test", subtitle: "ACCÈS ANTICIPÉ AUX OUTILS", meta: "EXCLUSIVE MEMBERS ONLY", icon: "science" },
      { title: "Metrics", subtitle: "KPI & RENDEMENT", meta: "MONTHLY DASHBOARD", icon: "speed" }
    ],
    articles: [
      {
        id: "ia-acceleration-rd",
        title: "L'accélération de la R&D industrielle par les modèles génératifs",
        desc: "Comment les nouveaux modèles de simulation accélèrent la découverte de matériaux et optimisent la chaîne de valeur.",
        badge: "LAB FOCUS",
        meta: "JEANNE DUPONT • 10 MIN DE LECTURE",
        image: "/assets/core/img/mag_hero_04.png"
      },
      {
        id: "biomimetisme-performance",
        title: "Le biomimétisme au service de la performance aérodynamique",
        desc: "Étude comparative des structures inspirées de la nature dans le design aéronautique moderne.",
        badge: "DESIGN",
        meta: "MARC VALETTE • 14 MIN DE LECTURE",
        image: "/assets/core/img/mag_hero_05.png"
      }
    ],
    tools: [
      { title: "Simulation ROI", desc: "Calculez l'impact financier de vos investissements en innovation avec nos modèles algorithmiques.", icon: "calculate" },
      { title: "Benchmark Tech", desc: "Comparez vos indicateurs technologiques avec les standards de votre industrie.", icon: "query_stats" }
    ]
  },
  {
    id: 3,
    slug: "magazine-03-alliance",
    title: "L'Alliance",
    subtitle: "Réseaux & Influence",
    description: "Le pouvoir des réseaux et des connexions.",
    themePrimary: "#a30626",
    themeSecondary: "#6c1626",
    gradient: "linear-gradient(135deg, #6c1626, #9c2741)",
    heroImage: "/assets/core/img/mag_hero_03.png",
    essenceImage: "/assets/core/img/mag_hero_04.png",
    essenceText: "L'Alliance décrypte les structures de réseau qui régissent le pouvoir contemporain. Apprenez à bâtir des connexions stratégiques durables et à étendre votre influence légitime.",
    essenceQuote: "La force d'un individu ne réside pas dans son isolement, mais dans la richesse et la confiance des réseaux qu'il tisse.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0zm6 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path></svg>`,
    features: [
      { title: "Net Map", subtitle: "CARTOGRAPHIE DES CERCLES DE POUVOIR", meta: "UPDATED Q3", icon: "hub" },
      { title: "Briefing", subtitle: "INTELLIGENCE RELATIONNELLE", meta: "FORTNIGHTLY", icon: "forum" }
    ],
    articles: [
      {
        id: "diplomatie-reseaux",
        title: "La diplomatie des réseaux : Bâtir de l'influence dans un monde multipolaire",
        desc: "Comment les structures informelles influencent les grandes négociations internationales.",
        badge: "INFLUENCE",
        meta: "PR. HENRI LAROCHE • 15 MIN DE LECTURE",
        image: "/assets/core/img/mag_hero_05.png"
      }
    ],
    tools: [
      { title: "Cartographie Personnelle", desc: "Consultez notre base de données des réseaux mondiaux.", icon: "share" }
    ]
  },
  {
    id: 4,
    slug: "magazine-04-agenda",
    title: "L'Agenda",
    subtitle: "Temps & Excellence",
    description: "Maîtrisez votre temps, orchestrez votre succès.",
    themePrimary: "#b09159",
    themeSecondary: "#8f703c",
    gradient: "linear-gradient(135deg, #b09159, #cfb17d)",
    heroImage: "/assets/core/img/mag_hero_04.png",
    essenceImage: "/assets/core/img/mag_hero_05.png",
    essenceText: "L'Agenda propose une philosophie moderne du temps. Apprenez à concevoir vos journées comme des oeuvres d'art pour maximiser votre impact et atteindre l'équilibre absolu.",
    essenceQuote: "Celui qui ne maîtrise pas son temps est condamné à bâtir le rêve d'un autre.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>`,
    features: [
      { title: "FlowState", subtitle: "MÉTHODOLOGIE DE CONCENTRATION", meta: "PRACTICAL GUIDE", icon: "hourglass_empty" }
    ],
    articles: [
      {
        id: "chronobiologie-management",
        title: "Chronobiologie et décision : Aligner son agenda sur ses rythmes naturels",
        desc: "Les études scientifiques les plus récentes sur l'optimisation des tranches de travail intellectuel complexe.",
        badge: "SCIENCE",
        meta: "DR. CLARA VALÉRY • 11 MIN DE LECTURE",
        image: "/assets/core/img/mag_hero_01.png"
      }
    ],
    tools: [
      { title: "Planificateur de Rythme", desc: "Générez un emploi du temps personnalisé basé sur votre chronotype.", icon: "schedule" }
    ]
  },
  {
    id: 5,
    slug: "magazine-05-passions",
    title: "Passions",
    subtitle: "Création & Dépassement",
    description: "Ce qui nous anime au plus profond.",
    themePrimary: "#c3847e",
    themeSecondary: "#9e5c56",
    gradient: "linear-gradient(135deg, #c3847e, #dfa29d)",
    heroImage: "/assets/core/img/mag_hero_05.png",
    essenceImage: "/assets/core/img/mag_hero_01.png",
    essenceText: "Découvrez les parcours extraordinaires de créateurs, d'athlètes et d'artistes qui repoussent quotidiennement les limites de l'expression humaine.",
    essenceQuote: "La passion est le seul moteur qui transforme la discipline en joie pure.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>`,
    features: [
      { title: "Portraits", subtitle: "ENTRETIENS AU COEUR DU DÉPASSEMENT", meta: "EXCLUSIF", icon: "portrait" }
    ],
    articles: [
      {
        id: "esthetique-effort",
        title: "L'esthétique de l'effort : Quand le sport devient une forme d'art",
        desc: "Une réflexion sur le mouvement, le geste athlétique parfait et sa résonance philosophique.",
        badge: "PHILOSOPHY",
        meta: "SOPHIE MARTIN • 9 MIN DE LECTURE",
        image: "/assets/core/img/mag_hero_02.png"
      }
    ],
    tools: [
      { title: "Journal de Vision", desc: "Un espace structuré pour consigner vos passions et vos aspirations de dépassement.", icon: "edit_note" }
    ]
  },
  {
    id: 6,
    slug: "magazine-06-art-de-vivre",
    title: "Art de Vivre",
    subtitle: "Élégance & Harmonie",
    description: "L'élégance dans chaque détail du quotidien.",
    themePrimary: "#c37b56",
    themeSecondary: "#9e5631",
    gradient: "linear-gradient(135deg, #c37b56, #e4976f)",
    heroImage: "/assets/core/img/mag_hero_01.png",
    essenceImage: "/assets/core/img/mag_hero_02.png",
    essenceText: "L'Art de Vivre célèbre la beauté dans l'architecture, le design, la gastronomie et le voyage. Un manifeste pour un hédonisme réfléchi.",
    essenceQuote: "Vivre avec élégance n'est pas une question d'ostentation, mais de justesse et d'harmonie avec son environnement.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path></svg>`,
    features: [
      { title: "Spaces", subtitle: "ARCHITECTURES REMARQUABLES", meta: "VISUAL TOUR", icon: "architecture" }
    ],
    articles: [
      {
        id: "minimalisme-architectural",
        title: "Le minimalisme chaleureux : L'architecture au service de la sérénité",
        desc: "Comment le design d'espace contemporain intègre la nature pour concevoir des refuges urbains ressourçants.",
        badge: "SPACES",
        meta: "PIERRE DE LORME • 12 MIN DE LECTURE",
        image: "/assets/core/img/mag_hero_03.png"
      }
    ],
    tools: [
      { title: "Carnet d'Inspiration", desc: "Enregistrez vos coups de coeur design.", icon: "palette" }
    ]
  },
  {
    id: 7,
    slug: "magazine-07-academie",
    title: "Académie",
    subtitle: "Savoir & Transmission",
    description: "L'apprentissage continu pour les esprits exigeants.",
    themePrimary: "#7c4c47",
    themeSecondary: "#59312d",
    gradient: "linear-gradient(135deg, #7c4c47, #a1645e)",
    heroImage: "/assets/core/img/france_1.png",
    essenceImage: "/assets/core/img/france_2.png",
    essenceText: "L'Académie est un espace de transmission du savoir. Nous connectons la sagesse des classiques aux défis intellectuels de l'ère moderne.",
    essenceQuote: "L'apprentissage n'est pas un produit qu'on acquiert, mais un processus de transformation continue.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>`,
    features: [
      { title: "Lectures", subtitle: "EXPLICATION DE TEXTES CLASSIQUES", meta: "ACADEMIC", icon: "school" }
    ],
    articles: [
      {
        id: "sagesse-stoique-crise",
        title: "La sagesse stoïcienne face à l'accélération technologique",
        desc: "Ce que Sénèque et Marc Aurèle peuvent nous apprendre sur la préservation de notre attention.",
        badge: "CLASSICS",
        meta: "PR. JEAN VALJEAN • 14 MIN DE LECTURE",
        image: "/assets/core/img/france_3_1782121595894.png"
      }
    ],
    tools: [
      { title: "Bibliothèque Idéale", desc: "Découvrez notre liste commentée de 100 livres essentiels.", icon: "local_library" }
    ]
  },
  {
    id: 8,
    slug: "magazine-08-patrimoine",
    title: "Patrimoine",
    subtitle: "Richesse & Transmission",
    description: "Construire et préserver pour demain.",
    themePrimary: "#998357",
    themeSecondary: "#73603d",
    gradient: "linear-gradient(135deg, #998357, #bdab7d)",
    heroImage: "/assets/core/img/france_2.png",
    essenceImage: "/assets/core/img/france_3_1782121595894.png",
    essenceText: "Le magazine Patrimoine analyse les stratégies financières complexes et l'investissement artistique pour pérenniser votre richesse matérielle et culturelle.",
    essenceQuote: "Bâtir un patrimoine, c'est s'assurer que notre vision et nos valeurs traversent le temps.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
    features: [
      { title: "Capital", subtitle: "GESTION DE FORTUNE & INVESTISSEMENT", meta: "PRIVATE BANKING", icon: "account_balance" }
    ],
    articles: [
      {
        id: "art-actif-refuge",
        title: "L'art contemporain comme actif refuge en période d'incertitude",
        desc: "Une analyse du marché de l'art mondial et des critères de sélection des artistes.",
        badge: "INVESTING",
        meta: "CLAUDE MONET • 10 MIN DE LECTURE",
        image: "/assets/core/img/france_1.png"
      }
    ],
    tools: [
      { title: "Simulateur Successoral", desc: "Évaluez l'impact fiscal et financier.", icon: "calculate" }
    ]
  },
  {
    id: 9,
    slug: "magazine-09-longevity",
    title: "Longevity",
    subtitle: "Science & Vitalité",
    description: "La science et l'art de vivre mieux, plus longtemps.",
    themePrimary: "#e69e85",
    themeSecondary: "#b8765f",
    gradient: "linear-gradient(135deg, #e69e85, #f0b4a1)",
    heroImage: "/assets/core/img/home_hero_1782125665964.png",
    essenceImage: "/assets/core/img/home_philosophy_woman_1782125677007.png",
    essenceText: "Longevity décrypte les avancées de la biotechnologie et les protocoles de médecine préventive pour optimiser votre vitalité physique et mentale.",
    essenceQuote: "Il ne s'agit pas seulement de rajouter des années à la vie, mais d'apporter de la vitalité pure.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20a8 8 0 100-16 8 8 0 000 16z"></path><path d="M12 14a2 2 0 100-4 2 2 0 000 4z"></path></svg>`,
    features: [
      { title: "Science", subtitle: "DERNIÈRES RECHERCHES BIOTECH", meta: "EVIDENCE-BASED", icon: "health_and_safety" }
    ],
    articles: [
      {
        id: "medecine-longevite-demain",
        title: "Médecine de longévité : Les protocoles cellulaires qui font consensus",
        desc: "Une synthèse des thérapies validées scientifiquement pour ralentir le vieillissement.",
        badge: "RESEARCH",
        meta: "DR. SOPHIE DUPONT • 13 MIN DE LECTURE",
        image: "/assets/core/img/france_1.png"
      }
    ],
    tools: [
      { title: "Calculateur d'Âge Biologique", desc: "Estimez votre âge physiologique.", icon: "insights" }
    ]
  },
  {
    id: 10,
    slug: "magazine-10-impact",
    title: "Impact",
    subtitle: "Influence & Responsabilité",
    description: "L'influence positive sur le monde qui nous entoure.",
    themePrimary: "#284c3c",
    themeSecondary: "#193327",
    gradient: "linear-gradient(135deg, #284c3c, #3d6a56)",
    heroImage: "/assets/core/img/home_alaune_main_1782125698619.png",
    essenceImage: "/assets/core/img/home_alaune_side1_1782125709654.png",
    essenceText: "Impact met en lumière les philanthropes, les entrepreneurs sociaux et les projets écologiques majeurs.",
    essenceQuote: "La grandeur d'une réussite se mesure à la profondeur de son impact.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path><path d="M2 12h20"></path></svg>`,
    features: [
      { title: "Initiatives", subtitle: "PROJETS DE RUPTURE SOCIALE", meta: "FIELD REPORT", icon: "public" }
    ],
    articles: [
      {
        id: "philanthropie-systemique",
        title: "La philanthropie systémique : Repenser le don",
        desc: "Comment les nouveaux acteurs de l'impact collaborent.",
        badge: "PHILANTHROPY",
        meta: "ALEXANDRA NOVO • 10 MIN DE LECTURE",
        image: "/assets/core/img/home_alaune_side2_1782125722981.png"
      }
    ],
    tools: [
      { title: "Calculateur d'Empreinte Sociétale", desc: "Mesurez et optimisez l'impact extra-financier.", icon: "nature_people" }
    ]
  },
  {
    id: 11,
    slug: "magazine-11-culture-medias",
    title: "Culture & Médias",
    subtitle: "Récits & Société",
    description: "Décrypter les récits qui façonnent notre époque.",
    themePrimary: "#3d4052",
    themeSecondary: "#2a2c3a",
    gradient: "linear-gradient(135deg, #3d4052, #575b70)",
    heroImage: "/assets/core/img/home_alaune_side1_1782125709654.png",
    essenceImage: "/assets/core/img/home_alaune_side2_1782125722981.png",
    essenceText: "Ce magazine décrypte les récits, l'art, le cinéma et l'évolution des médias de masse.",
    essenceQuote: "Ceux qui racontent les histoires détiennent le pouvoir.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><path d="M8 4v16"></path><path d="M16 4v16"></path></svg>`,
    features: [
      { title: "Decryp", subtitle: "ANALYSE DU DISCOURS MÉDIATIQUE", meta: "MONTHLY", icon: "movie" }
    ],
    articles: [
      {
        id: "cinema-ia-recits",
        title: "L'intelligence artificielle et la fin des structures narratives",
        desc: "Comment la génération dynamique de récits transforme le cinéma.",
        badge: "MEDIA",
        meta: "JEAN-MICHEL ART • 12 MIN DE LECTURE",
        image: "/assets/core/img/france_1.png"
      }
    ],
    tools: [
      { title: "Observatoire des Tendances", desc: "Suivez l'évolution sémantique.", icon: "trending_up" }
    ]
  },
  {
    id: 12,
    slug: "magazine-12-cercle",
    title: "Le Cercle",
    subtitle: "Conversations & Leadership",
    description: "Entretiens intimes avec ceux qui osent.",
    themePrimary: "#781d33",
    themeSecondary: "#521221",
    gradient: "linear-gradient(135deg, #781d33, #9c2a45)",
    heroImage: "/assets/core/img/home_alaune_side2_1782125722981.png",
    essenceImage: "/assets/core/img/home_philosophy_woman_1782125677007.png",
    essenceText: "Le Cercle réunit des leaders d'opinion pour des entretiens sans filtre.",
    essenceQuote: "Le leadership s'éprouve dans la solitude de la décision.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>`,
    features: [
      { title: "Interviews", subtitle: "DIALOGUES AU COEUR DU POUVOIR", meta: "EXCLUSIF", icon: "podcasts" }
    ],
    articles: [
      {
        id: "interview-nora-patrius",
        title: "Confidences de la Pr Nora Patrius : L'avenir de l'intelligence",
        desc: "Un entretien fleuve sur l'évolution des structures de décision.",
        badge: "LEADERS",
        meta: "REDACTION • 18 MIN DE LECTURE",
        image: "/assets/core/img/france_1.png"
      }
    ],
    tools: [
      { title: "Forum d'Échange", desc: "Posez vos questions directement aux leaders.", icon: "question_answer" }
    ]
  },
  {
    id: 13,
    slug: "magazine-13-amour",
    title: "Amour",
    subtitle: "Relations & Psychologie",
    description: "Les dynamiques de la relation humaine.",
    themePrimary: "#d92055",
    themeSecondary: "#9c1439",
    gradient: "linear-gradient(135deg, #d92055, #f24b78)",
    heroImage: "/assets/core/img/home_philosophy_woman_1782125677007.png",
    essenceImage: "/assets/core/img/home_hero_1782125665964.png",
    essenceText: "Ce magazine explore la psychologie des relations amoureuses.",
    essenceQuote: "La qualité de notre vie dépend de la sincérité de nos relations.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>`,
    features: [
      { title: "Psychology", subtitle: "DÉCRYPTAGE DU COMPORTEMENT", meta: "WEEKLY INSIGHT", icon: "favorite" }
    ],
    articles: [
      {
        id: "attachement-ere-numerique",
        title: "Les nouvelles architectures de l'attachement",
        desc: "Comment la communication asynchrone redéfinit les sentiments.",
        badge: "RELATIONS",
        meta: "ALICE MARTIN • 11 MIN DE LECTURE",
        image: "/assets/core/img/france_2.png"
      }
    ],
    tools: [
      { title: "Test de Relation", desc: "Évaluez la dynamique d'attachement.", icon: "quiz" }
    ]
  },
  {
    id: 14,
    slug: "magazine-14-beaute",
    title: "Beauté",
    subtitle: "Esthétique & Bien-être",
    description: "L'esthétique de l'âme et du corps.",
    themePrimary: "#e8a39c",
    themeSecondary: "#b57a74",
    gradient: "linear-gradient(135deg, #e8a39c, #f5c5c0)",
    heroImage: "/assets/core/img/france_3_1782121595894.png",
    essenceImage: "/assets/core/img/france_1.png",
    essenceText: "Découvrez l'esthétique sous toutes ses formes : rituels ancestraux de beauté.",
    essenceQuote: "La beauté est l'expression visible d'une harmonie intérieure.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>`,
    features: [
      { title: "Rituels", subtitle: "MÉTHODES ET COSMÉTIQUE HOLISTIQUE", meta: "WELLNESS", icon: "spa" }
    ],
    articles: [
      {
        id: "histoire-rituels-beaute",
        title: "Histoire des rituels de beauté",
        desc: "Comment la science moderne redécouvre l'efficacité des ingrédients.",
        badge: "HOLISTIC",
        meta: "SARAH LUNA • 10 MIN DE LECTURE",
        image: "/assets/core/img/france_2.png"
      }
    ],
    tools: [
      { title: "Diagnostic Peau", desc: "Identifiez les rituels les mieux adaptés.", icon: "self_improvement" }
    ]
  },
  {
    id: 15,
    slug: "magazine-15-mariages",
    title: "Mariages",
    subtitle: "Engagement & Splendeur",
    description: "Célébrer l'engagement avec panache.",
    themePrimary: "#7a3f47",
    themeSecondary: "#52262c",
    gradient: "linear-gradient(135deg, #7a3f47, #9e555e)",
    heroImage: "/assets/core/img/home_hero_1782125665964.png",
    essenceImage: "/assets/core/img/france_1.png",
    essenceText: "Chaque mariage est une oeuvre d'art. Nous célébrons l'art de la fête.",
    essenceQuote: "S'engager devant ses pairs est la plus noble des célébrations.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>`,
    features: [
      { title: "Design", subtitle: "ORCHESTRATION D'ÉVÉNEMENTS SPLENDIDES", meta: "EXCLUSIF", icon: "celebration" }
    ],
    articles: [
      {
        id: "art-de-la-table-historique",
        title: "L'art de la table et de la réception",
        desc: "Guide historique des règles d'or de l'accueil.",
        badge: "RECEPTION",
        meta: "EMMA CLARISSE • 12 MIN DE LECTURE",
        image: "/assets/core/img/france_2.png"
      }
    ],
    tools: [
      { title: "Simulateur Organisation", desc: "Planifiez les étapes clés.", icon: "event" }
    ]
  },
  {
    id: 16,
    slug: "magazine-16-sante",
    title: "Santé",
    subtitle: "Équilibre & Science",
    description: "L'équilibre physique et mental absolu.",
    themePrimary: "#2b9c8d",
    themeSecondary: "#186e63",
    gradient: "linear-gradient(135deg, #2b9c8d, #45bdae)",
    heroImage: "/assets/core/img/france_1.png",
    essenceImage: "/assets/core/img/france_2.png",
    essenceText: "Santé propose un décryptage rigoureux de la médecine moderne.",
    essenceQuote: "La santé est un état de plénitude physique et intellectuelle.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    features: [
      { title: "Medical", subtitle: "COMPRENDRE LES PATHOLOGIES", meta: "CLINICAL", icon: "medical_services" }
    ],
    articles: [
      {
        id: "equilibre-intestinal-neurotransmetteurs",
        title: "Le microbiote et la synthèse des neurotransmetteurs du cerveau",
        desc: "Comment notre alimentation influence directement nos états émotionnels.",
        badge: "CLINIC",
        meta: "PR. MARCUS AURELIUS • 13 MIN DE LECTURE",
        image: "/assets/core/img/france_3_1782121595894.png"
      }
    ],
    tools: [
      { title: "Carnet Nutritionnel", desc: "Enregistrez vos repas.", icon: "dining" }
    ]
  }
];

import { NextResponse } from 'next/server';

export async function GET() {
  /*
  // FUTURE WORDPRESS HEADLESS API FETCH INTEGRATION:
  try {
    // 1. Fetch Custom Post Type 'magazine' with ACF Fields
    const responseMagazines = await fetch('http://localhost/wp-json/wp/v2/magazine?_embed&per_page=16', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    const wpMagazines = await responseMagazines.json();

    // 2. Map WordPress fields to Next.js Front-End Dynamic Matrix
    const magazines = wpMagazines.map(mag => ({
      id: mag.id,
      slug: mag.slug,
      title: mag.title.rendered,
      subtitle: mag.acf.subtitle,
      description: mag.acf.description,
      themePrimary: mag.acf.theme_primary || '#a31835',
      themeSecondary: mag.acf.theme_secondary || '#3d0c1b',
      gradient: mag.acf.gradient_css || 'linear-gradient(135deg, #2b1126, #411d3d)',
      heroImage: mag.acf.hero_image_path || '/assets/core/img/mag_hero_01.png',
      essenceImage: mag.acf.essence_image_path || '/assets/core/img/mag_hero_02.png',
      essenceText: mag.acf.essence_text || '',
      essenceQuote: mag.acf.essence_quote || '',
      icon: mag.acf.icon_svg_raw || '',
      features: mag.acf.features || [],
      articles: mag.acf.articles || [], // Linked CPT articles or custom relationship array
      tools: mag.acf.tools || []
    }));

    return NextResponse.json(magazines);
  } catch (error) {
    console.error("WordPress API Fetch Error:", error);
    // Fallback to static mock below
  }
  */

  // Mock response mapping docs/dynamic-matrix.md
  return NextResponse.json([
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
      essenceText: "Sous la direction de la Pr Nora Patrius, ce magazine explore les frontières de la connaissance stratégique.",
      essenceQuote: "L'intelligence n'est pas seulement l'accumulation de données, c'est l'art de discerner le motif au milieu du chaos.",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>`,
      features: [
        { title: "The Brief", subtitle: "SYNTHÈSE QUOTIDIENNE STRATÉGIQUE", meta: "EST. 2024 • 08:00 CET", icon: "assignment" },
        { title: "The Pulse", subtitle: "SIGNAUX FAIBLES & DÉTECTION PRÉCOCE", meta: "LIVE UPDATE • GLOBAL FEED", icon: "pulse" }
      ],
      articles: [
        {
          id: "dunning-kruger-management",
          title: "Décoder la Complexité : Les nouveaux paradigmes de la souveraineté numérique",
          desc: "Une enquête approfondie sur la manière dont l'intelligence artificielle redéfinit les frontières géopolitiques.",
          badge: "DEEP-DIVE",
          meta: "DR. ANTOINE MOREAU • 12 MIN DE LECTURE",
          image: "/assets/core/img/mag_hero_03.png",
          isVipOnly: true
        },
        {
          id: "pensee-systemique",
          title: "Le retour de la pensée systémique dans la stratégie d'entreprise",
          desc: "Comment les approches holistiques transforment la prise de décision face aux crises interconnectées.",
          badge: "TRENDS",
          meta: "ELENA ROUSSEAU • 8 MIN DE LECTURE",
          image: "/assets/core/img/mag_hero_04.png",
          isVipOnly: false
        }
      ],
      tools: [
        { title: "Data Visualisation", desc: "Visualisation interactive des flux mondiaux.", icon: "show_chart" }
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
      essenceText: "Power Lab explore les technologies de rupture et les méthodologies de performance extrême.",
      essenceQuote: "La performance n'est pas un accident. C'est le résultat d'une attention obsessionnelle aux détails.",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`,
      features: [
        { title: "Lab Reports", subtitle: "RAPPORTS DE RECHERCHE R&D", meta: "WEEKLY • DETAILED ANALYTICS", icon: "biotech" }
      ],
      articles: [
        {
          id: "ia-acceleration-rd",
          title: "L'accélération de la R&D industrielle par les modèles génératifs",
          desc: "Optimisation de la R&D par les modèles de simulation avancés.",
          badge: "LAB FOCUS",
          meta: "JEANNE DUPONT • 10 MIN DE LECTURE",
          image: "/assets/core/img/mag_hero_04.png",
          isVipOnly: true
        }
      ],
      tools: [
        { title: "Simulation ROI", desc: "Calculez l'impact financier de vos innovations.", icon: "calculate" }
      ]
    }
  ]);
}

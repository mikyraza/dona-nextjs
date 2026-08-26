import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const items = [];

    // 1. Load Magazines from lib/magazines_db.json
    const magsPath = path.join(process.cwd(), 'lib', 'magazines_db.json');
    if (fs.existsSync(magsPath)) {
      const magsData = JSON.parse(fs.readFileSync(magsPath, 'utf-8'));
      magsData.forEach((mag, index) => {
        items.push({
          id: `mag-${mag.id || index + 1}`,
          docType: 'CAHIER',
          type: 'CAHIER',
          typeBg: 'rgba(17, 17, 17, 0.08)',
          typeColor: '#111111',
          title: `DONA Magazine : ${mag.title || 'Édition Spéciale'}`,
          metaText: `Magazine • N° 0${index + 1} • ${mag.subtitle || 'Édition Strategique'}`,
          meta: `Magazine • N° 0${index + 1} • ${mag.subtitle || 'Édition Strategique'}`,
          ctaText: 'Lire le magazine',
          cta: 'Lire le magazine',
          ctaIcon: 'menu_book',
          ctaHref: `/magazines/${mag.slug || 'intelligence'}`,
          imagePath: mag.heroImage || mag.essenceImage || '/assets/core/img/home_mag_01_1782125759189.png',
          image: mag.heroImage || mag.essenceImage || '/assets/core/img/home_mag_01_1782125759189.png',
          downloadPdfUrl: null,
        });
      });
    }

    // 2. Load Articles from lib/articles_db.json
    const articlesPath = path.join(process.cwd(), 'lib', 'articles_db.json');
    if (fs.existsSync(articlesPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
      articlesData.slice(0, 10).forEach((art, index) => {
        items.push({
          id: `art-${art.id || index + 1}`,
          docType: 'ARTICLE',
          type: 'ARTICLE',
          typeBg: 'rgba(163, 6, 38, 0.08)',
          typeColor: '#A30626',
          title: art.title,
          metaText: `Article • ${art.badge || art.rubrique || 'Intelligence'} • 10 min`,
          meta: `Article • ${art.badge || art.rubrique || 'Intelligence'} • 10 min`,
          ctaText: 'Commencer la lecture',
          cta: 'Commencer la lecture',
          ctaIcon: 'arrow_forward',
          ctaHref: art.category ? `/magazines/${art.category}/articles/${art.id}` : '/article-trends-intelligence',
          imagePath: art.coverImage || art.image || '/assets/core/img/home_alaune_side2_1782125722981.png',
          image: art.coverImage || art.image || '/assets/core/img/home_alaune_side2_1782125722981.png',
          downloadPdfUrl: null,
        });
      });
    }

    // 3. Fallback Workbooks / Guides
    items.push({
      id: 'wb-1',
      docType: 'WORKBOOK',
      type: 'WORKBOOK',
      typeBg: 'rgba(176, 145, 89, 0.1)',
      typeColor: '#998357',
      title: "Guide d'Optimisation des Systèmes Complexes",
      metaText: 'Workbook • Power Lab • Outil Stratégique',
      meta: 'Workbook • Power Lab • Outil Stratégique',
      ctaText: 'Télécharger le PDF (4.2 MB)',
      cta: 'Télécharger le PDF (4.2 MB)',
      ctaIcon: 'download',
      ctaHref: '/assets/core/docs/workbook-complex-systems.pdf',
      imagePath: null,
      image: null,
      downloadPdfUrl: '/assets/core/docs/workbook-complex-systems.pdf',
    });

    items.push({
      id: 'wb-2',
      docType: 'WORKBOOK',
      type: 'WORKBOOK',
      typeBg: 'rgba(176, 145, 89, 0.1)',
      typeColor: '#998357',
      title: "Planificateur Hebdomadaire de l'Esprit Critique et Logique",
      metaText: 'Workbook • Agenda • Productivité',
      meta: 'Workbook • Agenda • Productivité',
      ctaText: 'Télécharger le PDF (1.8 MB)',
      cta: 'Télécharger le PDF (1.8 MB)',
      ctaIcon: 'download',
      ctaHref: '/assets/core/docs/planificateur-logique.pdf',
      imagePath: null,
      image: null,
      downloadPdfUrl: '/assets/core/docs/planificateur-logique.pdf',
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error generating espace-lecture response:", error);
    return NextResponse.json([]);
  }
}

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
        const magNum = String(index + 1).padStart(2, '0');
        items.push({
          id: `mag-${mag.id || index + 1}`,
          docType: 'MAGAZINE',
          type: 'MAGAZINE',
          magId: index + 1,
          typeBg: 'rgba(17, 17, 17, 0.08)',
          typeColor: '#111111',
          title: `DONA Magazine : ${mag.title || 'Édition Spéciale'}`,
          metaText: `Magazine • N° ${magNum} • ${mag.subtitle || 'Édition Stratégique'}`,
          meta: `Magazine • N° ${magNum} • ${mag.subtitle || 'Édition Stratégique'}`,
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
      articlesData.slice(0, 12).forEach((art, index) => {
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

    // 3. Workbooks / Executive PDF Guides
    const workbooks = [
      {
        id: 'wb-1',
        title: "Guide d'Optimisation des Systèmes Complexes",
        metaText: 'Workbook • Power Lab • Outil Stratégique',
        meta: 'Workbook • Power Lab • Outil Stratégique',
        file: 'workbook-complex-systems.pdf',
        size: '4.2 MB'
      },
      {
        id: 'wb-2',
        title: "Planificateur Hebdomadaire de l'Esprit Critique et Logique",
        metaText: 'Workbook • Agenda • Productivité',
        meta: 'Workbook • Agenda • Productivité',
        file: 'planificateur-logique.pdf',
        size: '1.8 MB'
      },
      {
        id: 'wb-3',
        title: "Guide Stratégique DONA 2026 : Vision & Quiet Luxury",
        metaText: 'Workbook • Manifeste • Leadership',
        meta: 'Workbook • Manifeste • Leadership',
        file: 'guide-strategique-dona-2026.pdf',
        size: '3.5 MB'
      },
      {
        id: 'wb-4',
        title: "Masterclass Leadership & Influence Rédactionnelle",
        metaText: 'Workbook • Executive • Dossier Exclusif',
        meta: 'Workbook • Executive • Dossier Exclusif',
        file: 'masterclass-leadership.pdf',
        size: '5.1 MB'
      }
    ];

    workbooks.forEach(wb => {
      const pdfPath = `/assets/core/docs/${wb.file}`;
      items.push({
        id: wb.id,
        docType: 'WORKBOOK',
        type: 'WORKBOOK',
        typeBg: 'rgba(176, 145, 89, 0.1)',
        typeColor: '#998357',
        title: wb.title,
        metaText: wb.metaText,
        meta: wb.meta,
        ctaText: `Télécharger PDF (${wb.size})`,
        cta: `Télécharger PDF (${wb.size})`,
        ctaIcon: 'download',
        ctaHref: pdfPath,
        imagePath: null,
        image: null,
        downloadPdfUrl: pdfPath,
      });
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error generating espace-lecture response:", error);
    return NextResponse.json([]);
  }
}

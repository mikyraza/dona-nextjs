import { NextResponse } from 'next/server';

export async function GET() {
  /*
  // FUTURE WORDPRESS HEADLESS API FETCH INTEGRATION:
  try {
    // 1. Fetch CPT 'document' (from Headless WordPress REST API)
    const responseDocs = await fetch('http://localhost/wp-json/wp/v2/document?per_page=20', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 600 }
    });
    const wpDocs = await responseDocs.json();

    return NextResponse.json(wpDocs.map(doc => ({
      id: doc.id,
      docType: doc.acf.doc_type || 'ARTICLE', // ENUM: ARTICLE, CAHIER, WORKBOOK
      title: doc.title.rendered,
      metaText: doc.acf.meta_text || '',
      ctaText: doc.acf.cta_text || 'Lire le document',
      ctaIcon: doc.acf.cta_icon || 'arrow_forward',
      ctaHref: doc.acf.cta_href || '#',
      imagePath: doc.acf.image_path || null,
      downloadPdfUrl: doc.acf.file_path || null, // Private file URL for downloads
      orderIndex: doc.acf.order_index || 0
    })));
  } catch (error) {
    console.error("WordPress API Fetch Error:", error);
    // Fallback to static mock below
  }
  */

  // Mock response mapping docs/dynamic-matrix.md
  return NextResponse.json([
    {
      id: 1,
      docType: 'ARTICLE',
      title: "La Trajectoire de l'Effet Dunning-Kruger dans le Management Moderne",
      metaText: 'Article • Intelligence • 12 min',
      ctaText: 'Commencer la lecture',
      ctaIcon: 'arrow_forward',
      ctaHref: '/article-trends-intelligence',
      imagePath: '/assets/core/img/home_alaune_side2_1782125722981.png',
      downloadPdfUrl: null,
      saved: true
    },
    {
      id: 2,
      docType: 'CAHIER',
      title: 'DONA Magazine : Édition Spéciale Intelligence',
      metaText: 'Magazine • N° 01 • Renseignements',
      ctaText: 'Lire le magazine',
      ctaIcon: 'menu_book',
      ctaHref: '/magazines/intelligence',
      imagePath: '/assets/core/img/home_mag_01_1782125759189.png',
      downloadPdfUrl: null,
      saved: false
    },
    {
      id: 3,
      docType: 'WORKBOOK',
      title: "Guide d'Optimisation des Systèmes Complexes",
      metaText: 'Workbook • Power Lab • Outil Stratégique',
      ctaText: 'Télécharger le PDF (4.2 MB)',
      ctaIcon: 'download',
      ctaHref: 'https://example.com/downloads/workbook-complex-systems.pdf',
      imagePath: null,
      downloadPdfUrl: 'https://example.com/downloads/workbook-complex-systems.pdf',
      saved: true
    },
    {
      id: 4,
      docType: 'ARTICLE',
      title: "L'Esthétique de l'Effet de Contraste en Design Contemporain",
      metaText: 'Article • Passions • 8 min',
      ctaText: 'Commencer la lecture',
      ctaIcon: 'arrow_forward',
      ctaHref: '#',
      imagePath: '/assets/core/img/home_alaune_side1_1782125709654.png',
      downloadPdfUrl: null,
      saved: false
    },
    {
      id: 5,
      docType: 'CAHIER',
      title: "DONA Magazine : L'Art du Risque et du Power Lab",
      metaText: "Magazine • N° 02 • Performance",
      ctaText: 'Lire le magazine',
      ctaIcon: 'menu_book',
      ctaHref: '/magazines/power-lab',
      imagePath: '/assets/core/img/home_mag_02_1782125769846.png',
      downloadPdfUrl: null,
      saved: false
    }
  ]);
}

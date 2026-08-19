import { NextResponse } from 'next/server';
import { fetchMagazinesConfig, fetchMagazineConfig, saveMagazineConfig, deleteMagazineConfig } from '@/lib/wordpress';
import { magazines as staticMagazines } from '@/app/magazines/data';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const config = await fetchMagazineConfig(slug);
      return NextResponse.json(config);
    }

    const savedConfigs = await fetchMagazinesConfig();
    const configMap = new Map(savedConfigs.map(m => [m.slug, m]));

    // 1. Map static magazines overlaying any saved configs
    const mappedStaticMagazines = staticMagazines.map(staticMag => {
      const saved = configMap.get(staticMag.slug) || configMap.get(staticMag.slug.replace(/^magazine-\d{2}-/, ''));
      if (saved) return { ...staticMag, ...saved };
      return {
        ...staticMag,
        heroButtons: [
          { id: "btn-1", label: "Explorer les Éditions", url: "#articles", visible: true },
          { id: "btn-2", label: "S'abonner au Magazine", url: "/abonnement", visible: true }
        ],
        essenceTitle: `L'Essence de ${staticMag.title}`,
        tabs: [
          { id: "tab-1", slug: "the-pulse", name: "The Pulse", order: 1, defaultActive: true, hidden: false },
          { id: "tab-2", slug: "analyses", name: "Analyses & Enquêtes", order: 2, defaultActive: false, hidden: false }
        ],
        sections: [
          { id: "sec-hero", type: "HERO", name: "Hero Banner", visible: true, order: 1 },
          { id: "sec-essence", type: "PRESENTATION", name: "Présentation Éditoriale", visible: true, order: 2 },
          { id: "sec-tabs", type: "CATEGORIES_FEED", name: "Onglets & Articles", visible: true, order: 3 },
          { id: "sec-tools", type: "TOOLS", name: "Outils & Services", visible: true, order: 4 },
          { id: "sec-cta", type: "CTA_PREMIUM", name: "Appel à l'Abonnement", visible: true, order: 5 }
        ]
      };
    });

    // 2. Include any newly created custom magazines
    const staticSlugs = new Set(staticMagazines.map(m => m.slug));
    const extraCustomMagazines = savedConfigs.filter(
      saved => !staticSlugs.has(saved.slug) && !staticSlugs.has(`magazine-${String(saved.id).padStart(2, '0')}-${saved.slug}`)
    );

    const fullMagazinesList = [...mappedStaticMagazines, ...extraCustomMagazines];

    return NextResponse.json(fullMagazinesList);
  } catch (error) {
    console.error("GET /api/admin/magazines error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    let { slug, ...configData } = body;
    
    if (!slug && !configData.title) {
      return NextResponse.json({ error: "Le titre ou slug du magazine est obligatoire" }, { status: 400 });
    }

    const savedConfigs = await fetchMagazinesConfig();
    const maxExistingId = Math.max(
      16,
      ...staticMagazines.map(m => m.id || 0),
      ...savedConfigs.map(m => m.id || 0)
    );

    const magId = configData.id || (maxExistingId + 1);

    if (!slug) {
      const cleanTitleSlug = configData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      slug = `magazine-${String(magId).padStart(2, '0')}-${cleanTitleSlug}`;
    }

    const fullData = {
      id: magId,
      slug,
      ...configData,
      themePrimary: configData.themePrimary || "#a31835",
      themeSecondary: configData.themeSecondary || "#3d0c1b",
      gradient: configData.gradient || `linear-gradient(135deg, ${configData.themePrimary || '#a31835'}, #111111)`,
      heroButtons: configData.heroButtons?.length > 0 ? configData.heroButtons : [
        { id: "btn-1", label: "Explorer les Éditions", url: "#articles", visible: true },
        { id: "btn-2", label: "S'abonner au Magazine", url: "/abonnement", visible: true }
      ],
      tabs: configData.tabs?.length > 0 ? configData.tabs : [
        { id: "tab-1", slug: "the-pulse", name: "The Pulse", order: 1, defaultActive: true, hidden: false }
      ],
      sections: configData.sections?.length > 0 ? configData.sections : [
        { id: "sec-hero", type: "HERO", name: "Hero Banner", visible: true, order: 1 },
        { id: "sec-essence", type: "PRESENTATION", name: "Présentation Éditoriale", visible: true, order: 2 },
        { id: "sec-tabs", type: "CATEGORIES_FEED", name: "Onglets & Articles", visible: true, order: 3 },
        { id: "sec-tools", type: "TOOLS", name: "Outils & Services", visible: true, order: 4 },
        { id: "sec-cta", type: "CTA_PREMIUM", name: "Appel à l'Abonnement", visible: true, order: 5 }
      ]
    };

    const result = await saveMagazineConfig(slug, fullData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/admin/magazines error:", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde du magazine" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: "Slug du magazine obligatoire pour la suppression" }, { status: 400 });
    }
    const result = await deleteMagazineConfig(slug);
    return NextResponse.json(result);
  } catch (error) {
    console.error("DELETE /api/admin/magazines error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression du magazine" }, { status: 500 });
  }
}

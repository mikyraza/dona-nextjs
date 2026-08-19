import { NextResponse } from 'next/server';
import { fetchMagazinesConfig, fetchMagazineConfig, saveMagazineConfig } from '@/lib/wordpress';
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

    const fullMagazinesList = staticMagazines.map(staticMag => {
      const saved = configMap.get(staticMag.slug);
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

    return NextResponse.json(fullMagazinesList);
  } catch (error) {
    console.error("GET /api/admin/magazines error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { slug, ...configData } = body;
    
    if (!slug) {
      return NextResponse.json({ error: "Le slug du magazine est obligatoire" }, { status: 400 });
    }

    const result = await saveMagazineConfig(slug, configData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/admin/magazines error:", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde du magazine" }, { status: 500 });
  }
}

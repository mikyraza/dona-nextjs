import { NextResponse } from 'next/server';
import { fetchDossiers, fetchDossierById } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      const dossier = await fetchDossierById(id);
      if (!dossier) return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
      return NextResponse.json(dossier);
    }

    const magazine = searchParams.get('magazine') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit'), 10) : undefined;
    const vip = searchParams.get('vip');
    const isVipOnly = vip !== null ? vip === '1' || vip === 'true' : undefined;
    const feat = searchParams.get('featured');
    const isFeatured = feat !== null ? feat === '1' || feat === 'true' : undefined;
    const includeDrafts = searchParams.get('includeDrafts') === '1' || searchParams.get('includeDrafts') === 'true';

    const dossiers = await fetchDossiers({
      magazine,
      category,
      search,
      limit,
      isVipOnly,
      isFeatured,
      includeDrafts
    });

    return NextResponse.json(dossiers);
  } catch (error) {
    console.error("GET /api/dossiers error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

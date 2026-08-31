import { NextResponse } from 'next/server';
import { dbGetAllSettings, dbSetSetting, exportDatabaseToSqlFile } from '@/lib/db';

export async function GET() {
  try {
    const settings = dbGetAllSettings();
    return NextResponse.json({
      logoPath: settings.logoPath || '/assets/core/img/logo.png',
      ctaText: settings.ctaText || "S'ABONNER",
      ctaLink: settings.ctaLink || '/abonnement',
      crimsonThemeHex: settings.crimsonThemeHex || '#A30626',
      heroTitle: settings.heroTitle || 'DONA MAGAZINE',
      heroSubtitle: settings.heroSubtitle || 'Plateforme éditoriale exclusive',
      heroDescription: settings.heroDescription || "Un espace dédié à l'excellence éditoriale, à la curation architecturale et aux privilèges exclusifs des femmes de pouvoir.",
      footerLegalText: settings.footerLegalText || '© 2026 DONA Magazine. Tous droits réservés.',
      footerAddressText: settings.footerAddressText || 'Paris, France',
      footerBackgroundWatermark: settings.footerBackgroundWatermark || 'DONA.'
    });
  } catch (error) {
    console.error("GET /api/global-config error:", error);
    return NextResponse.json({
      logoPath: '/assets/core/img/logo.png',
      ctaText: "S'ABONNER",
      ctaLink: '/abonnement',
      crimsonThemeHex: '#A30626',
      heroTitle: 'DONA MAGAZINE',
      heroSubtitle: 'Plateforme éditoriale exclusive',
      heroDescription: "Un espace dédié à l'excellence...",
      footerLegalText: '© 2026 DONA Magazine. Tous droits réservés.',
      footerAddressText: 'Paris, France',
      footerBackgroundWatermark: 'DONA.'
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    for (const [k, v] of Object.entries(body)) {
      dbSetSetting(k, v);
    }
    try { exportDatabaseToSqlFile(); } catch (e) {}
    return NextResponse.json({ success: true, settings: dbGetAllSettings() });
  } catch (error) {
    console.error("POST /api/global-config error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

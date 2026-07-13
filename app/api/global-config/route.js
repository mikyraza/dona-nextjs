import { NextResponse } from 'next/server';

export async function GET() {
  /*
  // FUTURE WORDPRESS HEADLESS API FETCH INTEGRATION:
  try {
    // 1. Fetch global settings from Custom ACF Options Page endpoint
    const responseSettings = await fetch('http://localhost/wp-json/dona/v1/global-settings', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const settings = await responseSettings.json();

    // 2. Fetch homepage config from Options Page
    const responseHome = await fetch('http://localhost/wp-json/dona/v1/homepage-settings', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }
    });
    const homepage = await responseHome.json();

    return NextResponse.json({
      logoPath: settings.logo_path || '/assets/core/img/logo.png',
      ctaText: settings.header_cta_text || "S'ABONNER",
      ctaLink: settings.header_cta_link || '/abonnement',
      crimsonThemeHex: settings.active_theme_crimson_hex || '#A30626',
      heroTitle: homepage.home_hero_title || 'DONA MAGAZINE',
      heroSubtitle: homepage.home_hero_kicker || 'Plateforme éditoriale exclusive',
      heroDescription: homepage.home_hero_description || "Un espace dédié à l'excellence...",
      footerLegalText: settings.footer_copyright_text || '© 2026 DONA Magazine. Tous droits réservés.',
      footerAddressText: settings.footer_address_text || 'Paris, France',
      footerBackgroundWatermark: settings.footer_background_watermark || 'DONA.'
    });
  } catch (error) {
    console.error("WordPress Headless API Fetch Error:", error);
    // Fallback to static mocks below
  }
  */

  // Mock response mapping docs/dynamic-matrix.md
  return NextResponse.json({
    logoPath: '/assets/core/img/logo.png',
    ctaText: "S'ABONNER",
    ctaLink: '/abonnement',
    crimsonThemeHex: '#A30626',
    heroTitle: 'DONA MAGAZINE',
    heroSubtitle: 'Plateforme éditoriale exclusive',
    heroDescription: "Un espace dédié à l'excellence éditoriale, à la curation architecturale et aux privilèges exclusifs des femmes de pouvoir.",
    footerLegalText: '© 2026 DONA Magazine. Tous droits réservés.',
    footerAddressText: 'Paris, France',
    footerBackgroundWatermark: 'DONA.'
  });
}

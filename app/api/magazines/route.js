import { NextResponse } from 'next/server';
import { fetchMagazinesConfig, fetchArticles } from '@/lib/wordpress';
import { magazines as defaultMagazines } from '../../magazines/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const dynamicConfigs = await fetchMagazinesConfig();
    const allArticles = await fetchArticles();

    const seenSlugs = new Set();
    const mergedList = [];

    [...dynamicConfigs, ...defaultMagazines].forEach(m => {
      const cleanSlug = m.slug?.replace(/^magazine-\d{2}-/, '') || m.slug;
      if (!seenSlugs.has(cleanSlug)) {
        seenSlugs.add(cleanSlug);
        const conf = dynamicConfigs.find(c => c.slug === m.slug || c.slug?.replace(/^magazine-\d{2}-/, '') === cleanSlug) || {};
        
        const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const targetTitle = normalize(conf.title || m.title);
        const targetSlug = normalize(cleanSlug);

        const magArticles = allArticles.filter(a => {
          const artCat = normalize(a.category);
          return artCat.includes(targetTitle) || artCat.includes(targetSlug);
        });

        mergedList.push({
          id: conf.id || m.id,
          slug: m.slug,
          title: conf.title || m.title,
          subtitle: conf.subtitle || m.subtitle,
          description: conf.description || m.description,
          themePrimary: conf.themePrimary || m.themePrimary || '#a31835',
          themeSecondary: conf.themeSecondary || m.themeSecondary || '#3d0c1b',
          gradient: conf.gradient || m.gradient || 'linear-gradient(135deg, #2b1126, #411d3d)',
          heroImage: conf.heroImage || m.heroImage || '/assets/core/img/mag_hero_01.png',
          essenceImage: conf.essenceImage || m.essenceImage || '/assets/core/img/mag_hero_02.png',
          essenceText: conf.essenceText || m.essenceText || '',
          essenceQuote: conf.essenceQuote || m.essenceQuote || '',
          icon: conf.icon || m.icon || '',
          features: conf.features || m.features || [],
          tabs: conf.tabs || m.tabs || [],
          articles: magArticles.length > 0 ? magArticles : (m.articles || []),
          tools: conf.tools || m.tools || []
        });
      }
    });

    mergedList.sort((a, b) => (parseInt(a.id, 10) || 0) - (parseInt(b.id, 10) || 0));

    return NextResponse.json(mergedList);
  } catch (err) {
    console.error("GET /api/magazines error:", err);
    return NextResponse.json(defaultMagazines);
  }
}

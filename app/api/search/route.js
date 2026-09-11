export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from 'next/server';
import { dbGetArticles, dbGetMagazines, dbGetVideos, dbGetDossiers, dbGetMembers } from '@/lib/db';
import { magazines as initialMagazines } from '@/app/magazines/data';

// Helper to safely resolve category or slug to canonical magazine slug
function resolveMagazineSlug(category) {
  if (!category) return 'magazine-01-intelligence';
  const clean = String(category).toLowerCase().trim();
  if (clean.includes('intelligence')) return 'magazine-01-intelligence';
  if (clean.includes('power') || clean.includes('lab') || clean.includes('stratégie') || clean.includes('strategie')) return 'magazine-02-power-lab';
  if (clean.includes('alliance')) return 'magazine-03-alliance';
  if (clean.includes('agenda')) return 'magazine-04-agenda';
  if (clean.includes('passion')) return 'magazine-05-passions';
  if (clean.includes('art') || clean.includes('vivre')) return 'magazine-06-art-de-vivre';
  if (clean.includes('acad')) return 'magazine-07-academie';
  if (clean.includes('patrimoine') || clean.includes('héritage') || clean.includes('heritage')) return 'magazine-08-patrimoine';
  if (clean.includes('longevity') || clean.includes('bio')) return 'magazine-09-longevity';
  if (clean.includes('impact') || clean.includes('finance') || clean.includes('geopolitic')) return 'magazine-10-impact';
  if (clean.includes('culture') || clean.includes('media')) return 'magazine-11-culture-medias';
  if (clean.includes('cercle')) return 'magazine-12-cercle';
  if (clean.includes('amour')) return 'magazine-13-amour';
  if (clean.includes('beaut')) return 'magazine-14-beaute';
  if (clean.includes('mariage')) return 'magazine-15-mariages';
  if (clean.includes('sant')) return 'magazine-16-sante';
  if (clean.startsWith('magazine-')) return clean;
  return 'magazine-01-intelligence';
}

// Helper to load videos from relational DB with fallback
function getVideos() {
  try {
    const dbVideos = dbGetVideos();
    if (Array.isArray(dbVideos) && dbVideos.length > 0) {
      return dbVideos.map(v => ({
        id: v.id,
        title: v.title,
        description: v.description || v.subtitle || '',
        category: v.category || v.magazine || '',
        magazine: v.magazine || '',
        duration: v.duration || '40 min',
        type: 'video',
        format: 'video',
        image: v.thumbnail || v.image || '/assets/core/img/home_alaune_side1_1782125709654.png',
        href: `/studio?v=${v.id}`
      }));
    }
  } catch (e) {
    console.error('Error fetching videos from DB in search:', e);
  }
  return [];
}

// Helper to load articles from relational DB with static fallback
function getArticles() {
  try {
    const dbArts = dbGetArticles();
    if (Array.isArray(dbArts) && dbArts.length > 0) {
      return dbArts.map(art => {
        const magSlug = resolveMagazineSlug(art.category || art.rubrique);
        const articleKey = art.slug || art.id;
        return {
          id: art.id,
          title: art.title,
          desc: art.desc || art.excerpt || '',
          category: art.category || art.rubrique || 'ARTICLE',
          categoryName: art.categoryName || art.rubrique || 'ARTICLE',
          badge: art.badge || "ARTICLE",
          meta: art.meta || "RÉDACTION • 10 MIN",
          image: art.image || art.coverImage || "/assets/core/img/mag_hero_03.png",
          href: `/magazines/${magSlug}/articles/${articleKey}`,
          format: "article",
          type: "article",
          author: art.author || "Elena Moretti",
          date: art.date || "2026-08-20"
        };
      });
    }
  } catch (e) {
    console.error('Error fetching articles from DB in search:', e);
  }

  const articlesList = [];
  for (const mag of (initialMagazines || [])) {
    for (const art of (mag.articles || [])) {
      articlesList.push({
        id: art.id,
        title: art.title,
        desc: art.desc || art.excerpt || '',
        category: mag.slug,
        categoryName: mag.title,
        badge: art.badge || "ARTICLE",
        meta: art.meta || "RÉDACTION • 10 MIN",
        image: art.image || mag.heroImage || "/assets/core/img/mag_hero_03.png",
        href: `/magazines/${mag.slug}/articles/${art.id}`,
        format: "article",
        type: "article",
        author: "Elena Moretti",
        date: "2026-08-20"
      });
    }
  }
  return articlesList;
}

// Helper to load magazines from relational DB
function getMagazines() {
  try {
    const dbMags = dbGetMagazines();
    if (Array.isArray(dbMags) && dbMags.length > 0) {
      return dbMags.map(mag => ({
        id: mag.id || mag.slug,
        title: mag.title,
        desc: mag.subtitle || mag.tagline || mag.description || '',
        category: mag.slug,
        format: 'magazine',
        type: 'magazine',
        image: mag.heroImage || mag.coverImage || '/assets/core/img/mag_hero_01.png',
        href: `/magazines/${resolveMagazineSlug(mag.slug || mag.category || mag.title)}`
      }));
    }
  } catch (e) {
    console.error('Error fetching magazines from DB in search:', e);
  }
  return (initialMagazines || []).map(mag => ({
    id: mag.id || mag.slug,
    title: mag.title,
    desc: mag.subtitle || mag.tagline || '',
    category: mag.slug,
    format: 'magazine',
    type: 'magazine',
    image: mag.heroImage || mag.coverImage || '/assets/core/img/mag_hero_01.png',
    href: `/magazines/${resolveMagazineSlug(mag.slug || mag.title)}`
  }));
}

// Static Podcasts
const STATIC_PODCASTS = [
  {
    id: "pod-1",
    title: "Conversations DONA : L'Art du Réseautage Élite",
    desc: "Épisode #14 avec Hélène de Ségur et nos invités d'exception.",
    category: "02. Power Lab",
    magazine: "magazine-02-power-lab",
    format: "podcast",
    type: "podcast",
    href: "/ecouter"
  },
  {
    id: "pod-2",
    title: "Finance & Impact : Stratégies de Portefeuille 2026",
    desc: "Analyse financière et investissement à impact social.",
    category: "10. Impact",
    magazine: "magazine-10-impact",
    format: "podcast",
    type: "podcast",
    href: "/ecouter"
  }
];

// Experts / Team
function getExperts() {
  try {
    const members = dbGetMembers();
    if (Array.isArray(members) && members.length > 0) {
      return members.map(m => ({
        id: m.id,
        title: m.name || 'Expert DONA',
        name: m.name,
        role: m.role || 'Membre de la Rédaction',
        bio: m.bio || 'Expert contributeur au Cercle DONA.',
        format: 'expert',
        type: 'expert',
        href: '/equipe'
      }));
    }
  } catch (e) {}

  return [
    {
      id: "exp-1",
      title: "Dr. Clarisse Bama",
      name: "Dr. Clarisse Bama",
      role: "Fondatrice & Directrice de la Publication",
      bio: "Experte en leadership et prospective stratégique.",
      format: "expert",
      type: "expert",
      href: "/equipe"
    },
    {
      id: "exp-2",
      title: "Dr. Antoine Moreau",
      name: "Dr. Antoine Moreau",
      role: "Rédacteur en Chef & Prospective",
      bio: "Spécialiste de la transformation des modèles de leadership.",
      format: "expert",
      type: "expert",
      href: "/equipe"
    },
    {
      id: "exp-3",
      title: "Hélène de Ségur",
      name: "Hélène de Ségur",
      role: "Directrice Artistique & Art de Vivre",
      bio: "Curatrice d'art et esthétiquement engagée.",
      format: "expert",
      type: "expert",
      href: "/equipe"
    }
  ];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || searchParams.get('query') || '').trim().toLowerCase();
    const category = (searchParams.get('category') || 'all').toLowerCase();
    const format = (searchParams.get('format') || 'all').toLowerCase();
    const limit = parseInt(searchParams.get('limit') || '50');

    // 1. Search Magazines / Universes
    const magazinesList = getMagazines();
    const matchedMagazines = (magazinesList || []).filter(mag => {
      const matchQuery = !q || 
        (mag.title && mag.title.toLowerCase().includes(q)) || 
        (mag.slug && mag.slug.toLowerCase().includes(q)) || 
        (mag.desc && mag.desc.toLowerCase().includes(q));
      const matchCat = category === 'all' || (mag.slug && mag.slug.toLowerCase().includes(category)) || (mag.title && mag.title.toLowerCase().includes(category));
      const matchFormat = format === 'all' || format === 'magazine';
      return matchQuery && matchCat && matchFormat;
    });

    // 2. Search Articles
    const articles = getArticles();
    const matchedArticles = articles.filter(art => {
      const title = (art.title || '').toLowerCase();
      const desc = (art.desc || art.content || '').toLowerCase();
      const cat = (art.category || art.categoryName || '').toLowerCase();
      const matchQuery = !q || title.includes(q) || desc.includes(q) || cat.includes(q);
      const matchCat = category === 'all' || cat.includes(category);
      const matchFormat = format === 'all' || format === 'article';
      return matchQuery && matchCat && matchFormat;
    });

    // 3. Search Videos
    const videos = getVideos();
    const matchedVideos = videos.filter(vid => {
      const title = (vid.title || '').toLowerCase();
      const desc = (vid.description || vid.subtitle || '').toLowerCase();
      const cat = (vid.category || vid.magazine || '').toLowerCase();
      const matchQuery = !q || title.includes(q) || desc.includes(q) || cat.includes(q);
      const matchCat = category === 'all' || cat.includes(category);
      const matchFormat = format === 'all' || format === 'video';
      return matchQuery && matchCat && matchFormat;
    });

    // 4. Search Podcasts
    const matchedPodcasts = STATIC_PODCASTS.filter(pod => {
      const title = (pod.title || '').toLowerCase();
      const desc = (pod.desc || '').toLowerCase();
      const cat = (pod.category || '').toLowerCase();
      const matchQuery = !q || title.includes(q) || desc.includes(q) || cat.includes(q);
      const matchCat = category === 'all' || cat.includes(category);
      const matchFormat = format === 'all' || format === 'podcast';
      return matchQuery && matchCat && matchFormat;
    });

    // 5. Search Experts
    const matchedExperts = getExperts().filter(exp => {
      const name = (exp.name || '').toLowerCase();
      const role = (exp.role || '').toLowerCase();
      const bio = (exp.bio || '').toLowerCase();
      const matchQuery = !q || name.includes(q) || role.includes(q) || bio.includes(q);
      const matchFormat = format === 'all' || format === 'expert';
      return matchQuery && matchFormat;
    });

    const flatResults = [
      ...matchedArticles,
      ...matchedVideos,
      ...matchedPodcasts,
      ...matchedMagazines,
      ...matchedExperts
    ].slice(0, limit);

    return NextResponse.json({
      success: true,
      query: q,
      filters: { category, format },
      total: flatResults.length,
      results: {
        magazines: matchedMagazines,
        articles: matchedArticles,
        videos: matchedVideos,
        podcasts: matchedPodcasts,
        experts: matchedExperts
      },
      flatResults
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Erreur lors de la recherche' }, { status: 500 });
  }
}

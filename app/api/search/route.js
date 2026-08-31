import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { magazines as initialMagazines } from '@/app/magazines/data';

// Helper to load videos DB
function getVideos() {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'videos_db.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {}
  return [
    {
      id: "vid-1",
      title: "Masterclass : Leadership & Stratégie sous Haute Pression",
      description: "Analyse exclusive par Dr. Clarisse Bama et nos experts éditoriaux.",
      category: "01. Intelligence",
      magazine: "magazine-01-intelligence",
      duration: "42 min",
      type: "video",
      format: "video",
      href: "/studio"
    },
    {
      id: "vid-2",
      title: "Replay DONA TV : Écosystème & Bio-Hacking 2026",
      description: "Conférence du sommet de Genève sur la médecine préventive.",
      category: "09. Longevity",
      magazine: "magazine-09-longevity",
      duration: "58 min",
      type: "video",
      format: "video",
      href: "/studio"
    }
  ];
}

// Helper to load articles
function getArticles() {
  const articlesList = [];
  try {
    const filePath = path.join(process.cwd(), 'lib', 'articles_db.json');
    if (fs.existsSync(filePath)) {
      const stored = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    }
  } catch (e) {}

  // Fallback to static articles from 16 magazines
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
        href: `/magazines/${mag.slug}`,
        format: "article",
        type: "article",
        author: "Elena Moretti",
        date: "2026-08-20"
      });
    }
  }
  return articlesList;
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

// Static Experts
const EXPERTS = [
  {
    id: "exp-1",
    name: "Dr. Clarisse Bama",
    role: "Fondatrice & Directrice de la Publication",
    bio: "Experte en leadership et prospective stratégique.",
    format: "expert",
    type: "expert",
    href: "/equipe"
  },
  {
    id: "exp-2",
    name: "Antoine Moreau",
    role: "Rédacteur en Chef — Économie & Finance",
    bio: "Spécialiste des politiques monétaires et marchés émergents.",
    format: "expert",
    type: "expert",
    href: "/equipe"
  },
  {
    id: "exp-3",
    name: "Hélène de Ségur",
    role: "Directrice Artistique & Art de Vivre",
    bio: "Curatrice d'art et esthétiquement engagée.",
    format: "expert",
    type: "expert",
    href: "/equipe"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || searchParams.get('query') || '').trim().toLowerCase();
    const category = (searchParams.get('category') || 'all').toLowerCase();
    const format = (searchParams.get('format') || 'all').toLowerCase();
    const limit = parseInt(searchParams.get('limit') || '50');

    // 1. Search Magazines / Universes
    const matchedMagazines = (initialMagazines || []).filter(mag => {
      const matchQuery = !q || 
        mag.title.toLowerCase().includes(q) || 
        mag.slug.toLowerCase().includes(q) || 
        (mag.tagline && mag.tagline.toLowerCase().includes(q)) ||
        (mag.subtitle && mag.subtitle.toLowerCase().includes(q));
      const matchCat = category === 'all' || mag.slug.toLowerCase().includes(category) || mag.title.toLowerCase().includes(category);
      const matchFormat = format === 'all' || format === 'magazine';
      return matchQuery && matchCat && matchFormat;
    }).map(mag => ({
      id: mag.id || mag.slug,
      title: mag.title,
      desc: mag.subtitle || mag.tagline || '',
      category: mag.slug,
      format: 'magazine',
      type: 'magazine',
      image: mag.heroImage || mag.coverImage || '/assets/core/img/mag_hero_01.png',
      href: `/magazines/${mag.slug}`
    }));

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
    }).map(v => ({
      ...v,
      format: 'video',
      type: 'video',
      href: `/studio?v=${v.id}`
    }));

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
    const matchedExperts = EXPERTS.filter(exp => {
      const name = exp.name.toLowerCase();
      const role = exp.role.toLowerCase();
      const bio = exp.bio.toLowerCase();
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

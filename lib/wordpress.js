import { magazines as initialMagazines } from '../app/magazines/data';
import {
  dbGetArticles,
  dbGetArticleById,
  dbUpsertArticle,
  dbDeleteArticle,
  dbGetMagazines,
  dbGetMagazineBySlug,
  dbUpsertMagazine,
  dbDeleteMagazine,
  dbGetDossiers,
  dbGetDossierById,
  dbDeleteDossier,
  dbUpsertDossier
} from './db';

// Disable TLS verification for local HTTPS self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const WP_API_URL = process.env.WORDPRESS_API_URL || null;
const WP_AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN || null;

// Relational DB Helpers
function getLocalArticles() {
  try {
    return dbGetArticles();
  } catch (err) {
    console.error('Error fetching articles from relational database:', err);
    return [];
  }
}

function saveLocalArticles(articlesList) {
  try {
    if (Array.isArray(articlesList)) {
      for (const art of articlesList) {
        dbUpsertArticle(art);
      }
    }
  } catch (err) {
    console.error('Error saving articles to relational database:', err);
  }
}

// Static default articles fallback helper
function getStaticArticles() {
  try {
    const staticList = [];
    for (const mag of (initialMagazines || [])) {
      for (const art of (mag.articles || [])) {
        staticList.push({
          id: art.id,
          title: art.title,
          desc: art.desc,
          badge: art.badge || "ARTICLE",
          rubrique: art.badge || "ARTICLE",
          subcategory: art.badge || "ARTICLE",
          meta: art.meta || "RÉDACTION • 10 MIN DE LECTURE",
          image: art.image || "/assets/core/img/mag_hero_03.png",
          coverImage: art.image || "/assets/core/img/mag_hero_03.png",
          category: mag.slug,
          format: "text",
          author: "Elena Moretti",
          status: "Published",
          isVipOnly: false,
          content: `<p>${art.desc}</p>`
        });
      }
    }
    return staticList;
  } catch (e) {
    return [];
  }
}

// Helper to make authenticated requests to WordPress REST API safely with quick timeout
async function wpFetch(path, options = {}) {
  if (!WP_API_URL) {
    return null;
  }

  const url = `${WP_API_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (WP_AUTH_TOKEN) {
    headers["Authorization"] = `Basic ${WP_AUTH_TOKEN}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    return null;
  }
}

// Category matching helper between article category and target magazine slug/title
export function matchMagazineCategory(articleCategory, targetCategory) {
  if (!targetCategory) return true;
  if (!articleCategory) return false;

  const normalize = (str) =>
    (str || '')
      .toLowerCase()
      .replace(/^magazine-/, '')
      .replace(/^\d+[\s.-]*/, '')
      .replace(/[^a-z0-9]/g, '');

  const cleanTarget = normalize(targetCategory);
  const cleanArticle = normalize(articleCategory);

  if (cleanTarget && cleanArticle && (cleanTarget.includes(cleanArticle) || cleanArticle.includes(cleanTarget))) {
    return true;
  }

  // Also match by magazine number if present (e.g. "01", "1", "02")
  const targetNum = (targetCategory || '').match(/\d+/)?.[0];
  const articleNum = (articleCategory || '').match(/\d+/)?.[0];
  if (targetNum && articleNum && parseInt(targetNum, 10) === parseInt(articleNum, 10)) {
    return true;
  }

  return false;
}

export async function fetchArticles(params = {}) {
  try {
    let wpMapped = [];
    if (WP_API_URL) {
      const query = new URLSearchParams();
      if (params.per_page) query.append("per_page", params.per_page);
      if (params.page) query.append("page", params.page);
      
      const endpoint = `/wp/v2/posts?${query.toString()}`;
      const posts = await wpFetch(endpoint);
      if (posts && Array.isArray(posts)) {
        wpMapped = posts.map(post => ({
          id: post.id.toString(),
          title: post.title?.rendered || post.title || "",
          content: post.content?.rendered || post.content || "",
          desc: post.excerpt?.rendered || post.content?.rendered?.substring(0, 150) || "",
          format: post.acf?.format || "text",
          isVipOnly: post.acf?.is_vip_only || false,
          videoUrl: post.acf?.video_url || "",
          audioFile: post.acf?.audio_file || "",
          category: post.acf?.category || "Articles",
          rubrique: post.acf?.rubrique || post.acf?.subcategory || "",
          subcategory: post.acf?.rubrique || post.acf?.subcategory || "",
          badge: post.acf?.badge || (post.acf?.rubrique || "ARTICLE").toUpperCase(),
          coverImage: post.acf?.cover_image || "/assets/core/img/mag_hero_03.png",
          image: post.acf?.cover_image || "/assets/core/img/mag_hero_03.png",
          articleGallery: post.acf?.galerie_photos || [],
          galerie_photos: post.acf?.galerie_photos || [],
          placementTarget: post.acf?.placement_target || "STANDARD_FEED",
          author: post.acf?.author || "Elena Moretti",
          updated: post.date ? new Date(post.date).toLocaleDateString('fr-FR') : "À l'instant",
          status: post.status === "publish" ? "Published" : "Draft"
        }));
      }
    }

    const localArts = getLocalArticles();
    const staticArts = getStaticArticles();

    const seenIds = new Set();
    const merged = [];

    // 1. Admin-created & relational database articles take highest priority
    for (const art of localArts) {
      if (art && art.id && !seenIds.has(art.id.toString())) {
        seenIds.add(art.id.toString());
        merged.push({
          ...art,
          id: art.id.toString(),
          image: art.coverImage || art.image || "/assets/core/img/mag_hero_03.png",
          coverImage: art.coverImage || art.image || "/assets/core/img/mag_hero_03.png",
          badge: art.badge || (art.rubrique || "ARTICLE").toUpperCase(),
          author: art.author || "Elena Moretti",
          status: art.status || "Published",
          meta: art.meta || `${(art.author || "RÉDACTION").toUpperCase()} • ${art.updated || "RÉCENT"}`
        });
      }
    }

    // 2. Add remote WordPress articles if any
    for (const art of wpMapped) {
      if (art && art.id && !seenIds.has(art.id.toString())) {
        seenIds.add(art.id.toString());
        merged.push({
          ...art,
          image: art.coverImage || art.image || "/assets/core/img/mag_hero_03.png",
          coverImage: art.coverImage || art.image || "/assets/core/img/mag_hero_03.png",
          badge: art.badge || (art.rubrique || "ARTICLE").toUpperCase(),
          author: art.author || "Elena Moretti",
          status: art.status || "Published",
          meta: art.meta || `${(art.author || "RÉDACTION").toUpperCase()} • ${art.updated || "RÉCENT"}`
        });
      }
    }

    // 3. Fill in default static articles
    for (const art of staticArts) {
      if (art && art.id && !seenIds.has(art.id.toString())) {
        seenIds.add(art.id.toString());
        merged.push(art);
      }
    }

    let finalArticles = merged;

    // Filter drafts out for public section unless requested
    if (!params.includeDrafts) {
      finalArticles = finalArticles.filter(a => (a.status || 'Published').toLowerCase() !== 'draft');
    }

    // Category filter
    if (params.category) {
      finalArticles = finalArticles.filter(a => matchMagazineCategory(a.category, params.category));
    }

    return finalArticles;
  } catch (error) {
    return getLocalArticles();
  }
}

export async function fetchArticleById(id) {
  try {
    if (!id) return null;
    const strId = id.toString();

    // Check relational database first
    const local = dbGetArticleById(strId);
    if (local) {
      return {
        ...local,
        id: local.id.toString(),
        image: local.coverImage || local.image || "/assets/core/img/mag_hero_03.png",
        coverImage: local.coverImage || local.image || "/assets/core/img/mag_hero_03.png",
        badge: local.badge || (local.rubrique || "ARTICLE").toUpperCase(),
        author: local.author || "Elena Moretti",
        meta: local.meta || `${(local.author || "RÉDACTION").toUpperCase()} • ${local.updated || "RÉCENT"}`
      };
    }

    // Check static default articles
    const staticArts = getStaticArticles();
    const staticFound = staticArts.find(a => a.id?.toString() === strId || a.slug === strId);
    if (staticFound) {
      return staticFound;
    }

    // Check WordPress if remote is active
    if (WP_API_URL) {
      const post = await wpFetch(`/wp/v2/posts/${id}`);
      if (post) {
        return {
          id: post.id.toString(),
          title: post.title?.rendered || post.title || "",
          content: post.content?.rendered || post.content || "",
          desc: post.excerpt?.rendered || "",
          format: post.acf?.format || "text",
          isVipOnly: post.acf?.is_vip_only || false,
          videoUrl: post.acf?.video_url || "",
          audioFile: post.acf?.audio_file || "",
          category: post.acf?.category || "Articles",
          rubrique: post.acf?.rubrique || post.acf?.subcategory || "",
          subcategory: post.acf?.rubrique || post.acf?.subcategory || "",
          badge: post.acf?.badge || (post.acf?.rubrique || "ARTICLE").toUpperCase(),
          coverImage: post.acf?.cover_image || "/assets/core/img/mag_hero_03.png",
          image: post.acf?.cover_image || "/assets/core/img/mag_hero_03.png",
          articleGallery: post.acf?.galerie_photos || [],
          galerie_photos: post.acf?.galerie_photos || [],
          placementTarget: post.acf?.placement_target || "STANDARD_FEED",
          author: post.acf?.author || "Elena Moretti",
          updated: post.date ? new Date(post.date).toLocaleDateString('fr-FR') : "À l'instant",
          status: post.status === "publish" ? "Published" : "Draft"
        };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function createOrUpdateArticle(articleData) {
  const newArticle = {
    id: articleData.id || `art-${Date.now()}`,
    title: articleData.title || "Nouvel Article",
    author: articleData.author || "Elena Moretti",
    category: articleData.category || "01. Intelligence",
    rubrique: articleData.rubrique || articleData.subcategory || articleData.badge || "The Brief",
    subcategory: articleData.rubrique || articleData.subcategory || articleData.badge || "The Brief",
    badge: articleData.badge || (articleData.rubrique || "ARTICLE").toUpperCase(),
    content: articleData.content || "",
    summary: articleData.summary || articleData.desc || "",
    desc: articleData.summary || articleData.desc || (articleData.content ? articleData.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : ""),
    format: articleData.format || "text",
    coverImage: articleData.coverImage || articleData.image || "/assets/core/img/mag_hero_03.png",
    articleGallery: articleData.articleGallery || [],
    videoUrl: articleData.videoUrl || "",
    audioFile: articleData.audioFile || "",
    status: articleData.status === "Draft" ? "Draft" : "Published",
    isVipOnly: Boolean(articleData.isVipOnly),
    placementTarget: articleData.placementTarget || "STANDARD_FEED",
    updated: "À l'instant"
  };

  // Persist directly to Relational SQLite DB
  const saved = dbUpsertArticle(newArticle);

  // Attempt optional remote WordPress sync if configured
  if (WP_API_URL) {
    const isEdit = articleData.id && !articleData.id.toString().startsWith("art-");
    const endpoint = isEdit ? `/wp/v2/posts/${articleData.id}` : `/wp/v2/posts`;
    const method = isEdit ? "PUT" : "POST";

    const body = {
      title: newArticle.title,
      content: newArticle.content || "",
      status: newArticle.status === "Published" ? "publish" : "draft",
      acf: {
        format: newArticle.format,
        is_vip_only: newArticle.isVipOnly,
        video_url: newArticle.videoUrl,
        audio_file: newArticle.audioFile,
        category: newArticle.category,
        rubrique: newArticle.rubrique,
        cover_image: newArticle.coverImage,
        galerie_photos: newArticle.articleGallery,
        placement_target: newArticle.placementTarget
      }
    };

    await wpFetch(endpoint, {
      method,
      body: JSON.stringify(body)
    });
  }

  return {
    success: true,
    ...(saved || newArticle)
  };
}

export async function deleteArticle(id) {
  if (!id) return { success: false, error: "ID manquant" };
  const strId = id.toString();
  dbDeleteArticle(strId);

  if (WP_API_URL && !strId.startsWith("art-")) {
    await wpFetch(`/wp/v2/posts/${strId}`, {
      method: "DELETE"
    }).catch(() => {});
  }

  return { success: true };
}

export const DEFAULT_THEMATIC_DOSSIERS = [
  {
    id: 'dos-01',
    title: 'Intelligence Économique & Géopolitique Féminine',
    coordinator: 'Hélène de Ségur',
    description: 'Une enquête exclusive sur les réseaux d’influence et le leadership des femmes décideuses en Europe.',
    summary: 'Analyse approfondie des leviers de pouvoir contemporains et stratégies d\'influence mondiale.',
    coverImage: '/assets/core/img/vault-1.png',
    articles: ['art-1740000000001', 'art-1'],
    isVipOnly: true,
    isFeatured: true,
    category: 'Analyses & Enquêtes',
    magazine: 'magazine-01-intelligence',
    label: 'DOSSIER SPÉCIAL',
    status: 'Published'
  },
  {
    id: 'dos-02',
    title: 'L\'Empire du Silicium : Les Dessous de la Révolution Tech',
    coordinator: 'Dr. Antoine Moreau',
    description: 'Une enquête exclusive sur la géopolitique des semi-conducteurs et le rôle de l\'Europe dans la course mondiale.',
    summary: 'Comprendre les enjeux de souveraineté technologique et les chaînes de valeur de l\'IA.',
    coverImage: '/assets/core/img/mag_hero_02.png',
    articles: ['art-2', 'art-1740000000002'],
    isVipOnly: false,
    isFeatured: true,
    category: 'Technologie & Stratégie',
    magazine: 'magazine-02-power-lab',
    label: 'ENQUÊTE EXCLUSIVE',
    status: 'Published'
  },
  {
    id: 'dos-03',
    title: 'L\'Architecture du Silence : Esthétique & Épure Contemporaine',
    coordinator: 'Elena Moretti',
    description: 'Une exploration visuelle et architecturale des sanctuaires urbains et du design néo-minimaliste.',
    summary: 'Redéfinir le luxe par l\'espace, la lumière et la matière brute.',
    coverImage: '/assets/core/img/mag_hero_03.png',
    articles: ['art-3'],
    isVipOnly: true,
    isFeatured: false,
    category: 'Design & Architecture',
    magazine: 'magazine-06-art-de-vivre',
    label: 'DOSSIER CURATION',
    status: 'Published'
  },
  {
    id: 'dos-04',
    title: 'Longevity & Santé Préventive : Repousser les Limites du Vivant',
    coordinator: 'Dr. Antoine Moreau',
    description: 'Innovations biomédicales, protocoles de longévité cellulaire et médecine régénérative de pointe.',
    summary: 'L\'impact des thérapies géniques et de la nutrition avancée sur l\'espérance de vie en bonne santé.',
    coverImage: '/assets/core/img/vault-2.png',
    articles: [],
    isVipOnly: false,
    isFeatured: false,
    category: 'Sciences & Bien-Être',
    magazine: 'magazine-09-longevity',
    label: 'DOSSIER RECHERCHE',
    status: 'Published'
  },
  {
    id: 'dos-05',
    title: 'Gouvernance & Impact : Le Leadership Éthique du XXIe Siècle',
    coordinator: 'Marc Aubry',
    description: 'Comment les grandes dynasties et fonds d\'investissement réinventent le capitalisme d\'utilité publique.',
    summary: 'Études de cas sur les modèles hybrides conjuguant rentabilité financière et impact sociétal positif.',
    coverImage: '/assets/core/img/mag_hero_01.png',
    articles: [],
    isVipOnly: true,
    isFeatured: false,
    category: 'Leadership & RSE',
    magazine: 'magazine-10-impact',
    label: 'DOSSIER STRATÉGIQUE',
    status: 'Published'
  }
];

export async function fetchDossiers(params = {}) {
  try {
    const dbDossiers = dbGetDossiers();
    let list = Array.isArray(dbDossiers) && dbDossiers.length > 0 ? dbDossiers : DEFAULT_THEMATIC_DOSSIERS;

    // Filter by magazine slug/ID
    if (params.magazine) {
      const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetMag = normalize(params.magazine);
      list = list.filter(d => {
        const mag = normalize(d.magazine);
        return mag.includes(targetMag) || targetMag.includes(mag);
      });
    }

    // Filter by category
    if (params.category) {
      const targetCat = params.category.toLowerCase().trim();
      list = list.filter(d => (d.category || '').toLowerCase().includes(targetCat));
    }

    // Filter by VIP status
    if (typeof params.isVipOnly === 'boolean') {
      list = list.filter(d => Boolean(d.isVipOnly) === params.isVipOnly);
    }

    // Filter by Featured status
    if (typeof params.isFeatured === 'boolean') {
      list = list.filter(d => Boolean(d.isFeatured) === params.isFeatured);
    }

    // Filter drafts out for public section unless requested
    if (!params.includeDrafts) {
      list = list.filter(d => (d.status || 'Published').toLowerCase() !== 'draft');
    }

    // Keyword search
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(d =>
        (d.title || '').toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q) ||
        (d.coordinator || '').toLowerCase().includes(q)
      );
    }

    // Limit
    if (params.limit && typeof params.limit === 'number') {
      list = list.slice(0, params.limit);
    }

    return list;
  } catch (err) {
    console.error('Error in fetchDossiers:', err);
    return DEFAULT_THEMATIC_DOSSIERS;
  }
}

export async function fetchDossierById(id) {
  try {
    if (!id) return null;
    const strId = id.toString();
    const local = dbGetDossierById(strId);
    if (local) return local;

    return DEFAULT_THEMATIC_DOSSIERS.find(d => d.id === strId) || null;
  } catch (err) {
    return DEFAULT_THEMATIC_DOSSIERS.find(d => d.id === id) || null;
  }
}

export async function createOrUpdateDossier(dossierData) {
  try {
    const saved = dbUpsertDossier(dossierData);
    return {
      success: true,
      ...(saved || dossierData)
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

export async function deleteDossier(id) {
  try {
    if (!id) return { success: false, error: "ID manquant" };
    const success = dbDeleteDossier(id);
    return { success };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Magazine Configuration DB Helpers
export async function fetchMagazinesConfig() {
  try {
    return dbGetMagazines();
  } catch (err) {
    console.error('Error fetching magazines config from DB:', err);
    return [];
  }
}

export async function fetchMagazineConfig(slug) {
  const found = dbGetMagazineBySlug(slug);
  if (found) return found;

  // Fallback to initial static data
  const baseMag = (initialMagazines || []).find(m => m.slug === slug || m.slug.replace(/^magazine-\d{2}-/, '') === slug);
  if (!baseMag) return null;

  return {
    ...baseMag,
    heroButtons: [
      { id: "btn-1", label: "Explorer les Éditions", url: "#articles", visible: true },
      { id: "btn-2", label: "S'abonner au Magazine", url: "/abonnement", visible: true }
    ],
    essenceTitle: `L'Essence de ${baseMag.title}`,
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
}

export async function saveMagazineConfig(slug, configData) {
  try {
    const updatedConfig = {
      ...configData,
      slug: slug,
      updatedAt: new Date().toISOString()
    };
    const saved = dbUpsertMagazine(slug, updatedConfig);
    return { success: true, magazine: saved || updatedConfig };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteMagazineConfig(slug) {
  try {
    dbDeleteMagazine(slug);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}



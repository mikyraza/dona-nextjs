import fs from 'fs';
import path from 'path';

// Disable TLS verification for local HTTPS self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const WP_API_URL = process.env.WORDPRESS_API_URL || "https://dona-magazine.local/wp-json";
const WP_AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN;

const DB_FILE_PATH = path.join(process.cwd(), 'lib', 'articles_db.json');

// Local fallback DB helpers
function getLocalArticles() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading articles_db.json:", err);
  }
  return [];
}

function saveLocalArticles(articlesList) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(articlesList, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving articles_db.json:", err);
  }
}

// Helper to make authenticated requests to WordPress REST API
async function wpFetch(path, options = {}) {
  const url = `${WP_API_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (WP_AUTH_TOKEN) {
    headers["Authorization"] = `Basic ${WP_AUTH_TOKEN}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `WordPress API returned status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`WordPress fetch error on ${path}:`, error.message);
    throw error;
  }
}

export async function fetchArticles(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.per_page) query.append("per_page", params.per_page);
    if (params.page) query.append("page", params.page);
    
    const endpoint = `/wp/v2/posts?${query.toString()}`;
    const posts = await wpFetch(endpoint).catch(() => {
      console.warn("Falling back to local articles_db.json storage for articles list");
      return null;
    });

    const localArts = getLocalArticles();
    const wpMapped = (posts || []).map(post => ({
      id: post.id.toString(),
      title: post.title?.rendered || post.title || "",
      content: post.content?.rendered || post.content || "",
      desc: post.excerpt?.rendered || post.content?.rendered?.substring(0, 150) || "",
      format: post.acf?.format || "text",
      isVipOnly: post.acf?.is_vip_only || false,
      videoUrl: post.acf?.video_url || "",
      audioFile: post.acf?.audio_file || "",
      category: post.acf?.category || "Articles",
      coverImage: post.acf?.cover_image || "",
      articleGallery: post.acf?.galerie_photos || [],
      placementTarget: post.acf?.placement_target || "STANDARD_FEED",
      status: post.status === "publish" ? "Published" : "Draft"
    }));

    const wpIds = new Set(wpMapped.map(p => p.id));
    const merged = [...localArts.filter(a => !wpIds.has(a.id.toString())), ...wpMapped];

    if (params.category) {
      const targetTokens = params.category.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t && t !== 'magazine');
      return merged.filter(a => {
        const artCat = (a.category || "").toLowerCase().replace(/[^a-z0-9]/g, ' ');
        return targetTokens.some(token => artCat.includes(token));
      });
    }

    return merged;
  } catch (error) {
    console.error("fetchArticles error:", error);
    return getLocalArticles();
  }
}

export async function fetchArticleById(id) {
  try {
    const post = await wpFetch(`/wp/v2/posts/${id}`).catch(() => null);
    if (!post) {
      const localArts = getLocalArticles();
      return localArts.find(a => a.id.toString() === id.toString()) || null;
    }
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
      coverImage: post.acf?.cover_image || "",
      articleGallery: post.acf?.galerie_photos || [],
      placementTarget: post.acf?.placement_target || "STANDARD_FEED",
      status: post.status === "publish" ? "Published" : "Draft"
    };
  } catch (error) {
    console.error("fetchArticleById error:", error);
    return null;
  }
}

export async function createOrUpdateArticle(articleData) {
  const isEdit = articleData.id && !articleData.id.toString().startsWith("art-");
  const endpoint = isEdit ? `/wp/v2/posts/${articleData.id}` : `/wp/v2/posts`;
  const method = isEdit ? "PUT" : "POST";

  const body = {
    title: articleData.title,
    content: articleData.content || "",
    status: articleData.isVipOnly || articleData.status === "Published" ? "publish" : "draft",
    acf: {
      format: articleData.format || "text",
      is_vip_only: articleData.isVipOnly || false,
      video_url: articleData.videoUrl || "",
      audio_file: articleData.audioFile || "",
      category: articleData.category || "Articles",
      cover_image: articleData.coverImage || "",
      galerie_photos: articleData.articleGallery || [],
      placement_target: articleData.placementTarget || "STANDARD_FEED"
    }
  };

  const newArticle = {
    id: articleData.id || `art-${Date.now()}`,
    title: articleData.title,
    author: articleData.author || "Elena Moretti",
    category: articleData.category || "Articles",
    content: articleData.content || "",
    desc: articleData.summary || articleData.content?.replace(/<[^>]*>?/gm, '').substring(0, 160) || "",
    format: articleData.format || "text",
    coverImage: articleData.coverImage || articleData.image || "/assets/core/img/mag_hero_03.png",
    articleGallery: articleData.articleGallery || [],
    videoUrl: articleData.videoUrl || "",
    audioFile: articleData.audioFile || "",
    status: articleData.isVipOnly || articleData.status === "Published" ? "Published" : "Draft",
    isVipOnly: articleData.isVipOnly || false,
    placementTarget: articleData.placementTarget || "STANDARD_FEED",
    updated: "À l'instant"
  };

  // Always sync with local file storage so offline / dev mode is 100% persistent
  const localList = getLocalArticles();
  const existingIdx = localList.findIndex(a => a.id.toString() === newArticle.id.toString());
  if (existingIdx >= 0) {
    localList[existingIdx] = { ...localList[existingIdx], ...newArticle };
  } else {
    localList.unshift(newArticle);
  }
  saveLocalArticles(localList);

  try {
    const res = await wpFetch(endpoint, {
      method,
      body: JSON.stringify(body)
    });
    return {
      success: true,
      id: res.id.toString(),
      title: res.title?.rendered || res.title,
      format: res.acf?.format,
      isVipOnly: res.acf?.is_vip_only,
      videoUrl: res.acf?.video_url,
      audioFile: res.acf?.audio_file,
      coverImage: res.acf?.cover_image || "",
      articleGallery: res.acf?.galerie_photos || []
    };
  } catch (error) {
    console.warn("createOrUpdateArticle WordPress remote write failed, saved to local articles_db.json storage:", error.message);
    return {
      success: true,
      ...newArticle,
      simulated: true
    };
  }
}


export async function fetchDossiers() {
  try {
    const dossiers = await wpFetch("/wp/v2/dossiers").catch(() => {
      console.warn("Falling back to local mock data for dossiers list");
      return [];
    });
    return dossiers.map(dos => ({
      id: dos.id.toString(),
      title: dos.title?.rendered || dos.title || "",
      description: dos.acf?.description || "",
      coverImage: dos.acf?.cover_image || "",
      articles: dos.acf?.associated_articles || [],
      isVipOnly: dos.acf?.is_vip_only || false
    }));
  } catch (error) {
    console.error("fetchDossiers error:", error);
    return [];
  }
}

export async function createOrUpdateDossier(dossierData) {
  const isEdit = dossierData.id && !dossierData.id.toString().startsWith("dos-");
  const endpoint = isEdit ? `/wp/v2/dossiers/${dossierData.id}` : `/wp/v2/dossiers`;
  const method = isEdit ? "PUT" : "POST";

  const body = {
    title: dossierData.title,
    status: "publish",
    acf: {
      description: dossierData.description || "",
      cover_image: dossierData.coverImage || "",
      associated_articles: dossierData.articles || [],
      is_vip_only: dossierData.isVipOnly || false
    }
  };

  try {
    const res = await wpFetch(endpoint, {
      method,
      body: JSON.stringify(body)
    });
    return {
      success: true,
      id: res.id.toString(),
      title: res.title?.rendered || res.title,
      articles: res.acf?.associated_articles
    };
  } catch (error) {
    console.warn("createOrUpdateDossier WordPress failed, simulating successful local sync:", error.message);
    return {
      success: true,
      id: dossierData.id || `dos-${Date.now()}`,
      title: dossierData.title,
      description: dossierData.description,
      coverImage: dossierData.coverImage,
      articles: dossierData.articles,
      isVipOnly: dossierData.isVipOnly,
      simulated: true
    };
  }
}

// Magazine Configuration DB Helpers
const MAGS_DB_FILE_PATH = path.join(process.cwd(), 'lib', 'magazines_db.json');

export async function fetchMagazinesConfig() {
  try {
    if (fs.existsSync(MAGS_DB_FILE_PATH)) {
      const content = fs.readFileSync(MAGS_DB_FILE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading magazines_db.json:", err);
  }
  return [];
}

export async function fetchMagazineConfig(slug) {
  const allMags = await fetchMagazinesConfig();
  const found = allMags.find(m => m.slug === slug || m.slug.replace(/^magazine-\d{2}-/, '') === slug);
  if (found) return found;

  // Fallback to initial data if not yet modified
  const { magazines } = require('../app/magazines/data');
  const baseMag = magazines.find(m => m.slug === slug || m.slug.replace(/^magazine-\d{2}-/, '') === slug);
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
  const allMags = await fetchMagazinesConfig();
  const index = allMags.findIndex(m => m.slug === slug || m.slug.replace(/^magazine-\d{2}-/, '') === slug);
  
  const updatedConfig = {
    ...configData,
    slug: slug,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    allMags[index] = { ...allMags[index], ...updatedConfig };
  } else {
    allMags.push(updatedConfig);
  }

  try {
    fs.writeFileSync(MAGS_DB_FILE_PATH, JSON.stringify(allMags, null, 2), 'utf-8');
    return { success: true, magazine: updatedConfig };
  } catch (err) {
    console.error("Error saving magazine config:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteMagazineConfig(slug) {
  const allMags = await fetchMagazinesConfig();
  const filtered = allMags.filter(m => m.slug !== slug && m.slug.replace(/^magazine-\d{2}-/, '') !== slug);
  try {
    fs.writeFileSync(MAGS_DB_FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error("Error deleting magazine config:", err);
    return { success: false, error: err.message };
  }
}


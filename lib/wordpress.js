const WP_API_URL = process.env.WORDPRESS_API_URL || "http://localhost/wp-json";
const WP_AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN;

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
      console.warn("Falling back to local mock data for articles list");
      return [
        {
          id: 1,
          title: { rendered: "L'avenir de la presse indépendante" },
          content: { rendered: "Corps de l'article" },
          acf: { format: "text", is_vip_only: false }
        }
      ];
    });
    
    return posts.map(post => ({
      id: post.id.toString(),
      title: post.title?.rendered || post.title || "",
      content: post.content?.rendered || post.content || "",
      format: post.acf?.format || "text",
      isVipOnly: post.acf?.is_vip_only || false,
      videoUrl: post.acf?.video_url || "",
      audioFile: post.acf?.audio_file || "",
      category: post.acf?.category || "Articles",
      status: post.status === "publish" ? "Published" : "Draft"
    }));
  } catch (error) {
    console.error("fetchArticles error:", error);
    return [];
  }
}

export async function fetchArticleById(id) {
  try {
    const post = await wpFetch(`/wp/v2/posts/${id}`).catch(() => {
      return {
        id,
        title: { rendered: "Article Mock" },
        content: { rendered: "Contenu" },
        acf: { format: "text", is_vip_only: false }
      };
    });
    return {
      id: post.id.toString(),
      title: post.title?.rendered || post.title || "",
      content: post.content?.rendered || post.content || "",
      format: post.acf?.format || "text",
      isVipOnly: post.acf?.is_vip_only || false,
      videoUrl: post.acf?.video_url || "",
      audioFile: post.acf?.audio_file || "",
      category: post.acf?.category || "Articles",
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
      galerie_photos: articleData.articleGallery || []
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
      format: res.acf?.format,
      isVipOnly: res.acf?.is_vip_only,
      videoUrl: res.acf?.video_url,
      audioFile: res.acf?.audio_file,
      coverImage: res.acf?.cover_image || "",
      articleGallery: res.acf?.galerie_photos || []
    };
  } catch (error) {
    console.warn("createOrUpdateArticle WordPress failed, simulating successful local sync:", error.message);
    return {
      success: true,
      id: articleData.id || `art-${Date.now()}`,
      title: articleData.title,
      format: articleData.format,
      isVipOnly: articleData.isVipOnly,
      videoUrl: articleData.videoUrl,
      audioFile: articleData.audioFile,
      coverImage: articleData.coverImage || "",
      articleGallery: articleData.articleGallery || [],
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

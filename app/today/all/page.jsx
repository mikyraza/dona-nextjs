"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const defaultFilters = [
  { id: 1, label: "TOUTES", url: "#" },
  { id: 2, label: "GÉOPOLITIQUE", url: "#" },
  { id: 3, label: "ÉCONOMIE", url: "#" },
  { id: 4, label: "BUSINESS", url: "#" },
  { id: 5, label: "INNOVATION", url: "#" },
  { id: 6, label: "SOCIÉTÉ", url: "#" },
  { id: 7, label: "CULTURE", url: "#" }
];

const defaultUrgent = {
  id: "news-1",
  title: "Accord historique sur la parité salariale au sein de l'Union Européenne",
  desc: "Après des mois de négociations intenses, le Parlement a adopté ce matin une directive contraignante, marquant un tournant décisif pour l'égalité économique.",
  image: "/assets/core/img/featured_urgent.png",
  category: "ÉCONOMIE",
  time: "15:00",
  isFeatured: true
};

const defaultTimeline = [
  { id: "news-2", time: "14:30", isNew: true, title: "Nominations à la tête des grandes banques centrales", desc: "Trois femmes pressenties pour diriger les institutions clés en Asie et en Europe, un signal fort pour les marchés financiers.", category: "ÉCONOMIE", image: "/assets/core/img/home_alaune_side1_1782125709654.png" },
  { id: "news-3", time: "13:15", isNew: false, title: "COP29 : Les initiatives climatiques portées par des entrepreneures", desc: "Le sommet met en lumière des solutions innovantes développées par des startups dirigées par des femmes dans les pays du Sud.", category: "INNOVATION", image: "/assets/core/img/home_alaune_side2_1782125722981.png" },
  { id: "news-4", time: "11:45", isNew: false, title: "Rétrospective : L'impact de l'architecture inclusive", desc: "Comment la nouvelle vague de designers redessine les espaces publics pour plus de sécurité et de convivialité urbaine.", category: "SOCIÉTÉ", image: "/assets/core/img/mag_hero_04.png" }
];

const defaultFrance = [
  { id: "fr-1", category: "POLITIQUE", time: "Il y a 45 min", title: "Loi Égalité Professionnelle : Le Sénat adopte le texte en première lecture", desc: "Les quotas dans les comités de direction des grandes entreprises seront renforcés dès 2026.", image: "/assets/core/img/france_1.png" },
  { id: "fr-2", category: "ÉCONOMIE", time: "Il y a 2h", title: "CAC 40 : Les entreprises dirigées par des femmes surperforment", desc: "Une nouvelle étude démontre une rentabilité supérieure de 12% pour les groupes à parité.", image: "/assets/core/img/france_2.png" },
  { id: "fr-3", category: "CULTURE", time: "Il y a 4h", title: "Cannes 2026 : Record historique de femmes réalisatrices en sélection officielle", desc: "Thierry Frémaux annonce une sélection paritaire pour la première fois dans l'histoire du festival.", image: "/assets/core/img/france_3_1782121595894.png" }
];

const initialConfig = {
  filters: defaultFilters,
  urgentArticle: defaultUrgent,
  newsTimeline: defaultTimeline,
  france: defaultFrance
};

function safeImg(img) {
  if (!img) return '/assets/core/img/featured_urgent.png';
  if (img.startsWith('http') || img.startsWith('/')) return img;
  return '/' + img;
}

function getArticleLink(article) {
  const rawId = article.id || article._id || '';
  const cleanId = String(rawId).replace(/^(timeline_|france_)/, '');
  return `/today/${cleanId || 'news-1'}`;
}

export default function AllArticlesPage() {
  const { t } = useLanguage();
  const [config, setConfig] = useState(initialConfig);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  useEffect(() => {
    // 1. Check localStorage if available as instant cache
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('dona_today_config_v3') || localStorage.getItem('dona_today_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.newsItems?.length || parsed.france?.length)) {
            let urgent = (parsed.newsItems || []).find(n => n.isFeatured);
            let timeline = (parsed.newsItems || []).filter(n => !n.isFeatured);
            if (!urgent && parsed.newsItems && parsed.newsItems.length > 0) {
              urgent = parsed.newsItems[0];
              timeline = parsed.newsItems.slice(1);
            }
            setConfig(prev => ({
              filters: parsed.filters && parsed.filters.length > 0 ? parsed.filters : prev.filters,
              urgentArticle: urgent || prev.urgentArticle,
              newsTimeline: timeline && timeline.length > 0 ? timeline : prev.newsTimeline,
              france: parsed.france && parsed.france.length > 0 ? parsed.france : prev.france
            }));
          }
        }
      }
    } catch (e) {}

    // 2. Primary source of truth: Relational Database (/api/today)
    fetch('/api/today', { cache: 'no-store' })
      .then(res => res.json())
      .then(dbConfig => {
        if (dbConfig) {
          let urgent = (dbConfig.newsItems || []).find(n => n.isFeatured);
          let timeline = (dbConfig.newsItems || []).filter(n => !n.isFeatured);
          if (!urgent && dbConfig.newsItems && dbConfig.newsItems.length > 0) {
            urgent = dbConfig.newsItems[0];
            timeline = dbConfig.newsItems.slice(1);
          }

          setConfig(prev => ({
            filters: dbConfig.filters && dbConfig.filters.length > 0 ? dbConfig.filters : prev.filters,
            urgentArticle: urgent || prev.urgentArticle,
            newsTimeline: timeline && timeline.length > 0 ? timeline : prev.newsTimeline,
            france: dbConfig.france && dbConfig.france.length > 0 ? dbConfig.france : prev.france
          }));
        }
      })
      .catch(err => console.error("Error fetching Today config from database:", err));
  }, []);

  // Rassembler tous les articles valides
  const allArticles = [];

  if (config.urgentArticle) {
    allArticles.push({
      ...config.urgentArticle,
      isUrgent: true,
      time: "A la une",
      _id: "urgent"
    });
  }

  if (config.newsTimeline) {
    config.newsTimeline.forEach(article => {
      allArticles.push({
        ...article,
        _id: `timeline_${article.id}`
      });
    });
  }

  if (config.france) {
    config.france.forEach(article => {
      allArticles.push({
        ...article,
        _id: `france_${article.id}`,
        isFrance: true
      });
    });
  }

  // Grouper par catégorie
  // On utilise les filtres (ID > 1) comme catégories principales
  const categories = config.filters?.filter(f => f.id !== 1) || [];
  const groupedArticles = {};

  categories.forEach(cat => {
    groupedArticles[cat.label] = [];
  });
  groupedArticles["FRANCE EN DIRECT"] = [];
  groupedArticles["AUTRES"] = [];

  allArticles.forEach(article => {
    if (article.isFrance) {
      groupedArticles["FRANCE EN DIRECT"].push(article);
      return;
    }

    let matched = false;
    
    // Si l'article a un champ category direct (comme dans France)
    if (article.category) {
       const catObj = categories.find(c => c.label.toUpperCase() === article.category.toUpperCase());
       if (catObj) {
         groupedArticles[catObj.label].push(article);
         matched = true;
       }
    }
    
    // Si l'article utilise le tableau filters
    if (!matched && article.filters && Array.isArray(article.filters)) {
      article.filters.forEach(filterId => {
        const catObj = categories.find(c => c.id === filterId);
        if (catObj) {
          groupedArticles[catObj.label].push(article);
          matched = true;
        }
      });
    }

    // Si aucune catégorie correspondante n'a été trouvée
    if (!matched) {
      // Cas spécial pour l'urgent article s'il n'a pas de catégorie
      if (article.isUrgent) {
         groupedArticles["AUTRES"].unshift(article);
      } else {
         groupedArticles["AUTRES"].push(article);
      }
    }
  });

  return (
    <div className="all-articles-page">
      <div style={{ maxWidth: "1200px", margin: "0 auto 20px" }}>
        <Breadcrumbs items={[{ label: 'Today', href: '/today' }, { label: t('today_all_title') || "Toute l'actualité" }]} />
      </div>

      <div className="page-header">
        <Link href="/today" className="back-link">{t('breadcrumb_back_to_today') || "← Retour à Today"}</Link>
        <h1>{t('today_all_title') || "Toute l'actualité"}</h1>
        <p>{t('today_all_desc') || "Retrouvez l'ensemble de nos articles classés par thématiques."}</p>

        {/* View mode switcher */}
        <div style={{ display: "inline-flex", gap: "8px", marginTop: "24px", background: "#f0ece9", padding: "4px", borderRadius: "4px" }}>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "2px",
              background: viewMode === 'grid' ? "#8B002A" : "transparent",
              color: viewMode === 'grid' ? "#FFFFFF" : "#555",
              fontWeight: "700",
              fontSize: "11px",
              cursor: "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            {t('today_view_cards') || "Vue Cartes"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "2px",
              background: viewMode === 'table' ? "#8B002A" : "transparent",
              color: viewMode === 'table' ? "#FFFFFF" : "#555",
              fontWeight: "700",
              fontSize: "11px",
              cursor: "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            {t('today_view_table') || "Vue Tableau Condensé"}
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Condensed Table View */
        <div style={{ maxWidth: "1200px", margin: "0 auto 60px", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "4px", overflowX: "auto", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "14px 20px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.08em", color: "var(--color-text-muted)" }}>{t('today_th_time') || "Heure / Date"}</th>
                <th style={{ padding: "14px 20px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.08em", color: "var(--color-text-muted)" }}>{t('today_th_category') || "Catégorie"}</th>
                <th style={{ padding: "14px 20px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.08em", color: "var(--color-text-muted)" }}>{t('today_th_title') || "Titre de l'Actualité"}</th>
                <th style={{ padding: "14px 20px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.08em", color: "var(--color-text-muted)", textAlign: "right" }}>{t('today_th_action') || "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {allArticles.map((article, idx) => (
                <tr key={article._id || idx} style={{ borderBottom: "1px solid var(--color-border)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-alt)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: "14px 20px", color: "var(--color-text-muted)", whiteSpace: "nowrap", fontWeight: "600" }}>
                    {article.time || "Récent"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#8B002A", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {article.category || (article.isFrance ? "FRANCE" : "ÉDITION")}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: "600", color: "var(--color-text)" }}>
                    <Link href={getArticleLink(article)} style={{ color: "inherit", textDecoration: "none" }}>
                      {t(article.title)}
                    </Link>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <Link 
                      href={getArticleLink(article)} 
                      style={{ 
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px", 
                        fontWeight: "700", 
                        color: "#8B002A", 
                        textDecoration: "none" 
                      }}
                    >
                      {t('today_read_article') || "LIRE L'ARTICLE"} &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Rich Category Grid View */
        <div className="categories-container">
          {categories.map(category => {
            const articles = groupedArticles[category.label];
            if (!articles || articles.length === 0) return null;

            return (
              <section key={category.id} className="category-section">
                <h2 className="category-title">{category.label}</h2>
                <div className="articles-grid">
                  {articles.map((article, idx) => (
                    <Link key={article._id || idx} href={getArticleLink(article)} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                      <article className={`article-card ${article.isUrgent ? 'urgent-card' : ''}`}>
                        {article.image && (
                          <div className="article-image">
                            <Image 
                               src={safeImg(article.image)}
                               alt={article.title || 'Image article'} 
                               fill 
                               style={{ objectFit: 'cover' }}
                               unoptimized
                            />
                          </div>
                        )}
                        <div className="article-content">
                          <div className="article-meta">
                            {article.time && <span className="time">{t(article.time)}</span>}
                            {article.isNew && <span className="badge-new">{t('today_badge_new') || "NOUVEAU"}</span>}
                            {article.isUrgent && <span className="badge-urgent">{t('today_badge_urgent') || "URGENT"}</span>}
                          </div>
                          <h3>{t(article.title)}</h3>
                          <p>{t(article.desc)}</p>
                          <div style={{ marginTop: "auto", paddingTop: "12px", color: "#8B002A", fontSize: "11px", fontWeight: "700" }}>
                            {t('today_read_news') || "LIRE L'ACTUALITÉ"} &rarr;
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Section France en Direct */}
          {groupedArticles["FRANCE EN DIRECT"] && groupedArticles["FRANCE EN DIRECT"].length > 0 && (
            <section className="category-section">
              <h2 className="category-title">{t('today_sec_france') || "FRANCE EN DIRECT"}</h2>
              <div className="articles-grid">
                {groupedArticles["FRANCE EN DIRECT"].map((article, idx) => (
                  <Link key={article._id || idx} href={getArticleLink(article)} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                    <article className={`article-card ${article.isUrgent ? 'urgent-card' : ''}`}>
                      {article.image && (
                        <div className="article-image">
                          <Image 
                             src={safeImg(article.image)}
                             alt={article.title || 'Image article'} 
                             fill 
                             style={{ objectFit: 'cover' }}
                             unoptimized
                          />
                        </div>
                      )}
                      <div className="article-content">
                        <div className="article-meta">
                          {article.category && <span className="category-tag">{t(article.category)}</span>}
                          {article.time && <span className="time">{t(article.time)}</span>}
                          {article.isNew && <span className="badge-new">{t('today_badge_new') || "NOUVEAU"}</span>}
                          {article.isUrgent && <span className="badge-urgent">{t('today_badge_urgent') || "URGENT"}</span>}
                        </div>
                        <h3>{t(article.title)}</h3>
                        <p>{t(article.desc)}</p>
                        <div style={{ marginTop: "auto", paddingTop: "12px", color: "#8B002A", fontSize: "11px", fontWeight: "700" }}>
                          {t('today_read_news') || "LIRE L'ACTUALITÉ"} &rarr;
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Autres articles */}
          {groupedArticles["AUTRES"] && groupedArticles["AUTRES"].length > 0 && (
            <section className="category-section">
              <h2 className="category-title">{t('today_sec_featured_others') || "À LA UNE & AUTRES"}</h2>
              <div className="articles-grid">
                {groupedArticles["AUTRES"].map((article, idx) => (
                  <Link key={article._id || idx} href={getArticleLink(article)} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                    <article className={`article-card ${article.isUrgent ? 'urgent-card' : ''}`}>
                      {article.image && (
                        <div className="article-image">
                          <Image 
                             src={safeImg(article.image)}
                             alt={article.title || 'Image article'} 
                             fill 
                             style={{ objectFit: 'cover' }}
                             unoptimized
                          />
                        </div>
                      )}
                      <div className="article-content">
                        <div className="article-meta">
                          {article.time && <span className="time">{t(article.time)}</span>}
                          {article.isNew && <span className="badge-new">{t('today_badge_new') || "NOUVEAU"}</span>}
                          {article.isUrgent && <span className="badge-urgent">{t('today_badge_urgent') || "URGENT"}</span>}
                        </div>
                        <h3>{t(article.title)}</h3>
                        <p>{t(article.desc)}</p>
                        <div style={{ marginTop: "auto", paddingTop: "12px", color: "#8B002A", fontSize: "11px", fontWeight: "700" }}>
                          {t('today_read_news') || "LIRE L'ACTUALITÉ"} &rarr;
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <style jsx>{`
        .all-articles-page {
          background-color: var(--color-bg);
          min-height: 100vh;
          padding: 60px 5%;
          font-family: var(--font-primary, sans-serif);
          color: var(--color-text);
        }
        .page-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .back-link {
          display: inline-block;
          margin-bottom: 20px;
          color: var(--color-primary, #b76e79);
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.3s ease;
        }
        .back-link:hover {
          transform: translateX(-5px);
        }
        .page-header h1 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
          color: var(--color-text);
        }
        .page-header p {
          font-size: 18px;
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto;
        }
        .categories-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .category-section {
          margin-bottom: 80px;
        }
        .category-title {
          font-size: 24px;
          font-weight: 700;
          border-bottom: 2px solid var(--color-primary, #b76e79);
          padding-bottom: 12px;
          margin-bottom: 30px;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text);
        }
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }
        .article-card {
          background: var(--color-bg-alt);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--color-border);
        }
        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .urgent-card {
          border-top: 4px solid #e11d48;
        }
        .article-image {
          position: relative;
          width: 100%;
          height: 200px;
          background: var(--color-bg-alt);
        }
        .article-content {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .article-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .time {
          color: var(--color-text-muted);
        }
        .badge-new {
          background: var(--color-primary, #b76e79);
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .badge-urgent {
          background: #e11d48;
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .category-tag {
          color: var(--color-primary, #b76e79);
          text-transform: uppercase;
        }
        .article-content h3 {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.4;
          margin: 0 0 12px 0;
          color: var(--color-text);
        }
        .article-content p {
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin: 0;
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 32px;
          }
          .articles-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const initialConfig = {
  filters: [
    { id: 1, label: "TOUTES", url: "#" },
    { id: 2, label: "GÉOPOLITIQUE", url: "#" },
    { id: 3, label: "ÉCONOMIE", url: "#" },
    { id: 4, label: "BUSINESS", url: "#" },
    { id: 5, label: "INNOVATION", url: "#" },
    { id: 6, label: "SOCIÉTÉ", url: "#" },
    { id: 7, label: "CULTURE", url: "#" }
  ],
  urgentArticle: null,
  newsTimeline: [],
  france: []
};

export default function AllArticlesPage() {
  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    const savedConfig = localStorage.getItem('dona_today_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Erreur de parsing dona_today_config", e);
      }
    }
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
      <div className="page-header">
        <Link href="/today" className="back-link">&larr; Retour à Today</Link>
        <h1>Toute l'actualité</h1>
        <p>Retrouvez l'ensemble de nos articles classés par thématiques.</p>
      </div>

      <div className="categories-container">
        {categories.map(category => {
          const articles = groupedArticles[category.label];
          if (!articles || articles.length === 0) return null;

          return (
            <section key={category.id} className="category-section">
              <h2 className="category-title">{category.label}</h2>
              <div className="articles-grid">
                {articles.map((article, idx) => (
                  <article key={article._id || idx} className={`article-card ${article.isUrgent ? 'urgent-card' : ''}`}>
                    {article.image && (
                      <div className="article-image">
                        <Image 
                           src={article.image.startsWith('/') ? article.image : `/${article.image}`}
                           alt={article.title || 'Image article'} 
                           fill 
                           style={{ objectFit: 'cover' }}
                           unoptimized
                        />
                      </div>
                    )}
                    <div className="article-content">
                      <div className="article-meta">
                        {article.time && <span className="time">{article.time}</span>}
                        {article.isNew && <span className="badge-new">NOUVEAU</span>}
                        {article.isUrgent && <span className="badge-urgent">URGENT</span>}
                      </div>
                      <h3>{article.title}</h3>
                      <p>{article.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {/* Section France en Direct */}
        {groupedArticles["FRANCE EN DIRECT"] && groupedArticles["FRANCE EN DIRECT"].length > 0 && (
          <section className="category-section">
            <h2 className="category-title">FRANCE EN DIRECT</h2>
            <div className="articles-grid">
              {groupedArticles["FRANCE EN DIRECT"].map((article, idx) => (
                <article key={article._id || idx} className={`article-card ${article.isUrgent ? 'urgent-card' : ''}`}>
                  {article.image && (
                    <div className="article-image">
                      <Image 
                         src={article.image.startsWith('/') ? article.image : `/${article.image}`}
                         alt={article.title || 'Image article'} 
                         fill 
                         style={{ objectFit: 'cover' }}
                         unoptimized
                      />
                    </div>
                  )}
                  <div className="article-content">
                    <div className="article-meta">
                      {article.category && <span className="category-tag">{article.category}</span>}
                      {article.time && <span className="time">{article.time}</span>}
                      {article.isNew && <span className="badge-new">NOUVEAU</span>}
                      {article.isUrgent && <span className="badge-urgent">URGENT</span>}
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Autres articles */}
        {groupedArticles["AUTRES"] && groupedArticles["AUTRES"].length > 0 && (
          <section className="category-section">
            <h2 className="category-title">À LA UNE & AUTRES</h2>
            <div className="articles-grid">
              {groupedArticles["AUTRES"].map((article, idx) => (
                <article key={article._id || idx} className={`article-card ${article.isUrgent ? 'urgent-card' : ''}`}>
                  {article.image && (
                    <div className="article-image">
                      <Image 
                         src={article.image.startsWith('/') ? article.image : `/${article.image}`}
                         alt={article.title || 'Image article'} 
                         fill 
                         style={{ objectFit: 'cover' }}
                         unoptimized
                      />
                    </div>
                  )}
                  <div className="article-content">
                    <div className="article-meta">
                      {article.time && <span className="time">{article.time}</span>}
                      {article.isNew && <span className="badge-new">NOUVEAU</span>}
                      {article.isUrgent && <span className="badge-urgent">URGENT</span>}
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .all-articles-page {
          background-color: #fcfcfc;
          min-height: 100vh;
          padding: 60px 5%;
          font-family: var(--font-primary, sans-serif);
          color: #1a1a1a;
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
        }
        .page-header p {
          font-size: 18px;
          color: #666;
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
        }
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }
        .article-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0,0,0,0.02);
        }
        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .urgent-card {
          border-top: 4px solid #e11d48;
        }
        .article-image {
          position: relative;
          width: 100%;
          height: 200px;
          background: #f1f5f9;
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
          color: #888;
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
          color: #111;
        }
        .article-content p {
          font-size: 15px;
          line-height: 1.6;
          color: #555;
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

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TodayArticlePage() {
  const params = useParams();
  const articleSlug = params.articleSlug;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleSlug) return;
    
    const saved = localStorage.getItem('dona_today_config_v3');
    let foundArticle = null;
    
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.newsItems) {
          foundArticle = data.newsItems.find(a => a.id === articleSlug);
        }
        if (!foundArticle && data.france) {
          foundArticle = data.france.find(a => a.id === articleSlug);
        }
      } catch (e) {
        console.error("Error parsing config", e);
      }
    }
    
    setArticle(foundArticle);
    setLoading(false);
  }, [articleSlug]);

  if (loading) {
    return (
      <main style={{ background: "var(--color-bg)", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-secondary)", fontSize: "18px", color: "var(--color-text-muted)" }}>Chargement de l'article...</div>
      </main>
    );
  }

  if (!article) {
    return (
      <main style={{ background: "var(--color-bg)", minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "40px", fontWeight: "700", color: "var(--color-text)" }}>Article introuvable</h1>
        <p style={{ color: "var(--color-text-muted)" }}>L'actualité que vous cherchez n'est plus disponible.</p>
        <Link href="/today" style={{ textDecoration: "none", background: "#ce0028", color: "white", padding: "10px 20px", borderRadius: "2px", fontWeight: "600", fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Retour à Today</Link>
      </main>
    );
  }

  const primaryColor = "#ce0028"; // Today red color
  const displayBadge = article.category ? article.category.toUpperCase() : (article.isFeatured ? "À LA UNE" : "ACTUALITÉ");
  const displayMeta = article.time ? `MIS À JOUR ${article.time.toUpperCase()}` : "PUBLIÉ À L'INSTANT";

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "90vh", padding: "60px 0" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr minmax(300px, 800px) 1fr", gap: "40px" }}>
        
        {/* Left Sticky Sidebar (Actions) */}
        <aside style={{ gridColumn: "1" }}>
          <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: primaryColor }}>person</span>
            </div>
            
            <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--color-text-muted)" }}>
              <span className="material-symbols-outlined">volume_up</span>
              <span style={{ fontSize: "9px", fontWeight: "700" }}>ÉCOUTER</span>
            </button>
            
            <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--color-text-muted)" }}>
              <span className="material-symbols-outlined">bookmark</span>
              <span style={{ fontSize: "9px", fontWeight: "700" }}>SAUVER</span>
            </button>
            
            <Link href="/today" style={{ marginTop: "40px", border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--color-text)", textDecoration: "none" }}>
              <span className="material-symbols-outlined">arrow_back</span>
              <span style={{ fontSize: "9px", fontWeight: "700" }}>RETOUR</span>
            </Link>
          </div>
        </aside>

        {/* Center Main Article Column */}
        <div style={{ gridColumn: "2" }}>
          {/* Article Header */}
          <header style={{ marginBottom: "40px" }}>
            <span style={{ background: primaryColor, color: "#FFFFFF", fontSize: "10px", fontWeight: "700", padding: "4px 8px", borderRadius: "2px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {displayBadge}
            </span>
            
            <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "40px", fontWeight: "700", color: "var(--color-text)", marginTop: "20px", marginBottom: "16px", lineHeight: "1.2", letterSpacing: "-0.02em" }}>
              {article.title}
            </h1>
            
            <p style={{ fontFamily: "var(--font-primary)", fontSize: "18px", lineHeight: "1.5", color: "var(--color-text-muted)", marginBottom: "24px", fontStyle: "italic" }}>
              {article.desc}
            </p>
            
            <div style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "12px 0" }}>
              RÉDACTION DONA • {displayMeta}
            </div>
          </header>

          {/* Article Hero Image */}
          {article.image && (
            <div style={{ width: "100%", aspectRatio: "21/9", borderRadius: "2px", overflow: "hidden", border: "1px solid var(--color-border)", marginBottom: "48px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* Article Content */}
          <div className="article-body" style={{ fontFamily: "var(--font-primary)", fontSize: "16px", lineHeight: "1.8", color: "var(--color-text)" }}>
            <style jsx global>{`
              .article-body img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
                margin: 20px 0;
                display: block;
              }
              .article-body blockquote {
                border-left: 4px solid #CE0028;
                margin: 1.5em 0;
                padding-left: 16px;
                font-style: italic;
                color: #555;
              }
            `}</style>
            
            {article.content && article.content.trim() !== '' ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
                <p style={{ marginBottom: "32px", fontSize: "18px" }}>{article.desc}</p>
            )}

            {/* Simulated VIP Paywall */}
            <div style={{ position: "relative", marginTop: "40px", borderTop: "1px solid var(--color-border)", paddingTop: "40px", paddingBottom: "40px" }}>
              {/* Blurred Text Mock */}
              <div style={{ opacity: 0.15, filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
                <p style={{ marginBottom: "16px" }}>
                  Pour aller plus loin, nos chercheurs ont modélisé l'impact sectoriel à l'horizon 2030. L'intégration de modèles prédictifs hybrides permet d'anticiper avec une probabilité de 87% les futures ruptures...
                </p>
                <p>
                  Ce rapport spécial détaille le plan de transition recommandé pour les entreprises de taille intermédiaire et les grands groupes. L'accès à ces données stratégiques vous donnera un coup d'avance décisif.
                </p>
                <br/><br/><br/>
              </div>

              {/* Paywall Card Overlay */}
              <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "40px 24px", background: "linear-gradient(to bottom, transparent, var(--color-bg) 60%, var(--color-bg) 100%)", textAlign: "center", zIndex: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: primaryColor, marginBottom: "16px" }}>lock</span>
                <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "600", color: "var(--color-text)", marginBottom: "12px" }}>
                  Débloquez la suite de cet article
                </h3>
                <p style={{ fontSize: "14px", color: "var(--color-text-muted)", maxWidth: "450px", margin: "0 auto 24px" }}>
                  Rejoignez l'Alliance DONA pour accéder à l'intégralité de nos informations de fond, analyses et interviews exclusives.
                </p>
                <Link href="/abonnement" style={{ background: primaryColor, color: "#FFFFFF", textDecoration: "none", padding: "14px 28px", borderRadius: "2px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  S'abonner à l'Alliance
                </Link>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Empty Column (Balance spacer) */}
        <div style={{ gridColumn: "3" }}></div>

      </div>
    </main>
  );
}

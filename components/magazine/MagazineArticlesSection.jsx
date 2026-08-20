"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function MagazineArticlesSection({
  articles = [],
  tabs = [],
  magazineSlug,
  primaryColor = "#a31835"
}) {
  // Build normalized list of tabs with a "TOUS" option if not present
  const availableTabs = (tabs && tabs.length > 0)
    ? tabs.filter(t => !t.hidden)
    : [
        { id: 'all', name: 'Tous' },
        { id: 'brief', name: 'The Brief' },
        { id: 'pulse', name: 'The Pulse' },
        { id: 'deep', name: 'Deep-Dive' }
      ];

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.name || 'Tous');

  // Filter articles according to active tab
  const filteredArticles = articles.filter((art) => {
    const activeClean = (activeTab || '').toLowerCase().trim();
    if (activeClean === 'tous' || activeClean === 'all' || !activeClean) {
      return true;
    }

    const artRubrique = (art.rubrique || '').toLowerCase();
    const artBadge = (art.badge || '').toLowerCase();
    const artSubcat = (art.subcategory || '').toLowerCase();
    const artTitle = (art.title || '').toLowerCase();

    return (
      artRubrique.includes(activeClean) ||
      activeClean.includes(artRubrique) ||
      artBadge.includes(activeClean) ||
      activeClean.includes(artBadge) ||
      artSubcat.includes(activeClean) ||
      activeClean.includes(artSubcat) ||
      artTitle.includes(activeClean)
    );
  });

  return (
    <section className="mag-articles container section-padding" id="articles" style={{ padding: "80px 20px" }}>
      <h2 style={{
        fontFamily: "var(--font-secondary)",
        fontSize: "28px",
        fontWeight: "700",
        color: "var(--color-text)",
        textAlign: "center",
        marginBottom: "24px",
        letterSpacing: "-0.01em"
      }}>
        Dernières parutions
      </h2>

      {/* Interactive Tabs (Categories) Bar */}
      {availableTabs.length > 0 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "40px"
        }}>
          {availableTabs.map((tab, idx) => {
            const tabName = typeof tab === 'string' ? tab : tab.name;
            const isActive = activeTab.toLowerCase() === tabName.toLowerCase();

            return (
              <button 
                type="button"
                key={tab.id || idx}
                onClick={() => setActiveTab(tabName)}
                style={{
                  padding: "8px 22px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: isActive ? primaryColor : "var(--color-bg)",
                  color: isActive ? "#FFFFFF" : "var(--color-text)",
                  border: isActive ? `1px solid ${primaryColor}` : "1px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                  outline: "none"
                }}
              >
                {tabName}
              </button>
            );
          })}
        </div>
      )}

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="mag-articles-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "32px"
        }}>
          {filteredArticles.map((art, idx) => (
            <Link
              key={art.id || idx}
              href={`/magazines/${magazineSlug}/articles/${art.id}`}
              className="mag-article"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                borderRadius: "2px",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
            >
              {art.image && (
                <div style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  maxHeight: "225px",
                  overflow: "hidden",
                  background: "var(--color-bg-alt)"
                }}>
                  <span className="badge" style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: primaryColor,
                    color: "#FFFFFF",
                    fontSize: "9px",
                    fontWeight: "700",
                    padding: "4px 8px",
                    borderRadius: "2px",
                    zIndex: 2,
                    letterSpacing: "0.05em"
                  }}>
                    {art.badge || art.rubrique || "ARTICLE"}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              )}
              
              <div style={{ padding: "24px 26px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "18px",
                  fontWeight: "600",
                  lineHeight: "1.4",
                  color: "var(--color-text)",
                  marginBottom: "12px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {art.title}
                </h3>
                
                <p style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "var(--color-text-muted)",
                  marginBottom: "20px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {art.desc || art.summary}
                </p>
                
                <div style={{
                  marginTop: "auto",
                  paddingTop: "12px",
                  fontFamily: "var(--font-primary)",
                  fontSize: "9px",
                  fontWeight: "600",
                  letterSpacing: "0.06em",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase"
                }}>
                  {art.meta || "RÉDACTION"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "var(--color-bg-alt)",
          borderRadius: "4px",
          border: "1px solid var(--color-border)"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "40px", color: primaryColor, marginBottom: "16px" }}>
            library_books
          </span>
          <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
            Aucun article pour « {activeTab} »
          </h3>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)", maxWidth: "450px", margin: "0 auto 20px" }}>
            Les publications pour cette rubrique sont en cours de finalisation par la rédaction.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab(availableTabs[0]?.name || 'Tous')}
            style={{
              background: primaryColor,
              color: "#FFFFFF",
              border: "none",
              padding: "10px 20px",
              borderRadius: "2px",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            Afficher tous les articles
          </button>
        </div>
      )}
    </section>
  );
}

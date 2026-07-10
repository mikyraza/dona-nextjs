"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const CARDS = [
  {
    id: 1,
    type: 'ARTICLE',
    typeBg: 'rgba(163, 6, 38, 0.08)',
    typeColor: '#A30626',
    meta: 'Article • Intelligence • 12 min',
    title: "La Trajectoire de l'Effet Dunning-Kruger dans le Management Moderne",
    cta: 'Commencer la lecture',
    ctaIcon: 'arrow_forward',
    ctaHref: '/article-trends-intelligence',
    image: '/assets/core/img/home_alaune_side2_1782125722981.png',
    saved: true,
  },
  {
    id: 2,
    type: 'CAHIER',
    typeBg: 'rgba(17, 17, 17, 0.08)',
    typeColor: '#111111',
    meta: 'Magazine • N° 01 • Renseignements',
    title: 'DONA Magazine : Édition Spéciale Intelligence',
    cta: 'Lire le magazine',
    ctaIcon: 'menu_book',
    ctaHref: '/magazines/intelligence',
    image: '/assets/core/img/home_mag_01_1782125759189.png',
    saved: false,
  },
  {
    id: 3,
    type: 'WORKBOOK',
    typeBg: 'rgba(176, 145, 89, 0.1)',
    typeColor: '#998357',
    meta: 'Workbook • Power Lab • Outil Stratégique',
    title: "Guide d'Optimisation des Systèmes Complexes",
    cta: 'Télécharger le PDF (4.2 MB)',
    ctaIcon: 'download',
    ctaHref: '#',
    image: null,
    saved: true,
  },
  {
    id: 4,
    type: 'ARTICLE',
    typeBg: 'rgba(163, 6, 38, 0.08)',
    typeColor: '#A30626',
    meta: 'Article • Passions • 8 min',
    title: "L'Esthétique de l'Effet de Contraste en Design Contemporain",
    cta: 'Commencer la lecture',
    ctaIcon: 'arrow_forward',
    ctaHref: '#',
    image: '/assets/core/img/home_alaune_side1_1782125709654.png',
    saved: false,
  },
  {
    id: 5,
    type: 'CAHIER',
    typeBg: 'rgba(17, 17, 17, 0.08)',
    typeColor: '#111111',
    meta: 'Magazine • N° 02 • Performance',
    title: "DONA Magazine : L'Art du Risque et du Power Lab",
    cta: 'Lire le magazine',
    ctaIcon: 'menu_book',
    ctaHref: '/magazines/power-lab',
    image: '/assets/core/img/home_mag_02_1782125769846.png',
    saved: false,
  },
  {
    id: 6,
    type: 'WORKBOOK',
    typeBg: 'rgba(176, 145, 89, 0.1)',
    typeColor: '#998357',
    meta: 'Workbook • Agenda • Productivité',
    title: "Planificateur Hebdomadaire de l'Esprit Critique et Logique",
    cta: 'Télécharger le PDF (1.8 MB)',
    ctaIcon: 'download',
    ctaHref: '#',
    image: null,
    saved: false,
  },
  {
    id: 7,
    type: 'ARTICLE',
    typeBg: 'rgba(163, 6, 38, 0.08)',
    typeColor: '#A30626',
    meta: 'Article • Art de Vivre • 15 min',
    title: "Les Fondements Harmoniques de l'Architecture Moderne",
    cta: 'Commencer la lecture',
    ctaIcon: 'arrow_forward',
    ctaHref: '#',
    image: '/assets/core/img/home_mag_06_1782125858971.png',
    saved: true,
  },
  {
    id: 8,
    type: 'CAHIER',
    typeBg: 'rgba(17, 17, 17, 0.08)',
    typeColor: '#111111',
    meta: 'Magazine • N° 13 • Relations',
    title: "DONA Magazine : Les Mécanismes des Dynamiques de l'Amour",
    cta: 'Lire le magazine',
    ctaIcon: 'menu_book',
    ctaHref: '/magazines/amour',
    image: '/assets/core/img/home_philosophy_woman_1782125677007.png',
    saved: true,
  }
];

const TABS = ['Tous les contenus', 'Articles', 'Cahiers', 'Workbooks'];

export default function Page() {
  const [activeTab, setActiveTab] = useState('Tous les contenus');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredCards = CARDS.filter((card) => {
    // 1. Tab Filter
    if (activeTab === 'Articles' && card.type !== 'ARTICLE') return false;
    if (activeTab === 'Cahiers' && card.type !== 'CAHIER') return false;
    if (activeTab === 'Workbooks' && card.type !== 'WORKBOOK') return false;

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return (
        card.title.toLowerCase().includes(query) ||
        card.meta.toLowerCase().includes(query) ||
        card.type.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <main className="vip-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .vip-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          max-width: 1440px;
          margin: 0 auto;
          padding: 80px 40px;
          background: #FFFFFF; /* root light design variables */
          min-height: 100vh;
        }

        .vip-sidebar {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          height: fit-content;
          box-shadow: 0 10px 30px rgba(0,0,0,0.01);
        }

        .vip-sidebar-title {
          padding: 0 20px 20px 20px;
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-muted);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 20px;
        }

        .vip-sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #555555;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 2px;
          margin-bottom: 8px;
        }

        .vip-sidebar-item:hover {
          background: var(--color-bg-alt);
          color: #111111;
        }

        .vip-sidebar-item.active {
          background: var(--color-bg-alt);
          color: #A30626;
          border-left: 3px solid #A30626;
          padding-left: 17px;
        }

        .vip-content {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 48px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.01);
        }

        .vip-title {
          font-family: 'Newsreader', 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 300;
          color: #111111;
          margin: 0 0 40px 0;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }

        .logout-link {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #555555;
          font-size: 13px;
          text-decoration: none;
          font-weight: 600;
          padding: 15px 20px;
          transition: color 0.3s ease;
          margin-top: 20px;
          border-top: 1px solid var(--color-border);
        }

        .logout-link:hover {
          color: #A30626;
        }

        /* Tabs Navigation */
        .lecture-tab-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .lecture-tabs {
          display: flex;
          gap: 8px;
        }

        .lecture-tab {
          padding: 0 12px 16px 12px;
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #555555;
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: all 0.3s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
        }

        .lecture-tab:hover {
          color: #111111;
        }

        .lecture-tab.active {
          color: #A30626;
          border-bottom-color: #A30626;
        }

        .lecture-tab-count {
          background: rgba(163, 6, 38, 0.06);
          color: #A30626;
          padding: 2px 7px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          margin-left: 8px;
          transition: background-color 0.3s ease;
        }

        .lecture-tab.active .lecture-tab-count {
          background: rgba(163, 6, 38, 0.12);
        }

        /* Search Bar & Filters */
        .lecture-search-bar {
          display: flex;
          gap: 12px;
          align-items: center;
          padding-bottom: 16px;
        }

        .lecture-search-input-wrap {
          position: relative;
        }

        .lecture-search-input-wrap .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: #555555;
          pointer-events: none;
        }

        .lecture-search-input {
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 10px 14px 10px 42px;
          font-family: var(--font-primary);
          font-size: 13px;
          color: #111111;
          outline: none;
          width: 240px;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .lecture-search-input:focus {
          border-color: #A30626;
          background: #FFFFFF;
        }

        .lecture-filter-btn {
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #555555;
          transition: all 0.3s ease;
        }

        .lecture-filter-btn:hover {
          border-color: #A30626;
          color: #A30626;
          background: #FFFFFF;
        }

        /* Cards Grid */
        .lecture-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-bottom: 48px;
        }

        .lecture-card {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--color-border);
          border-radius: 2px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: #FFFFFF;
        }

        .lecture-card:hover {
          border-color: #A30626;
          box-shadow: 0 10px 30px rgba(163, 6, 38, 0.04);
          transform: translateY(-2px);
        }

        .lecture-card-thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          background: var(--color-bg-alt);
        }

        .lecture-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lecture-card:hover .lecture-card-thumb img {
          transform: scale(1.04);
        }

        .lecture-card-thumb-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F4F3F0;
        }

        .lecture-card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          font-family: var(--font-primary);
          font-size: 10px;
          font-weight: 700;
          padding: 6px 12px;
          letter-spacing: 1.5px;
          border-radius: 2px;
          text-transform: uppercase;
        }

        .lecture-card-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .lecture-card-meta {
          font-family: var(--font-primary);
          font-size: 11px;
          color: #555555;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .lecture-card-title {
          font-family: 'Newsreader', 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 400;
          color: #111111;
          line-height: 1.4;
          margin: 0 0 auto 0;
          padding-bottom: 24px;
        }

        .lecture-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 18px;
          border-top: 1px solid var(--color-border);
          margin-top: auto;
        }

        .lecture-card-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-primary);
          font-size: 12px;
          font-weight: 600;
          color: #111111;
          text-decoration: none;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border-bottom: 1px solid #111111;
          padding-bottom: 2px;
          transition: all 0.3s ease;
        }

        .lecture-card-cta:hover {
          color: #A30626;
          border-color: #A30626;
          gap: 10px;
        }

        .lecture-card-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .lecture-card-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #555555;
          display: flex;
          align-items: center;
          transition: color 0.3s ease;
          padding: 0;
        }

        .lecture-card-icon-btn:hover {
          color: #A30626;
        }

        .lecture-card-icon-btn.saved {
          color: #A30626;
        }

        /* Empty State Fallback Style */
        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
          border: 1px dashed var(--color-border);
          border-radius: 4px;
          background: var(--color-bg-alt);
        }

        .no-results-icon {
          font-size: 3rem;
          color: #A30626;
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .no-results-text {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #555555;
          font-style: italic;
          margin: 0;
          max-width: 500px;
          line-height: 1.5;
        }

        /* Load More */
        .load-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid var(--color-border);
          color: #555555;
          padding: 14px 32px;
          border-radius: 2px;
          font-family: var(--font-primary);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .load-more-btn:hover {
          border-color: #A30626;
          color: #A30626;
          background: #FFFFFF;
        }

        @media (max-width: 1024px) {
          .vip-container {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 60px 20px;
          }
        }

        @media (max-width: 768px) {
          .lecture-tab-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
            padding-bottom: 0;
          }

          .lecture-tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
            margin-bottom: -9px;
          }

          .lecture-tab {
            padding: 0 12px 12px 12px;
            font-size: 12px;
          }

          .lecture-search-bar {
            width: 100%;
          }

          .lecture-search-input-wrap {
            flex-grow: 1;
          }

          .lecture-search-input {
            width: 100%;
          }

          .lecture-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .vip-content {
            padding: 32px 20px;
          }
        }
      ` }} />

      {/* ─── Sidebar ─── */}
      <aside className="vip-sidebar">
        <div className="vip-sidebar-title">
          Portail des membres
        </div>
        <div style={{ flex: 1 }}>
          <Link href="/member-profile" className="vip-sidebar-item">
            <span className="material-symbols-outlined">person</span>
            MON PROFIL
          </Link>
          <Link href="/subscription-management" className="vip-sidebar-item">
            <span className="material-symbols-outlined">star</span>
            MON ABONNEMENT
          </Link>
          <Link href="/espace-lecture" className="vip-sidebar-item active">
            <span className="material-symbols-outlined">bookmark</span>
            ESPACE LECTURE
          </Link>
        </div>

        <Link href="#" className="logout-link">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
          SE DÉCONNECTER
        </Link>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="vip-content">
        <h1 className="vip-title">Mon Espace Lecture</h1>

        {/* Tab Bar + Search */}
        <div className="lecture-tab-bar">
          <div className="lecture-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`lecture-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab === 'Tous les contenus' && (
                  <span className="lecture-tab-count">
                    {searchQuery.trim() ? filteredCards.length : CARDS.length}
                  </span>
                )}
                {tab !== 'Tous les contenus' && activeTab === tab && (
                  <span className="lecture-tab-count">{filteredCards.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="lecture-search-bar">
            <div className="lecture-search-input-wrap">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="lecture-search-input"
              />
            </div>
            <button className="lecture-filter-btn" aria-label="Filtres">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>tune</span>
            </button>
          </div>
        </div>

        {/* Grid or Empty Fallback State */}
        {filteredCards.length > 0 ? (
          <div className="lecture-grid">
            {filteredCards.map((card) => (
              <article className="lecture-card" key={card.id}>
                {/* Thumbnail */}
                <div className="lecture-card-thumb">
                  {card.image ? (
                    <img src={card.image} alt={card.title} />
                  ) : (
                    <div className="lecture-card-thumb-placeholder">
                      <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#998357" }}>
                        menu_book
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  <span
                    className="lecture-card-badge"
                    style={{ background: card.typeBg, color: card.typeColor }}
                  >
                    {card.type}
                  </span>
                </div>

                {/* Body */}
                <div className="lecture-card-body">
                  <div className="lecture-card-meta">{card.meta}</div>
                  <h3 className="lecture-card-title">{card.title}</h3>

                  <div className="lecture-card-footer">
                    <Link href={card.ctaHref} className="lecture-card-cta">
                      {card.cta}
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                        {card.ctaIcon}
                      </span>
                    </Link>

                    <div className="lecture-card-actions">
                      <button className={`lecture-card-icon-btn${card.saved ? ' saved' : ''}`} aria-label="Sauvegarder">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                          {card.saved ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                      <button className="lecture-card-icon-btn" aria-label="Partager">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>ios_share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span className="material-symbols-outlined no-results-icon">search_off</span>
            <p className="no-results-text">Aucun document ne correspond à vos critères de recherche.</p>
          </div>
        )}

        {/* Load More */}
        {filteredCards.length > 0 && (
          <div style={{ textAlign: "center" }}>
            <button className="load-more-btn">
              Charger plus de contenus
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>expand_more</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

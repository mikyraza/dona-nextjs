"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveUserSubscription, canAccessMagazine } from '@/lib/subscriptionPermissions';

const TABS = ['Tous les contenus', 'Articles', 'Magazines', 'Workbooks'];

const INITIAL_FALLBACK_CARDS = [
  {
    id: 'art-1',
    docType: 'ARTICLE',
    type: 'ARTICLE',
    typeBg: 'rgba(163, 6, 38, 0.08)',
    typeColor: '#A30626',
    meta: 'Article • Intelligence • 12 min',
    title: "La Trajectoire de l'Effet Dunning-Kruger dans le Management Moderne",
    cta: 'Commencer la lecture',
    ctaIcon: 'arrow_forward',
    ctaHref: '/article-trends-intelligence',
    image: '/assets/core/img/home_alaune_side2_1782125722981.png',
  },
  {
    id: 'mag-1',
    docType: 'MAGAZINE',
    type: 'MAGAZINE',
    magId: 1,
    typeBg: 'rgba(17, 17, 17, 0.08)',
    typeColor: '#111111',
    meta: 'Magazine • N° 01 • Renseignements',
    title: 'DONA Magazine : Édition Spéciale Intelligence',
    cta: 'Lire le magazine',
    ctaIcon: 'menu_book',
    ctaHref: '/magazines/intelligence',
    image: '/assets/core/img/home_mag_01_1782125759189.png',
  },
  {
    id: 'wb-1',
    docType: 'WORKBOOK',
    type: 'WORKBOOK',
    typeBg: 'rgba(176, 145, 89, 0.1)',
    typeColor: '#998357',
    meta: 'Workbook • Power Lab • Outil Stratégique',
    title: "Guide d'Optimisation des Systèmes Complexes",
    cta: 'Télécharger le PDF (4.2 MB)',
    ctaIcon: 'download',
    ctaHref: '#',
    image: null,
  },
  {
    id: 'art-2',
    docType: 'ARTICLE',
    type: 'ARTICLE',
    typeBg: 'rgba(163, 6, 38, 0.08)',
    typeColor: '#A30626',
    meta: 'Article • Passions • 8 min',
    title: "L'Esthétique de l'Effet de Contraste en Design Contemporain",
    cta: 'Commencer la lecture',
    ctaIcon: 'arrow_forward',
    ctaHref: '#',
    image: '/assets/core/img/home_alaune_side1_1782125709654.png',
  },
  {
    id: 'mag-2',
    docType: 'MAGAZINE',
    type: 'MAGAZINE',
    magId: 2,
    typeBg: 'rgba(17, 17, 17, 0.08)',
    typeColor: '#111111',
    meta: 'Magazine • N° 02 • Performance',
    title: "DONA Magazine : L'Art du Risque et du Power Lab",
    cta: 'Lire le magazine',
    ctaIcon: 'menu_book',
    ctaHref: '/magazines/power-lab',
    image: '/assets/core/img/home_mag_02_1782125769846.png',
  },
  {
    id: 'wb-2',
    docType: 'WORKBOOK',
    type: 'WORKBOOK',
    typeBg: 'rgba(176, 145, 89, 0.1)',
    typeColor: '#998357',
    meta: 'Workbook • Agenda • Productivité',
    title: "Planificateur Hebdomadaire de l'Esprit Critique et Logique",
    cta: 'Télécharger le PDF (1.8 MB)',
    ctaIcon: 'download',
    ctaHref: '#',
    image: null,
  }
];

export default function Page() {
  const [activeTab, setActiveTab] = useState('Tous les contenus');
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState(INITIAL_FALLBACK_CARDS);
  const [savedIds, setSavedIds] = useState(new Set(['art-1', 'wb-1']));
  const [toastMessage, setToastMessage] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(6);
  const [userSub, setUserSub] = useState({ plan: 'Essentiel', status: 'Active', isGuest: true });
  const [paywallModal, setPaywallModal] = useState({ isOpen: false, title: '', message: '', targetPlan: 'Premium' });

  const syncUserSub = () => {
    setUserSub(getActiveUserSubscription());
  };

  // Load saved favorites from localStorage on mount & listen to subscription changes
  useEffect(() => {
    syncUserSub();

    window.addEventListener('dona_subscription_changed', syncUserSub);
    window.addEventListener('storage', syncUserSub);

    try {
      const storedSaved = localStorage.getItem('dona_saved_items');
      if (storedSaved) {
        setSavedIds(new Set(JSON.parse(storedSaved)));
      }
    } catch (e) {
      console.error('Failed to load saved items from localStorage', e);
    }

    // Fetch dynamic content list from API
    fetch('/api/espace-lecture')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCards(data);
        }
      })
      .catch(err => {
        console.warn('Using fallback cards list for Espace Lecture:', err);
      });

    return () => {
      window.removeEventListener('dona_subscription_changed', syncUserSub);
      window.removeEventListener('storage', syncUserSub);
    };
  }, []);

  const handleCardClick = (e, card) => {
    const cardType = (card.type || card.docType || '').toUpperCase();
    if (cardType === 'MAGAZINE' || cardType === 'ARTICLE') {
      const magId = card.magId || (card.id ? parseInt(String(card.id).replace(/\D/g, ''), 10) : 1);
      const access = canAccessMagazine(magId, userSub.plan, userSub.status);
      if (!access.allowed && cardType === 'MAGAZINE') {
        e.preventDefault();
        setPaywallModal({
          isOpen: true,
          title: `Accès au Magazine N°${String(magId).padStart(2, '0')}`,
          message: access.message || 'L\'accès à ce magazine est réservé aux abonnés autorisés.',
          targetPlan: access.reason === 'requires_elite' ? 'Élite' : 'Premium'
        });
      }
    } else if (cardType === 'PODCAST' || cardType === 'REPLAY' || cardType === 'AUDIO') {
      const access = canAccessAudioAndReplay(userSub.plan, userSub.status);
      if (!access.allowed) {
        e.preventDefault();
        setPaywallModal({
          isOpen: true,
          title: `Accès aux Audios & Replays`,
          message: access.message || 'L\'accès aux contenus audios et replays vidéo est réservé aux abonnés Premium et Élite.',
          targetPlan: 'Premium'
        });
      }
    } else if (cardType === 'WORKBOOK') {
      if (!isServiceAllowedForPlan('workbooks', userSub.plan)) {
        e.preventDefault();
        setPaywallModal({
          isOpen: true,
          title: `Accès aux Workbooks & PDFs`,
          message: 'Le téléchargement des workbooks et guides stratégiques est réservé aux abonnés Premium et Élite.',
          targetPlan: 'Premium'
        });
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle Heart Favorite
  const toggleSave = (cardId, title) => {
    const nextSaved = new Set(savedIds);
    let message = '';
    if (nextSaved.has(cardId)) {
      nextSaved.delete(cardId);
      message = `"${title.substring(0, 30)}..." retiré de vos favoris.`;
    } else {
      nextSaved.add(cardId);
      message = `"${title.substring(0, 30)}..." ajouté à vos favoris !`;
    }
    setSavedIds(nextSaved);
    try {
      localStorage.setItem('dona_saved_items', JSON.stringify(Array.from(nextSaved)));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    showToast(message);
  };

  // Share action
  const handleShare = (title, url) => {
    const fullUrl = window.location.origin + (url && url !== '#' ? url : window.location.pathname);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        showToast(`Lien copié dans le presse-papier !`);
      }).catch(() => {
        showToast(`Lien : ${fullUrl}`);
      });
    } else {
      showToast(`Lien : ${fullUrl}`);
    }
  };

  // Filter Cards by Tab and Search Query
  const filteredCards = cards.filter((card) => {
    const cardType = (card.type || card.docType || '').toUpperCase();

    // Tab filter logic
    if (activeTab === 'Articles' && cardType !== 'ARTICLE') return false;
    if (activeTab === 'Magazines' && cardType !== 'MAGAZINE') return false;
    if (activeTab === 'Workbooks' && cardType !== 'WORKBOOK') return false;

    // Search filter logic
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (card.title || '').toLowerCase().includes(q);
      const metaMatch = (card.meta || card.metaText || '').toLowerCase().includes(q);
      return titleMatch || metaMatch;
    }

    return true;
  });

  const visibleCards = filteredCards.slice(0, displayLimit);

  return (
    <main className="vip-container">
      
      <style>{`
        .vip-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px;
          background: var(--color-bg);
        }
        .vip-sidebar {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          height: fit-content;
          box-shadow: 0 20px 40px rgba(0,0,0,0.01);
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
          color: var(--color-text-muted);
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 2px;
          margin-bottom: 8px;
        }
        .vip-sidebar-item:hover {
          background: var(--color-bg-alt);
          color: var(--color-text);
        }
        .vip-sidebar-item.active {
          background: var(--color-bg-alt);
          color: var(--color-accent);
          font-weight: 700;
        }
        .vip-content {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 48px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.01);
          position: relative;
        }
        .vip-title {
          font-family: var(--font-secondary);
          font-size: 32px;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 40px;
          letter-spacing: -0.02em;
        }
        .logout-link {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--color-text-muted);
          font-size: 13px;
          text-decoration: none;
          font-weight: 600;
          padding: 15px 0;
          transition: color 0.3s ease;
        }
        .logout-link:hover {
          color: var(--color-accent);
        }

        /* Toast notification */
        .lecture-toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #111111;
          color: #FFFFFF;
          padding: 14px 24px;
          border-radius: 4px;
          font-size: 13px;
          font-family: var(--font-primary);
          font-weight: 500;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 4px solid var(--color-accent);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Filter Tabs & Search Bar */
        .lecture-tab-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 16px;
          margin-bottom: 40px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .lecture-tabs {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        .lecture-tab {
          background: transparent;
          border: none;
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 8px 0;
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
        }
        .lecture-tab:hover {
          color: var(--color-text);
        }
        .lecture-tab.active {
          color: var(--color-accent);
          font-weight: 700;
        }
        .lecture-tab.active::after {
          content: '';
          position: absolute;
          bottom: -17px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-accent);
        }
        .lecture-tab-count {
          background: var(--color-bg-alt);
          color: var(--color-text-muted);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }
        .lecture-tab.active .lecture-tab-count {
          background: var(--color-accent);
          color: #FFFFFF;
          border-color: var(--color-accent);
        }
        .lecture-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lecture-search-input-wrap {
          display: flex;
          align-items: center;
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 8px 12px;
          gap: 8px;
          width: 220px;
          transition: border-color 0.2s ease;
        }
        .lecture-search-input-wrap:focus-within {
          border-color: var(--color-accent);
        }
        .lecture-search-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-primary);
          font-size: 13px;
          color: var(--color-text);
          width: 100%;
        }
        .search-icon {
          font-size: 16px;
          color: var(--color-text-muted);
        }
        .lecture-filter-btn {
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 8px 12px;
          color: var(--color-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .lecture-filter-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        /* Card Grid */
        .lecture-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
          margin-bottom: 40px;
        }
        .lecture-card {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .lecture-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.04);
        }
        .lecture-card-thumb {
          position: relative;
          width: 100%;
          height: 190px;
          background: var(--color-bg-alt);
          overflow: hidden;
        }
        .lecture-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
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
          background: rgba(153, 131, 87, 0.05);
        }
        .lecture-card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-family: var(--font-primary);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 4px 10px;
          border-radius: 2px;
          text-transform: uppercase;
        }
        .lecture-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .lecture-card-meta {
          font-family: var(--font-primary);
          font-size: 11px;
          font-weight: 600;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .lecture-card-title {
          font-family: var(--font-secondary);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.35;
          margin: 0 0 20px 0;
          flex: 1;
        }
        .lecture-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--color-border);
          margin-top: auto;
        }
        .lecture-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-primary);
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color 0.2s ease;
        }
        .lecture-card-cta:hover {
          color: var(--color-accent);
        }
        .lecture-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lecture-card-icon-btn {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .lecture-card-icon-btn:hover {
          color: var(--color-accent);
          transform: scale(1.1);
        }
        .lecture-card-icon-btn.saved {
          color: var(--color-accent);
        }

        /* Empty / Load More State */
        .no-results {
          padding: 60px 20px;
          text-align: center;
          background: var(--color-bg-alt);
          border: 1px dashed var(--color-border);
          border-radius: 2px;
          margin-bottom: 40px;
        }
        .no-results-icon {
          font-size: 48px;
          color: var(--color-text-muted);
          margin-bottom: 12px;
        }
        .no-results-text {
          font-family: var(--font-primary);
          font-size: 14px;
          color: var(--color-text-muted);
          margin: 0;
        }
        .load-more-btn {
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          font-family: var(--font-primary);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 14px 28px;
          border-radius: 2px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .load-more-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        @media (max-width: 900px) {
          .vip-container {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 40px 16px;
          }
          .vip-content {
            padding: 32px 20px !important;
          }
          .vip-title {
            font-size: 26px !important;
            margin-bottom: 24px !important;
          }
          .lecture-tab-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .lecture-search-input-wrap {
            width: 100%;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="lecture-toast">
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--color-accent)" }}>info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar navigation */}
      <aside className="vip-sidebar">
        <div style={{ flex: "1" }}>
          <div style={{ padding: "0 20px 20px 20px", fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Portail des membres</div>
          
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

        <Link href="/login" className="logout-link">
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
                <span className="lecture-tab-count">
                  {tab === 'Tous les contenus'
                    ? cards.length
                    : cards.filter(c => (c.type || c.docType || '').toUpperCase() === (
                        tab === 'Articles' ? 'ARTICLE' : tab === 'Magazines' ? 'MAGAZINE' : 'WORKBOOK'
                      )).length
                  }
                </span>
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
            <button className="lecture-filter-btn" aria-label="Filtres" onClick={() => showToast('Recherche filtrée appliquée')}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>tune</span>
            </button>
          </div>
        </div>

        {/* Grid or Empty Fallback State */}
        {visibleCards.length > 0 ? (
          <div className="lecture-grid">
            {visibleCards.map((card) => {
              const isSaved = savedIds.has(card.id);
              const cardImage = card.image || card.imagePath;

              return (
                <article className="lecture-card" key={card.id}>
                  {/* Thumbnail */}
                  <div className="lecture-card-thumb">
                    {cardImage ? (
                      <img src={cardImage} alt={card.title} />
                    ) : (
                      <div className="lecture-card-thumb-placeholder">
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: card.typeColor || "#998357" }}>
                          {card.docType === 'WORKBOOK' ? 'file_download' : 'menu_book'}
                        </span>
                      </div>
                    )}

                    {/* Badge */}
                    <span
                      className="lecture-card-badge"
                      style={{ background: card.typeBg || 'rgba(17,17,17,0.08)', color: card.typeColor || '#111111' }}
                    >
                      {card.type || card.docType}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="lecture-card-body">
                    <div className="lecture-card-meta">{card.meta || card.metaText}</div>
                    <h3 className="lecture-card-title">{card.title}</h3>

                    <div className="lecture-card-footer">
                      <Link href={card.ctaHref || '#'} onClick={(e) => handleCardClick(e, card)} className="lecture-card-cta">
                        {card.cta || card.ctaText || 'Consulter'}
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                          {card.ctaIcon || 'arrow_forward'}
                        </span>
                      </Link>

                      <div className="lecture-card-actions">
                        <button
                          className={`lecture-card-icon-btn${isSaved ? ' saved' : ''}`}
                          aria-label="Sauvegarder"
                          onClick={() => toggleSave(card.id, card.title)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                            {isSaved ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                        <button
                          className="lecture-card-icon-btn"
                          aria-label="Partager"
                          onClick={() => handleShare(card.title, card.ctaHref)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>ios_share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <span className="material-symbols-outlined no-results-icon">search_off</span>
            <p className="no-results-text">Aucun document ne correspond à vos critères de recherche.</p>
          </div>
        )}

        {/* Load More */}
        {filteredCards.length > visibleCards.length && (
          <div style={{ textAlign: "center" }}>
            <button className="load-more-btn" onClick={() => setDisplayLimit(prev => prev + 6)}>
              Charger plus de contenus ({filteredCards.length - visibleCards.length} restants)
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>expand_more</span>
            </button>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      {paywallModal.isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }} onClick={() => setPaywallModal({ ...paywallModal, isOpen: false })}>
          <div style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            maxWidth: "480px",
            width: "100%",
            padding: "40px 32px",
            textAlign: "center",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(163, 6, 38, 0.08)",
              color: "var(--color-accent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>lock</span>
            </div>

            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px" }}>
              {paywallModal.title}
            </h3>

            <p style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", marginBottom: "28px" }}>
              {paywallModal.message}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link
                href={`/signup?plan=${paywallModal.targetPlan.toLowerCase()}`}
                style={{
                  background: "var(--color-accent)",
                  color: "#FFFFFF",
                  padding: "14px",
                  borderRadius: "2px",
                  fontFamily: "var(--font-primary)",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none"
                }}
              >
                Passer à l'offre {paywallModal.targetPlan}
              </Link>
              <button
                type="button"
                onClick={() => setPaywallModal({ ...paywallModal, isOpen: false })}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-primary)",
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: "8px"
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

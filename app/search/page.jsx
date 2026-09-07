"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function SearchPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'article' | 'video' | 'podcast' | 'magazine' | 'expert'

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const popularSearches = [
    { label: "Leadership féminin", query: "Leadership" },
    { label: "Investissement impact", query: "Impact" },
    { label: "Bio-hacking & Longevity", query: "Longevity" },
    { label: "Management & Power", query: "Power" },
    { label: "Art de Vivre & Design", query: "Art de vivre" }
  ];

  const recentSearches = [
    { label: "Dr. Clarisse Bama", query: "Clarisse Bama" },
    { label: "Masterclass & Replays", query: "Masterclass" },
    { label: "01. Intelligence Géopolitique", query: "Intelligence" }
  ];

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) {
        setSearchQuery(q);
      }
    }
  }, []);

  // Fetch search results from /api/search whenever query, category, or format changes
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('q', searchQuery.trim());
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedFormat !== 'all') params.append('format', selectedFormat);

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Error fetching search API:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedFormat]);

  const handlePopularSearch = (queryText) => {
    setSearchQuery(queryText);
  };

  const getFormatBadgeColor = (formatType) => {
    switch (formatType) {
      case 'article': return '#8B002A';
      case 'video': return '#1E40AF';
      case 'podcast': return '#047857';
      case 'magazine': return '#D97706';
      case 'expert': return '#4C1D95';
      default: return '#1C1B1B';
    }
  };

  const getFormatLabel = (formatType) => {
    switch (formatType) {
      case 'article': return 'ARTICLE';
      case 'video': return 'VIDÉO / TV';
      case 'podcast': return 'PODCAST / RADIO';
      case 'magazine': return 'MAGAZINE / CAHIER';
      case 'expert': return 'EXPERT / ÉQUIPE';
      default: return 'CONTENU';
    }
  };

  const filteredFlatResults = (searchResults?.flatResults || []).filter(item => {
    if (activeTab === 'all') return true;
    return item.format === activeTab || item.type === activeTab;
  });

  const resolveItemHref = (item) => {
    if (item.href && item.href !== '#' && item.href !== '') return item.href;
    if (item.type === 'article' || item.format === 'article') {
      return `/magazines/magazine-01-intelligence/articles/${item.slug || item.id || 'article-trends-intelligence'}`;
    }
    if (item.type === 'magazine' || item.format === 'magazine') {
      return `/magazines/${item.slug || 'magazine-01-intelligence'}`;
    }
    if (item.type === 'video' || item.format === 'video') {
      return item.id ? `/studio?v=${item.id}` : '/studio';
    }
    if (item.type === 'podcast' || item.format === 'podcast') {
      return '/ecouter';
    }
    if (item.type === 'expert' || item.format === 'expert') {
      return '/equipe';
    }
    return '/magazines';
  };
  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        :root, [data-theme="light"] {
            --page-bg: #FFFFFF;
            --page-card-bg: #FCFCFB;
            --page-border: #EDE8E4;
            --page-border-focus: #1C1B1B;
            --page-text: #1C1B1B;
            --page-text-muted: #666666;
            --page-text-light: #999999;
            --page-btn-hover: #111111;
            --page-banner-bg: #F9F6F3;
        }
        :root[data-theme="dark"],
        [data-theme="dark"],
        .dark,
        html.dark {
            --page-bg: #0A0A0A;
            --page-card-bg: #141414;
            --page-border: rgba(255, 255, 255, 0.1);
            --page-border-focus: var(--color-accent, #A30626);
            --page-text: rgba(255, 255, 255, 0.9);
            --page-text-muted: rgba(255, 255, 255, 0.55);
            --page-text-light: rgba(255, 255, 255, 0.35);
            --page-btn-hover: #222222;
            --page-banner-bg: #161616;
        }
        .search-tab-btn {
          padding: 8px 16px;
          border: none;
          background: none;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--page-text-muted);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        .search-tab-btn.active {
          color: #8B002A;
          border-bottom-color: #8B002A;
        }
        .result-card {
          border: 1px solid var(--page-border);
          background: var(--page-card-bg);
          padding: 20px;
          border-radius: 4px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        [data-theme="dark"] .result-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.2);
        }
        select option {
          background-color: var(--page-card-bg);
          color: var(--page-text);
        }
      ` }} />

      {/* Page Hero: Centered Title */}
      <section style={{padding: "60px 60px 24px", maxWidth: "980px", margin: "0 auto"}}>
        <div style={{ marginBottom: "20px" }}>
          <Breadcrumbs items={[{ label: t('search_hero_title') || 'Recherche' }]} />
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "48px", fontWeight: "400", color: "var(--page-text)", margin: "0 0 12px 0", letterSpacing: "-0.01em"}}>
            {t('search_hero_title')}
          </h1>
          <p style={{fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--page-text-muted)", margin: "0"}}>
            {t('search_hero_sub')}
          </p>
        </div>
      </section>

      {/* Search Bar & Filters Section */}
      <section style={{padding: "0 60px 48px", maxWidth: "980px", margin: "0 auto"}}>
        <div style={{background: "var(--page-bg)", border: "1px solid var(--page-border)", borderRadius: "4px", padding: "28px 32px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)"}}>

          {/* Search Input Row */}
          <div style={{display: "flex", alignItems: "center", gap: "0", marginBottom: "16px"}}>
            <div style={{display: "flex", alignItems: "center", flex: "1", border: "1px solid var(--page-border)", borderRadius: "2px 0 0 2px", padding: "0 16px", height: "52px", background: "var(--page-card-bg)"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B002A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: "0", marginRight: "12px"}}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_input_ph') || "Tapez un sujet, un nom d'expert ou un terme de recherche..."} 
                style={{flex: "1", border: "none", outline: "none", fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--page-text)", background: "transparent", height: "100%"}} 
                autoFocus
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--page-text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                  title="Effacer la recherche"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            
            <button 
              type="button" 
              onClick={() => {}}
              style={{background: "#8B002A", color: "#fff", border: "none", borderRadius: "0 2px 2px 0", height: "52px", padding: "0 24px", fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center"}}
            >
              {isLoading ? (t('search_btn_loading') || "RECHERCHE...") : (t('search_btn_submit') || "RECHERCHER")}
            </button>
          </div>

          {/* Advanced Filters toggle button */}
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)} 
              style={{background: "none", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", fontWeight: "600"}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              {t('search_adv_filters') || "Filtres avancés par Univers & Formats"}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            {(selectedCategory !== 'all' || selectedFormat !== 'all' || searchQuery) && (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedFormat('all'); setActiveTab('all'); }}
                style={{ background: 'none', border: 'none', color: 'var(--page-text-muted)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {t('search_reset') || "Réinitialiser les filtres"}
              </button>
            )}
          </div>

          {/* Collapsible Advanced Filters Panel */}
          {showFilters && (
            <div style={{ background: "var(--page-banner-bg)", borderRadius: "4px", padding: "20px", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--page-text-muted)", marginBottom: "6px" }}>Thématique / Univers</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "12px", border: "1px solid var(--page-border)", borderRadius: "2px", background: "var(--page-bg)", color: "var(--page-text)" }}
                >
                  <option value="all">Tous les 16 Univers</option>
                  <option value="intelligence">01. Intelligence & Géopolitique</option>
                  <option value="power-lab">02. Power Lab & Management</option>
                  <option value="alliance">03. L'Alliance</option>
                  <option value="agenda">04. L'Agenda</option>
                  <option value="passions">05. Passions</option>
                  <option value="art-de-vivre">06. Art de Vivre & Design</option>
                  <option value="academie">07. Académie</option>
                  <option value="patrimoine">08. Patrimoine</option>
                  <option value="longevity">09. Longevity & Bio-hacking</option>
                  <option value="impact">10. Impact & Finance</option>
                  <option value="culture-medias">11. Culture & Médias</option>
                  <option value="cercle">12. Le Cercle</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--page-text-muted)", marginBottom: "6px" }}>Format de contenu</label>
                <select 
                  value={selectedFormat} 
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "12px", border: "1px solid var(--page-border)", borderRadius: "2px", background: "var(--page-bg)", color: "var(--page-text)" }}
                >
                  <option value="all">Tous les formats</option>
                  <option value="article">Articles & Analyses</option>
                  <option value="video">Vidéos & Replays TV</option>
                  <option value="podcast">Podcasts & Émissions Radio</option>
                  <option value="magazine">Magazines & Cahiers</option>
                  <option value="expert">Experts & Équipe</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--page-text-muted)", marginBottom: "6px" }}>Tri des résultats</label>
                <select 
                  style={{ width: "100%", padding: "8px 12px", fontSize: "12px", border: "1px solid var(--page-border)", borderRadius: "2px", background: "var(--page-bg)", color: "var(--page-text)" }}
                >
                  <option value="relevance">Pertinence maximale</option>
                  <option value="recent">Plus récents en premier</option>
                </select>
              </div>
            </div>
          )}

          {/* Quick Filter Tags / Popular Suggestions when search query is empty */}
          {!searchQuery && (
            <div style={{ marginTop: "12px" }}>
              <span style={{ fontSize: "11px", color: "var(--page-text-muted)", marginRight: "10px", fontWeight: "600" }}>{t('search_suggestions') || "Suggestions :"}</span>
              <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "8px" }}>
                {popularSearches.map((item, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => handlePopularSearch(item.query)}
                    style={{ background: "var(--page-banner-bg)", border: "1px solid var(--page-border)", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "var(--page-text)", cursor: "pointer" }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── LIVE RESULTS SECTION ───────────────────────────────────────── */}
      <section style={{ padding: "0 60px 80px", maxWidth: "980px", margin: "0 auto" }}>
        
        {/* Results Header & Format Filter Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--page-border)", paddingBottom: "12px", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "var(--page-text)", margin: 0 }}>
              {searchQuery ? `Résultats pour "${searchQuery}"` : "Exploration par Thèmes & Univers"}
            </h2>
            <span style={{ fontSize: "12px", color: "var(--page-text-muted)" }}>
              {filteredFlatResults.length} contenu(s) trouvé(s)
            </span>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            {[
              { id: 'all', label: `Tous (${searchResults?.flatResults?.length || 0})` },
              { id: 'article', label: `Articles (${searchResults?.results?.articles?.length || 0})` },
              { id: 'video', label: `Vidéos (${searchResults?.results?.videos?.length || 0})` },
              { id: 'podcast', label: `Podcasts (${searchResults?.results?.podcasts?.length || 0})` },
              { id: 'magazine', label: `Magazines (${searchResults?.results?.magazines?.length || 0})` },
              { id: 'expert', label: `Experts (${searchResults?.results?.experts?.length || 0})` },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`search-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--page-text-muted)", fontSize: "14px" }}>
            {t('search_btn_loading') || "Chargement des résultats de recherche..."}
          </div>
        ) : filteredFlatResults.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", background: "var(--page-banner-bg)", borderRadius: "4px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8B002A" strokeWidth="1.5" style={{ marginBottom: "12px" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <h3 style={{ fontSize: "18px", color: "var(--page-text)", margin: "0 0 8px 0" }}>{t('search_no_results') || "Aucun résultat trouvé"}</h3>
            <p style={{ fontSize: "13px", color: "var(--page-text-muted)", margin: 0 }}>
              {t('search_no_results_desc') || "Essayez de rechercher un autre terme ou réinitialisez vos filtres."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredFlatResults.map((item, idx) => (
              <article key={item.id || idx} className="result-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ 
                        fontSize: "9px", 
                        fontWeight: "800", 
                        letterSpacing: "0.1em", 
                        color: "#FFFFFF", 
                        background: getFormatBadgeColor(item.format || item.type),
                        padding: "3px 8px",
                        borderRadius: "2px",
                        textTransform: "uppercase"
                      }}>
                        {getFormatLabel(item.format || item.type)}
                      </span>

                      {item.category && (
                        <span style={{ fontSize: "11px", color: "#8B002A", fontWeight: "600", textTransform: "uppercase" }}>
                          • {item.category}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: "600", color: "var(--page-text)", margin: "0 0 8px 0" }}>
                      <Link href={resolveItemHref(item)} style={{ textDecoration: "none", color: "inherit" }}>
                        {item.title || item.name}
                      </Link>
                    </h3>

                    <p style={{ fontSize: "13px", color: "var(--page-text-muted)", margin: "0 0 12px 0", lineHeight: "1.5" }}>
                      {item.desc || item.description || item.bio || "Consultez cet élément sur DONA Magazine..."}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "11px", color: "var(--page-text-light)" }}>
                      {item.author && <span>Par {item.author}</span>}
                      {item.duration && <span>Durée : {item.duration}</span>}
                      {item.role && <span>{item.role}</span>}
                    </div>
                  </div>

                  {item.image && (
                    <Link href={resolveItemHref(item)} style={{ width: "120px", height: "80px", borderRadius: "2px", overflow: "hidden", flexShrink: 0, display: "block" }}>
                      <img src={item.image} alt={item.title || "Vignette"} width="120" height="80" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Link>
                  )}

                  <div style={{ alignSelf: "center", marginLeft: "8px" }}>
                    <Link 
                      href={resolveItemHref(item)} 
                      style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        fontSize: "11px", 
                        fontWeight: "700", 
                        letterSpacing: "0.08em",
                        color: "#FFFFFF", 
                        backgroundColor: "#8B002A",
                        padding: "8px 16px",
                        borderRadius: "2px",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 8px rgba(139, 0, 42, 0.15)",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#6B0020'; e.currentTarget.style.transform = 'translateX(2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#8B002A'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                      <span>{t('search_consult') || "CONSULTER"}</span>
                      <span style={{ fontSize: "13px" }}>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Recent Searches Footer */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--page-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--page-text-muted)", margin: "0 0 8px 0" }}>
              {t('search_frequent_title') || "Recherches fréquentes du Cercle"}
            </h4>
            <div style={{ display: "flex", gap: "16px" }}>
              {recentSearches.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSearchQuery(item.query)}
                  style={{ background: "none", border: "none", color: "#8B002A", fontSize: "12px", cursor: "pointer", padding: 0, fontWeight: "500" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <Link href="/today" style={{ fontSize: "12px", fontWeight: "600", color: "var(--page-text)", textDecoration: "none" }}>
            {t('view_all') || "Voir tout"} →
          </Link>
        </div>

      </section>
    </main>
  );
}

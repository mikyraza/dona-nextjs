"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const initialConfig = {
  hero: {
    title: "DONA : La\nRenaissance\nde la Femme Solaire",
    subtitle: "\"Une femme affirmée, positive, ambitieuse et rayonnante,\nen harmonie avec son époque.\"",
    button1: { label: "DÉCOUVRIR DONA", url: "#" },
    button2: { label: "LIRE LE MANIFESTE", url: "#" },
    image: "assets/core/img/hero_solaire.png"
  },
  filters: [
    { id: 1, label: "TOUTES", url: "#" },
    { id: 2, label: "GÉOPOLITIQUE", url: "#" },
    { id: 3, label: "ÉCONOMIE", url: "#" },
    { id: 4, label: "BUSINESS", url: "#" },
    { id: 5, label: "INNOVATION", url: "#" },
    { id: 6, label: "SOCIÉTÉ", url: "#" },
    { id: 7, label: "CULTURE", url: "#" }
  ],
  urgentArticle: {
    title: "Accord historique sur la parité salariale au sein de l'Union Européenne",
    desc: "Après des mois de négociations intenses, le Parlement a adopté ce matin une directive contraignante, marquant un tournant décisif pour l'égalité économique.",
    image: "assets/core/img/featured_urgent.png"
  },
  newsTimeline: [
    { id: 1, time: "14:30", isNew: true, title: "Nominations à la tête des grandes banques centrales", desc: "Trois femmes pressenties pour diriger les institutions clés en Asie et en Europe, un signal fort pour les marchés financiers." },
    { id: 2, time: "13:15", isNew: false, title: "COP29 : Les initiatives climatiques portées par des entrepreneures", desc: "Le sommet met en lumière des solutions innovantes développées par des startups dirigées par des femmes dans les pays du Sud." },
    { id: 3, time: "11:45", isNew: false, title: "Rétrospective : L'impact de l'architecture inclusive", desc: "Comment la nouvelle vague de designers redessine les espaces publics pour plus de sécurité et de convivialité urbaine." }
  ],
  editorial: {
    title: "Notre Vision\nRéconciliée",
    desc: "Le magazine DONA porte une vision réconciliée de la femme moderne. Loin des clivages épuisants, nous célébrons une féminité qui embrasse la réussite professionnelle sans sacrifier la grâce, l'élégance et l'accomplissement personnel.",
    points: [
      { id: 1, title: "L'Harmonie plutôt que le combat", desc: "Cultiver sa force intérieure dans la sérénité." },
      { id: 2, title: "L'Ambition assumée", desc: "Viser l'excellence dans toutes les sphères de la vie." }
    ],
    quote: "\"L'élégance n'est pas de se faire remarquer, mais de s'en souvenir. C'est cette trace lumineuse que laisse la femme DONA.\"",
    image: "assets/core/img/vision_portrait.png"
  },
  values: [
    { id: 1, title: "Heureuse", desc: "Cultiver la joie quotidienne comme une discipline de vie et un moteur de créativité." },
    { id: 2, title: "Affirmée", desc: "Posséder une voix claire, poser des limites saines et assumer ses convictions." },
    { id: 3, title: "Ambitieuse", desc: "Vouloir plus grand, sans s'excuser, et se donner les moyens d'atteindre l'excellence." },
    { id: 4, title: "Rayonnante", desc: "Être une source d'inspiration lumineuse pour son entourage et sa communauté." }
  ],
  france: [
    { id: 1, category: "POLITIQUE", time: "Il y a 45 min", title: "Loi Égalité Professionnelle : Le Sénat adopte le texte en première lecture", desc: "Les quotas dans les comités de direction des grandes entreprises seront renforcés dès 2026.", image: "assets/core/img/france_1.png" },
    { id: 2, category: "ÉCONOMIE", time: "Il y a 2h", title: "CAC 40 : Les entreprises dirigées par des femmes surperforment", desc: "Une nouvelle étude démontre une rentabilité supérieure de 12% pour les groupes à parité.", image: "assets/core/img/france_2.png" },
    { id: 3, category: "CULTURE", time: "Il y a 4h", title: "Cannes 2026 : Record historique de femmes réalisatrices en sélection officielle", desc: "Thierry Frémaux annonce une sélection paritaire pour la première fois dans l'histoire du festival.", image: "assets/core/img/france_3.png" }
  ]
};

export default function Page() {
  const [config, setConfig] = useState(initialConfig);
  const [activeFilter, setActiveFilter] = useState(initialConfig.filters[0].id);

  useEffect(() => {
    // Load dynamic config from localStorage
    const savedConfig = localStorage.getItem('dona_today_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        if (parsed.filters && parsed.filters.length > 0) {
            setActiveFilter(parsed.filters[0].id);
        }
      } catch (e) {
        console.error("Erreur de parsing dona_today_config", e);
      }
    }
  }, []);

  // Compute filtered items
  const isAllFilter = config.filters.length > 0 && activeFilter === config.filters[0].id;

  const filteredNewsTimeline = isAllFilter 
    ? config.newsTimeline 
    : (config.newsTimeline || []).filter(news => news.filters && news.filters.includes(activeFilter));

  const filteredFrance = isAllFilter
    ? config.france
    : (config.france || []).filter(article => article.filters && article.filters.includes(activeFilter));

  let displayUrgent = null;
  let displayTimeline = [];

  if (isAllFilter) {
      displayUrgent = config.urgentArticle;
      displayTimeline = config.newsTimeline || [];
  } else {
      const urgentMatches = config.urgentArticle && config.urgentArticle.filters && config.urgentArticle.filters.includes(activeFilter);
      if (urgentMatches) {
          displayUrgent = config.urgentArticle;
          displayTimeline = filteredNewsTimeline;
      } else if (filteredNewsTimeline.length > 0) {
          displayUrgent = { ...filteredNewsTimeline[0], image: filteredNewsTimeline[0].image || '/assets/core/img/featured_urgent.png' };
          displayTimeline = filteredNewsTimeline.slice(1);
      } else {
          displayUrgent = null;
          displayTimeline = [];
      }
  }

  return (
    <main>
      {/* HERO SECTION */}
        <section className="today-hero">
            <div className="today-hero-bg">
                <img src={config.hero.image} alt="Cover" className="hero-bg-img" />
            </div>
            <div className="today-hero-content">
                <h1 className="today-hero-title">
                  {config.hero.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}<br />
                    </React.Fragment>
                  ))}
                </h1>
                <p className="today-hero-subtitle">
                  {config.hero.subtitle.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}<br />
                    </React.Fragment>
                  ))}
                </p>
                <div className="today-hero-actions">
                    <Link href={config.hero.button1.url} className="btn-primary">{config.hero.button1.label}</Link>
                    <Link href={config.hero.button2.url} className="btn-secondary">{config.hero.button2.label}</Link>
                </div>
            </div>
        </section>

        {/* CATEGORIES FILTER */}
        <div className="today-filters">
            <ul className="filter-list">
                {config.filters.map((filter) => {
                  const isActive = activeFilter === filter.id;
                  const labelText = (filter.label && filter.label.trim()) 
                    ? filter.label 
                    : (filter.id === 1 || filter.id === 'all' || filter.id === '1' ? 'TOUTES' : 'CATÉGORIE');

                  return (
                    <li key={filter.id}>
                      <button 
                        type="button"
                        onClick={() => setActiveFilter(filter.id)} 
                        className={`filter-pill ${isActive ? 'active' : ''}`}
                        style={{ 
                          background: isActive ? '#8B002A' : 'var(--color-bg, #FFFFFF)', 
                          color: isActive ? '#FFFFFF' : 'var(--color-text, #1C1B1B)', 
                          border: isActive ? '1px solid #8B002A' : '1px solid var(--color-border, #CCCCCC)',
                          padding: '8px 20px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '70px'
                        }}
                      >
                        {labelText}
                      </button>
                    </li>
                  );
                })}
            </ul>
        </div>

        {/* MAIN CONTENT GRID (70 / 30) */}
        <section className="today-main-grid">
            <div className="today-content-col">
                {/* Urgent Article */}
                {displayUrgent && (
                  <Link href={`/today/${displayUrgent.id || ''}`} className="urgent-article" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div className="urgent-img-wrapper">
                          <img src={displayUrgent.image || '/assets/core/img/featured_urgent.png'} alt="Urgent" className="urgent-img" />
                          {displayUrgent.isFeatured && (
                          <span className="badge-urgent">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                              À LA UNE
                          </span>
                          )}
                      </div>
                      <div className="urgent-text">
                          <h2 className="urgent-title">{displayUrgent.title}</h2>
                          <p className="urgent-desc">{displayUrgent.desc}</p>
                      </div>
                  </Link>
                )}

                {/* Fil d'actualité */}
                {displayTimeline.length > 0 && (
                  <div className="news-timeline">
                      <h3 className="section-overline">FIL D'ACTUALITÉ</h3>
                      <div className="timeline-list">
                          {displayTimeline.map((news) => (
                            <Link href={`/today/${news.id || ''}`} key={news.id} className={`timeline-item ${news.isNew ? 'is-new' : ''}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
                                <div className="timeline-time">
                                    {news.time}
                                    {news.isNew && <span className="badge-new">NOUVEAU</span>}
                                </div>
                                <div className="timeline-content">
                                    <h4 className="timeline-title">{news.title}</h4>
                                    <p className="timeline-desc">{news.desc}</p>
                                </div>
                            </Link>
                          ))}
                      </div>
                  </div>
                )}
            </div>

            <aside className="today-sidebar-col">
                {/* Les Plus Lus */}
                <div className="sidebar-widget">
                    <h3 className="section-overline">LES PLUS LUS</h3>
                    <ul className="popular-list">
                        <li>
                            <span className="popular-num">01</span>
                            <span className="popular-text">Analyse : La résilience des chaines d'approvisionnement globales</span>
                        </li>
                        <li>
                            <span className="popular-num">02</span>
                            <span className="popular-text">Le renouveau du marché de l'art contemporain africain</span>
                        </li>
                        <li>
                            <span className="popular-num">03</span>
                            <span className="popular-text">Tech : Les biais algorithmiques sous le microscope</span>
                        </li>
                    </ul>
                </div>

                {/* Alertes */}
                <div className="sidebar-widget widget-alerts">
                    <h3 className="alert-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        ALERTES
                    </h3>
                    <p className="alert-text">Flash : Le conseil de sécurité de l'ONU adopte une résolution d'urgence concernant la crise en mer rouge.</p>
                </div>

                {/* Sources en direct */}
                <div className="sidebar-widget">
                    <h3 className="section-overline">SOURCES EN DIRECT</h3>
                    <div className="sources-logos">
                        <span>AFP</span>
                        <span>Reuters</span>
                        <span>Bloomberg</span>
                    </div>
                </div>
            </aside>
        </section>

        {/* NOTRE ÉDITORIAL */}
        <section className="today-philosophy">
            <div className="philosophy-container">
                <div className="philosophy-text">
                    <h3 className="section-overline text-red">NOTRE ÉDITORIAL</h3>
                    <h2 className="philosophy-title">
                      {config.editorial.title.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}<br />
                        </React.Fragment>
                      ))}
                    </h2>
                    <p className="philosophy-desc">{config.editorial.desc}</p>
                    
                    <ul className="philosophy-points">
                        {config.editorial.points.map((point) => (
                          <li key={point.id}>
                              <span className="check-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></span>
                              <div className="point-text">
                                  <strong>{point.title}</strong>
                                  <span>{point.desc}</span>
                              </div>
                          </li>
                        ))}
                    </ul>

                    <blockquote className="philosophy-quote">
                        {config.editorial.quote}
                    </blockquote>
                </div>
                <div className="philosophy-image">
                    <img src={config.editorial.image} alt="Vision DONA" />
                </div>
            </div>
        </section>

        {/* LES 4 VALEURS */}
        <section className="today-values">
            <div className="values-grid">
                {config.values.map((value, index) => (
                  <div key={value.id} className="value-card">
                      <div className="value-icon">
                          {/* Les icônes sont pour l'instant hardcodées en fonction de l'index car stocker du SVG en config JSON est plus complexe. On les conserve statiques. */}
                          {index === 0 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>}
                          {index === 1 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>}
                          {index === 2 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>}
                          {index === 3 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>}
                      </div>
                      <h3 className="value-title">{value.title}</h3>
                      <p className="value-desc">{value.desc}</p>
                  </div>
                ))}
            </div>
        </section>

        {/* FRANCE EN DIRECT */}
        <section className="today-france">
            <div className="section-header">
                <h2 className="section-title">France en Direct</h2>
                <Link href="/today/all" className="link-more">TOUT VOIR &rarr;</Link>
            </div>
            {filteredFrance.length > 0 ? (
              <div className="france-grid">
                  {filteredFrance.map((article) => (
                    <Link href={`/today/${article.id || ''}`} key={article.id} className="france-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                        <img src={article.image} alt={article.title} />
                        <div className="france-meta">
                            <span className="meta-cat">{article.category}</span>
                            <span className="meta-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> {article.time}</span>
                        </div>
                        <h3 className="france-title">{article.title}</h3>
                        <p className="france-desc">{article.desc}</p>
                    </Link>
                  ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>Aucun article dans cette catégorie.</p>
            )}
        </section>

        {/* ABONNEMENT ALLIANCE */}
        <section className="today-subscription">
            <div className="sub-header">
                <h2>Rejoignez l'Alliance DONA</h2>
                <p>Accédez à un réseau exclusif de femmes solaires, des masterclasses privées et l'intégralité de nos archives éditoriales.</p>
            </div>
            <div className="sub-cards">
                {/* Découverte */}
                <div className="sub-card card-transparent">
                    <h3 className="sub-card-title">Découverte</h3>
                    <p className="sub-card-subtitle">Accès limité</p>
                    <div className="sub-price">Gratuit</div>
                    <ul className="sub-features">
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Newsletter hebdomadaire</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> 3 articles par mois</li>
                    </ul>
                    <Link href="/signup" className="btn-sub-outline">S'INSCRIRE</Link>
                </div>
                
                {/* Premium */}
                <div className="sub-card card-solid">
                    <div className="badge-recommended">RECOMMANDÉ</div>
                    <h3 className="sub-card-title">Alliance Premium</h3>
                    <p className="sub-card-subtitle">L'expérience complète</p>
                    <div className="sub-price"><span className="price-val">14€</span>/mois</div>
                    <ul className="sub-features">
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Accès illimité aux articles</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Masterclasses mensuelles</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Réseau privé d'entraide</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Événements exclusifs</li>
                    </ul>
                    <Link href="/abonnement" className="btn-sub-solid">COMMENCER L'ESSAI GRATUIT - 14 JOURS</Link>
                </div>
            </div>
        </section>
    </main>
  );
}

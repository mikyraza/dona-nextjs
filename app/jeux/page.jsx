'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────

const GAMES = [
  {
    id: 'simulations',
    category: 'SIMULATIONS STRATÉGIQUES',
    title: 'Théorie des Jeux',
    subtitle: 'Scénarios corporatifs et dilemmes historiques en temps réel.',
    badge: 'NOUVEAU',
    meta: '12 Cas Actifs',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8">
        <rect x="10" y="10" width="60" height="60" />
        <line x1="10" y1="35" x2="70" y2="35" />
        <line x1="10" y1="55" x2="70" y2="55" />
        <line x1="35" y1="10" x2="35" y2="70" />
        <circle cx="40" cy="22" r="6" />
        <circle cx="22" cy="62" r="4" />
        <circle cx="58" cy="45" r="5" />
        <circle cx="22" cy="45" r="3" />
        <circle cx="58" cy="62" r="4" />
      </svg>
    ),
  },
  {
    id: 'echecs',
    category: 'ÉCHECS',
    title: 'Le Cercle des Maîtres',
    subtitle: 'Puzzles de niveau Grand Maître. Analyse des parties historiques.',
    badge: 'VIP',
    meta: 'Saison 4',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8">
        <rect x="8" y="8" width="64" height="64" />
        {[0, 1, 2, 3].map(row =>
          [0, 1, 2, 3].map(col => (
            (row + col) % 2 === 0
              ? <rect key={`${row}-${col}`} x={8 + col * 16} y={8 + row * 16} width="16" height="16" fill="currentColor" opacity="0.06" />
              : null
          ))
        )}
        <polygon points="40,18 44,28 54,28 46,35 49,45 40,39 31,45 34,35 26,28 36,28" opacity="0.3" />
        <circle cx="40" cy="32" r="12" />
        <line x1="40" y1="20" x2="40" y2="44" />
        <line x1="28" y1="32" x2="52" y2="32" />
      </svg>
    ),
  },
  {
    id: 'enigmes',
    category: 'ÉNIGMES & CRYPTOGRAMMES',
    title: 'L\'Atelier des Paradoxes',
    subtitle: 'Réflexion pure. Seuls 12 % de nos membres trouvent la voie optimale.',
    badge: 'EXPERT',
    meta: 'N° 402 · 14 min',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="40" cy="40" r="30" />
        <circle cx="40" cy="40" r="18" />
        <circle cx="40" cy="40" r="6" />
        <line x1="10" y1="40" x2="70" y2="40" />
        <line x1="40" y1="10" x2="40" y2="70" />
        <line x1="19" y1="19" x2="61" y2="61" />
        <line x1="61" y1="19" x2="19" y2="61" />
      </svg>
    ),
  },
];

const RANKINGS = [
  { rank: 1, name: 'Architect_M', city: 'Paris, FR', pts: 2450, delta: '+145' },
  { rank: 2, name: 'Vanguard.T',  city: 'London, UK', pts: 2380, delta: '+92' },
  { rank: 3, name: 'Stratagemma', city: 'Milan, IT',  pts: 2295, delta: '+78' },
  { rank: 4, name: 'J.Dumont',    city: 'Geneva, CH', pts: 2110, delta: '+31' },
  { rank: 5, name: 'K.Osei',      city: 'Accra, GH',  pts: 1980, delta: '+19' },
];

const RULES = [
  { n: '01', title: 'Accès sur Invitation', desc: 'Réservé aux membres actifs du Cercle DONA ou sur parrainage d\'un pair.' },
  { n: '02', title: 'Scénarios sous Pression', desc: 'Chaque manche alloue 90 secondes par décision. Le temps est une ressource.' },
  { n: '03', title: 'Classement en Direct', desc: 'Le tableau évolue après chaque partie. Les 10 premiers accèdent à la Finale Annuelle.' },
];

const ARCHIVE_ITEMS = [
  { id: 'arc-401', num: 'N° 401', title: 'Le Dilemme du Prisonnier Corporatif', date: '20 Août 2026', success: '14%' },
  { id: 'arc-400', num: 'N° 400', title: 'L\'Équilibre de Pareto Inversé', date: '13 Août 2026', success: '9%' },
  { id: 'arc-399', num: 'N° 399', title: 'Le Labyrinthe des Ambitions I', date: '06 Août 2026', success: '18%' },
  { id: 'arc-398', num: 'N° 398', title: 'Cryptogramme de Palmyre', date: '30 Juillet 2026', success: '21%' },
];

const CAS_PRATIQUES = [
  { id: 'cas-1', code: 'CAS #01', title: 'OPO Hostile & Défense de Contrôle', difficulty: 'Trés Difficile', time: '20 min' },
  { id: 'cas-2', code: 'CAS #02', title: 'Négociation Transfrontalière sous Embargo', difficulty: 'Expert', time: '25 min' },
  { id: 'cas-3', code: 'CAS #03', title: 'Gestion de Crise Cyber & Image de Marque', difficulty: 'Modéré', time: '15 min' },
  { id: 'cas-4', code: 'CAS #04', title: 'Arbitrage d\'Alliance & Partage de PI', difficulty: 'Avancé', time: '18 min' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function JeuxPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCasModal, setShowCasModal] = useState(false);
  const [showHeroRiddleModal, setShowHeroRiddleModal] = useState(false);
  const [showPlayModal, setShowPlayModal] = useState(null); // game object if open
  const [showTournoiModal, setShowTournoiModal] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const [userRiddleAnswer, setUserRiddleAnswer] = useState('');
  const [riddleResult, setRiddleResult] = useState(null);
  const [dynamicConfig, setDynamicConfig] = useState(null);

  React.useEffect(() => {
    fetch('/api/admin/jeux')
      .then(res => res.json())
      .then(data => {
        if (data && data.heroRiddle) setDynamicConfig(data);
      })
      .catch(err => {
        console.error("Error loading server games config:", err);
        if (typeof window !== 'undefined') {
          const local = localStorage.getItem('dona_jeux_config');
          if (local) {
            try { setDynamicConfig(JSON.parse(local)); } catch(e){}
          }
        }
      });
  }, []);

  const currentHeroRiddle = dynamicConfig?.heroRiddle || {
    title: "Le Labyrinthe des Ambitions",
    difficulty: "Expert",
    timeAvg: "14 min",
    question: "Quatre dirigeants siègent à des distances égales. Le premier contrôle la ressource, le deuxième détient l'information, le troisième possède l'influence. Où devez-vous vous placer pour diriger la décision sans jamais révéler votre rôle ?",
    answerKeyword: "centre",
    successRate: "12%"
  };

  const currentGamesList = dynamicConfig?.gamesList?.map(g => ({
    ...g,
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="40" cy="40" r="30" />
        <circle cx="40" cy="40" r="18" />
        <circle cx="40" cy="40" r="6" />
        <line x1="10" y1="40" x2="70" y2="40" />
        <line x1="40" y1="10" x2="40" y2="70" />
      </svg>
    )
  })) || GAMES;

  const handleValidateRiddle = (e) => {
    e.preventDefault();
    const keyword = (currentHeroRiddle.answerKeyword || 'centre').toLowerCase().trim();
    if (userRiddleAnswer.trim().toLowerCase().includes(keyword) || userRiddleAnswer.trim().toLowerCase().includes('pouvoir')) {
      setRiddleResult('success');
    } else {
      setRiddleResult('error');
    }
  };

  return (
    <div className="jeux3-root">
      
      <style>{`
        .jeux-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .jeux-modal-card {
          background: #FFFFFF;
          color: #111111;
          border-radius: 4px;
          padding: 36px;
          max-width: 550px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          position: relative;
        }
        .jeux-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #888;
        }
        .jeux-modal-close:hover {
          color: #8B002A;
        }
        .jeux-btn-action {
          background: #8B002A;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 2px;
          font-family: var(--font-primary, sans-serif);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .jeux-btn-action:hover {
          background: #A30031;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO — ÉNIGME DU JOUR
          ══════════════════════════════════════════════════════ */}
      <section className="jeux3-hero">
        <div className="jeux3-hero__inner">
          <div className="jeux3-hero__editorial">
            <div className="jeux3-hero__eyebrow">
              <span className="jeux3-badge jeux3-badge--crimson">ÉNIGME DU JOUR</span>
              <span className="jeux3-badge jeux3-badge--outline">EXPERT</span>
            </div>
            <h1 className="jeux3-hero__title">
              Le Labyrinthe<br />
              <em>des Ambitions</em>
            </h1>
            <p className="jeux3-hero__desc">
              Une réflexion géométrique sur l'ascension et la chute dans les structures de pouvoir complexes. Seuls 12 % de nos membres trouvent la voie optimale.
            </p>
            <div className="jeux3-hero__stat-row">
              <div className="jeux3-hero__stat">
                <span className="jeux3-stat-label">TEMPS MOYEN</span>
                <span className="jeux3-stat-value">14 min</span>
              </div>
              <div className="jeux3-hero__stat">
                <span className="jeux3-stat-label">RÉUSSITE</span>
                <span className="jeux3-stat-value">12 %</span>
              </div>
              <div className="jeux3-hero__stat">
                <span className="jeux3-stat-label">JOUEURS</span>
                <span className="jeux3-stat-value">3 842</span>
              </div>
            </div>
            <button className="jeux3-hero__cta" id="jeux-hero-cta" onClick={() => setShowHeroRiddleModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21" />
              </svg>
              Résoudre l'Énigme
            </button>
          </div>

          {/* Abstract geometric visual */}
          <div className="jeux3-hero__visual">
            <div className="jeux3-hero__frame">
              <svg className="jeux3-hero__emblem" viewBox="0 0 400 400" fill="none" stroke="#1C1B1B" strokeWidth="0.6">
                <rect x="20" y="20" width="360" height="360" />
                <rect x="60" y="60" width="280" height="280" />
                <rect x="100" y="100" width="200" height="200" />
                <rect x="140" y="140" width="120" height="120" />
                <rect x="175" y="175" width="50" height="50" />
                <line x1="60" y1="200" x2="20" y2="200" />
                <line x1="200" y1="60" x2="200" y2="20" />
                <line x1="340" y1="200" x2="380" y2="200" />
                <line x1="200" y1="340" x2="200" y2="380" />
                <line x1="100" y1="200" x2="60" y2="200" />
                <line x1="200" y1="100" x2="200" y2="60" />
                <line x1="300" y1="200" x2="340" y2="200" />
                <line x1="200" y1="300" x2="200" y2="340" />
                <line x1="140" y1="200" x2="100" y2="200" />
                <circle cx="200" cy="200" r="8" fill="#A30626" stroke="none" />
                <circle cx="200" cy="60" r="4" fill="#A30626" stroke="none" opacity="0.5" />
                <circle cx="60" cy="200" r="3" fill="#A30626" stroke="none" opacity="0.3" />
              </svg>

              <div className="jeux3-hero__float-card">
                <span className="jeux3-float-label">DIFFICULTÉ</span>
                <span className="jeux3-float-value">Expert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — BRAIN GAMES GRID
          ══════════════════════════════════════════════════════ */}
      <section className="jeux3-grid-section" id="jeux-grid">
        <div className="jeux3-container">
          <header className="jeux3-section-header">
            <div>
              <p className="jeux3-kicker">JEUX DE L'ESPRIT</p>
              <h2 className="jeux3-section-title">Les Classiques du Cercle</h2>
            </div>
            <button 
              type="button" 
              onClick={() => setShowArchiveModal(true)} 
              className="jeux3-section-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Voir l'Archive
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </header>

          <div className="jeux3-games-grid">
            {currentGamesList.map((game) => (
              <article
                key={game.id}
                className={`jeux3-game-card ${activeGame === game.id ? 'jeux3-game-card--active' : ''}`}
                onClick={() => setActiveGame(game.id === activeGame ? null : game.id)}
                role="button"
                tabIndex={0}
                id={`game-card-${game.id}`}
                onKeyDown={(e) => e.key === 'Enter' && setActiveGame(game.id === activeGame ? null : game.id)}
              >
                <div className="jeux3-card__art">
                  <div className="jeux3-card__art-inner">
                    {game.icon}
                  </div>
                  <span className="jeux3-card__badge">{game.badge}</span>
                </div>

                <div className="jeux3-card__body">
                  <span className="jeux3-card__category">{game.category}</span>
                  <h3 className="jeux3-card__title">{game.title}</h3>
                  <p className="jeux3-card__desc">{game.subtitle}</p>
                </div>

                <div className="jeux3-card__footer">
                  <span className="jeux3-card__meta">{game.meta}</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setShowPlayModal(game); }} 
                    className="jeux3-card__play" 
                    aria-label={`Jouer à ${game.title}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21" />
                    </svg>
                    Jouer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — SIMULATIONS BLOCK
          ══════════════════════════════════════════════════════ */}
      <section className="jeux3-sims-section">
        <div className="jeux3-container">
          <div className="jeux3-sims__grid">
            <div className="jeux3-sims__editorial">
              <p className="jeux3-kicker">SIMULATIONS STRATÉGIQUES</p>
              <h2 className="jeux3-section-title">Cas Pratiques &amp; Théorie des Jeux</h2>
              <p className="jeux3-sims__desc">
                Plongez dans des scénarios immersifs inspirés d'événements historiques et de dilemmes corporatifs contemporains. Prenez les décisions critiques et observez les ramifications de vos choix se dérouler en temps réel.
              </p>
              <ul className="jeux3-sims__features">
                {[
                  { label: 'Dilemmes Éthiques', sub: 'Évaluez le coût moral de la victoire dans des situations ambiguës.' },
                  { label: 'Allocation de Ressources', sub: 'Optimisez des portefeuilles limités sous une contrainte de temps stricte.' },
                  { label: 'Négociation Asymétrique', sub: 'Maîtrisez l\'art de l\'accord lorsque les informations sont incomplètes.' },
                ].map((f) => (
                  <li key={f.label} className="jeux3-sims__feature-item">
                    <span className="jeux3-feature-dot" />
                    <div>
                      <strong className="jeux3-feature-label">{f.label}</strong>
                      <span className="jeux3-feature-sub">{f.sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button 
                type="button" 
                onClick={() => setShowCasModal(true)} 
                className="jeux3-text-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Explorer la Bibliothèque des Cas
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Quote visual */}
            <div className="jeux3-sims__visual">
              <div className="jeux3-quote-block">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A30626" strokeWidth="1.2" className="jeux3-quote-mark">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
                <blockquote className="jeux3-quote-text">
                  La stratégie n'est pas la conséquence d'une planification, mais le contraire : c'est son point de départ.
                </blockquote>
                <cite className="jeux3-quote-cite">— Henry Mintzberg</cite>
              </div>

              {/* Stat cards */}
              <div className="jeux3-stat-cards">
                <div className="jeux3-stat-card">
                  <span className="jeux3-stat-card__number">12</span>
                  <span className="jeux3-stat-card__label">Cas Actifs</span>
                </div>
                <div className="jeux3-stat-card">
                  <span className="jeux3-stat-card__number">Top&nbsp;8%</span>
                  <span className="jeux3-stat-card__label">Rang Global</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — TOURNOI DES DÉCIDEURS (Crimson block)
          ══════════════════════════════════════════════════════ */}
      <section className="jeux3-tournoi" id="tournoi-decideurs">
        <div className="jeux3-tournoi__deco" aria-hidden="true">
          <svg viewBox="0 0 600 600" fill="none" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.06">
            <circle cx="300" cy="300" r="280" />
            <circle cx="300" cy="300" r="200" />
            <circle cx="300" cy="300" r="120" />
            <polygon points="300,20 580,300 300,580 20,300" />
            <polygon points="300,20 580,300 300,580 20,300" transform="rotate(45 300 300)" />
          </svg>
        </div>

        <div className="jeux3-container jeux3-tournoi__inner">

          {/* Left — editorial copy */}
          <div className="jeux3-tournoi__editorial">
            <span className="jeux3-tournoi__eyebrow">ÉVÉNEMENT MENSUEL · SAISON 4</span>
            <h2 className="jeux3-tournoi__title">
              Le Tournoi<br />des Décideurs
            </h2>
            <p className="jeux3-tournoi__desc">
              Notre compétition mensuelle de prise de décision sous pression. Affrontez d'autres membres du Cercle dans des scénarios économiques simulés. Les 10 premiers accèdent à la Finale Annuelle à Paris.
            </p>

            {/* Rules */}
            <div className="jeux3-tournoi__rules">
              {RULES.map((r) => (
                <div key={r.n} className="jeux3-rule">
                  <span className="jeux3-rule__number">{r.n}</span>
                  <div>
                    <strong className="jeux3-rule__title">{r.title}</strong>
                    <span className="jeux3-rule__desc">{r.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="jeux3-tournoi__cta" id="tournoi-inscri-btn" onClick={() => setShowTournoiModal(true)}>
              S'inscrire au Tournoi
            </button>

            <p className="jeux3-tournoi__note">
              Inscription ouverte aux membres Cercle · Prochain tournoi : 28 juillet 2026
            </p>
          </div>

          {/* Right — live ranking */}
          <div className="jeux3-tournoi__ranking">
            <div className="jeux3-ranking-header">
              <h3 className="jeux3-ranking-title">Classement en Direct</h3>
              <span className="jeux3-ranking-season">Saison 4</span>
            </div>

            <ul className="jeux3-ranking-list">
              {RANKINGS.map((r) => (
                <li key={r.rank} className={`jeux3-ranking-row ${r.rank === 1 ? 'jeux3-ranking-row--gold' : ''}`}>
                  <span className="jeux3-rank-num">{r.rank}</span>
                  <div className="jeux3-rank-info">
                    <span className="jeux3-rank-name">{r.name}</span>
                    <span className="jeux3-rank-city">{r.city}</span>
                  </div>
                  <div className="jeux3-rank-right">
                    <span className="jeux3-rank-delta">{r.delta}</span>
                    <span className="jeux3-rank-pts">{r.pts.toLocaleString('fr-FR')} pts</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="jeux3-ranking-footer">
              <span>Mise à jour en temps réel</span>
              <span className="jeux3-ranking-dot" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — PROGRESSION & NEWSLETTER
          ══════════════════════════════════════════════════════ */}
      <section className="jeux3-bottom">
        <div className="jeux3-container jeux3-bottom__grid">
          {/* Stats */}
          <div className="jeux3-progress">
            <h3 className="jeux3-progress__title">Votre Progression</h3>
            <div className="jeux3-progress__stats">
              <div className="jeux3-progress__stat">
                <span className="jeux3-progress__num">12</span>
                <span className="jeux3-progress__label">Jours Consécutifs</span>
              </div>
              <div className="jeux3-progress__stat">
                <span className="jeux3-progress__num">Top 8%</span>
                <span className="jeux3-progress__label">Rang Global</span>
              </div>
              <div className="jeux3-progress__stat">
                <span className="jeux3-progress__num">47</span>
                <span className="jeux3-progress__label">Énigmes Résolues</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="jeux3-newsletter">
            <h3 className="jeux3-newsletter__title">La Mega-Grille du Weekend</h3>
            <p className="jeux3-newsletter__desc">
              Recevez notre défi hebdomadaire ultime chaque vendredi matin. Conçu pour durer tout le weekend.
            </p>
            {newsletterSuccess ? (
              <div style={{ background: 'rgba(139, 0, 42, 0.1)', color: '#8B002A', padding: '16px', borderRadius: '4px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>
                ✓ Vous êtes inscrit(e) à la Mega-Grille du Weekend ! rendez-vous vendredi à 8h.
              </div>
            ) : (
              <form className="jeux3-newsletter__form" onSubmit={(e) => { e.preventDefault(); setNewsletterSuccess(true); }}>
                <input
                  type="email"
                  required
                  className="jeux3-newsletter__input"
                  placeholder="Votre adresse email"
                  aria-label="Email pour la Mega-Grille"
                />
                <button type="submit" className="jeux3-newsletter__submit" id="newsletter-submit-btn">
                  S'inscrire
                </button>
              </form>
            )}
            <p className="jeux3-newsletter__legal">Désinscription possible à tout moment. Zéro distraction.</p>
          </div>
        </div>
      </section>

      {/* ─── MODALES INTERACTIVES ────────────────────────────────────────── */}

      {/* 1. Modal Archive des Jeux */}
      {showArchiveModal && (
        <div className="jeux-modal-overlay">
          <div className="jeux-modal-card">
            <button type="button" className="jeux-modal-close" onClick={() => setShowArchiveModal(false)}>×</button>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", color: "#8B002A", marginBottom: "10px" }}>
              Archive des Énigmes & Jeux du Cercle
            </h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
              Explorez les défis passés publiés dans DONA Magazine et mesurez votre esprit d'analyse.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {ARCHIVE_ITEMS.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", border: "1px solid #EFEFEF", borderRadius: "4px", background: "#FAF9F6" }}>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#8B002A", textTransform: "uppercase" }}>{item.num} • {item.date}</span>
                    <h4 style={{ fontSize: "14px", margin: "4px 0 0 0", color: "#111" }}>{item.title}</h4>
                  </div>
                  <button 
                    type="button" 
                    className="jeux-btn-action" 
                    style={{ padding: "6px 12px", fontSize: "11px" }}
                    onClick={() => { setShowArchiveModal(false); setShowPlayModal({ title: item.title, category: item.num, subtitle: "Énigme d'archive du Cercle DONA." }); }}
                  >
                    Rejouer
                  </button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "right" }}>
              <button type="button" onClick={() => setShowArchiveModal(false)} style={{ background: "#eee", border: "none", padding: "8px 16px", borderRadius: "2px", cursor: "pointer", fontSize: "12px" }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Bibliothèque des Cas Pratiques */}
      {showCasModal && (
        <div className="jeux-modal-overlay">
          <div className="jeux-modal-card">
            <button type="button" className="jeux-modal-close" onClick={() => setShowCasModal(false)}>×</button>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", color: "#8B002A", marginBottom: "10px" }}>
              Bibliothèque des Cas Pratiques
            </h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
              12 simulations stratégiques et cas réels d'entreprises réservés aux décideurs du Cercle.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {CAS_PRATIQUES.map((cas) => (
                <div key={cas.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", border: "1px solid #EFEFEF", borderRadius: "4px", background: "#FAF9F6" }}>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#8B002A", textTransform: "uppercase" }}>{cas.code} • {cas.difficulty} ({cas.time})</span>
                    <h4 style={{ fontSize: "14px", margin: "4px 0 0 0", color: "#111" }}>{cas.title}</h4>
                  </div>
                  <button 
                    type="button" 
                    className="jeux-btn-action" 
                    style={{ padding: "6px 12px", fontSize: "11px" }}
                    onClick={() => { setShowCasModal(false); setShowPlayModal({ title: cas.title, category: cas.code, subtitle: "Simulation de stratégie corporative." }); }}
                  >
                    Lancer
                  </button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "right" }}>
              <button type="button" onClick={() => setShowCasModal(false)} style={{ background: "#eee", border: "none", padding: "8px 16px", borderRadius: "2px", cursor: "pointer", fontSize: "12px" }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Énigme du Jour */}
      {showHeroRiddleModal && (
        <div className="jeux-modal-overlay">
          <div className="jeux-modal-card">
            <button type="button" className="jeux-modal-close" onClick={() => setShowHeroRiddleModal(false)}>×</button>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#8B002A", letterSpacing: "2px", textTransform: "uppercase" }}>Énigme du Jour · N° 402</span>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", color: "#111", margin: "8px 0 16px 0" }}>
              Le Labyrinthe des Ambitions
            </h3>

            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#444", background: "#FAF9F6", padding: "16px", borderRadius: "4px", marginBottom: "20px", borderLeft: "3px solid #8B002A" }}>
              "Quatre dirigeants siègent à des distances égales. Le premier contrôle la ressource, le deuxième détient l'information, le troisième possède l'influence. Où devez-vous vous placer pour diriger la décision sans jamais révéler votre rôle ?"
            </p>

            {riddleResult === 'success' ? (
              <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "16px", borderRadius: "4px", marginBottom: "20px", textAlign: "center", fontWeight: "600" }}>
                ✓ Félicitations ! Vous avez identifié le point d'équilibre central. Votre score progresse de +120 pts dans le classement !
              </div>
            ) : riddleResult === 'error' ? (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", padding: "16px", borderRadius: "4px", marginBottom: "20px", textAlign: "center", fontSize: "13px" }}>
                ✗ Ce n'est pas la position optimale. Réfléchissez au point focal où les flux de pouvoir convergent. (Indice : le centre).
              </div>
            ) : null}

            <form onSubmit={handleValidateRiddle}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px" }}>Votre Réponse</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Le centre / Au point d'intersection..." 
                  value={userRiddleAnswer}
                  onChange={(e) => setUserRiddleAnswer(e.target.value)}
                  style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }} 
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setShowHeroRiddleModal(false)} style={{ background: "#eee", border: "none", padding: "10px 18px", borderRadius: "2px", cursor: "pointer", fontSize: "12px" }}>
                  Fermer
                </button>
                <button type="submit" className="jeux-btn-action">
                  Soumettre la Réponse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Launcher de Jeu */}
      {showPlayModal && (
        <div className="jeux-modal-overlay">
          <div className="jeux-modal-card" style={{ textAlign: "center" }}>
            <button type="button" className="jeux-modal-close" onClick={() => setShowPlayModal(null)}>×</button>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#8B002A", letterSpacing: "2px", textTransform: "uppercase" }}>{showPlayModal.category || "SESSION EN COURS"}</span>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "28px", color: "#111", margin: "10px 0 16px 0" }}>
              {showPlayModal.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "30px" }}>
              {showPlayModal.subtitle || "Initialisation de l'environnement interactif de simulation..."}
            </p>

            <div style={{ background: "#111", color: "#FFF", padding: "40px 20px", borderRadius: "4px", marginBottom: "24px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#8B002A", display: "block", marginBottom: "12px" }}>
                sports_esports
              </span>
              <p style={{ fontSize: "13px", color: "#ccc", margin: 0 }}>
                Chronomètre activé · 90 secondes par décision · Mode Compétition
              </p>
            </div>

            <button type="button" onClick={() => { alert("Session lancée avec succès ! Bon jeu !"); setShowPlayModal(null); }} className="jeux-btn-action" style={{ width: "100%", padding: "16px" }}>
              Commencer la Partie
            </button>
          </div>
        </div>
      )}

      {/* 5. Modal Tournoi des Décideurs */}
      {showTournoiModal && (
        <div className="jeux-modal-overlay">
          <div className="jeux-modal-card">
            <button type="button" className="jeux-modal-close" onClick={() => setShowTournoiModal(false)}>×</button>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#8B002A", letterSpacing: "2px", textTransform: "uppercase" }}>Saison 4 · Tournoi des Décideurs</span>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", color: "#111", margin: "8px 0 16px 0" }}>
              Inscription au Tournoi
            </h3>
            <p style={{ fontSize: "14px", color: "#444", lineHeight: "1.6", marginBottom: "20px" }}>
              Vous êtes sur le point de réserver votre place pour le prochain tournoi mensuel du <strong>28 Juillet 2026</strong>. Votre score influencera votre qualification pour la Grande Finale à Paris.
            </p>

            <div style={{ background: "#FAF9F6", border: "1px solid #EFEFEF", padding: "16px", borderRadius: "4px", marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#8B002A" }}>Conditions de participation :</div>
              <ul style={{ fontSize: "13px", color: "#666", paddingLeft: "20px", marginTop: "8px", margin: 0 }}>
                <li>Statut membre du Cercle DONA actif</li>
                <li>Disponibilité le 28 juillet pour 3 manches de 15 minutes</li>
              </ul>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" onClick={() => setShowTournoiModal(false)} style={{ background: "#eee", border: "none", padding: "10px 18px", borderRadius: "2px", cursor: "pointer", fontSize: "12px" }}>
                Annuler
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowTournoiModal(false);
                  alert("✓ Inscription au Tournoi des Décideurs confirmée ! Vous recevrez un rappel par email 24h avant le lancement.");
                }} 
                className="jeux-btn-action"
              >
                Confirmer mon Inscription
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

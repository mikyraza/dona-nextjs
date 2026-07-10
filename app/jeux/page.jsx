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

// ─── Component ───────────────────────────────────────────────────────────────

export default function JeuxPage() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="jeux3-root">

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
            <button className="jeux3-hero__cta" id="jeux-hero-cta">
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
                {/* Labyrinth-like concentric paths */}
                <rect x="20" y="20" width="360" height="360" />
                <rect x="60" y="60" width="280" height="280" />
                <rect x="100" y="100" width="200" height="200" />
                <rect x="140" y="140" width="120" height="120" />
                <rect x="175" y="175" width="50" height="50" />
                {/* Maze breaks */}
                <line x1="60" y1="200" x2="20" y2="200" />
                <line x1="200" y1="60" x2="200" y2="20" />
                <line x1="340" y1="200" x2="380" y2="200" />
                <line x1="200" y1="340" x2="200" y2="380" />
                <line x1="100" y1="200" x2="60" y2="200" />
                <line x1="200" y1="100" x2="200" y2="60" />
                <line x1="300" y1="200" x2="340" y2="200" />
                <line x1="200" y1="300" x2="200" y2="340" />
                <line x1="140" y1="200" x2="100" y2="200" />
                {/* Node markers */}
                <circle cx="200" cy="200" r="8" fill="#A30626" stroke="none" />
                <circle cx="200" cy="60" r="4" fill="#A30626" stroke="none" opacity="0.5" />
                <circle cx="60" cy="200" r="3" fill="#A30626" stroke="none" opacity="0.3" />
              </svg>

              {/* Floating time card */}
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
            <Link href="#" className="jeux3-section-link">
              Voir l'Archive
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </header>

          <div className="jeux3-games-grid">
            {GAMES.map((game) => (
              <article
                key={game.id}
                className={`jeux3-game-card ${activeGame === game.id ? 'jeux3-game-card--active' : ''}`}
                onClick={() => setActiveGame(game.id === activeGame ? null : game.id)}
                role="button"
                tabIndex={0}
                id={`game-card-${game.id}`}
                onKeyDown={(e) => e.key === 'Enter' && setActiveGame(game.id === activeGame ? null : game.id)}
              >
                {/* Artwork area */}
                <div className="jeux3-card__art">
                  <div className="jeux3-card__art-inner">
                    {game.icon}
                  </div>
                  <span className="jeux3-card__badge">{game.badge}</span>
                </div>

                {/* Content */}
                <div className="jeux3-card__body">
                  <span className="jeux3-card__category">{game.category}</span>
                  <h3 className="jeux3-card__title">{game.title}</h3>
                  <p className="jeux3-card__desc">{game.subtitle}</p>
                </div>

                {/* Footer */}
                <div className="jeux3-card__footer">
                  <span className="jeux3-card__meta">{game.meta}</span>
                  <button className="jeux3-card__play" aria-label={`Jouer à ${game.title}`}>
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
              <Link href="#" className="jeux3-text-link">
                Explorer la Bibliothèque des Cas
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
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
        {/* Decorative geometry */}
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
            <button className="jeux3-tournoi__cta" id="tournoi-inscri-btn">
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
            <form className="jeux3-newsletter__form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="jeux3-newsletter__input"
                placeholder="Votre adresse email"
                aria-label="Email pour la Mega-Grille"
              />
              <button type="submit" className="jeux3-newsletter__submit" id="newsletter-submit-btn">
                S'inscrire
              </button>
            </form>
            <p className="jeux3-newsletter__legal">Désinscription possible à tout moment. Zéro distraction.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

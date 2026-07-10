'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

// ─── Podcast data ────────────────────────────────────────────────────────────
const PODCAST_EPISODES = [
  {
    id: 'ep-42',
    title: 'Architecture of Tomorrow',
    subtitle: 'A Conversation with Zaha\'s Protégés',
    series: 'THE BRIEF',
    episode: 'ÉP. 42',
    duration: '45 MIN',
    durationSec: 2700,
    src: '',
  },
  {
    id: 'ep-41',
    title: 'L\'Art de la Diplomatie Silencieuse',
    subtitle: 'Narratives cachées des négociations globales',
    series: 'MASTERCLASS',
    episode: 'ÉP. 41',
    duration: '38 MIN',
    durationSec: 2280,
    src: '',
  },
  {
    id: 'ep-40',
    title: 'Décoder les Indices du Luxe',
    subtitle: 'Intelligence de marché pour le curateur moderne',
    series: 'INSIGHTS',
    episode: 'ÉP. 40',
    duration: '52 MIN',
    durationSec: 3120,
    src: '',
  },
  {
    id: 'ep-39',
    title: 'La Géopolitique du Beau',
    subtitle: 'Comment l\'esthétique façonne le pouvoir',
    series: 'THE BRIEF',
    episode: 'ÉP. 39',
    duration: '41 MIN',
    durationSec: 2460,
    src: '',
  },
  {
    id: 'ep-38',
    title: 'Conversations avec le Futur',
    subtitle: 'Les voix qui redéfinissent notre époque',
    series: 'MASTERCLASS',
    episode: 'ÉP. 38',
    duration: '60 MIN',
    durationSec: 3600,
    src: '',
  },
  {
    id: 'ep-37',
    title: 'Matières Premières & Civilisation',
    subtitle: 'Quand la ressource dicte l\'identité',
    series: 'INSIGHTS',
    episode: 'ÉP. 37',
    duration: '34 MIN',
    durationSec: 2040,
    src: '',
  },
];

// ─── Video archives data ──────────────────────────────────────────────────────
const VIDEO_ARCHIVES = [
  {
    id: 'vid-1',
    title: 'The Global Intelligence Summit',
    subtitle: 'Keynote from the Grand Palais — Jean Nouvel in conversation',
    label: 'ÉVÉNEMENT',
    duration: '1H 24MIN',
    featured: true,
  },
  {
    id: 'vid-2',
    title: 'Architectures du Silence',
    subtitle: 'Documentaire exclusif — 4 épisodes',
    label: 'DOCUMENTAIRE',
    duration: '4 × 52MIN',
    featured: false,
  },
  {
    id: 'vid-3',
    title: 'Le Luxe & l\'Identité',
    subtitle: 'Table ronde — Paris Fashion Week',
    label: 'TABLE RONDE',
    duration: '48MIN',
    featured: false,
  },
  {
    id: 'vid-4',
    title: 'Bâtisseurs de Demain',
    subtitle: 'Portrait de cinq visionnaires africains',
    label: 'PORTRAITS',
    duration: '1H 05MIN',
    featured: false,
  },
];

// ─── Series icons using CSS geometry ─────────────────────────────────────────
const SERIES_COLORS = {
  'THE BRIEF': '#A30626',
  'MASTERCLASS': '#1C1B1B',
  'INSIGHTS': '#5B4040',
};

export default function StudioPage() {
  const { loadTrack } = useAudioPlayer();
  const [liveActive, setLiveActive] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState(null);

  const handleLivePlay = () => {
    setLiveActive((v) => !v);
    if (!liveActive) {
      loadTrack({
        src: '',
        title: 'The Global Intelligence Summit — Keynote',
        source: 'DONA STUDIO · DIRECT',
        duration: 0,
        isLive: true,
      });
    }
  };

  const handleEpisodePlay = (ep) => {
    setActiveEpisode(ep.id);
    loadTrack({
      src: ep.src,
      title: ep.title,
      source: `${ep.series} · ${ep.episode}`,
      duration: ep.durationSec,
      isLive: false,
    });
  };

  return (
    <div className="studio3-root">

      {/* ════════════════════════════════════════════════════════
          ZONE 1 — THE DIRECT / LIVE BROADCAST
          ════════════════════════════════════════════════════════ */}
      <section className="studio3-live">
        <div className="studio3-live__inner">

          {/* Left panel — editorial text */}
          <div className="studio3-live__editorial">
            <div className="studio3-eyebrow">
              <span className="studio3-live-badge">
                <span className="studio3-live-dot" />
                DIRECT
              </span>
              <span className="studio3-eyebrow-label">DONA STUDIO</span>
            </div>

            <h1 className="studio3-live__title">
              The Global<br />
              Intelligence<br />
              <em>Summit</em>
            </h1>

            <p className="studio3-live__subtitle">
              Live depuis le Grand Palais. Interviews exclusives avec les grandes figures de l'économie et du design mondial.
            </p>

            <div className="studio3-live__meta">
              <div className="studio3-meta-item">
                <span className="studio3-meta-label">INVITÉ</span>
                <span className="studio3-meta-value">Jean Nouvel</span>
              </div>
              <div className="studio3-meta-item">
                <span className="studio3-meta-label">FORMAT</span>
                <span className="studio3-meta-value">Keynote · Q&A</span>
              </div>
              <div className="studio3-meta-item">
                <span className="studio3-meta-label">LIEU</span>
                <span className="studio3-meta-value">Grand Palais, Paris</span>
              </div>
            </div>

            <button
              className={`studio3-live__cta ${liveActive ? 'studio3-live__cta--active' : ''}`}
              onClick={handleLivePlay}
              id="studio-live-play-btn"
            >
              <span className="studio3-cta-icon">
                {liveActive ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="3" width="5" height="18" rx="1" />
                    <rect x="14" y="3" width="5" height="18" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21" />
                  </svg>
                )}
              </span>
              {liveActive ? 'EN COURS D\'ÉCOUTE' : 'ÉCOUTER LE DIRECT'}
            </button>
          </div>

          {/* Right panel — cinematic visual */}
          <div className="studio3-live__visual">
            <div className="studio3-live__frame">
              {/* Geometric DONA emblem */}
              <svg className="studio3-live__emblem" viewBox="0 0 200 200" fill="none" stroke="#A30626" strokeWidth="1">
                <circle cx="100" cy="100" r="90" />
                <polygon points="100,10 190,100 100,190 10,100" />
                <polygon points="100,10 190,100 100,190 10,100" transform="rotate(45 100 100)" />
                <circle cx="100" cy="55" r="45" />
                <circle cx="100" cy="145" r="45" />
                <circle cx="55" cy="100" r="45" />
                <circle cx="145" cy="100" r="45" />
                <circle cx="100" cy="100" r="30" />
              </svg>
              <div className="studio3-live__overlay-badge">
                <span className="studio3-live-dot studio3-live-dot--lg" />
                <span>BROADCASTING LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ZONE 2 — THE PODCASTS GRID
          ════════════════════════════════════════════════════════ */}
      <section className="studio3-podcasts">
        <div className="studio3-container">

          <header className="studio3-section-header">
            <div>
              <p className="studio3-section-kicker">ARCHIVES AUDIO</p>
              <h2 className="studio3-section-title">Les Séries Éditoriales</h2>
            </div>
            <Link href="/ecouter" className="studio3-section-link">
              Toutes les séries
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </header>

          {/* Featured episode (large) + side list */}
          <div className="studio3-podcasts__grid">

            {/* Featured */}
            <div
              className={`studio3-podcast-feature ${activeEpisode === PODCAST_EPISODES[0].id ? 'studio3-podcast--active' : ''}`}
              onClick={() => handleEpisodePlay(PODCAST_EPISODES[0])}
              role="button"
              tabIndex={0}
              aria-label={`Écouter : ${PODCAST_EPISODES[0].title}`}
              onKeyDown={(e) => e.key === 'Enter' && handleEpisodePlay(PODCAST_EPISODES[0])}
            >
              <div className="studio3-feature__artwork">
                <div className="studio3-feature__art-bg">
                  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.15">
                    <circle cx="60" cy="60" r="50" />
                    <circle cx="60" cy="60" r="35" />
                    <circle cx="60" cy="60" r="20" />
                    <line x1="10" y1="60" x2="110" y2="60" />
                    <line x1="60" y1="10" x2="60" y2="110" />
                  </svg>
                </div>
                <div className="studio3-feature__play-ring">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21" />
                  </svg>
                </div>
              </div>
              <div className="studio3-feature__info">
                <div className="studio3-feature__tags">
                  <span className="studio3-series-badge" style={{ background: SERIES_COLORS[PODCAST_EPISODES[0].series] }}>
                    {PODCAST_EPISODES[0].series}
                  </span>
                  <span className="studio3-ep-label">{PODCAST_EPISODES[0].episode} · {PODCAST_EPISODES[0].duration}</span>
                </div>
                <h3 className="studio3-feature__title">{PODCAST_EPISODES[0].title}</h3>
                <p className="studio3-feature__desc">{PODCAST_EPISODES[0].subtitle}</p>
              </div>
            </div>

            {/* Side list — remaining 5 episodes */}
            <div className="studio3-podcasts__list">
              {PODCAST_EPISODES.slice(1).map((ep) => (
                <div
                  key={ep.id}
                  className={`studio3-podcast-row ${activeEpisode === ep.id ? 'studio3-podcast--active' : ''}`}
                  onClick={() => handleEpisodePlay(ep)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Écouter : ${ep.title}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleEpisodePlay(ep)}
                >
                  <div className="studio3-row__play">
                    {activeEpisode === ep.id ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="5" y="3" width="5" height="18" rx="1" />
                        <rect x="14" y="3" width="5" height="18" rx="1" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21" />
                      </svg>
                    )}
                  </div>
                  <div className="studio3-row__info">
                    <div className="studio3-row__tags">
                      <span
                        className="studio3-series-badge studio3-series-badge--sm"
                        style={{ background: SERIES_COLORS[ep.series] || '#1C1B1B' }}
                      >
                        {ep.series}
                      </span>
                      <span className="studio3-ep-label">{ep.episode}</span>
                    </div>
                    <span className="studio3-row__title">{ep.title}</span>
                  </div>
                  <span className="studio3-row__duration">{ep.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ZONE 3 — VIDEO ARCHIVES
          ════════════════════════════════════════════════════════ */}
      <section className="studio3-videos">
        <div className="studio3-container">

          <header className="studio3-section-header">
            <div>
              <p className="studio3-section-kicker">ARCHIVES VIDÉO</p>
              <h2 className="studio3-section-title">Documentaires & Événements</h2>
            </div>
            <Link href="#" className="studio3-section-link">
              Toutes les vidéos
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </header>

          <div className="studio3-videos__grid">
            {VIDEO_ARCHIVES.map((vid) => (
              <div
                key={vid.id}
                className={`studio3-video-card ${vid.featured ? 'studio3-video-card--featured' : ''}`}
              >
                {/* Thumbnail area */}
                <div className="studio3-video-card__thumb">
                  <div className="studio3-video-card__art">
                    <svg viewBox="0 0 160 90" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.12">
                      <rect x="5" y="5" width="150" height="80" rx="2" />
                      <line x1="5" y1="45" x2="155" y2="45" />
                      <line x1="80" y1="5" x2="80" y2="85" />
                      <ellipse cx="80" cy="45" rx="30" ry="20" />
                    </svg>
                    <div className="studio3-video-card__play-btn" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21" />
                      </svg>
                    </div>
                    {vid.featured && (
                      <div className="studio3-video-card__featured-label">À LA UNE</div>
                    )}
                  </div>
                  <div className="studio3-video-card__duration">{vid.duration}</div>
                </div>

                {/* Info */}
                <div className="studio3-video-card__info">
                  <span className="studio3-video-label">{vid.label}</span>
                  <h3 className="studio3-video-card__title">{vid.title}</h3>
                  <p className="studio3-video-card__sub">{vid.subtitle}</p>
                  <button className="studio3-video-card__cta">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21" />
                    </svg>
                    Visionner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

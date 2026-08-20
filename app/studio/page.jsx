'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// ─── Category filter tabs ────────────────────────────────────────────────────
const CATEGORIES = ['Tout', 'Économie', 'Culture', 'Masterclass', 'Événement', 'Documentaire'];

// ─── Utility: format a date ──────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── VideoCard component ─────────────────────────────────────────────────────
function VideoCard({ video, featured = false, onPlay }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current && video.videoUrl) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={`vh-card ${featured ? 'vh-card--featured' : ''} ${video.isLocked ? 'vh-card--locked' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => !video.isLocked && onPlay && onPlay(video)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && !video.isLocked && onPlay && onPlay(video)}
      aria-label={video.isLocked ? `Contenu VIP : ${video.title}` : `Regarder : ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="vh-card__thumb">
        {/* Cinematic SVG placeholder */}
        <div className="vh-card__art">
          <svg viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            <rect width="400" height="225" fill="#0D0D0D" />
            <rect x="0" y="0" width="400" height="225" fill="url(#cardGrad)" opacity="0.6" />
            <line x1="0" y1="112" x2="400" y2="112" stroke="#A30626" strokeWidth="0.5" opacity="0.3" />
            <line x1="200" y1="0" x2="200" y2="225" stroke="#A30626" strokeWidth="0.5" opacity="0.3" />
            <circle cx="200" cy="112" r="60" stroke="#A30626" strokeWidth="0.4" opacity="0.25" />
            <circle cx="200" cy="112" r="30" stroke="#A30626" strokeWidth="0.4" opacity="0.2" />
            <polygon points="185,99 185,126 215,112" fill="#A30626" opacity="0.5" />
            <defs>
              <linearGradient id="cardGrad" x1="0" y1="0" x2="400" y2="225" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C1B1B" />
                <stop offset="1" stopColor="#0D0D0D" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Video element for hover preview */}
        {video.videoUrl && !video.isLocked && (
          <video
            ref={videoRef}
            src={video.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            className="vh-card__video-preview"
          />
        )}

        {/* Badges */}
        <div className="vh-card__badges">
          {video.isHD && <span className="vh-badge vh-badge--hd">HD</span>}
          {video.isVipOnly && <span className="vh-badge vh-badge--vip">👑 VIP</span>}
          {video.isFeatured && <span className="vh-badge vh-badge--featured">À LA UNE</span>}
        </div>

        {/* Duration */}
        {video.duration && (
          <div className="vh-card__duration">{video.duration}</div>
        )}

        {/* Lock overlay for VIP */}
        {video.isLocked && (
          <div className="vh-card__lock">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        )}

        {/* Play button */}
        {!video.isLocked && (
          <div className="vh-card__play" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="vh-card__info">
        <span className="vh-card__label">{video.label || video.category}</span>
        <h3 className="vh-card__title">{video.title}</h3>
        {video.subtitle && <p className="vh-card__sub">{video.subtitle}</p>}
        <div className="vh-card__meta">
          {video.publishedAt && <span>{formatDate(video.publishedAt)}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── EPG Row component ───────────────────────────────────────────────────────
function EpgRow({ item, index }) {
  const now = new Date();
  const scheduled = new Date(item.scheduledAt);
  const isPast = scheduled < now;

  return (
    <div className={`vh-epg__row ${isPast ? 'vh-epg__row--past' : ''}`}>
      <div className="vh-epg__time">
        {scheduled.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="vh-epg__content">
        <span className={`vh-epg__type ${item.type === 'replay' ? 'vh-epg__type--replay' : 'vh-epg__type--live'}`}>
          {item.type === 'replay' ? 'REPLAY' : '● DIRECT'}
        </span>
        <span className="vh-epg__title">{item.title}</span>
      </div>
      <div className="vh-epg__duration">{item.duration}</div>
    </div>
  );
}

// ─── VIP Paywall Gate ────────────────────────────────────────────────────────
function VipGate({ isLive }) {
  return (
    <div className="vh-vip-gate">
      <div className="vh-vip-gate__inner">
        <div className="vh-vip-gate__crown">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M2 20h20M4 20l2-8 6 4 6-4 2 8" />
            <circle cx="4" cy="11" r="1.5" fill="currentColor" />
            <circle cx="12" cy="8" r="1.5" fill="currentColor" />
            <circle cx="20" cy="11" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <h3 className="vh-vip-gate__title">Contenu Réservé aux Membres VIP</h3>
        <p className="vh-vip-gate__text">
          {isLive
            ? 'La diffusion en direct de DONA TV est exclusivement accessible aux abonnés Club & Élite.'
            : 'Ce contenu est réservé à nos membres VIP. Rejoignez le Club DONA pour un accès illimité.'}
        </p>
        <Link href="/abonnement" className="vh-vip-gate__cta" id="studio-vip-upgrade-btn">
          Rejoindre le Club DONA
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <p className="vh-vip-gate__note">Déjà membre ? <Link href="/login" style={{ color: '#B08D57', textDecoration: 'underline' }}>Connectez-vous</Link></p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function StudioPage() {
  const [hubData, setHubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [playerVideo, setPlayerVideo] = useState(null);
  const playerRef = useRef(null);

  // userIsVip is determined server-side in /api/videos and returned in the payload
  const userIsVip = hubData?.userIsVip || false;

  const fetchHub = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (data.success) setHubData(data);
    } catch (e) {
      console.error('Failed to fetch hub data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHub();
  }, [fetchHub]);

  const handlePlay = (video) => {
    if (video.isLocked) return;
    setPlayerVideo(video);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      playerRef.current?.querySelector('video')?.play().catch(() => {});
    }, 100);
  };

  const handleClosePlayer = () => setPlayerVideo(null);

  const videos = hubData?.videos || [];
  const liveTv = hubData?.liveTv || {};

  const featuredVideo = videos.find(v => v.isFeatured) || videos[0];
  const latestVideos = videos.filter(v => !v.isFeatured).slice(0, 8);
  const replayVideos = videos.filter(v => v.isReplay);

  const filteredByCategory = activeCategory === 'Tout'
    ? videos.filter(v => !v.isFeatured)
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="vh-root">

      {/* ═══════════════════════════════════════════════════════════
          ZONE 1 — TV EN DIRECT
          ═══════════════════════════════════════════════════════════ */}
      <section className="vh-live" id="tv-direct">
        <div className="vh-live__inner">

          {/* Left — Editorial Info */}
          <div className="vh-live__editorial">
            <div className="vh-live__eyebrow">
              <span className={`vh-live-badge ${liveTv.isLive ? 'vh-live-badge--on' : 'vh-live-badge--off'}`}>
                {liveTv.isLive && <span className="vh-live-dot" />}
                {liveTv.isLive ? 'DIRECT' : 'HORS ANTENNE'}
              </span>
              <span className="vh-live__channel">DONA TV</span>
            </div>

            <h1 className="vh-live__title">
              {liveTv.currentTitle || 'DONA TV'}<br />
              <em>Studio</em>
            </h1>

            {liveTv.currentSubtitle && (
              <p className="vh-live__subtitle">{liveTv.currentSubtitle}</p>
            )}

            <div className="vh-live__meta">
              {liveTv.currentGuest && (
                <div className="vh-meta-item">
                  <span className="vh-meta-label">INVITÉ</span>
                  <span className="vh-meta-value">{liveTv.currentGuest}</span>
                </div>
              )}
              {liveTv.format && (
                <div className="vh-meta-item">
                  <span className="vh-meta-label">FORMAT</span>
                  <span className="vh-meta-value">{liveTv.format}</span>
                </div>
              )}
              {liveTv.location && (
                <div className="vh-meta-item">
                  <span className="vh-meta-label">LIEU</span>
                  <span className="vh-meta-value">{liveTv.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — Player or VIP Gate */}
          <div className="vh-live__player-zone">
            {userIsVip || !liveTv.isLive ? (
              <div className="vh-player-frame">
                {liveTv.isLive && liveTv.hlsUrl ? (
                  <video
                    className="vh-player-video"
                    src={liveTv.hlsUrl}
                    controls
                    autoPlay
                    playsInline
                    poster=""
                  />
                ) : (
                  /* Cinematic placeholder when offline */
                  <div className="vh-player-placeholder">
                    <svg className="vh-player-emblem" viewBox="0 0 200 200" fill="none" stroke="#A30626" strokeWidth="0.8">
                      <circle cx="100" cy="100" r="90" />
                      <polygon points="100,10 190,100 100,190 10,100" />
                      <polygon points="100,10 190,100 100,190 10,100" transform="rotate(45 100 100)" />
                      <circle cx="100" cy="100" r="40" />
                      <circle cx="100" cy="100" r="20" />
                    </svg>
                    <div className="vh-player-status">
                      <span className="vh-player-status-text">
                        {liveTv.isLive ? 'CONNEXION AU FLUX LIVE…' : 'PROCHAINEMENT EN DIRECT'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <VipGate isLive />
            )}
          </div>
        </div>

        {/* EPG — Programme schedule */}
        {liveTv.epg && liveTv.epg.length > 0 && (
          <div className="vh-epg">
            <div className="vh-container">
              <h2 className="vh-epg__heading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                À SUIVRE — GRILLE DES PROGRAMMES
              </h2>
              <div className="vh-epg__list">
                {liveTv.epg.map((item, idx) => (
                  <EpgRow key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INLINE VIDEO PLAYER (when user clicks a video)
          ═══════════════════════════════════════════════════════════ */}
      {playerVideo && (
        <div className="vh-inline-player" ref={playerRef}>
          <div className="vh-container">
            <div className="vh-inline-player__header">
              <div>
                <span className="vh-card__label">{playerVideo.label}</span>
                <h2 className="vh-inline-player__title">{playerVideo.title}</h2>
              </div>
              <button className="vh-inline-player__close" onClick={handleClosePlayer} aria-label="Fermer le lecteur">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="vh-inline-player__wrapper">
              {playerVideo.videoUrl ? (
                <video
                  className="vh-player-video"
                  src={playerVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="vh-player-placeholder" style={{ minHeight: '360px' }}>
                  <p style={{ color: '#888', fontSize: '14px' }}>Flux vidéo à configurer dans l'administration</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ZONE 2 — À LA UNE (FEATURED)
          ═══════════════════════════════════════════════════════════ */}
      {!loading && featuredVideo && (
        <section className="vh-featured">
          <div className="vh-container">
            <div className="vh-section-header">
              <div>
                <p className="vh-section-kicker">À LA UNE</p>
                <h2 className="vh-section-title">Sélection Éditoriale</h2>
              </div>
            </div>
            <VideoCard video={featuredVideo} featured onPlay={handlePlay} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ZONE 3 — DERNIÈRES SORTIES
          ═══════════════════════════════════════════════════════════ */}
      <section className="vh-latest">
        <div className="vh-container">
          <div className="vh-section-header">
            <div>
              <p className="vh-section-kicker">ARCHIVES VIDÉO</p>
              <h2 className="vh-section-title">Dernières Sorties</h2>
            </div>
          </div>

          {loading ? (
            <div className="vh-skeleton-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="vh-skeleton-card">
                  <div className="vh-skeleton-thumb" />
                  <div className="vh-skeleton-line vh-skeleton-line--title" />
                  <div className="vh-skeleton-line" />
                </div>
              ))}
            </div>
          ) : (
            <div className="vh-grid">
              {latestVideos.map(video => (
                <VideoCard key={video.id} video={video} onPlay={handlePlay} />
              ))}
              {latestVideos.length === 0 && (
                <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
                  Aucune vidéo disponible pour le moment.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ZONE 4 — PAR RUBRIQUES & CATÉGORIES
          ═══════════════════════════════════════════════════════════ */}
      <section className="vh-categories">
        <div className="vh-container">
          <div className="vh-section-header">
            <div>
              <p className="vh-section-kicker">EXPLORER</p>
              <h2 className="vh-section-title">Par Rubriques & Magazines</h2>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="vh-filter-tabs" role="tablist" aria-label="Filtrer par catégorie">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`vh-filter-tab ${activeCategory === cat ? 'vh-filter-tab--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                id={`studio-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Horizontal carousel */}
          <div className="vh-carousel">
            {filteredByCategory.map(video => (
              <div key={video.id} className="vh-carousel__item">
                <VideoCard video={video} onPlay={handlePlay} />
              </div>
            ))}
            {filteredByCategory.length === 0 && (
              <p style={{ color: '#888', padding: '30px 0' }}>
                Aucun contenu dans cette catégorie pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ZONE 5 — REPLAYS DES DIRECTS
          ═══════════════════════════════════════════════════════════ */}
      {replayVideos.length > 0 && (
        <section className="vh-replays">
          <div className="vh-container">
            <div className="vh-section-header">
              <div>
                <p className="vh-section-kicker">ARCHIVES LIVE</p>
                <h2 className="vh-section-title">Replays des Directs</h2>
              </div>
              <p className="vh-section-note">
                Revivez nos émissions passées en replay. Certains contenus sont réservés aux membres.
              </p>
            </div>

            <div className="vh-grid vh-grid--compact">
              {replayVideos.map(video => (
                <div key={video.id} className="vh-replay-card">
                  {video.isLocked ? (
                    <div className="vh-replay-card__locked">
                      <VipGate />
                    </div>
                  ) : (
                    <VideoCard video={video} onPlay={handlePlay} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

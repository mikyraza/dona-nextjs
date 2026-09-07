"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useUserSubscription } from '@/hooks/useUserSubscription';

const LIVE_VIDEO_FALLBACK = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export default function StudioClient({
  magazineSlug,
  magazineTitle,
  primaryColor = "#a31835",
  initialVideos = [],
  initialTvLive = null
}) {
  const userSub = useUserSubscription();
  const userIsVip = userSub.isVip;
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [liveTvData, setLiveTvData] = useState(initialTvLive);
  const [videos, setVideos] = useState(initialVideos);
  const [activeVideo, setActiveVideo] = useState(null);

  const videoRef = useRef(null);
  const activeVideoRef = useRef(null);
  const { loadTrack } = useAudioPlayer();

  useEffect(() => {
    let isMounted = true;
    async function refreshVideos() {
      try {
        const res = await fetch(`/api/videos?magazine=${encodeURIComponent(magazineSlug)}`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.videos)) {
          setVideos(data.videos);
        }
      } catch (e) {
        console.error('Failed to refresh magazine videos:', e);
      }
    }
    if (magazineSlug) {
      refreshVideos();
    }
    return () => { isMounted = false; };
  }, [magazineSlug]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {
        videoRef.current.src = LIVE_VIDEO_FALLBACK;
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => setVideoError(true));
      });
    }
  };

  const handleVideoError = () => {
    if (videoRef.current && videoRef.current.src !== LIVE_VIDEO_FALLBACK) {
      videoRef.current.src = LIVE_VIDEO_FALLBACK;
      videoRef.current.load();
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => setVideoError(true));
    } else {
      setVideoError(true);
    }
  };

  const handlePodcastClick = (title, src) => {
    loadTrack({
      src: src,
      title: title,
      source: `${magazineTitle.toUpperCase()} STUDIO`,
      duration: 1200
    });
  };

  const handleSelectVideo = (vid) => {
    setActiveVideo(vid);
    if (activeVideoRef.current) {
      activeVideoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "85vh", padding: "60px 0" }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "32px", marginBottom: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <span style={{ fontFamily: "var(--font-primary)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", color: primaryColor, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              STUDIO MULTIMÉDIA EXCLUSIF
            </span>
            <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "36px", fontWeight: "700", color: "var(--color-text)", margin: 0, textTransform: "uppercase" }}>
              {`${magazineTitle} Studio`}
            </h1>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", background: "#A30626", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
            <span style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", color: "#A30626", letterSpacing: "0.05em" }}>LIVE BROADCASTING</span>
          </div>
        </div>

        {/* Live Broadcast Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", marginBottom: "64px" }}>
          {/* Main Stream Player */}
          <div style={{ flex: 2 }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000000", borderRadius: "2px", overflow: "hidden", border: "1px solid var(--color-border)" }}>
              {!videoError ? (
                <>
                  <video
                    ref={videoRef}
                    src={liveTvData?.hlsUrl || LIVE_VIDEO_FALLBACK}
                    muted
                    loop
                    playsInline
                    onError={handleVideoError}
                    onClick={handlePlayVideo}
                    style={{ width: "100%", height: "100%", objectFit: "cover", cursor: !isVideoPlaying ? "pointer" : "default" }}
                  />

                  {!isVideoPlaying && (
                    <div 
                      onClick={handlePlayVideo}
                      style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", cursor: "pointer" }}
                    >
                      <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(163, 6, 38, 0.9)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s ease" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#FFFFFF" }}>play_arrow</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "rgba(255,255,255,0.5)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "48px" }}>videocam_off</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase" }}>Signal indisponible</span>
                </div>
              )}
              
              <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", padding: "8px 16px", borderRadius: "2px", display: "flex", alignItems: "center", gap: "12px", color: "#FFFFFF" }}>
                <span style={{ width: "6px", height: "6px", background: "#A30626", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></span>
                <span style={{ fontSize: "11px", fontWeight: "600", fontFamily: "var(--font-primary)", letterSpacing: "0.05em" }}>
                  {liveTvData?.isLive ? 'DIRECT • 1 240 SPECTATEURS' : 'HORS ANTENNE • REPLAY'}
                </span>
              </div>
            </div>
            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "600", color: "var(--color-text)", marginTop: "24px", marginBottom: "8px" }}>
              {liveTvData?.currentTitle || 'Le Brief en Direct : Décryptage avec nos analystes'}
            </h3>
            <p style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6" }}>
              {liveTvData?.currentSubtitle || 'Suivez notre point géopolitique et économique quotidien en direct du studio DONA. Posez vos questions dans le chat réservé aux membres premium.'}
            </p>
          </div>

          {/* Podcasts Playlist */}
          <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "32px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "600", color: "var(--color-text)", marginBottom: "24px" }}>
              Podcasts & Audios
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", flexGrow: 1 }}>
              <div 
                onClick={() => handlePodcastClick('La Trajectoire Systémique', '/assets/core/media/podcast-01.wav')}
                style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--color-border)", cursor: "pointer" }}
              >
                <div style={{ width: "40px", height: "40px", background: "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "2px" }}>
                  <span className="material-symbols-outlined">play_arrow</span>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>#01 • La Trajectoire Systémique</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>18 minutes • Récit audio</div>
                </div>
              </div>

              <div 
                onClick={() => handlePodcastClick('Économie et Souveraineté', '/assets/core/media/podcast-02.wav')}
                style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--color-border)", cursor: "pointer" }}
              >
                <div style={{ width: "40px", height: "40px", background: "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "2px" }}>
                  <span className="material-symbols-outlined">play_arrow</span>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>#02 • Économie et Souveraineté</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>24 minutes • Entretien exclusif</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", background: userIsVip ? "rgba(163,6,38,0.08)" : "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: userIsVip ? primaryColor : "var(--color-text-muted)", borderRadius: "2px", cursor: userIsVip ? "pointer" : "not-allowed" }}>
                  <span className="material-symbols-outlined">{userIsVip ? "play_arrow" : "lock"}</span>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: userIsVip ? "var(--color-text)" : "var(--color-text-muted)" }}>#03 • Risques et Opportunités Futures</div>
                  <div style={{ fontSize: "11px", color: userIsVip ? primaryColor : "var(--color-text-muted)", marginTop: "4px" }}>
                    {userIsVip ? "✓ Débloqué (Privilège VIP)" : "🔒 Réservé VIP"}
                  </div>
                </div>
              </div>
            </div>

            <Link href={`/magazines/${magazineSlug}/vip`} style={{ width: "100%", background: primaryColor, color: "#FFFFFF", textDecoration: "none", textAlign: "center", padding: "14px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "32px", display: "block" }}>
              {userIsVip ? "Accéder aux dossiers VIP" : "Débloquer tout le studio"}
            </Link>
          </div>
        </div>

        {/* Inline Active Video Player Section */}
        {activeVideo && (
          <div ref={activeVideoRef} style={{ marginBottom: "64px", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", gap: "16px" }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", color: primaryColor, textTransform: "uppercase" }}>
                  LECTEUR STUDIO • {activeVideo.category || 'EXCLUSIF'}
                </span>
                <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "600", color: "var(--color-text)", margin: "4px 0" }}>
                  {activeVideo.title}
                </h3>
                {activeVideo.subtitle && (
                  <p style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: 0 }}>
                    {activeVideo.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  color: "var(--color-text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                Fermer
              </button>
            </div>

            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000000", borderRadius: "2px", overflow: "hidden" }}>
              {(activeVideo.videoUrl || userIsVip) ? (
                <video
                  src={activeVideo.videoUrl || LIVE_VIDEO_FALLBACK}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", color: "#FFFFFF", padding: "20px", textAlign: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "48px", color: primaryColor }}>lock</span>
                  <p style={{ fontSize: "16px", fontWeight: "600", maxWidth: "420px", margin: 0 }}>
                    Contenu réservé aux abonnés VIP du Studio DONA.
                  </p>
                  <Link
                    href={`/magazines/${magazineSlug}/vip`}
                    style={{
                      background: primaryColor,
                      color: "#FFFFFF",
                      padding: "10px 20px",
                      borderRadius: "2px",
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      textDecoration: "none"
                    }}
                  >
                    Activer l'Accès VIP
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dedicated Magazine Video Productions Section */}
        <section style={{ borderTop: "1px solid var(--color-border)", paddingTop: "48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
            <div>
              <span style={{ fontFamily: "var(--font-primary)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", color: primaryColor, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                ARCHIVES & PRODUCTIONS
              </span>
              <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", margin: 0 }}>
                {`Vidéos & Entretiens — ${magazineTitle}`}
              </h2>
              <p style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", marginTop: "6px", marginBottom: 0 }}>
                Reportages exclusifs, masterclasses et tables rondes de la rédaction.
              </p>
            </div>

            {videos.length > 0 && (
              <Link
                href="/studio"
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: primaryColor,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                Toutes les vidéos du Studio →
              </Link>
            )}
          </div>

          {videos.length > 0 ? (
            /* Video Grid State (when videos are associated with magazine) */
            <div className="mag-studio-video-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {videos.map(video => (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  style={{
                    cursor: "pointer",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    overflow: "hidden",
                    background: "var(--color-bg)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000000", overflow: "hidden" }}>
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} width="640" height="360" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-alt)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "var(--color-text-muted)" }}>movie</span>
                      </div>
                    )}
                    <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px", zIndex: 2 }}>
                      {video.isVipOnly && (
                        <span style={{ background: "#D4AF37", color: "#000000", fontSize: "9px", fontWeight: "700", padding: "3px 6px", borderRadius: "2px", letterSpacing: "0.05em" }}>
                          👑 VIP
                        </span>
                      )}
                      {video.category && (
                        <span style={{ background: primaryColor, color: "#FFFFFF", fontSize: "9px", fontWeight: "700", padding: "3px 6px", borderRadius: "2px", letterSpacing: "0.05em" }}>
                          {video.category.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {video.duration && (
                      <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.8)", color: "#FFFFFF", fontSize: "11px", fontWeight: "600", padding: "2px 6px", borderRadius: "2px" }}>
                        {video.duration}
                      </div>
                    )}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(163, 6, 38, 0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#FFFFFF" }}>play_arrow</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "16px", fontWeight: "600", color: "var(--color-text)", margin: "0 0 8px 0", lineHeight: "1.4" }}>
                      {video.title}
                    </h3>
                    {video.subtitle && (
                      <p style={{ fontFamily: "var(--font-primary)", fontSize: "13px", color: "var(--color-text-muted)", margin: 0, lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {video.subtitle}
                      </p>
                    )}
                    <div style={{ marginTop: "auto", paddingTop: "12px", fontSize: "11px", fontWeight: "600", color: primaryColor, display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>Visionner</span>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State Container when no video is associated with the magazine */
            <div
              className="mag-studio-empty-state"
              style={{
                textAlign: "center",
                padding: "56px 24px",
                background: "var(--color-bg-alt)",
                borderRadius: "4px",
                border: "1px solid var(--color-border)",
                maxWidth: "680px",
                margin: "0 auto"
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  color: primaryColor
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                  videocam_off
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "var(--color-text)",
                  marginBottom: "12px"
                }}
              >
                Aucune vidéo associée à ce magazine
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "14px",
                  color: "var(--color-text-muted)",
                  lineHeight: "1.6",
                  maxWidth: "520px",
                  margin: "0 auto 28px auto"
                }}
              >
                Les productions audiovisuelles, reportages de terrain et entretiens exclusifs pour « {magazineTitle} » sont actuellement en cours de montage par nos équipes de réalisation.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap"
                }}
              >
                <Link
                  href="/studio"
                  style={{
                    background: primaryColor,
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    borderRadius: "2px",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "opacity 0.2s"
                  }}
                >
                  Découvrir tout le Studio DONA →
                </Link>

                <Link
                  href={`/magazines/${magazineSlug}`}
                  style={{
                    background: "transparent",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                    padding: "12px 24px",
                    borderRadius: "2px",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "all 0.2s"
                  }}
                >
                  Consulter les articles du magazine
                </Link>
              </div>
            </div>
          )}
        </section>

      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}

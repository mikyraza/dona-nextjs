"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

// Free public domain video for TV direct simulation
const LIVE_VIDEO_SRC = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
// Fallback MP4 if HLS not supported
const LIVE_VIDEO_FALLBACK = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export default function StudioPage({ params }) {
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [liveTvData, setLiveTvData] = useState(null);
  const videoRef = useRef(null);
  const { loadTrack } = useAudioPlayer();

  const resolvedParams = React.use(params);
  const { magazineSlug } = resolvedParams;

  const primaryColor = "#a31835";
  const magazineTitle = magazineSlug ? magazineSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Magazine';

  useEffect(() => {
    async function fetchLiveTv() {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (data.success && data.liveTv) {
          setLiveTvData(data.liveTv);
        }
      } catch (e) {
        console.error('Failed to fetch live TV data:', e);
      }
    }
    fetchLiveTv();
  }, []);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {
        // Try fallback
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
              {magazineTitle} Studio
            </h1>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", background: "#A30626", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
            <span style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", color: "#A30626", letterSpacing: "0.05em" }}>LIVE BROADCASTING</span>
          </div>
        </div>

        {/* Live Broadcast Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", marginBottom: "64px" }}>
          {/* Main Stream Player (N°21 — Real Video) */}
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

                  {/* Play overlay if not yet started */}
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
                /* Fallback placeholder if video cannot load at all */
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "rgba(255,255,255,0.5)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "48px" }}>videocam_off</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase" }}>Signal indisponible</span>
                </div>
              )}
              
              {/* DIRECT overlay badge */}
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
                <div style={{ width: "40px", height: "40px", background: "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", borderRadius: "2px", cursor: "not-allowed" }}>
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-muted)" }}>#03 • Risques et Opportunités Futures</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>🔒 Réservé VIP</div>
                </div>
              </div>
            </div>

            <Link href={`/magazines/${magazineSlug}/vip`} style={{ width: "100%", background: primaryColor, color: "#FFFFFF", textDecoration: "none", textAlign: "center", padding: "14px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "32px", display: "block" }}>
              Débloquer tout le studio
            </Link>
          </div>
        </div>

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

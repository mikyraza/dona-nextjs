import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { magazines } from '../../data';

export default async function StudioPage({ params }) {
  const resolvedParams = await params;
  const { magazineSlug } = resolvedParams;

  const magazine = magazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  if (!magazine) {
    notFound();
  }

  const primaryColor = magazine.themePrimary || "#a31835";

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
              {magazine.title} Studio
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
              {/* Mock Video Stream Background */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "rgba(255,255,255,0.4)" }}>play_circle</span>
              </div>
              
              <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", padding: "8px 16px", borderRadius: "2px", display: "flex", alignItems: "center", gap: "12px", color: "#FFFFFF" }}>
                <span style={{ width: "6px", height: "6px", background: "#A30626", borderRadius: "50%" }}></span>
                <span style={{ fontSize: "11px", fontWeight: "600", fontFamily: "var(--font-primary)", letterSpacing: "0.05em" }}>DIRECT • 1 240 SPECTATEURS</span>
              </div>
            </div>
            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "600", color: "var(--color-text)", marginTop: "24px", marginBottom: "8px" }}>
              Le Brief en Direct : Décryptage avec nos analystes
            </h3>
            <p style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6" }}>
              Suivez notre point géopolitique et économique quotidien en direct du studio DONA. Posez vos questions dans le chat réservé aux membres premium.
            </p>
          </div>

          {/* Podcasts Playlist */}
          <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "32px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "600", color: "var(--color-text)", marginBottom: "24px" }}>
              Podcasts & Audios
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", flexGrow: 1 }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ width: "40px", height: "40px", background: "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "2px", cursor: "pointer" }}>
                  <span className="material-symbols-outlined">play_arrow</span>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>#01 • La Trajectoire Systémique</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>18 minutes • Récit audio</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ width: "40px", height: "40px", background: "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "2px", cursor: "pointer" }}>
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

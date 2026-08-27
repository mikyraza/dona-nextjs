"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveUserSubscription, canAccessAudioAndReplay } from '@/lib/subscriptionPermissions';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export default function Page() {
  const [userSub, setUserSub] = useState({ plan: 'Essentiel', status: 'Active', isGuest: true });
  const [paywallModal, setPaywallModal] = useState({ isOpen: false, title: '', message: '' });
  const { loadTrack } = useAudioPlayer();

  const syncUserSub = () => {
    setUserSub(getActiveUserSubscription());
  };

  useEffect(() => {
    syncUserSub();
    window.addEventListener('dona_subscription_changed', syncUserSub);
    window.addEventListener('storage', syncUserSub);
    return () => {
      window.removeEventListener('dona_subscription_changed', syncUserSub);
      window.removeEventListener('storage', syncUserSub);
    };
  }, []);

  const handleAudioClick = (e, title = 'Contenu Audio') => {
    const access = canAccessAudioAndReplay(userSub.plan, userSub.status);
    if (!access.allowed) {
      if (e) e.preventDefault();
      setPaywallModal({
        isOpen: true,
        title: title,
        message: access.message || 'L\'accès aux podcasts, audios et replays est réservé aux abonnés Premium et Élite.'
      });
    } else {
      loadTrack({
        title: title,
        source: 'DONA STUDIO AUDIO',
        duration: 2520
      });
    }
  };

  return (
    <main>
      {/* HERO SECTION (À LA UNE) */}
      <section className="ecouter-hero">
        <div className="ecouter-hero-inner">
          <div className="hero-image-wrapper">
            <img src="/assets/core/img/ecouter-hero.png" alt="Portrait" className="hero-img" />
          </div>
          <div className="hero-content">
            <div className="kicker">— À LA UNE</div>
            <h1 className="hero-title">The Brief: L'État<br />de l'Art</h1>
            <div className="hero-meta">
              <span className="material-symbols-outlined">schedule</span> 42 MIN
              <span className="meta-divider"></span> EPISODE 142
              <span className="meta-divider"></span> ART & PHILOSOPHIE
            </div>
            <div className="audio-visualization">
              <div className="bar bar-1"></div><div className="bar bar-2"></div><div className="bar bar-3"></div><div className="bar bar-4"></div><div className="bar bar-5"></div><div className="bar bar-6"></div><div className="bar bar-7"></div><div className="bar bar-8"></div><div className="bar bar-9"></div><div className="bar bar-10"></div>
            </div>
            <button 
              type="button"
              onClick={(e) => handleAudioClick(e, 'The Brief: L\'État de l\'Art')} 
              className="btn-primary" 
              style={{ border: 'none', cursor: 'pointer' }}
            >
              ÉCOUTER MAINTENANT
            </button>
          </div>
        </div>
      </section>

      {/* CHRONIQUES & ANALYSES */}
      <section className="ecouter-chroniques">
        <div className="section-header">
          <div className="header-text">
            <h2 className="section-title">Chroniques & Analyses</h2>
            <p className="section-desc">Des réflexions hebdomadaires sur la culture, la mode et les enjeux sociétaux par nos rédacteurs.</p>
          </div>
        </div>
        <div className="chroniques-grid">
          <article className="podcast-card" onClick={(e) => handleAudioClick(e, 'La Revue de Mode')} style={{ cursor: 'pointer' }}>
            <div className="card-img-wrapper"><img src="/assets/core/img/ecouter-1.png" alt="Revue" className="card-img" /></div>
            <h3 className="card-title">La Revue de Mode</h3>
            <div className="card-meta">15 FÉVRIER — 24 MIN</div>
          </article>
          <article className="podcast-card" onClick={(e) => handleAudioClick(e, 'Architecture Invisible')} style={{ cursor: 'pointer' }}>
            <div className="card-img-wrapper"><img src="/assets/core/img/ecouter-2.png" alt="Architecture" className="card-img" /></div>
            <h3 className="card-title">Architecture Invisible</h3>
            <div className="card-meta">12 FÉVRIER — 31 MIN</div>
          </article>
          <article className="podcast-card" onClick={(e) => handleAudioClick(e, 'Le Son de Demain')} style={{ cursor: 'pointer' }}>
            <div className="card-img-wrapper"><img src="/assets/core/img/ecouter-3.png" alt="Son" className="card-img" /></div>
            <h3 className="card-title">Le Son de Demain</h3>
            <div className="card-meta">08 FÉVRIER — 19 MIN</div>
          </article>
          <article className="podcast-card" onClick={(e) => handleAudioClick(e, 'L\'Art de Conversation')} style={{ cursor: 'pointer' }}>
            <div className="card-img-wrapper"><img src="/assets/core/img/ecouter-4.png" alt="Conversation" className="card-img" /></div>
            <h3 className="card-title">L'Art de Conversation</h3>
            <div className="card-meta">05 FÉVRIER — 45 MIN</div>
          </article>
        </div>
      </section>

      {/* DIRECT / LIVE */}
      <section className="ecouter-live">
        <div className="live-background-text">LIVE</div>
        <div className="live-content">
          <div className="live-tag"><span className="dot"></span> DIRECT <span className="tag-text">ANTENNE DONA RADIO</span></div>
          <h2 className="live-title">En ce moment :<br />Session de Nuit<br />avec Julian B.</h2>
          <div className="live-player-area">
            <button className="btn-play-large" onClick={(e) => handleAudioClick(e, 'Direct Dona Radio')} style={{ border: 'none', cursor: 'pointer' }}>
              <span className="material-symbols-outlined">play_arrow</span>
            </button>
            <div className="live-upcoming">
              <div className="upcoming-label">PROCHAINEMENT : 21:00</div>
              <div className="upcoming-title">Le Cercle des Auditeurs — Invité Spécial : Marc-Antoine</div>
            </div>
          </div>
        </div>
      </section>

      {/* SÉRIES LIMITÉES */}
      <section className="ecouter-series">
        <div className="series-header">
          <div className="kicker">— SÉRIES LIMITÉES</div>
          <h2 className="section-title">Grands Formats &<br />Documentaires</h2>
          <p className="section-desc">Une collection de récits immersifs, de l'exploration des archives oubliées aux enquêtes<br />sur les nouveaux paradigmes de l'élégance.</p>
        </div>
        <div className="series-list">
          <div className="series-item" onClick={(e) => handleAudioClick(e, 'Les Fantômes de la Haute Couture')} style={{ cursor: 'pointer' }}>
            <div className="series-number">01 / 06</div>
            <div className="series-info">
              <h3 className="series-title">Les Fantômes de la Haute Couture</h3>
              <p className="series-desc">Une série de six épisodes retraçant les ateliers disparus de la Rive Gauche entre 1950 et 1970.</p>
            </div>
            <div className="series-duration">3H 45M TOTAL</div>
          </div>
          <div className="series-item" onClick={(e) => handleAudioClick(e, 'L\'Écho du Silence')} style={{ cursor: 'pointer' }}>
            <div className="series-number">02 / 04</div>
            <div className="series-info">
              <h3 className="series-title">L'Écho du Silence</h3>
              <p className="series-desc">Investigation philosophique sur la valeur du calme dans un monde hyper-connecté.</p>
            </div>
            <div className="series-duration">2H 12M TOTAL</div>
          </div>
        </div>
      </section>

      {/* EXCLUSIF CERCLE */}
      <section className="ecouter-exclusif">
        <div className="exclusif-header">
          <div className="kicker-center"><span className="material-symbols-outlined padlock">lock</span> EXCLUSIF CERCLE</div>
          <h2 className="section-title-center">Entretiens de l'Intime</h2>
          <p className="section-desc-center">Accédez aux conversations non éditées avec les plus grands créateurs et intellectuels<br />de notre temps.</p>
        </div>
        <div className="exclusif-grid">
          <article className="locked-card" onClick={(e) => handleAudioClick(e, 'Clara Rossi : Le Temps Suspendu')} style={{ cursor: 'pointer' }}>
            <div className="locked-img-wrapper">
              <img src="/assets/core/img/ecouter-lock-1.png" alt="Clara Rossi" className="locked-img" />
              <div className="locked-overlay">
                <span className="material-symbols-outlined lock-icon">lock</span>
                <div className="locked-label">ABONNÉS UNIQUEMENT</div>
                <div className="locked-desc">Débloquez l'entretien complet avec Clara Rossi</div>
              </div>
            </div>
            <h3 className="card-title">Clara Rossi : Le Temps Suspendu</h3>
            <div className="card-meta">INTERVIEW — 65 MIN</div>
          </article>
          <article className="locked-card" onClick={(e) => handleAudioClick(e, 'Jean-Marc Vallet : L\'Épure')} style={{ cursor: 'pointer' }}>
            <div className="locked-img-wrapper">
              <img src="/assets/core/img/ecouter-lock-2.png" alt="Jean-Marc Vallet" className="locked-img" />
              <div className="locked-overlay">
                <span className="material-symbols-outlined lock-icon">lock</span>
                <div className="locked-label">ABONNÉS UNIQUEMENT</div>
                <div className="locked-desc">Dans le studio de Jean-Marc Vallet</div>
              </div>
            </div>
            <h3 className="card-title">Jean-Marc Vallet : L'Épure</h3>
            <div className="card-meta">INTERVIEW — 48 MIN</div>
          </article>
        </div>
      </section>

      {/* Paywall Modal */}
      {paywallModal.isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
            maxWidth: "480px",
            width: "100%",
            padding: "36px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <div style={{ width: "54px", height: "54px", background: "rgba(163, 6, 38, 0.08)", color: "var(--color-accent)", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>lock</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "700", margin: "0 0 12px 0", color: "var(--color-text)" }}>
              {paywallModal.title}
            </h3>
            <p style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", margin: "0 0 28px 0" }}>
              {paywallModal.message}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link 
                href="/abonnement"
                onClick={() => setPaywallModal({ isOpen: false, title: '', message: '' })}
                style={{
                  background: "var(--color-accent)",
                  color: "#FFFFFF",
                  padding: "14px",
                  borderRadius: "2px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none"
                }}
              >
                Passer à l'offre Premium (23€/mois)
              </Link>
              <button 
                type="button"
                onClick={() => setPaywallModal({ isOpen: false, title: '', message: '' })}
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-muted)",
                  padding: "12px",
                  borderRadius: "2px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer"
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

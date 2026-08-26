'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function ClubPage() {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <main className="cn-club">

      {/* ═══════════════════════════════════════════════
          HERO — Full-screen dark cinematic
      ═══════════════════════════════════════════════ */}
      <section className="cn-hero">
        {/* Background texture */}
        <div className="cn-hero-noise" />
        <div className="cn-hero-grid-lines" />

        <div className="cn-hero-inner container">
          {/* Top label */}
          <div className="cn-hero-label">
            <span className="cn-dot" />
            LE CERCLE DONA — ACCÈS RESTREINT
          </div>

          {/* Main title */}
          <div className="cn-hero-title-block">
            <h1 className="cn-h1">
              Le Club<br />
              <span className="cn-h1-red">DONA</span>
            </h1>
            <div className="cn-hero-side">
              <p className="cn-hero-desc">
                Un espace réservé à ceux qui redéfinissent les codes de l'élégance contemporaine. Analyses confidentielles, événements privés, communauté d'exception.
              </p>
              <div className="cn-hero-actions">
                <Link href="/login?vip=1&callbackUrl=/club" className="cn-btn-primary">
                  <span className="material-symbols-outlined">key</span>
                  S'AUTHENTIFIER
                </Link>
                <Link href="#avantages" className="cn-btn-ghost">
                  DÉCOUVRIR LE CERCLE
                  <span className="material-symbols-outlined">arrow_downward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="cn-stats-bar">
            <div className="cn-stat">
              <span className="cn-stat-num">16</span>
              <span className="cn-stat-label">Magazines Exclusifs</span>
            </div>
            <div className="cn-stat-divider" />
            <div className="cn-stat">
              <span className="cn-stat-num">340+</span>
              <span className="cn-stat-label">Membres Privilège</span>
            </div>
            <div className="cn-stat-divider" />
            <div className="cn-stat">
              <span className="cn-stat-num">12</span>
              <span className="cn-stat-label">Événements / An</span>
            </div>
            <div className="cn-stat-divider" />
            <div className="cn-stat">
              <span className="cn-stat-num">Est. 2024</span>
              <span className="cn-stat-label">Paris, France</span>
            </div>
          </div>
        </div>

        {/* Décoratif : seal géométrique */}
        <div className="cn-hero-seal">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" stroke="#A30626" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="78" stroke="#A30626" strokeWidth="0.5" opacity="0.5" />
            <polygon points="100,10 190,100 100,190 10,100" stroke="#A30626" strokeWidth="0.5" opacity="0.6" />
            <polygon points="100,10 190,100 100,190 10,100" stroke="#A30626" strokeWidth="0.5" opacity="0.4" transform="rotate(45 100 100)" />
            <circle cx="100" cy="55" r="45" stroke="#A30626" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="145" r="45" stroke="#A30626" strokeWidth="0.5" opacity="0.3" />
            <circle cx="55" cy="100" r="45" stroke="#A30626" strokeWidth="0.5" opacity="0.3" />
            <circle cx="145" cy="100" r="45" stroke="#A30626" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="100" r="20" stroke="#A30626" strokeWidth="1" opacity="0.8" />
            <text x="100" y="105" textAnchor="middle" fill="#A30626" fontSize="8" fontFamily="Inter" letterSpacing="3" opacity="0.9">DONA</text>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AVANTAGES — 3 colonnes avec icônes
      ═══════════════════════════════════════════════ */}
      <section className="cn-avantages" id="avantages">
        <div className="container">
          <div className="cn-section-label">POURQUOI REJOINDRE LE CLUB</div>
          <h2 className="cn-h2">Les Privilèges du Cercle</h2>

          <div className="cn-avantages-grid">
            <div className="cn-avantage-card">
              <div className="cn-av-icon">
                <span className="material-symbols-outlined">auto_stories</span>
              </div>
              <h3 className="cn-av-title">Intelligence Curée</h3>
              <p className="cn-av-desc">Accédez aux 16 magazines DONA en intégralité, aux archives confidentielles et aux dossiers d'analyse sur-mesure publiés chaque semaine.</p>
              <div className="cn-av-meta">16 PUBLICATIONS EXCLUSIVES</div>
            </div>

            <div className="cn-avantage-card cn-avantage-card--featured">
              <div className="cn-av-icon">
                <span className="material-symbols-outlined">stars</span>
              </div>
              <h3 className="cn-av-title">Événements & Galas</h3>
              <p className="cn-av-desc">Invitations personnelles aux galas privés, masterclass fermées et soirées de réseau organisées dans les lieux les plus confidentiels d'Europe.</p>
              <div className="cn-av-meta">12 ÉVÉNEMENTS / AN</div>
            </div>

            <div className="cn-avantage-card">
              <div className="cn-av-icon">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <h3 className="cn-av-title">Cercle de Pairs</h3>
              <p className="cn-av-desc">Rejoignez 340+ bâtisseurs, décideurs et créateurs qui débattent, partagent et co-construisent les codes d'un leadership discret et influent.</p>
              <div className="cn-av-meta">340+ MEMBRES PRIVILÈGE</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FORUM — Carte éditoriale large
      ═══════════════════════════════════════════════ */}
      <section className="cn-forum">
        <div className="container">
          <div className="cn-section-head">
            <div>
              <div className="cn-section-label">COMMUNAUTÉ & ÉCHANGES</div>
              <h2 className="cn-h2">Le Forum Privé</h2>
              <p className="cn-section-desc">Débats exclusifs entre pairs sur l'architecture, la culture et le leadership.</p>
            </div>
            <Link href="/login?vip=1&callbackUrl=/club" className="cn-link-action">
              ACCÉDER AU FORUM <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="cn-forum-grid">
            {/* Thread principal */}
            <div className="cn-forum-main">
              <div className="cn-forum-tags">
                <span className="cn-badge cn-badge--red">EXCLUSIVITÉ DONA</span>
                <span className="cn-badge">15 AVRIL 2026</span>
              </div>
              <h3 className="cn-forum-title">L'Architecture du Silence : Repenser l'Espace Privé dans un Monde Saturé</h3>
              <p className="cn-forum-excerpt">Comment le design de nos intérieurs devient un rempart contre le bruit du monde. Un luxe que seuls ceux qui maîtrisent leur environnement peuvent s'autoriser.</p>
              <div className="cn-forum-footer">
                <div className="cn-avatars">
                  <div className="cn-avatar">R</div>
                  <div className="cn-avatar">M</div>
                  <div className="cn-avatar">A</div>
                  <div className="cn-avatar cn-avatar--count">+18</div>
                </div>
                <span className="cn-forum-meta">21 participants · 3h ago</span>
              </div>
            </div>

            {/* Threads secondaires */}
            <div className="cn-forum-side">
              {[
                { tag: "DEEP-DIVE", title: "Le Minimalisme comme Déclaration Politique", meta: "14 participants · 1j", color: "var(--club-cn-red)" },
                { tag: "ANALYSE", title: "Investissement en Art : Les Nouvelles Règles du Marché", meta: "9 participants · 2j", color: "" },
                { tag: "DÉBAT", title: "Paris vs. Dubaï : Où se Construit le Luxe de Demain ?", meta: "32 participants · 3j", color: "" },
              ].map((thread, i) => (
                <Link href="/login?vip=1&callbackUrl=/club" className="cn-forum-thread" key={i}>
                  <div className="cn-thread-content">
                    <span className="cn-badge cn-badge--sm">{thread.tag}</span>
                    <p className="cn-thread-title">{thread.title}</p>
                    <span className="cn-thread-meta">{thread.meta}</span>
                  </div>
                  <span className="material-symbols-outlined cn-thread-arrow">chevron_right</span>
                </Link>
              ))}
              <Link href="/login?vip=1&callbackUrl=/club" className="cn-forum-cta">
                VOIR TOUS LES SUJETS
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MASTERCLASS — Fond rouge
      ═══════════════════════════════════════════════ */}
      <section className="cn-masterclass">
        <div className="container cn-mc-inner">
          <div className="cn-mc-header">
            <div className="cn-section-label cn-label--light">AGENDA CONFIDENTIEL</div>
            <h2 className="cn-h2 cn-h2--white">Masterclass & Événements Privés</h2>
            <p className="cn-mc-desc">Sessions stratégiques en cercle restreint, pensées pour affiner vos perspectives et développer votre réseau d'influence.</p>
          </div>

          <div className="cn-mc-list">
            {[
              { date: "22 MAI 2026", lieu: "Paris — Cercle de l'Union Interalliée", title: "Gala d'Été : L'Art de l'Héritage Contemporain", type: "GALA PRIVÉ" },
              { date: "05 JUIN 2026", lieu: "Session Virtuelle Sécurisée", title: "Briefing Stratégique : L'Avenir de l'Investissement Créatif", type: "MASTERCLASS" },
              { date: "18 SEPT 2026", lieu: "Venise — Palazzo Grimani", title: "Forum International des Décideurs DONA", type: "FORUM FERMÉ" },
            ].map((event, i) => (
              <Link href="/login?vip=1&callbackUrl=/club" className="cn-mc-item" key={i}>
                <div className="cn-mc-date">{event.date}</div>
                <div className="cn-mc-info">
                  <span className="cn-mc-lieu">{event.lieu}</span>
                  <span className="cn-mc-title">{event.title}</span>
                </div>
                <span className="cn-mc-type">{event.type}</span>
                <span className="material-symbols-outlined cn-mc-arrow">arrow_forward</span>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/login?vip=1&callbackUrl=/club" className="cn-btn-white">
              VOIR L'AGENDA COMPLET
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VAULT — Grille de contenus
      ═══════════════════════════════════════════════ */}
      <section className="cn-vault">
        <div className="container">
          <div className="cn-section-head">
            <div>
              <div className="cn-section-label">BIBLIOTHÈQUE CONFIDENTIELLE</div>
              <h2 className="cn-h2">The Intelligence Vault</h2>
              <p className="cn-section-desc">Rapports exclusifs, analyses de fond et archives de la rédaction.</p>
            </div>
          </div>

          <div className="cn-vault-grid">
            {[
              { tag: "RAPPORT", date: "22 AVR 2026", title: "L'Influence des Cercles Tangibles", bg: "#1A1A1A" },
              { tag: "ANALYSE", date: "10 AVR 2026", title: "La Discrétion comme Nouvelle Monnaie de Pouvoir", bg: "#111111" },
              { tag: "GALERIE", date: "02 MARS 2026", title: "L'Esthétique du Cercle : Portraits de Membres", bg: "#0D0D0D" },
            ].map((item, i) => (
              <Link href="/login?vip=1&callbackUrl=/club" className="cn-vault-card" key={i} style={{ background: item.bg }}>
                <div className="cn-vault-card-top">
                  <span className="cn-badge cn-badge--outline">{item.tag}</span>
                  <span className="cn-vault-date">{item.date}</span>
                </div>
                <h4 className="cn-vault-title">{item.title}</h4>
                <div className="cn-vault-read">
                  <span>LIRE LE DOCUMENT</span>
                  <span className="material-symbols-outlined">lock</span>
                </div>
              </Link>
            ))}

            {/* Carte restreinte */}
            <div className="cn-vault-card cn-vault-card--locked">
              <div className="cn-vault-lock-icon">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <p className="cn-vault-lock-label">ACCÈS RÉSERVÉ</p>
              <p className="cn-vault-lock-desc">Ce contenu est réservé aux membres Privilège. Rejoignez le Cercle pour y accéder.</p>
              <Link href="/signup?plan=elite&billing=annual" className="cn-vault-lock-cta">
                DEVENIR MEMBRE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          OFFRES — Cards avec hover
      ═══════════════════════════════════════════════ */}
      <section className="cn-offres">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="cn-section-label" style={{ justifyContent: "center" }}>ADHÉSION AU CERCLE</div>
            <h2 className="cn-h2" style={{ textAlign: "center" }}>Choisissez Votre Accès</h2>
          </div>

          <div className="cn-offres-grid">
            {/* Plan Premium */}
            <div
              className={`cn-plan ${hoveredPlan === 'premium' ? 'cn-plan--active' : ''}`}
              onMouseEnter={() => setHoveredPlan('premium')}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <div className="cn-plan-top">
                <span className="cn-plan-badge">RECOMMANDÉ</span>
                <h3 className="cn-plan-name">Cercle Privilège</h3>
                <div className="cn-plan-price">
                  <span className="cn-plan-price-num">950</span>
                  <span className="cn-plan-price-unit">€ / an</span>
                </div>
                <p className="cn-plan-desc">L'expérience totale : éditions print collector, accès digital intégral et invitations aux galas privés.</p>
              </div>
              <ul className="cn-plan-features">
                {["Accès intégral aux 16 magazines", "Éditions Print Collector livrées", "Invitations aux Galas & Événements", "Intelligence Vault illimitée", "Forum Privé & Masterclass", "Badge Membre Privilège"].map((f, i) => (
                  <li key={i}>
                    <span className="material-symbols-outlined">check</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=elite&billing=annual" className="cn-plan-cta cn-plan-cta--primary">
                REJOINDRE LE CERCLE
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            {/* Plan Digital */}
            <div
              className={`cn-plan cn-plan--light ${hoveredPlan === 'digital' ? 'cn-plan--active-light' : ''}`}
              onMouseEnter={() => setHoveredPlan('digital')}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <div className="cn-plan-top">
                <span className="cn-plan-badge cn-plan-badge--gray">DIGITAL</span>
                <h3 className="cn-plan-name">Accès Digital</h3>
                <div className="cn-plan-price">
                  <span className="cn-plan-price-num cn-plan-price-num--dark">290</span>
                  <span className="cn-plan-price-unit cn-plan-price-unit--dark">€ / an</span>
                </div>
                <p className="cn-plan-desc cn-plan-desc--dark">Accès illimité aux 16 magazines en ligne, aux analyses de l'Intelligence Vault et aux flux Studio.</p>
              </div>
              <ul className="cn-plan-features cn-plan-features--dark">
                {["Accès intégral aux 16 magazines", "Intelligence Vault complète", "Forum Privé & discussions", "Flux Studio en direct"].map((f, i) => (
                  <li key={i}>
                    <span className="material-symbols-outlined">check</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/abonnement" className="cn-plan-cta cn-plan-cta--outline">
                VOIR LES DÉTAILS
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            {/* Espace Membre */}
            <div className="cn-plan cn-plan--member">
              <div className="cn-plan-top">
                <span className="cn-plan-badge cn-plan-badge--gray">MEMBRES</span>
                <h3 className="cn-plan-name">Espace Membre</h3>
                <p className="cn-plan-desc cn-plan-desc--dark">Accédez directement à votre espace personnalisé.</p>
              </div>
              <ul className="cn-member-links">
                {[
                  { icon: "dashboard", label: "Mon Tableau de Bord", href: "/member-profile" },
                  { icon: "bookmark", label: "Mes Favoris & Lectures VIP", href: "/espace-lecture" },
                  { icon: "receipt_long", label: "Historique des Commandes", href: "/member-profile" },
                  { icon: "manage_accounts", label: "Profil & Sécurité", href: "/member-profile" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="cn-member-link">
                      <span className="material-symbols-outlined">{link.icon}</span>
                      {link.label}
                      <span className="material-symbols-outlined cn-member-link-arrow">chevron_right</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/login?vip=1&callbackUrl=/club" className="cn-plan-cta cn-plan-cta--outline">
                SE CONNECTER
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA FINAL — Dark avec citation
      ═══════════════════════════════════════════════ */}
      <section className="cn-final-cta">
        <div className="container cn-final-inner">
          <div className="cn-final-seal">
            <svg viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="#A30626" strokeWidth="0.5" />
              <circle cx="30" cy="30" r="22" stroke="#A30626" strokeWidth="0.5" opacity="0.5" />
              <text x="30" y="31" textAnchor="middle" fill="#A30626" fontSize="5" fontFamily="Inter" letterSpacing="1">DONA CLUB</text>
              <text x="30" y="38" textAnchor="middle" fill="#A30626" fontSize="3.5" fontFamily="Inter" letterSpacing="0.5" opacity="0.7">EST. MMXXIV</text>
            </svg>
          </div>
          <blockquote className="cn-final-quote">
            "Cultivez votre unicité.<br />Vivez l'expérience d'un luxe qui se vit de l'intérieur."
          </blockquote>
          <Link href="/signup?plan=elite&billing=annual" className="cn-btn-primary cn-btn-primary--lg">
            REJOINDRE LE CERCLE — 950 € / AN
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div className="cn-final-footer">
            <Link href="/abonnement">FAQ & Conditions Générales</Link>
            <span>·</span>
            <a href="mailto:contact.club@donamagazine.com">contact.club@donamagazine.com</a>
          </div>
        </div>
      </section>

    </main>
  );
}

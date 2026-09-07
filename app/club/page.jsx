'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ClubPage() {
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const { t } = useLanguage();

  return (
    <main className="cn-club">

      {/* ═══════════════════════════════════════════════
          HERO — Fond ivoire, typographie grande échelle
      ═══════════════════════════════════════════════ */}
      <section className="cn-hero">
        <div className="cn-hero-inner container">
          {/* Eyebrow */}
          <div className="cn-hero-label">
            <span className="cn-dot" />
            {t('club_eyebrow')}
          </div>

          {/* Titre + desc en grid 2 colonnes */}
          <div className="cn-hero-title-block">
            <h1 className="cn-h1">
              {t('club_title')}<br />
              <em className="cn-h1-accent">{t('club_title_accent')}</em>
            </h1>
            <div className="cn-hero-side">
              <p className="cn-hero-desc">
                {t('club_desc')}
              </p>
              <div className="cn-hero-actions">
                <Link href="/login?vip=1&callbackUrl=/club" className="cn-btn-primary">
                  <span className="material-symbols-outlined">key</span>
                  {t('club_btn_auth')}
                </Link>
                <Link href="#avantages" className="cn-btn-ghost">
                  {t('club_btn_discover')}
                  <span className="material-symbols-outlined">arrow_downward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="cn-stats-bar">
            <div className="cn-stat">
              <span className="cn-stat-num">16</span>
              <span className="cn-stat-label">{t('club_stat_magazines')}</span>
            </div>
            <div className="cn-stat-divider" />
            <div className="cn-stat">
              <span className="cn-stat-num">340+</span>
              <span className="cn-stat-label">{t('club_stat_members')}</span>
            </div>
            <div className="cn-stat-divider" />
            <div className="cn-stat">
              <span className="cn-stat-num">12</span>
              <span className="cn-stat-label">{t('club_stat_events')}</span>
            </div>
            <div className="cn-stat-divider" />
            <div className="cn-stat">
              <span className="cn-stat-num">Est. 2024</span>
              <span className="cn-stat-label">{t('club_stat_location')}</span>
            </div>
          </div>
        </div>

        {/* Sceau décoratif */}
        <div className="cn-hero-seal">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" stroke="#A30626" strokeWidth="0.8" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="78" stroke="#A30626" strokeWidth="0.5" opacity="0.4" />
            <polygon points="100,10 190,100 100,190 10,100" stroke="#A30626" strokeWidth="0.5" opacity="0.5" />
            <polygon points="100,10 190,100 100,190 10,100" stroke="#A30626" strokeWidth="0.5" opacity="0.3" transform="rotate(45 100 100)" />
            <circle cx="100" cy="55" r="45" stroke="#A30626" strokeWidth="0.5" opacity="0.2" />
            <circle cx="100" cy="145" r="45" stroke="#A30626" strokeWidth="0.5" opacity="0.2" />
            <circle cx="55" cy="100" r="45" stroke="#A30626" strokeWidth="0.5" opacity="0.2" />
            <circle cx="145" cy="100" r="45" stroke="#A30626" strokeWidth="0.5" opacity="0.2" />
            <circle cx="100" cy="100" r="20" stroke="#A30626" strokeWidth="1" opacity="0.6" />
            <text x="100" y="105" textAnchor="middle" fill="#A30626" fontSize="8" fontFamily="Inter" letterSpacing="3" opacity="0.7">DONA</text>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AVANTAGES — Fond blanc, 3 cartes
      ═══════════════════════════════════════════════ */}
      <section className="cn-avantages" id="avantages">
        <div className="container">
          <div className="cn-section-label">{t('club_why_label')}</div>
          <h2 className="cn-h2">{t('club_privileges_title')}</h2>

          <div className="cn-avantages-grid">
            <div className="cn-avantage-card">
              <div className="cn-av-icon">
                <span className="material-symbols-outlined">auto_stories</span>
              </div>
              <h3 className="cn-av-title">{t('club_priv1_title')}</h3>
              <p className="cn-av-desc">{t('club_priv1_desc')}</p>
              <div className="cn-av-meta">{t('club_priv1_meta')}</div>
            </div>

            <div className="cn-avantage-card cn-avantage-card--featured">
              <div className="cn-av-icon cn-av-icon--light">
                <span className="material-symbols-outlined">stars</span>
              </div>
              <h3 className="cn-av-title cn-av-title--light">{t('club_priv2_title')}</h3>
              <p className="cn-av-desc cn-av-desc--light">{t('club_priv2_desc')}</p>
              <div className="cn-av-meta cn-av-meta--light">{t('club_priv2_meta')}</div>
            </div>

            <div className="cn-avantage-card">
              <div className="cn-av-icon">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <h3 className="cn-av-title">{t('club_priv3_title')}</h3>
              <p className="cn-av-desc">{t('club_priv3_desc')}</p>
              <div className="cn-av-meta">{t('club_priv3_meta')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FORUM — Fond ivoire alt
      ═══════════════════════════════════════════════ */}
      <section className="cn-forum">
        <div className="container">
          <div className="cn-section-head">
            <div>
              <div className="cn-section-label">{t('club_forum_label')}</div>
              <h2 className="cn-h2">{t('club_forum_title')}</h2>
              <p className="cn-section-desc">{t('club_forum_desc')}</p>
            </div>
            <Link href="/login?vip=1&callbackUrl=/club" className="cn-link-action">
              {t('club_forum_access')} <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="cn-forum-grid">
            {/* Thread principal */}
            <div className="cn-forum-main">
              <div className="cn-forum-tags">
                <span className="cn-badge cn-badge--red">{t('club_forum_tag_exclusive')}</span>
                <span className="cn-badge">15 AVRIL 2026</span>
              </div>
              <h3 className="cn-forum-title">{t('club_forum_main_title')}</h3>
              <p className="cn-forum-excerpt">{t('club_forum_main_desc')}</p>
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
                { tag: "DEEP-DIVE", title: "Le Minimalisme comme Déclaration Politique", meta: "14 participants · 1j" },
                { tag: "ANALYSE", title: "Investissement en Art : Les Nouvelles Règles du Marché", meta: "9 participants · 2j" },
                { tag: "DÉBAT", title: "Paris vs. Dubaï : Où se Construit le Luxe de Demain ?", meta: "32 participants · 3j" },
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
                {t('view_all')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MASTERCLASS — Section accent rouge (volontaire)
      ═══════════════════════════════════════════════ */}
      <section className="cn-masterclass">
        <div className="container cn-mc-inner">
          <div className="cn-mc-header">
            <div className="cn-section-label cn-label--light">{t('club_mc_label')}</div>
            <h2 className="cn-h2 cn-h2--white">{t('club_mc_title')}</h2>
            <p className="cn-mc-desc">{t('club_mc_desc')}</p>
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
              {t('club_mc_all')}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VAULT — Fond ivoire alt, cartes sombres
      ═══════════════════════════════════════════════ */}
      <section className="cn-vault">
        <div className="container">
          <div className="cn-section-head">
            <div>
              <div className="cn-section-label">{t('club_vault_label')}</div>
              <h2 className="cn-h2">{t('club_vault_title')}</h2>
              <p className="cn-section-desc">{t('club_vault_desc')}</p>
            </div>
          </div>

          <div className="cn-vault-grid">
            {[
              { tag: "RAPPORT", date: "22 AVR 2026", title: "L'Influence des Cercles Tangibles" },
              { tag: "ANALYSE", date: "10 AVR 2026", title: "La Discrétion comme Nouvelle Monnaie de Pouvoir" },
              { tag: "GALERIE", date: "02 MARS 2026", title: "L'Esthétique du Cercle : Portraits de Membres" },
            ].map((item, i) => (
              <Link href="/login?vip=1&callbackUrl=/club" className="cn-vault-card" key={i}>
                <div className="cn-vault-card-top">
                  <span className="cn-badge">{item.tag}</span>
                  <span className="cn-vault-date">{item.date}</span>
                </div>
                <h4 className="cn-vault-title">{item.title}</h4>
                <div className="cn-vault-read">
                  <span>{t('club_vault_read')}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </div>
              </Link>
            ))}

            {/* Carte restreinte */}
            <div className="cn-vault-card cn-vault-card--locked">
              <div className="cn-vault-lock-icon">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <p className="cn-vault-lock-label">{t('club_vault_locked')}</p>
              <p className="cn-vault-lock-desc">{t('club_vault_locked_desc')}</p>
              <Link href="/signup?plan=elite&billing=annual" className="cn-vault-lock-cta">
                {t('club_vault_become_member')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          OFFRES — Fond blanc, 3 colonnes
      ═══════════════════════════════════════════════ */}
      <section className="cn-offres">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="cn-section-label" style={{ justifyContent: "center" }}>{t('club_offres_label')}</div>
            <h2 className="cn-h2" style={{ textAlign: "center" }}>{t('club_offres_title')}</h2>
          </div>

          <div className="cn-offres-grid">
            {/* Plan Premium */}
            <div
              className={`cn-plan ${hoveredPlan === 'premium' ? 'cn-plan--active' : ''}`}
              onMouseEnter={() => setHoveredPlan('premium')}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <div className="cn-plan-top">
                <span className="cn-plan-badge">{t('club_plan_recommended')}</span>
                <h3 className="cn-plan-name">{t('club_plan_privilege_name')}</h3>
                <div className="cn-plan-price">
                  <span className="cn-plan-price-num">950</span>
                  <span className="cn-plan-price-unit">€ {t('home_plan_per_year')}</span>
                </div>
                <p className="cn-plan-desc">{t('club_plan_privilege_desc')}</p>
              </div>
              <ul className="cn-plan-features">
                {["Accès intégral aux 16 magazines", "Éditions Print Collector livrées", "Invitations Galas & Événements", "Intelligence Vault illimitée", "Forum Privé & Masterclass", "Badge Membre Privilège"].map((f, i) => (
                  <li key={i}>
                    <span className="material-symbols-outlined">check</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=elite&billing=annual" className="cn-plan-cta cn-plan-cta--primary">
                {t('club_plan_join')}
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
                <h3 className="cn-plan-name cn-plan-name--dark">{t('club_plan_digital_name')}</h3>
                <div className="cn-plan-price">
                  <span className="cn-plan-price-num cn-plan-price-num--dark">290</span>
                  <span className="cn-plan-price-unit cn-plan-price-unit--dark">€ {t('home_plan_per_year')}</span>
                </div>
                <p className="cn-plan-desc cn-plan-desc--dark">{t('club_plan_digital_desc')}</p>
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
                {t('club_plan_details')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            {/* Espace Membre */}
            <div className="cn-plan cn-plan--member">
              <div className="cn-plan-top">
                <span className="cn-plan-badge cn-plan-badge--gray">MEMBRES</span>
                <h3 className="cn-plan-name cn-plan-name--dark">{t('club_plan_member_name')}</h3>
                <p className="cn-plan-desc cn-plan-desc--dark">{t('club_plan_member_desc')}</p>
              </div>
              <ul className="cn-member-links">
                {[
                  { icon: "dashboard", label: t('my_dashboard'), href: "/member-profile" },
                  { icon: "bookmark", label: t('my_favorites'), href: "/espace-lecture" },
                  { icon: "receipt_long", label: t('order_history'), href: "/member-profile" },
                  { icon: "manage_accounts", label: t('manage_profile'), href: "/member-profile" },
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
                {t('club_member_login')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA FINAL — Fond ivoire avec bordure rouge
      ═══════════════════════════════════════════════ */}
      <section className="cn-final-cta">
        <div className="container cn-final-inner">
          <div className="cn-final-seal">
            <svg viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="37" stroke="#A30626" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="40" cy="40" r="28" stroke="#A30626" strokeWidth="0.5" opacity="0.4" />
              <text x="40" y="41" textAnchor="middle" fill="#A30626" fontSize="5" fontFamily="Inter" letterSpacing="2">DONA CLUB</text>
              <text x="40" y="48" textAnchor="middle" fill="#A30626" fontSize="3.5" fontFamily="Inter" letterSpacing="1" opacity="0.6">EST. MMXXIV</text>
            </svg>
          </div>
          <blockquote className="cn-final-quote">
            "{t('club_final_quote')}"
          </blockquote>
          <Link href="/signup?plan=elite&billing=annual" className="cn-btn-primary">
            {t('club_final_cta')}
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div className="cn-final-footer">
            <Link href="/abonnement">{t('club_final_faq')}</Link>
            <span>·</span>
            <a href="mailto:contact.club@donamagazine.com">contact.club@donamagazine.com</a>
          </div>
        </div>
      </section>

    </main>
  );
}

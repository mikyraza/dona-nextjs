"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cahiers = [
    { title: "Intelligence", slug: "magazine-01-intelligence" },
    { title: "Power Lab", slug: "magazine-02-power-lab" },
    { title: "L'Alliance", slug: "magazine-03-alliance" },
    { title: "L'Agenda", slug: "magazine-04-agenda" },
    { title: "Passions", slug: "magazine-05-passions" },
    { title: "Art de Vivre", slug: "magazine-06-art-de-vivre" },
    { title: "Académie", slug: "magazine-07-academie" },
    { title: "Patrimoine", slug: "magazine-08-patrimoine" },
    { title: "Longevity", slug: "magazine-09-longevity" },
    { title: "Impact", slug: "magazine-10-impact" },
    { title: "Culture & Médias", slug: "magazine-11-culture-medias" },
    { title: "Le Cercle", slug: "magazine-12-cercle" }
  ];

  return (
    <main className="not-found-wrapper">
      <style jsx>{`
        .not-found-wrapper {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 80px 24px;
          background: var(--color-bg, #FAFAF8);
          color: var(--color-text, #111111);
          overflow: hidden;
          font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        }

        .not-found-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(140px, 28vw, 360px);
          font-family: var(--font-secondary, "Playfair Display", Georgia, serif);
          font-weight: 900;
          color: var(--color-text, #111111);
          opacity: 0.03;
          pointer-events: none;
          user-select: none;
          z-index: 0;
          line-height: 1;
        }

        .not-found-content {
          position: relative;
          z-index: 1;
          max-width: 780px;
          width: 100%;
          text-align: center;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .not-found-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-accent, #A30626);
          background: rgba(163, 6, 38, 0.08);
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .not-found-title {
          font-family: var(--font-secondary, "Playfair Display", Georgia, serif);
          font-size: clamp(28px, 4.5vw, 46px);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--color-text, #111111);
          margin: 0 0 16px 0;
        }

        .not-found-subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: var(--color-text-muted, #737373);
          max-width: 540px;
          margin: 0 auto 36px auto;
        }

        .not-found-search-form {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 480px;
          background: var(--color-bg-alt, #FFFFFF);
          border: 1px solid var(--color-border, #E5E5E5);
          border-radius: 4px;
          padding: 6px 12px;
          margin-bottom: 48px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.03);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .not-found-search-form:focus-within {
          border-color: var(--color-accent, #A30626);
          box-shadow: 0 8px 24px rgba(163, 6, 38, 0.08);
        }

        .not-found-search-icon {
          color: var(--color-accent, #A30626);
          display: flex;
          align-items: center;
          margin-right: 10px;
        }

        .not-found-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: var(--color-text, #111111);
          font-family: inherit;
        }

        .not-found-search-btn {
          background: var(--color-accent, #A30626);
          color: #FFFFFF;
          border: none;
          border-radius: 3px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .not-found-search-btn:hover {
          opacity: 0.9;
        }

        .not-found-cahiers-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted, #737373);
          margin-bottom: 20px;
        }

        .not-found-cahiers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          width: 100%;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .not-found-cahiers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .not-found-cahier-link {
          background: var(--color-bg-alt, #FFFFFF);
          border: 1px solid var(--color-border, #E5E5E5);
          padding: 12px 14px;
          border-radius: 3px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text, #111111);
          text-decoration: none;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .not-found-cahier-link:hover {
          border-color: var(--color-accent, #A30626);
          color: var(--color-accent, #A30626);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }

        .not-found-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .not-found-btn-primary {
          background: var(--color-accent, #A30626);
          color: #FFFFFF;
          padding: 14px 28px;
          border-radius: 2px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .not-found-btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .not-found-btn-secondary {
          background: transparent;
          color: var(--color-text, #111111);
          border: 1px solid var(--color-border, #E5E5E5);
          padding: 13px 24px;
          border-radius: 2px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .not-found-btn-secondary:hover {
          border-color: var(--color-text, #111111);
        }
      `}</style>

      {/* Background Watermark */}
      <div className="not-found-watermark" aria-hidden="true">404</div>

      <div className="not-found-content">
        {/* Error Badge */}
        <div className="not-found-badge">
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>error</span>
          <span>{t('not_found_badge')}</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="not-found-title">{t('not_found_title')}</h1>
        <p className="not-found-subtitle">
          {t('not_found_desc')}
        </p>

        {/* Interactive Search Bar */}
        <form className="not-found-search-form" onSubmit={handleSearchSubmit}>
          <div className="not-found-search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            type="text"
            className="not-found-search-input"
            placeholder={t('not_found_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="not-found-search-btn">{t('not_found_search_btn')}</button>
        </form>

        {/* Quick Access to Cahiers */}
        <p className="not-found-cahiers-title">{t('not_found_cahiers_title')}</p>
        <div className="not-found-cahiers-grid">
          {cahiers.map((cahier) => (
            <Link key={cahier.slug} href={`/magazines/${cahier.slug}`} className="not-found-cahier-link">
              {cahier.title}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="not-found-actions">
          <Link href="/" className="not-found-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
            <span>{t('not_found_back_home')}</span>
          </Link>
          <Link href="/espace-lecture" className="not-found-btn-secondary">
            {t('not_found_reading_hub')}
          </Link>
        </div>
      </div>
    </main>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function MagazinesClient({ magazines }) {
  const { t } = useLanguage();

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hover transitions & optimizations for the chosen magazine layout */
        .mag-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, opacity 0.3s ease !important;
          border-radius: 40px 0 40px 0 !important;
          overflow: hidden !important;
          height: 400px !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .mag-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(163, 6, 38, 0.15);
          opacity: 0.95;
        }

        .mag-card-img {
          overflow: hidden !important;
          height: 220px !important;
          width: 100% !important;
        }

        .mag-card-img img {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        .mag-card:hover .mag-card-img img {
          transform: scale(1.06);
        }

        .mag-num {
          display: flex !important;
          align-items: baseline !important;
          gap: 6px !important;
        }

        .mag-vol-tag {
          font-size: 0.7rem !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
          opacity: 0.6 !important;
          font-weight: 500 !important;
          font-family: var(--font-primary) !important;
        }

        /* Ensure clean layout text without default blue overrides */
        .mags-list .mag-card {
          color: #FFF !important;
        }

        .mags-cta .btn-primary {
          background-color: var(--color-accent) !important;
          color: #ffffff !important;
          transition: background-color 0.3s ease, transform 0.2s ease !important;
        }

        .mags-cta .btn-primary:hover {
          background-color: #a31830 !important;
          transform: translateY(-2px);
        }
      ` }} />

      <section className="mags-hero">
        <div className="mags-hero-bg"></div>
        <div className="mags-hero-content container">
          <span className="mags-overline">{t('mags_overline')}</span>
          <h1 className="mags-title">
            {t('mags_hero_title')}
          </h1>
          <p className="mags-desc">{t('mags_hero_desc')}</p>
        </div>
      </section>

      <section className="mags-list section-padding">
        <div className="container magazines-grid">
          {(magazines || []).map((mag) => (
            <Link key={mag.slug} href={`/magazines/${mag.slug}`} className="mag-card" style={{textDecoration: "none"}}>
              <div className="mag-card-top" style={{background: mag.grad}}>
                <div className="mag-num">
                  {mag.num}
                  <span className="mag-vol-tag">{mag.vol}</span>
                </div>
                <div className="mag-icon">
                  {typeof mag.icon === 'string' && mag.icon.startsWith('<svg') ? (
                    <div dangerouslySetInnerHTML={{ __html: mag.icon }} />
                  ) : typeof mag.icon === 'string' && mag.icon ? (
                    <span className="material-symbols-outlined">{mag.icon}</span>
                  ) : (
                    mag.icon || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle></svg>
                  )}
                </div>
                <h3 className="mag-title">{mag.title}</h3>
                <p className="mag-desc">{mag.desc}</p>
              </div>
              <div className="mag-card-img">
                <img src={mag.img} alt={mag.title} width="300" height="400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mags-cta">
        <div className="container text-center">
          <h2 className="cta-title">{t('mags_cta_title')}</h2>
          <p className="cta-desc">{t('mags_cta_desc')}</p>
          <Link href="/abonnement" className="btn btn-primary">{t('mags_cta_btn')}</Link>
        </div>
      </section>
    </main>
  );
}

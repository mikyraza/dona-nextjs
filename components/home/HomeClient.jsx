'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getArticleSlug } from '@/lib/slugHelper.js';

export default function HomeClient({ magazines, mainFeature, side1, side2 }) {
  const { t } = useLanguage();

  // Find magazine slug for an article category
  const getMagSlugForCat = (cat) => {
    const clean = (cat || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = (magazines || []).find(m => {
      const mClean = (m.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const sClean = (m.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return clean.includes(mClean) || clean.includes(sClean);
    });
    return found ? found.slug : "magazine-01-intelligence";
  };

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="home-hero">
        <img src="/assets/core/img/home_hero_1782125665964.png" alt="Femme Solaire" className="home-hero-bg" width="1440" height="810" />
        <div className="home-hero-content">
          <span className="home-hero-overline">{t('home_hero_overline')}</span>
          <h1 className="home-hero-title">
            {t('home_hero_title').split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}<br />
              </React.Fragment>
            ))}
          </h1>
          <p className="home-hero-subtitle">{t('home_hero_subtitle')}</p>
          <Link href="/manifeste" className="btn btn-primary">{t('home_hero_cta')}</Link>
        </div>
      </section>

      {/* ─── Magazines Section ─── */}
      <section className="home-magazines container section-padding">
        <div className="section-header">
          <div className="sh-left">
            <h2 className="section-title">{t('home_mags_title')}</h2>
            <p className="section-desc">{t('home_mags_desc')}</p>
          </div>
          <div className="sh-right">
            <Link href="/magazines" className="link-arrow">{t('home_mags_view_all')}</Link>
          </div>
        </div>
        <div className="magazines-grid">
          {(magazines || []).map((mag) => (
            <Link key={mag.slug} href={`/magazines/${mag.slug}`} className="mag-card" style={{ textDecoration: "none" }}>
              <div className="mag-card-top" style={{ background: mag.grad }}>
                <div className="mag-num">{mag.num}</div>
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

      {/* ─── À la Une Section ─── */}
      <section className="home-alaune section-padding">
        <div className="container">
          <h2 className="section-title-center">{t('home_alaune_title')}</h2>
          
          <div className="alaune-grid">
            {/* Main Feature */}
            {mainFeature && (
              <article className="alaune-main">
                <Link href={`/magazines/${getMagSlugForCat(mainFeature.category)}/articles/${getArticleSlug(mainFeature)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="alaune-main-img">
                    <span className="badge badge-red">{mainFeature.category?.toUpperCase() || 'INTELLIGENCE'}</span>
                    <img src={mainFeature.coverImage || "/assets/core/img/home_alaune_main_1782125698619.png"} alt={mainFeature.title} width="800" height="500" />
                  </div>
                  <h3 className="alaune-main-title">{mainFeature.title}</h3>
                  <p className="alaune-main-desc">{mainFeature.desc}</p>
                  <div className="alaune-meta">
                    {t('home_alaune_by')} {mainFeature.author?.toUpperCase() || 'ÉLÉNA MORETTI'} • {mainFeature.updated || t('home_alaune_recent')}
                  </div>
                </Link>
              </article>
            )}
            
            {/* Side Features */}
            <div className="alaune-side">
              {side1 && (
                <article className="alaune-side-item">
                  <Link href={`/magazines/${getMagSlugForCat(side1.category)}/articles/${getArticleSlug(side1)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '16px' }}>
                    <img src={side1.coverImage || "/assets/core/img/home_alaune_side1_1782125709654.png"} alt={side1.title} className="alaune-side-img" width="120" height="120" />
                    <div className="alaune-side-content">
                      <span className="alaune-side-cat">{side1.category?.toUpperCase() || 'HÉRITAGE'}</span>
                      <h4 className="alaune-side-title">{side1.title}</h4>
                      <p className="alaune-side-desc">{side1.desc}</p>
                    </div>
                  </Link>
                </article>
              )}
              
              {side2 && (
                <article className="alaune-side-item">
                  <Link href={`/magazines/${getMagSlugForCat(side2.category)}/articles/${getArticleSlug(side2)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '16px' }}>
                    <img src={side2.coverImage || "/assets/core/img/home_alaune_side2_1782125722981.png"} alt={side2.title} className="alaune-side-img" width="120" height="120" />
                    <div className="alaune-side-content">
                      <span className="alaune-side-cat">{side2.category?.toUpperCase() || 'AGENDA'}</span>
                      <h4 className="alaune-side-title">{side2.title}</h4>
                      <p className="alaune-side-desc">{side2.desc}</p>
                    </div>
                  </Link>
                </article>
              )}
              
              <div className="alaune-podcast">
                <div className="podcast-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-accent)"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  <span>{t('home_podcast_label')}</span>
                </div>
                <h4 className="podcast-title">{t('home_podcast_title')}</h4>
                <Link href="/studio" className="podcast-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>
                  {t('home_podcast_cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Philosophy Section ─── */}
      <section className="home-philosophy section-padding">
        <div className="container philosophy-grid">
          <div className="philosophy-text">
            <h2 className="phil-title">{t('home_phil_title')}</h2>
            <p className="phil-desc">{t('home_phil_desc1')}</p>
            <blockquote className="phil-quote">{t('home_phil_quote')}</blockquote>
            <p className="phil-desc">{t('home_phil_desc2')}</p>
            <Link href="/abonnement" className="btn btn-primary btn-large">{t('home_phil_cta')}</Link>
          </div>
          <div className="philosophy-image">
            <img src="/assets/core/img/home_philosophy_woman_1782125677007.png" alt="Femme DONA" width="600" height="600" />
            <div className="philosophy-badge">
              {t('home_phil_badge')}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section className="home-pricing">
        <div className="container">
          <div className="pricing-header">
            <h2>{t('home_pricing_title')}</h2>
            <p>{t('home_pricing_subtitle')}</p>
          </div>
          
          <div className="pricing-grid">
            {/* Digitale */}
            <div className="pricing-card">
              <h3 className="plan-name">{t('home_plan_digital')}</h3>
              <div className="plan-price">15€<span>{t('home_plan_per_month')}</span></div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_digital_f1')}</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_digital_f2')}</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_digital_f3')}</li>
              </ul>
              <Link href="/abonnement" className="btn btn-outline-red">{t('home_plan_sub_digital')}</Link>
            </div>
            
            {/* Intégrale */}
            <div className="pricing-card card-featured">
              <div className="plan-badge">{t('home_plan_recommended')}</div>
              <h3 className="plan-name">{t('home_plan_integral')}</h3>
              <div className="plan-price">29€<span>{t('home_plan_per_month')}</span></div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_integral_f1')}</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_integral_f2')}</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_integral_f3')}</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_integral_f4')}</li>
              </ul>
              <Link href="/abonnement" className="btn btn-primary">{t('home_plan_sub_integral')}</Link>
            </div>
            
            {/* Cercle */}
            <div className="pricing-card">
              <h3 className="plan-name">{t('home_plan_cercle')}</h3>
              <div className="plan-price">950€<span>{t('home_plan_per_year')}</span></div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_cercle_f1')}</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_cercle_f2')}</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> {t('home_plan_cercle_f3')}</li>
              </ul>
              <Link href="/club" className="btn btn-outline-red">{t('home_plan_sub_cercle')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter Section ─── */}
      <section className="home-newsletter">
        <div className="container">
          <div className="newsletter-box">
            <div className="nl-overline">{t('home_nl_overline')}</div>
            <h2 className="nl-title">{t('home_nl_title')}</h2>
            <p className="nl-desc">{t('home_nl_desc')}</p>
            <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t('home_nl_placeholder')} required />
              <button type="submit" className="btn btn-primary">{t('home_nl_btn')}</button>
            </form>
            <div className="nl-disclaimer">{t('home_nl_disclaimer')}</div>
          </div>
        </div>
      </section>
    </>
  );
}

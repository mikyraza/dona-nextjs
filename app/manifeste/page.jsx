"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function ManifestePage() {
  const { t, currentLangObj } = useLanguage();
  const isRTL = currentLangObj?.dir === 'rtl';

  return (
    <main style={{ direction: currentLangObj?.dir || 'ltr' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .manifesto-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 24px 120px;
        }
        .manifesto-header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 40px 0 60px;
            max-width: 900px;
        }
        .manifesto-text p {
            margin-bottom: 40px;
            font-family: 'Cormorant Garamond', serif;
            font-size: 22px;
            line-height: 1.8;
            text-align: justify;
            color: var(--color-text);
        }
        .manifesto-text p.has-dropcap::first-letter {
            font-family: 'Playfair Display', serif;
            font-size: 80px;
            line-height: 60px;
            padding-top: 4px;
            padding-right: ${isRTL ? '2px' : '14px'};
            padding-left: ${isRTL ? '14px' : '2px'};
            float: ${isRTL ? 'right' : 'left'};
            color: #8B002A;
            font-weight: 300;
        }
        .manifesto-quote {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-style: italic;
            line-height: 1.4;
            margin: 60px 0;
            padding: ${isRTL ? '10px 40px 10px 0' : '10px 0 10px 40px'};
            border-left: ${isRTL ? 'none' : '2px solid #8B002A'};
            border-right: ${isRTL ? '2px solid #8B002A' : 'none'};
            color: var(--color-text);
            text-align: ${isRTL ? 'right' : 'left'};
            letter-spacing: -0.01em;
        }
        .manifesto-section-title {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 600;
            margin: 60px 0 24px;
            color: #8B002A;
            font-style: italic;
            text-align: ${isRTL ? 'right' : 'left'};
        }
    ` }} />

    <div className="manifesto-container">
        {/* Dynamic Breadcrumbs */}
        <div style={{ paddingTop: "32px" }}>
          <Breadcrumbs 
            items={[
              { label: t('footer_manifesto') || "Manifeste", isCurrent: true }
            ]}
          />
        </div>

        <header className="manifesto-header">
            <span style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "600", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B002A", marginBottom: "24px"}}>
              {t('manifesto_tag')}
            </span>
            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: "300", lineHeight: "1.1", margin: "0", maxWidth: "750px", textAlign: isRTL ? 'right' : 'left'}}>
                {t('manifesto_title_prefix')} <span style={{fontStyle: "italic", fontWeight: "400"}}>{t('manifesto_title_word1')}</span> {t('manifesto_title_and')} <span style={{fontStyle: "italic", fontWeight: "400"}}>{t('manifesto_title_word2')}</span>.
            </h1>
        </header>

        <article className="manifesto-text">
            <p className="has-dropcap">
                {t('manifesto_intro')}
            </p>

            <blockquote className="manifesto-quote">
                {t('manifesto_quote')}
            </blockquote>

            <h2 className="manifesto-section-title">{t('manifesto_sec1_title')}</h2>
            <p>
                {t('manifesto_sec1_text')}
            </p>

            <h2 className="manifesto-section-title">{t('manifesto_sec2_title')}</h2>
            <p>
                {t('manifesto_sec2_text')}
            </p>

            <h2 className="manifesto-section-title">{t('manifesto_sec3_title')}</h2>
            <p>
                {t('manifesto_sec3_text')}
            </p>
            
            <div style={{borderTop: "1px solid var(--color-border)", paddingTop: "40px", marginTop: "80px", textAlign: "center"}}>
                <p style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px"}}>
                  {t('manifesto_author')}
                </p>
                <p style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "var(--color-text-muted)"}}>
                  {t('manifesto_location')}
                </p>
            </div>
        </article>
    </div>
    </main>
  );
}

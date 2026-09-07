"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function MentionsLegalesPage() {
  const { t } = useLanguage();

  return (
    <main style={{ background: "var(--color-bg)", color: "var(--color-text)", minHeight: "80vh", padding: "60px 20px 80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumbs items={[{ label: t('legal_title') || 'Mentions Légales' }]} />
        </div>

        <Link href="/" style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "var(--color-accent)", textDecoration: "none", textTransform: "uppercase" }}>
          {t('legal_back_home') || "← Retour à l'accueil"}
        </Link>

        <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "40px", fontWeight: "700", margin: "24px 0 12px 0", letterSpacing: "-0.02em" }}>
          {t('legal_title')}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "40px" }}>
          {t('legal_updated')}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", lineHeight: "1.7", fontSize: "15px" }}>
          
          <section style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
              {t('legal_sec1_title')}
            </h2>
            <p>
              {t('legal_sec1_p1')}
            </p>
            <p style={{ marginTop: "8px" }}>
              <strong>{t('legal_headquarters')}</strong> 12 Rue de la Paix, 75002 Paris, France<br />
              <strong>{t('legal_pub_director')}</strong> Elena Moretti<br />
              <strong>{t('legal_contact_label')}</strong> contact@donamagazine.com | +33 (0)1 42 68 00 00
            </p>
          </section>

          <section style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
              {t('legal_sec2_title')}
            </h2>
            <p>
              {t('legal_sec2_desc')}
            </p>
          </section>

          <section style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
              {t('legal_sec3_title')}
            </h2>
            <p>
              {t('legal_sec3_desc')}
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
              {t('legal_sec4_title')}
            </h2>
            <p>
              {t('legal_sec4_p1')}{" "}
              <Link href="/politique-confidentialite" style={{ color: "var(--color-accent)", fontWeight: "600" }}>
                {t('footer_privacy_policy')}
              </Link>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}

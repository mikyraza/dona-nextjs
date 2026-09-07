"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Universal dynamic breadcrumbs component
 * @param {Array<{ label: string, href?: string, isCurrent?: boolean }>} items
 * @param {string} accentColor
 * @param {boolean} showHome
 */
export default function Breadcrumbs({ items = [], accentColor, showHome = true, style = {} }) {
  const { t } = useLanguage();
  const colorAccent = accentColor || "var(--color-accent, #a31835)";

  const breadcrumbsList = [];
  if (showHome) {
    breadcrumbsList.push({
      label: t('breadcrumb_home') || "Accueil",
      href: "/"
    });
  }

  items.forEach(item => {
    // Translate standard keys if matched
    let label = item.label;
    const lower = (label || '').toLowerCase().trim();
    if (lower === 'nos magazines' || lower === 'magazines') {
      label = t('breadcrumb_magazines');
    } else if (lower === 'today') {
      label = t('breadcrumb_today');
    } else if (lower === 'studio') {
      label = t('breadcrumb_studio');
    } else if (lower === 'club' || lower === 'le club') {
      label = t('breadcrumb_club');
    } else if (lower === 'manifeste') {
      label = t('footer_manifesto');
    } else if (lower === 'contact' || lower === 'hub de contact') {
      label = t('footer_contact_hub');
    } else if (lower === 'équipe' || lower === 'equipe' || lower === 'équipe de rédaction') {
      label = t('footer_editorial_team');
    } else if (lower === 'emploi') {
      label = t('footer_jobs');
    } else if (lower === 'recrutement') {
      label = t('footer_recruitment');
    } else if (lower === 'mentions légales' || lower === 'mentions legales') {
      label = t('footer_legal_notices');
    } else if (lower === 'politique de confidentialité' || lower === 'politique de confidentialite') {
      label = t('footer_privacy_policy');
    } else if (lower === 'recherche' || lower === 'search') {
      label = t('search');
    }
    breadcrumbsList.push({ ...item, label });
  });

  return (
    <nav 
      aria-label="Breadcrumb"
      className="breadcrumbs"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        fontSize: "0.75rem",
        fontWeight: "600",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: "var(--color-text-muted, #888)",
        ...style
      }}
    >
      {breadcrumbsList.map((crumb, idx) => {
        const isLast = idx === breadcrumbsList.length - 1;
        return (
          <React.Fragment key={crumb.href || idx}>
            {idx > 0 && (
              <span 
                className="breadcrumbs-sep" 
                style={{ opacity: 0.5, userSelect: "none" }}
                aria-hidden="true"
              >
                /
              </span>
            )}
            {isLast || !crumb.href ? (
              <span 
                style={{ color: colorAccent, fontWeight: "700" }}
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link 
                href={crumb.href} 
                style={{ 
                  textDecoration: "none", 
                  color: "inherit", 
                  transition: "color 0.2s ease" 
                }}
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

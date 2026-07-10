import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { magazines } from '../data';

export default async function MagazineLayout({ children, params }) {
  const resolvedParams = await params;
  const { magazineSlug } = resolvedParams;

  const magazine = magazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  if (!magazine) {
    notFound();
  }

  const primaryColor = magazine.themePrimary || "var(--color-accent)";

  return (
    <div className="magazine-sub-context" style={{ background: "var(--color-bg)" }}>
      {/* Dynamic Sub-header Navigation Context */}
      <div style={{ borderBottom: "1px solid var(--color-border)", padding: "16px 0", background: "var(--color-bg-alt)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "var(--font-primary)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", background: primaryColor, color: "#FFFFFF", padding: "4px 8px", borderRadius: "2px" }}>
              N° {magazine.id.toString().padStart(2, '0')}
            </span>
            <Link href={`/magazines/${magazineSlug}`} style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "700", textTransform: "uppercase", color: "var(--color-text)", textDecoration: "none", letterSpacing: "-0.01em" }}>
              {magazine.title}
            </Link>
          </div>
          
          <nav style={{ display: "flex", gap: "24px", fontFamily: "var(--font-primary)", fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em" }}>
            <Link href={`/magazines/${magazineSlug}`} className="mag-nav-link" style={{ textDecoration: "none", color: "var(--color-text-muted)", transition: "color 0.2s" }}>
              INDEX
            </Link>
            <Link href={`/magazines/${magazineSlug}/studio`} className="mag-nav-link" style={{ textDecoration: "none", color: "var(--color-text-muted)", transition: "color 0.2s" }}>
              STUDIO AUDIOVISUEL
            </Link>
            <Link href={`/magazines/${magazineSlug}/vip`} className="mag-nav-link" style={{ textDecoration: "none", color: "var(--color-text-muted)", transition: "color 0.2s" }}>
              CLUB VIP
            </Link>
          </nav>
        </div>
      </div>
      
      <style>{`
        .mag-nav-link:hover {
          color: ${primaryColor} !important;
        }
      `}</style>
      
      {children}
    </div>
  );
}

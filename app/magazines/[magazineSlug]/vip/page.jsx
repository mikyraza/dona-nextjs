import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { magazines } from '../../data';

export default async function VipPage({ params }) {
  const resolvedParams = await params;
  const { magazineSlug } = resolvedParams;

  const magazine = magazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  if (!magazine) {
    notFound();
  }

  const primaryColor = magazine.themePrimary || "#a31835";

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "85vh", padding: "80px 20px" }}>
      <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Paywall Container */}
        <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "64px 48px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.01)" }}>
          
          <div style={{ width: "64px", height: "64px", background: "var(--color-bg)", border: "1px solid var(--color-border)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "50%", marginBottom: "32px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>stars</span>
          </div>

          <span style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: primaryColor, textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
            ESPACE RESTREINT
          </span>
          
          <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "36px", fontWeight: "700", color: "var(--color-text)", marginBottom: "24px", letterSpacing: "-0.01em" }}>
            CERCLE PRIVÉ • {magazine.title}
          </h1>

          <div style={{ width: "40px", height: "2px", background: primaryColor, margin: "0 auto 32px" }}></div>

          <p style={{ fontFamily: "var(--font-primary)", fontSize: "15px", lineHeight: "1.7", color: "var(--color-text)", maxWidth: "600px", margin: "0 auto 40px" }}>
            Vous tentez d'accéder aux outils décisionnels, dossiers exclusifs et wébino-conférences du magazine <strong>{magazine.title}</strong>. Cette section est réservée exclusivement aux membres premium du club DONA.
          </p>

          {/* Value Props Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", margin: "0 auto 48px", textAlign: "left", maxWidth: "600px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <span className="material-symbols-outlined" style={{ color: primaryColor, fontSize: "20px" }}>check_circle</span>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)", margin: "0 0 4px 0" }}>Outils Stratégiques</h4>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: 0 }}>Accès complet à la data visualization et aux radars de risques.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <span className="material-symbols-outlined" style={{ color: primaryColor, fontSize: "20px" }}>check_circle</span>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)", margin: "0 0 4px 0" }}>Briefings Privés</h4>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: 0 }}>Réceptions et visioconférences en direct avec les auteurs.</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/abonnement" style={{ background: primaryColor, color: "#FFFFFF", textDecoration: "none", padding: "16px 36px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", transition: "background 0.2s" }}>
              S'abonner au Club
            </Link>
            <Link href="/login" style={{ border: "1px solid var(--color-border)", color: "var(--color-text)", textDecoration: "none", padding: "16px 36px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", transition: "all 0.2s" }}>
              Déjà membre ? Se connecter
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}

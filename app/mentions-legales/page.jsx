"use client";

import React from 'react';
import Link from 'next/link';

export default function MentionsLegalesPage() {
  return (
    <main style={{ background: "var(--color-bg)", color: "var(--color-text)", minHeight: "80vh", padding: "80px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <Link href="/" style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "var(--color-accent)", textDecoration: "none", textTransform: "uppercase" }}>
          ← Retour à l'accueil
        </Link>

        <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "40px", fontWeight: "700", margin: "24px 0 12px 0", letterSpacing: "-0.02em" }}>
          Mentions Légales
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "40px" }}>
          Dernière mise à jour : 27 Août 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", lineHeight: "1.7", fontSize: "15px" }}>
          
          <section style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
              1. Éditeur du Site
            </h2>
            <p>
              Le site <strong>DONA Magazine</strong> est édité par la société DONA MEDIA SAS, société par actions simplifiée au capital de 100 000 €, immatriculée au Registre du Commerce et des Sociétés sous le numéro RCS Paris B 901 234 567.
            </p>
            <p style={{ marginTop: "8px" }}>
              <strong>Siège social :</strong> 12 Rue de la Paix, 75002 Paris, France<br />
              <strong>Directrice de la Publication :</strong> Elena Moretti<br />
              <strong>Contact :</strong> contact@donamagazine.com | +33 (0)1 42 68 00 00
            </p>
          </section>

          <section style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
              2. Hébergement
            </h2>
            <p>
              Le site est hébergé sur des infrastructures hautement sécurisées cloud conformes aux normes européennes RGPD et certifiées ISO 27001.
            </p>
          </section>

          <section style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
              3. Propriété Intellectuelle
            </h2>
            <p>
              L’ensemble des éléments figurant sur le site DONA Magazine (textes, graphismes, logos, images, vidéos, audios, typographies) est protégé par le droit d’auteur et la propriété intellectuelle. Toute reproduction ou représentation totale ou partielle sans l’autorisation expresse de DONA MEDIA SAS est interdite.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
              4. Données Personnelles
            </h2>
            <p>
              Pour toute question concernant le traitement de vos données personnelles, veuillez consulter notre{" "}
              <Link href="/politique-confidentialite" style={{ color: "var(--color-accent)", fontWeight: "600" }}>
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}

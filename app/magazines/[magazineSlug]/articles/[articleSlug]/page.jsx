import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { magazines } from '../../../data';

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const { magazineSlug, articleSlug } = resolvedParams;

  const magazine = magazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  if (!magazine) {
    notFound();
  }

  let article = magazine.articles.find(a => a.id === articleSlug);
  if (!article) {
    article = {
      id: articleSlug,
      title: articleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      desc: `Analyse approfondie au coeur des enjeux contemporains de l'univers ${magazine.title}.`,
      badge: "EXCLUSIF",
      meta: "RÉDACTION • 10 MIN DE LECTURE",
      image: magazine.heroImage
    };
  }

  const primaryColor = magazine.themePrimary || "#a31835";

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "90vh", padding: "60px 0" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr minmax(300px, 800px) 1fr", gap: "40px" }}>
        
        {/* Left Sticky Sidebar (Actions) */}
        <aside style={{ gridColumn: "1" }}>
          <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: primaryColor }}>person</span>
            </div>
            
            <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--color-text-muted)" }}>
              <span className="material-symbols-outlined">volume_up</span>
              <span style={{ fontSize: "9px", fontWeight: "700" }}>ÉCOUTER</span>
            </button>
            
            <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--color-text-muted)" }}>
              <span className="material-symbols-outlined">bookmark</span>
              <span style={{ fontSize: "9px", fontWeight: "700" }}>SAUVER</span>
            </button>
          </div>
        </aside>

        {/* Center Main Article Column */}
        <div style={{ gridColumn: "2" }}>
          {/* Article Header */}
          <header style={{ marginBottom: "40px" }}>
            <span style={{ background: primaryColor, color: "#FFFFFF", fontSize: "10px", fontWeight: "700", padding: "4px 8px", borderRadius: "2px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {article.badge}
            </span>
            
            <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "40px", fontWeight: "700", color: "var(--color-text)", marginTop: "20px", marginBottom: "16px", lineHeight: "1.2", letterSpacing: "-0.02em" }}>
              {article.title}
            </h1>
            
            <p style={{ fontFamily: "var(--font-primary)", fontSize: "18px", lineHeight: "1.5", color: "var(--color-text-muted)", marginBottom: "24px", fontStyle: "italic" }}>
              {article.desc}
            </p>
            
            <div style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "12px 0" }}>
              {article.meta}
            </div>
          </header>

          {/* Article Hero Image */}
          {article.image && (
            <div style={{ width: "100%", aspectRatio: "21/9", borderRadius: "2px", overflow: "hidden", border: "1px solid var(--color-border)", marginBottom: "48px" }}>
              <img src={article.image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* Article Content */}
          <div className="article-body" style={{ fontFamily: "var(--font-primary)", fontSize: "16px", lineHeight: "1.8", color: "var(--color-text)" }}>
            <p style={{ marginBottom: "24px" }}>
              <span style={{ float: "left", fontSize: "48px", fontWeight: "700", color: primaryColor, fontFamily: "var(--font-secondary)", marginRight: "12px", lineHeight: "1" }}>L</span>
              a complexité inhérente aux nouvelles structures informationnelles exige un recalibrage complet de nos modèles d'analyse stratégique. Dans un écosystème globalisé où le flux de données prime sur le territoire physique, la prise de décision stratégique ne peut plus reposer sur des paradigmes statiques.
            </p>
            
            <p style={{ marginBottom: "32px" }}>
              Les décideurs de premier plan constatent quotidiennement la convergence des risques. L'accélération technologique, loin d'apporter la clarté espérée, produit souvent un bruit informationnel complexe à l'intérieur duquel la détection des signaux faibles s'avère critique.
            </p>

            <blockquote style={{ borderLeft: `3px solid ${primaryColor}`, paddingLeft: "24px", fontFamily: "var(--font-secondary)", fontSize: "20px", fontStyle: "italic", margin: "40px 0", color: "var(--color-text-muted)", lineHeight: "1.6" }}>
              "L'accès illimité à l'information ne produit pas l'intelligence ; c'est la rigueur de la structure d'analyse qui en extrait la valeur stratégique."
            </blockquote>

            {/* Key Takeaways Panel */}
            <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "32px", marginBottom: "48px" }}>
              <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "18px", fontWeight: "600", margin: "0 0 16px 0", color: "var(--color-text)" }}>À Retenir</h3>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <li>La souveraineté numérique redéfinit les frontières géopolitiques traditionnelles.</li>
                <li>L'intelligence artificielle doit être perçue comme un outil d'augmentation cognitive et non comme un substitut décisionnel.</li>
                <li>La résilience des organisations passe par des circuits de décision courts et décentralisés.</li>
              </ul>
            </div>

            {/* Simulated VIP Paywall */}
            <div style={{ position: "relative", marginTop: "40px", borderTop: "1px solid var(--color-border)", paddingTop: "40px" }}>
              {/* Blurred Text Mock */}
              <div style={{ opacity: 0.15, filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
                <p style={{ marginBottom: "16px" }}>
                  Pour aller plus loin, nos chercheurs ont modélisé l'impact sectoriel à l'horizon 2030. L'intégration de modèles prédictifs hybrides permet d'anticiper avec une probabilité de 87% les futures ruptures logistiques...
                </p>
                <p>
                  Ce rapport spécial de 40 pages détaille le plan de transition recommandé pour les entreprises de taille intermédiaire et les grands groupes...
                </p>
              </div>

              {/* Paywall Card Overlay */}
              <div style={{ position: "absolute", top: "20px", inset: "0 0 0 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "40px 24px", background: "linear-gradient(to bottom, transparent, var(--color-bg) 80%)", textAlign: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: primaryColor, marginBottom: "16px" }}>lock</span>
                <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "600", color: "var(--color-text)", marginBottom: "12px" }}>
                  Débloquez la suite de cet article
                </h3>
                <p style={{ fontSize: "14px", color: "var(--color-text-muted)", maxWidth: "450px", margin: "0 auto 24px" }}>
                  Rejoignez l'Alliance DONA pour accéder à l'intégralité de nos analyses de fond et outils exclusifs.
                </p>
                <Link href="/abonnement" style={{ background: primaryColor, color: "#FFFFFF", textDecoration: "none", padding: "14px 28px", borderRadius: "2px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  S'abonner à l'Alliance
                </Link>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Empty Column (Balance spacer) */}
        <div style={{ gridColumn: "3" }}></div>

      </div>
    </main>
  );
}

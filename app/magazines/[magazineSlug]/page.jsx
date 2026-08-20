import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { magazines as staticMagazines } from '../data';
import { fetchArticles, fetchMagazineConfig } from '@/lib/wordpress';
import MagazineArticlesSection from '@/components/magazine/MagazineArticlesSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }) {
  const resolvedParams = await params;
  const { magazineSlug } = resolvedParams;

  const baseMag = staticMagazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  const dynamicConfig = await fetchMagazineConfig(magazineSlug);

  if (!baseMag && !dynamicConfig) {
    notFound();
  }

  const magazine = {
    ...baseMag,
    ...dynamicConfig
  };

  const dynamicArticles = await fetchArticles({ category: magazine.slug });
  const displayArticles = dynamicArticles.length > 0 ? dynamicArticles : (magazine.articles || []);

  const primaryColor = magazine.themePrimary || "#a31835";
  const secondaryColor = magazine.themeSecondary || "#3d0c1b";
  const vipLoginUrl = `/login?vip=1&callbackUrl=${encodeURIComponent(`/magazines/${magazineSlug}`)}`;

  return (
    <main style={{ background: "var(--color-bg)" }}>
      <div className="mag-master-layout" style={{ 
        "--mag-theme-primary": primaryColor, 
        "--mag-theme-secondary": secondaryColor 
      }}>
        
        {/* A. Hero Section */}
        <section className="mag-cover-hero" style={{
          position: "relative",
          height: "60vh",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          textAlign: "center",
          overflow: "hidden"
        }}>
          <div className="mag-hero-bg" style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: magazine.gradient || "linear-gradient(135deg, #111111, #333333)"
          }}>
            {magazine.heroImage && (
              <img 
                src={magazine.heroImage} 
                alt={`${magazine.title} Hero`} 
                className="mag-hero-img" 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.15,
                  mixBlendMode: "luminosity"
                }}
              />
            )}
            <div className="mag-hero-overlay" style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))"
            }}></div>
          </div>
          <div className="mag-hero-content container" style={{ position: "relative", zIndex: 2 }}>
            <span className="mag-hero-overline" style={{
              fontFamily: "var(--font-primary)",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.7)",
              display: "block",
              marginBottom: "16px"
            }}>
              MAGAZINE NUMÉRO {magazine.id.toString().padStart(2, '0')}
            </span>
            <h1 className="mag-hero-title" style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              marginBottom: "8px"
            }}>
              {magazine.title}
            </h1>
            <p className="mag-hero-subtitle" style={{
              fontFamily: "var(--font-primary)",
              fontSize: "18px",
              fontStyle: "italic",
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "600px",
              margin: "0 auto 32px"
            }}>
              {magazine.subtitle}
            </p>
            
            <nav className="mag-inpage-nav">
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                fontFamily: "var(--font-primary)",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em"
              }}>
                {magazine.features.map((feat, idx) => (
                  <li key={idx}>
                    <Link href={`#feature-${idx}`} style={{ color: "#FFFFFF", textDecoration: "none", textTransform: "uppercase" }}>
                      {feat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {/* B. Essence Section */}
        <section className="mag-essence container section-padding" style={{ padding: "70px 20px" }}>
          <div className="mag-essence-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "56px",
            alignItems: "center",
            maxWidth: "1120px",
            margin: "0 auto"
          }}>
            <div className="mag-essence-content" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h2 className="mag-essence-title" style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "30px",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "14px",
                letterSpacing: "-0.01em"
              }}>
                {magazine.essenceTitle || "L'Essence du Magazine"}
              </h2>
              <div className="mag-divider" style={{
                width: "40px",
                height: "2px",
                background: primaryColor,
                marginBottom: "20px"
              }}></div>
              <p className="mag-essence-text" style={{
                fontFamily: "var(--font-primary)",
                fontSize: "15px",
                lineHeight: "1.75",
                color: "var(--color-text)",
                marginBottom: "20px"
              }}>
                {magazine.essenceText}
              </p>
              {magazine.essenceQuote && (
                <blockquote className="mag-essence-quote" style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "18px",
                  fontStyle: "italic",
                  borderLeft: `3px solid ${primaryColor}`,
                  paddingLeft: "18px",
                  margin: "0 0 24px 0",
                  color: "var(--color-text-muted)",
                  lineHeight: "1.5"
                }}>
                  &ldquo;{magazine.essenceQuote}&rdquo;
                </blockquote>
              )}
              <Link href={vipLoginUrl} className="mag-link-arrow" style={{
                fontFamily: "var(--font-primary)",
                fontSize: "11px",
                fontWeight: "700",
                color: primaryColor,
                textDecoration: "none",
                letterSpacing: "0.08em",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textTransform: "uppercase"
              }}>
                ACCÉDER À LA ZONE VIP <span className="arrow" style={{ transition: "transform 0.2s" }}>→</span>
              </Link>
            </div>
            {magazine.essenceImage && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="mag-essence-img-wrapper" style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "400px",
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  borderRadius: "3px",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.06)"
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={magazine.essenceImage} 
                    alt={magazine.essenceTitle || "L'Essence du Magazine"} 
                    className="mag-essence-img" 
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* C. Features Cards Section */}
        <section className="mag-features" style={{
          background: "var(--color-bg-alt)",
          padding: "60px 20px",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)"
        }}>
          <div className="container mag-features-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px"
          }}>
            {magazine.features && magazine.features.map((feat, idx) => {
              // Determine appropriate destination URL for each feature card
              const matchingArticle = displayArticles.find(a => 
                (a.rubrique && a.rubrique.toLowerCase() === feat.title.toLowerCase()) ||
                (a.badge && a.badge.toLowerCase() === feat.title.toLowerCase()) ||
                (a.subcategory && a.subcategory.toLowerCase() === feat.title.toLowerCase()) ||
                (a.title && a.title.toLowerCase().includes(feat.title.toLowerCase()))
              );

              let featUrl = feat.url || feat.link || feat.href;
              if (!featUrl) {
                if (matchingArticle) {
                  featUrl = `/magazines/${magazineSlug}/articles/${matchingArticle.id}`;
                } else {
                  const fLower = `${feat.title || ''} ${feat.subtitle || ''}`.toLowerCase();
                  if (fLower.includes("radar") || fLower.includes("net map") || fLower.includes("beta test") || fLower.includes("metrics") || fLower.includes("vip")) {
                    featUrl = `/magazines/${magazineSlug}/vip`;
                  } else if (fLower.includes("studio") || fLower.includes("direct") || fLower.includes("live") || fLower.includes("pulse")) {
                    featUrl = `/magazines/${magazineSlug}/studio`;
                  } else {
                    featUrl = `/magazines/${magazineSlug}#articles`;
                  }
                }
              }

              return (
                <Link
                  key={idx}
                  id={`feature-${idx}`}
                  href={featUrl}
                  className="mag-feature-card"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    padding: "32px 24px",
                    borderRadius: "2px",
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer"
                  }}
                >
                  <div className="feature-icon" style={{ color: primaryColor, marginBottom: "20px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                      {feat.icon || "explore"}
                    </span>
                  </div>
                  <h3 className="feature-title" style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "var(--color-text)",
                    marginBottom: "8px"
                  }}>
                    {feat.title}
                  </h3>
                  <p className="feature-subtitle" style={{
                    fontFamily: "var(--font-primary)",
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-muted)",
                    marginBottom: "16px",
                    textTransform: "uppercase"
                  }}>
                    {feat.subtitle}
                  </p>
                  <hr className="feature-line" style={{
                    border: "none",
                    height: "1px",
                    background: "var(--color-border)",
                    margin: "auto 0 16px 0"
                  }} />
                  <div className="feature-meta" style={{
                    fontFamily: "var(--font-primary)",
                    fontSize: "9px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    color: "var(--color-text-muted)"
                  }}>
                    {feat.meta}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* D. Articles Grid with Interactive Category Switching Tabs */}
        <MagazineArticlesSection
          articles={displayArticles}
          tabs={magazine.tabs}
          magazineSlug={magazineSlug}
          primaryColor={primaryColor}
        />

        {/* E. Tools Section */}
        <section className="mag-tools" style={{
          background: "var(--color-bg-alt)",
          borderTop: "1px solid var(--color-border)",
          padding: "80px 20px"
        }}>
          <div className="container">
            <div className="mag-tools-header" style={{
              textAlign: "center",
              marginBottom: "48px"
            }}>
              <h2 className="mag-tools-title" style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "8px"
              }}>
                Outils de l'Univers
              </h2>
              <span className="mag-tools-overline" style={{
                fontFamily: "var(--font-primary)",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                color: primaryColor,
                textTransform: "uppercase"
              }}>
                RÉSERVÉ AUX MEMBRES ALLIANCE
              </span>
            </div>
            
            <div className="mag-tools-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px"
            }}>
              {magazine.tools.map((tool, idx) => {
                // Determine appropriate redirect destination for each tool
                let targetUrl = tool.url || tool.link || tool.href;
                if (!targetUrl) {
                  const tLower = `${tool.title || ''} ${tool.desc || ''}`.toLowerCase();
                  if (tLower.includes("studio") || tLower.includes("direct") || tLower.includes("live") || tLower.includes("vidéo") || tLower.includes("broadcast")) {
                    targetUrl = `/magazines/${magazineSlug}/studio`;
                  } else if (tLower.includes("jeu") || tLower.includes("quiz") || tLower.includes("casse-tête") || tLower.includes("énigme")) {
                    targetUrl = `/jeux`;
                  } else if (tLower.includes("lecture") || tLower.includes("dossier") || tLower.includes("revue") || tLower.includes("pdf") || tLower.includes("rapport")) {
                    targetUrl = `/espace-lecture`;
                  } else if (tLower.includes("podcast") || tLower.includes("audio") || tLower.includes("écoute") || tLower.includes("voix")) {
                    targetUrl = `/ecouter`;
                  } else if (tLower.includes("abonnement") || tLower.includes("souscription") || tLower.includes("tarif")) {
                    targetUrl = `/abonnement`;
                  } else {
                    // Strategic Universe Tools (Data Viz, Alertes, Veille, Simulation, Radar, Cartographie, Benchmarks, etc.)
                    targetUrl = `/magazines/${magazineSlug}/vip`;
                  }
                }

                return (
                  <Link
                    key={idx}
                    href={targetUrl}
                    className="mag-tool-item"
                    style={{
                      display: "flex",
                      gap: "20px",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "3px",
                      padding: "24px",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      position: "relative"
                    }}
                  >
                    <div className="mag-tool-icon" style={{
                      width: "48px",
                      height: "48px",
                      background: "var(--color-bg-alt)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: primaryColor,
                      flexShrink: 0
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                        {tool.icon || "build"}
                      </span>
                    </div>
                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                        <h3 className="mag-tool-title" style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "17px",
                          fontWeight: "600",
                          color: "var(--color-text)",
                          margin: 0
                        }}>
                          {tool.title}
                        </h3>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: primaryColor, opacity: 0.8 }}>
                          north_east
                        </span>
                      </div>
                      <p className="mag-tool-desc" style={{
                        fontFamily: "var(--font-primary)",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "var(--color-text-muted)",
                        margin: "0 0 14px 0",
                        flexGrow: 1
                      }}>
                        {tool.desc}
                      </p>
                      <div style={{
                        marginTop: "auto",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px",
                        fontWeight: "700",
                        color: primaryColor,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                      }}>
                        <span>Accéder à l&apos;outil</span>
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* F. Pricing CTA */}
        <section className="mag-pricing-cta section-padding" style={{ padding: "80px 20px" }}>
          <div className="container">
            <div className="mag-pricing-container" style={{
              border: `1px solid var(--color-border)`,
              borderRadius: "2px",
              padding: "48px",
              background: "var(--color-bg)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.01)",
              textAlign: "center"
            }}>
              <h2 className="mag-pricing-title" style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "32px"
              }}>
                Accédez aux analyses exclusives
              </h2>
              
              <div className="mag-pricing-action" style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/abonnement" style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  background: primaryColor,
                  color: "#FFFFFF",
                  padding: "16px 36px",
                  borderRadius: "2px",
                  transition: "background 0.2s"
                }}>
                  Devenir Membre Premium
                </Link>
                <Link href={vipLoginUrl} style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: `1px solid var(--color-border)`,
                  color: "var(--color-text)",
                  padding: "16px 36px",
                  borderRadius: "2px",
                  transition: "all 0.2s"
                }}>
                  Entrer dans la Zone VIP
                </Link>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </main>
  );
}

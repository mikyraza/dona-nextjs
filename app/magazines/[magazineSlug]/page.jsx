import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { magazines } from '../data';

export default async function Page({ params }) {
  const resolvedParams = await params;
  const { magazineSlug } = resolvedParams;

  const magazine = magazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  if (!magazine) {
    notFound();
  }

  const primaryColor = magazine.themePrimary || "#a31835";
  const secondaryColor = magazine.themeSecondary || "#3d0c1b";

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
        <section className="mag-essence container section-padding" style={{ padding: "80px 20px" }}>
          <div className="mag-essence-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "center"
          }}>
            <div className="mag-essence-content">
              <h2 className="mag-essence-title" style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "32px",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "16px"
              }}>
                L'Essence du Magazine
              </h2>
              <div className="mag-divider" style={{
                width: "40px",
                height: "2px",
                background: primaryColor,
                marginBottom: "24px"
              }}></div>
              <p className="mag-essence-text" style={{
                fontFamily: "var(--font-primary)",
                fontSize: "16px",
                lineHeight: "1.7",
                color: "var(--color-text)",
                marginBottom: "24px"
              }}>
                {magazine.essenceText}
              </p>
              {magazine.essenceQuote && (
                <blockquote className="mag-essence-quote" style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "20px",
                  fontStyle: "italic",
                  borderLeft: `3px solid ${primaryColor}`,
                  paddingLeft: "20px",
                  margin: "0 0 32px 0",
                  color: "var(--color-text-muted)",
                  lineHeight: "1.5"
                }}>
                  "{magazine.essenceQuote}"
                </blockquote>
              )}
              <Link href={`/magazines/${magazineSlug}/vip`} className="mag-link-arrow" style={{
                fontFamily: "var(--font-primary)",
                fontSize: "12px",
                fontWeight: "700",
                color: primaryColor,
                textDecoration: "none",
                letterSpacing: "0.05em",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}>
                ACCÉDER À LA ZONE VIP <span className="arrow" style={{ transition: "transform 0.2s" }}>→</span>
              </Link>
            </div>
            {magazine.essenceImage && (
              <div className="mag-essence-img-wrapper" style={{
                position: "relative",
                aspectRatio: "4/3",
                overflow: "hidden",
                borderRadius: "2px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.03)"
              }}>
                <img 
                  src={magazine.essenceImage} 
                  alt="Essence" 
                  className="mag-essence-img" 
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
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
            {magazine.features.map((feat, idx) => (
              <div key={idx} id={`feature-${idx}`} className="mag-feature-card" style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                padding: "32px 24px",
                borderRadius: "2px",
                display: "flex",
                flexDirection: "column"
              }}>
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
              </div>
            ))}
          </div>
        </section>

        {/* D. Articles Grid */}
        <section className="mag-articles container section-padding" style={{ padding: "80px 20px" }}>
          <h2 style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "28px",
            fontWeight: "700",
            color: "var(--color-text)",
            textAlign: "center",
            marginBottom: "48px",
            letterSpacing: "-0.01em"
          }}>
            Dernières parutions
          </h2>
          
          <div className="mag-articles-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px"
          }}>
            {magazine.articles.map((art, idx) => (
              <article key={idx} className="mag-article" style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                borderRadius: "2px",
                overflow: "hidden"
              }}>
                {art.image && (
                  <div className="mag-article-img-container" style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    background: "var(--color-bg-alt)"
                  }}>
                    <span className="badge" style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: primaryColor,
                      color: "#FFFFFF",
                      fontSize: "9px",
                      fontWeight: "700",
                      padding: "4px 8px",
                      borderRadius: "2px",
                      zIndex: 2,
                      letterSpacing: "0.05em"
                    }}>
                      {art.badge}
                    </span>
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                )}
                
                <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "18px",
                    fontWeight: "600",
                    lineHeight: "1.4",
                    color: "var(--color-text)",
                    marginBottom: "12px"
                  }}>
                    <Link href={`/magazines/${magazineSlug}/articles/${art.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {art.title}
                    </Link>
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-primary)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "var(--color-text-muted)",
                    marginBottom: "24px"
                  }}>
                    {art.desc}
                  </p>
                  
                  <div style={{
                    marginTop: "auto",
                    fontFamily: "var(--font-primary)",
                    fontSize: "9px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase"
                  }}>
                    {art.meta}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

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
              gap: "32px"
            }}>
              {magazine.tools.map((tool, idx) => (
                <div key={idx} className="mag-tool-item" style={{
                  display: "flex",
                  gap: "20px"
                }}>
                  <div className="mag-tool-icon" style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--color-bg)",
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
                  <div>
                    <h3 className="mag-tool-title" style={{
                      fontFamily: "var(--font-secondary)",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "var(--color-text)",
                      marginBottom: "8px"
                    }}>
                      {tool.title}
                    </h3>
                    <p className="mag-tool-desc" style={{
                      fontFamily: "var(--font-primary)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "var(--color-text-muted)"
                    }}>
                      {tool.desc}
                    </p>
                  </div>
                </div>
              ))}
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
                <Link href={`/magazines/${magazineSlug}/vip`} style={{
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

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchMagazineConfig, fetchArticleById } from '@/lib/wordpress';
import { magazines as staticMagazines } from '../../../data';
import SaveArticleButton from '@/components/article/SaveArticleButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const { magazineSlug, articleSlug } = resolvedParams;

  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role || '';
  const isVipUser = Boolean(
    session?.user && (
      !userRole || 
      userRole !== 'INACTIVE'
    )
  );

  const baseMag = staticMagazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  const dynamicConfig = await fetchMagazineConfig(magazineSlug);

  if (!baseMag && !dynamicConfig) {
    notFound();
  }

  const magazine = {
    ...baseMag,
    ...dynamicConfig
  };

  // Fetch article dynamically from database / WordPress
  let article = await fetchArticleById(articleSlug);

  // Fallback to magazine articles array if not found in db
  if (!article && magazine.articles) {
    article = magazine.articles.find(a => a.id === articleSlug || a.slug === articleSlug);
  }

  if (!article) {
    article = {
      id: articleSlug,
      title: articleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      desc: `Analyse approfondie au coeur des enjeux contemporains de l'univers ${magazine.title}.`,
      badge: "EXCLUSIF",
      meta: "RÉDACTION • 10 MIN DE LECTURE",
      image: magazine.heroImage || "/assets/core/img/mag_hero_03.png",
      content: "<p>Contenu en cours de rédaction par le comité éditorial.</p>"
    };
  }

  const primaryColor = magazine.themePrimary || "#a31835";
  const authorName = (article.author || "Elena Moretti").toUpperCase();
  const displayBadge = (article.rubrique || article.badge || "ARTICLE").toUpperCase();
  const coverImg = article.coverImage || article.image || magazine.heroImage;
  const gallery = article.articleGallery || article.galerie_photos || [];
  const currentPath = `/magazines/${magazineSlug}/articles/${articleSlug}`;
  const loginUrl = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "90vh", padding: "60px 0" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr minmax(300px, 800px) 1fr", gap: "40px" }}>
        
        {/* Left Sticky Sidebar (Actions) */}
        <aside style={{ gridColumn: "1" }}>
          <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: primaryColor }}>person</span>
            </div>
            
            {isVipUser ? (
              <>
                <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--color-text-muted)" }}>
                  <span className="material-symbols-outlined">volume_up</span>
                  <span style={{ fontSize: "9px", fontWeight: "700" }}>ÉCOUTER</span>
                </button>
                
                <SaveArticleButton
                  articleId={article.id || articleSlug}
                  title={article.title}
                  meta={article.meta || displayBadge}
                  image={coverImg}
                  ctaHref={currentPath}
                  primaryColor={primaryColor}
                />
              </>
            ) : (
              <Link href={loginUrl} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: primaryColor, textDecoration: "none" }}>
                <span className="material-symbols-outlined">lock</span>
                <span style={{ fontSize: "9px", fontWeight: "700" }}>VIP</span>
              </Link>
            )}

            <Link href={`/magazines/${magazineSlug}`} style={{ marginTop: "40px", border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--color-text)", textDecoration: "none" }}>
              <span className="material-symbols-outlined">arrow_back</span>
              <span style={{ fontSize: "9px", fontWeight: "700" }}>RETOUR</span>
            </Link>
          </div>
        </aside>

        {/* Center Main Article Column */}
        <div style={{ gridColumn: "2" }}>
          {/* Article Header */}
          <header style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ background: primaryColor, color: "#FFFFFF", fontSize: "10px", fontWeight: "700", padding: "4px 8px", borderRadius: "2px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {magazine.title.toUpperCase()} • {displayBadge}
              </span>
              
              {isVipUser ? (
                <span style={{ background: "#DCFCE7", color: "#166534", fontSize: "10px", fontWeight: "700", padding: "4px 8px", borderRadius: "2px", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>verified</span>
                  ACCÈS VIP ACTIF
                </span>
              ) : (
                <span style={{ background: "#FEF3C7", color: "#B45309", fontSize: "10px", fontWeight: "700", padding: "4px 8px", borderRadius: "2px", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>lock</span>
                  RÉSUMÉ PUBLIC • DÉTAILS VIP
                </span>
              )}
            </div>
            
            <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "700", color: "var(--color-text)", marginBottom: "16px", lineHeight: "1.25", letterSpacing: "-0.02em" }}>
              {article.title}
            </h1>
            
            <div style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "12px 0", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span>PAR <strong>{authorName}</strong></span>
              <span>•</span>
              <span>{article.updated || "RÉCENT"}</span>
              {article.format === 'audio' && <><span>•</span><span>🎙 PODCAST</span></>}
              {article.format === 'video' && <><span>•</span><span>▶ VIDÉO</span></>}
            </div>
          </header>

          {/* Résumé / Chapeau (Accessible to ALL users) */}
          {(article.desc || article.summary) && (
            <div style={{
              background: "var(--color-bg-alt)",
              borderLeft: `4px solid ${primaryColor}`,
              borderRadius: "2px",
              padding: "24px 26px",
              marginBottom: "32px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: primaryColor, display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>short_text</span>
                  Résumé Éditorial (Extrait Public)
                </div>
                {!isVipUser && (
                  <span style={{ fontSize: "10px", background: "#FEF3C7", color: "#B45309", padding: "2px 8px", borderRadius: "2px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Détails Réservés aux Abonnés
                  </span>
                )}
              </div>

              <p style={{
                fontFamily: "var(--font-primary)",
                fontSize: "17px",
                lineHeight: "1.7",
                color: "var(--color-text)",
                margin: "0 0 18px 0",
                fontStyle: "italic"
              }}>
                {article.desc || article.summary}
              </p>

              {/* Direct Directory to Subscription page */}
              {!isVipUser && (
                <div style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--color-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  background: "rgba(0,0,0,0.02)",
                  padding: "12px 16px",
                  borderRadius: "2px"
                }}>
                  <div style={{ fontSize: "13px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: primaryColor }}>auto_awesome</span>
                    <span>Pour débloquer l&apos;intégralité de l&apos;article et accéder aux détails exclusifs :</span>
                  </div>
                  <Link
                    href="/abonnement"
                    style={{
                      background: primaryColor,
                      color: "#FFFFFF",
                      textDecoration: "none",
                      padding: "8px 18px",
                      borderRadius: "2px",
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    S&apos;abonner pour voir les détails
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Article Hero Image */}
          {coverImg && (
            <div style={{ width: "100%", aspectRatio: "21/9", borderRadius: "2px", overflow: "hidden", border: "1px solid var(--color-border)", marginBottom: "36px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImg} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* IF VIP USER: FULL DETAILS (CONTENT, VIDEO, AUDIO, GALLERY) */}
          {isVipUser ? (
            <div className="article-body" style={{ fontFamily: "var(--font-primary)", fontSize: "16px", lineHeight: "1.8", color: "var(--color-text)" }}>
              {/* Video Player if video format */}
              {article.format === 'video' && article.videoUrl && (
                <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "4px", overflow: "hidden", marginBottom: "32px", background: "#000" }}>
                  {article.videoUrl.includes("youtube.com") || article.videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={article.videoUrl.replace("watch?v=", "embed/")}
                      title={article.title}
                      style={{ width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video controls src={article.videoUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  )}
                </div>
              )}

              {/* Audio Player if audio format */}
              {article.format === 'audio' && article.audioFile && (
                <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "16px 20px", marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "28px", color: primaryColor }}>podcasts</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)" }}>Épisode Audio Exclusif</div>
                    <audio controls src={article.audioFile} style={{ width: "100%", marginTop: "8px" }} />
                  </div>
                </div>
              )}

              {/* Full Article Content */}
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <p style={{ marginBottom: "24px" }}>{article.desc}</p>
              )}

              {/* Photo Gallery if attached */}
              {gallery && gallery.length > 0 && (
                <div style={{ marginTop: "40px", borderTop: "1px solid var(--color-border)", paddingTop: "32px" }}>
                  <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>Galerie Photos</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    {gallery.map((photo, pIdx) => {
                      const src = typeof photo === 'string' ? photo : photo.url;
                      return (
                        <div key={pIdx} style={{ borderRadius: "4px", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Galerie ${pIdx + 1}`} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* IF NORMAL USER: DETAILS LOCKED & REDIRECTION TO VIP LOGIN */
            <div style={{ marginTop: "24px" }}>
              <div style={{
                position: "relative",
                background: "linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 100%)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                padding: "48px 32px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px"
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#B45309" }}>lock</span>
                </div>

                <h2 style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "var(--color-text)",
                  marginBottom: "12px"
                }}>
                  Accès aux Détails Réservé aux Membres VIP
                </h2>

                <p style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "var(--color-text-muted)",
                  maxWidth: "520px",
                  marginBottom: "32px"
                }}>
                  Vous visualisez actuellement le <strong>résumé public</strong> de cette publication. L&apos;analyse approfondie, les enquêtes complètes et les contenus exclusifs sont réservés aux membres abonnés du Cercle VIP DONA.
                </p>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                  <Link
                    href={loginUrl}
                    style={{
                      background: primaryColor,
                      color: "#FFFFFF",
                      textDecoration: "none",
                      padding: "14px 28px",
                      borderRadius: "2px",
                      fontSize: "12px",
                      fontWeight: "700",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>login</span>
                    Se connecter à mon compte VIP
                  </Link>

                  <Link
                    href="/abonnement"
                    style={{
                      background: "transparent",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      textDecoration: "none",
                      padding: "14px 24px",
                      borderRadius: "2px",
                      fontSize: "12px",
                      fontWeight: "600",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    Devenir Membre VIP
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Balance spacer) */}
        <div style={{ gridColumn: "3" }}></div>

      </div>
    </main>
  );
}

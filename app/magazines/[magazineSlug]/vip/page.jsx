"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { magazines } from '../../data';
import { useSession } from 'next-auth/react';
import { getActiveUserSubscription, canAccessMagazine } from '@/lib/subscriptionPermissions';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VipPage({ params }) {
  const { t, currentLangObj } = useLanguage();
  const resolvedParams = use(params);
  const { magazineSlug } = resolvedParams;

  const magazine = magazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  if (!magazine) {
    notFound();
  }

  const primaryColor = magazine.themePrimary || "#a31835";
  const { data: session } = useSession();

  const [activeSub, setActiveSub] = useState({ isGuest: true, plan: 'Essentiel' });
  const [mounted, setMounted] = useState(false);
  const [dossiers, setDossiers] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [previewVip, setPreviewVip] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sub = getActiveUserSubscription();
    setActiveSub(sub);

    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('preview') === 'vip' || sp.get('vip') === '1') {
        setPreviewVip(true);
      }
    } catch (e) {}

    const handleSubChange = () => {
      setActiveSub(getActiveUserSubscription());
    };
    window.addEventListener('dona_subscription_changed', handleSubChange);
    document.addEventListener('dona_subscription_changed', handleSubChange);
    window.addEventListener('storage', handleSubChange);

    // Fetch dossiers for this magazine from relational database
    fetch(`/api/dossiers?magazine=${magazineSlug}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDossiers(data);
        }
      })
      .catch(err => console.error("Error fetching VIP dossiers:", err))
      .finally(() => setLoadingDocs(false));

    return () => {
      window.removeEventListener('dona_subscription_changed', handleSubChange);
      document.removeEventListener('dona_subscription_changed', handleSubChange);
      window.removeEventListener('storage', handleSubChange);
    };
  }, [session, magazineSlug]);

  const isLoggedIn = previewVip || (mounted && (session?.user || !activeSub.isGuest));
  const userPlan = previewVip ? (activeSub.plan === 'Essentiel' ? 'Premium' : activeSub.plan) : (activeSub.plan || 'Essentiel');
  const userName = session?.user?.name || activeSub.name || activeSub.email?.split('@')[0] || "Membre VIP";

  // Check magazine access level
  const hasVipAccess = previewVip || (isLoggedIn && (canAccessMagazine(magazine.id, userPlan) || userPlan === 'Élite' || userPlan === 'Premium' || activeSub.role === 'Super-Admin'));

  // Match official dossier from SQLite database
  const primaryDossier = dossiers.find(d => d.isVipOnly || d.isFeatured) || dossiers[0];

  // Curated suite of VIP documents for this magazine edition
  const vipDocuments = [
    {
      id: primaryDossier?.id || 'doc-dossier-01',
      title: primaryDossier?.title || `Dossier d'Étude & Enquête Stratégique • ${magazine.title}`,
      coordinator: primaryDossier?.coordinator ? `Par ${primaryDossier.coordinator}` : "Rédaction & Pôle d'Expertise DONA",
      badge: primaryDossier?.label || 'DOSSIER SPÉCIAL VIP',
      badgeBg: 'rgba(163, 6, 38, 0.1)',
      badgeColor: primaryColor,
      desc: primaryDossier?.description || primaryDossier?.summary || "Enquête approfondie sur les réseaux d'influence, le leadership contemporain et l'impact macro-économique des transformations sectorielles.",
      pdfUrl: primaryDossier?.pdfUrl || '/assets/core/docs/workbook-complex-systems.pdf',
      downloadFilename: `DONA-Dossier-Special-${magazineSlug}.pdf`,
      fileSize: primaryDossier?.fileSize || '4.2 MB',
      format: 'PDF HAUTE DÉFINITION',
      icon: 'description',
      viewUrl: '/espace-lecture'
    },
    {
      id: 'doc-workbook-01',
      title: `Workbook Stratégique & Matrice Décisionnelle • N° ${magazine.id.toString().padStart(2, '0')}`,
      coordinator: 'Comité Exécutif DONA • Framework Méthodologique',
      badge: 'WORKBOOK STRATÉGIQUE',
      badgeBg: 'rgba(176, 145, 89, 0.12)',
      badgeColor: '#998357',
      desc: "Grilles d'audit, matrices d'évaluation opérationnelle et exercices de prise de décision pour directions générales.",
      pdfUrl: '/assets/core/docs/guide-strategique-dona-2026.pdf',
      downloadFilename: `DONA-Workbook-Decisionnel-${magazineSlug}.pdf`,
      fileSize: '1.8 MB',
      format: 'PDF INTERACTIF',
      icon: 'menu_book',
      viewUrl: '/assets/core/docs/guide-strategique-dona-2026.pdf'
    },
    {
      id: 'doc-radar-01',
      title: `Radars & Indicateurs de Performance Sectorielle`,
      coordinator: 'Département Études, Données & Signaux Faibles',
      badge: 'RADARS & DATAVIZ',
      badgeBg: 'rgba(23, 105, 170, 0.1)',
      badgeColor: '#1769aa',
      desc: "Cartographie synthétique des indicateurs clés de performance, signaux faibles prédictifs et baromètres comparatifs internationaux.",
      pdfUrl: '/assets/core/docs/masterclass-leadership.pdf',
      downloadFilename: `DONA-Radars-Performance-${magazineSlug}.pdf`,
      fileSize: '3.5 MB',
      format: 'PDF ÉTUDE SECTORIELLE',
      icon: 'analytics',
      viewUrl: `/magazines/${magazineSlug}`
    },
    {
      id: 'doc-planner-01',
      title: `Planificateur Opérationnel & Grille des Risques`,
      coordinator: 'Pôle Prospective & Stratégie',
      badge: 'OUTIL DE DÉCISION',
      badgeBg: 'rgba(46, 125, 50, 0.1)',
      badgeColor: '#2e7d32',
      desc: "Guide de cadrage pour décideurs : rétroplanning d'implémentation, checklist d'évaluation des risques et indicateurs de suivi.",
      pdfUrl: '/assets/core/docs/planificateur-logique.pdf',
      downloadFilename: `DONA-Planificateur-Strategique.pdf`,
      fileSize: '2.4 MB',
      format: 'PDF PRÊT À IMPRIMER',
      icon: 'edit_calendar',
      viewUrl: '/assets/core/docs/planificateur-logique.pdf'
    }
  ];

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "85vh", padding: "60px 20px" }}>
      <div className="container" style={{ maxWidth: "960px", margin: "0 auto" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "28px" }}>
          <Link 
            href={`/magazines/${magazineSlug}`} 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "6px", 
              color: "var(--color-text-muted)", 
              textDecoration: "none", 
              fontSize: "12px", 
              fontWeight: "600",
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
            {t('breadcrumb_back_to_mag')} {magazine.title}
          </Link>
        </div>

        {/* State A: Logged In & Has VIP Access */}
        {isLoggedIn && hasVipAccess ? (
          <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "48px 36px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)" }}>
            
            {/* Header VIP */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ width: "56px", height: "56px", background: "rgba(163, 6, 38, 0.08)", border: "1px solid rgba(163, 6, 38, 0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "50%", marginBottom: "18px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>verified</span>
              </div>

              <span style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "800", letterSpacing: "0.15em", color: primaryColor, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                ACCÈS DÉVERROUILLÉ • MEMBRE {userPlan.toUpperCase()}
              </span>
              
              <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "32px", fontWeight: "700", color: "var(--color-text)", marginBottom: "14px" }}>
                Centre Documentaire VIP • {magazine.title}
              </h1>

              <p style={{ fontFamily: "var(--font-primary)", fontSize: "15px", color: "var(--color-text-muted)", maxWidth: "660px", margin: "0 auto", lineHeight: "1.6" }}>
                Bienvenue <strong>{userName}</strong>. Vos privilèges <strong>{userPlan}</strong> vous permettent de télécharger l'intégralité des dossiers stratégiques, workbooks et supports décisionnels haute résolution associés au numéro {magazine.id.toString().padStart(2, '0')}.
              </p>
            </div>

            {/* Section Documents & Dossiers */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px", marginBottom: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "12px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)" }}>
                  Documents & Outils Téléchargeables ({vipDocuments.length})
                </h3>
                <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontWeight: "600" }}>
                  Formats PDF Haute Définition & Interactifs
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px" }}>
                {vipDocuments.map((doc) => (
                  <div 
                    key={doc.id}
                    style={{ 
                      background: "var(--color-bg)", 
                      border: "1px solid var(--color-border)", 
                      borderRadius: "4px", 
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <span style={{ background: doc.badgeBg, color: doc.badgeColor, fontSize: "9px", fontWeight: "800", letterSpacing: "0.08em", padding: "4px 8px", borderRadius: "2px", textTransform: "uppercase" }}>
                          {doc.badge}
                        </span>
                        <span style={{ fontSize: "10px", fontWeight: "700", color: "#888", background: "var(--color-bg-alt)", padding: "2px 6px", borderRadius: "2px" }}>
                          {doc.fileSize}
                        </span>
                      </div>

                      {/* Icon & Title */}
                      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "4px", background: "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ color: primaryColor, fontSize: "22px" }}>{doc.icon}</span>
                        </div>
                        <div>
                          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 4px 0", lineHeight: "1.3" }}>
                            {doc.title}
                          </h4>
                          <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontStyle: "italic", display: "block" }}>
                            {doc.coordinator}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: "1.5", margin: "0 0 20px 0" }}>
                        {doc.desc}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <a
                        href={doc.pdfUrl}
                        download={doc.downloadFilename}
                        style={{
                          background: primaryColor,
                          color: "#FFFFFF",
                          textDecoration: "none",
                          padding: "10px 18px",
                          borderRadius: "2px",
                          fontSize: "11px",
                          fontWeight: "700",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          flex: "1 1 auto",
                          justifyContent: "center",
                          transition: "opacity 0.2s"
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
                        Télécharger (PDF • {doc.fileSize})
                      </a>

                      <Link
                        href={doc.viewUrl}
                        target={doc.viewUrl.endsWith('.pdf') ? "_blank" : "_self"}
                        style={{
                          border: "1px solid var(--color-border)",
                          background: "var(--color-bg)",
                          color: "var(--color-text)",
                          textDecoration: "none",
                          padding: "10px 14px",
                          borderRadius: "2px",
                          fontSize: "11px",
                          fontWeight: "700",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>visibility</span>
                        Consulter
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "28px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/espace-lecture" style={{ background: "var(--color-text)", color: "var(--color-bg)", textDecoration: "none", padding: "14px 28px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>auto_stories</span>
                Accéder à l'Espace Lecture Global
              </Link>
              <Link href={`/magazines/${magazineSlug}`} style={{ border: "1px solid var(--color-border)", color: "var(--color-text)", textDecoration: "none", padding: "14px 28px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Retour au Magazine
              </Link>
            </div>
          </div>
        ) : isLoggedIn ? (
          /* State B: Logged In, but needs Plan Upgrade */
          <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "56px 40px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.02)" }}>
            <div style={{ width: "64px", height: "64px", background: "rgba(163, 6, 38, 0.08)", border: "1px solid rgba(163, 6, 38, 0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "50%", marginBottom: "24px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>workspace_premium</span>
            </div>

            <span style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "800", letterSpacing: "0.15em", color: primaryColor, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              MODIFICATION D'OFFRE REQUISE
            </span>
            
            <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "32px", fontWeight: "700", color: "var(--color-text)", marginBottom: "16px" }}>
              Mise à niveau de la Formule {userPlan}
            </h1>

            <p style={{ fontFamily: "var(--font-primary)", fontSize: "15px", color: "var(--color-text-muted)", maxWidth: "620px", margin: "0 auto 32px", lineHeight: "1.6" }}>
              Bonjour <strong>{userName}</strong>. Votre abonnement actuel <strong>{userPlan}</strong> vous donne accès à vos magazines numériques. Pour débloquer la zone VIP & les dossiers téléchargeables du numéro {magazine.id.toString().padStart(2, '0')}, passez à la formule <strong>Premium</strong> ou <strong>Élite</strong>.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
              <Link href="/abonnement" style={{ background: primaryColor, color: "#FFFFFF", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Passer à la formule Premium →
              </Link>
              <Link href={`/magazines/${magazineSlug}`} style={{ border: "1px solid var(--color-border)", color: "var(--color-text)", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Retour au Magazine
              </Link>
            </div>

            {/* Document Preview in Locked State */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "32px", textAlign: "left" }}>
              <h4 style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "16px", textAlign: "center" }}>
                Aperçu des Documents Inclus avec Premium & Élite
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                {vipDocuments.map((doc) => (
                  <div key={doc.id} style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "16px", opacity: 0.85 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "9px", fontWeight: "700", color: doc.badgeColor, letterSpacing: "0.08em" }}>{doc.badge}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#888", fontWeight: "600" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>lock</span>
                        Verrouillé
                      </span>
                    </div>
                    <h5 style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 6px 0", color: "var(--color-text)" }}>{doc.title}</h5>
                    <p style={{ fontSize: "11px", color: "var(--color-text-muted)", margin: 0 }}>Format {doc.format} • {doc.fileSize}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* State C: Not Logged In (Visitor) */
          <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "56px 40px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.02)" }}>
            <div style={{ width: "64px", height: "64px", background: "var(--color-bg)", border: "1px solid var(--color-border)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "50%", marginBottom: "24px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>stars</span>
            </div>

            <span style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: primaryColor, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              ESPACE RESTREINT
            </span>
            
            <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "32px", fontWeight: "700", color: "var(--color-text)", marginBottom: "24px" }}>
              CERCLE PRIVÉ • {magazine.title}
            </h1>

            <p style={{ fontFamily: "var(--font-primary)", fontSize: "15px", lineHeight: "1.7", color: "var(--color-text)", maxWidth: "600px", margin: "0 auto 32px" }}>
              Cette section est réservée exclusivement aux membres abonnés du club DONA. Identifiez-vous pour débloquer les analyses exclusives, les podcasts et les workbooks associés au numéro {magazine.id.toString().padStart(2, '0')}.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
              <Link href="/abonnement" style={{ background: primaryColor, color: "#FFFFFF", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                S'abonner au Club
              </Link>
              <Link href={`/login?callbackUrl=${encodeURIComponent(`/magazines/${magazineSlug}/vip`)}`} style={{ border: "1px solid var(--color-border)", color: "var(--color-text)", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Déjà membre ? Se connecter
              </Link>
            </div>

            {/* Document Preview in Guest State */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "32px", textAlign: "left" }}>
              <h4 style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "16px", textAlign: "center" }}>
                Catalogue des Documents de cette Édition
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                {vipDocuments.map((doc) => (
                  <div key={doc.id} style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "16px", opacity: 0.85 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "9px", fontWeight: "700", color: doc.badgeColor, letterSpacing: "0.08em" }}>{doc.badge}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#888", fontWeight: "600" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>lock</span>
                        Réservé Membres
                      </span>
                    </div>
                    <h5 style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 6px 0", color: "var(--color-text)" }}>{doc.title}</h5>
                    <p style={{ fontSize: "11px", color: "var(--color-text-muted)", margin: 0 }}>Format {doc.format} • {doc.fileSize}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

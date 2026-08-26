"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { magazines } from '../../data';
import { useSession } from 'next-auth/react';
import { getActiveUserSubscription, canAccessMagazine } from '@/lib/subscriptionPermissions';

export default function VipPage({ params }) {
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

  useEffect(() => {
    setMounted(true);
    const sub = getActiveUserSubscription();
    setActiveSub(sub);

    const handleSubChange = () => {
      setActiveSub(getActiveUserSubscription());
    };
    window.addEventListener('dona_subscription_changed', handleSubChange);
    return () => window.removeEventListener('dona_subscription_changed', handleSubChange);
  }, [session]);

  const isLoggedIn = mounted && (session?.user || !activeSub.isGuest);
  const userPlan = activeSub.plan || 'Essentiel';
  const userName = session?.user?.name || activeSub.name || activeSub.email?.split('@')[0] || "Membre";

  // Check magazine access level
  const hasVipAccess = isLoggedIn && (canAccessMagazine(magazine.id, userPlan) || userPlan === 'Élite' || userPlan === 'Premium' || activeSub.role === 'Super-Admin');

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "85vh", padding: "80px 20px" }}>
      <div className="container" style={{ maxWidth: "850px", margin: "0 auto" }}>
        
        {/* State A: Logged In & Has VIP Access */}
        {isLoggedIn && hasVipAccess ? (
          <div style={{ background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "56px 40px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.02)" }}>
            <div style={{ width: "64px", height: "64px", background: "rgba(163, 6, 38, 0.08)", border: "1px solid rgba(163, 6, 38, 0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: primaryColor, borderRadius: "50%", marginBottom: "24px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>verified</span>
            </div>

            <span style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "800", letterSpacing: "0.15em", color: primaryColor, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              ACCÈS DÉVERROUILLÉ • MEMBRE {userPlan.toUpperCase()}
            </span>
            
            <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "32px", fontWeight: "700", color: "var(--color-text)", marginBottom: "16px" }}>
              Zone VIP • {magazine.title}
            </h1>

            <p style={{ fontFamily: "var(--font-primary)", fontSize: "15px", color: "var(--color-text-muted)", maxWidth: "620px", margin: "0 auto 32px", lineHeight: "1.6" }}>
              Bienvenue <strong>{userName}</strong>. En tant que membre <strong>{userPlan}</strong>, vous avez accès à l'ensemble des analyses stratégiques, des modules dataviz et des documents d'étude du numéro {magazine.id.toString().padStart(2, '0')}.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", textAlign: "left", marginBottom: "40px" }}>
              <div style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", padding: "20px", borderRadius: "4px" }}>
                <span className="material-symbols-outlined" style={{ color: primaryColor, marginBottom: "8px" }}>analytics</span>
                <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px", color: "var(--color-text)" }}>Radars & Performance</h4>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: 0 }}>Analyse comparative des indicateurs de tendance et prévisions sectorielles.</p>
              </div>
              <div style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", padding: "20px", borderRadius: "4px" }}>
                <span className="material-symbols-outlined" style={{ color: primaryColor, marginBottom: "8px" }}>download_for_offline</span>
                <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px", color: "var(--color-text)" }}>Workbook & PDF Haute Définition</h4>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: 0 }}>Téléchargez le dossier complet format impression et fiches d'exercices.</p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/espace-lecture" style={{ background: primaryColor, color: "#FFFFFF", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Consulter dans l'Espace Lecture
              </Link>
              <Link href={`/magazines/${magazineSlug}`} style={{ border: "1px solid var(--color-border)", color: "var(--color-text)", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
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

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/abonnement" style={{ background: primaryColor, color: "#FFFFFF", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Passer à la formule Premium →
              </Link>
              <Link href={`/magazines/${magazineSlug}`} style={{ border: "1px solid var(--color-border)", color: "var(--color-text)", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Retour au Magazine
              </Link>
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

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/abonnement" style={{ background: primaryColor, color: "#FFFFFF", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                S'abonner au Club
              </Link>
              <Link href={`/login?callbackUrl=${encodeURIComponent(`/magazines/${magazineSlug}/vip`)}`} style={{ border: "1px solid var(--color-border)", color: "var(--color-text)", textDecoration: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Déjà membre ? Se connecter
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

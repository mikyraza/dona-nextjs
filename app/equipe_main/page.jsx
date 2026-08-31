"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const DEFAULT_SETTINGS = {
  heroTitle: "Les voix de DONA",
  heroSubtitle: "Des expertes mondiales au service de votre excellence.",
  introText: "DONA rassemble des intellectuelles, dirigeantes et créatrices qui partagent une vision : celle d'une femme solaire, affirmée et bâtisseuse. Chaque contributrice apporte son expertise unique pour vous accompagner dans votre parcours d'excellence.",
  categories: ["Tous", "Intelligence", "Lifestyle", "Impact", "Culture"],
  expertes: [
    {
      id: "exp-1",
      name: "Pr Nora Patrius",
      role: "Géopolitologue & Stratège",
      tags: "GEOPOLITIQUE   INTELLIGENCE ECONOMIQUE   PROSPECTIVE",
      websiteUrl: "/article-trends-intelligence",
      emailUrl: "mailto:nora.patrius@dona-magazine.com",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "exp-2",
      name: "Dr Clarisse Bama",
      role: "Sociologue & Leadership",
      tags: "SOCIOLOGIE   PSYCHOLOGIE DU LEADERSHIP   DIVERSITE",
      websiteUrl: "/article-trends-intelligence",
      emailUrl: "",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"
    }
  ],
  contributrices: [
    { id: "con-1", name: "Elena Rostova", role: "Critique d'Art Contemporain", category: "Culture", contributionsUrl: "/today", photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=120&auto=format&fit=crop" },
    { id: "con-2", name: "Sarah Jenks", role: "Experte en Finance Durable", category: "Impact", contributionsUrl: "/today", photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=120&auto=format&fit=crop" },
    { id: "con-3", name: "Amira Kassis", role: "Innovatrice Tech & IA", category: "Intelligence", contributionsUrl: "/today", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop" },
    { id: "con-4", name: "Juliette Moreau", role: "Architecte d'Intérieur", category: "Lifestyle", contributionsUrl: "/today", photoUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=120&auto=format&fit=crop" },
    { id: "con-5", name: "Fatima Diop", role: "Chef Gastronomique", category: "Lifestyle", contributionsUrl: "/today", photoUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=120&auto=format&fit=crop" },
    { id: "con-6", name: "Chloé Lin", role: "Directrice Créative", category: "Culture", contributionsUrl: "/today", photoUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=120&auto=format&fit=crop" }
  ],
  ctaTitle: "Rejoignez l'aventure DONA",
  ctaDescription: "Vous partagez nos valeurs et souhaitez contribuer à notre vision éditoriale ? Découvrez nos opportunités ou proposez votre plume.",
  ctaOffresLabel: "Voir les offres",
  ctaOffresUrl: "/emploi",
  ctaSpontaneeLabel: "Candidature spontanée",
  ctaSpontaneeUrl: "/recrutement"
};

export default function Page() {
  const [data, setData] = useState(DEFAULT_SETTINGS);
  const [activeCategory, setActiveCategory] = useState("Tous");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dona_settings_equipe');
        if (stored) {
          setData(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error loading equipe settings:', e);
      }
    }
  }, []);

  const categories = data.categories && data.categories.length > 0 
    ? data.categories 
    : ["Tous", "Intelligence", "Lifestyle", "Impact", "Culture"];

  const filteredContributrices = activeCategory === "Tous" 
    ? data.contributrices 
    : data.contributrices.filter(con => con.category === activeCategory);

  return (
    <main>
      {/* HERO : fond blanc, centré */}
      <section style={{background: "var(--color-bg)", padding: "110px 60px 0", textAlign: "center"}}>
        <h1 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "56px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 16px 0"}}>{data.heroTitle}</h1>
        <p style={{fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--color-text-muted)", margin: "0 0 56px 0"}}>{data.heroSubtitle}</p>
        {/* Bloc intro texte : fond gris très léger, full-width */}
        <div style={{background: "var(--color-bg-alt)", padding: "52px 80px", margin: "0 -60px"}}>
          <p style={{fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.95", margin: "0 auto", maxWidth: "620px", textAlign: "center"}}>
            {data.introText}
          </p>
        </div>
      </section>

      {/* NOS EXPERTES RÉFÉRENTES */}
      <section style={{padding: "72px 60px 56px", maxWidth: "1100px", margin: "0 auto"}}>
        <h2 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "30px", fontWeight: "400", color: "var(--color-text)", margin: "0 0 32px 0"}}>Nos Expertes Référentes</h2>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>

          {data.expertes.map((exp) => (
            <div key={exp.id} style={{background: "var(--color-bg-alt)", borderRadius: "3px", padding: "48px 32px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
              <div style={{width: "100px", height: "100px", borderRadius: "6px", overflow: "hidden", marginBottom: "20px"}}>
                <img src={exp.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"} alt={exp.name} style={{width: "100%", height: "100%", objectFit: "cover"}} />
              </div>
              <h3 style={{fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 6px 0"}}>{exp.name}</h3>
              <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "600", color: "#8B002A", margin: "0 0 20px 0"}}>{exp.role}</p>
              <p style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", margin: "0 0 24px 0"}}>{exp.tags}</p>
              <div style={{display: "flex", gap: "16px", alignItems: "center"}}>
                {exp.websiteUrl && (
                  <Link href={exp.websiteUrl} style={{color: "var(--color-text-muted)", display: "flex", alignItems: "center"}} title="Site web">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10z"/></svg>
                  </Link>
                )}
                {exp.emailUrl && (
                  <a href={exp.emailUrl} style={{color: "var(--color-text-muted)", display: "flex", alignItems: "center"}} title="Email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </a>
                )}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* LE CERCLE DES CONTRIBUTRICES */}
      <section style={{padding: "0 60px 56px", maxWidth: "1100px", margin: "0 auto"}}>
        {/* Titre + filtres thématiques dynamiques */}
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px"}}>
          <h2 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "30px", fontWeight: "400", color: "var(--color-text)", margin: "0"}}>Le Cercle des Contributrices</h2>
          <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button 
                  key={cat} 
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: isActive ? "#8B002A" : "var(--color-bg-alt)", 
                    color: isActive ? "#FFFFFF" : "var(--color-text-muted)", 
                    border: "none", 
                    borderRadius: "20px", 
                    padding: "7px 18px", 
                    fontFamily: "'Inter',sans-serif", 
                    fontSize: "11px", 
                    fontWeight: isActive ? "700" : "500", 
                    cursor: "pointer", 
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease"
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille 3 colonnes filtrée dynamiquement */}
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "28px"}}>
          {filteredContributrices.map((con) => (
            <div key={con.id} style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "3px", padding: "18px 16px", display: "flex", alignItems: "center", gap: "14px"}}>
              <img src={con.photoUrl || "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=120&auto=format&fit=crop"} alt={con.name} style={{width: "52px", height: "52px", borderRadius: "3px", objectFit: "cover", flexShrink: "0"}} />
              <div>
                <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 2px 0"}}>{con.name}</p>
                <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", margin: "0 0 5px 0"}}>{con.role}</p>
                <Link href={con.contributionsUrl || "/today"} style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", textDecoration: "none"}}>Voir ses contributions</Link>
              </div>
            </div>
          ))}

          {filteredContributrices.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Aucune contributrice trouvée pour la catégorie « {activeCategory} ».
            </div>
          )}
        </div>

        <div style={{textAlign: "center"}}>
          <Link href="/equipe" style={{fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#8B002A", textDecoration: "underline"}}>Voir tout le cercle</Link>
        </div>
      </section>

      {/* CTA REJOIGNEZ L'AVENTURE */}
      <section style={{padding: "16px 60px 80px", maxWidth: "1100px", margin: "0 auto"}}>
        <div style={{background: "var(--color-bg-alt)", borderRadius: "3px", padding: "72px 48px", textAlign: "center"}}>
          <h2 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "40px", fontWeight: "600", color: "var(--color-text)", margin: "0 0 16px 0"}}>{data.ctaTitle}</h2>
          <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--color-text-muted)", lineHeight: "1.85", margin: "0 0 40px 0"}}>{data.ctaDescription}</p>
          <div style={{display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap"}}>
            <Link href={data.ctaOffresUrl || "/emploi"} style={{display: "inline-block", background: "#8B002A", color: "#fff", border: "none", borderRadius: "2px", padding: "14px 36px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none"}}>{data.ctaOffresLabel}</Link>
            <Link href={data.ctaSpontaneeUrl || "/recrutement"} style={{display: "inline-block", background: "var(--color-bg)", color: "var(--color-text)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "14px 36px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none"}}>{data.ctaSpontaneeLabel}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

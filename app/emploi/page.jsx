"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Page() {
  const DEFAULT_SETTINGS = {
    headerCategory: "CARRIÈRES & OPPORTUNITÉS",
    title: "Rejoignez la Rédaction",
    description: "Nous pensons que les récits d'excellence ne naissent que de collaborations d'exception. DONA MAGAZINE propose un environnement stimulant où la liberté de ton et l'exigence intellectuelle sont reines.",
    jobs: [
      {
        id: "job-1",
        category: "ÉDITORIAL",
        title: "Journaliste de Mode & Art de Vivre",
        contract: "CDI • Paris 2e",
        description: "Rédaction de dossiers exclusifs, enquêtes sur la haute couture éthique et couverture des événements parisiens majeurs.",
        missions: "Rédaction d'articles de fond et d'interviews de créateurs. Veille sur les tendances émergentes du luxe responsable. Collaboration avec la direction artistique pour l'iconographie.",
        profil: "Minimum 3 ans d'expérience en journalisme de mode haut de gamme. Style d'écriture impeccable, rigoureux et poétique. Réseau établi dans le milieu de la couture.",
        posteSlug: "journaliste-mode"
      },
      {
        id: "job-2",
        category: "ART & GRAPHISME",
        title: "Concepteur Visuel / UX Designer",
        contract: "CDI • Paris / Hybride",
        description: "Conception et mise en scène interactive de nos éditions numériques et de l'expérience de lecture mobile.",
        missions: "Design d'interfaces de lecture immersives (web, mobile, tablette). Création d'animations interactives et de transitions haut de gamme. Maintien et évolution de notre charte visuelle \"Quiet Luxury\".",
        profil: "Maîtrise avancée des outils de design interactif et prototypage. Forte sensibilité esthétique minimaliste (grilles, blancs tournants). Connaissance des technologies front-end appréciée.",
        posteSlug: "concepteur-visuel"
      },
      {
        id: "job-3",
        category: "LITTÉRAIRE",
        title: "Rédacteur Culture & Société",
        contract: "CDD (12 mois) • Paris",
        description: "Production de chroniques littéraires, d'analyses philosophiques contemporaines et d'essais critiques de société.",
        missions: "Rédaction d'essais critiques mensuels et d'interviews culturelles. Animation de rubriques de débats d'idées haut de gamme. Contribution active au manifeste éditorial permanent.",
        profil: "Formation supérieure littéraire ou philosophique. Style rigoureux, érudit mais accessible. Esprit d'analyse poussé et curiosité intellectuelle sans limites.",
        posteSlug: "redacteur-culture"
      }
    ]
  };

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [openDetails, setOpenDetails] = useState({});

  useEffect(() => {
    fetch('/api/admin/settings/equipe')
      .then(res => res.json())
      .then(data => {
        if (data && data.rejoignezSettings) setSettings(data.rejoignezSettings);
      })
      .catch(err => console.error("API load error:", err));

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dona_settings_rejoignez_redaction');
        if (stored) {
          setSettings(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error reading rejoignez settings:', e);
      }
    }
  }, []);

  const toggleDetails = (jobId) => {
    setOpenDetails(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        .emploi-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 24px 120px;
        }
        .emploi-header {
            padding: 120px 0 60px;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }
        .job-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
            gap: 32px;
            margin-top: 40px;
        }
        @media(max-width: 768px) {
            .job-grid {
                grid-template-columns: 1fr;
            }
        }
        .job-card {
            border: 1px solid var(--color-border);
            padding: 40px;
            border-radius: 4px;
            background: var(--color-bg-alt);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 320px;
            transition: all 0.3s ease;
        }
        .job-card:hover {
            border-color: #8B002A;
            transform: translateY(-2px);
        }
        .job-details-drawer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px dashed var(--color-border);
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            line-height: 1.6;
            color: var(--color-text-muted);
        }
      ` }} />

      <div className="emploi-container">
        <header className="emploi-header">
          <span style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "600", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B002A", display: "block", marginBottom: "20px"}}>
            {settings.headerCategory || "CARRIÈRES & OPPORTUNITÉS"}
          </span>
          <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: "300", lineHeight: "1.2", marginBottom: "24px"}}>
            {settings.title || "Rejoignez la Rédaction"}
          </h1>
          <p style={{fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: "1.7", color: "var(--color-text-muted)", maxWidth: "650px", margin: "0 auto"}}>
            {settings.description || "Nous pensons que les récits d'excellence ne naissent que de collaborations d'exception."}
          </p>
        </header>

        <div className="job-grid">
          {(settings.jobs || []).map((job) => {
            const isOpen = !!openDetails[job.id];
            return (
              <div className="job-card" key={job.id}>
                <div>
                  <div style={{fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", color: "#8B002A", marginBottom: "16px", textTransform: "uppercase"}}>
                    {job.category || "ÉDITORIAL"}
                  </div>
                  <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "600", marginBottom: "12px", color: "var(--color-text)"}}>
                    {job.title}
                  </h3>
                  <p style={{fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", marginBottom: "20px"}}>
                    {job.description}
                  </p>
                  
                  {/* Toggleable Details Drawer */}
                  {isOpen && (
                    <div className="job-details-drawer">
                      {job.missions && (
                        <div style={{marginBottom: "12px"}}>
                          <strong style={{color: "var(--color-text)"}}>Missions :</strong><br />
                          {job.missions}
                        </div>
                      )}
                      {job.profil && (
                        <div>
                          <strong style={{color: "var(--color-text)"}}>Profil recherché :</strong><br />
                          {job.profil}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: "20px", marginBottom: "24px", fontFamily: "'Inter', sans-serif", fontSize: "12px"}}>
                    <span style={{fontWeight: "600", color: "var(--color-text)"}}>{job.contract || "CDI • Paris"}</span>
                    <button 
                      type="button" 
                      onClick={() => toggleDetails(job.id)}
                      style={{background: "none", border: "none", fontSize: "11px", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", color: "#8B002A", cursor: "pointer", padding: "4px 0"}}
                    >
                      {isOpen ? '[ Masquer les détails ]' : '[ Voir les détails ]'}
                    </button>
                  </div>

                  <Link 
                    href={`/recrutement?poste=${job.posteSlug || 'spontane'}`}
                    style={{
                      display: "block", 
                      textAlign: "center", 
                      border: "1px solid var(--color-text)", 
                      padding: "14px", 
                      fontFamily: "'Inter', sans-serif", 
                      fontSize: "12px", 
                      fontWeight: "600", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.08em", 
                      transition: "all 0.3s", 
                      textDecoration: "none", 
                      color: "var(--color-text)"
                    }} 
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-text)'; e.currentTarget.style.color = 'var(--color-bg)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text)'; }}
                  >
                    Candidater
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

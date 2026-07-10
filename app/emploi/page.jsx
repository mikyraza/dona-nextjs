import React from 'react';
import Link from 'next/link';

export default function Page() {
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
            display: none;
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
            <span style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "600", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B002A", display: "block", marginBottom: "20px"}}>CARRIÈRES & OPPORTUNITÉS</span>
            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: "300", lineHeight: "1.2", marginBottom: "24px"}}>Rejoignez la Rédaction</h1>
            <p style={{fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: "1.7", color: "var(--color-text-muted)", maxWidth: "650px", margin: "0 auto"}}>
                Nous pensons que les récits d'excellence ne naissent que de collaborations d'exception. DONA MAGAZINE propose un environnement stimulant où la liberté de ton et l'exigence intellectuelle sont reines.
            </p>
        </header>

        <div className="job-grid">
            {/* Job Card 1 */}
            <div className="job-card">
                <div>
                    <div style={{fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", color: "#8B002A", marginBottom: "16px", textTransform: "uppercase"}}>ÉDITORIAL</div>
                    <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "600", marginBottom: "12px", color: "var(--color-text)"}}>Journaliste de Mode & Art de Vivre</h3>
                    <p style={{fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", marginBottom: "20px"}}>
                        Rédaction de dossiers exclusifs, enquêtes sur la haute couture éthique et couverture des événements parisiens majeurs.
                    </p>
                    
                    {/* Hidden Details */}
                    <div className="job-details-drawer" id="details-job1">
                        <strong>Missions :</strong><br />
                        - Rédaction d'articles de fond et d'interviews de créateurs.<br />
                        - Veille sur les tendances émergentes du luxe responsable.<br />
                        - Collaboration avec la direction artistique pour l'iconographie.<br /><br />
                        <strong>Profil recherché :</strong><br />
                        - Minimum 3 ans d'expérience en journalisme de mode haut de gamme.<br />
                        - Style d'écriture impeccable, rigoureux et poétique.<br />
                        - Réseau établi dans le milieu de la couture.
                    </div>
                </div>
                <div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: "20px", marginBottom: "24px", fontFamily: "'Inter', sans-serif", fontSize: "12px"}}>
                        <span style={{fontWeight: "600", color: "var(--color-text)"}}>CDI • Paris 2e</span>
                        <button style={{background: "none", border: "none", fontSize: "11px", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", color: "#8B002A", cursor: "pointer", padding: "4px 0"}}>[ Voir les détails ]</button>
                    </div>
                    <a href="recrutement.html?poste=journaliste-mode" style={{display: "block", textAlign: "center", border: "1px solid var(--color-text)", padding: "14px", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", transition: "all 0.3s", textDecoration: "none", color: "var(--color-text)"}} onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)';" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)';">Candidater</a>
                </div>
            </div>
            
            {/* Job Card 2 */}
            <div className="job-card">
                <div>
                    <div style={{fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", color: "#8B002A", marginBottom: "16px", textTransform: "uppercase"}}>ART & GRAPHISME</div>
                    <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "600", marginBottom: "12px", color: "var(--color-text)"}}>Concepteur Visuel / UX Designer</h3>
                    <p style={{fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", marginBottom: "20px"}}>
                        Conception et mise en scène interactive de nos éditions numériques et de l'expérience de lecture mobile.
                    </p>
                    
                    {/* Hidden Details */}
                    <div className="job-details-drawer" id="details-job2">
                        <strong>Missions :</strong><br />
                        - Design d'interfaces de lecture immersives (web, mobile, tablette).<br />
                        - Création d'animations interactives et de transitions haut de gamme.<br />
                        - Maintien et évolution de notre charte visuelle "Quiet Luxury".<br /><br />
                        <strong>Profil recherché :</strong><br />
                        - Maîtrise avancée des outils de design interactif et prototypage.<br />
                        - Forte sensibilité esthétique minimaliste (grilles, blancs tournants).<br />
                        - Connaissance des technologies front-end (CSS/HTML) appréciée.
                    </div>
                </div>
                <div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: "20px", marginBottom: "24px", fontFamily: "'Inter', sans-serif", fontSize: "12px"}}>
                        <span style={{fontWeight: "600", color: "var(--color-text)"}}>CDI • Paris / Hybride</span>
                        <button style={{background: "none", border: "none", fontSize: "11px", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", color: "#8B002A", cursor: "pointer", padding: "4px 0"}}>[ Voir les détails ]</button>
                    </div>
                    <a href="recrutement.html?poste=concepteur-visuel" style={{display: "block", textAlign: "center", border: "1px solid var(--color-text)", padding: "14px", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", transition: "all 0.3s", textDecoration: "none", color: "var(--color-text)"}} onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)';" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)';">Candidater</a>
                </div>
            </div>
            
            {/* Job Card 3 */}
            <div className="job-card">
                <div>
                    <div style={{fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", color: "#8B002A", marginBottom: "16px", textTransform: "uppercase"}}>LITTÉRAIRE</div>
                    <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "600", marginBottom: "12px", color: "var(--color-text)"}}>Rédacteur Culture & Société</h3>
                    <p style={{fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.6", marginBottom: "20px"}}>
                        Production de chroniques littéraires, d'analyses philosophiques contemporaines et d'essais critiques de société.
                    </p>
                    
                    {/* Hidden Details */}
                    <div className="job-details-drawer" id="details-job3">
                        <strong>Missions :</strong><br />
                        - Rédaction d'essais critiques mensuels et d'interviews culturelles.<br />
                        - Animation de rubriques de débats d'idées haut de gamme.<br />
                        - Contribution active au manifeste éditorial permanent.<br /><br />
                        <strong>Profil recherché :</strong><br />
                        - Formation supérieure littéraire ou philosophique.<br />
                        - Style rigoureux, érudit mais accessible.<br />
                        - Esprit d'analyse poussé et curiosité intellectuelle sans limites.
                    </div>
                </div>
                <div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: "20px", marginBottom: "24px", fontFamily: "'Inter', sans-serif", fontSize: "12px"}}>
                        <span style={{fontWeight: "600", color: "var(--color-text)"}}>CDD (12 mois) • Paris</span>
                        <button style={{background: "none", border: "none", fontSize: "11px", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", color: "#8B002A", cursor: "pointer", padding: "4px 0"}}>[ Voir les détails ]</button>
                    </div>
                    <a href="recrutement.html?poste=redacteur-culture" style={{display: "block", textAlign: "center", border: "1px solid var(--color-text)", padding: "14px", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", transition: "all 0.3s", textDecoration: "none", color: "var(--color-text)"}} onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)';" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)';">Candidater</a>
                </div>
            </div>
        </div>
    </div>

    <script dangerouslySetInnerHTML={{ __html: `
        function toggleDetails(id, btn) {
            const drawer = document.getElementById('details-' + id);
            if (drawer.style.display === 'block') {
                drawer.style.display = 'none';
                btn.innerText = '[ Voir les détails ]';
            } else {
                drawer.style.display = 'block';
                btn.innerText = '[ Masquer les détails ]';
            }
        }
    ` }} />
    </main>
  );
}

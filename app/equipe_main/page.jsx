import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      {/* HERO : fond blanc, centré */}
    <section style={{background: "var(--color-bg)", padding: "110px 60px 0", textAlign: "center"}}>
        <h1 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "56px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 16px 0"}}>Les voix de DONA</h1>
        <p style={{fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--color-text-muted)", margin: "0 0 56px 0"}}>Des expertes mondiales au service de votre excellence.</p>
        {/* Bloc intro texte : fond gris très léger, full-width */}
        <div style={{background: "var(--color-bg-alt)", padding: "52px 80px", margin: "0 -60px"}}>
            <p style={{fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.95", margin: "0 auto", maxWidth: "620px", textAlign: "center"}}>
                DONA rassemble des intellectuelles, dirigeantes et créatrices qui partagent une vision : celle d'une femme solaire, affirmée et bâtisseuse. Chaque contributrice apporte son expertise unique pour vous accompagner dans votre parcours d'excellence.
            </p>
        </div>
    </section>

    {/* NOS EXPERTES RÉFÉRENTES */}
    <section style={{padding: "72px 60px 56px", maxWidth: "1100px", margin: "0 auto"}}>
        <h2 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "30px", fontWeight: "400", color: "var(--color-text)", margin: "0 0 32px 0"}}>Nos Expertes Référentes</h2>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>

            {/* Card 1 : Pr Nora Patrius */}
            <div style={{background: "var(--color-bg-alt)", borderRadius: "3px", padding: "48px 32px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                <div style={{width: "100px", height: "100px", borderRadius: "6px", overflow: "hidden", marginBottom: "20px"}}>
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop" alt="Pr Nora Patrius" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                </div>
                <h3 style={{fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 6px 0"}}>Pr Nora Patrius</h3>
                <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "600", color: "#8B002A", margin: "0 0 20px 0"}}>Géopolitologue &amp; Stratège</p>
                {/* Tags plain text, pas de chips */}
                <p style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", margin: "0 0 24px 0"}}>Géopolitique &nbsp;&nbsp; Intelligence Économique &nbsp;&nbsp; Prospective</p>
                <div style={{display: "flex", gap: "16px", alignItems: "center"}}>
                    <Link  href="#" style={{color: "var(--color-text-muted)", display: "flex", alignItems: "center"}} title="Site web">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </Link>
                    <Link  href="#" style={{color: "var(--color-text-muted)", display: "flex", alignItems: "center"}} title="Email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </Link>
                </div>
            </div>

            {/* Card 2 : Dr Clarisse Bama */}
            <div style={{background: "var(--color-bg-alt)", borderRadius: "3px", padding: "48px 32px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                <div style={{width: "100px", height: "100px", borderRadius: "6px", overflow: "hidden", marginBottom: "20px"}}>
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop" alt="Dr Clarisse Bama" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                </div>
                <h3 style={{fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 6px 0"}}>Dr Clarisse Bama</h3>
                <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "600", color: "#8B002A", margin: "0 0 20px 0"}}>Sociologue &amp; Leadership</p>
                <p style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", margin: "0 0 24px 0"}}>Sociologie &nbsp;&nbsp; Psychologie du Leadership &nbsp;&nbsp; Diversité</p>
                <div style={{display: "flex", gap: "16px", alignItems: "center"}}>
                    <Link  href="#" style={{color: "var(--color-text-muted)", display: "flex", alignItems: "center"}} title="Site web">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </Link>
                </div>
            </div>

        </div>
    </section>

    {/* LE CERCLE DES CONTRIBUTRICES */}
    <section style={{padding: "0 60px 56px", maxWidth: "1100px", margin: "0 auto"}}>
        {/* Titre + filtres */}
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px"}}>
            <h2 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "30px", fontWeight: "400", color: "var(--color-text)", margin: "0"}}>Le Cercle des Contributrices</h2>
            <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                <button style={{background: "#8B002A", color: "#fff", border: "none", borderRadius: "20px", padding: "7px 18px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.02em"}}>Tous</button>
                <button style={{background: "var(--color-bg-alt)", color: "var(--color-text-muted)", border: "none", borderRadius: "20px", padding: "7px 18px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "500", cursor: "pointer"}}>Intelligence</button>
                <button style={{background: "var(--color-bg-alt)", color: "var(--color-text-muted)", border: "none", borderRadius: "20px", padding: "7px 18px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "500", cursor: "pointer"}}>Lifestyle</button>
                <button style={{background: "var(--color-bg-alt)", color: "var(--color-text-muted)", border: "none", borderRadius: "20px", padding: "7px 18px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "500", cursor: "pointer"}}>Impact</button>
                <button style={{background: "var(--color-bg-alt)", color: "var(--color-text-muted)", border: "none", borderRadius: "20px", padding: "7px 18px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "500", cursor: "pointer"}}>Culture</button>
            </div>
        </div>

        {/* Grille 3 colonnes */}
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "28px"}}>

            <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "3px", padding: "18px 16px", display: "flex", alignItems: "center", gap: "14px"}}>
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=120&auto=format&fit=crop" alt="Elena Rostova" style={{width: "52px", height: "52px", borderRadius: "3px", objectFit: "cover", flexShrink: "0"}} />
                <div>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 2px 0"}}>Elena Rostova</p>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", margin: "0 0 5px 0"}}>Critique d'Art Contemporain</p>
                    <Link  href="#" style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", textDecoration: "none"}}>Voir ses contributions</Link>
                </div>
            </div>

            <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "3px", padding: "18px 16px", display: "flex", alignItems: "center", gap: "14px"}}>
                <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=120&auto=format&fit=crop" alt="Sarah Jenks" style={{width: "52px", height: "52px", borderRadius: "3px", objectFit: "cover", flexShrink: "0"}} />
                <div>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 2px 0"}}>Sarah Jenks</p>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", margin: "0 0 5px 0"}}>Experte en Finance Durable</p>
                    <Link  href="#" style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", textDecoration: "none"}}>Voir ses contributions</Link>
                </div>
            </div>

            <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "3px", padding: "18px 16px", display: "flex", alignItems: "center", gap: "14px"}}>
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop" alt="Amira Kassis" style={{width: "52px", height: "52px", borderRadius: "3px", objectFit: "cover", flexShrink: "0"}} />
                <div>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 2px 0"}}>Amira Kassis</p>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", margin: "0 0 5px 0"}}>Innovatrice Tech &amp; IA</p>
                    <Link  href="#" style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", textDecoration: "none"}}>Voir ses contributions</Link>
                </div>
            </div>

            <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "3px", padding: "18px 16px", display: "flex", alignItems: "center", gap: "14px"}}>
                <img src="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=120&auto=format&fit=crop" alt="Juliette Moreau" style={{width: "52px", height: "52px", borderRadius: "3px", objectFit: "cover", flexShrink: "0"}} />
                <div>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 2px 0"}}>Juliette Moreau</p>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", margin: "0 0 5px 0"}}>Architecte d'Intérieur</p>
                    <Link  href="#" style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", textDecoration: "none"}}>Voir ses contributions</Link>
                </div>
            </div>

            <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "3px", padding: "18px 16px", display: "flex", alignItems: "center", gap: "14px"}}>
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=120&auto=format&fit=crop" alt="Fatima Diop" style={{width: "52px", height: "52px", borderRadius: "3px", objectFit: "cover", flexShrink: "0"}} />
                <div>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 2px 0"}}>Fatima Diop</p>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", margin: "0 0 5px 0"}}>Chef Gastronomique</p>
                    <Link  href="#" style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", textDecoration: "none"}}>Voir ses contributions</Link>
                </div>
            </div>

            <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "3px", padding: "18px 16px", display: "flex", alignItems: "center", gap: "14px"}}>
                <img src="https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=120&auto=format&fit=crop" alt="Chloé Lin" style={{width: "52px", height: "52px", borderRadius: "3px", objectFit: "cover", flexShrink: "0"}} />
                <div>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 2px 0"}}>Chloé Lin</p>
                    <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "var(--color-text-muted)", margin: "0 0 5px 0"}}>Directrice Créative</p>
                    <Link  href="#" style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#8B002A", textDecoration: "none"}}>Voir ses contributions</Link>
                </div>
            </div>

        </div>

        <div style={{textAlign: "center"}}>
            <Link  href="#" style={{fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#8B002A", textDecoration: "underline"}}>Voir tout le cercle</Link>
        </div>
    </section>

    {/* CTA REJOIGNEZ L'AVENTURE */}
    <section style={{padding: "16px 60px 80px", maxWidth: "1100px", margin: "0 auto"}}>
        <div style={{background: "var(--color-bg-alt)", borderRadius: "3px", padding: "72px 48px", textAlign: "center"}}>
            <h2 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "40px", fontWeight: "600", color: "var(--color-text)", margin: "0 0 16px 0"}}>Rejoignez l'aventure DONA</h2>
            <p style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--color-text-muted)", lineHeight: "1.85", margin: "0 0 40px 0"}}>Vous partagez nos valeurs et souhaitez contribuer à notre vision éditoriale ?<br />Découvrez nos opportunités ou proposez votre plume.</p>
            <div style={{display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap"}}>
                <Link  href="#" style={{display: "inline-block", background: "#8B002A", color: "#fff", border: "none", borderRadius: "2px", padding: "14px 36px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none"}}>Voir les offres</Link>
                <Link  href="#" style={{display: "inline-block", background: "var(--color-bg)", color: "var(--color-text)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "14px 36px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none"}}>Candidature spontanée</Link>
            </div>
        </div>
    </section>
    </main>
  );
}

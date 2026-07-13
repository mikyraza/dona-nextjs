import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <img src="assets/core/img/home_hero_1782125665964.png" alt="Femme Solaire" className="home-hero-bg" />
        <div className="home-hero-content">
            <span className="home-hero-overline">ÉDITORIAL • PRINTEMPS 2024</span>
            <h1 className="home-hero-title">DONA :<br />L'Aube de la<br />Femme Solaire</h1>
            <p className="home-hero-subtitle">"Incarnation la puissance sans compromettre la<br />grâce, diriger avec l'évidence de la lumière."</p>
            <Link  href="#" className="btn btn-primary">DÉCOUVRIR LE MANIFESTE</Link>
        </div>
    </section>

    <section className="home-magazines container section-padding">
        <div className="section-header">
            <div className="sh-left">
                <h2 className="section-title">Les 16 Magazines</h2>
                <p className="section-desc">L'encyclopédie de la souveraineté moderne, déclinée en<br />douze dimensions fondamentales.</p>
            </div>
            <div className="sh-right">
                <Link  href="#" className="link-arrow">Voir tous les magazines</Link>
            </div>
        </div>
        <div className="magazines-grid">
            {/* 01 */}
            <Link  href="/magazine-01-intelligence" className="mag-card" style={{textDecoration: "none"}}><div className="mag-card-top" style={{background: "linear-gradient(135deg, #2b1126, #411d3d)"}}>
                    <div className="mag-num">01</div>
                    <div className="mag-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>
                    </div>
                    <h3 className="mag-title">Intelligence</h3>
                    <p className="mag-desc">Stratégies et analyses pour un esprit affûté.</p>
                </div>
                <div className="mag-card-img">
                    <img src="assets/core/img/home_mag_01_1782125759189.png" alt="Intelligence" />
                </div>
            </Link>
            {/* 02 */}
            <Link  href="/magazine-02-power-lab" className="mag-card" style={{textDecoration: "none"}}><div className="mag-card-top" style={{background: "linear-gradient(135deg, #a33827, #cf5c49)"}}>
                    <div className="mag-num">02</div>
                    <div className="mag-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                    </div>
                    <h3 className="mag-title">Power Lab</h3>
                    <p className="mag-desc">L'innovation et la performance redéfinies.</p>
                </div>
                <div className="mag-card-img">
                    <img src="assets/core/img/home_mag_02_1782125769846.png" alt="Power Lab" />
                </div>
            </Link>
            {/* 03 */}
            <Link  href="/magazine-03-alliance" className="mag-card" style={{textDecoration: "none"}}><div className="mag-card-top" style={{background: "linear-gradient(135deg, #6c1626, #9c2741)"}}>
                    <div className="mag-num">03</div>
                    <div className="mag-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0zm6 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path></svg>
                    </div>
                    <h3 className="mag-title">L'Alliance</h3>
                    <p className="mag-desc">Le pouvoir des réseaux et des connexions.</p>
                </div>
                <div className="mag-card-img">
                    <img src="assets/core/img/home_mag_03_1782125780328.png" alt="Alliance" />
                </div>
            </Link>
            {/* 04 */}
            <Link  href="/magazine-04-agenda" className="mag-card" style={{textDecoration: "none"}}><div className="mag-card-top" style={{background: "linear-gradient(135deg, #b09159, #cfb17d)"}}>
                    <div className="mag-num">04</div>
                    <div className="mag-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>
                    </div>
                    <h3 className="mag-title">L'Agenda</h3>
                    <p className="mag-desc">Maîtrisez votre temps, orchestrez votre succès.</p>
                </div>
                <div className="mag-card-img">
                    <img src="assets/core/img/home_mag_04_1782125793170.png" alt="Agenda" />
                </div>
            </Link>
            {/* 05 */}
            <Link  href="/magazine-05-passions" className="mag-card" style={{textDecoration: "none"}}><div className="mag-card-top" style={{background: "linear-gradient(135deg, #c3847e, #dfa29d)"}}>
                    <div className="mag-num">05</div>
                    <div className="mag-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>
                    </div>
                    <h3 className="mag-title">Passions</h3>
                    <p className="mag-desc">Ce qui nous anime au plus profond.</p>
                </div>
                <div className="mag-card-img">
                    <img src="assets/core/img/home_mag_05_1782125844017.png" alt="Passions" />
                </div>
            </Link>
            {/* 06 */}
            <Link  href="/magazine-06-art-de-vivre" className="mag-card" style={{textDecoration: "none"}}><div className="mag-card-top" style={{background: "linear-gradient(135deg, #c37b56, #e4976f)"}}>
                    <div className="mag-num">06</div>
                    <div className="mag-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path></svg>
                    </div>
                    <h3 className="mag-title">Art de Vivre</h3>
                    <p className="mag-desc">L'élégance dans chaque détail du quotidien.</p>
                </div>
                <div className="mag-card-img">
                    <img src="assets/core/img/home_mag_06_1782125858971.png" alt="Art de vivre" />
                </div>
            </Link>
            {/* 07 */}
            <Link  href="/magazine-07-academie" className="mag-card" style={{textDecoration: "none"}}><div className="mag-card-top" style={{background: "linear-gradient(135deg, #7c4c47, #a1645e)"}}>
                    <div className="mag-num">07</div>
                    <div className="mag-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>
                    </div>
                    <h3 className="mag-title">Académie</h3>
                    <p className="mag-desc">L'apprentissage continu pour les esprits exigeants.</p>
                </div>
                <div className="mag-card-img">
                    <img src="assets/core/img/france_1.png" alt="Academie" />
                </div>
            </Link>
            {/* 08 */}
            <Link  href="/magazine-08-patrimoine" className="mag-card" style={{textDecoration: "none"}}><div className="mag-card-top" style={{background: "linear-gradient(135deg, #998357, #bdab7d)"}}>
                    <div className="mag-num">08</div>
                    <div className="mag-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    </div>
                    <h3 className="mag-title">Patrimoine</h3>
                    <p className="mag-desc">Construire et préserver pour demain.</p>
                </div>
                <div className="mag-card-img">
                    <img src="assets/core/img/france_2.png" alt="Patrimoine" />
                </div>
            </Link>
        </div>
    </section>

    <section className="home-alaune section-padding">
        <div className="container">
            <h2 className="section-title-center">À la Une</h2>
            
            <div className="alaune-grid">
                {/* Main Feature */}
                <article className="alaune-main">
                    <div className="alaune-main-img">
                        <span className="badge badge-red">INTELLIGENCE</span>
                        <img src="assets/core/img/home_alaune_main_1782125698619.png" alt="Décoder la complexité" />
                    </div>
                    <h3 className="alaune-main-title">Décoder la Complexité : La nouvelle grammaire du Leadership</h3>
                    <p className="alaune-main-desc">Dans un monde en mutation constante, la capacité à naviguer dans l'incertitude devient le premier levier de puissance souveraine.</p>
                    <div className="alaune-meta">PAR HÉLÈNE GIRARD • 8 MIN DE LECTURE</div>
                </article>
                
                {/* Side Features */}
                <div className="alaune-side">
                    <article className="alaune-side-item">
                        <img src="assets/core/img/home_alaune_side1_1782125709654.png" alt="Art de la transmission" className="alaune-side-img" />
                        <div className="alaune-side-content">
                            <span className="alaune-side-cat">HÉRITAGE</span>
                            <h4 className="alaune-side-title">L'Art de la Transmission</h4>
                            <p className="alaune-side-desc">Comment préserver les valeurs au-delà du succès matériel.</p>
                        </div>
                    </article>
                    
                    <article className="alaune-side-item">
                        <img src="assets/core/img/home_alaune_side2_1782125722981.png" alt="Rituel du Matin" className="alaune-side-img" />
                        <div className="alaune-side-content">
                            <span className="alaune-side-cat">AGENDA</span>
                            <h4 className="alaune-side-title">Le Rituel du Matin Solaire</h4>
                            <p className="alaune-side-desc">Trois étapes pour aligner votre intention quotidienne.</p>
                        </div>
                    </article>
                    
                    <div className="alaune-podcast">
                        <div className="podcast-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-accent)"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                            <span>PODCAST • EPISODE 24</span>
                        </div>
                        <h4 className="podcast-title">"Le Silence est un Levier de Force"</h4>
                        <a href="#" className="podcast-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>
                            ÉCOUTER MAINTENANT
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="home-philosophy">
        <div className="container philosophy-grid">
            <div className="philosophy-text">
                <h2 className="phil-title">La femme DONA ne demande pas sa place. Elle l'illumine.</h2>
                <p className="phil-desc">Nous croyons que la puissance féminine n'est pas une conquête, mais une reconnaissance. Une force tranquille qui n'a pas besoin de bruit pour exister.</p>
                <blockquote className="phil-quote">"Le manifeste DONA est un appel à toutes celles qui souhaitent réconcilier ambition radicale et élégance intérieure."</blockquote>
                <p className="phil-desc">Plus qu'un magazine, une académie de l'être. Une alliance de visionnaires prêtes à redéfinir les codes de la réussite.</p>
                <Link  href="#" className="btn btn-primary btn-large">REJOINDRE L'ALLIANCE</Link>
            </div>
            <div className="philosophy-image">
                <img src="assets/core/img/home_philosophy_woman_1782125677007.png" alt="Femme DONA" />
                <div className="philosophy-badge">
                    FONDÉE SUR L'EXCELLENCE, L'INTELLIGENCE ET LA GRÂCE.
                </div>
            </div>
        </div>
    </section>

    <section className="home-pricing">
        <div className="container">
            <div className="pricing-header">
                <h2>Investissez en Votre Souveraineté</h2>
                <p>Choisissez le niveau d'engagement qui correspond à votre trajectoire.</p>
            </div>
            
            <div className="pricing-grid">
                {/* Digitale */}
                <div className="pricing-card">
                    <h3 className="plan-name">Digitale</h3>
                    <div className="plan-price">15€<span>/mois</span></div>
                    <ul className="plan-features">
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Accès aux 16 Magazines</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Newsletter Intelligence</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Archives complètes</li>
                    </ul>
                    <Link  href="#" className="btn btn-outline-red">S'ABONNER</Link>
                </div>
                
                {/* Intégrale */}
                <div className="pricing-card card-featured">
                    <div className="plan-badge">CONSEILLÉ</div>
                    <h3 className="plan-name">Intégrale</h3>
                    <div className="plan-price">29€<span>/mois</span></div>
                    <ul className="plan-features">
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Magazine Print (Trimestriel)</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Accès Digital Illimité</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Invitations aux Webinaires Académie</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Cadeau de bienvenue exclusif</li>
                    </ul>
                    <Link  href="#" className="btn btn-primary">DÉVENIR MEMBRE</Link>
                </div>
                
                {/* Cercle */}
                <div className="pricing-card">
                    <h3 className="plan-name">Cercle</h3>
                    <div className="plan-price">950€<span>/an</span></div>
                    <ul className="plan-features">
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Expériences Off-line (Dîners, Retraites)</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Networking Haute-Performance</li>
                        <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Conciergerie DONA</li>
                    </ul>
                    <Link  href="#" className="btn btn-outline-red">POSTULER AU CERCLE</Link>
                </div>
            </div>
        </div>
    </section>

    <section className="home-newsletter">
        <div className="container">
            <div className="newsletter-box">
                <div className="nl-overline">LA LETTRE SOLAIRE</div>
                <h2 className="nl-title">Recevez l'intelligence DONA directement.</h2>
                <p className="nl-desc">Chaque dimanche, une dose de lucidité et d'inspiration pour préparer votre semaine de souveraineté.</p>
                <form className="nl-form">
                    <input type="email" placeholder="votre@email.com" required />
                    <button type="submit" className="btn btn-primary">S'INSCRIRE</button>
                </form>
                <div className="nl-disclaimer">RESPECT DE VOTRE VIE PRIVÉE. DÉSABONNEMENT EN UN CLIC.</div>
            </div>
        </div>
    </section>
    </>
  );
}

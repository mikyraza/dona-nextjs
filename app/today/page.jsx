import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      {/* HERO SECTION */}
        <section className="today-hero">
            <div className="today-hero-bg">
                <img src="assets/core/img/hero_solaire.png" alt="Femme Solaire" className="hero-bg-img" />
            </div>
            <div className="today-hero-content">
                <h1 className="today-hero-title">DONA : La<br />Renaissance<br />de la Femme Solaire</h1>
                <p className="today-hero-subtitle">"Une femme affirmée, positive, ambitieuse et rayonnante,<br />en harmonie avec son époque."</p>
                <div className="today-hero-actions">
                    <Link  href="#" className="btn-primary">DÉCOUVRIR DONA</Link>
                    <Link  href="#" className="btn-secondary">LIRE LE MANIFESTE</Link>
                </div>
            </div>
        </section>

        {/* CATEGORIES FILTER */}
        <div className="today-filters">
            <ul className="filter-list">
                <li><Link  href="#" className="filter-pill active">TOUTES</Link></li>
                <li><Link  href="#" className="filter-pill">GÉOPOLITIQUE</Link></li>
                <li><Link  href="#" className="filter-pill">ÉCONOMIE</Link></li>
                <li><Link  href="#" className="filter-pill">BUSINESS</Link></li>
                <li><Link  href="#" className="filter-pill">INNOVATION</Link></li>
                <li><Link  href="#" className="filter-pill">SOCIÉTÉ</Link></li>
                <li><Link  href="#" className="filter-pill">CULTURE</Link></li>
            </ul>
        </div>

        {/* MAIN CONTENT GRID (70 / 30) */}
        <section className="today-main-grid">
            <div className="today-content-col">
                {/* Urgent Article */}
                <article className="urgent-article">
                    <div className="urgent-img-wrapper">
                        <img src="assets/core/img/featured_urgent.png" alt="Accord historique" className="urgent-img" />
                        <span className="badge-urgent">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            URGENT
                        </span>
                    </div>
                    <div className="urgent-text">
                        <h2 className="urgent-title">Accord historique sur la parité salariale au sein de l'Union Européenne</h2>
                        <p className="urgent-desc">Après des mois de négociations intenses, le Parlement a adopté ce matin une directive contraignante, marquant un tournant décisif pour l'égalité économique.</p>
                    </div>
                </article>

                {/* Fil d'actualité */}
                <div className="news-timeline">
                    <h3 className="section-overline">FIL D'ACTUALITÉ</h3>
                    <div className="timeline-list">
                        <div className="timeline-item is-new">
                            <div className="timeline-time">
                                14:30
                                <span className="badge-new">NOUVEAU</span>
                            </div>
                            <div className="timeline-content">
                                <h4 className="timeline-title">Nominations à la tête des grandes banques centrales</h4>
                                <p className="timeline-desc">Trois femmes pressenties pour diriger les institutions clés en Asie et en Europe, un signal fort pour les marchés financiers.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-time">13:15</div>
                            <div className="timeline-content">
                                <h4 className="timeline-title">COP29 : Les initiatives climatiques portées par des entrepreneures</h4>
                                <p className="timeline-desc">Le sommet met en lumière des solutions innovantes développées par des startups dirigées par des femmes dans les pays du Sud.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-time">11:45</div>
                            <div className="timeline-content">
                                <h4 className="timeline-title">Rétrospective : L'impact de l'architecture inclusive</h4>
                                <p className="timeline-desc">Comment la nouvelle vague de designers redessine les espaces publics pour plus de sécurité et de convivialité urbaine.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <aside className="today-sidebar-col">
                {/* Les Plus Lus */}
                <div className="sidebar-widget">
                    <h3 className="section-overline">LES PLUS LUS</h3>
                    <ul className="popular-list">
                        <li>
                            <span className="popular-num">01</span>
                            <span className="popular-text">Analyse : La résilience des chaines d'approvisionnement globales</span>
                        </li>
                        <li>
                            <span className="popular-num">02</span>
                            <span className="popular-text">Le renouveau du marché de l'art contemporain africain</span>
                        </li>
                        <li>
                            <span className="popular-num">03</span>
                            <span className="popular-text">Tech : Les biais algorithmiques sous le microscope</span>
                        </li>
                    </ul>
                </div>

                {/* Alertes */}
                <div className="sidebar-widget widget-alerts">
                    <h3 className="alert-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        ALERTES
                    </h3>
                    <p className="alert-text">Flash : Le conseil de sécurité de l'ONU adopte une résolution d'urgence concernant la crise en mer rouge.</p>
                </div>

                {/* Sources en direct */}
                <div className="sidebar-widget">
                    <h3 className="section-overline">SOURCES EN DIRECT</h3>
                    <div className="sources-logos">
                        <span>AFP</span>
                        <span>Reuters</span>
                        <span>Bloomberg</span>
                    </div>
                </div>
            </aside>
        </section>

        {/* NOTRE PHILOSOPHIE */}
        <section className="today-philosophy">
            <div className="philosophy-container">
                <div className="philosophy-text">
                    <h3 className="section-overline text-red">NOTRE PHILOSOPHIE</h3>
                    <h2 className="philosophy-title">Notre Vision<br />Réconciliée</h2>
                    <p className="philosophy-desc">Le magazine DONA porte une vision réconciliée de la femme moderne. Loin des clivages épuisants, nous célébrons une féminité qui embrasse la réussite professionnelle sans sacrifier la grâce, l'élégance et l'accomplissement personnel.</p>
                    
                    <ul className="philosophy-points">
                        <li>
                            <span className="check-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></span>
                            <div className="point-text">
                                <strong>L'Harmonie plutôt que le combat</strong>
                                <span>Cultiver sa force intérieure dans la sérénité.</span>
                            </div>
                        </li>
                        <li>
                            <span className="check-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></span>
                            <div className="point-text">
                                <strong>L'Ambition assumée</strong>
                                <span>Viser l'excellence dans toutes les sphères de la vie.</span>
                            </div>
                        </li>
                    </ul>

                    <blockquote className="philosophy-quote">
                        "L'élégance n'est pas de se faire remarquer, mais de s'en souvenir. C'est cette trace lumineuse que laisse la femme DONA."
                    </blockquote>
                </div>
                <div className="philosophy-image">
                    <img src="assets/core/img/vision_portrait.png" alt="Vision DONA" />
                </div>
            </div>
        </section>

        {/* LES 4 VALEURS */}
        <section className="today-values">
            <div className="values-grid">
                <div className="value-card">
                    <div className="value-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                    </div>
                    <h3 className="value-title">Heureuse</h3>
                    <p className="value-desc">Cultiver la joie quotidienne comme une discipline de vie et un moteur de créativité.</p>
                </div>
                <div className="value-card">
                    <div className="value-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    </div>
                    <h3 className="value-title">Affirmée</h3>
                    <p className="value-desc">Posséder une voix claire, poser des limites saines et assumer ses convictions.</p>
                </div>
                <div className="value-card">
                    <div className="value-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    </div>
                    <h3 className="value-title">Ambitieuse</h3>
                    <p className="value-desc">Vouloir plus grand, sans s'excuser, et se donner les moyens d'atteindre l'excellence.</p>
                </div>
                <div className="value-card">
                    <div className="value-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </div>
                    <h3 className="value-title">Rayonnante</h3>
                    <p className="value-desc">Être une source d'inspiration lumineuse pour son entourage et sa communauté.</p>
                </div>
            </div>
        </section>

        {/* FRANCE EN DIRECT */}
        <section className="today-france">
            <div className="section-header">
                <h2 className="section-title">France en Direct</h2>
                <a href="#" className="link-more">TOUT VOIR &rarr;</a>
            </div>
            <div className="france-grid">
                <article className="france-card">
                    <img src="assets/core/img/france_1.png" alt="Sénat" />
                    <div className="france-meta">
                        <span className="meta-cat">POLITIQUE</span>
                        <span className="meta-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Il y a 45 min</span>
                    </div>
                    <h3 className="france-title">Loi Égalité Professionnelle : Le Sénat adopte le texte en première lecture</h3>
                    <p className="france-desc">Les quotas dans les comités de direction des grandes entreprises seront renforcés dès 2026.</p>
                </article>
                <article className="france-card">
                    <img src="assets/core/img/france_2.png" alt="CAC 40" />
                    <div className="france-meta">
                        <span className="meta-cat">ÉCONOMIE</span>
                        <span className="meta-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Il y a 2h</span>
                    </div>
                    <h3 className="france-title">CAC 40 : Les entreprises dirigées par des femmes surperforment</h3>
                    <p className="france-desc">Une nouvelle étude démontre une rentabilité supérieure de 12% pour les groupes à parité.</p>
                </article>
                <article className="france-card">
                    <img src="assets/core/img/france_3.png" alt="Cannes" />
                    <div className="france-meta">
                        <span className="meta-cat">CULTURE</span>
                        <span className="meta-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Il y a 4h</span>
                    </div>
                    <h3 className="france-title">Cannes 2026 : Record historique de femmes réalisatrices en sélection officielle</h3>
                    <p className="france-desc">Thierry Frémaux annonce une sélection paritaire pour la première fois dans l'histoire du festival.</p>
                </article>
            </div>
        </section>

        {/* ABONNEMENT ALLIANCE */}
        <section className="today-subscription">
            <div className="sub-header">
                <h2>Rejoignez l'Alliance DONA</h2>
                <p>Accédez à un réseau exclusif de femmes solaires, des masterclasses privées et l'intégralité de nos archives éditoriales.</p>
            </div>
            <div className="sub-cards">
                {/* Découverte */}
                <div className="sub-card card-transparent">
                    <h3 className="sub-card-title">Découverte</h3>
                    <p className="sub-card-subtitle">Accès limité</p>
                    <div className="sub-price">Gratuit</div>
                    <ul className="sub-features">
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Newsletter hebdomadaire</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> 3 articles par mois</li>
                    </ul>
                    <a href="#" className="btn-sub-outline">S'INSCRIRE</a>
                </div>
                
                {/* Premium */}
                <div className="sub-card card-solid">
                    <div className="badge-recommended">RECOMMANDÉ</div>
                    <h3 className="sub-card-title">Alliance Premium</h3>
                    <p className="sub-card-subtitle">L'expérience complète</p>
                    <div className="sub-price"><span className="price-val">14€</span>/mois</div>
                    <ul className="sub-features">
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Accès illimité aux articles</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Masterclasses mensuelles</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Réseau privé d'entraide</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Événements exclusifs</li>
                    </ul>
                    <Link  href="#" className="btn-sub-solid">COMMENCER L'ESSAI GRATUIT - 14 JOURS</Link>
                </div>
            </div>
        </section>
    </main>
  );
}

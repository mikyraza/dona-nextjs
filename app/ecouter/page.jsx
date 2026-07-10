import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      {/* HERO SECTION (À LA UNE) */}
        <section className="ecouter-hero">
            <div className="ecouter-hero-inner">
                <div className="hero-image-wrapper">
                    <img src="/assets/core/img/ecouter-hero.png" alt="Portrait" className="hero-img" />
                </div>
                <div className="hero-content">
                    <div className="kicker">— À LA UNE</div>
                    <h1 className="hero-title">The Brief: L'État<br />de l'Art</h1>
                    <div className="hero-meta">
                        <span className="material-symbols-outlined">schedule</span> 42 MIN
                        <span className="meta-divider"></span> EPISODE 142
                        <span className="meta-divider"></span> ART & PHILOSOPHIE
                    </div>
                    <div className="audio-visualization">
                        <div className="bar bar-1"></div><div className="bar bar-2"></div><div className="bar bar-3"></div><div className="bar bar-4"></div><div className="bar bar-5"></div><div className="bar bar-6"></div><div className="bar bar-7"></div><div className="bar bar-8"></div><div className="bar bar-9"></div><div className="bar bar-10"></div>
                    </div>
                    <a href="javascript:void(0)" className="btn-primary">ÉCOUTER MAINTENANT</a>
                </div>
            </div>
        </section>

        {/* CHRONIQUES & ANALYSES */}
        <section className="ecouter-chroniques">
            <div className="section-header">
                <div className="header-text">
                    <h2 className="section-title">Chroniques & Analyses</h2>
                    <p className="section-desc">Des réflexions hebdomadaires sur la culture, la mode et les enjeux sociétaux par nos rédacteurs.</p>
                </div>
                <a href="javascript:void(0)" className="link-editorial">VOIR TOUT</a>
            </div>
            <div className="chroniques-grid">
                <article className="podcast-card">
                    <div className="card-img-wrapper"><img src="/assets/core/img/ecouter-1.png" alt="Revue" className="card-img" /></div>
                    <h3 className="card-title">La Revue de Mode</h3>
                    <div className="card-meta">15 FÉVRIER — 24 MIN</div>
                </article>
                <article className="podcast-card">
                    <div className="card-img-wrapper"><img src="/assets/core/img/ecouter-2.png" alt="Architecture" className="card-img" /></div>
                    <h3 className="card-title">Architecture Invisible</h3>
                    <div className="card-meta">12 FÉVRIER — 31 MIN</div>
                </article>
                <article className="podcast-card">
                    <div className="card-img-wrapper"><img src="/assets/core/img/ecouter-3.png" alt="Son" className="card-img" /></div>
                    <h3 className="card-title">Le Son de Demain</h3>
                    <div className="card-meta">08 FÉVRIER — 19 MIN</div>
                </article>
                <article className="podcast-card">
                    <div className="card-img-wrapper"><img src="/assets/core/img/ecouter-4.png" alt="Conversation" className="card-img" /></div>
                    <h3 className="card-title">L'Art de Conversation</h3>
                    <div className="card-meta">05 FÉVRIER — 45 MIN</div>
                </article>
            </div>
        </section>

        {/* DIRECT / LIVE */}
        <section className="ecouter-live">
            <div className="live-background-text">LIVE</div>
            <div className="live-content">
                <div className="live-tag"><span className="dot"></span> DIRECT <span className="tag-text">ANTENNE DONA RADIO</span></div>
                <h2 className="live-title">En ce moment :<br />Session de Nuit<br />avec Julian B.</h2>
                <div className="live-player-area">
                    <button className="btn-play-large"><span className="material-symbols-outlined">play_arrow</span></button>
                    <div className="live-upcoming">
                        <div className="upcoming-label">PROCHAINEMENT : 21:00</div>
                        <div className="upcoming-title">Le Cercle des Auditeurs — Invité Spécial : Marc-Antoine</div>
                    </div>
                </div>
            </div>
        </section>

        {/* SÉRIES LIMITÉES */}
        <section className="ecouter-series">
            <div className="series-header">
                <div className="kicker">— SÉRIES LIMITÉES</div>
                <h2 className="section-title">Grands Formats &<br />Documentaires</h2>
                <p className="section-desc">Une collection de récits immersifs, de l'exploration des archives oubliées aux enquêtes<br />sur les nouveaux paradigmes de l'élégance.</p>
            </div>
            <div className="series-list">
                <div className="series-item">
                    <div className="series-number">01 / 06</div>
                    <div className="series-info">
                        <h3 className="series-title">Les Fantômes de la Haute Couture</h3>
                        <p className="series-desc">Une série de six épisodes retraçant les ateliers disparus de la Rive Gauche entre 1950 et 1970.</p>
                    </div>
                    <div className="series-duration">3H 45M TOTAL</div>
                </div>
                <div className="series-item">
                    <div className="series-number">02 / 04</div>
                    <div className="series-info">
                        <h3 className="series-title">L'Écho du Silence</h3>
                        <p className="series-desc">Investigation philosophique sur la valeur du calme dans un monde hyper-connecté.</p>
                    </div>
                    <div className="series-duration">2H 12M TOTAL</div>
                </div>
                <div className="series-item">
                    <div className="series-number">03 / 08</div>
                    <div className="series-info">
                        <h3 className="series-title">Manifeste pour le Beau</h3>
                        <p className="series-desc">Grand format narratif explorant l'évolution du concept d'esthétique depuis le Bauhaus.</p>
                    </div>
                    <div className="series-duration">5H 20M TOTAL</div>
                </div>
            </div>
        </section>

        {/* EXCLUSIF CERCLE */}
        <section className="ecouter-exclusif">
            <div className="exclusif-header">
                <div className="kicker-center"><span className="material-symbols-outlined padlock">lock</span> EXCLUSIF CERCLE</div>
                <h2 className="section-title-center">Entretiens de l'Intime</h2>
                <p className="section-desc-center">Accédez aux conversations non éditées avec les plus grands créateurs et intellectuels<br />de notre temps.</p>
            </div>
            <div className="exclusif-grid">
                <article className="locked-card">
                    <div className="locked-img-wrapper">
                        <img src="/assets/core/img/ecouter-lock-1.png" alt="Clara Rossi" className="locked-img" />
                        <div className="locked-overlay">
                            <span className="material-symbols-outlined lock-icon">lock</span>
                            <div className="locked-label">ABONNÉS UNIQUEMENT</div>
                            <div className="locked-desc">Débloquez l'entretien complet avec Clara Rossi</div>
                        </div>
                    </div>
                    <h3 className="card-title">Clara Rossi : Le Temps Suspendu</h3>
                    <div className="card-meta">INTERVIEW — 65 MIN</div>
                </article>
                <article className="locked-card">
                    <div className="locked-img-wrapper">
                        <img src="/assets/core/img/ecouter-lock-2.png" alt="Jean-Marc Vallet" className="locked-img" />
                        <div className="locked-overlay">
                            <span className="material-symbols-outlined lock-icon">lock</span>
                            <div className="locked-label">ABONNÉS UNIQUEMENT</div>
                            <div className="locked-desc">Dans le studio de Jean-Marc Vallet</div>
                        </div>
                    </div>
                    <h3 className="card-title">Jean-Marc Vallet : L'Épure</h3>
                    <div className="card-meta">INTERVIEW — 48 MIN</div>
                </article>
                <article className="locked-card">
                    <div className="locked-img-wrapper">
                        <img src="/assets/core/img/ecouter-lock-3.png" alt="Pierre H." className="locked-img" />
                        <div className="locked-overlay">
                            <span className="material-symbols-outlined lock-icon">lock</span>
                            <div className="locked-label">ABONNÉS UNIQUEMENT</div>
                            <div className="locked-desc">Conversation secrète : Pierre H.</div>
                        </div>
                    </div>
                    <h3 className="card-title">Pierre H. : Héritage et Rupture</h3>
                    <div className="card-meta">INTERVIEW — 72 MIN</div>
                </article>
            </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="ecouter-cta">
            <div className="cta-inner">
                <div className="cta-text">
                    <h2 className="cta-title">Élevez votre expérience</h2>
                    <p className="cta-desc">Rejoignez le Cercle pour accéder à l'intégralité de nos archives sonores et contenus réservés.</p>
                </div>
                <a href="/club" data-swup-ignore target="_top" className="btn-primary">REJOINDRE LE CERCLE</a>
            </div>
        </section>

        {/* PRE-FOOTER (LISTE / NEWSLETTER) */}
        <section className="ecouter-prefooter">
            <div className="prefooter-inner">
                <div className="prefooter-col-left">
                    <h4 className="prefooter-title">VOTRE LISTE</h4>
                    <div className="queue-list">
                        <div className="queue-item">
                            <button className="btn-play-small"><span className="material-symbols-outlined">play_arrow</span></button>
                            <div className="queue-info">
                                <div className="queue-title">Le Sommet des Nuages</div>
                                <div className="queue-status">PROCHAINEMENT</div>
                            </div>
                        </div>
                        <div className="queue-item">
                            <button className="btn-play-small"><span className="material-symbols-outlined">play_arrow</span></button>
                            <div className="queue-info">
                                <div className="queue-title">L'Art de Vivre au Japon</div>
                                <div className="queue-status">EN ATTENTE</div>
                            </div>
                        </div>
                    </div>
                    <a href="javascript:void(0)" className="link-editorial">GÉRER LA FILE D'ATTENTE</a>
                </div>
                <div className="prefooter-col-right">
                    <div className="newsletter-card">
                        <h3 className="newsletter-title">Recevez nos épisodes par email</h3>
                        <p className="newsletter-desc">Chaque dimanche, le récapitulatif audio et les lectures recommandées directement dans votre boîte.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="VOTRE ADRESSE EMAIL" className="newsletter-input" required />
                            <button type="submit" className="btn-primary">S'ABONNER</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
}

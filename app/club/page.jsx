import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="club-main">
      {/* Section 1: Hero */}
        <section className="club-hero">
            <div className="container club-hero-grid">
                <div className="club-hero-left">
                    <div className="club-eyebrow">LE DONA CLUB | ACCÈS</div>
                    <h1 className="club-h1">Bienvenue dans Votre<br />Espace de<br />Souveraineté</h1>
                    <p className="club-desc">Le Club Dona est un cercle restreint, conçu pour les bâtisseurs, les visionnaires, et ceux qui redéfinissent les codes de la réussite et du leadership.</p>
                    
                    <div className="club-login-card">
                        <div className="club-login-header">Connexion Membre / Visiteur Autorisé</div>
                        <div className="club-login-input">Votre Clé d'Accès <span className="material-symbols-outlined">arrow_drop_down</span></div>
                        <div className="club-login-ref">Réf: DONA-CER-012</div>
                        <a href="javascript:void(0)" className="club-login-btn">S'AUTHENTIFIER <span className="material-symbols-outlined">chevron_right</span></a>
                    </div>
                </div>
                <div className="club-hero-right">
                    {/* Red geometric node / knot */}
                    <svg viewBox="0 0 100 100" className="club-geo-knot" stroke="var(--club-primary)" strokeWidth="1.5" fill="none">
                        {/* Precise geometric representation mimicking the Dona seal */}
                        {/* Large outer circle */}
                        <circle cx="50" cy="50" r="45"></circle>
                        {/* Inner star / polygons */}
                        <polygon points="50,5 95,50 50,95 5,50"></polygon>
                        {/* Secondary rotated polygon */}
                        <polygon points="50,5 95,50 50,95 5,50" transform="rotate(45 50 50)"></polygon>
                        {/* Inner circles intersecting */}
                        <circle cx="50" cy="27.5" r="22.5"></circle>
                        <circle cx="50" cy="72.5" r="22.5"></circle>
                        <circle cx="27.5" cy="50" r="22.5"></circle>
                        <circle cx="72.5" cy="50" r="22.5"></circle>
                        {/* Center circle */}
                        <circle cx="50" cy="50" r="15"></circle>
                    </svg>
                </div>
            </div>
        </section>

        {/* Section 2: Le Forum */}
        <section className="club-forum">
            <div className="container">
                <div className="club-section-header">
                    <div className="club-section-titles">
                        <h2 className="club-h2">Le Forum</h2>
                        <p className="club-subtitle">Débats, analyses et discussions entre pairs.</p>
                    </div>
                    <a href="javascript:void(0)" className="club-btn-outline">REJOINDRE LE FORUM</a>
                </div>
                <div className="club-forum-grid">
                    <div className="forum-card forum-card-text">
                        <div className="forum-card-meta">
                            <span className="forum-badge">EXCLUSIVITÉ DONA</span>
                            <span className="forum-date">15 AVRIL 2026</span>
                        </div>
                        <h3 className="forum-title">L'Architecture du Silence : Repenser l'Espace Privé</h3>
                        <p className="forum-desc">Comment le design de nos intérieurs devient un rempart contre le bruit du monde, un luxe que seuls ceux qui maîtrisent leur temps et leur environnement peuvent se permettre.</p>
                        <div className="forum-author">
                            <div className="forum-avatars">
                                <img src="/assets/core/img/avatar-1.png" className="forum-avatar" alt="Author" />
                                <img src="/assets/core/img/avatar-2.png" className="forum-avatar" alt="Author" />
                            </div>
                            <span style={{marginLeft: "1rem"}}>Par la Rédaction Dona</span>
                        </div>
                    </div>
                    <div className="forum-card forum-card-image">
                        {/* Use placeholder if actual image doesn't exist yet */}
                        <div className="forum-image-bg" style={{backgroundImage: "url('/assets/core/img/forum-chair.png')", backgroundColor: "var(--color-text-muted)"}}></div>
                        <div className="forum-card-overlay">
                            <p>L'art de l'essentiel, une immersion dans le néo-minimalisme.</p>
                            <span className="forum-exclusive">— EXCLUSIF DONA CLUB</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3: Masterclass */}
        <section className="club-masterclass">
            <div className="container club-masterclass-inner">
                <div className="masterclass-eyebrow">ÉVÉNEMENTS & SESSIONS</div>
                <h2 className="masterclass-h2">Masterclass & Briefings</h2>
                <p className="masterclass-desc">Accédez à nos événements exclusifs et à nos sessions stratégiques, pensés pour affiner vos perspectives et optimiser la gestion de votre patrimoine matériel et immatériel.</p>
                
                <div className="masterclass-list">
                    <a href="javascript:void(0)" className="masterclass-item">
                        <div className="masterclass-item-info">
                            <span className="masterclass-date">22 Mai 2026 — Paris</span>
                            <span className="masterclass-title">Gala d'Hiver : L'Art de l'Héritage</span>
                        </div>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </a>
                    <a href="javascript:void(0)" className="masterclass-item">
                        <div className="masterclass-item-info">
                            <span className="masterclass-date">05 Juin 2026 — Session Virtuelle</span>
                            <span className="masterclass-title">Briefing Stratégique : L'Avenir de l'Investissement</span>
                        </div>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>
                
                <a href="javascript:void(0)" className="club-btn-white">VOIR L'AGENDA COMPLET</a>
            </div>
        </section>

        {/* Section 4: Vault */}
        <section className="club-vault">
            <div className="container">
                <div className="club-section-header">
                    <div className="club-section-titles">
                        <h2 className="club-h2">The Intelligence Vault</h2>
                        <p className="club-subtitle">Analyses pointues et rapports de tendances exclusifs.</p>
                    </div>
                </div>
                <div className="vault-grid">
                    <div className="vault-card">
                        <div className="vault-img"><img src="/assets/core/img/vault-1.png" alt="Rapport" /></div>
                        <div className="vault-card-body">
                            <span className="vault-tag">RAPPORT</span>
                            <span className="vault-date">22 Avril 2026</span>
                            <h4 className="vault-title">L'Influence des Cercles Tangibles</h4>
                        </div>
                    </div>
                    <div className="vault-card">
                        <div className="vault-img"><img src="/assets/core/img/vault-2.png" alt="Analyse" /></div>
                        <div className="vault-card-body">
                            <span className="vault-tag" style={{background: "rgba(28, 27, 27, 0.05)", color: "var(--club-on-surface-variant)"}}>ANALYSE</span>
                            <span className="vault-date">10 Avril 2026</span>
                            <h4 className="vault-title">La Discrétion comme Nouvelle Monnaie</h4>
                        </div>
                    </div>
                    <div className="vault-card">
                        <div className="vault-img"><img src="/assets/core/img/vault-3.png" alt="Galerie" /></div>
                        <div className="vault-card-body">
                            <span className="vault-tag" style={{background: "rgba(28, 27, 27, 0.05)", color: "var(--club-on-surface-variant)"}}>GALERIE</span>
                            <span className="vault-date">02 Mars 2026</span>
                            <h4 className="vault-title">L'Esthétique du Cercle</h4>
                        </div>
                    </div>
                    <div className="vault-card-restricted">
                        <div className="restricted-icon"><span className="material-symbols-outlined" style={{fontSize: "2rem"}}>lock</span></div>
                        <div className="restricted-info">Accès Restreint<br />Nécessite le statut de Membre Privilège</div>
                        <div className="vault-card-body" style={{padding: "0"}}>
                            <span className="vault-date">01 Fév 2026</span>
                            <h4 className="vault-title">Étude de Cas : Stratégies de Préservation</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 5: Avantages */}
        <section className="club-avantages">
            <div className="container avantages-grid">
                <div className="avantages-left">
                    <h2 className="avantages-h2">Les Avantages</h2>
                    <p className="avantages-desc">Rejoindre le Cercle Dona, c'est s'ouvrir à une nouvelle dimension d'information et d'expérience, réservée à une élite discrète et influente.</p>
                    <ul className="avantages-list">
                        <li>
                            <span className="material-symbols-outlined">check_circle</span>
                            <div>
                                <strong>Curation de Contenus Spécifiques</strong>
                                <span>Analyses et réflexions sur-mesure.</span>
                            </div>
                        </li>
                        <li>
                            <span className="material-symbols-outlined">check_circle</span>
                            <div>
                                <strong>Accès à des Événements Restreints</strong>
                                <span>Un réseau de rencontres exclusives de haut niveau.</span>
                            </div>
                        </li>
                    </ul>
                    <a href="javascript:void(0)" className="avantages-link">Découvrir les avantages en détails</a>
                </div>
                <div className="avantages-right">
                    <div className="avantages-masonry">
                        <img src="/assets/core/img/avantage-1.png" className="av-img-1" alt="Vase" />
                        <img src="/assets/core/img/avantage-2.png" className="av-img-2" alt="Red Corner" />
                        <img src="/assets/core/img/avantage-3.png" className="av-img-3" alt="Book" />
                        <div className="av-cta-box">
                            <span className="material-symbols-outlined">favorite</span>
                            <span>Partager<br />la vision</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer Top / Join CTA */}
        <section className="club-join">
            <div className="container club-join-inner">
                <img src="/assets/core/img/logo.png" className="club-join-logo" alt="DONA" style={{height: "24px", filter: "grayscale(100%) brightness(0) invert(0)", opacity: "0.8"}} />
                <div style={{color: "var(--club-primary)", marginBottom: "2rem", display: "none"}} id="fallback-logo">
                    <svg viewBox="0 0 100 100" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
                        <circle cx="50" cy="50" r="45"></circle>
                        <polygon points="50,5 95,50 50,95 5,50"></polygon>
                        <polygon points="50,5 95,50 50,95 5,50" transform="rotate(45 50 50)"></polygon>
                    </svg>
                </div>
                <script dangerouslySetInnerHTML={{ __html: `
                    document.querySelector('.club-join-logo').onerror = function() {
                        this.style.display = 'none';
                        document.getElementById('fallback-logo').style.display = 'block';
                    };
                ` }} />

                <h2 className="club-join-h2">Rejoindre le Cercle</h2>
                <p className="club-join-desc">Cultivez votre unicité. Vivez l'expérience d'un luxe qui se vit de l'intérieur.</p>
                <div className="club-join-box">
                    <div className="join-type">Adhésion Annuelle</div>
                    <div className="join-price">950 €</div>
                    <a href="javascript:void(0)" className="join-link">S'inscrire et rejoindre le cercle <span className="material-symbols-outlined" style={{fontSize: "1.2rem"}}>arrow_forward</span></a>
                </div>
            </div>
            <div className="club-join-bottom">
                FAQ - Conditions Générales du Club &nbsp;|&nbsp; contact.club@donamagazine.com
            </div>
        </section>
    </main>
  );
}

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      {/* Site Header */}
    

    {/* Left Sticky Actions Menu */}
    <aside className="article-left-sidebar" style={{MagThemePrimary: "#a31835"}}>
        <button className="action-btn" aria-label="Auteur" title="Auteur">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        </button>
        <button className="action-btn" aria-label="Sections" title="Index des sections">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
        </button>
        <button className="action-btn" id="tts-trigger" aria-label="Écouter l'article" title="Synthèse vocale">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        </button>
        <button className="action-btn" aria-label="Partager" title="Partager">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
        </button>
    </aside>

    <div id="swup" className="transition-fade">
        <article className="mag-article-layout" style={{MagThemePrimary: "#a31835", MagThemeSecondary: "#3d0c1b", MagAccent: "#a31835"}}>
            
            {/* Breadcrumbs */}
            <div className="container" style={{paddingTop: "130px", paddingBottom: "10px"}}>
                <nav className="breadcrumbs" style={{fontSize: "0.75rem", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--color-text-muted)"}}>
                    <a href="/" style={{textDecoration: "none", color: "inherit", transition: "color 0.3s"}}>ACCUEIL</a> &nbsp;/&nbsp; 
                    <Link  href="/magazines" style={{textDecoration: "none", color: "inherit", transition: "color 0.3s"}}>NOS MAGAZINES</Link> &nbsp;/&nbsp; 
                    <Link  href="/magazines/magazine-01-intelligence" style={{textDecoration: "none", color: "inherit", transition: "color 0.3s"}}>01. INTELLIGENCE</Link> &nbsp;/&nbsp; 
                    <span style={{color: "var(--mag-theme-primary)"}}>L'EFFET DUNNING-KRUGER</span>
                </nav>
            </div>

            {/* Article Hero Banner Header */}
            <section className="article-hero">
                <div className="article-hero-bg">
                    <img src="/assets/core/img/mag_hero_01.png" alt="Management et Intelligence" />
                </div>
                <div className="article-hero-overlay"></div>
                <div className="article-hero-content">
                    <span className="article-category-badge">INTELLIGENCE • MANAGEMENT</span>
                    <h1 className="article-hero-title">La Trajectoire de l’Effet Dunning-Kruger dans le Management Moderne</h1>
                    <p className="article-hero-subtitle">Comment la surestimation des compétences techniques redéfinit la hiérarchie en entreprise et impacte les processus décisionnels complexes.</p>
                    
                    <div className="article-hero-meta">
                        <div className="article-meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Par <strong>Nora Patrius</strong></span>
                        </div>
                        <div className="article-meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>Lecture : <strong>14 min</strong></span>
                        </div>
                        <div className="article-meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>Mis en ligne le <strong>24 mars 2026</strong></span>
                        </div>
                    </div>

                    <nav className="article-sub-nav">
                        <span className="active" style={{color: "var(--mag-theme-primary)", borderBottom: "2px solid var(--mag-theme-primary)", paddingBottom: "4px"}}>TENDANCES ÉCONOMIQUES</span>
                        <span>INNOVATION TECHNOLOGIQUE</span>
                        <span>DISRUPTIONS DE MARCHÉ</span>
                        <span>FUTUR DU RETAIL</span>
                        <span>ÉCONOMIE RÉGÉNÉRATRICE</span>
                    </nav>
                </div>
            </section>

            {/* Two-Column Body Wrapper */}
            <div className="article-body-wrapper">
                
                {/* Left Reading Column (2/3) */}
                <section className="article-reading-zone">
                    
                    {/* Text-To-Speech Player Integrated */}
                    <div className="article-audio-player">
                        <div className="audio-player-left">
                            <button className="audio-play-btn" id="tts-audio-play">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="play-svg">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="pause-svg" style={{display: "none"}}>
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                </svg>
                                <span>ÉCOUTER L'ARTICLE</span>
                            </button>
                            <span className="audio-duration-info">Synthèse vocale • 14:25</span>
                        </div>
                        <div className="audio-player-right">
                            <div className="audio-voice-select">
                                <label htmlFor="voice-selection">Voix :</label>
                                <select id="voice-selection">
                                    <option value="fr-FR-Nora">Nora (Premium)</option>
                                    <option value="fr-FR-Bernard">Bernard (IA)</option>
                                </select>
                            </div>
                            <div className="audio-speed-select">
                                <label htmlFor="speed-selection">Vitesse :</label>
                                <select id="speed-selection">
                                    <option value="1">1.0x</option>
                                    <option value="1.2">1.2x</option>
                                    <option value="1.5">1.5x</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Article Paragraphs */}
                    <p><span className="drop-cap">L</span>'effet Dunning-Kruger, ce biais cognitif selon lequel les moins qualifiés dans un domaine surestiment systématiquement leur compétence, n’est plus cantonné aux cercles académiques de la psychologie sociale. Dans les arènes mouvantes des organisations contemporaines, il est devenu une force architecturale invisible, sculptant les lignes de commandement et influençant le destin de pans entiers de l’économie de l’innovation. À mesure que les architectures techniques se complexifient, la distance entre la réalité du travail technique et sa perception managériale s’accroît dramatiquement.</p>

                    <p>Ce phénomène s’exprime de façon particulièrement criante lors des phases de transition technologique. Confrontées à la nécessité de piloter des systèmes d'intelligence artificielle distribués ou des infrastructures cloud complexes, de nombreuses directions générales se heurtent à une illusion de contrôle. La simplification excessive des défis techniques par des intermédiaires peu compétents conduit à des décisions stratégiques erronées, parfois fatales pour l’agilité de l’organisation.</p>

                    <blockquote className="article-blockquote">
                        "L'erreur fondamentale du management moderne est de confondre la capacité à prononcer les mots à la mode avec la maîtrise réelle des infrastructures sous-jacentes."
                    </blockquote>

                    <h2 style={{fontFamily: "var(--font-secondary)", fontSize: "1.8rem", margin: "2.5rem 0 1rem 0", color: "var(--color-text)", borderLeft: "4px solid var(--mag-theme-primary)", paddingLeft: "1rem"}}>
                        La Illusion d’Expertise et ses Coûts Organisationnels
                    </h2>

                    <p>Dans un système méritocratique idéal, l’avancement hiérarchique serait corrélé à une augmentation de la compétence globale, mêlant technique et relationnel. Néanmoins, l’analyse des structures de gouvernance des grands groupes montre un découplage progressif. La communication à fort impact visuel et conceptuel, souvent portée par des profils souffrant d'une surestimation d'eux-mêmes, éclipse la rigueur analytique silencieuse des réels experts du domaine.</p>

                    <p>Il en résulte une asymétrie informationnelle toxique : les ingénieurs et spécialistes, conscients de la complexité des systèmes et donc plus modérés dans leurs déclarations, sont jugés hésitants. À l'inverse, l'assurance infondée de décideurs moins initiés est interprétée comme une preuve de leadership naturel.</p>

                    <div className="article-inline-image-box">
                        <img src="/assets/core/img/vision_portrait.png" alt="Illustration de la Complexité Cognitive" />
                        <div className="article-image-caption">Figure 1. Modélisation de l'évaluation subjective des compétences individuelles au sein des comités décisionnels.</div>
                    </div>

                    {/* Box À Retenir */}
                    <div className="box-a-retenir">
                        <h3>À Retenir • Les Points Clés</h3>
                        <ul>
                            <li>
                                <svg className="checkmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>La surestimation cognitive favorise les profils assertifs au détriment des profils analytiques.</span>
                            </li>
                            <li>
                                <svg className="checkmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Le découplage hiérarchique augmente considérablement le risque d'échec sur les projets technologiques hautement complexes.</span>
                            </li>
                            <li>
                                <svg className="checkmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>La création de canaux de communication directs entre experts et comités exécutifs est indispensable pour atténuer ce biais.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Trend Simulator 2026 (Widget) */}
                    <div className="article-interactive-widget">
                        <h3 className="widget-title">Trend Simulator 2026</h3>
                        <p className="widget-desc">Simulez l’impact des biais cognitifs majeurs sur le ROI opérationnel de vos équipes de R&D selon vos paramètres d'organisation.</p>
                        <div className="widget-actions">
                            <Link  href="#" className="widget-btn-primary">Lancer la Simulation</Link>
                            <Link  href="#" className="widget-btn-secondary">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Télécharger le PDF (1.4 Mo)
                            </Link>
                        </div>
                    </div>

                    {/* Locked VIP Paywall Section */}
                    <div className="vip-paywall-container">
                        <div className="vip-blurred-text">
                            <p>Pour contrer efficacement ces dérives, certaines organisations d'élite intègrent des comités de résonance technique. Ces instances, totalement découplées de la hiérarchie managériale directe, ont pour rôle unique de certifier la faisabilité réelle des projets d'innovation et d'auditer la pertinence des rapports d'étape.</p>
                            <p>En retirant aux managers intermédiaires le monopole de la transmission d'information, les comités exécutifs s'assurent un accès direct à des métriques non biaisées, limitant de fait l'effet de halo produit par les profils charismatiques mais incompétents.</p>
                            <p>La mise en place de ces structures nécessite cependant un courage politique interne fort, car elle remet en cause la structure pyramidale traditionnelle et redistribue une part significative du pouvoir d'influence vers les couches techniques opérationnelles. Le retour sur investissement de cette restructuration se mesure sur le long terme par une diminution drastique des dépassements budgétaires.</p>
                        </div>
                        
                        {/* Simulated Front-End Paywall card overlay */}
                        <div className="vip-subscription-card">
                            <h3>Contenu Exclusif Premium</h3>
                            <p>Cet article fait partie de nos grandes enquêtes réservées aux membres du Club DONA. Abonnez-vous pour lever le voile sur l'intégralité de nos analyses prospectives.</p>
                            <Link  href="#" className="btn-subscribe-premium">S'ABONNER POUR 1€</Link>
                        </div>
                    </div>

                    {/* Navigation Précédent / Suivant */}
                    <div className="article-prev-next-nav">
                        <Link  href="/magazines/magazine-01-intelligence" className="nav-link-block prev">
                            <div className="nav-label">← Magazine Principal</div>
                            <div className="nav-title">Retour au numéro 01. Intelligence</div>
                        </Link>
                        <Link  href="#" className="nav-link-block next">
                            <div className="nav-label">Article Suivant →</div>
                            <div className="nav-title">L'Intelligence Artificielle Distribuée et les Comités Exécutifs</div>
                        </Link>
                    </div>

                    {/* Espace Commentaires */}
                    <div className="comments-section">
                        <h3 className="comments-title">Espace d'Échange (3 commentaires)</h3>
                        <form className="comment-form">
                            <textarea placeholder="Partagez votre point de vue sur cette étude prospectiviste..." required></textarea>
                            <button type="submit">PUBLIER LE COMMENTAIRE</button>
                        </form>
                    </div>

                </section>

                {/* Right Sidebar Column (1/3) */}
                <aside className="article-sidebar-col">
                    
                    {/* Author Profile Card */}
                    <div className="sidebar-author-card">
                        <div className="author-img-wrapper">
                            <img src="/assets/core/img/vision_portrait.png" alt="Nora Patrius" />
                        </div>
                        <h3 className="author-name">Pr Nora Patrius</h3>
                        <span className="author-title">Directrice de la Prospective</span>
                        <p className="author-bio">Chercheuse en psychologie cognitive appliquée aux organisations. Elle conseille les conseils d'administration sur la prise de décision complexe et les architectures de gouvernance.</p>
                        <a href="#" className="author-profile-link">Voir ses publications</a>
                    </div>

                    {/* Share Widget */}
                    <div className="sidebar-share-widget">
                        <h4 className="share-widget-title">PARTAGER L'ARTICLE</h4>
                        <div className="share-buttons-row">
                            <button className="share-icon-btn" aria-label="Partager sur LinkedIn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </button>
                            <button className="share-icon-btn" aria-label="Partager sur X">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </button>
                            <button className="share-icon-btn" aria-label="Partager par E-mail">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Related Articles Widget */}
                    <div className="sidebar-related-articles">
                        <h4 className="related-title-overline">DANS LE MÊME NUMÉRO</h4>
                        <div className="related-articles-list">
                            <Link  href="#" className="related-article-card">
                                <div className="related-card-img-box">
                                    <img src="/assets/core/img/home_alaune_side1_1782125709654.png" alt="Intelligence Collective" />
                                </div>
                                <h4 className="related-card-title">Curation et Intelligence Artificielle collective</h4>
                            </Link>
                            <Link  href="#" className="related-article-card">
                                <div className="related-card-img-box">
                                    <img src="/assets/core/img/home_alaune_side2_1782125722981.png" alt="Biais cognitifs" />
                                </div>
                                <h4 className="related-card-title">Les Biais invisibles de la modération algorithmique</h4>
                            </Link>
                            <Link  href="#" className="related-article-card">
                                <div className="related-card-img-box">
                                    <img src="/assets/core/img/home_alaune_main_1782125698619.png" alt="Prise de décision" />
                                </div>
                                <h4 className="related-card-title">Gouvernance décentralisée et décision algorithmique</h4>
                            </Link>
                        </div>
                    </div>

                    {/* VIP Premium Promo Card */}
                    <div className="sidebar-vip-promo-card">
                        <h3 className="promo-title">Le Club DONA</h3>
                        <p className="promo-desc">Rejoignez le cercle restreint de nos lecteurs Premium et participez à nos comités de prospective réguliers.</p>
                        <Link  href="#" className="promo-btn-white">Rejoindre le Club</Link>
                    </div>

                </aside>

            </div>

            {/* Full-Width Newsletter Banner */}
            <section className="article-newsletter-banner">
                <span className="nl-banner-overline">LE BRIEF DIRECT</span>
                <h2 className="nl-banner-title">Recevez chaque matin l'analyse des signaux faibles</h2>
                <form className="nl-banner-form">
                    <input type="email" placeholder="Saisissez votre adresse e-mail" required />
                    <button type="submit">S'INSCRIRE</button>
                </form>
                <div className="nl-banner-footer">Garantie sans spam. Désinscription à tout moment en un clic.</div>
            </section>

        </article>
    </div>

    {/* Institutional Footer */}
    

    {/* Floating Audio Player (Persistant) */}
    <div className="floating-audio-player" id="floating-player">
        <div className="player-header">
            <span className="player-status">LECTURE EN COURS</span>
            <button className="player-close-btn" id="player-close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div className="player-body">
            <div className="player-track-info">
                <h6 className="player-track-title">La Trajectoire de l’Effet Dunning-Kruger</h6>
                <div className="player-visualizer">
                    <div className="visualizer-bar"></div>
                    <div className="visualizer-bar"></div>
                    <div className="visualizer-bar"></div>
                    <div className="visualizer-bar"></div>
                    <div className="visualizer-bar"></div>
                    <div className="visualizer-bar"></div>
                    <div className="visualizer-bar"></div>
                    <div className="visualizer-bar"></div>
                </div>
            </div>
            <div className="player-controls">
                <div className="control-buttons">
                    <button className="control-btn skip-backward">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <polyline points="3 3 3 8 8 8"></polyline>
                        </svg>
                        <span className="skip-value">10</span>
                    </button>
                    <button className="control-btn play-pause-btn" id="player-play-pause">
                        <svg className="pause-icon" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{display: "none"}}>
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                        <svg className="play-icon" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </button>
                    <button className="control-btn skip-forward">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                            <polyline points="21 3 21 8 16 8"></polyline>
                        </svg>
                        <span className="skip-value">30</span>
                    </button>
                </div>
                <div className="player-time">00:00 / 14:25</div>
            </div>
        </div>
    </div>

    {/* Swup.js from CDN for frontend simulation */}
    <script dangerouslySetInnerHTML={{ __html: `` }} />
    {/* Main JS */}
    <script dangerouslySetInnerHTML={{ __html: `` }} />

    {/* Specific interactions for this article blueprint page */}
    <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
            // Integration between the inner-page audio play button and the floating player widget
            const ttsBtn = document.getElementById('tts-audio-play');
            const floatingPlayer = document.getElementById('floating-player');
            const playSvg = ttsBtn.querySelector('.play-svg');
            const pauseSvg = ttsBtn.querySelector('.pause-svg');
            const btnText = ttsBtn.querySelector('span');

            const playerPlayPause = document.getElementById('player-play-pause');
            const playerPlayIcon = playerPlayPause.querySelector('.play-icon');
            const playerPauseIcon = playerPlayPause.querySelector('.pause-icon');
            const visualizer = document.querySelector('.player-visualizer');

            let isPlaying = false;

            function updateAudioStates(playingState) {
                isPlaying = playingState;
                if (isPlaying) {
                    playSvg.style.display = 'none';
                    pauseSvg.style.display = 'block';
                    btnText.textContent = 'PAUSE';

                    playerPlayIcon.style.display = 'none';
                    playerPauseIcon.style.display = 'block';
                    floatingPlayer.classList.add('open');
                    visualizer.classList.add('playing');
                } else {
                    playSvg.style.display = 'block';
                    pauseSvg.style.display = 'none';
                    btnText.textContent = 'ÉCOUTER L\'ARTICLE';

                    playerPlayIcon.style.display = 'block';
                    playerPauseIcon.style.display = 'none';
                    visualizer.classList.remove('playing');
                }
            }

            ttsBtn.addEventListener('click', () => {
                updateAudioStates(!isPlaying);
            });

            // Make left-sidebar speech synthesis button trigger audio as well
            const leftSidebarTts = document.getElementById('tts-trigger');
            if (leftSidebarTts) {
                leftSidebarTts.addEventListener('click', () => {
                    updateAudioStates(!isPlaying);
                });
            }

            // Sync with main floating player play/pause actions
            playerPlayPause.addEventListener('click', () => {
                updateAudioStates(!isPlaying);
            });
        });
    ` }} />

    {/* ═══════════════════════════════════════════════
         LANGUAGE SELECTOR MODAL
         ═══════════════════════════════════════════════ */}
    <div id="lang-modal-overlay" style={{display: "none", position: "fixed", inset: "0", zIndex: "9000", background: "rgba(30,30,30,0.70)", backdropFilter: "blur(3px)", alignItems: "center", justifyContent: "center"}}>
        <div id="lang-modal-box" style={{background: "#ffffff", color: "#1c1b1b", borderRadius: "8px", width: "100%", maxWidth: "460px", padding: "40px 40px 32px", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.30)", fontFamily: "'Inter',sans-serif"}}>
            {/* Close */}
            <button id="lang-modal-close" aria-label="Fermer" style={{position: "absolute", top: "20px", right: "20px", background: "none", border: "none", cursor: "pointer", color: "#888", padding: "4px", lineHeight: "1", fontSize: "22px", transition: "color .2s"}}>✕</button>

            {/* Title */}
            <h2 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "26px", fontWeight: "700", margin: "0 0 8px"}}>Choisir votre langue</h2>
            <p style={{fontSize: "13px", color: "#888", margin: "0 0 28px"}}>DONA est disponible dans les langues suivantes</p>

            {/* Language Options */}
            <div id="lang-options" style={{display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px"}}>

                {/* FR */}
                <button className="lang-option" data-lang="fr" style={{display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "6px", border: "none", cursor: "pointer", textAlign: "left", background: "#f5f1ee", transition: "background .2s", width: "100%", position: "relative"}}>
                    <span style={{fontSize: "26px", lineHeight: "1"}}>🇫🇷</span>
                    <span>
                        <span style={{display: "block", fontSize: "15px", fontWeight: "600", color: "#1c1b1b"}}>Français</span>
                        <span style={{display: "block", fontSize: "11px", color: "#888", letterSpacing: ".05em"}}>FR</span>
                    </span>
                    <span className="lang-check" style={{display: "none", position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", width: "28px", height: "28px", borderRadius: "50%", background: "#8B002A", color: "#fff", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700"}}>✓</span>
                </button>

                {/* EN */}
                <button className="lang-option" data-lang="en" style={{display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "6px", border: "none", cursor: "pointer", textAlign: "left", background: "transparent", transition: "background .2s", width: "100%", position: "relative"}}>
                    <span style={{fontSize: "26px", lineHeight: "1"}}>🇬🇧</span>
                    <span>
                        <span style={{display: "block", fontSize: "15px", fontWeight: "600", color: "#1c1b1b"}}>English</span>
                        <span style={{display: "block", fontSize: "11px", color: "#888", letterSpacing: ".05em"}}>EN</span>
                    </span>
                    <span className="lang-check" style={{display: "none", position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", width: "28px", height: "28px", borderRadius: "50%", background: "#8B002A", color: "#fff", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700"}}>✓</span>
                </button>

                {/* ES */}
                <button className="lang-option" data-lang="es" style={{display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "6px", border: "none", cursor: "pointer", textAlign: "left", background: "transparent", transition: "background .2s", width: "100%", position: "relative"}}>
                    <span style={{fontSize: "26px", lineHeight: "1"}}>🇪🇸</span>
                    <span>
                        <span style={{display: "block", fontSize: "15px", fontWeight: "600", color: "#1c1b1b"}}>Español</span>
                        <span style={{display: "block", fontSize: "11px", color: "#888", letterSpacing: ".05em"}}>ES</span>
                    </span>
                    <span className="lang-check" style={{display: "none", position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", width: "28px", height: "28px", borderRadius: "50%", background: "#8B002A", color: "#fff", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700"}}>✓</span>
                </button>
            </div>

            {/* Region */}
            <p style={{fontSize: "12px", fontWeight: "600", color: "#1c1b1b", letterSpacing: ".08em", margin: "0 0 10px", textTransform: "uppercase"}}>Région de contenu</p>
            <select id="lang-region" style={{width: "100%", padding: "14px 16px", background: "#f5f1ee", border: "none", borderRadius: "6px", fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#1c1b1b", appearance: "none", cursor: "pointer", backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23888' strokeWidth='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", marginBottom: "8px"}}>
                <option value="europe">Europe</option>
                <option value="africa">Afrique</option>
                <option value="americas">Amériques</option>
                <option value="asia">Asie &amp; Pacifique</option>
                <option value="international">International</option>
            </select>
            <p style={{fontSize: "12px", color: "#aaa", margin: "0 0 28px", lineHeight: "1.6"}}>Adapte les recommandations et événements à votre zone géographique</p>

            {/* CTA */}
            <button id="lang-confirm-btn" style={{display: "block", width: "100%", background: "#8B002A", color: "#fff", border: "none", borderRadius: "4px", padding: "18px", fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "background .2s", marginBottom: "16px", letterSpacing: ".03em"}}>Confirmer mon choix</button>

            {/* International link */}
            <Link  href="#" id="lang-international-link" style={{display: "block", textAlign: "center", fontSize: "13px", color: "#888", textDecoration: "none", transition: "color .2s"}}>Continuer en version internationale</Link>
        </div>
    </div>

    {/* Language Modal JS */}
    <script dangerouslySetInnerHTML={{ __html: `
    (function() {
        const overlay = document.getElementById('lang-modal-overlay');
        const closeBtn = document.getElementById('lang-modal-close');
        const langBtn = document.getElementById('lang-trigger');
        const confirmBtn = document.getElementById('lang-confirm-btn');
        const intlLink = document.getElementById('lang-international-link');
        const options = document.querySelectorAll('.lang-option');

        let selectedLang = localStorage.getItem('dona-lang') || 'fr';

        function openModal() {
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            updateSelection();
        }

        function closeModal() {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }

        function updateSelection() {
            options.forEach(function(opt) {
                const check = opt.querySelector('.lang-check');
                const isActive = opt.dataset.lang === selectedLang;
                opt.style.background = isActive ? '#f5f1ee' : 'transparent';
                check.style.display = isActive ? 'flex' : 'none';
            });
        }

        options.forEach(function(opt) {
            opt.addEventListener('click', function() {
                selectedLang = opt.dataset.lang;
                updateSelection();
            });
            opt.addEventListener('mouseenter', function() {
                if (opt.dataset.lang !== selectedLang)
                    opt.style.background = '#faf8f6';
            });
            opt.addEventListener('mouseleave', function() {
                if (opt.dataset.lang !== selectedLang)
                    opt.style.background = 'transparent';
            });
        });

        if (langBtn) langBtn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (confirmBtn) confirmBtn.addEventListener('click', function() {
            localStorage.setItem('dona-lang', selectedLang);
            const region = document.getElementById('lang-region').value;
            localStorage.setItem('dona-region', region);
            closeModal();
        });
        if (intlLink) intlLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.setItem('dona-lang', 'international');
            closeModal();
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeModal();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
    })();
    ` }} />
    </main>
  );
}

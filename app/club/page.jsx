import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="club-main">
      {/* Section 1: Hero En-tête avec Connexion Membre */}
      <section className="club-hero" style={{ paddingTop: "6.5rem", paddingBottom: "5rem" }}>
        <div className="container club-hero-grid">
          <div className="club-hero-left">
            <div className="club-eyebrow">LE DONA CLUB | ACCÈS RESTREINT</div>
            <h1 className="club-h1">Le Club <span style={{ color: "#A30626" }}>DONA</span></h1>
            <p className="club-desc">Accédez à l'exceptionnel. Un espace dédié à la curation architecturale, aux privilèges exclusifs et aux bâtisseurs qui redéfinissent les codes du leadership.</p>
            
            <div className="club-login-card">
              <div className="club-login-header" style={{ marginBottom: "1.2rem", fontWeight: "700" }}>Connexion Membre Privilège</div>
              
              <div style={{ marginBottom: "1.2rem" }}>
                <div className="club-label" style={{ fontSize: "10px", color: "var(--club-on-surface-variant)", marginBottom: "4px" }}>DÉJÀ MEMBRE ?</div>
                <Link href="/login?vip=1&callbackUrl=/club" className="club-action-link" style={{ fontSize: "20px", fontWeight: "600", textDecoration: "none" }}>
                  <span className="action-text">Connexion</span>
                  <span className="material-symbols-outlined action-arrow" style={{ fontSize: "18px" }}>arrow_forward</span>
                </Link>
              </div>

              <div className="club-login-input">Votre Clé d'Accès <span className="material-symbols-outlined">key</span></div>
              <div className="club-login-ref">Réf: DONA-CER-012</div>
              <Link href="/login?vip=1&callbackUrl=/club" className="club-login-btn">S'AUTHENTIFIER <span className="material-symbols-outlined">chevron_right</span></Link>

              <div style={{ marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid var(--club-border)" }}>
                <span className="club-label" style={{ fontSize: "10px", color: "var(--club-on-surface-variant)", display: "block", marginBottom: "4px" }}>MOT DE PASSE OUBLIÉ ?</span>
                <Link href="/abonnement" className="club-reset-link" style={{ fontSize: "13px", fontWeight: "500", textDecoration: "underline" }}>Réinitialiser</Link>
              </div>
            </div>
          </div>
          <div className="club-hero-right">
            {/* Red geometric node / knot */}
            <svg viewBox="0 0 100 100" className="club-geo-knot" stroke="var(--club-primary)" strokeWidth="1.5" fill="none">
              <circle cx="50" cy="50" r="45"></circle>
              <polygon points="50,5 95,50 50,95 5,50"></polygon>
              <polygon points="50,5 95,50 50,95 5,50" transform="rotate(45 50 50)"></polygon>
              <circle cx="50" cy="27.5" r="22.5"></circle>
              <circle cx="50" cy="72.5" r="22.5"></circle>
              <circle cx="27.5" cy="50" r="22.5"></circle>
              <circle cx="72.5" cy="50" r="22.5"></circle>
              <circle cx="50" cy="50" r="15"></circle>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2: Les Avantages du Cercle (Remontés pour convaincre immédiatement) */}
      <section className="club-avantages" style={{ padding: "5rem 0", background: "var(--club-surface-alt, #FAF9F6)", borderTop: "1px solid var(--club-border, #E5E7EB)", borderBottom: "1px solid var(--club-border, #E5E7EB)" }}>
        <div className="container avantages-grid">
          <div className="avantages-left">
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", color: "#A30626", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              POURQUOI REJOINDRE LE CLUB
            </div>
            <h2 className="avantages-h2">Les Privilèges Exclusifs</h2>
            <p className="avantages-desc">Rejoindre le Cercle Dona, c'est s'ouvrir à une nouvelle dimension d'information et d'expérience, réservée à une élite discrète et influente.</p>
            <ul className="avantages-list" style={{ marginTop: "2rem" }}>
              <li>
                <span className="material-symbols-outlined" style={{ color: "#A30626" }}>check_circle</span>
                <div>
                  <strong>Curation de Contenus Spécifiques</strong>
                  <span>Analyses, dossiers confidentiels et réflexions sur-mesure.</span>
                </div>
              </li>
              <li>
                <span className="material-symbols-outlined" style={{ color: "#A30626" }}>check_circle</span>
                <div>
                  <strong>Accès aux Événements & Galas Restreints</strong>
                  <span>Un réseau de rencontres exclusives de haut niveau.</span>
                </div>
              </li>
              <li>
                <span className="material-symbols-outlined" style={{ color: "#A30626" }}>check_circle</span>
                <div>
                  <strong>Editions Collector Print & Digital Vault</strong>
                  <span>Accès intégral à la bibliothèque de 16 magazines et archives.</span>
                </div>
              </li>
            </ul>
            <div style={{ marginTop: "2rem" }}>
              <Link href="/abonnement" className="avantages-link" style={{ fontSize: "13px", fontWeight: "700", color: "#A30626" }}>
                Découvrir l'ensemble des avantages en détails →
              </Link>
            </div>
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

      {/* Section 3: Aperçu des Contenus Exclusifs (Forum, Masterclass, Vault) */}
      
      {/* 3.1: Le Forum */}
      <section className="club-forum" style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="club-section-header">
            <div className="club-section-titles">
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                COMMUNAUTÉ & ÉCHANGES
              </div>
              <h2 className="club-h2">Le Forum Privé</h2>
              <p className="club-subtitle">Débats, analyses et discussions d'experts entre pairs.</p>
            </div>
            <Link href="/login?vip=1&callbackUrl=/club" className="club-btn-outline">ACCÉDER AU FORUM</Link>
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
                <span style={{ marginLeft: "1rem" }}>Par la Rédaction Dona</span>
              </div>
            </div>
            <div className="forum-card forum-card-image">
              <div className="forum-image-bg" style={{ backgroundImage: "url('/assets/core/img/forum-chair.png')", backgroundColor: "var(--color-text-muted)" }}></div>
              <div className="forum-card-overlay">
                <p>L'art de l'essentiel, une immersion dans le néo-minimalisme.</p>
                <span className="forum-exclusive">— EXCLUSIF DONA CLUB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.2: Masterclass & Briefings */}
      <section className="club-masterclass" style={{ padding: "5rem 0", background: "#1C1B1B", color: "#FFFFFF" }}>
        <div className="container club-masterclass-inner">
          <div className="masterclass-eyebrow" style={{ color: "#9CA3AF" }}>ÉVÉNEMENTS & SESSIONS</div>
          <h2 className="masterclass-h2" style={{ color: "#FFFFFF" }}>Masterclass & Briefings</h2>
          <p className="masterclass-desc" style={{ color: "#D1D5DB" }}>Accédez à nos événements exclusifs et à nos sessions stratégiques, pensés pour affiner vos perspectives et optimiser la gestion de votre patrimoine matériel et immatériel.</p>
          
          <div className="masterclass-list">
            <Link href="/login?vip=1&callbackUrl=/club" className="masterclass-item">
              <div className="masterclass-item-info">
                <span className="masterclass-date">22 Mai 2026 — Paris</span>
                <span className="masterclass-title">Gala d'Hiver : L'Art de l'Héritage</span>
              </div>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link href="/login?vip=1&callbackUrl=/club" className="masterclass-item">
              <div className="masterclass-item-info">
                <span className="masterclass-date">05 Juin 2026 — Session Virtuelle</span>
                <span className="masterclass-title">Briefing Stratégique : L'Avenir de l'Investissement</span>
              </div>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          
          <Link href="/login?vip=1&callbackUrl=/club" className="club-btn-white" style={{ marginTop: "2.5rem" }}>VOIR L'AGENDA COMPLET</Link>
        </div>
      </section>

      {/* 3.3: Intelligence Vault */}
      <section className="club-vault" style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="club-section-header">
            <div className="club-section-titles">
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                DOCUMENTATION CONFIDENTIELLE
              </div>
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
                <span className="vault-tag" style={{ background: "rgba(28, 27, 27, 0.05)", color: "var(--club-on-surface-variant)" }}>ANALYSE</span>
                <span className="vault-date">10 Avril 2026</span>
                <h4 className="vault-title">La Discrétion comme Nouvelle Monnaie</h4>
              </div>
            </div>
            <div className="vault-card">
              <div className="vault-img"><img src="/assets/core/img/vault-3.png" alt="Galerie" /></div>
              <div className="vault-card-body">
                <span className="vault-tag" style={{ background: "rgba(28, 27, 27, 0.05)", color: "var(--club-on-surface-variant)" }}>GALERIE</span>
                <span className="vault-date">02 Mars 2026</span>
                <h4 className="vault-title">L'Esthétique du Cercle</h4>
              </div>
            </div>
            <div className="vault-card-restricted">
              <div className="restricted-icon"><span className="material-symbols-outlined" style={{ fontSize: "2rem" }}>lock</span></div>
              <div className="restricted-info">Accès Restreint<br />Nécessite le statut de Membre Privilège</div>
              <div className="vault-card-body" style={{ padding: "0" }}>
                <span className="vault-date">01 Fév 2026</span>
                <h4 className="vault-title">Étude de Cas : Stratégies de Préservation</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Formules d'Adhésion & Espace Membre (Offres claires en conclusion) */}
      <section className="club-services" style={{ padding: "5rem 0", background: "var(--club-surface-alt, #FAF9F6)", borderTop: "1px solid var(--club-border, #E5E7EB)", borderBottom: "1px solid var(--club-border, #E5E7EB)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", color: "#A30626", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              ADHÉSION & ADMISSION
            </div>
            <h2 style={{ fontFamily: "Newsreader, serif", fontSize: "32px", margin: 0 }}>Rejoindre ou Gérer votre Accès</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
            
            {/* Col 1: Offres & Abonnements */}
            <div style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "4px", border: "1px solid var(--club-border, #E5E7EB)" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                OFFRES DE SOUSCRIPTION
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Abonnement Annuel Premium</h4>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#A30626" }}>950 € / an</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 0.8rem 0", lineHeight: "1.5" }}>
                    L'expérience totale : éditions print collector, accès digital intégral et invitations aux galas privés.
                  </p>
                  <Link href="/signup?plan=elite&billing=annual" style={{ fontSize: "12px", fontWeight: "700", color: "#A30626", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    S'INSCRIRE À CETTE OFFRE <span style={{ fontSize: "14px" }}>→</span>
                  </Link>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Digital Only</h4>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#1C1B1B" }}>290 € / an</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 0.8rem 0", lineHeight: "1.5" }}>
                    Accès illimité aux 16 magazines en ligne, aux analyses de l'Intelligence Vault et aux flux Studio.
                  </p>
                  <Link href="/abonnement" style={{ fontSize: "12px", fontWeight: "700", color: "#1C1B1B", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    DÉTAILS DES FORMULES <span style={{ fontSize: "14px" }}>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Col 2: Espace Membre (Pour les membres actuels) */}
            <div style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "4px", border: "1px solid var(--club-border, #E5E7EB)" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                ESPACE MEMBRE CONNECTÉ
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li>
                  <Link href="/member-profile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#FAF9F6", borderRadius: "4px", textDecoration: "none", color: "#1C1B1B", fontSize: "13px", fontWeight: "600" }}>
                    <span>Mon Tableau de bord</span>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9CA3AF" }}>chevron_right</span>
                  </Link>
                </li>
                <li>
                  <Link href="/espace-lecture" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#FAF9F6", borderRadius: "4px", textDecoration: "none", color: "#1C1B1B", fontSize: "13px", fontWeight: "600" }}>
                    <span>Mes Favoris & Lectures VIP</span>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9CA3AF" }}>chevron_right</span>
                  </Link>
                </li>
                <li>
                  <Link href="/member-profile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#FAF9F6", borderRadius: "4px", textDecoration: "none", color: "#1C1B1B", fontSize: "13px", fontWeight: "600" }}>
                    <span>Historique des commandes</span>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9CA3AF" }}>chevron_right</span>
                  </Link>
                </li>
                <li>
                  <Link href="/member-profile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#FAF9F6", borderRadius: "4px", textDecoration: "none", color: "#1C1B1B", fontSize: "13px", fontWeight: "600" }}>
                    <span>Gérer mon profil & Sécurité</span>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9CA3AF" }}>chevron_right</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Rejoindre la communauté */}
            <div style={{ background: "#1C1B1B", color: "#FFFFFF", padding: "2rem", borderRadius: "4px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9CA3AF", display: "block", marginBottom: "0.5rem" }}>
                  CLUB PRIVILÈGE
                </span>
                <h3 style={{ fontFamily: "Newsreader, serif", fontSize: "24px", color: "#FFFFFF", margin: "0 0 0.8rem 0", lineHeight: "1.2" }}>
                  Rejoindre le Cercle DONA
                </h3>
                <p style={{ fontSize: "13px", color: "#D1D5DB", lineHeight: "1.6", margin: 0 }}>
                  Un réseau confidentiel d'influence, de culture et d'architecture contemporaine.
                </p>
              </div>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/signup?plan=elite&billing=annual" style={{ display: "block", textAlign: "center", background: "#A30626", color: "#FFFFFF", padding: "12px 20px", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none", borderRadius: "2px" }}>
                  INSCRIPTION AU CLUB
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Top / Join CTA Final */}
      <section className="club-join">
        <div className="container club-join-inner">
          <img src="/assets/core/img/logo.png" className="club-join-logo" alt="DONA" style={{ height: "24px", filter: "grayscale(100%) brightness(0) invert(0)", opacity: "0.8" }} />

          <h2 className="club-join-h2">Rejoindre le Cercle</h2>
          <p className="club-join-desc">Cultivez votre unicité. Vivez l'expérience d'un luxe qui se vit de l'intérieur.</p>
          <div className="club-join-box">
            <div className="join-type">Adhésion Annuelle</div>
            <div className="join-price">950 €</div>
            <Link href="/signup?plan=elite&billing=annual" className="join-link">S'inscrire et rejoindre le cercle <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>arrow_forward</span></Link>
          </div>
        </div>
        <div className="club-join-bottom">
          FAQ - Conditions Générales du Club &nbsp;|&nbsp; contact.club@donamagazine.com
        </div>
      </section>
    </main>
  );
}

'use strict';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        
        {/* Footer Top (Logo & Watermark) */}
        <div className="footer-top-section">
          <div className="footer-logo-col">
            <Link href="/">
              <img src="/assets/core/img/logo.png?v=3" alt="DONA Magazine Logo" className="footer-logo" style={{ cursor: 'pointer' }} />
            </Link>
          </div>
          <div className="footer-watermark-col">
            <span className="footer-watermark">DONA<span className="watermark-dot">.</span></span>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        {/* Footer Grid */}
        <div className="footer-grid">
          
          {/* Colonnes NOS MAGAZINES (1 & 2) */}
          <div className="footer-col col-magazines-group">
            <h4 className="footer-title">NOS MAGAZINES</h4>
            <div className="footer-magazines-grid">
              <ul className="footer-links">
                <li><Link href="/magazines/magazine-01-intelligence">Intelligence</Link></li>
                <li><Link href="/magazines/magazine-02-power-lab">Power Lab</Link></li>
                <li><Link href="/magazines/magazine-03-alliance">L'Alliance</Link></li>
                <li><Link href="/magazines/magazine-04-agenda">L'Agenda</Link></li>
                <li><Link href="/magazines/magazine-05-passions">Passions</Link></li>
                <li><Link href="/magazines/magazine-06-art-de-vivre">Art de Vivre</Link></li>
                <li><Link href="/magazines/magazine-07-academie">Académie</Link></li>
                <li><Link href="/magazines/magazine-08-patrimoine">Patrimoine</Link></li>
              </ul>
              <ul className="footer-links">
                <li><Link href="/magazines/magazine-09-longevity">Longevity</Link></li>
                <li><Link href="/magazines/magazine-10-impact">Impact</Link></li>
                <li><Link href="/magazines/magazine-11-culture-medias">Culture & Médias</Link></li>
                <li><Link href="/magazines/magazine-12-cercle">Le Cercle</Link></li>
                <li><Link href="/magazines/magazine-13-amour">Amour</Link></li>
                <li><Link href="/magazines/magazine-14-beaute">Beauté</Link></li>
                <li><Link href="/magazines/magazine-15-mariages">Mariages</Link></li>
                <li><Link href="/magazines/magazine-16-sante">Santé</Link></li>
              </ul>
            </div>
          </div>

          {/* Colonne 3: PLATEFORME */}
          <div className="footer-col">
            <h4 className="footer-title">PLATEFORME</h4>
            <ul className="footer-links">
              <li><Link href="/studio">Studio</Link></li>
              <li><Link href="/club">Club</Link></li>
              <li><Link href="/ecouter">Écouter</Link></li>
              <li><Link href="/jeux">Jeux</Link></li>
              <li><Link href="/search">Recherche</Link></li>
            </ul>
          </div>

          {/* Colonne 4: CONTACT */}
          <div className="footer-col">
            <h4 className="footer-title">CONTACT</h4>
            <ul className="footer-links">
              <li><Link href="/contact">Hub de contact</Link></li>
            </ul>
            <span className="footer-subtitle">CARRIÈRES</span>
            <ul className="footer-links">
              <li><Link href="/emploi">Emploi</Link></li>
              <li><Link href="/recrutement">Recrutement</Link></li>
            </ul>
          </div>

          {/* Colonne 5: À PROPOS */}
          <div className="footer-col">
            <h4 className="footer-title">À PROPOS</h4>
            <ul className="footer-links">
              <li><Link href="/equipe">Équipe de rédaction</Link></li>
              <li><Link href="/manifeste">Manifeste</Link></li>
            </ul>
          </div>

          {/* Colonne 6: LÉGAL */}
          <div className="footer-col">
            <h4 className="footer-title">LÉGAL</h4>
            <ul className="footer-links">
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
            </ul>
            <p className="footer-address">
              12 Rue de la Paix<br />
              75002 Paris, France
            </p>
            <ul className="footer-links">
              <li><Link href="/politique-confidentialite">Politique de confidentialité</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-divider-bottom"></div>
        
        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="X">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
          <div className="footer-copyright">
            &copy; DONA MAGAZINE. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <div className="page-404">
        {/* Watermark */}
        <div className="watermark" aria-hidden="true">404</div>

        <div className="content">
            {/* Logo */}
            <div className="logo-wrap">
                <img src="/assets/core/img/logo.png?v=3" alt="DONA Magazine" />
            </div>

            {/* Title */}
            <h1>Le chemin semble s'être effacé.</h1>
            <p className="subtitle">Cette page n'existe pas ou a été déplacée. Mais l'essentiel reste à<br />portée de main.</p>

            {/* Search */}
            <div className="search-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B002A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Rechercher un article, un sujet..." />
            </div>

            {/* 12 Cahiers */}
            <p className="cahiers-label">Explorer les 12 Cahiers</p>
            <div className="cahiers-grid">
                <Link  href="/magazines/magazine-01-intelligence">Intelligence</Link>
                <Link  href="/magazines/magazine-02-power-lab">Power Lab</Link>
                <Link  href="/magazines/magazine-03-alliance">L'Alliance</Link>
                <Link  href="/magazines/magazine-04-agenda">L'Agenda</Link>
                <Link  href="/magazines/magazine-05-passions">Passions</Link>
                <Link  href="/magazines/magazine-06-art-de-vivre">Art de Vivre</Link>
                <Link  href="/magazines/magazine-07-academie">Académie</Link>
                <Link  href="/magazines/magazine-08-patrimoine">Patrimoine</Link>
                <Link  href="/magazines/magazine-09-longevity">Longevity</Link>
                <Link  href="/magazines/magazine-10-impact">Impact</Link>
                <Link  href="/magazines/magazine-11-culture-medias">Culture &amp; Médias</Link>
                <Link  href="/magazines/magazine-12-cercle">Le Cercle</Link>
            </div>

            {/* CTA */}
            <Link  href="/" className="btn-home">Retour à l'Accueil</Link>
        </div>
    </div>
    </main>
  );
}

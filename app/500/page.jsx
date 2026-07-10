import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <div className="card-500">

        {/* Icône ! */}
        <div className="icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#8B002A"/>
                <line x1="12" y1="8" x2="12" y2="13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="16.5" r="1.2" fill="#fff"/>
            </svg>
        </div>

        {/* Titre */}
        <h1>Interruption de service</h1>

        {/* Description */}
        <p className="subtitle">
            Une erreur inattendue s'est produite sur notre serveur. Nos équipes techniques sont déjà à l'œuvre pour rétablir l'accès.
        </p>

        {/* Barre de progression partielle */}
        <div className="progress-wrap">
            <div className="progress-track">
                <div className="progress-fill"></div>
            </div>
            <p className="error-code">Code erreur : 500 Internal Server Error</p>
        </div>

        {/* Bouton */}
        <a href="javascript:window.location.reload()" className="btn-retry">Réessayer</a>

        {/* Lien support */}
        <Link  href="/contact" className="link-support">Contacter le support</Link>

        {/* Note sécurité */}
        <p className="security-note">Vos données sont en sécurité. Veuillez patienter quelques instants.</p>

    </div>
    </main>
  );
}

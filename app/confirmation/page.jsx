"use client";

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "80px 20px", background: "var(--color-bg)"}}>
      
      <style>{`
        .confirmation-card {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .confirmation-card:hover {
          background: var(--color-bg-alt);
          border-color: var(--color-text-muted);
        }
        .confirmation-link {
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-accent);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .confirmation-link:hover {
          color: #8B002A;
        }
        .confirmation-footer-link {
          color: var(--color-text-muted);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.3s ease;
        }
        .confirmation-footer-link:hover {
          color: var(--color-accent);
        }
        .confirm-container {
          max-width: 800px;
          width: 100%;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.02);
          padding: 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .summary-grid {
          width: 100%;
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 64px;
          text-align: left;
        }
        .steps-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 80px;
        }
        @media (max-width: 768px) {
          .confirm-container {
            padding: 32px 20px !important;
          }
          .confirm-container h1 {
            font-size: 32px !important;
          }
          .summary-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 24px;
            margin-bottom: 40px;
          }
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 48px;
          }
        }
      `}</style>

      <div className="confirm-container">
        
        {/* Success Icon */}
        <div style={{width: "64px", height: "64px", borderRadius: "50%", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px"}}>
            <span className="material-symbols-outlined" style={{fontSize: "32px", color: "var(--color-accent)"}}>check_circle</span>
        </div>

        {/* Headings */}
        <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "48px", fontWeight: "700", color: "var(--color-text)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: "1.1"}}>
            Bienvenue dans<br />l'Alliance DONA
        </h1>
        <p style={{fontFamily: "var(--font-primary)", fontSize: "16px", color: "var(--color-text-muted)", marginBottom: "48px"}}>
            Votre abonnement Premium est activé. Votre voyage vers<br />l'excellence commence maintenant.
        </p>

        {/* Plan Summary Card */}
        <div className="summary-grid">
            
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <div style={{fontFamily: "var(--font-primary)", fontSize: "10px", fontWeight: "600", letterSpacing: "0.1em", color: "var(--color-text-muted)", textTransform: "uppercase"}}>Plan actuel</div>
                <div style={{fontSize: "20px", fontWeight: "600", color: "var(--color-text)", marginBottom: "24px"}}>Premium</div>
                <Link href="/subscription-management" className="confirmation-link">Gérer mon abonnement</Link>
            </div>
            
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <div style={{fontFamily: "var(--font-primary)", fontSize: "10px", fontWeight: "600", letterSpacing: "0.1em", color: "var(--color-text-muted)", textTransform: "uppercase"}}>Prochaine facturation</div>
                <div style={{fontSize: "20px", fontWeight: "600", color: "var(--color-text)"}}>15 Mai 2026</div>
            </div>

        </div>

        {/* Next Steps */}
        <h3 style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "32px"}}>Prochaines étapes</h3>
        
        <div className="steps-grid">
            
            <Link href="/member-profile" className="confirmation-card">
                <span className="material-symbols-outlined" style={{fontSize: "32px", color: "var(--color-accent)", marginBottom: "16px"}}>person_outline</span>
                <span style={{fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", color: "var(--color-text)"}}>Complétez votre profil</span>
            </Link>

            <Link href="/magazines" className="confirmation-card">
                <span className="material-symbols-outlined" style={{fontSize: "32px", color: "var(--color-accent)", marginBottom: "16px"}}>menu_book</span>
                <span style={{fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", color: "var(--color-text)"}}>Explorez les Cahiers</span>
            </Link>

            <Link href="/club" className="confirmation-card">
                <span className="material-symbols-outlined" style={{fontSize: "32px", color: "var(--color-accent)", marginBottom: "16px"}}>forum</span>
                <span style={{fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", color: "var(--color-text)"}}>Rejoignez le Forum</span>
            </Link>

        </div>

        {/* Footer Note */}
        <p style={{fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-text-muted)"}}>
            Une question ? Contactez notre conciergerie membre :<br />
            <a href="mailto:concierge@donamagazine.com" className="confirmation-footer-link" style={{marginTop: "4px", display: "inline-block"}}>concierge@donamagazine.com</a>
        </p>

      </div>
    </main>
  );
}

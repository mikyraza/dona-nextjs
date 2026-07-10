"use client";

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "40px 20px", background: "var(--color-bg)"}}>
      
      <style>{`
        .login-link {
          color: var(--color-text-muted);
          font-weight: 500;
          text-decoration: none;
          transition: color 0.3s ease, opacity 0.3s ease;
        }
        .login-link:hover {
          color: var(--color-accent);
          opacity: 0.9;
        }
        .login-input-container {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-alt);
          padding: 12px 16px;
          border-radius: 2px;
          transition: border-color 0.3s ease;
        }
        .login-input-container:focus-within {
          border-color: var(--color-accent);
        }
        .login-input {
          flex-grow: 1;
          border: none;
          background: transparent;
          font-family: var(--font-primary);
          font-size: 15px;
          color: var(--color-text);
          outline: none;
        }
        @media (max-width: 500px) {
          .login-card {
            padding: 32px 20px !important;
          }
          .login-card img {
            height: 90px !important;
          }
          .login-card h1 {
            font-size: 22px !important;
          }
        }
      `}</style>

      <div className="login-card" style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "500px", width: "100%", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center"}}>
        
        {/* Logo */}
        <Link href="/" style={{marginBottom: "32px", display: "flex", justifyContent: "center", cursor: "pointer"}}>
            <img src="/assets/core/img/logo.png" alt="DONA Logo" className="logo-image" style={{height: "120px", width: "auto", objectFit: "contain", transition: "height 0.3s ease"}} />
        </Link>

        {/* Heading */}
        <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", textAlign: "center", letterSpacing: "-0.02em"}}>Réinitialiser votre accès</h1>
        <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "40px", lineHeight: "1.5"}}>
            Entrez votre adresse email pour recevoir un lien sécurisé de réinitialisation.
        </p>

        {/* Form */}
        <form style={{width: "100%", display: "flex", flexDirection: "column", gap: "24px"}} onSubmit={(e) => e.preventDefault()}>
            
            {/* Email */}
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Adresse email</label>
                <div className="login-input-container">
                    <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>mail</span>
                    <input type="email" placeholder="votre@email.com" className="login-input" required />
                </div>
            </div>

            {/* Submit */}
            <button type="submit" style={{width: "100%", background: "var(--color-accent)", color: "#FFFFFF", border: "none", padding: "16px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s", marginTop: "8px"}}>
                Envoyer le lien
            </button>

        </form>

        {/* Back Link */}
        <div style={{marginTop: "32px"}}>
            <Link href="/login" className="login-link" style={{display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600"}}>
                <span className="material-symbols-outlined" style={{fontSize: "18px"}}>arrow_back</span>
                Retour à la connexion
            </Link>
        </div>

      </div>
    </main>
  );
}

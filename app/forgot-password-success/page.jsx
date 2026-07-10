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
      `}</style>

      <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "500px", width: "100%", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
        
        {/* Logo */}
        <Link href="/" style={{marginBottom: "32px", display: "flex", justifyContent: "center", cursor: "pointer"}}>
            <img src="/assets/core/img/logo.png" alt="DONA Logo" style={{height: "120px", width: "auto", objectFit: "contain"}} />
        </Link>

        {/* Success Icon */}
        <div style={{width: "64px", height: "64px", borderRadius: "50%", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px"}}>
            <span className="material-symbols-outlined" style={{fontSize: "28px", color: "var(--color-accent)"}}>check</span>
        </div>

        {/* Heading */}
        <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", letterSpacing: "-0.02em"}}>Email envoyé !</h1>
        <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "40px", lineHeight: "1.6"}}>
            Vérifiez votre boîte de réception (et vos spams).<br />
            Le lien de réinitialisation expire dans 24 heures.
        </p>

        {/* Button */}
        <Link href="/login" style={{display: "block", width: "100%", background: "var(--color-accent)", color: "#FFFFFF", textDecoration: "none", padding: "16px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s"}}>
            Retour à la connexion
        </Link>

      </div>
    </main>
  );
}

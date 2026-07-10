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
        .login-btn-social {
          flex: 1;
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .login-btn-social:hover {
          background: var(--color-bg-alt);
          border-color: var(--color-text-muted);
        }
        [data-theme="dark"] .login-apple-logo {
          filter: invert(1);
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
        <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", textAlign: "center", letterSpacing: "-0.02em"}}>Bienvenue parmi l'Alliance</h1>
        <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "40px"}}>
            Connectez-vous pour accéder à votre espace membre
        </p>

        {/* Form */}
        <form style={{width: "100%", display: "flex", flexDirection: "column", gap: "24px"}} onSubmit={(e) => e.preventDefault()}>
            
            {/* Email */}
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Adresse Email</label>
                <div className="login-input-container">
                    <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>mail</span>
                    <input type="email" placeholder="votre@email.com" className="login-input" required />
                </div>
            </div>

            {/* Password */}
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Mot de passe</label>
                <div className="login-input-container">
                    <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>lock</span>
                    <input type="password" placeholder="••••••••" className="login-input" required />
                    <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)", cursor: "pointer"}}>visibility</span>
                </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-primary)", fontSize: "13px"}}>
                <label style={{display: "flex", alignItems: "center", gap: "8px", color: "var(--color-text-muted)", cursor: "pointer"}}>
                    <input type="checkbox" style={{width: "16px", height: "16px", accentColor: "var(--color-accent)", border: "1px solid var(--color-border)"}} /> Se souvenir de moi
                </label>
                <Link href="/forgot-password" className="login-link">Mot de passe oublié ?</Link>
            </div>

            {/* Submit */}
            <button type="submit" style={{width: "100%", background: "var(--color-accent)", color: "#FFFFFF", border: "none", padding: "16px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s", marginTop: "8px"}}>
                Se connecter
            </button>

        </form>

        {/* Divider */}
        <div style={{width: "100%", display: "flex", alignItems: "center", gap: "16px", margin: "32px 0"}}>
            <div style={{flexGrow: "1", height: "1px", background: "var(--color-border)"}}></div>
            <span style={{fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Ou continuer avec</span>
            <div style={{flexGrow: "1", height: "1px", background: "var(--color-border)"}}></div>
        </div>

        {/* Social Auth */}
        <div style={{width: "100%", display: "flex", gap: "16px"}}>
            <button type="button" className="login-btn-social">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="login-apple-logo" style={{width: "16px", height: "16px"}} /> Apple
            </button>
            <button type="button" className="login-btn-social">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{width: "16px", height: "16px"}} /> Google
            </button>
        </div>

        {/* Signup Link */}
        <div style={{marginTop: "32px", fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)"}}>
            Pas encore membre ? <Link href="/signup" className="login-link" style={{fontWeight: "600"}}>Devenir membre</Link>
        </div>

        {/* Back to Home Link */}
        <div style={{marginTop: "20px"}}>
            <Link href="/" className="login-link" style={{fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600"}}>
                Retour à l'accueil
            </Link>
        </div>

        {/* Security text */}
        <div style={{marginTop: "40px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-primary)", fontSize: "11px", color: "var(--color-text-muted)"}}>
            <span className="material-symbols-outlined" style={{fontSize: "14px"}}>security</span>
            Connexion sécurisée par chiffrement SSL 256-bit
        </div>

      </div>
    </main>
  );
}

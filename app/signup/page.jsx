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
        .name-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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
          .name-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>

      <div className="login-card" style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "500px", width: "100%", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center"}}>
        
        {/* Logo */}
        <Link href="/" style={{marginBottom: "32px", display: "flex", justifyContent: "center", cursor: "pointer"}}>
            <img src="/assets/core/img/logo.png" alt="DONA Logo" className="logo-image" style={{height: "120px", width: "auto", objectFit: "contain", transition: "height 0.3s ease"}} />
        </Link>

        {/* Heading */}
        <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", textAlign: "center", letterSpacing: "-0.02em"}}>Rejoindre le Cercle DONA</h1>
        <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "40px"}}>
            Créez votre compte pour accéder aux 12 Cahiers et outils exclusifs
        </p>

        {/* Form */}
        <form style={{width: "100%", display: "flex", flexDirection: "column", gap: "24px"}} onSubmit={(e) => e.preventDefault()}>
            
            {/* Name Columns */}
            <div className="name-grid">
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Prénom</label>
                    <div className="login-input-container">
                        <input type="text" placeholder="Jane" className="login-input" required />
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Nom</label>
                    <div className="login-input-container">
                        <input type="text" placeholder="Doe" className="login-input" required />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Email</label>
                <div className="login-input-container">
                    <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>mail</span>
                    <input type="email" placeholder="jane.doe@example.com" className="login-input" required />
                </div>
            </div>

            {/* Password */}
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Mot de passe</label>
                <div className="login-input-container">
                    <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>lock</span>
                    <input type="password" placeholder="••••••••" className="login-input" required />
                    <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)", cursor: "pointer"}}>visibility_off</span>
                </div>
                {/* Strength indicator */}
                <div style={{display: "flex", gap: "4px", marginTop: "4px"}}>
                    <div style={{flex: "1", height: "3px", background: "#fecaca", borderRadius: "2px"}}></div>
                    <div style={{flex: "1", height: "3px", background: "#fed7aa", borderRadius: "2px"}}></div>
                    <div style={{flex: "1", height: "3px", background: "#fef08a", borderRadius: "2px"}}></div>
                    <div style={{flex: "1", height: "3px", background: "#bbf7d0", borderRadius: "2px"}}></div>
                </div>
                <div style={{fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px"}}>
                    8 caractères minimum, une majuscule et un chiffre.
                </div>
            </div>

            {/* Confirm Password */}
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Confirmer le mot de passe</label>
                <div className="login-input-container">
                    <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>lock</span>
                    <input type="password" placeholder="••••••••" className="login-input" required />
                </div>
            </div>

            {/* Checkboxes */}
            <div style={{display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px", fontFamily: "var(--font-primary)", fontSize: "13px", color: "var(--color-text-muted)"}}>
                <label style={{display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", lineHeight: "1.4"}}>
                    <input type="checkbox" style={{width: "18px", height: "18px", marginTop: "1px", accentColor: "var(--color-accent)", border: "1px solid var(--color-border)"}} />
                    <span>Recevoir The Brief DONA (optionnel)</span>
                </label>
                <label style={{display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", lineHeight: "1.4"}}>
                    <input type="checkbox" style={{width: "18px", height: "18px", marginTop: "1px", accentColor: "var(--color-accent)", border: "1px solid var(--color-border)"}} />
                    <span>J'accepte les <Link href="#" className="login-link" style={{textDecoration: "underline", textUnderlineOffset: "2px", fontWeight: "600"}}>Conditions Générales</Link> et la <Link href="#" className="login-link" style={{textDecoration: "underline", textUnderlineOffset: "2px", fontWeight: "600"}}>Politique de Confidentialité</Link></span>
                </label>
            </div>

            {/* Submit */}
            <button type="submit" style={{width: "100%", background: "var(--color-accent)", color: "#FFFFFF", border: "none", padding: "16px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s", marginTop: "16px"}}>
                Créer mon compte
            </button>

            {/* Login Link */}
            <div style={{textAlign: "center", fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)"}}>
                Déjà membre ? <Link href="/login" className="login-link" style={{fontWeight: "600"}}>Se connecter</Link>
            </div>

        </form>

        {/* Divider line */}
        <div style={{width: "100%", height: "1px", background: "var(--color-border)", margin: "32px 0"}}></div>

        {/* Security text */}
        <div style={{display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-primary)", fontSize: "11px", color: "var(--color-text-muted)"}}>
            <span className="material-symbols-outlined" style={{fontSize: "14px"}}>security</span>
            Vos données sont protégées et ne seront jamais partagées.
        </div>

      </div>
    </main>
  );
}

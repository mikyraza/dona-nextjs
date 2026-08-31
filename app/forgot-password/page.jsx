"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!email || !email.includes('@')) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la demande de réinitialisation.');
        setLoading(false);
        return;
      }

      setResult(data);

    } catch (err) {
      console.error("[forgot-password] Erreur réseau:", err);
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "40px 20px", background: "var(--color-bg)" }}>
      
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

      <div className="login-card" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "520px", width: "100%", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Logo */}
        <Link href="/" style={{ marginBottom: "32px", display: "flex", justifyContent: "center", cursor: "pointer" }}>
          <img src="/assets/core/img/logo.png" alt="DONA Logo" className="logo-image" style={{ height: "120px", width: "auto", objectFit: "contain", transition: "height 0.3s ease" }} />
        </Link>

        {/* Heading */}
        <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", textAlign: "center", letterSpacing: "-0.02em" }}>Réinitialiser votre accès</h1>
        <p style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "32px", lineHeight: "1.5" }}>
          Entrez votre adresse email pour transmettre une demande sécurisée au serveur de messagerie.
        </p>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", color: "#991B1B", padding: "12px 16px", borderRadius: "2px", fontSize: "13px", width: "100%", marginBottom: "20px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {result ? (
          <div style={{ width: "100%" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10B981", color: "#065F46", padding: "20px", borderRadius: "2px", fontSize: "14px", textAlign: "center", marginBottom: "24px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#10B981", display: "block", marginBottom: "10px" }}>mark_email_read</span>
              <strong>{result.message}</strong>
              <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "8px" }}>
                Un jeton cryptographique à durée limitée (1h) a été généré et expédié par le serveur SMTP.
              </div>
            </div>

            {/* Visual simulation of SMTP delivery with clickable test link */}
            {result.resetUrl && (
              <div style={{ background: "var(--color-bg-alt)", border: "1px dashed var(--color-border)", padding: "16px", borderRadius: "2px", fontSize: "12px", color: "var(--color-text)" }}>
                <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "10px", color: "var(--color-accent)", letterSpacing: "1px", marginBottom: "8px" }}>
                  ✉ Simulation d'envoi Email Service (SMTP/Resend Dispatcher)
                </div>
                <div style={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "11px", marginBottom: "12px", background: "var(--color-bg)", padding: "8px", border: "1px solid var(--color-border)" }}>
                  Lien généré : <a href={result.resetUrl} style={{ color: "var(--color-accent)", textDecoration: "underline" }}>{result.resetUrl}</a>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Link 
                    href={result.resetUrl} 
                    style={{ display: "inline-block", background: "var(--color-accent)", color: "#fff", padding: "10px 18px", borderRadius: "2px", textDecoration: "none", fontWeight: "600", fontSize: "12px" }}
                  >
                    Ouvrir le lien de réinitialisation →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Form */
          <form style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }} onSubmit={handleSubmit}>
              
              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Adresse email</label>
                  <div className="login-input-container">
                      <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--color-text-muted)" }}>mail</span>
                      <input 
                        type="email" 
                        placeholder="votre@email.com" 
                        className="login-input" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required 
                      />
                  </div>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: "100%", background: "var(--color-accent)", color: "#FFFFFF", border: "none", padding: "16px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s", marginTop: "8px" }}
              >
                  {loading ? "Génération..." : "Envoyer le lien"}
              </button>

          </form>
        )}

        {/* Back Link */}
        <div style={{ marginTop: "32px" }}>
            <Link href="/login" className="login-link" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
                Retour à la connexion
            </Link>
        </div>

      </div>
    </main>
  );
}

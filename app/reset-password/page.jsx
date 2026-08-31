"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Veuillez entrer un nouveau mot de passe.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Le mot de passe doit contenir au moins une lettre majuscule.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Le mot de passe doit contenir au moins un chiffre.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la réinitialisation.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Erreur réseau lors de la communication avec le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "500px", width: "100%", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Link href="/" style={{ marginBottom: "32px", display: "flex", justifyContent: "center", cursor: "pointer" }}>
        <img src="/assets/core/img/logo.png" alt="DONA Logo" style={{ height: "100px", width: "auto", objectFit: "contain" }} />
      </Link>

      <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", textAlign: "center" }}>
        Nouveau mot de passe
      </h1>
      <p style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "32px" }}>
        {email ? `Définissez un nouveau mot de passe pour ${email}` : "Définissez votre nouveau mot de passe sécurisé."}
      </p>

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", color: "#991B1B", padding: "12px 16px", borderRadius: "2px", fontSize: "13px", width: "100%", marginBottom: "20px", textAlign: "center" }}>
          {error}
        </div>
      )}

      {success ? (
        <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10B981", color: "#065F46", padding: "20px", borderRadius: "2px", fontSize: "14px", width: "100%", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#10B981", display: "block", marginBottom: "8px" }}>check_circle</span>
          Votre mot de passe a été réinitialisé et haché en base avec succès !<br />
          <span style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "8px", display: "block" }}>Redirection vers la page de connexion...</span>
        </div>
      ) : (
        <form style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }} onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase" }}>Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="8+ car, 1 majuscule, 1 chiffre"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-border)", background: "var(--color-bg-alt)", borderRadius: "2px", color: "var(--color-text)", outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase" }}>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-border)", background: "var(--color-bg-alt)", borderRadius: "2px", color: "var(--color-text)", outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "var(--color-accent)", color: "#FFFFFF", border: "none", padding: "16px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
          >
            {loading ? "Mise à jour..." : "Enregistrer le mot de passe"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "40px 20px", background: "var(--color-bg)" }}>
      <Suspense fallback={<div style={{ color: "var(--color-text)" }}>Chargement...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}

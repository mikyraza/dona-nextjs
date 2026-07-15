"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(errorParam === "Unauthorized" ? "Accès refusé. Rôle Administrateur requis." : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Identifiants administratifs incorrects.");
      } else {
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        const allowedAdminRoles = ["Super-Admin", "Éditeur", "Journaliste", "Traducteur"];
        if (session?.user?.role && allowedAdminRoles.includes(session.user.role)) {
          router.push("/admin/dashboard");
        } else {
          router.push(res?.url || callbackUrl);
        }
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur de connexion est survenue.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: "440px",
      background: "#FFFFFF",
      border: "1px solid #EAEAEA",
      padding: "48px 40px",
      borderRadius: "2px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "32px" }}>
        <img 
          src="/assets/core/img/logo.png" 
          alt="DONA Logo" 
          style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
        />
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: "700",
          fontSize: "12px",
          letterSpacing: "0.15em",
          color: "#111111"
        }}>ADMIN</span>
      </div>

      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "26px",
        fontWeight: "500",
        fontStyle: "italic",
        color: "#111111",
        textAlign: "center",
        marginBottom: "8px"
      }}>
        Connexion Espace Admin
      </h1>
      
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        color: "#666666",
        textAlign: "center",
        marginBottom: "32px"
      }}>
        Saisissez vos identifiants pour gérer la plateforme
      </p>

      {/* Error block */}
      {error && (
        <div style={{
          background: "#FFF5F5",
          borderLeft: "4px solid #A30626",
          padding: "12px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "13px",
          color: "#A30626",
          fontWeight: "500"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "600", color: "#888888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Identifiant Admin (Email)
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #EAEAEA",
            background: "#FAF9F6",
            padding: "12px 14px",
            borderRadius: "2px"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#888888" }}>mail</span>
            <input 
              type="email"
              placeholder="admin@dona.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                flexGrow: 1,
                border: "none",
                background: "transparent",
                fontSize: "14px",
                outline: "none",
                color: "#111111"
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "600", color: "#888888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Mot de passe
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #EAEAEA",
            background: "#FAF9F6",
            padding: "12px 14px",
            borderRadius: "2px"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#888888" }}>lock</span>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                flexGrow: 1,
                border: "none",
                background: "transparent",
                fontSize: "14px",
                outline: "none",
                color: "#111111"
              }}
            />
            <span 
              className="material-symbols-outlined" 
              style={{ fontSize: "20px", color: "#888888", cursor: "pointer", userSelect: "none" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#888888" : "#A30626",
            color: "#FFFFFF",
            border: "none",
            padding: "14px",
            borderRadius: "2px",
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            marginTop: "10px",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {loading ? "Connexion..." : "Accéder au Panel"}
        </button>
      </form>

      {/* Return link */}
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Link href="/" style={{ fontSize: "11px", color: "#888888", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "600" }}>
          Retour au Site Public
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#FAF9F6",
      padding: "20px"
    }}>
      <Suspense fallback={
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#888888" }}>
          Chargement du portail admin...
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}

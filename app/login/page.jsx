"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { getActiveUserSubscription } from '@/lib/subscriptionPermissions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const isVipIntent = searchParams.get("vip") === "1" || callbackUrl.includes("/magazines/") || callbackUrl.includes("/espace-lecture") || callbackUrl.includes("vip");

  const { data: session } = useSession();
  const [activeSub, setActiveSub] = useState({ isGuest: true, plan: 'Essentiel' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sub = getActiveUserSubscription();
    setActiveSub(sub);
  }, [session]);

  const isLoggedIn = mounted && (session?.user || (!activeSub.isGuest && activeSub.email));
  const userName = session?.user?.name || activeSub.name || activeSub.email?.split('@')[0] || "Membre";
  const userPlan = activeSub.plan || "Essentiel";

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('dona_member_profile');
      window.dispatchEvent(new Event('dona_subscription_changed'));
    } catch (e) {}
    signOut({ callbackUrl: '/login' });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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
        setError("Adresse email ou mot de passe incorrect.");
      } else {
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        const allowedAdminRoles = ["Super-Admin", "Éditeur", "Journaliste", "Traducteur"];
        const userRole = session?.user?.role || "VIP";

        try {
          const profile = {
            email: session?.user?.email || email,
            name: session?.user?.name || email.split('@')[0] || "Membre",
            role: userRole,
            plan: allowedAdminRoles.includes(userRole) ? "Élite" : (activeSub.plan || "Essentiel"),
            status: "Active",
            isGuest: false
          };
          localStorage.setItem("dona_member_profile", JSON.stringify(profile));
          window.dispatchEvent(new Event("dona_subscription_changed"));
        } catch (e) {
          console.error("Error saving session profile:", e);
        }

        let destination = "/espace-lecture";
        if (callbackUrl && callbackUrl !== '/' && !callbackUrl.includes('/login') && !callbackUrl.includes('/vip')) {
          destination = callbackUrl;
        }
        if (session?.user?.role && allowedAdminRoles.includes(session.user.role)) {
          destination = "/admin/dashboard";
        }

        router.push(destination);
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur de connexion est survenue.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, render clean static member card without timer loops or flicker
  if (mounted && isLoggedIn) {
    const targetUrl = (callbackUrl && callbackUrl !== '/' && !callbackUrl.includes('/login') && !callbackUrl.includes('/vip'))
      ? callbackUrl 
      : '/espace-lecture';

    return (
      <div className="login-card" style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "500px", width: "100%", borderRadius: "4px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
        <Link href="/" style={{marginBottom: "24px", display: "flex", justifyContent: "center", cursor: "pointer"}}>
          <img src="/assets/core/img/logo.png" alt="DONA Logo" className="logo-image" style={{height: "120px", width: "auto", objectFit: "contain"}} />
        </Link>

        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(163, 6, 38, 0.08)",
          border: "1px solid rgba(163, 6, 38, 0.2)",
          color: "var(--color-accent)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>account_circle</span>
        </div>

        <span style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "800", letterSpacing: "0.15em", color: "var(--color-accent)", textTransform: "uppercase", marginBottom: "8px" }}>
          VOUS ÊTES DÉJÀ CONNECTÉ
        </span>

        <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "700", color: "var(--color-text)", marginBottom: "8px" }}>
          Bonjour, {userName}
        </h2>

        <p style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "28px", lineHeight: "1.5" }}>
          Vous êtes identifié avec un compte <strong>{userPlan}</strong>.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <Link
            href={targetUrl}
            style={{
              background: "var(--color-accent)",
              color: "#FFF",
              padding: "14px 24px",
              borderRadius: "2px",
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "block",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            Continuer vers mon espace lecture →
          </Link>

          <Link
            href="/member-profile"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              padding: "12px 24px",
              borderRadius: "2px",
              fontWeight: "600",
              fontSize: "12px",
              textDecoration: "none",
              display: "block",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            Mon Profil Membre
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              background: "none",
              border: "none",
              color: "#C81E1E",
              padding: "8px 24px",
              borderRadius: "2px",
              fontWeight: "600",
              fontSize: "11px",
              cursor: "pointer",
              marginTop: "4px"
            }}
          >
            Se déconnecter de ce compte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-card" style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "500px", width: "100%", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center"}}>
      
      {/* Logo */}
      <Link href="/" style={{marginBottom: "24px", display: "flex", justifyContent: "center", cursor: "pointer"}}>
          <img src="/assets/core/img/logo.png" alt="DONA Logo" className="logo-image" style={{height: "120px", width: "auto", objectFit: "contain", transition: "height 0.3s ease"}} />
      </Link>

      {/* VIP Intent Badge */}
      {isVipIntent && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(163, 6, 38, 0.08)",
          border: "1px solid rgba(163, 6, 38, 0.2)",
          padding: "6px 14px",
          borderRadius: "2px",
          marginBottom: "16px",
          color: "var(--color-accent)",
          fontFamily: "var(--font-primary)",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>stars</span>
          <span>Connexion Espace Membre VIP</span>
        </div>
      )}

      {/* Title */}
      <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "8px", textAlign: "center", letterSpacing: "-0.01em"}}>
        Bienvenue parmi l&apos;Alliance
      </h1>
      <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "32px", textAlign: "center"}}>
        Connectez-vous pour accéder à votre espace membre
      </p>

      {/* Error Message */}
      {error && (
        <div style={{background: "#FDE8E8", border: "1px solid #F8B4B4", color: "#9B1C1C", padding: "12px 16px", borderRadius: "2px", fontSize: "13px", width: "100%", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px"}}>
          <span className="material-symbols-outlined" style={{fontSize: "18px"}}>error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{width: "100%", display: "flex", flexDirection: "column", gap: "20px"}}>
        
        {/* Email */}
        <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
          <label htmlFor="email" style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em", color: "var(--color-text)", textTransform: "uppercase"}}>
            Adresse Email
          </label>
          <div style={{position: "relative", display: "flex", alignItems: "center"}}>
            <span className="material-symbols-outlined" style={{position: "absolute", left: "14px", color: "var(--color-text-muted)", fontSize: "20px"}}>mail</span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{
                width: "100%",
                padding: "12px 14px 12px 44px",
                background: "var(--color-bg-alt)",
                border: "1px solid var(--color-border)",
                borderRadius: "2px",
                fontSize: "14px",
                color: "var(--color-text)",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
          <label htmlFor="password" style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em", color: "var(--color-text)", textTransform: "uppercase"}}>
            Mot de passe
          </label>
          <div style={{position: "relative", display: "flex", alignItems: "center"}}>
            <span className="material-symbols-outlined" style={{position: "absolute", left: "14px", color: "var(--color-text-muted)", fontSize: "20px"}}>lock</span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 44px 12px 44px",
                background: "var(--color-bg-alt)",
                border: "1px solid var(--color-border)",
                borderRadius: "2px",
                fontSize: "14px",
                color: "var(--color-text)",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              style={{position: "absolute", right: "14px", background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", display: "flex", alignItems: "center"}}
            >
              <span className="material-symbols-outlined" style={{fontSize: "20px"}}>
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px"}}>
          <label style={{display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--color-text-muted)"}}>
            <input type="checkbox" style={{accentColor: "var(--color-accent)"}} />
            <span>Se souvenir de moi</span>
          </label>
          <Link href="/abonnement" style={{color: "var(--color-text-muted)", textDecoration: "none"}}>
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "var(--color-accent)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "2px",
            padding: "14px",
            fontFamily: "var(--font-primary)",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            marginTop: "12px",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Connexion en cours..." : "SE CONNECTER"}
        </button>

      </form>

      {/* Divider */}
      <div style={{width: "100%", display: "flex", alignItems: "center", margin: "24px 0", gap: "12px"}}>
        <div style={{flex: 1, height: "1px", background: "var(--color-border)"}}></div>
        <span style={{fontSize: "10px", color: "var(--color-text-muted)", fontWeight: "700", letterSpacing: "0.1em"}}>OU CONTINUER AVEC</span>
        <div style={{flex: 1, height: "1px", background: "var(--color-border)"}}></div>
      </div>

      {/* Social Login */}
      <div style={{width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
        <button
          type="button"
          onClick={() => signIn("apple", { callbackUrl })}
          style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "12px", fontWeight: "600", color: "var(--color-text)", cursor: "pointer"}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.64-.78 1.08-1.85.96-2.93-.93.04-2.07.62-2.74 1.4-.6.7-.1.13-1.73 1.84.99-.04 2.12-.53 2.75-1.31z"/></svg>
          Apple
        </button>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "12px", fontWeight: "600", color: "var(--color-text)", cursor: "pointer"}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/></svg>
          Google
        </button>
      </div>

      {/* Register Footer */}
      <div style={{marginTop: "32px", textAlign: "center", fontSize: "13px", color: "var(--color-text-muted)"}}>
        Pas encore abonné VIP ?{" "}
        <Link href="/abonnement" style={{color: "var(--color-accent)", fontWeight: "700", textDecoration: "none"}}>
          Découvrir les offres d&apos;abonnement
        </Link>
      </div>

      {/* Admin Portal Shortcut */}
      <div style={{marginTop: "16px", textAlign: "center", fontSize: "11px", color: "var(--color-text-muted)"}}>
        Équipe éditoriale & rédaction ?{" "}
        <Link href="/admin/login" style={{color: "var(--color-text)", fontWeight: "600", textDecoration: "underline"}}>
          Accès Portail Admin
        </Link>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <main style={{background: "var(--color-bg-alt)", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px"}}>
      <Suspense fallback={<div style={{color: "var(--color-text-muted)"}}>Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

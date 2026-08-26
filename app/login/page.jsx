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

  const isLoggedIn = mounted && (session?.user || !activeSub.isGuest);
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

        // Sync member profile & subscription status for frontend paywall access
        try {
          const profile = {
            email: session?.user?.email || email,
            name: session?.user?.name || "Membre",
            role: userRole,
            plan: allowedAdminRoles.includes(userRole) ? "Élite" : "Essentiel",
            status: "Active",
            isGuest: false
          };
          localStorage.setItem("dona_member_profile", JSON.stringify(profile));
          window.dispatchEvent(new Event("dona_subscription_changed"));
        } catch (e) {
          console.error("Error saving session profile:", e);
        }

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

  if (isLoggedIn) {
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
          <button
            type="button"
            onClick={() => {
              router.push(targetUrl);
              router.refresh();
            }}
            style={{
              background: "var(--color-accent)",
              color: "#FFF",
              padding: "14px 24px",
              borderRadius: "2px",
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              width: "100%",
              display: "block"
            }}
          >
            Continuer vers mon espace →
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              background: "none",
              border: "1px solid var(--color-border)",
              color: "#C81E1E",
              padding: "12px 24px",
              borderRadius: "2px",
              fontWeight: "600",
              fontSize: "12px",
              cursor: "pointer"
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

      {/* Heading */}
      <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", textAlign: "center", letterSpacing: "-0.02em"}}>
        {isVipIntent ? "Accès à la Zone VIP" : "Bienvenue parmi l'Alliance"}
      </h1>
      <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "30px"}}>
        {isVipIntent 
          ? "Identifiez-vous pour débloquer les analyses exclusives et les dossiers réservés."
          : "Connectez-vous pour accéder à votre espace membre"}
      </p>

      {/* Error Message */}
      {error && (
        <div style={{width: "100%", background: "#FDF2F2", borderLeft: "4px solid #F05252", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "2px"}}>
          <span className="material-symbols-outlined" style={{color: "#F05252", fontSize: "20px"}}>error</span>
          <span style={{fontFamily: "var(--font-primary)", fontSize: "13px", color: "#C81E1E", fontWeight: "500"}}>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{width: "100%", display: "flex", flexDirection: "column", gap: "24px"}}>
          
          {/* Email */}
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Adresse Email</label>
              <div className="login-input-container">
                  <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>mail</span>
                  <input 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="login-input" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                  />
              </div>
          </div>

          {/* Password */}
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Mot de passe</label>
              <div className="login-input-container">
                  <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>lock</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="login-input" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={loading}
                  />
                  <span 
                    className="material-symbols-outlined" 
                    style={{fontSize: "20px", color: "var(--color-text-muted)", cursor: "pointer", userSelect: "none"}}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
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
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: "100%", 
              background: loading ? "var(--color-text-muted)" : "var(--color-accent)", 
              color: "#FFFFFF", 
              border: "none", 
              padding: "16px", 
              borderRadius: "2px", 
              fontFamily: "var(--font-primary)", 
              fontSize: "14px", 
              fontWeight: "600", 
              letterSpacing: "0.15em", 
              textTransform: "uppercase", 
              cursor: loading ? "not-allowed" : "pointer", 
              transition: "background 0.2s", 
              marginTop: "8px"
            }}
          >
              {loading ? "Connexion en cours..." : "Se connecter"}
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

      {/* Signup / Subscribe Link */}
      <div style={{marginTop: "32px", fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center"}}>
        {isVipIntent ? (
          <>Pas encore abonné VIP ? <Link href="/abonnement" className="login-link" style={{fontWeight: "700", color: "var(--color-accent)"}}>Découvrir les offres d'abonnement</Link></>
        ) : (
          <>Pas encore membre ? <Link href="/signup" className="login-link" style={{fontWeight: "600"}}>Devenir membre</Link></>
        )}
      </div>

      {/* Admin Link Distinction */}
      <div style={{marginTop: "16px", textAlign: "center", fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-text-muted)"}}>
        Équipe éditoriale & rédaction ? <Link href="/admin/login" className="login-link" style={{textDecoration: "underline"}}>Accès Portail Admin</Link>
      </div>

      {/* Back to Home Link */}
      <div style={{marginTop: "16px"}}>
          <Link href="/" className="login-link" style={{fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600"}}>
              Retour à l'accueil
          </Link>
      </div>

      {/* Security text */}
      <div style={{marginTop: "32px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-primary)", fontSize: "11px", color: "var(--color-text-muted)"}}>
          <span className="material-symbols-outlined" style={{fontSize: "14px"}}>security</span>
          Connexion sécurisée par chiffrement SSL 256-bit
      </div>

    </div>
  );
}

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

      <Suspense fallback={
        <div style={{fontFamily: "var(--font-primary)", color: "var(--color-text-muted)"}}>
          Chargement de l'Alliance...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}

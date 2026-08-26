"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'essentiel';
  const billing = searchParams.get('billing') || 'annual';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const planLabels = {
    essentiel: { name: 'Essentiel', price: '0€ / Gratuit', color: 'var(--color-text)' },
    premium: { name: 'Premium', price: billing === 'monthly' ? '29€/mois' : '23€/mois (Facturé 278€/an)', color: 'var(--color-accent)' },
    elite: { name: 'Élite', price: billing === 'monthly' ? '79€/mois' : '63€/mois (Facturé 758€/an)', color: 'var(--color-text)' }
  };

  const selectedPlan = planLabels[plan.toLowerCase()] || planLabels.essentiel;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    const todayStr = new Date().toLocaleDateString('fr-FR');
    const newMember = {
      id: `mem-${Date.now()}`,
      name: `${firstName} ${lastName}`.trim() || 'Nouveau Membre',
      email: email,
      plan: selectedPlan.name,
      status: 'Active',
      joined: todayStr
    };

    try {
      // 1. Add to Admin Members list
      const existing = localStorage.getItem('dona_admin_members_db');
      const membersList = existing ? JSON.parse(existing) : [];
      localStorage.setItem('dona_admin_members_db', JSON.stringify([newMember, ...membersList]));

      // 2. Set active member profile for member-profile page
      localStorage.setItem('dona_member_profile', JSON.stringify({
        firstName: firstName || 'Ernest',
        lastName: lastName || 'Dupont',
        email: email || 'ernest@example.com',
        phone: '',
        avatar: null
      }));
    } catch (e) {
      console.error('Error saving registration data:', e);
    }

    setTimeout(() => {
      setLoading(false);
      router.push('/member-profile');
    }, 600);
  };

  return (
    <div className="login-card" style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "520px", width: "100%", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center"}}>
      
      {/* Logo */}
      <Link href="/" style={{marginBottom: "32px", display: "flex", justifyContent: "center", cursor: "pointer"}}>
          <img src="/assets/core/img/logo.png" alt="DONA Logo" className="logo-image" style={{height: "120px", width: "auto", objectFit: "contain", transition: "height 0.3s ease"}} />
      </Link>

      {/* Heading */}
      <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", textAlign: "center", letterSpacing: "-0.02em"}}>Rejoindre le Cercle DONA</h1>
      <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "24px"}}>
          Créez votre compte pour accéder aux 16 Cahiers et outils exclusifs
      </p>

      {/* Selected Plan Banner */}
      <div style={{
        width: "100%",
        padding: "12px 16px",
        background: "var(--color-bg-alt)",
        border: "1px solid var(--color-border)",
        borderRadius: "2px",
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px"
      }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Formule sélectionnée :</span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: selectedPlan.color }}>{selectedPlan.name} • {selectedPlan.price}</span>
        </div>
        <Link href="/abonnement" style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-accent)", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Changer
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{width: "100%", background: "#FDF2F2", borderLeft: "4px solid #F05252", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "2px"}}>
          <span className="material-symbols-outlined" style={{color: "#F05252", fontSize: "20px"}}>error</span>
          <span style={{fontFamily: "var(--font-primary)", fontSize: "13px", color: "#C81E1E", fontWeight: "500"}}>{error}</span>
        </div>
      )}

      {/* Form */}
      <form style={{width: "100%", display: "flex", flexDirection: "column", gap: "24px"}} onSubmit={handleSubmit}>
          
          {/* Name Columns */}
          <div className="name-grid">
              <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Prénom</label>
                  <div className="login-input-container">
                      <input 
                        type="text" 
                        placeholder="Jane" 
                        className="login-input" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                        disabled={loading}
                      />
                  </div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Nom</label>
                  <div className="login-input-container">
                      <input 
                        type="text" 
                        placeholder="Doe" 
                        className="login-input" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                        disabled={loading}
                      />
                  </div>
              </div>
          </div>

          {/* Email */}
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Email</label>
              <div className="login-input-container">
                  <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>mail</span>
                  <input 
                    type="email" 
                    placeholder="jane.doe@example.com" 
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
                    style={{fontSize: "20px", color: "var(--color-text-muted)", cursor: "pointer"}}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
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
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="login-input" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    disabled={loading}
                  />
              </div>
          </div>

          {/* Checkboxes */}
          <div style={{display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px", fontFamily: "var(--font-primary)", fontSize: "13px", color: "var(--color-text-muted)"}}>
              <label style={{display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", lineHeight: "1.4"}}>
                  <input type="checkbox" style={{width: "18px", height: "18px", marginTop: "1px", accentColor: "var(--color-accent)", border: "1px solid var(--color-border)"}} />
                  <span>Recevoir The Brief DONA (optionnel)</span>
              </label>
              <label style={{display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", lineHeight: "1.4"}}>
                  <input type="checkbox" required style={{width: "18px", height: "18px", marginTop: "1px", accentColor: "var(--color-accent)", border: "1px solid var(--color-border)"}} />
                  <span>J'accepte les <Link href="#" className="login-link" style={{textDecoration: "underline", textUnderlineOffset: "2px", fontWeight: "600"}}>Conditions Générales</Link> et la <Link href="#" className="login-link" style={{textDecoration: "underline", textUnderlineOffset: "2px", fontWeight: "600"}}>Politique de Confidentialité</Link></span>
              </label>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: "100%", 
              background: "var(--color-accent)", 
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
              opacity: loading ? 0.7 : 1,
              transition: "background 0.2s", 
              marginTop: "16px"
            }}
          >
            {loading ? "Création en cours..." : "Créer mon compte"}
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
          <span className="material-symbols-outlined" style={{fontSize: "14px"}}>lock</span>
          Vos données sont protégées et chiffrées selon les standards de sécurité les plus stricts.
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

      <Suspense fallback={
        <div style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
          Chargement du formulaire...
        </div>
      }>
        <SignupForm />
      </Suspense>
    </main>
  );
}

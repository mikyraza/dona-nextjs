"use client";

import React, { useState, useRef, Suspense } from 'react';
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
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const planLabels = {
    essentiel: { name: 'Essentiel', price: '0€ / Gratuit', color: 'var(--color-text)' },
    premium: { name: 'Premium', price: billing === 'monthly' ? '29€/mois' : '23€/mois (Facturé 278€/an)', color: 'var(--color-accent)' },
    elite: { name: 'Élite', price: billing === 'monthly' ? '79€/mois' : '63€/mois (Facturé 758€/an)', color: 'var(--color-text)' }
  };

  const selectedPlan = planLabels[plan.toLowerCase()] || planLabels.essentiel;

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La photo est trop lourde (max 5 Mo).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setAvatar(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      phone: phone,
      avatar: avatar,
      plan: selectedPlan.name,
      status: 'Active',
      joined: todayStr
    };

    try {
      // 1. Add to Admin Members DB
      const existing = localStorage.getItem('dona_admin_members_db');
      const membersList = existing ? JSON.parse(existing) : [];
      localStorage.setItem('dona_admin_members_db', JSON.stringify([newMember, ...membersList]));

      // 2. Set active member profile for member-profile page
      localStorage.setItem('dona_member_profile', JSON.stringify({
        firstName: firstName || 'Ernest',
        lastName: lastName || 'Dupont',
        email: email || 'ernest@example.com',
        phone: phone || '',
        avatar: avatar || null
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
    <div className="login-card" style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", maxWidth: "540px", width: "100%", borderRadius: "2px", boxShadow: "0 20px 40px rgba(0,0,0,0.02)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center"}}>
      
      {/* Logo */}
      <Link href="/" style={{marginBottom: "32px", display: "flex", justifyContent: "center", cursor: "pointer"}}>
          <img src="/assets/core/img/logo.png" alt="DONA Logo" className="logo-image" style={{height: "120px", width: "auto", objectFit: "contain", transition: "height 0.3s ease"}} />
      </Link>

      {/* Heading */}
      <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "700", color: "var(--color-text)", marginBottom: "12px", textAlign: "center", letterSpacing: "-0.02em"}}>Rejoindre le Cercle DONA</h1>
      <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "24px"}}>
          Créez votre compte pour accéder aux 16 Magazines et outils exclusifs
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
          
          {/* Avatar Upload (Optionnel) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--color-bg-alt)",
                border: "2px dashed var(--color-border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                transition: "border-color 0.3s ease"
              }}
              title="Ajouter une photo de profil"
            >
              {avatar ? (
                <img src={avatar} alt="Aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "var(--color-text-muted)" }}>photo_camera</span>
                </>
              )}
            </div>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
              {avatar ? "Changer la photo" : "Photo de profil (Optionnel)"}
            </span>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: "none" }} />
          </div>

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

          {/* Phone */}
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "600", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.05em"}}>Téléphone</label>
              <div className="login-input-container">
                  <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)"}}>call</span>
                  <input 
                    type="tel" 
                    placeholder="+33 6 12 34 56 78" 
                    className="login-input" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-crimson"
            style={{
              width: "100%", 
              marginTop: "12px", 
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            disabled={loading}
          >
            {loading ? (
              <span>CRÉATION DU COMPTE...</span>
            ) : (
              <>
                <span>CRÉER MON COMPTE</span>
                <span className="material-symbols-outlined" style={{fontSize: "18px"}}>arrow_forward</span>
              </>
            )}
          </button>

      </form>

      {/* Footer link */}
      <div style={{marginTop: "32px", textAlign: "center", borderTop: "1px solid var(--color-border)", paddingTop: "24px", width: "100%"}}>
        <span style={{fontFamily: "var(--font-primary)", fontSize: "13px", color: "var(--color-text-muted)"}}>Déjà membre ? </span>
        <Link href="/login" style={{fontFamily: "var(--font-primary)", fontSize: "13px", fontWeight: "700", color: "var(--color-accent)", textDecoration: "none"}}>
          Se connecter
        </Link>
      </div>

    </div>
  );
}

export default function Page() {
  return (
    <main style={{
      background: "var(--color-bg)",
      minHeight: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px"
    }}>
      <style>{`
        .name-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .login-input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 12px 16px;
          transition: border-color 0.3s ease;
        }
        .login-input-container:focus-within {
          border-color: var(--color-accent);
        }
        .login-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-primary);
          font-size: 14px;
          color: var(--color-text);
          width: 100%;
        }
        @media (max-width: 500px) {
          .name-grid {
            grid-template-columns: 1fr;
          }
          .login-card {
            padding: 24px !important;
          }
        }
      `}</style>
      <Suspense fallback={<div style={{ color: "var(--color-text)" }}>Chargement...</div>}>
        <SignupForm />
      </Suspense>
    </main>
  );
}

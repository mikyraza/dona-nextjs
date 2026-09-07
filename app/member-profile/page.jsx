"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Page() {
  const [profile, setProfile] = useState({
    firstName: "Ernest",
    lastName: "Dupont",
    email: "ernest@example.com",
    phone: "+33 6 12 34 56 78",
    avatar: null,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Bookmarks Management State
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "bookmarks"
  const [savedArticles, setSavedArticles] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // Load profile and check tab from URL
  useEffect(() => {
    const syncProfileFromStorage = () => {
      try {
        const saved = localStorage.getItem('dona_member_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile(prev => ({
            ...prev,
            ...parsed
          }));
        }
      } catch (e) {
        console.error("Error loading profile from localStorage:", e);
      }
    };

    syncProfileFromStorage();
    window.addEventListener('dona_subscription_changed', syncProfileFromStorage);
    document.addEventListener('dona_subscription_changed', syncProfileFromStorage);
    window.addEventListener('storage', syncProfileFromStorage);

    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('tab') === 'bookmarks' || window.location.hash === '#bookmarks') {
          setActiveTab('bookmarks');
        }
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('dona_subscription_changed', syncProfileFromStorage);
      document.removeEventListener('dona_subscription_changed', syncProfileFromStorage);
      window.removeEventListener('storage', syncProfileFromStorage);
    };
  }, []);

  // Load and synchronize bookmarks from localStorage and API
  const loadBookmarks = async () => {
    try {
      setLoadingBookmarks(true);
      const storedIdsStr = localStorage.getItem('dona_saved_items');
      const savedIds = storedIdsStr ? JSON.parse(storedIdsStr) : [];

      const storedDataStr = localStorage.getItem('dona_saved_articles_data');
      const savedDataMap = storedDataStr ? JSON.parse(storedDataStr) : {};

      // If we have saved IDs that don't have rich data yet, fetch from /api/espace-lecture
      const missingIds = savedIds.filter(id => !savedDataMap[id]);
      let apiItemsMap = {};

      if (missingIds.length > 0 || savedIds.length > 0) {
        try {
          const res = await fetch('/api/espace-lecture');
          if (res.ok) {
            const apiItems = await res.json();
            if (Array.isArray(apiItems)) {
              apiItems.forEach(item => {
                apiItemsMap[item.id] = item;
              });
            }
          }
        } catch (fetchErr) {
          console.warn("Could not fetch /api/espace-lecture for bookmark enrichment:", fetchErr);
        }
      }

      const list = savedIds.map(id => {
        if (savedDataMap[id]) {
          return savedDataMap[id];
        }
        if (apiItemsMap[id]) {
          const item = apiItemsMap[id];
          return {
            id: item.id,
            title: item.title,
            meta: item.metaText || item.meta || "Article",
            image: item.imagePath || item.image || "/assets/core/img/home_alaune_side2_1782125722981.png",
            ctaHref: item.ctaHref || `/espace-lecture`,
            type: item.type || "ARTICLE",
            savedAt: new Date().toISOString()
          };
        }
        return {
          id,
          title: `Article ${id}`,
          meta: "Article sauvegardé",
          image: "/assets/core/img/home_alaune_side2_1782125722981.png",
          ctaHref: `/espace-lecture`,
          type: "ARTICLE",
          savedAt: new Date().toISOString()
        };
      });

      setSavedArticles(list);
    } catch (e) {
      console.error("Error loading bookmarks:", e);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  useEffect(() => {
    loadBookmarks();

    const handleBookmarksUpdated = () => {
      loadBookmarks();
    };

    window.addEventListener('dona_bookmarks_updated', handleBookmarksUpdated);
    window.addEventListener('storage', handleBookmarksUpdated);

    return () => {
      window.removeEventListener('dona_bookmarks_updated', handleBookmarksUpdated);
      window.removeEventListener('storage', handleBookmarksUpdated);
    };
  }, []);

  const handleRemoveBookmark = (articleId) => {
    try {
      const storedIdsStr = localStorage.getItem('dona_saved_items');
      const ids = storedIdsStr ? new Set(JSON.parse(storedIdsStr)) : new Set();
      ids.delete(articleId);

      const storedDataStr = localStorage.getItem('dona_saved_articles_data');
      let detailsMap = storedDataStr ? JSON.parse(storedDataStr) : {};
      delete detailsMap[articleId];

      localStorage.setItem('dona_saved_items', JSON.stringify(Array.from(ids)));
      localStorage.setItem('dona_saved_articles_data', JSON.stringify(detailsMap));

      setSavedArticles(prev => prev.filter(item => item.id !== articleId));

      window.dispatchEvent(new CustomEvent('dona_bookmarks_updated', {
        detail: { articleId, isSaved: false, items: Array.from(ids) }
      }));
    } catch (e) {
      console.error("Error removing bookmark:", e);
    }
  };

  const handleClearAllBookmarks = () => {
    if (!window.confirm("Êtes-vous sûr de vouloir vider tous vos articles sauvegardés ?")) {
      return;
    }
    try {
      localStorage.removeItem('dona_saved_items');
      localStorage.removeItem('dona_saved_articles_data');
      setSavedArticles([]);
      window.dispatchEvent(new CustomEvent('dona_bookmarks_updated', {
        detail: { articleId: null, isSaved: false, items: [] }
      }));
    } catch (e) {
      console.error("Error clearing bookmarks:", e);
    }
  };

  // Handle avatar photo selection
  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSaveStatus({ type: 'error', message: 'L\'image est trop lourde (max 5 Mo).' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Image = uploadEvent.target.result;
        setProfile(prev => ({
          ...prev,
          avatar: base64Image
        }));
        setSaveStatus({ type: 'success', message: 'Photo mise à jour ! N\'oubliez pas d\'enregistrer les modifications.' });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submit (Server-Side Persistence + Password Hashing)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus(null);

    if (password) {
      if (password.length < 8) {
        setSaveStatus({ type: 'error', message: 'Le nouveau mot de passe doit faire au moins 8 caractères.' });
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setSaveStatus({ type: 'error', message: 'Le nouveau mot de passe doit contenir au moins une lettre majuscule.' });
        return;
      }
      if (!/[0-9]/.test(password)) {
        setSaveStatus({ type: 'error', message: 'Le nouveau mot de passe doit contenir au moins un chiffre.' });
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Envoi au serveur pour mise à jour réelle dans users_db.json + hachage NextAuth
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          avatar: profile.avatar,
          currentPassword,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveStatus({ type: 'error', message: data.error || 'Erreur lors de la mise à jour du profil.' });
        setLoading(false);
        return;
      }

      // 2. Mise à jour du cache local
      const updatedProfile = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar,
      };

      localStorage.setItem('dona_member_profile', JSON.stringify(updatedProfile));

      // Re-sync local admin table
      try {
        const storedAdmin = localStorage.getItem('dona_admin_members_db');
        const adminMembers = storedAdmin ? JSON.parse(storedAdmin) : [];
        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        const profEmail = (profile.email || '').toLowerCase().trim();

        const nextAdminMembers = adminMembers.map(m => {
          if ((m.email || '').toLowerCase().trim() === profEmail) {
            return {
              ...m,
              name: fullName || m.name,
              phone: profile.phone || m.phone,
              avatar: profile.avatar || m.avatar
            };
          }
          return m;
        });

        localStorage.setItem('dona_admin_members_db', JSON.stringify(nextAdminMembers));
      } catch (err) {}

      setCurrentPassword("");
      setPassword("");
      setSaveStatus({
        type: 'success',
        message: data.message || 'Vos modifications et mot de passe ont été enregistrés et hachés en base serveur !'
      });

      setTimeout(() => {
        setSaveStatus(null);
      }, 5000);

    } catch (err) {
      console.error("Error updating profile:", err);
      setSaveStatus({ type: 'error', message: 'Erreur réseau lors de l\'enregistrement.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="vip-container">
      
      <style>{`
        .vip-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px;
          background: var(--color-bg);
        }
        .vip-sidebar {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          height: fit-content;
          box-shadow: 0 20px 40px rgba(0,0,0,0.01);
        }
        .vip-sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 2px;
          margin-bottom: 8px;
        }
        .vip-sidebar-item:hover {
          background: var(--color-bg-alt);
          color: var(--color-text);
        }
        .vip-sidebar-item.active {
          background: var(--color-bg-alt);
          color: var(--color-accent);
          font-weight: 700;
        }
        .vip-content {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 48px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.01);
        }
        .vip-title {
          font-family: var(--font-secondary);
          font-size: 32px;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 40px;
          letter-spacing: -0.02em;
        }
        .vip-label {
          font-family: var(--font-primary);
          font-size: 11px;
          font-weight: 600;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }
        .vip-input {
          width: 100%;
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 12px 16px;
          font-family: var(--font-primary);
          font-size: 15px;
          color: var(--color-text);
          outline: none;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }
        .vip-input:focus {
          border-color: var(--color-accent);
        }
        .btn-crimson {
          background: var(--color-accent);
          color: #FFFFFF;
          border: none;
          padding: 16px 32px;
          border-radius: 2px;
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .btn-crimson:hover {
          background: #8B002A;
        }
        .logout-link {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--color-text-muted);
          font-size: 13px;
          text-decoration: none;
          font-weight: 600;
          padding: 15px 0;
          transition: color 0.3s ease;
        }
        .logout-link:hover {
          color: var(--color-accent);
        }
        .profile-layout {
          display: flex;
          gap: 60px;
        }
        .profile-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .avatar-box {
          width: 160px;
          height: 160px;
          border-radius: 2px;
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          overflow: hidden;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          cursor: pointer;
          position: relative;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }
        .avatar-box:hover {
          border-color: var(--color-accent);
        }
        .avatar-box:hover .avatar-overlay {
          opacity: 1;
        }
        .avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .status-alert {
          padding: 12px 16px;
          border-radius: 2px;
          font-size: 14px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-alert.success {
          background: #E6F4EA;
          color: #137333;
          border: 1px solid #CEEAD6;
        }
        .status-alert.error {
          background: #FCE8E6;
          color: #C5221F;
          border: 1px solid #FAD2CF;
        }

        @media (max-width: 900px) {
          .vip-container {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 40px 16px;
          }
          .vip-content {
            padding: 32px 20px !important;
          }
          .vip-title {
            font-size: 26px !important;
            margin-bottom: 24px !important;
          }
        }
        @media (max-width: 768px) {
          .profile-layout {
            flex-direction: column;
            gap: 40px;
            align-items: center;
          }
          .profile-layout .profile-avatar-sec {
            width: 100% !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .profile-layout .profile-avatar-sec > div {
            margin: 0 auto 20px auto !important;
          }
          .profile-layout .profile-form-sec {
            width: 100% !important;
          }
          .profile-layout .vip-input {
            text-align: left;
          }
          .profile-layout .vip-label {
            text-align: left;
          }
          .profile-grid-2 {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Sidebar navigation */}
      <aside className="vip-sidebar">
        <div style={{ flex: "1" }}>
          <div style={{ padding: "0 20px 20px 20px", fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Portail des membres</div>
          
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`vip-sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
          >
            <span className="material-symbols-outlined">person</span>
            MON PROFIL
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`vip-sidebar-item ${activeTab === 'bookmarks' ? 'active' : ''}`}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="material-symbols-outlined">bookmark</span>
              <span>ARTICLES SAUVEGARDÉS</span>
            </div>
            {savedArticles.length > 0 && (
              <span style={{ background: "var(--color-accent)", color: "#FFFFFF", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px" }}>
                {savedArticles.length}
              </span>
            )}
          </button>

          <Link href="/subscription-management" className="vip-sidebar-item">
            <span className="material-symbols-outlined">star</span>
            MON ABONNEMENT
          </Link>
          <Link href="/espace-lecture" className="vip-sidebar-item">
            <span className="material-symbols-outlined">menu_book</span>
            ESPACE LECTURE
          </Link>
        </div>
        <div style={{ padding: "0 20px", marginTop: "auto" }}>
          <Link href="/login" className="logout-link">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span> 
            SE DÉCONNECTER
          </Link>
        </div>
      </aside>
  
      {/* Main Content Area */}
      <div className="vip-content">
        {activeTab === 'profile' ? (
          <>
            <h1 className="vip-title">Mon Profil</h1>
            
            {saveStatus && (
              <div className={`status-alert ${saveStatus.type}`}>
                <span className="material-symbols-outlined">
                  {saveStatus.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{saveStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="profile-layout">
              {/* Left: Avatar */}
              <div className="profile-avatar-sec" style={{ width: "200px" }}>
                <div className="avatar-box" onClick={handlePhotoClick}>
                  {profile.avatar ? (
                    <>
                      <img
                        src={profile.avatar}
                        alt="Avatar"
                        width="160"
                        height="160"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div className="avatar-overlay">
                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>photo_camera</span>
                        <span style={{ fontSize: "10px", marginTop: "4px" }}>Modifier</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "var(--color-text-muted)", marginBottom: "10px" }}>photo_camera</span>
                      <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontWeight: "500" }}>Changer la photo</span>
                    </>
                  )}
                </div>
                <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 5px 0" }}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p style={{ color: "var(--color-text-muted)", fontSize: "14px", margin: "0 0 20px 0" }}>
                  {profile.email}
                </p>
                {(() => {
                  const currentPlan = (profile.plan || 'Essentiel').toUpperCase();
                  const isElite = currentPlan.includes('ÉLITE') || currentPlan.includes('ELITE');
                  const isPremium = currentPlan.includes('PREMIUM');
                  const badgeBg = isElite ? "#B08D57" : isPremium ? "var(--color-accent)" : "#555555";
                  const badgeIcon = isElite ? "crown" : isPremium ? "stars" : "person";
                  return (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: badgeBg, color: "#FFFFFF", padding: "6px 12px", borderRadius: "2px", fontSize: "10px", fontWeight: "700", letterSpacing: "0.05em" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{badgeIcon}</span>
                      MEMBRE {currentPlan}
                    </div>
                  );
                })()}
              </div>
              
              {/* Right: Forms */}
              <div className="profile-form-sec" style={{ flex: "1", maxWidth: "600px" }}>
                <div style={{ padding: "0", marginBottom: "30px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 30px 0", color: "var(--color-text)" }}>Informations Personnelles</h3>
                  
                  <div className="profile-grid-2">
                    <div>
                      <label className="vip-label">PRÉNOM</label>
                      <input
                        type="text"
                        className="vip-input"
                        value={profile.firstName}
                        onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="vip-label">NOM</label>
                      <input
                        type="text"
                        className="vip-input"
                        value={profile.lastName}
                        onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginTop: "20px" }}>
                    <label className="vip-label">EMAIL</label>
                    <input
                      type="email"
                      className="vip-input"
                      value={profile.email}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div style={{ marginTop: "20px" }}>
                    <label className="vip-label">TÉLÉPHONE</label>
                    <input
                      type="tel"
                      className="vip-input"
                      value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div style={{ padding: "0", marginBottom: "40px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "var(--color-text)" }}>Sécurité & Mot de Passe</h3>
                  
                  <div style={{ marginTop: "16px" }}>
                    <label className="vip-label">MOT DE PASSE ACTUEL</label>
                    <input
                      type="password"
                      className="vip-input"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <label className="vip-label">NOUVEAU MOT DE PASSE</label>
                    <input
                      type="password"
                      className="vip-input"
                      placeholder="8+ caractères, 1 majuscule, 1 chiffre"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    {password && (
                      <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                        Exigences : 8+ caractères, 1 majuscule, 1 chiffre
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <button type="submit" className="btn-crimson" disabled={loading}>
                    {loading ? "ENREGISTREMENT..." : "ENREGISTRER LES MODIFICATIONS"}
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          /* Bookmarks Panel */
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 className="vip-title" style={{ margin: "0 0 8px 0" }}>Articles Sauvegardés</h1>
                <p style={{ color: "var(--color-text-muted)", fontSize: "14px", margin: 0 }}>
                  Retrouvez vos signets et lectures sélectionnées dans le Cercle DONA.
                </p>
              </div>

              {savedArticles.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllBookmarks}
                  style={{
                    background: "none",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-muted)",
                    padding: "8px 16px",
                    borderRadius: "2px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete_sweep</span>
                  Tout effacer
                </button>
              )}
            </div>

            {/* Filter Search Row */}
            {savedArticles.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "8px 14px", maxWidth: "380px", width: "100%" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--color-text-muted)", marginRight: "8px" }}>search</span>
                  <input
                    type="text"
                    placeholder="Filtrer vos signets..."
                    value={filterTerm}
                    onChange={e => setFilterTerm(e.target.value)}
                    style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "13px", color: "var(--color-text)" }}
                  />
                  {filterTerm && (
                    <button
                      type="button"
                      onClick={() => setFilterTerm('')}
                      style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", padding: 0 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                    </button>
                  )}
                </div>

                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", fontWeight: "500" }}>
                  {savedArticles.filter(item => !filterTerm || item.title.toLowerCase().includes(filterTerm.toLowerCase()) || (item.meta && item.meta.toLowerCase().includes(filterTerm.toLowerCase()))).length} article(s) sur {savedArticles.length}
                </div>
              </div>
            )}

            {/* Bookmarks List */}
            {loadingBookmarks ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-text-muted)" }}>
                Chargement de vos signets...
              </div>
            ) : savedArticles.length === 0 ? (
              /* Empty State */
              <div style={{
                textAlign: "center",
                padding: "60px 24px",
                background: "var(--color-bg-alt)",
                border: "1px dashed var(--color-border)",
                borderRadius: "4px",
                marginTop: "16px"
              }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(163, 6, 38, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto"
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "var(--color-accent)" }}>bookmark_border</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 8px 0" }}>
                  Aucun article sauvegardé pour le moment
                </h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "14px", maxWidth: "460px", margin: "0 auto 28px auto", lineHeight: "1.6" }}>
                  En parcourant DONA Magazine, cliquez sur l&apos;icône « Sauver » sur les articles pour composer votre bibliothèque personnelle de lecture.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/magazines" className="btn-crimson" style={{ textDecoration: "none", fontSize: "12px", padding: "12px 24px" }}>
                    Explorer les Cahiers
                  </Link>
                  <Link href="/espace-lecture" style={{
                    textDecoration: "none",
                    background: "transparent",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                    padding: "12px 24px",
                    borderRadius: "2px",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase"
                  }}>
                    Espace Lecture
                  </Link>
                </div>
              </div>
            ) : (
              /* Cards Grid */
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {savedArticles
                  .filter(item => !filterTerm || item.title.toLowerCase().includes(filterTerm.toLowerCase()) || (item.meta && item.meta.toLowerCase().includes(filterTerm.toLowerCase())))
                  .map(article => (
                    <article key={article.id} style={{
                      background: "var(--color-bg-alt)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "2px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}>
                      {/* Image Thumbnail */}
                      <div style={{ position: "relative", width: "100%", height: "160px", background: "#1a1a1a", overflow: "hidden" }}>
                        <img
                          src={article.image || "/assets/core/img/home_alaune_side2_1782125722981.png"}
                          alt={article.title}
                          width="280"
                          height="160"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          background: "var(--color-accent)",
                          color: "#FFFFFF",
                          fontSize: "9px",
                          fontWeight: "800",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: "2px"
                        }}>
                          {article.type || "ARTICLE"}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: "1" }}>
                        <div style={{ fontSize: "11px", color: "var(--color-accent)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                          {article.meta || "DONA Magazine"}
                        </div>

                        <h3 style={{
                          fontFamily: "var(--font-secondary)",
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "var(--color-text)",
                          margin: "0 0 16px 0",
                          lineHeight: "1.3",
                          flex: "1"
                        }}>
                          <Link href={article.ctaHref || "/espace-lecture"} style={{ color: "inherit", textDecoration: "none" }}>
                            {article.title}
                          </Link>
                        </h3>

                        {/* Card Actions */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
                          <Link
                            href={article.ctaHref || "/espace-lecture"}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "var(--color-accent)",
                              fontSize: "11px",
                              fontWeight: "700",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              textDecoration: "none"
                            }}
                          >
                            <span>Lire l&apos;article</span>
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleRemoveBookmark(article.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--color-text-muted)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "11px",
                              padding: "4px 8px",
                              borderRadius: "2px",
                              transition: "color 0.2s ease"
                            }}
                            title="Retirer des signets"
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>bookmark_remove</span>
                            <span>Retirer</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

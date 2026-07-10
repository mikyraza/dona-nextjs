"use client";

import React from 'react';
import Link from 'next/link';

export default function Page() {
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
          border-left: 3px solid var(--color-accent);
          padding-left: 17px;
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

      {/* Sidebar navigation */}
      <aside className="vip-sidebar">
          <div style={{flex: "1"}}>
              <div style={{padding: "0 20px 20px 20px", fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", letterSpacing: "1px", textTransform: "uppercase"}}>Portail des membres</div>
              
              <Link href="/member-profile" className="vip-sidebar-item active">
                  <span className="material-symbols-outlined">person</span>
                  MON PROFIL
              </Link>
              <Link href="/subscription-management" className="vip-sidebar-item">
                  <span className="material-symbols-outlined">star</span>
                  MON ABONNEMENT
              </Link>
              <Link href="/espace-lecture" className="vip-sidebar-item">
                  <span className="material-symbols-outlined">bookmark</span>
                  ESPACE LECTURE
              </Link>
          </div>
          <div style={{padding: "0 20px", marginTop: "auto"}}>
              <Link href="#" className="logout-link">
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>logout</span> 
                  SE DÉCONNECTER
              </Link>
          </div>
      </aside>
  
      {/* Main Form Area */}
      <div className="vip-content">
          <h1 className="vip-title">Mon Profil</h1>
          
          <div className="profile-layout">
              {/* Left: Avatar */}
              <div className="profile-avatar-sec" style={{width: "200px"}}>
                  <div style={{width: "160px", height: "160px", borderRadius: "2px", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", overflow: "hidden", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", cursor: "pointer"}}>
                      <span className="material-symbols-outlined" style={{fontSize: "32px", color: "var(--color-text-muted)", marginBottom: "10px"}}>photo_camera</span>
                      <span style={{fontSize: "12px", color: "var(--color-text-muted)", fontWeight: "500"}}>Changer la photo</span>
                  </div>
                  <h2 style={{fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "700", color: "var(--color-text)", margin: "0 0 5px 0"}}>Ernest</h2>
                  <p style={{color: "var(--color-text-muted)", fontSize: "14px", margin: "0 0 20px 0"}}>ernest@example.com</p>
                  <div style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--color-accent)", color: "#FFFFFF", padding: "6px 12px", borderRadius: "2px", fontSize: "10px", fontWeight: "600", letterSpacing: "0.05em"}}>
                      <span className="material-symbols-outlined" style={{fontSize: "14px"}}>stars</span>
                      MEMBRE PREMIUM
                  </div>
              </div>
              
              {/* Right: Forms */}
              <div className="profile-form-sec" style={{flex: "1", maxWidth: "600px"}}>
                  <div style={{padding: "0", marginBottom: "30px"}}>
                      <h3 style={{fontSize: "16px", fontWeight: "600", margin: "0 0 30px 0", color: "var(--color-text)"}}>Informations Personnelles</h3>
                      
                      <div className="profile-grid-2">
                          <div>
                              <label className="vip-label">PRÉNOM</label>
                              <input type="text" className="vip-input" defaultValue="Ernest" />
                          </div>
                          <div>
                              <label className="vip-label">NOM</label>
                              <input type="text" className="vip-input" defaultValue="Dupont" />
                          </div>
                      </div>
                      
                      <div style={{marginTop: "20px"}}>
                          <label className="vip-label">EMAIL</label>
                          <input type="email" className="vip-input" defaultValue="ernest@example.com" />
                      </div>
                      
                      <div style={{marginTop: "20px"}}>
                          <label className="vip-label">TÉLÉPHONE</label>
                          <input type="tel" className="vip-input" defaultValue="+33 6 12 34 56 78" />
                      </div>
                  </div>
                  
                  <div style={{padding: "0", marginBottom: "40px"}}>
                      <h3 style={{fontSize: "16px", fontWeight: "600", margin: "0 0 30px 0", color: "var(--color-text)"}}>Mot de Passe</h3>
                      
                      <div style={{marginTop: "20px"}}>
                          <label className="vip-label">NOUVEAU MOT DE PASSE</label>
                          <input type="password" className="vip-input" placeholder="••••••••" />
                      </div>
                  </div>
                  
                  <div>
                      <button className="btn-crimson">ENREGISTRER LES MODIFICATIONS</button>
                  </div>
              </div>
          </div>
      </div>
    </main>
  );
}

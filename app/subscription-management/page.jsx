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
        .btn-outline-crimson {
          background: transparent;
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
          padding: 12px 24px;
          border-radius: 2px;
          font-family: var(--font-primary);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-outline-crimson:hover {
          background: var(--color-bg-alt);
          color: #8B002A;
          border-color: #8B002A;
        }
        .advanced-settings-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          text-decoration: none;
          color: var(--color-text);
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .advanced-settings-link:hover {
          color: var(--color-accent);
        }
        .facturation-link {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.3s ease;
        }
        .facturation-link:hover {
          color: #8B002A;
        }
        .sub-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 60px;
        }
        .table-scroll-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 2px;
        }
        .table-min-width {
          min-width: 600px;
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
          .sub-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>

      {/* Sidebar navigation */}
      <aside className="vip-sidebar">
          <div style={{flex: "1"}}>
              <div style={{padding: "0 20px 20px 20px", fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", letterSpacing: "1px", textTransform: "uppercase"}}>Portail des membres</div>
              
              <Link href="/member-profile" className="vip-sidebar-item">
                  <span className="material-symbols-outlined">person</span>
                  MON PROFIL
              </Link>
              <Link href="/subscription-management" className="vip-sidebar-item active">
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
  
      {/* Main Content Area */}
      <div className="vip-content">
          <h1 className="vip-title">Mon Abonnement & Facturation</h1>
          
          <div className="sub-layout">
              {/* Left Column */}
              <div>
                  {/* Premium Card */}
                  <div style={{background: "var(--color-text)", color: "var(--color-bg)", padding: "40px", borderRadius: "2px", marginBottom: "50px"}}>
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px"}}>
                          <div style={{background: "rgba(255,255,255,0.15)", color: "#FFFFFF", fontSize: "10px", fontWeight: "700", padding: "6px 12px", borderRadius: "2px", letterSpacing: "1px"}}>PREMIUM</div>
                          <div style={{fontSize: "32px", fontWeight: "600", color: "#FFFFFF"}}>29€<span style={{fontSize: "14px", fontWeight: "400", color: "var(--color-border)"}}>/mois</span></div>
                      </div>
                      <h3 style={{fontFamily: "var(--font-secondary)", fontSize: "26px", fontWeight: "400", margin: "0 0 30px 0", color: "#FFFFFF"}}>DONA Premium</h3>
                      
                      <div style={{display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px"}}>
                          <div style={{display: "flex", alignItems: "center", gap: "10px", color: "var(--color-border)", fontSize: "14px"}}>
                              <span className="material-symbols-outlined" style={{fontSize: "18px", color: "var(--color-accent)"}}>check_circle</span>
                              Accès illimité à tous les articles premium
                          </div>
                          <div style={{display: "flex", alignItems: "center", gap: "10px", color: "var(--color-border)", fontSize: "14px"}}>
                              <span className="material-symbols-outlined" style={{fontSize: "18px", color: "var(--color-accent)"}}>check_circle</span>
                              Accès aux Masterclasses exclusives
                          </div>
                          <div style={{display: "flex", alignItems: "center", gap: "10px", color: "var(--color-border)", fontSize: "14px"}}>
                              <span className="material-symbols-outlined" style={{fontSize: "18px", color: "var(--color-accent)"}}>check_circle</span>
                              Workbooks téléchargeables
                          </div>
                      </div>
                      
                      <button className="btn-crimson" style={{width: "100%"}}>GÉRER MON ABONNEMENT</button>
                  </div>
                  
                  {/* Billing History */}
                  <h3 style={{fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "var(--color-text)"}}>Historique de Facturation</h3>
                  <div className="table-scroll-container" style={{border: "1px solid var(--color-border)"}}>
                      <table className="table-min-width" style={{width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: "14px"}}>
                          <thead>
                              <tr style={{background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)"}}>
                                  <th style={{padding: "15px 20px", fontWeight: "600", color: "var(--color-text-muted)", fontSize: "11px", textTransform: "uppercase"}}>Date</th>
                                  <th style={{padding: "15px 20px", fontWeight: "600", color: "var(--color-text-muted)", fontSize: "11px", textTransform: "uppercase"}}>Montant</th>
                                  <th style={{padding: "15px 20px", fontWeight: "600", color: "var(--color-text-muted)", fontSize: "11px", textTransform: "uppercase"}}>Statut</th>
                                  <th style={{padding: "15px 20px", fontWeight: "600", color: "var(--color-text-muted)", fontSize: "11px", textTransform: "uppercase"}}>Facture</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr style={{borderBottom: "1px solid var(--color-border)"}}>
                                  <td style={{padding: "15px 20px", color: "var(--color-text)"}}>15 Mai 2026</td>
                                  <td style={{padding: "15px 20px", color: "var(--color-text)"}}>29.00€</td>
                                  <td style={{padding: "15px 20px"}}><span style={{background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "4px 8px", borderRadius: "2px", fontSize: "11px", fontWeight: "600"}}>Payé</span></td>
                                  <td style={{padding: "15px 20px"}}><Link href="#" className="facturation-link"><span className="material-symbols-outlined" style={{fontSize: "16px"}}>download</span> PDF</Link></td>
                              </tr>
                              <tr style={{borderBottom: "none"}}>
                                  <td style={{padding: "15px 20px", color: "var(--color-text)"}}>15 Avr 2026</td>
                                  <td style={{padding: "15px 20px", color: "var(--color-text)"}}>29.00€</td>
                                  <td style={{padding: "15px 20px"}}><span style={{background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "4px 8px", borderRadius: "2px", fontSize: "11px", fontWeight: "600"}}>Payé</span></td>
                                  <td style={{padding: "15px 20px"}}><Link href="#" className="facturation-link"><span className="material-symbols-outlined" style={{fontSize: "16px"}}>download</span> PDF</Link></td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
              
              {/* Right Column */}
              <div>
                  <h3 style={{fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "var(--color-text)"}}>Moyen de Paiement</h3>
                  <div style={{background: "var(--color-bg-alt)", padding: "25px", borderRadius: "2px", border: "1px solid var(--color-border)", marginBottom: "40px"}}>
                      <div style={{display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px"}}>
                          <div style={{width: "50px", height: "32px", background: "var(--color-text)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-bg)", fontWeight: "700", fontSize: "12px", fontStyle: "italic"}}>VISA</div>
                          <div>
                              <div style={{fontSize: "14px", fontWeight: "600", color: "var(--color-text)"}}>•••• •••• •••• 4242</div>
                              <div style={{fontSize: "12px", color: "var(--color-text-muted)"}}>Expire 12/28</div>
                          </div>
                      </div>
                      <button className="btn-outline-crimson" style={{width: "100%"}}>METTRE À JOUR</button>
                  </div>
                  
                  <h3 style={{fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "var(--color-text)"}}>Paramètres Avancés</h3>
                  <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "20px"}}>
                      <Link href="#" className="advanced-settings-link" style={{borderBottom: "1px solid var(--color-border)"}}>
                          Gérer les notifications
                          <span className="material-symbols-outlined" style={{color: "var(--color-text-muted)"}}>arrow_forward</span>
                      </Link>
                      <Link href="#" className="advanced-settings-link" style={{color: "var(--color-accent)", paddingBottom: "0"}}>
                          Résilier mon abonnement
                          <span className="material-symbols-outlined" style={{color: "var(--color-accent)"}}>cancel</span>
                      </Link>
                  </div>
              </div>
          </div>
      </div>
    </main>
  );
}

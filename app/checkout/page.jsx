"use client";

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="checkout-layout" style={{background: "var(--color-bg)", maxWidth: "1200px", margin: "0 auto"}}>
      
      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 40px;
          padding: 80px 20px;
        }
        .checkout-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .checkout-input-group {
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 12px 16px;
          transition: border-color 0.3s ease;
        }
        .checkout-input-group:focus-within {
          border-color: var(--color-accent);
        }
        .checkout-input {
          background: transparent;
          border: none;
          font-family: var(--font-primary);
          font-size: 15px;
          color: var(--color-text);
          outline: none;
          width: 100%;
          margin-top: 4px;
        }
        .checkout-label {
          font-family: var(--font-primary);
          font-size: 10px;
          font-weight: 600;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .checkout-link {
          color: var(--color-text-muted);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.3s ease;
        }
        .checkout-link:hover {
          color: var(--color-accent);
        }
        .checkout-tab {
          padding-bottom: 16px;
          color: var(--color-text-muted);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }
        .checkout-tab.active {
          border-bottom-color: var(--color-accent);
          color: var(--color-accent);
        }
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr;
            padding: 40px 16px;
            gap: 24px;
          }
          .checkout-layout section {
            padding: 32px 20px !important;
          }
          .checkout-layout h1 {
            font-size: 28px !important;
          }
        }
        @media (max-width: 500px) {
          .checkout-grid-2 {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>

      {/* LEFT SIDEBAR: Selection */}
      <aside style={{background: "var(--color-bg)", padding: "32px", borderRadius: "2px", height: "fit-content", border: "1px solid var(--color-border)", boxShadow: "0 20px 40px rgba(0,0,0,0.02)"}}>
          <h2 style={{fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "600", marginBottom: "24px", color: "var(--color-text)"}}>Votre Sélection</h2>
          
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px"}}>
              <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                  <div style={{width: "60px", height: "60px", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <span className="material-symbols-outlined" style={{fontSize: "24px", color: "var(--color-accent)"}}>workspace_premium</span>
                  </div>
                  <div>
                      <div style={{fontSize: "14px", fontWeight: "600", color: "var(--color-text)", marginBottom: "4px"}}>Adhésion Alliance</div>
                      <div style={{fontSize: "10px", color: "var(--color-text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em"}}>ANNUEL</div>
                  </div>
              </div>
              <div style={{fontWeight: "600", fontSize: "16px", color: "var(--color-text)"}}>480€</div>
          </div>

          <div style={{display: "flex", gap: "8px", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid var(--color-border)"}}>
              <input type="text" placeholder="Code promotionnel" style={{flexGrow: "1", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", padding: "12px 16px", borderRadius: "2px", fontSize: "13px", color: "var(--color-text)", outline: "none"}} />
              <button type="button" style={{background: "var(--color-text)", color: "var(--color-bg)", border: "none", padding: "0 16px", borderRadius: "2px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer"}}>Appliquer</button>
          </div>

          <div style={{display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px"}}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span style={{color: "var(--color-text-muted)"}}>Sous-total</span>
                  <span style={{fontWeight: "500", color: "var(--color-text)"}}>480.00€</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span style={{color: "var(--color-text-muted)"}}>TVA (20%)</span>
                  <span style={{fontWeight: "500", color: "var(--color-text)"}}>Inclus</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px"}}>
                  <span style={{fontFamily: "var(--font-secondary)", fontSize: "20px", color: "var(--color-text)"}}>Total</span>
                  <span style={{fontSize: "24px", fontWeight: "700", color: "var(--color-accent)"}}>480.00€</span>
              </div>
          </div>
      </aside>

      {/* RIGHT MAIN AREA: Checkout */}
      <section style={{background: "var(--color-bg)", padding: "48px", borderRadius: "2px", border: "1px solid var(--color-border)", boxShadow: "0 20px 40px rgba(0,0,0,0.02)"}}>
          <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "36px", fontWeight: "700", color: "var(--color-text)", marginBottom: "16px", letterSpacing: "-0.02em"}}>Finaliser l'inscription</h1>
          <p style={{color: "var(--color-text-muted)", fontSize: "15px", marginBottom: "48px"}}>
              Entrez vos informations de paiement pour rejoindre l'Alliance.
          </p>

          {/* Payment Methods Tabs */}
          <div style={{display: "flex", gap: "32px", borderBottom: "1px solid var(--color-border)", marginBottom: "40px"}}>
              <div className="checkout-tab active">
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>credit_card</span> CARTE BANCAIRE
              </div>
              <div className="checkout-tab">
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>payments</span> PAYPAL
              </div>
              <div className="checkout-tab">
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>account_balance</span> VIREMENT
              </div>
          </div>

          {/* Card Info */}
          <h3 style={{fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "600", color: "var(--color-text)", marginBottom: "24px"}}>Informations de la carte</h3>
          
          <div style={{display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px"}}>
              
              <div className="checkout-input-group">
                  <div className="checkout-label">Numéro de carte</div>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <input type="text" placeholder="•••• •••• •••• ••••" className="checkout-input" required />
                      <div style={{fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", display: "flex", gap: "8px"}}>
                          <span>VISA</span><span>MC</span>
                      </div>
                  </div>
              </div>

              <div className="checkout-input-group">
                  <div className="checkout-label">Titulaire de la carte</div>
                  <input type="text" placeholder="Jane Doe" className="checkout-input" required />
              </div>

              <div className="checkout-grid-2">
                  <div className="checkout-input-group">
                      <div className="checkout-label">Date d'expiration</div>
                      <input type="text" placeholder="MM/AA" className="checkout-input" required />
                  </div>
                  <div className="checkout-input-group">
                      <div className="checkout-label">CVC / CVV</div>
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                          <input type="text" placeholder="•••" className="checkout-input" required />
                          <span className="material-symbols-outlined" style={{fontSize: "18px", color: "var(--color-text-muted)", cursor: "pointer"}}>info</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Billing Address */}
          <h3 style={{fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "600", color: "var(--color-text)", marginBottom: "24px"}}>Adresse de facturation</h3>
          
          <label style={{display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "24px", cursor: "pointer"}}>
              <input type="checkbox" style={{width: "16px", height: "16px", accentColor: "var(--color-accent)", border: "1px solid var(--color-border)"}} /> Identique à l'adresse du profil
          </label>

          <div style={{display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px"}}>
              <div className="checkout-input-group">
                  <div className="checkout-label">Adresse</div>
                  <input type="text" placeholder="Adresse complète" className="checkout-input" required />
              </div>

              <div className="checkout-grid-2">
                  <div className="checkout-input-group">
                      <div className="checkout-label">Ville</div>
                      <input type="text" placeholder="Paris" className="checkout-input" required />
                  </div>
                  <div className="checkout-input-group">
                      <div className="checkout-label">Code postal</div>
                      <input type="text" placeholder="75001" className="checkout-input" required />
                  </div>
              </div>

              <div className="checkout-input-group" style={{position: "relative"}}>
                  <div className="checkout-label">Pays</div>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <select style={{background: "transparent", border: "none", fontSize: "15px", color: "var(--color-text)", outline: "none", width: "100%", WebkitAppearance: "none", cursor: "pointer", marginTop: "4px"}}>
                          <option style={{background: "var(--color-bg)"}}>France</option>
                          <option style={{background: "var(--color-bg)"}}>Belgique</option>
                          <option style={{background: "var(--color-bg)"}}>Suisse</option>
                      </select>
                      <span className="material-symbols-outlined" style={{fontSize: "20px", color: "var(--color-text-muted)", pointerEvents: "none", marginLeft: "-20px"}}>expand_more</span>
                  </div>
              </div>
          </div>

          {/* Submit Section */}
          <div style={{textAlign: "center", marginBottom: "24px"}}>
              <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "16px"}}>
                  <span className="material-symbols-outlined" style={{fontSize: "14px"}}>lock</span>
                  Paiement chiffré SSL 256-bit
              </div>
              
              <button type="submit" style={{width: "100%", background: "var(--color-accent)", color: "#FFFFFF", border: "none", padding: "18px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s"}}>
                  Confirmer le paiement
              </button>
          </div>

          <p style={{textAlign: "center", fontSize: "11px", color: "var(--color-text-muted)", lineHeight: "1.5"}}>
              En confirmant votre paiement, vous acceptez nos <Link href="#" className="checkout-link">Conditions Générales de Vente</Link> et notre <Link href="#" className="checkout-link">Politique de Confidentialité</Link>.
          </p>

      </section>
    </main>
  );
}

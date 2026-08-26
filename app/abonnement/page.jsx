"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [billingPeriod, setBillingPeriod] = useState('annual'); // 'monthly' or 'annual'
  const [openFaq, setOpenFaq] = useState(null);

  const toggleBilling = () => {
    setBillingPeriod(prev => prev === 'monthly' ? 'annual' : 'monthly');
  };

  const toggleFaq = (index) => {
    setOpenFaq(prev => prev === index ? null : index);
  };

  const faqs = [
    {
      q: "Puis-je changer de forfait en cours de route ?",
      a: "Oui, vous pouvez upgrader ou modifier votre abonnement à tout moment depuis votre espace membre. La différence sera calculée au prorata temporis."
    },
    {
      q: "Comment fonctionne l'engagement annuel ?",
      a: "L'abonnement annuel est facturé en un paiement unique et vous fait bénéficier d'une remise immédiate de 20% par rapport au tarif mensuel."
    },
    {
      q: "Quels sont les modes de paiement acceptés ?",
      a: "Nous acceptons toutes les principales cartes bancaires (Visa, Mastercard, American Express) ainsi que le paiement sécurisé par Apple Pay et Google Pay."
    },
    {
      q: "Les événements physiques sont-ils inclus ?",
      a: "Les événements physiques et masterclasses privées sont inclus en accès prioritaire pour les membres de l'offre Élite, et accessibles avec un tarif préférentiel pour les membres Premium."
    },
    {
      q: "Comment puis-je annuler mon abonnement ?",
      a: "Vous pouvez résilier votre abonnement en un clic depuis votre espace membre. L'accès reste actif jusqu'à la fin de la période de facturation en cours."
    }
  ];

  return (
    <main className="abonnement-main" style={{background: "var(--color-bg)", minHeight: "100vh", padding: "80px 20px"}}>
      
      <style>{`
        .pricing-btn-outline {
          display: block;
          text-align: center;
          padding: 14px;
          border: 1px solid var(--color-border);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          color: var(--color-text);
          background: transparent;
          transition: all 0.3s ease;
          border-radius: 2px;
        }
        .pricing-btn-outline:hover {
          background: var(--color-bg-alt);
          border-color: var(--color-text);
        }
        .pricing-btn-accent {
          display: block;
          text-align: center;
          padding: 14px;
          background: var(--color-accent);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          color: #FFFFFF;
          transition: background 0.3s ease;
          border-radius: 2px;
        }
        .pricing-btn-accent:hover {
          background: #8B002A;
        }
        .pricing-btn-dark {
          display: block;
          text-align: center;
          padding: 14px;
          background: var(--color-text);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          color: var(--color-bg);
          transition: opacity 0.3s ease;
          border-radius: 2px;
        }
        .pricing-btn-dark:hover {
          opacity: 0.9;
        }
        .faq-item {
          border: 1px solid var(--color-border);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
          cursor: pointer;
          background: var(--color-bg);
          transition: all 0.3s ease;
          border-radius: 2px;
        }
        .faq-item:hover {
          background: var(--color-bg-alt);
          border-color: var(--color-text-muted);
        }
        .pricing-matrix {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
        }
        .premium-card {
          transform: translateY(-16px);
        }
        .table-scroll-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 2px;
        }
        .table-min-width {
          min-width: 700px;
        }
        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        @media (max-width: 992px) {
          .pricing-matrix {
            grid-template-columns: 1fr;
            gap: 40px;
            max-width: 500px !important;
            margin: 0 auto 60px auto !important;
          }
          .premium-card {
            transform: none !important;
          }
        }
        @media (max-width: 600px) {
          .abonnement-main {
            padding: 40px 16px !important;
          }
          .abonnement-main h1 {
            font-size: 28px !important;
          }
          .trust-badges {
            gap: 16px 24px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section style={{maxWidth: "800px", margin: "0 auto", textAlign: "center", marginBottom: "60px"}}>
        <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "42px", fontWeight: "700", marginBottom: "24px", color: "var(--color-text)", letterSpacing: "-0.02em"}}>Choisissez votre niveau d'excellence</h1>
        <p style={{fontFamily: "var(--font-primary)", fontSize: "16px", color: "var(--color-text-muted)", lineHeight: "1.6"}}>
            Accédez aux outils, au réseau et aux contenus qui alignent ambition et épanouissement.
        </p>
        
        {/* Toggle Switcher */}
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "40px", fontFamily: "var(--font-primary)", fontSize: "14px"}}>
            <span style={{color: billingPeriod === 'monthly' ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: billingPeriod === 'monthly' ? '600' : '400'}}>Mensuel</span>
            
            <div onClick={toggleBilling} style={{width: "48px", height: "24px", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "12px", position: "relative", cursor: "pointer"}}>
                <div style={{width: "16px", height: "16px", background: "var(--color-accent)", borderRadius: "50%", position: "absolute", top: "3px", left: billingPeriod === 'monthly' ? "4px" : "26px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}}></div>
            </div>
            
            <span style={{color: billingPeriod === 'annual' ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: billingPeriod === 'annual' ? '600' : '400'}}>Annuel</span>
            <span style={{color: "var(--color-accent)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(163, 6, 38, 0.08)", padding: "4px 8px", borderRadius: "2px"}}>ÉCONOMISEZ 20%</span>
        </div>
      </section>

      {/* 3-Plan Matrix */}
      <section className="pricing-matrix" style={{maxWidth: "1100px", margin: "0 auto", marginBottom: "80px"}}>
        
        {/* Plan 1: Essentiel */}
        <div style={{background: "var(--color-bg)", padding: "40px 32px", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", borderRadius: "2px"}}>
            <h3 style={{fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "600", marginBottom: "12px", color: "var(--color-text)"}}>Essentiel</h3>
            <div style={{fontFamily: "var(--font-secondary)", fontSize: "48px", fontWeight: "700", marginBottom: "16px", color: "var(--color-text)"}}>0€</div>
            <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.5", marginBottom: "32px", minHeight: "42px"}}>Formule de découverte pour accéder aux médias en direct.</p>
            
            <ul style={{listStyle: "none", padding: "0", margin: "0 0 40px 0", fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text)", display: "flex", flexDirection: "column", gap: "16px", flexGrow: "1"}}>
                <li style={{display: "flex", gap: "12px", alignItems: "center"}}><span className="material-symbols-outlined" style={{fontSize: "18px", color: "var(--color-text-muted)"}}>check_circle</span> Accès aux extraits, aperçus et magazines publics</li>
                <li style={{display: "flex", gap: "12px", alignItems: "center"}}><span className="material-symbols-outlined" style={{fontSize: "18px", color: "var(--color-text-muted)"}}>check_circle</span> Accès à la télé en direct</li>
                <li style={{display: "flex", gap: "12px", alignItems: "center"}}><span className="material-symbols-outlined" style={{fontSize: "18px", color: "var(--color-text-muted)"}}>check_circle</span> Accès à la radio en streaming</li>
            </ul>
            
            <Link href="/signup?plan=essentiel" className="pricing-btn-outline">S'inscrire gratuitement</Link>
        </div>

        {/* Plan 2: Premium */}
        <div className="premium-card" style={{background: "var(--color-bg)", padding: "40px 32px", border: "2px solid var(--color-accent)", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.03)", borderRadius: "2px"}}>
            <div style={{position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "var(--color-accent)", color: "#fff", fontFamily: "var(--font-primary)", fontSize: "10px", fontWeight: "700", padding: "6px 16px", borderRadius: "2px", letterSpacing: "0.1em", whiteSpace: "nowrap"}}>LE PLUS CHOISI</div>
            
            <h3 style={{fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "600", marginBottom: "12px", color: "var(--color-text)"}}>Premium</h3>
            <div style={{fontFamily: "var(--font-secondary)", fontSize: "48px", fontWeight: "700", marginBottom: "16px", color: "var(--color-text)"}}>
                {billingPeriod === 'monthly' ? '29€' : '23€'}
                <span style={{fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "400", color: "var(--color-text-muted)"}}>/mois</span>
            </div>
            {billingPeriod === 'annual' && <div style={{fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-accent)", marginTop: "-12px", marginBottom: "16px", fontWeight: "600"}}>Facturé 278€/an</div>}
            <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.5", marginBottom: "32px", minHeight: "42px"}}>Accès illimité aux 10 premiers magazines et aux audios/replays.</p>
            
            <ul style={{listStyle: "none", padding: "0", margin: "0 0 40px 0", fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text)", display: "flex", flexDirection: "column", gap: "16px", flexGrow: "1"}}>
                <li style={{display: "flex", gap: "12px", alignItems: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "18px", fontVariationSettings: "'FILL' 1"}}>check_circle</span> Tout de l'offre Essentiel</li>
                <li style={{display: "flex", gap: "12px", alignItems: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "18px", fontVariationSettings: "'FILL' 1"}}>check_circle</span> Accès illimité aux 10 premiers Magazines numériques DONA (HD)</li>
                <li style={{display: "flex", gap: "12px", alignItems: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "18px", fontVariationSettings: "'FILL' 1"}}>check_circle</span> Accès aux audios et au replay</li>
                <li style={{display: "flex", gap: "12px", alignItems: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "18px", fontVariationSettings: "'FILL' 1"}}>check_circle</span> Accès aux archives du Cercle DONA</li>
            </ul>
            
            <Link href={`/signup?plan=premium&billing=${billingPeriod}`} className="pricing-btn-accent">Devenir Premium</Link>
        </div>

        {/* Plan 3: Élite */}
        <div style={{background: "var(--color-bg)", padding: "40px 32px", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", borderRadius: "2px"}}>
            <h3 style={{fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "600", marginBottom: "12px", color: "var(--color-text)"}}>Élite</h3>
            <div style={{fontFamily: "var(--font-secondary)", fontSize: "48px", fontWeight: "700", marginBottom: "16px", color: "var(--color-text)"}}>
                {billingPeriod === 'monthly' ? '79€' : '63€'}
                <span style={{fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "400", color: "var(--color-text-muted)"}}>/mois</span>
            </div>
            {billingPeriod === 'annual' && <div style={{fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-accent)", marginTop: "-12px", marginBottom: "16px", fontWeight: "600"}}>Facturé 758€/an</div>}
            <p style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: "1.5", marginBottom: "32px", minHeight: "42px"}}>Accès intégral à l'ensemble du contenu et privilèges VIP.</p>
            
            <ul style={{listStyle: "none", padding: "0", margin: "0 0 40px 0", fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text)", display: "flex", flexDirection: "column", gap: "16px", flexGrow: "1"}}>
                <li style={{display: "flex", gap: "12px", alignItems: "center"}}><span className="material-symbols-outlined" style={{fontSize: "18px", fontVariationSettings: "'FILL' 1", color: "var(--color-accent)"}}>check_circle</span> Tout de l'offre Premium</li>
                <li style={{display: "flex", gap: "12px", alignItems: "center"}}><span className="material-symbols-outlined" style={{fontSize: "18px", fontVariationSettings: "'FILL' 1", color: "var(--color-accent)"}}>check_circle</span> Accès à tout le contenu (Tous les 16 Magazines)</li>
                <li style={{display: "flex", gap: "12px", alignItems: "center"}}><span className="material-symbols-outlined" style={{fontSize: "18px", fontVariationSettings: "'FILL' 1", color: "var(--color-accent)"}}>check_circle</span> Invitations exclusives aux événements et galas privés</li>
                <li style={{display: "flex", gap: "12px", alignItems: "center"}}><span className="material-symbols-outlined" style={{fontSize: "18px", fontVariationSettings: "'FILL' 1", color: "var(--color-accent)"}}>check_circle</span> Service de conciergerie éditoriale et accès anticipé</li>
            </ul>
            
            <Link href={`/signup?plan=elite&billing=${billingPeriod}`} className="pricing-btn-dark">Rejoindre l'Élite</Link>
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{maxWidth: "900px", margin: "0 auto", marginBottom: "80px"}}>
        <h2 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "600", textAlign: "center", marginBottom: "40px", color: "var(--color-text)", letterSpacing: "-0.02em"}}>Comparaison détaillée</h2>
        
        <div className="table-scroll-container">
          <div className="table-min-width" style={{fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--color-text)"}}>
            {/* Table Header */}
            <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderBottom: "none", fontWeight: "600", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase"}}>
                <div>FONCTIONNALITÉS</div>
                <div style={{textAlign: "center"}}>Essentiel</div>
                <div style={{textAlign: "center", color: "var(--color-accent)"}}>Premium</div>
                <div style={{textAlign: "center"}}>Élite</div>
            </div>
            
            {/* Table Body */}
            <div style={{border: "1px solid var(--color-border)"}}>
                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", borderBottom: "1px solid var(--color-border)", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>Extraits, aperçus & magazines publics</div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>
                
                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>Télé en direct</div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>
                
                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", borderBottom: "1px solid var(--color-border)", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>Radio en streaming</div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>
                
                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>10 premiers Magazines numériques HD (N°01 à N°10)</div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>
                
                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", borderBottom: "1px solid var(--color-border)", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>Contenus Audio & Replays</div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>Archives du Cercle DONA</div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", borderBottom: "1px solid var(--color-border)", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>Accès à TOUT le contenu (16 Magazines complets)</div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>
                
                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>Invitations événements & galas privés</div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 16px", alignItems: "center"}}>
                    <div style={{fontWeight: "500"}}>Conciergerie éditoriale & accès anticipé</div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-border)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>close</span></div>
                    <div style={{textAlign: "center", color: "var(--color-accent)"}}><span className="material-symbols-outlined" style={{fontSize: "20px"}}>check</span></div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{maxWidth: "600px", margin: "0 auto", marginBottom: "80px"}}>
        <h2 style={{fontFamily: "var(--font-secondary)", fontSize: "28px", fontWeight: "600", textAlign: "center", marginBottom: "40px", color: "var(--color-text)", letterSpacing: "-0.02em"}}>Questions fréquentes</h2>
        
        <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
            {/* Interactive FAQ Items */}
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    background: "var(--color-bg)",
                    overflow: "hidden",
                    transition: "all 0.3s ease"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: "100%",
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontFamily: "var(--font-primary)",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--color-text)",
                      background: isOpen ? "var(--color-bg-alt)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined" style={{ fontWeight: "300", color: isOpen ? "var(--color-accent)" : "inherit", transition: "transform 0.2s ease" }}>
                      {isOpen ? "remove" : "add"}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: "0 20px 20px 20px",
                      background: "var(--color-bg-alt)",
                      fontFamily: "var(--font-primary)",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      color: "var(--color-text-muted)"
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-badges" style={{fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-text-muted)", textAlign: "center"}}>
        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
            <span className="material-symbols-outlined" style={{fontSize: "18px"}}>lock</span> Paiement sécurisé
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
            <span className="material-symbols-outlined" style={{fontSize: "18px"}}>support_agent</span> Support 24/7
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
            <span className="material-symbols-outlined" style={{fontSize: "18px"}}>event_busy</span> Annulable à tout moment
        </div>
      </section>

    </main>
  );
}

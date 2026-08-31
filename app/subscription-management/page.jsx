"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';

export default function Page() {
  const router = useRouter();

  // Modals state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);
  const [subStatus, setSubStatus] = useState('Active');
  const [subMessage, setSubMessage] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [cardInput, setCardInput] = useState({ number: '', expiry: '', cvc: '' });

  const getMemberEmail = () => {
    try {
      const profile = JSON.parse(localStorage.getItem('dona_member_profile') || '{}');
      return profile.email || 'ernest@example.com';
    } catch(e) {
      return 'ernest@example.com';
    }
  };

  const handleCancelSubscription = async () => {
    setLoadingAction(true);
    try {
      const email = getMemberEmail();
      const res = await fetch('/api/subscription/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', email }),
      });
      const data = await res.json();
      if (res.ok) {
        setCancelConfirmed(true);
        setSubStatus('Cancelled at period end');
        setShowCancelModal(false);
        setSubMessage({ type: 'success', text: data.message });
      } else {
        alert(data.error || 'Erreur lors de la demande de résiliation.');
      }
    } catch (e) {
      alert('Erreur réseau lors de la communication avec le serveur de facturation.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdatePaymentMethodSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const email = getMemberEmail();
      const res = await fetch('/api/subscription/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-payment-method',
          email,
          paymentDetails: { cardNumber: cardInput.number, expiry: cardInput.expiry }
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowPaymentModal(false);
        setSubMessage({ type: 'success', text: data.message });
        setTimeout(() => setSubMessage(null), 5000);
      } else {
        alert(data.error || 'Erreur lors de la mise à jour bancaire.');
      }
    } catch (e) {
      alert('Erreur réseau lors de la validation avec le serveur bancaire.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDownloadInvoice = (invoiceId, date, amount) => {
    let memberName = 'Membre DONA';
    let memberEmail = '';
    try {
      const profile = JSON.parse(localStorage.getItem('dona_member_profile') || '{}');
      if (profile.firstName) memberName = `${profile.firstName} ${profile.lastName || ''}`.trim();
      if (profile.email) memberEmail = profile.email;
    } catch(e) {}

    generateInvoicePDF({
      invoiceId,
      date,
      amount,
      plan: 'Premium',
      memberName,
      memberEmail,
      paymentMethod: 'VISA •••• 4242'
    });
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (err) {
      router.push('/login');
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
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
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
        .advanced-settings-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 16px 0;
          background: none;
          border: none;
          color: var(--color-text);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.3s ease;
          text-align: left;
        }
        .advanced-settings-button:hover {
          color: var(--color-accent);
        }
        .facturation-button {
          color: var(--color-accent);
          background: none;
          border: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          font-size: 13px;
          transition: color 0.3s ease;
          padding: 0;
        }
        .facturation-button:hover {
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
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .modal-card {
          background: #FFFFFF;
          color: #111111;
          border-radius: 6px;
          padding: 36px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
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
              <button type="button" onClick={handleLogout} className="logout-link">
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>logout</span> 
                  SE DÉCONNECTER
              </button>
          </div>
      </aside>
  
      {/* Main Content Area */}
      <div className="vip-content">
          <h1 className="vip-title">Mon Abonnement & Facturation</h1>
          
          {subMessage && (
            <div style={{
              padding: "14px 18px",
              borderRadius: "4px",
              marginBottom: "24px",
              background: subMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: subMessage.type === 'success' ? '1px solid #10B981' : '1px solid #EF4444',
              color: subMessage.type === 'success' ? '#065F46' : '#991B1B',
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                {subMessage.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{subMessage.text}</span>
            </div>
          )}
          
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
                      
                      <button className="btn-crimson" style={{width: "100%"}} onClick={() => router.push('/abonnement')}>
                        CHANGER OU SURPASSER MON OFFRE
                      </button>
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
                                  <td style={{padding: "15px 20px"}}>
                                    <button type="button" onClick={() => handleDownloadInvoice('INV-2026-0515', '15 Mai 2026', '29.00€')} className="facturation-button">
                                      <span className="material-symbols-outlined" style={{fontSize: "16px"}}>download</span> Télécharger PDF
                                    </button>
                                  </td>
                              </tr>
                              <tr style={{borderBottom: "none"}}>
                                  <td style={{padding: "15px 20px", color: "var(--color-text)"}}>15 Avr 2026</td>
                                  <td style={{padding: "15px 20px", color: "var(--color-text)"}}>29.00€</td>
                                  <td style={{padding: "15px 20px"}}><span style={{background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "4px 8px", borderRadius: "2px", fontSize: "11px", fontWeight: "600"}}>Payé</span></td>
                                  <td style={{padding: "15px 20px"}}>
                                    <button type="button" onClick={() => handleDownloadInvoice('INV-2026-0415', '15 Avril 2026', '29.00€')} className="facturation-button">
                                      <span className="material-symbols-outlined" style={{fontSize: "16px"}}>download</span> Télécharger PDF
                                    </button>
                                  </td>
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
                      <button type="button" onClick={() => setShowPaymentModal(true)} className="btn-outline-crimson" style={{width: "100%"}}>METTRE À JOUR</button>
                  </div>
                  
                  <h3 style={{fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "var(--color-text)"}}>Paramètres Avancés</h3>
                  <div style={{background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "20px"}}>
                      <button 
                        type="button" 
                        onClick={() => setShowNotificationModal(true)} 
                        className="advanced-settings-button" 
                        style={{borderBottom: "1px solid var(--color-border)"}}
                      >
                          Gérer les notifications
                          <span className="material-symbols-outlined" style={{color: "var(--color-text-muted)"}}>arrow_forward</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowCancelModal(true)} 
                        className="advanced-settings-button" 
                        style={{color: "var(--color-accent)", paddingBottom: "0"}}
                      >
                          {cancelConfirmed ? "Abonnement résilié à l'échéance" : "Résilier mon abonnement"}
                          <span className="material-symbols-outlined" style={{color: "var(--color-accent)"}}>
                            {cancelConfirmed ? "check_circle" : "cancel"}
                          </span>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* Modal 1: Notification Preferences */}
      {showNotificationModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", margin: "0 0 16px 0", color: "#8B002A" }}>
              Préférences de Notifications
            </h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
              Choisissez les communications que vous souhaitez recevoir de DONA MAGAZINE.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={notifSettings.newsletter} 
                  onChange={(e) => setNotifSettings(prev => ({ ...prev, newsletter: e.target.checked }))} 
                />
                Brief quotidien & Newsletter VIP
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={notifSettings.nouveautesMag} 
                  onChange={(e) => setNotifSettings(prev => ({ ...prev, nouveautesMag: e.target.checked }))} 
                />
                Nouveaux numéros & éditions spéciales
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={notifSettings.masterclasses} 
                  onChange={(e) => setNotifSettings(prev => ({ ...prev, masterclasses: e.target.checked }))} 
                />
                Invitations Masterclasses & Audios Replays
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" onClick={() => setShowNotificationModal(false)} className="btn-crimson" style={{ padding: "10px 20px" }}>
                Enregistrer & Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Payment Method Update */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", margin: "0 0 16px 0", color: "#8B002A" }}>
              Mettre à jour le moyen de paiement
            </h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
              Saisissez les coordonnées de votre nouvelle carte bancaire pour le renouvellement automatique.
            </p>
            <form onSubmit={handleUpdatePaymentMethodSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px" }}>Numéro de Carte</label>
                <input 
                  type="text" 
                  required 
                  placeholder="4532 •••• •••• 4242" 
                  value={cardInput.number}
                  onChange={e => setCardInput({ ...cardInput, number: e.target.value })}
                  style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px" }} 
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px" }}>Expiration</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="12/28" 
                    value={cardInput.expiry}
                    onChange={e => setCardInput({ ...cardInput, expiry: e.target.value })}
                    style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px" }} 
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px" }}>CVC</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="123" 
                    value={cardInput.cvc}
                    onChange={e => setCardInput({ ...cardInput, cvc: e.target.value })}
                    style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px" }} 
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setShowPaymentModal(false)} style={{ background: "#eee", border: "none", padding: "10px 18px", borderRadius: "4px", cursor: "pointer" }}>
                  Annuler
                </button>
                <button type="submit" className="btn-crimson" disabled={loadingAction} style={{ padding: "10px 20px" }}>
                  {loadingAction ? "Validation..." : "Valider la carte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Cancellation Confirmation */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", margin: "0 0 16px 0", color: "#8B002A" }}>
              Résiliation de l'abonnement
            </h3>
            <p style={{ fontSize: "14px", color: "#444", lineHeight: "1.6", marginBottom: "20px" }}>
              Êtes-vous sûre de vouloir résilier votre formule <strong>DONA Premium</strong> ?
              Votre demande sera communiquée au serveur de facturation récurrente et vous conserverez l'accès à tous vos privilèges jusqu'à la fin de la période en cours.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" onClick={() => setShowCancelModal(false)} style={{ background: "#eee", border: "none", padding: "10px 18px", borderRadius: "4px", cursor: "pointer" }}>
                Conserver mon offre
              </button>
              <button 
                type="button" 
                onClick={handleCancelSubscription} 
                disabled={loadingAction}
                className="btn-crimson" 
                style={{ padding: "10px 20px", background: "#333" }}
              >
                {loadingAction ? "Transmission..." : "Confirmer la résiliation"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

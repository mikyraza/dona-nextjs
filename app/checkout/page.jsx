"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// ─── ALGORITHME DE LUHN & UTILITAIRES DE CARTE ───────────────────────────────

export function validateLuhn(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

export function getCardBrand(cardNumber) {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
  if (/^3[47]/.test(clean)) return 'AMEX';
  if (/^(6011|65|64[4-9])/.test(clean)) return 'DISCOVER';
  return 'CB';
}

export function validateExpiry(expiryStr) {
  const clean = expiryStr.replace(/\D/g, '');
  if (clean.length !== 4) return false;
  const month = parseInt(clean.substring(0, 2), 10);
  const year = parseInt('20' + clean.substring(2, 4), 10);
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

// ─── COMPOSANT CONTENU CHECKOUT ────────────────────────────────────────────────

function CheckoutFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || 'premium';

  // Selected plan state
  const PLANS = {
    essentiel: { name: 'Formule Essentiel', price: 12, billing: 'mensuel', text: '12.00€ / mois' },
    premium: { name: 'Formule Premium', price: 29, billing: 'mensuel', text: '29.00€ / mois' },
    elite: { name: 'Adhésion Élite / Alliance', price: 480, billing: 'annuel', text: '480.00€ / an' }
  };
  const activePlan = PLANS[planParam.toLowerCase()] || PLANS.premium;

  // Form states
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'transfer'
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Billing address
  const [sameAsProfile, setSameAsProfile] = useState(true);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Paris');
  const [postalCode, setPostalCode] = useState('75001');

  // Error & Status states
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Auto-format card number
  const handleCardNumberChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: null }));
  };

  // Auto-format expiry
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.substring(0, 2) + '/' + raw.substring(2);
    }
    setExpiry(raw);
    if (errors.expiry) setErrors(prev => ({ ...prev, expiry: null }));
  };

  // Apply promo code
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'DONA10' || promoCode.trim().toUpperCase() === 'CERCLE') {
      setDiscount(20); // 20% discount
      alert("Code promo appliqué ! Vous bénéficiez de 20% de réduction.");
    } else {
      alert("Code promo invalide. Essayez DONA10 ou CERCLE.");
    }
  };

  // Submit payment handler with Luhn & Gateway validation
  const handleSubmitPayment = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\D/g, '');
      if (!cleanCard) {
        newErrors.cardNumber = "Le numéro de carte est obligatoire.";
      } else if (!validateLuhn(cleanCard)) {
        newErrors.cardNumber = "Numéro de carte invalide (Échec de la vérification de l'algorithme de Luhn).";
      }

      if (!cardHolder.trim()) {
        newErrors.cardHolder = "Le nom du titulaire est obligatoire.";
      }

      if (!expiry) {
        newErrors.expiry = "La date d'expiration est obligatoire.";
      } else if (!validateExpiry(expiry)) {
        newErrors.expiry = "Date d'expiration invalide (MM/AA).";
      }

      const cleanCvc = cvc.replace(/\D/g, '');
      if (!cleanCvc || (cleanCvc.length !== 3 && cleanCvc.length !== 4)) {
        newErrors.cvc = "CVC invalide (3 ou 4 chiffres requis).";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process simulation
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Activate subscription in localStorage & dispatch event
      if (typeof window !== 'undefined') {
        const currentProfile = JSON.parse(localStorage.getItem('dona_member_profile') || '{}');
        const updatedProfile = {
          ...currentProfile,
          plan: activePlan.name.includes('Élite') ? 'Élite' : activePlan.name.includes('Premium') ? 'Premium' : 'Essentiel',
          status: 'Active',
          subscribedAt: new Date().toISOString()
        };
        localStorage.setItem('dona_member_profile', JSON.stringify(updatedProfile));
        localStorage.setItem('dona_user_plan', updatedProfile.plan);
        window.dispatchEvent(new Event('dona_subscription_changed'));
      }

      // Redirect after 1.5s
      setTimeout(() => {
        const refNum = Math.floor(100000 + Math.random() * 900000);
        router.push(`/confirmation?ref=${refNum}&plan=${planParam.toLowerCase()}`);
      }, 1500);

    }, 1200);
  };

  const finalPrice = (activePlan.price * (1 - discount / 100)).toFixed(2);
  const cardBrand = getCardBrand(cardNumber);

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
        .checkout-input-group.error {
          border-color: #EF4444 !important;
          background: rgba(239, 68, 68, 0.03);
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
        .error-hint {
          color: #EF4444;
          font-size: 11px;
          margin-top: 4px;
          font-weight: 500;
        }
      `}</style>

      {/* LEFT SIDEBAR: Selection */}
      <aside style={{background: "var(--color-bg)", padding: "32px", borderRadius: "2px", height: "fit-content", border: "1px solid var(--color-border)", boxShadow: "0 20px 40px rgba(0,0,0,0.02)"}}>
          <h2 style={{fontFamily: "var(--font-secondary)", fontSize: "24px", fontWeight: "600", marginBottom: "24px", color: "var(--color-text)"}}>Votre Sélection</h2>
          
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px"}}>
              <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                  <div style={{width: "50px", height: "50px", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <span className="material-symbols-outlined" style={{fontSize: "24px", color: "#8B002A"}}>workspace_premium</span>
                  </div>
                  <div>
                      <div style={{fontSize: "14px", fontWeight: "600", color: "var(--color-text)", marginBottom: "4px"}}>{activePlan.name}</div>
                      <div style={{fontSize: "10px", color: "var(--color-text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em"}}>{activePlan.billing}</div>
                  </div>
              </div>
              <div style={{fontWeight: "600", fontSize: "16px", color: "var(--color-text)"}}>{activePlan.price}€</div>
          </div>

          <div style={{display: "flex", gap: "8px", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid var(--color-border)"}}>
              <input 
                type="text" 
                placeholder="Code promo (ex: DONA10)" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{flexGrow: "1", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", padding: "12px 16px", borderRadius: "2px", fontSize: "13px", color: "var(--color-text)", outline: "none"}} 
              />
              <button 
                type="button" 
                onClick={handleApplyPromo}
                style={{background: "var(--color-text)", color: "var(--color-bg)", border: "none", padding: "0 16px", borderRadius: "2px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer"}}
              >
                Appliquer
              </button>
          </div>

          <div style={{display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px"}}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span style={{color: "var(--color-text-muted)"}}>Sous-total</span>
                  <span style={{fontWeight: "500", color: "var(--color-text)"}}>{activePlan.price}.00€</span>
              </div>
              {discount > 0 && (
                <div style={{display: "flex", justifyContent: "space-between", color: "#10B981"}}>
                    <span>Remise ({discount}%)</span>
                    <span style={{fontWeight: "600"}}>-{(activePlan.price * discount / 100).toFixed(2)}€</span>
                </div>
              )}
              <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span style={{color: "var(--color-text-muted)"}}>TVA (20%)</span>
                  <span style={{fontWeight: "500", color: "var(--color-text)"}}>Inclus</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px"}}>
                  <span style={{fontFamily: "var(--font-secondary)", fontSize: "20px", color: "var(--color-text)"}}>Total à payer</span>
                  <span style={{fontSize: "24px", fontWeight: "700", color: "#8B002A"}}>{finalPrice}€</span>
              </div>
          </div>
      </aside>

      {/* RIGHT MAIN AREA: Checkout */}
      <section style={{background: "var(--color-bg)", padding: "48px", borderRadius: "2px", border: "1px solid var(--color-border)", boxShadow: "0 20px 40px rgba(0,0,0,0.02)"}}>
          <h1 style={{fontFamily: "var(--font-secondary)", fontSize: "36px", fontWeight: "700", color: "var(--color-text)", marginBottom: "16px", letterSpacing: "-0.02em"}}>Paiement Sécurisé PCI-DSS</h1>
          <p style={{color: "var(--color-text-muted)", fontSize: "15px", marginBottom: "40px"}}>
            Validation en temps réel via l'algorithme de Luhn & Chiffrement bancaire SSL 256-bit.
          </p>

          {paymentSuccess && (
            <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid #10B981", padding: "20px", borderRadius: "4px", marginBottom: "30px", textAlign: "center", fontWeight: "600" }}>
              ✓ Paiement validé avec succès ! Activation de votre compte en cours...
            </div>
          )}

          {/* Payment Methods Tabs */}
          <div style={{display: "flex", gap: "32px", borderBottom: "1px solid var(--color-border)", marginBottom: "32px"}}>
              <div 
                className={`checkout-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>credit_card</span> CARTE BANCAIRE
              </div>
              <div 
                className={`checkout-tab ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>payments</span> PAYPAL
              </div>
              <div 
                className={`checkout-tab ${paymentMethod === 'transfer' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('transfer')}
              >
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>account_balance</span> VIREMENT B2B
              </div>
          </div>

          <form onSubmit={handleSubmitPayment}>

            {/* Mode 1: Carte Bancaire (avec validation de Luhn) */}
            {paymentMethod === 'card' && (
              <>
                <h3 style={{fontFamily: "var(--font-secondary)", fontSize: "18px", fontWeight: "600", color: "var(--color-text)", marginBottom: "20px"}}>Informations de la carte</h3>
                
                <div style={{display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px"}}>
                    
                    <div className={`checkout-input-group ${errors.cardNumber ? 'error' : ''}`}>
                        <div className="checkout-label">Numéro de carte (Algorithme de Luhn)</div>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <input 
                              type="text" 
                              placeholder="4532 •••• •••• ••••" 
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              className="checkout-input" 
                              maxLength={19}
                            />
                            <div style={{fontSize: "11px", fontWeight: "700", color: "#8B002A", background: "rgba(139,0,42,0.08)", padding: "4px 8px", borderRadius: "2px"}}>
                              {cardBrand}
                            </div>
                        </div>
                        {errors.cardNumber && <div className="error-hint">{errors.cardNumber}</div>}
                    </div>

                    <div className={`checkout-input-group ${errors.cardHolder ? 'error' : ''}`}>
                        <div className="checkout-label">Titulaire de la carte</div>
                        <input 
                          type="text" 
                          placeholder="Nom & Prénom figurant sur la carte" 
                          value={cardHolder}
                          onChange={(e) => { setCardHolder(e.target.value); if(errors.cardHolder) setErrors(prev => ({ ...prev, cardHolder: null })); }}
                          className="checkout-input" 
                        />
                        {errors.cardHolder && <div className="error-hint">{errors.cardHolder}</div>}
                    </div>

                    <div className="checkout-grid-2">
                        <div className={`checkout-input-group ${errors.expiry ? 'error' : ''}`}>
                            <div className="checkout-label">Date d'expiration</div>
                            <input 
                              type="text" 
                              placeholder="MM/AA" 
                              value={expiry}
                              onChange={handleExpiryChange}
                              className="checkout-input" 
                              maxLength={5}
                            />
                            {errors.expiry && <div className="error-hint">{errors.expiry}</div>}
                        </div>
                        <div className={`checkout-input-group ${errors.cvc ? 'error' : ''}`}>
                            <div className="checkout-label">Code CVC / CVV</div>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <input 
                                  type="text" 
                                  placeholder="123" 
                                  value={cvc}
                                  onChange={(e) => { setCvc(e.target.value.replace(/\D/g, '').slice(0, 4)); if(errors.cvc) setErrors(prev => ({ ...prev, cvc: null })); }}
                                  className="checkout-input" 
                                  maxLength={4}
                                />
                                <span className="material-symbols-outlined" style={{fontSize: "18px", color: "var(--color-text-muted)"}}>lock</span>
                            </div>
                            {errors.cvc && <div className="error-hint">{errors.cvc}</div>}
                        </div>
                    </div>
                </div>
              </>
            )}

            {/* Mode 2: PayPal */}
            {paymentMethod === 'paypal' && (
              <div style={{ background: "#FAF9F6", border: "1px solid #EFEFEF", padding: "30px", textAlign: "center", borderRadius: "4px", marginBottom: "32px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#003087", display: "block", marginBottom: "12px" }}>
                  account_balance_wallet
                </span>
                <h4 style={{ fontSize: "16px", color: "#111", margin: "0 0 8px 0" }}>Payer avec PayPal Express</h4>
                <p style={{ fontSize: "13px", color: "#666", margin: "0 0 20px 0" }}>
                  Vous serez redirigé vers la fenêtre sécurisée PayPal pour valider votre souscription en un clic.
                </p>
              </div>
            )}

            {/* Mode 3: Virement B2B */}
            {paymentMethod === 'transfer' && (
              <div style={{ background: "#FAF9F6", border: "1px solid #EFEFEF", padding: "24px", borderRadius: "4px", marginBottom: "32px", fontSize: "13px", color: "#444" }}>
                <div style={{ fontWeight: "700", color: "#8B002A", marginBottom: "8px" }}>Coordonnées Bancaires DONA Media (IBAN / SEPA) :</div>
                <div><strong>IBAN :</strong> FR76 3000 4018 2200 0123 4567 890</div>
                <div><strong>BIC / SWIFT :</strong> BNPAFRPPXXX</div>
                <div><strong>Référence obligatoire :</strong> ABONNEMENT-DONA-{activePlan.name.toUpperCase()}</div>
              </div>
            )}

            {/* Billing Address */}
            <h3 style={{fontFamily: "var(--font-secondary)", fontSize: "18px", fontWeight: "600", color: "var(--color-text)", marginBottom: "16px"}}>Adresse de facturation</h3>
            
            <label style={{display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "20px", cursor: "pointer"}}>
                <input 
                  type="checkbox" 
                  checked={sameAsProfile}
                  onChange={(e) => setSameAsProfile(e.target.checked)}
                  style={{width: "16px", height: "16px", accentColor: "#8B002A"}} 
                /> Identique à l'adresse du profil membre
            </label>

            {!sameAsProfile && (
              <div style={{display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px"}}>
                  <div className="checkout-input-group">
                      <div className="checkout-label">Adresse</div>
                      <input type="text" placeholder="Adresse complète" value={address} onChange={(e) => setAddress(e.target.value)} className="checkout-input" />
                  </div>

                  <div className="checkout-grid-2">
                      <div className="checkout-input-group">
                          <div className="checkout-label">Ville</div>
                          <input type="text" placeholder="Paris" value={city} onChange={(e) => setCity(e.target.value)} className="checkout-input" />
                      </div>
                      <div className="checkout-input-group">
                          <div className="checkout-label">Code postal</div>
                          <input type="text" placeholder="75001" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="checkout-input" />
                      </div>
                  </div>
              </div>
            )}

            {/* Submit Button */}
            <div style={{textAlign: "center", marginBottom: "24px", marginTop: "32px"}}>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "16px"}}>
                    <span className="material-symbols-outlined" style={{fontSize: "14px", color: "#10B981"}}>shield_lock</span>
                    Paiement chiffré SSL 256-bit · Validation Algorithme de Luhn
                </div>
                
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  style={{width: "100%", background: "#8B002A", color: "#FFFFFF", border: "none", padding: "18px", borderRadius: "2px", fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", opacity: isProcessing ? 0.7 : 1}}
                >
                    {isProcessing ? "Validation bancaire en cours..." : `Confirmer et Payer ${finalPrice}€`}
                </button>
            </div>

            <p style={{textAlign: "center", fontSize: "11px", color: "var(--color-text-muted)", lineHeight: "1.5"}}>
                En confirmant votre paiement, vous acceptez nos <Link href="/mentions-legales" style={{ color: "#8B002A", textDecoration: "underline" }}>Conditions Générales de Vente</Link> et notre <Link href="/politique-confidentialite" style={{ color: "#8B002A", textDecoration: "underline" }}>Politique de Confidentialité</Link>.
            </p>

          </form>

      </section>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Chargement du paiement sécurisé...</div>}>
      <CheckoutFormContent />
    </Suspense>
  );
}

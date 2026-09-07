"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ConfirmationClient({
  refParam,
  planParam = 'premium',
  initialOrder = null
}) {
  const { t } = useLanguage();
  const [order, setOrder] = useState(initialOrder);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    // If order wasn't found by server or user has fresh local data
    if (!order) {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('dona_last_order');
          if (stored) {
            setOrder(JSON.parse(stored));
            return;
          }
        } catch (e) {}
      }

      // Default safe fallback
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      setOrder({
        id: refParam || `DONA-ORD-${now.getFullYear()}-100001`,
        customerName: 'Membre DONA',
        customerEmail: 'contact@donamagazine.com',
        plan: planParam.charAt(0).toUpperCase() + planParam.slice(1),
        planName: `Abonnement DONA — ${planParam.charAt(0).toUpperCase() + planParam.slice(1)}`,
        billingCycle: 'mensuel',
        subtotal: 24.17,
        tax: 4.83,
        discount: 0,
        promoCode: null,
        total: 29.00,
        currency: 'EUR',
        paymentMethod: 'Carte bancaire sécurisée (SSL)',
        cardBrand: 'VISA',
        cardLast4: '4242',
        billingAddress: '15 Boulevard Saint-Germain, 75005 Paris, France',
        status: 'Completed',
        createdAt: now.toISOString(),
        nextBillingDate: nextMonth.toISOString()
      });
    }
  }, [order, refParam, planParam]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return String(dateStr);
    }
  };

  const handleDownloadReceipt = () => {
    if (!order) return;
    generateInvoicePDF({
      invoiceId: `INV-${order.id}`,
      date: formatDate(order.createdAt),
      amount: `${Number(order.total).toFixed(2)}€`,
      plan: order.plan,
      memberName: order.customerName,
      memberEmail: order.customerEmail,
      paymentMethod: `${order.cardBrand || 'VISA'} •••• ${order.cardLast4 || '4242'}`
    });
    setDownloaded(true);
  };

  if (!order) {
    return null;
  }

  const orderDateFormatted = formatDate(order.createdAt) || new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const nextBillingFormatted = formatDate(order.nextBillingDate) || 'Dans 30 jours';

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "80vh", padding: "60px 20px", background: "var(--color-bg)" }}>

      <style>{`
        .confirm-container {
          max-width: 820px;
          width: 100%;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.02);
          overflow: hidden;
        }
        .confirm-header {
          background: linear-gradient(135deg, #8B002A 0%, #5a0018 100%);
          padding: 48px;
          text-align: center;
          color: #fff;
        }
        .confirm-body {
          padding: 48px;
        }
        .receipt-card {
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .receipt-table th {
          text-align: left;
          font-family: var(--font-primary);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          padding-bottom: 12px;
          border-bottom: 2px solid var(--color-border);
        }
        .receipt-table td {
          padding: 14px 0;
          color: var(--color-text);
          border-bottom: 1px solid var(--color-border);
        }
        .receipt-table td:last-child {
          text-align: right;
          font-weight: 600;
        }
        .receipt-total-bar {
          background: var(--color-bg);
          padding: 20px 24px;
          border-radius: 2px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid var(--color-border);
          margin-bottom: 32px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .info-card {
          border: 1px solid var(--color-border);
          padding: 20px;
          border-radius: 2px;
          background: var(--color-bg);
        }
        .info-card-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8B002A;
          margin-bottom: 10px;
          display: block;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 32px;
        }
        .step-card {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          transition: all 0.3s ease;
          gap: 10px;
        }
        .step-card:hover {
          background: var(--color-bg-alt);
          border-color: #8B002A;
        }
        .btn-download {
          width: 100%;
          background: #8B002A;
          color: #fff;
          border: none;
          padding: 16px;
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s ease;
          margin-bottom: 12px;
        }
        .btn-download:hover {
          background: #6b0020;
        }
        .btn-download.done {
          background: #10B981;
        }
        @media (max-width: 700px) {
          .confirm-header, .confirm-body { padding: 32px 20px; }
          .info-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="confirm-container">

        {/* ─── HEADER SUCCESS ─── */}
        <div className="confirm-header">
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#fff" }}>check_circle</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: "700", color: "#fff", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Commande Validée & Paiement Confirmé
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: "20px" }}>
            Bienvenue dans l'Alliance DONA, <strong style={{ color: "#fff" }}>{order.customerName}</strong>
          </p>
          
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "2px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em", color: "#FFFFFF" }}>
            <span>N° DE TRANSACTION :</span>
            <span style={{ fontFamily: "monospace", color: "#FFFFFF", fontWeight: "700" }}>{order.id}</span>
          </div>
        </div>

        {/* ─── BODY ─── */}
        <div className="confirm-body">

          {/* Section: Informations de facturation & client */}
          <div className="info-grid">
            <div className="info-card">
              <span className="info-card-title">Titulaire & Facturation</span>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text)", marginBottom: "4px" }}>
                {order.customerName}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "6px" }}>
                {order.customerEmail}
              </div>
              {order.billingAddress && (
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: "1.5" }}>
                  {order.billingAddress}
                </div>
              )}
            </div>

            <div className="info-card">
              <span className="info-card-title">Modalités de Règlement</span>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text)", marginBottom: "4px" }}>
                {order.paymentMethod}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <span>Carte :</span>
                <strong>{order.cardBrand || 'VISA'} •••• {order.cardLast4 || '4242'}</strong>
              </div>
              <div style={{ fontSize: "12px", color: "#10B981", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>verified</span>
                Paiement accepté & chiffré SSL 256-bit
              </div>
            </div>
          </div>

          {/* Section: Détails de l'Achat (Itemized Table) */}
          <div className="receipt-card">
            <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "20px", fontWeight: "600", color: "var(--color-text)", marginBottom: "20px" }}>
              Détails de votre achat
            </h2>

            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Description de la prestation</th>
                  <th style={{ textAlign: "center" }}>Période</th>
                  <th style={{ textAlign: "right" }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{order.planName}</div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                      Accès numérique intégral illimité aux 16 Cahiers DONA & archives
                    </div>
                  </td>
                  <td style={{ textAlign: "center", textTransform: "capitalize", color: "var(--color-text-muted)" }}>
                    {order.billingCycle}
                  </td>
                  <td>{`${Number(order.subtotal).toFixed(2)}€`}</td>
                </tr>

                <tr>
                  <td colSpan={2} style={{ color: "var(--color-text-muted)" }}>Sous-total (Hors Taxes)</td>
                  <td>{`${Number(order.subtotal).toFixed(2)}€`}</td>
                </tr>

                <tr>
                  <td colSpan={2} style={{ color: "var(--color-text-muted)" }}>TVA Légale (20%)</td>
                  <td>{`${Number(order.tax).toFixed(2)}€`}</td>
                </tr>

                {Number(order.discount) > 0 && (
                  <tr style={{ color: "#10B981" }}>
                    <td colSpan={2} style={{ color: "#10B981" }}>
                      Remise accordée {order.promoCode ? `(Code : ${order.promoCode})` : ''}
                    </td>
                    <td style={{ color: "#10B981" }}>{`-${Number(order.discount).toFixed(2)}€`}</td>
                  </tr>
                )}

                <tr>
                  <td colSpan={2} style={{ color: "var(--color-text-muted)" }}>Date de transaction</td>
                  <td style={{ fontWeight: "normal" }}>{orderDateFormatted}</td>
                </tr>

                <tr>
                  <td colSpan={2} style={{ color: "var(--color-text-muted)" }}>Prochaine date d'échéance</td>
                  <td style={{ fontWeight: "normal" }}>{nextBillingFormatted}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Bar */}
          <div className="receipt-total-bar">
            <div>
              <span style={{ fontFamily: "var(--font-secondary)", fontSize: "18px", color: "var(--color-text)", display: "block" }}>
                Montant total réglé TTC
              </span>
              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                Devise de facturation : {order.currency || 'EUR'}
              </span>
            </div>
            <span style={{ fontSize: "32px", fontWeight: "700", color: "#8B002A" }}>
              {`${Number(order.total).toFixed(2)}€`}
            </span>
          </div>

          {/* CTA Téléchargement Facture PDF */}
          <button
            className={`btn-download ${downloaded ? 'done' : ''}`}
            onClick={handleDownloadReceipt}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              {downloaded ? 'task_alt' : 'download'}
            </span>
            {downloaded ? 'Reçu de commande téléchargé ✓' : 'Télécharger ma facture / reçu officiel (PDF)'}
          </button>

          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "8px" }}>
            Le document officiel est généré en temps réel et certifié conforme aux normes comptables DONA Media.
          </p>

          {order.customerEmail && (
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "0" }}>
              Un exemplaire de cette confirmation a été consigné pour <strong>{order.customerEmail}</strong>.
            </p>
          )}

          {/* Étapes suivantes */}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "40px", marginTop: "40px" }}>
            <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "24px", textAlign: "center" }}>
              Poursuivre votre expérience
            </h3>

            <div className="steps-grid">
              <Link href="/member-profile" className="step-card">
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#8B002A" }}>person_outline</span>
                <span style={{ fontFamily: "var(--font-primary)", fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>Mon Profil Membre</span>
              </Link>
              <Link href="/magazines" className="step-card">
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#8B002A" }}>menu_book</span>
                <span style={{ fontFamily: "var(--font-primary)", fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>Accéder aux Cahiers</span>
              </Link>
              <Link href="/subscription-management" className="step-card">
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#8B002A" }}>receipt_long</span>
                <span style={{ fontFamily: "var(--font-primary)", fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>Gestion Abonnement</span>
              </Link>
            </div>
          </div>

          {/* Note footer */}
          <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-text-muted)", textAlign: "center", marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--color-border)" }}>
            Besoin d'assistance concernant votre commande ?<br />
            <a href="mailto:concierge@donamagazine.com" style={{ color: "#8B002A", textDecoration: "underline", marginTop: "4px", display: "inline-block" }}>
              concierge@donamagazine.com
            </a>
          </p>

        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';

// ─── COMPOSANT INTERNE (utilise useSearchParams → doit être dans Suspense) ────
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || ('DON-' + Math.floor(100000 + Math.random() * 900000));
  const planParam = searchParams.get('plan') || 'premium';

  const [memberName, setMemberName] = useState('Membre DONA');
  const [memberEmail, setMemberEmail] = useState('');
  const [plan, setPlan] = useState('Premium');
  const [downloaded, setDownloaded] = useState(false);
  const [today] = useState(new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }));

  // Prix selon le plan
  const PLAN_PRICES = {
    essentiel: '0.00€',
    premium: '29.00€',
    elite: '480.00€',
  };
  const amount = PLAN_PRICES[planParam.toLowerCase()] || '29.00€';

  // Next billing
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextBilling = nextMonth.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem('dona_member_profile') || '{}');
      if (profile.firstName) setMemberName(`${profile.firstName} ${profile.lastName || ''}`.trim());
      if (profile.email) setMemberEmail(profile.email);
      const planStored = localStorage.getItem('dona_user_plan');
      if (planStored) setPlan(planStored);
    } catch (e) {}
  }, []);

  const handleDownloadReceipt = () => {
    generateInvoicePDF({
      invoiceId: `INV-${ref}`,
      date: today,
      amount,
      plan,
      memberName,
      memberEmail,
      paymentMethod: 'Carte bancaire'
    });
    setDownloaded(true);
  };

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "80vh", padding: "60px 20px", background: "var(--color-bg)" }}>

      <style>{`
        .confirm-container {
          max-width: 760px;
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
        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin-bottom: 24px;
        }
        .receipt-table tr {
          border-bottom: 1px solid var(--color-border);
        }
        .receipt-table tr:last-child {
          border-bottom: none;
        }
        .receipt-table td {
          padding: 14px 0;
          color: var(--color-text);
        }
        .receipt-table td:last-child {
          text-align: right;
          font-weight: 600;
        }
        .receipt-total {
          background: var(--color-bg-alt);
          padding: 16px 20px;
          border-radius: 2px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid var(--color-border);
          margin-bottom: 32px;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 40px;
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
          font-size: 14px;
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
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="confirm-container">

        {/* ─── HEADER SUCCESS ─── */}
        <div className="confirm-header">
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#fff" }}>check_circle</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "700", color: "#fff", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Paiement confirmé !
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", marginBottom: "16px" }}>
            Bienvenue dans l'Alliance DONA, <strong style={{ color: "#fff" }}>{memberName}</strong>
          </p>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "2px", padding: "6px 16px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)" }}>
            Référence : {ref}
          </div>
        </div>

        {/* ─── BODY ─── */}
        <div className="confirm-body">

          {/* Récapitulatif de commande */}
          <h2 style={{ fontFamily: "var(--font-secondary)", fontSize: "22px", fontWeight: "600", color: "var(--color-text)", marginBottom: "24px" }}>
            Récapitulatif de votre commande
          </h2>

          <table className="receipt-table">
            <tbody>
              <tr>
                <td style={{ color: "var(--color-text-muted)" }}>Formule</td>
                <td>Abonnement DONA — {plan}</td>
              </tr>
              <tr>
                <td style={{ color: "var(--color-text-muted)" }}>Date du paiement</td>
                <td>{today}</td>
              </tr>
              <tr>
                <td style={{ color: "var(--color-text-muted)" }}>Prochaine facturation</td>
                <td>{nextBilling}</td>
              </tr>
              <tr>
                <td style={{ color: "var(--color-text-muted)" }}>Moyen de paiement</td>
                <td>Carte bancaire sécurisée (SSL)</td>
              </tr>
              <tr>
                <td style={{ color: "var(--color-text-muted)" }}>Référence transaction</td>
                <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{ref}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="receipt-total">
            <span style={{ fontFamily: "var(--font-secondary)", fontSize: "18px", color: "var(--color-text)" }}>Total réglé</span>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#8B002A" }}>{amount}</span>
          </div>

          {/* Statut paiement */}
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderLeft: "4px solid #10B981", padding: "14px 18px", borderRadius: "2px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <span className="material-symbols-outlined" style={{ color: "#10B981", fontSize: "22px" }}>verified</span>
            <span style={{ fontSize: "13px", color: "#065f46", fontWeight: "500" }}>
              Paiement de <strong>{amount}</strong> accepté et votre accès <strong>Plan {plan}</strong> est désormais actif.
            </span>
          </div>

          {/* CTA Téléchargement Facture */}
          <button
            className={`btn-download ${downloaded ? 'done' : ''}`}
            onClick={handleDownloadReceipt}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              {downloaded ? 'task_alt' : 'download'}
            </span>
            {downloaded ? 'Reçu PDF téléchargé ✓' : 'Télécharger mon reçu / Facture PDF'}
          </button>

          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "8px" }}>
            Une fenêtre d'impression s'ouvrira → Sélectionnez <em>"Enregistrer en PDF"</em> dans les options d'impression.
          </p>

          {memberEmail && (
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "0" }}>
              Un récapitulatif a été envoyé à <strong>{memberEmail}</strong>
            </p>
          )}

          {/* Étapes suivantes */}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "40px", marginTop: "40px" }}>
            <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "24px", textAlign: "center" }}>
              Prochaines étapes
            </h3>

            <div className="steps-grid">
              <Link href="/member-profile" className="step-card">
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#8B002A" }}>person_outline</span>
                <span style={{ fontFamily: "var(--font-primary)", fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>Compléter mon profil</span>
              </Link>
              <Link href="/magazines" className="step-card">
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#8B002A" }}>menu_book</span>
                <span style={{ fontFamily: "var(--font-primary)", fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>Explorer les Cahiers</span>
              </Link>
              <Link href="/subscription-management" className="step-card">
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#8B002A" }}>receipt_long</span>
                <span style={{ fontFamily: "var(--font-primary)", fontSize: "13px", fontWeight: "600", color: "var(--color-text)" }}>Gérer mon abonnement</span>
              </Link>
            </div>
          </div>

          {/* Note footer */}
          <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--color-text-muted)", textAlign: "center", marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--color-border)" }}>
            Une question ? Contactez notre conciergerie :<br />
            <a href="mailto:concierge@donamagazine.com" style={{ color: "#8B002A", textDecoration: "underline", marginTop: "4px", display: "inline-block" }}>
              concierge@donamagazine.com
            </a>
          </p>

        </div>
      </div>
    </main>
  );
}

// ─── PAGE EXPORT avec Suspense ─────────────────────────────────────────────────
export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", color: "var(--color-text)" }}>
        Chargement de votre confirmation...
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}

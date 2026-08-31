/**
 * DONA MAGAZINE — Générateur de Facture PDF (client-side, natif, sans dépendance externe)
 * Utilise window.print() via une iframe cachée avec CSS @media print,
 * ce qui produit un vrai PDF téléchargeable via "Enregistrer en PDF" du navigateur.
 */

export function generateInvoicePDF({ invoiceId, date, amount, plan, memberName, memberEmail, paymentMethod = 'VISA •••• 4242', siren = '123 456 789' } = {}) {
  const now = new Date();
  const formattedDate = date || now.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const inv = invoiceId || `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const montant = amount || '29.00€';
  const htAmount = amount ? (parseFloat(amount.replace('€', '')) / 1.2).toFixed(2) + '€' : '24.17€';
  const tvaAmount = amount ? (parseFloat(amount.replace('€', '')) - parseFloat(amount.replace('€', '')) / 1.2).toFixed(2) + '€' : '4.83€';
  const planName = plan || 'Premium';
  const name = memberName || 'Membre DONA';
  const email = memberEmail || '';

  const nextBilling = new Date(now);
  nextBilling.setMonth(nextBilling.getMonth() + 1);
  const nextBillingStr = nextBilling.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Facture DONA – ${inv}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 13px;
      color: #111;
      background: #fff;
      padding: 48px;
      max-width: 760px;
      margin: 0 auto;
    }

    /* ─── HEADER ─── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 32px;
      border-bottom: 3px solid #8B002A;
      margin-bottom: 40px;
    }
    .brand-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 36px;
      font-weight: 700;
      color: #8B002A;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #666;
      margin-top: 4px;
    }
    .invoice-meta {
      text-align: right;
      font-size: 12px;
      color: #444;
      line-height: 1.8;
    }
    .invoice-meta strong {
      color: #8B002A;
      font-size: 22px;
      display: block;
      font-family: 'Cormorant Garamond', Georgia, serif;
      margin-bottom: 4px;
    }

    /* ─── PARTIES ─── */
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .party-block h4 {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #eee;
    }
    .party-block p {
      line-height: 1.7;
      color: #333;
      font-size: 13px;
    }
    .party-block .company {
      font-weight: 700;
      color: #111;
      font-size: 14px;
    }

    /* ─── TABLE ─── */
    .table-section {
      margin-bottom: 32px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    thead tr {
      background: #8B002A;
      color: #fff;
    }
    thead th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    thead th:last-child { text-align: right; }
    tbody tr {
      border-bottom: 1px solid #f0f0f0;
    }
    tbody tr:nth-child(even) { background: #fafafa; }
    tbody td {
      padding: 14px 16px;
      color: #333;
      vertical-align: top;
    }
    tbody td:last-child { text-align: right; font-weight: 600; }
    .desc-main { font-weight: 600; color: #111; margin-bottom: 3px; }
    .desc-sub { font-size: 11px; color: #888; }

    /* ─── TOTAUX ─── */
    .totaux {
      margin-left: auto;
      width: 280px;
      margin-bottom: 40px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
      color: #555;
      border-bottom: 1px solid #f0f0f0;
    }
    .total-row:last-child {
      border-bottom: none;
      font-weight: 700;
      font-size: 16px;
      color: #111;
      padding-top: 12px;
    }
    .total-row:last-child span:last-child {
      color: #8B002A;
    }

    /* ─── STATUT PAIEMENT ─── */
    .status-block {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #22c55e;
      padding: 16px 20px;
      border-radius: 4px;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .status-badge {
      background: #22c55e;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 2px;
    }
    .status-text { font-size: 13px; color: #166534; }
    .status-text strong { font-weight: 700; }

    /* ─── FOOTER ─── */
    .footer {
      padding-top: 24px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 11px;
      color: #999;
      line-height: 1.7;
    }
    .footer strong { color: #555; }

    /* ─── WATERMARK ─── */
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-family: 'Cormorant Garamond', serif;
      font-size: 80px;
      font-weight: 700;
      color: rgba(139, 0, 42, 0.04);
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
      letter-spacing: 0.1em;
    }

    @media print {
      body { padding: 32px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

<div class="watermark">DONA MAGAZINE</div>

<!-- HEADER -->
<div class="header">
  <div>
    <div class="brand-name">DONA</div>
    <div class="brand-sub">Magazine · Le Cercle d'Excellence</div>
  </div>
  <div class="invoice-meta">
    <strong>FACTURE</strong>
    N° ${inv}<br/>
    Émise le : ${formattedDate}<br/>
    Échéance : À réception
  </div>
</div>

<!-- PARTIES -->
<div class="parties">
  <div class="party-block">
    <h4>Émetteur</h4>
    <p>
      <span class="company">DONA MAGAZINE S.A.S.</span><br/>
      12, Rue de la Presse<br/>
      75001 Paris, France<br/>
      SIREN : ${siren}<br/>
      TVA Intracommunautaire : FR12${siren.replace(/ /g, '')}<br/>
      concierge@donamagazine.com
    </p>
  </div>
  <div class="party-block">
    <h4>Facturé à</h4>
    <p>
      <span class="company">${name}</span><br/>
      ${email ? `${email}<br/>` : ''}
      Membre DONA — Plan <strong>${planName}</strong>
    </p>
  </div>
</div>

<!-- TABLE PRESTATIONS -->
<div class="table-section">
  <table>
    <thead>
      <tr>
        <th>Prestation</th>
        <th>Période</th>
        <th>Qté</th>
        <th>P.U. HT</th>
        <th>Total TTC</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="desc-main">Abonnement DONA — Formule ${planName}</div>
          <div class="desc-sub">Accès aux 16 Cahiers Thématiques · Replays Audio & Masterclasses · Archives & Workbooks PDF</div>
        </td>
        <td>${formattedDate}<br/><span style="font-size:11px;color:#888">→ ${nextBillingStr}</span></td>
        <td>1</td>
        <td>${htAmount}</td>
        <td>${montant}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TOTAUX -->
<div class="totaux">
  <div class="total-row">
    <span>Sous-total HT</span>
    <span>${htAmount}</span>
  </div>
  <div class="total-row">
    <span>TVA 20%</span>
    <span>${tvaAmount}</span>
  </div>
  <div class="total-row">
    <span>TOTAL TTC</span>
    <span>${montant}</span>
  </div>
</div>

<!-- STATUT PAIEMENT -->
<div class="status-block">
  <span class="status-badge">✓ Payé</span>
  <span class="status-text">
    Paiement de <strong>${montant}</strong> réglé le ${formattedDate} par <strong>${paymentMethod}</strong>. Merci !
  </span>
</div>

<!-- FOOTER -->
<div class="footer">
  <strong>DONA MAGAZINE S.A.S.</strong> — 12, Rue de la Presse, 75001 Paris, France<br/>
  SIREN ${siren} · RCS Paris B ${siren} · TVA FR12${siren.replace(/ /g, '')}<br/>
  Facture émise électroniquement et valable sans signature conformément à l'article 289 du CGI français.<br/>
  <em>Conservez ce document à titre de justificatif comptable.</em>
</div>

<script>
  window.onload = function() { window.print(); }
</script>
</body>
</html>`;

  // Ouvrir dans une nouvelle fenêtre → print dialog → "Enregistrer en PDF"
  const printWindow = window.open('', '_blank', 'width=820,height=1100,menubar=no,toolbar=no');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // Fallback : télécharger en HTML si popup bloqué
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DONA_Facture_${inv}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return inv;
}

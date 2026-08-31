"use client";

import React, { useState } from 'react';

export default function Page() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'redaction',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusAlert, setStatusAlert] = useState(null); // { type: 'success' | 'error', text: string, refId?: string }

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusAlert(null);

    if (!form.firstName || !form.email || !form.message) {
      setStatusAlert({ type: 'error', text: 'Veuillez remplir votre prénom, adresse email et votre message.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusAlert({ type: 'error', text: data.error || 'Erreur lors de l\'envoi du message.' });
        setLoading(false);
        return;
      }

      setStatusAlert({
        type: 'success',
        text: 'Votre message a été transmis et enregistré avec succès auprès de la rédaction DONA.',
        refId: data.contact?.id
      });
      setForm({ firstName: '', lastName: '', email: '', subject: 'redaction', message: '' });

    } catch (err) {
      console.error('[contact] Erreur réseau:', err);
      setStatusAlert({ type: 'error', text: 'Erreur de connexion au serveur. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        :root, [data-theme="light"] {
            --page-bg: #fff;
            --page-input-bg: #f5f3f3;
            --page-card-border: #ede8e4;
            --page-text: #1c1b1b;
            --page-text-muted: #555;
            --page-text-light: #aaa;
            --page-info-label: #888;
        }
        [data-theme="dark"] {
            --page-bg: var(--color-bg);
            --page-input-bg: #151515;
            --page-card-border: var(--color-border);
            --page-text: var(--color-text);
            --page-text-muted: var(--color-text-muted);
            --page-text-light: rgba(255, 255, 255, 0.4);
            --page-info-label: rgba(255, 255, 255, 0.5);
        }
        input:focus, textarea:focus, select:focus {
            outline: 1px solid var(--color-accent) !important;
            background: var(--page-bg) !important;
        }
    ` }} />

    {/* Page Header */}
    <section style={{padding: "100px 60px 32px", maxWidth: "1200px", margin: "0 auto"}}>
        <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "500", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B002A", marginBottom: "12px"}}>Entrer en contact avec <strong>DONA</strong></p>
        <p style={{fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--page-text-muted)", maxWidth: "520px", lineHeight: "1.7"}}>Nous sommes à votre disposition pour toute demande de renseignement, de partenariat ou d'assistance. Notre équipe dédiée vous répondra dans les plus brefs délais.</p>
    </section>

    {/* Two-Column Layout */}
    <section style={{padding: "0 60px 60px", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start"}}>

        {/* LEFT: Form Card */}
        <div style={{background: "var(--page-bg)", border: "1px solid #e8e4e4", borderRadius: "4px", padding: "48px"}}>
            <h2 style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--page-text)", margin: "0 0 36px 0"}}>Envoyez-nous un message</h2>

            {statusAlert && (
              <div style={{
                padding: "16px 20px",
                borderRadius: "4px",
                marginBottom: "28px",
                background: statusAlert.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: statusAlert.type === 'success' ? '1px solid #10B981' : '1px solid #EF4444',
                color: statusAlert.type === 'success' ? '#065F46' : '#991B1B',
                fontSize: "14px",
                lineHeight: "1.6"
              }}>
                <strong>{statusAlert.type === 'success' ? '✓ Message transmis' : '⚠ Erreur d\'envoi'}</strong><br />
                {statusAlert.text}
                {statusAlert.refId && (
                  <div style={{ marginTop: "6px", fontSize: "12px", fontFamily: "monospace" }}>
                    Référence dossier : <strong>{statusAlert.refId}</strong>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "24px"}}>

                {/* Row 1: Prénom & Nom */}
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                    <div>
                        <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>PRÉNOM *</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} 
                          placeholder="Ex. Alessandra" 
                        />
                    </div>
                    <div>
                        <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>NOM</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} 
                          placeholder="Ex. Rossi" 
                        />
                    </div>
                </div>

                {/* Row 2: Email */}
                <div>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>ADRESSE EMAIL *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} 
                      placeholder="votre@email.com" 
                    />
                </div>

                {/* Row 3: Sujet dropdown */}
                <div style={{position: "relative"}}>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>SUJET</label>
                    <select 
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box", appearance: "none", cursor: "pointer"}}
                    >
                        <option value="redaction">Contacter la rédaction</option>
                        <option value="partenariat">Demande de partenariat</option>
                        <option value="support">Support technique</option>
                        <option value="autre">Autre demande</option>
                    </select>
                    <span style={{position: "absolute", right: "16px", bottom: "14px", fontSize: "18px", color: "var(--page-info-label)", pointerEvents: "none"}}>&#8964;</span>
                </div>

                {/* Row 4: Message */}
                <div>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>MESSAGE *</label>
                    <textarea 
                      rows="6" 
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box", resize: "none"}} 
                      placeholder="Saisissez votre message..."
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      style={{background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "2px", padding: "16px 32px", fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s"}}
                    >
                      {loading ? "TRANSMISSION..." : "ENVOYER LE MESSAGE"}
                    </button>
                </div>

            </form>
        </div>

        {/* RIGHT: Info Column */}
        <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>

            {/* Coordonnées Card */}
            <div style={{background: "var(--page-bg)", border: "1px solid #e8e4e4", borderRadius: "4px", padding: "36px"}}>
                <h3 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "18px", fontStyle: "italic", color: "var(--page-text)", margin: "0 0 28px 0"}}>Nos Coordonnées</h3>

                <ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "20px"}}>
                    <li style={{display: "flex", alignItems: "flex-start", gap: "14px"}}>
                        <span style={{color: "#8B002A", fontSize: "18px", marginTop: "2px", flexShrink: "0"}}>&#9679;</span>
                        <div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "4px"}}>ADRESSE</div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", lineHeight: "1.6"}}>15 Rue de la Paix<br />75002 Paris, France</div>
                        </div>
                    </li>
                    <li style={{display: "flex", alignItems: "flex-start", gap: "14px"}}>
                        <span style={{color: "#8B002A", fontSize: "18px", marginTop: "2px", flexShrink: "0"}}>&#9993;</span>
                        <div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "4px"}}>EMAIL</div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)"}}><a href="mailto:contact@dona-editorial.com" style={{color: "inherit", textDecoration: "none"}}>contact@dona-editorial.com</a></div>
                        </div>
                    </li>
                    <li style={{display: "flex", alignItems: "flex-start", gap: "14px"}}>
                        <span style={{color: "#8B002A", fontSize: "18px", marginTop: "2px", flexShrink: "0"}}>&#9990;</span>
                        <div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "4px"}}>TÉLÉPHONE</div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)"}}><a href="tel:+33123456789" style={{color: "inherit", textDecoration: "none"}}>+33 (0)1 23 45 67 89</a></div>
                        </div>
                    </li>
                    <li style={{display: "flex", alignItems: "flex-start", gap: "14px"}}>
                        <span style={{color: "#8B002A", fontSize: "18px", marginTop: "2px", flexShrink: "0"}}>&#9202;</span>
                        <div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "4px"}}>HEURES D'OUVERTURE</div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", lineHeight: "1.6"}}>Du Lundi au Vendredi<br />9h00 - 18h00 CET</div>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Reassurance Mini Card */}
            <div style={{background: "var(--page-bg)", border: "1px solid #e8e4e4", borderRadius: "4px", padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", textAlign: "center"}}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderRight: "1px solid #e8e4e4", paddingRight: "16px"}}>
                    <span className="material-symbols-outlined" style={{color: "#8B002A", fontSize: "26px"}}>schedule_send</span>
                    <span style={{fontFamily: "'Inter',sans-serif", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--page-info-label)", lineHeight: "1.4"}}>RÉPONSE<br />SOUS 48H</span>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderRight: "1px solid #e8e4e4", paddingRight: "16px"}}>
                    <span className="material-symbols-outlined" style={{color: "#8B002A", fontSize: "26px"}}>verified_user</span>
                    <span style={{fontFamily: "'Inter',sans-serif", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--page-info-label)", lineHeight: "1.4"}}>DONNÉES<br />PROTÉGÉES RGPD</span>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "8px"}}>
                    <span className="material-symbols-outlined" style={{color: "#8B002A", fontSize: "26px"}}>support_agent</span>
                    <span style={{fontFamily: "'Inter',sans-serif", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--page-info-label)", lineHeight: "1.4"}}>ÉQUIPE<br />DÉDIÉE</span>
                </div>
            </div>

        </div>
    </section>
    </main>
  );
}

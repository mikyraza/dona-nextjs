import React from 'react';
import Link from 'next/link';

export default function Page() {
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
        /* Custom input focus states */
        input:focus, textarea:focus {
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

            <form style={{display: "flex", flexDirection: "column", gap: "24px"}}>

                {/* Row 1: Prénom & Nom */}
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                    <div>
                        <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>PRÉNOM</label>
                        <input type="text" style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} placeholder="" />
                    </div>
                    <div>
                        <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>NOM</label>
                        <input type="text" style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} placeholder="" />
                    </div>
                </div>

                {/* Row 2: Email */}
                <div>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>ADRESSE EMAIL</label>
                    <input type="email" style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} placeholder="" />
                </div>

                {/* Row 3: Sujet dropdown */}
                <div style={{position: "relative"}}>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>SUJET</label>
                    <select style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box", appearance: "none", cursor: "pointer"}}>
                        <option value="" disabled selected>Sélectionnez un sujet</option>
                        <option value="redaction">Contacter la rédaction</option>
                        <option value="partenariat">Demande de partenariat</option>
                        <option value="support">Support technique</option>
                        <option value="autre">Autre demande</option>
                    </select>
                    <span style={{position: "absolute", right: "16px", bottom: "14px", fontSize: "18px", color: "var(--page-info-label)", pointerEvents: "none"}}>&#8964;</span>
                </div>

                {/* Row 4: Message */}
                <div>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>MESSAGE</label>
                    <textarea rows="6" style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box", resize: "none"}} placeholder=""></textarea>
                </div>

                {/* Submit Button */}
                <div>
                    <button type="submit" style={{background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "2px", padding: "16px 32px", fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s"}}>ENVOYER LE MESSAGE</button>
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

"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function ContactPage() {
  const { t, currentLangObj } = useLanguage();
  const isRTL = currentLangObj?.dir === 'rtl';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'redaction',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusAlert, setStatusAlert] = useState(null); // { type: 'success' | 'error', title: string, text: string, refId?: string }

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
      setStatusAlert({ 
        type: 'error', 
        title: t('contact_error_title'),
        text: t('contact_error_required')
      });
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
        setStatusAlert({ 
          type: 'error', 
          title: t('contact_error_title'),
          text: data.error || t('contact_error_server')
        });
        setLoading(false);
        return;
      }

      setStatusAlert({
        type: 'success',
        title: t('contact_success_title'),
        text: t('contact_success_desc'),
        refId: data.contact?.id
      });
      setForm({ firstName: '', lastName: '', email: '', subject: 'redaction', message: '' });

    } catch (err) {
      console.error('[contact] Erreur réseau:', err);
      setStatusAlert({ 
        type: 'error', 
        title: t('contact_error_title'),
        text: t('contact_error_server')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ direction: currentLangObj?.dir || 'ltr' }}>
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

    {/* Breadcrumbs */}
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 60px 0" }}>
      <Breadcrumbs 
        items={[
          { label: t('footer_contact') || "Contact", isCurrent: true }
        ]}
      />
    </div>

    {/* Page Header */}
    <section style={{padding: "40px 60px 32px", maxWidth: "1200px", margin: "0 auto"}}>
        <p style={{fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: "500", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B002A", marginBottom: "12px"}}>
          {t('contact_overline_pre')} <strong>DONA</strong>
        </p>
        <p style={{fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--page-text-muted)", maxWidth: "520px", lineHeight: "1.7"}}>
          {t('contact_intro')}
        </p>
    </section>

    {/* Two-Column Layout */}
    <section style={{padding: "0 60px 60px", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start"}}>

        {/* LEFT: Form Card */}
        <div style={{background: "var(--page-bg)", border: "1px solid var(--page-card-border)", borderRadius: "4px", padding: "48px"}}>
            <h2 style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: "600", letterSpacing: "0.05em", color: "var(--page-text)", margin: "0 0 36px 0"}}>
              {t('contact_form_title')}
            </h2>

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
                <strong>{statusAlert.title}</strong><br />
                {statusAlert.text}
                {statusAlert.refId && (
                  <div style={{ marginTop: "6px", fontSize: "12px", fontFamily: "monospace" }}>
                    {t('contact_ref_label')} <strong>{statusAlert.refId}</strong>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "24px"}}>

                {/* Row 1: Prénom & Nom */}
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                    <div>
                        <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>
                          {t('contact_first_name')}
                        </label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} 
                          placeholder={t('contact_placeholder_fn')} 
                        />
                    </div>
                    <div>
                        <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>
                          {t('contact_last_name')}
                        </label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} 
                          placeholder={t('contact_placeholder_ln')} 
                        />
                    </div>
                </div>

                {/* Row 2: Email */}
                <div>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>
                      {t('contact_email')}
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box"}} 
                      placeholder={t('contact_placeholder_email')} 
                    />
                </div>

                {/* Row 3: Sujet dropdown */}
                <div style={{position: "relative"}}>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>
                      {t('contact_subject')}
                    </label>
                    <select 
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box", appearance: "none", cursor: "pointer"}}
                    >
                        <option value="redaction">{t('contact_subj_redaction')}</option>
                        <option value="partenariat">{t('contact_subj_partnership')}</option>
                        <option value="support">{t('contact_subj_support')}</option>
                        <option value="autre">{t('contact_subj_other')}</option>
                    </select>
                    <span style={{position: "absolute", right: isRTL ? 'auto' : '16px', left: isRTL ? '16px' : 'auto', bottom: "14px", fontSize: "18px", color: "var(--page-info-label)", pointerEvents: "none"}}>&#8964;</span>
                </div>

                {/* Row 4: Message */}
                <div>
                    <label style={{display: "block", fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "8px"}}>
                      {t('contact_message')}
                    </label>
                    <textarea 
                      rows="6" 
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      style={{width: "100%", background: "var(--page-input-bg)", border: "none", borderRadius: "2px", padding: "14px 16px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", outline: "none", boxSizing: "border-box", resize: "none"}} 
                      placeholder={t('contact_placeholder_msg')}
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      style={{background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "2px", padding: "16px 32px", fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s"}}
                    >
                      {loading ? t('contact_btn_sending') : t('contact_btn_send')}
                    </button>
                </div>

            </form>
        </div>

        {/* RIGHT: Info Column */}
        <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>

            {/* Coordonnées Card */}
            <div style={{background: "var(--page-bg)", border: "1px solid var(--page-card-border)", borderRadius: "4px", padding: "36px"}}>
                <h3 style={{fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: "18px", fontStyle: "italic", color: "var(--page-text)", margin: "0 0 28px 0"}}>
                  {t('contact_info_title')}
                </h3>

                <ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "20px"}}>
                    <li style={{display: "flex", alignItems: "flex-start", gap: "14px"}}>
                        <span style={{color: "#8B002A", fontSize: "18px", marginTop: "2px", flexShrink: "0"}}>&#9679;</span>
                        <div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "4px"}}>
                              {t('contact_address_label')}
                            </div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", lineHeight: "1.6"}}>15 Rue de la Paix<br />75002 Paris, France</div>
                        </div>
                    </li>
                    <li style={{display: "flex", alignItems: "flex-start", gap: "14px"}}>
                        <span style={{color: "#8B002A", fontSize: "18px", marginTop: "2px", flexShrink: "0"}}>&#9993;</span>
                        <div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "4px"}}>
                              {t('contact_email_label')}
                            </div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)"}}><a href="mailto:contact@dona-editorial.com" style={{color: "inherit", textDecoration: "none"}}>contact@dona-editorial.com</a></div>
                        </div>
                    </li>
                    <li style={{display: "flex", alignItems: "flex-start", gap: "14px"}}>
                        <span style={{color: "#8B002A", fontSize: "18px", marginTop: "2px", flexShrink: "0"}}>&#9990;</span>
                        <div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "4px"}}>
                              {t('contact_phone_label')}
                            </div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)"}}><a href="tel:+33123456789" style={{color: "inherit", textDecoration: "none"}}>+33 (0)1 23 45 67 89</a></div>
                        </div>
                    </li>
                    <li style={{display: "flex", alignItems: "flex-start", gap: "14px"}}>
                        <span style={{color: "#8B002A", fontSize: "18px", marginTop: "2px", flexShrink: "0"}}>&#9202;</span>
                        <div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--page-info-label)", marginBottom: "4px"}}>
                              {t('contact_hours_label')}
                            </div>
                            <div style={{fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "var(--page-text)", lineHeight: "1.6"}}>
                              {t('contact_hours_value')}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Reassurance Mini Card */}
            <div style={{background: "var(--page-bg)", border: "1px solid var(--page-card-border)", borderRadius: "4px", padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", textAlign: "center"}}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderRight: isRTL ? 'none' : '1px solid var(--page-card-border)', borderLeft: isRTL ? '1px solid var(--page-card-border)' : 'none', paddingRight: isRTL ? '0' : '16px', paddingLeft: isRTL ? '16px' : '0'}}>
                    <span className="material-symbols-outlined" style={{color: "#8B002A", fontSize: "26px"}}>schedule_send</span>
                    <span style={{fontFamily: "'Inter',sans-serif", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--page-info-label)", lineHeight: "1.4"}}>
                      {t('contact_badge_reply')}
                    </span>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderRight: isRTL ? 'none' : '1px solid var(--page-card-border)', borderLeft: isRTL ? '1px solid var(--page-card-border)' : 'none', paddingRight: isRTL ? '0' : '16px', paddingLeft: isRTL ? '16px' : '0'}}>
                    <span className="material-symbols-outlined" style={{color: "#8B002A", fontSize: "26px"}}>verified_user</span>
                    <span style={{fontFamily: "'Inter',sans-serif", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--page-info-label)", lineHeight: "1.4"}}>
                      {t('contact_badge_gdpr')}
                    </span>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "8px"}}>
                    <span className="material-symbols-outlined" style={{color: "#8B002A", fontSize: "26px"}}>support_agent</span>
                    <span style={{fontFamily: "'Inter',sans-serif", fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--page-info-label)", lineHeight: "1.4"}}>
                      {t('contact_badge_team')}
                    </span>
                </div>
            </div>

        </div>
    </section>
    </main>
  );
}

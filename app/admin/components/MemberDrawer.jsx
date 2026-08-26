"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function MemberDrawer({ isOpen, onClose, onSave, member = null }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('Essentiel');
  const [status, setStatus] = useState('Active');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setEmail(member.email || '');
      setPhone(member.phone || '');
      setAvatar(member.avatar || null);
      setPassword('');
      setPlan(member.plan || 'Essentiel');
      setStatus(member.status || 'Active');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAvatar(null);
      setPassword('');
      setPlan('Essentiel');
      setStatus('Active');
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setAvatar(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      id: member?.id || `mem-${Date.now()}`,
      name,
      email,
      phone,
      avatar,
      plan,
      status,
      joined: member?.joined || new Date().toLocaleDateString('fr-FR'),
      password: password || undefined
    });

    onClose();
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'M';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
        <div className="drawer-header">
          <h2>{member ? 'Modifier le Membre' : 'Ajouter un Membre'}</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          {/* Avatar Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--admin-border-color)' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--admin-bg-alt, #F4F3F0)',
                border: '2px solid var(--admin-accent-color, #A30626)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                position: 'relative'
              }}
              title="Changer la photo de profil"
            >
              {avatar ? (
                <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontFamily: 'var(--font-secondary, serif)', fontSize: '20px', fontWeight: '700', color: 'var(--admin-accent-color, #A30626)' }}>
                  {getInitials(name)}
                </span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ background: 'none', border: '1px solid var(--admin-border-color)', borderRadius: '2px', padding: '6px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', color: 'var(--admin-text-main)' }}
              >
                {avatar ? 'Changer la photo' : 'Ajouter une photo'}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
              <span style={{ display: 'block', fontSize: '11px', color: '#888888', marginTop: '4px' }}>
                PNG, JPG ou WEBP (max 5 Mo)
              </span>
            </div>
          </div>

          <div className="drawer-input-group">
            <label htmlFor="member-name">Nom Complet</label>
            <input
              id="member-name"
              type="text"
              required
              className="drawer-text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ernest Dupont..."
            />
          </div>

          <div className="drawer-input-group">
            <label htmlFor="member-email">Email</label>
            <input
              id="member-email"
              type="email"
              required
              className="drawer-text-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: ernest@example.com..."
            />
          </div>

          <div className="drawer-input-group">
            <label htmlFor="member-phone">Téléphone</label>
            <input
              id="member-phone"
              type="tel"
              className="drawer-text-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: +33 6 12 34 56 78..."
            />
          </div>

          {!member && (
            <div className="drawer-input-group">
              <label htmlFor="member-password">Mot de passe (Initial)</label>
              <input
                id="member-password"
                type="password"
                required
                className="drawer-text-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe temporaire..."
              />
            </div>
          )}

          <div className="drawer-input-group">
            <label htmlFor="member-plan">Offre d'Abonnement</label>
            <div className="select-wrapper">
              <select
                id="member-plan"
                className="drawer-select"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              >
                <option value="Essentiel">Essentiel (Gratuit)</option>
                <option value="Premium">Premium (23€/m)</option>
                <option value="Élite">Élite (63€/m)</option>
              </select>
            </div>
          </div>

          <div className="drawer-input-group">
            <label htmlFor="member-status">Statut de l'Accès</label>
            <div className="select-wrapper">
              <select
                id="member-status"
                className="drawer-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active (Accès autorisé)</option>
                <option value="Inactive">Inactive (Accès révoqué)</option>
              </select>
            </div>
          </div>

          <div className="drawer-actions" style={{ marginTop: '30px' }}>
            <button type="button" className="btn-drawer secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-drawer primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

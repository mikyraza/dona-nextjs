"use client";

import React, { useState, useEffect } from 'react';

export default function MemberDrawer({ isOpen, onClose, onSave, member = null }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('Essentiel');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setEmail(member.email || '');
      setPassword(''); // Don't pre-populate password for edits
      setPlan(member.plan || 'Essentiel');
      setStatus(member.status || 'Active');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setPlan('Essentiel');
      setStatus('Active');
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      id: member?.id || `mem-${Date.now()}`,
      name,
      email,
      plan,
      status,
      joined: member?.joined || new Date().toLocaleDateString('fr-FR'),
      // password is only used/logged locally on creation
      password: password || undefined
    });

    onClose();
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
          <div className="drawer-input-group">
            <label htmlFor="member-name">Nom Complet</label>
            <input
              id="member-name"
              type="text"
              required
              className="drawer-text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Elena Moretti..."
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
              placeholder="Ex: elena@donamagazine.com..."
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

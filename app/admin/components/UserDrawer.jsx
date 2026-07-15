"use client";

import React, { useState, useEffect } from 'react';

export default function UserDrawer({ isOpen, onClose, onSave, user = null }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Journaliste');
  const [status, setStatus] = useState('Actif');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPassword(''); // Don't pre-populate password for edits
      setRole(user.role || 'Journaliste');
      setStatus(user.status || 'Actif');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('Journaliste');
      setStatus('Actif');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      id: user?.id || `user-${Date.now()}`,
      name,
      email,
      role,
      status,
      lastLogin: user?.lastLogin || 'Jamais connecté',
      password: password || undefined
    });

    onClose();
  };

  const getPermissionsSummary = () => {
    switch (role) {
      case 'Super-Admin':
        return "Le Super-Admin possède un accès total et illimité à l'ensemble du système, aux configurations de marque, de sécurité et aux bases de données.";
      case 'Éditeur':
        return "L'Éditeur peut publier, modifier et structurer les articles, vidéos, podcasts et dossiers d'enquête.";
      case 'Journaliste':
        return "Le Journaliste peut uniquement rédiger, modifier et soumettre ses propres articles et uploader des fichiers médias associés.";
      case 'Traducteur':
        return "Le Traducteur peut uniquement modifier les traductions de l'interface et gérer le dictionnaire multilingue.";
      default:
        return "Aucune permission définie pour ce rôle.";
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
        <div className="drawer-header">
          <h2>{user ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur'}</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          <div className="drawer-input-group">
            <label htmlFor="user-name">Nom Complet</label>
            <input
              id="user-name"
              type="text"
              required
              className="drawer-text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Elena Moretti..."
            />
          </div>

          <div className="drawer-input-group">
            <label htmlFor="user-email">Email Professionnel</label>
            <input
              id="user-email"
              type="email"
              required
              className="drawer-text-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: elena@donamagazine.com..."
            />
          </div>

          <div className="drawer-input-group">
            <label htmlFor="user-password">{user ? 'Nouveau mot de passe (Optionnel)' : 'Mot de passe temporaire'}</label>
            <input
              id="user-password"
              type="password"
              required={!user}
              className="drawer-text-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={user ? "Laisser vide pour ne pas modifier" : "Saisir un mot de passe initial..."}
            />
          </div>

          <div className="drawer-input-group">
            <label htmlFor="user-role">Rôle de Sécurité</label>
            <div className="select-wrapper">
              <select
                id="user-role"
                className="drawer-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Super-Admin">Super-Admin</option>
                <option value="Éditeur">Éditeur / Édimestre</option>
                <option value="Journaliste">Journaliste</option>
                <option value="Traducteur">Traducteur</option>
              </select>
            </div>
          </div>

          <div className="drawer-input-group">
            <label htmlFor="user-status">Statut de l'Accès</label>
            <div className="select-wrapper">
              <select
                id="user-status"
                className="drawer-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Actif">Actif (Accès autorisé)</option>
                <option value="Suspendu">Suspendu (Accès immédiatement révoqué)</option>
              </select>
            </div>
          </div>

          {/* Permissions Overview Block */}
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#FAF9F6',
            border: '1px solid var(--admin-border-color)',
            borderRadius: '2px'
          }}>
            <h4 style={{ 
              margin: '0 0 8px', 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              color: 'var(--admin-text-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--admin-accent-color)' }}>shield</span>
              Aperçu des Permissions
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)', lineHeight: '1.5' }}>
              {getPermissionsSummary()}
            </p>
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

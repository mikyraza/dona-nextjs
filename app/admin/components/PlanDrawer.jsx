"use client";

import React, { useState, useEffect } from 'react';

export default function PlanDrawer({ isOpen, onClose, onSave, plan = null }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('€');
  const [interval, setIntervalVal] = useState('mois');
  const [features, setFeatures] = useState([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  useEffect(() => {
    if (plan) {
      setName(plan.name || '');
      setPrice(plan.price || 0);
      setCurrency(plan.currency || '€');
      setIntervalVal(plan.interval || 'mois');
      setFeatures(plan.features ? [...plan.features] : []);
      setNewFeatureText('');
    } else {
      setName('');
      setPrice(0);
      setCurrency('€');
      setIntervalVal('mois');
      setFeatures([]);
      setNewFeatureText('');
    }
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (newFeatureText.trim()) {
      setFeatures(prev => [...prev, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: plan?.id || `plan-${Date.now()}`,
      name,
      price: parseFloat(price) || 0,
      currency,
      interval,
      features
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
        <div className="drawer-header">
          <h2>Modifier le tarif de l'offre</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          <div className="drawer-input-group">
            <label htmlFor="plan-name">Nom de l'offre</label>
            <input
              id="plan-name"
              type="text"
              required
              className="drawer-text-input title-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Club DONA Mensuel..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
            <div className="drawer-input-group">
              <label htmlFor="plan-price">Tarif</label>
              <input
                id="plan-price"
                type="number"
                step="0.01"
                required
                className="drawer-text-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="drawer-input-group">
              <label htmlFor="plan-currency">Devise</label>
              <div className="select-wrapper">
                <select
                  id="plan-currency"
                  className="drawer-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="€">EUR (€)</option>
                  <option value="$">USD ($)</option>
                  <option value="£">GBP (£)</option>
                  <option value="FCFA">XAF (FCFA)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="drawer-input-group">
            <label htmlFor="plan-interval">Fréquence de facturation</label>
            <div className="select-wrapper">
              <select
                id="plan-interval"
                className="drawer-select"
                value={interval}
                onChange={(e) => setIntervalVal(e.target.value)}
              >
                <option value="mois">Mensuel</option>
                <option value="6 mois">Semestriel</option>
                <option value="an">Annuel</option>
              </select>
            </div>
          </div>

          <div className="drawer-input-group">
            <label>Avantages inclus (Features)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                className="drawer-text-input"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="Ajouter un avantage..."
                style={{ flexGrow: 1 }}
              />
              <button 
                type="button" 
                className="btn-drawer primary" 
                onClick={handleAddFeature}
                style={{ padding: '8px 16px', minWidth: 'auto', marginTop: 0 }}
              >
                Ajouter
              </button>
            </div>

            <ul style={{ 
              listStyleType: 'none', 
              padding: 0, 
              margin: 0,
              border: '1px solid var(--admin-border-color)',
              backgroundColor: '#FAF9F6',
              borderRadius: '2px',
              maxHeight: '180px',
              overflowY: 'auto'
            }}>
              {features.map((feat, index) => (
                <li key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderBottom: index === features.length - 1 ? 'none' : '1px solid var(--admin-border-color)',
                  fontSize: '13px'
                }}>
                  <span>{feat}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveFeature(index)}
                    style={{ border: 'none', background: 'none', color: 'var(--admin-accent-color)', cursor: 'pointer' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                  </button>
                </li>
              ))}
              {features.length === 0 && (
                <li style={{ padding: '12px', color: '#888888', fontStyle: 'italic', textAlign: 'center', fontSize: '13px' }}>
                  Aucun avantage configuré.
                </li>
              )}
            </ul>
          </div>

          <div className="drawer-actions" style={{ marginTop: '30px' }}>
            <button type="button" className="btn-drawer secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-drawer primary">
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

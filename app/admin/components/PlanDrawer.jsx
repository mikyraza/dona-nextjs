"use client";

import React, { useState, useEffect } from 'react';

export default function PlanDrawer({ isOpen, onClose, onSave, plan = null }) {
  const [name, setName] = useState('');
  const [priceMonthly, setPriceMonthly] = useState(0);
  const [priceAnnually, setPriceAnnually] = useState(0);
  const [currency, setCurrency] = useState('€');
  const [features, setFeatures] = useState([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  useEffect(() => {
    if (plan) {
      setName(plan.name || '');
      setPriceMonthly(plan.priceMonthly !== undefined ? plan.priceMonthly : plan.price || 0);
      setPriceAnnually(plan.priceAnnually !== undefined ? plan.priceAnnually : (plan.price ? plan.price * 10 : 0));
      setCurrency(plan.currency || '€');
      setFeatures(plan.features ? [...plan.features] : []);
      setNewFeatureText('');
    } else {
      setName('');
      setPriceMonthly(0);
      setPriceAnnually(0);
      setCurrency('€');
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

  const handleFeatureTextChange = (index, value) => {
    setFeatures(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...plan,
      name,
      priceMonthly: parseFloat(priceMonthly) || 0,
      priceAnnually: parseFloat(priceAnnually) || 0,
      currency,
      features
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
        <div className="drawer-header">
          <h2>Modifier le Plan : {name}</h2>
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
              placeholder="Nom de l'offre..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="drawer-input-group">
              <label htmlFor="plan-price-monthly">Tarif Mensuel</label>
              <input
                id="plan-price-monthly"
                type="number"
                step="0.01"
                required
                className="drawer-text-input"
                value={priceMonthly}
                onChange={(e) => setPriceMonthly(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="drawer-input-group">
              <label htmlFor="plan-price-annually">Tarif Annuel</label>
              <input
                id="plan-price-annually"
                type="number"
                step="0.01"
                required
                className="drawer-text-input"
                value={priceAnnually}
                onChange={(e) => setPriceAnnually(e.target.value)}
                placeholder="0.00"
              />
            </div>
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

          <div className="drawer-input-group">
            <label>Avantages inclus (Features)</label>
            
            {/* List Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {features.map((feat, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="drawer-text-input"
                    value={feat}
                    onChange={(e) => handleFeatureTextChange(index, e.target.value)}
                    placeholder={`Avantage #${index + 1}`}
                    style={{ flexGrow: 1, fontSize: '13px', padding: '6px 10px' }}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveFeature(index)}
                    style={{ border: 'none', background: 'none', color: 'var(--admin-accent-color)', cursor: 'pointer' }}
                    title="Supprimer"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="drawer-text-input"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="Ajouter un nouvel avantage..."
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

"use client";

import React, { useState, useEffect } from 'react';
import { ALL_SUBSCRIBER_SERVICES, getServicesMatrixConfig, saveServicesMatrixConfig } from '@/lib/subscriptionPermissions';

export default function PlanDrawer({ isOpen, onClose, onSave, plan = null }) {
  const [name, setName] = useState('');
  const [priceMonthly, setPriceMonthly] = useState(0);
  const [priceAnnually, setPriceAnnually] = useState(0);
  const [currency, setCurrency] = useState('€');
  const [features, setFeatures] = useState([]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [servicesState, setServicesState] = useState({});

  useEffect(() => {
    const currentMatrix = getServicesMatrixConfig();
    
    if (plan) {
      const planName = plan.name || 'Essentiel';
      setName(planName);
      setPriceMonthly(plan.priceMonthly !== undefined ? plan.priceMonthly : plan.price || 0);
      setPriceAnnually(plan.priceAnnually !== undefined ? plan.priceAnnually : (plan.price ? plan.price * 10 : 0));
      setCurrency(plan.currency || '€');
      setFeatures(plan.features ? [...plan.features] : []);
      setNewFeatureText('');

      // Map current plan toggles from matrix
      const planKey = planName.toLowerCase().includes('élite') || planName.toLowerCase().includes('elite')
        ? 'Élite'
        : planName.toLowerCase().includes('premium')
        ? 'Premium'
        : 'Essentiel';

      const initialToggles = {};
      ALL_SUBSCRIBER_SERVICES.forEach(svc => {
        if (currentMatrix[svc.id] && currentMatrix[svc.id][planKey] !== undefined) {
          initialToggles[svc.id] = currentMatrix[svc.id][planKey];
        } else {
          initialToggles[svc.id] = svc.defaultPlans.includes(planKey);
        }
      });
      setServicesState(initialToggles);

    } else {
      setName('');
      setPriceMonthly(0);
      setPriceAnnually(0);
      setCurrency('€');
      setFeatures([]);
      setNewFeatureText('');
      setServicesState({});
    }
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const toggleService = (serviceId) => {
    setServicesState(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

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

    const planKey = name.toLowerCase().includes('élite') || name.toLowerCase().includes('elite')
      ? 'Élite'
      : name.toLowerCase().includes('premium')
      ? 'Premium'
      : 'Essentiel';

    // Update global matrix config
    const matrix = getServicesMatrixConfig();
    ALL_SUBSCRIBER_SERVICES.forEach(svc => {
      if (!matrix[svc.id]) {
        matrix[svc.id] = { Essentiel: false, Premium: false, Élite: false };
      }
      matrix[svc.id][planKey] = !!servicesState[svc.id];
    });
    saveServicesMatrixConfig(matrix);

    onSave({
      ...plan,
      name,
      priceMonthly: parseFloat(priceMonthly) || 0,
      priceAnnually: parseFloat(priceAnnually) || 0,
      currency,
      features,
      servicesConfig: servicesState
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '560px' }}>
        <div className="drawer-header">
          <h2>Configurer l'offre : {name}</h2>
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
              <label htmlFor="plan-price-annually">Tarif Annuel (Économie)</label>
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

          {/* Interactive Services & Permissions Selector */}
          <div className="drawer-input-group" style={{ marginTop: '24px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Services Abonnés & Droits d'Accès</span>
              <span style={{ fontSize: '11px', color: 'var(--admin-accent-color)', fontWeight: '600' }}>Boutons de Sélection</span>
            </label>
            <p style={{ fontSize: '12px', color: '#777', marginTop: '-4px', marginBottom: '16px' }}>
              Sélectionnez ou désactivez les services accessibles pour la formule <strong>{name}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ALL_SUBSCRIBER_SERVICES.map((service) => {
                const isIncluded = !!servicesState[service.id];
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: isIncluded ? 'rgba(163, 6, 38, 0.04)' : 'var(--admin-bg-alt, #F8F9FA)',
                      border: isIncluded ? '1px solid var(--admin-accent-color, #A30626)' : '1px solid var(--admin-border-color, #EAEAEA)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isIncluded ? 'var(--admin-accent-color, #A30626)' : '#999' }}>
                        {service.icon}
                      </span>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--admin-text-main, #111)', display: 'block' }}>
                          {service.name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#777' }}>
                          {service.category}
                        </span>
                      </div>
                    </div>

                    {/* Toggle Button Badge */}
                    <div style={{
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      background: isIncluded ? 'var(--admin-accent-color, #A30626)' : '#E0E0E0',
                      color: isIncluded ? '#FFFFFF' : '#666666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                        {isIncluded ? 'check' : 'lock'}
                      </span>
                      {isIncluded ? 'INCLUS' : 'PAYWALL'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bullet Point List Editor */}
          <div className="drawer-input-group" style={{ marginTop: '24px' }}>
            <label>Liste des avantages textuels affichés</label>
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
                placeholder="Ajouter une ligne d'avantage..."
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

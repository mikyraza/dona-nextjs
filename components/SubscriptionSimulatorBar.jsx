"use client";

import React, { useState, useEffect } from 'react';
import { getActiveUserSubscription } from '@/lib/subscriptionPermissions';

export default function SubscriptionSimulatorBar() {
  const [currentPlan, setCurrentPlan] = useState('Essentiel');
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const sub = getActiveUserSubscription();
    setCurrentPlan(sub.plan || 'Essentiel');

    const handleSubChange = () => {
      const updated = getActiveUserSubscription();
      setCurrentPlan(updated.plan || 'Essentiel');
    };

    window.addEventListener('dona_subscription_changed', handleSubChange);
    return () => window.removeEventListener('dona_subscription_changed', handleSubChange);
  }, []);

  const setPlanMode = (newPlan) => {
    const profile = {
      plan: newPlan,
      status: 'Active',
      email: 'membre.test@dona-magazine.com',
      firstName: 'Membre',
      lastName: 'Test',
      phone: '+33 6 12 34 56 78'
    };
    try {
      localStorage.setItem('dona_member_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('dona_subscription_changed'));
      setCurrentPlan(newPlan);
      setToast(`Mode abonné basculé sur : ${newPlan}`);
      setTimeout(() => setToast(null), 2500);
    } catch (e) {
      console.error('Error switching simulation plan:', e);
    }
  };

  return (
    <>
      {/* Toast Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--color-text, #111)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: '600',
          zIndex: 10000,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-accent, #a30626)' }}>verified</span>
          {toast}
        </div>
      )}

      {/* Floating Simulation Bar */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9990,
        fontFamily: 'sans-serif'
      }}>
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              background: '#111111',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '30px',
              padding: '10px 18px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#B09159' }}>tune</span>
            <span>SIMULER MON ABONNEMENT ({currentPlan})</span>
          </button>
        ) : (
          <div style={{
            background: '#181818',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '16px 20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', color: '#B09159', textTransform: 'uppercase' }}>
                🎛️ Simulation des Droits Abonnés
              </span>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#CCC', margin: 0, lineHeight: '1.4' }}>
              Basculez votre statut de compte pour tester les paywalls en direct :
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPlanMode('Essentiel')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '4px',
                  border: currentPlan === 'Essentiel' ? '2px solid #A30626' : '1px solid #333',
                  background: currentPlan === 'Essentiel' ? 'rgba(163, 6, 38, 0.2)' : '#222',
                  color: '#FFF',
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>🔒 Visiteur / Essentiel (Gratuit - 0€)</span>
                {currentPlan === 'Essentiel' && <span style={{ fontSize: '10px', background: '#A30626', padding: '2px 6px', borderRadius: '2px' }}>ACTIF</span>}
              </button>

              <button
                type="button"
                onClick={() => setPlanMode('Premium')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '4px',
                  border: currentPlan === 'Premium' ? '2px solid #A30626' : '1px solid #333',
                  background: currentPlan === 'Premium' ? 'rgba(163, 6, 38, 0.2)' : '#222',
                  color: '#FFF',
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>🌟 Abonné Premium (23€ / 29€)</span>
                {currentPlan === 'Premium' && <span style={{ fontSize: '10px', background: '#A30626', padding: '2px 6px', borderRadius: '2px' }}>ACTIF</span>}
              </button>

              <button
                type="button"
                onClick={() => setPlanMode('Élite')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '4px',
                  border: currentPlan === 'Élite' ? '2px solid #A30626' : '1px solid #333',
                  background: currentPlan === 'Élite' ? 'rgba(163, 6, 38, 0.2)' : '#222',
                  color: '#FFF',
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>👑 Membre Élite (63€ / 79€)</span>
                {currentPlan === 'Élite' && <span style={{ fontSize: '10px', background: '#A30626', padding: '2px 6px', borderRadius: '2px' }}>ACTIF</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import MagazineEditDrawer from '../components/MagazineEditDrawer';

export default function MagazinesAdminPage() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchMagazines = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/magazines');
      if (res.ok) {
        const data = await res.json();
        setMagazines(data);
      }
    } catch (err) {
      console.error("Error fetching magazines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  const handleOpenEdit = (mag) => {
    setSelectedMagazine(mag);
    setIsDrawerOpen(true);
  };

  const handleSaveMagazine = async (slug, updatedData) => {
    try {
      const res = await fetch('/api/admin/magazines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...updatedData })
      });

      if (res.ok) {
        alert("Magazine et onglets enregistrés avec succès !");
        setIsDrawerOpen(false);
        fetchMagazines();
      } else {
        const errData = await res.json();
        alert("Erreur lors de la sauvegarde : " + (errData.error || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("Save magazine error:", err);
      alert("Erreur de connexion lors de la sauvegarde.");
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a31835' }}>
            GESTION ÉDITORIALE & CMS
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '4px 0 0 0' }}>
            Gestion des Magazines ({magazines.length})
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>
            Gérez les informations générales, le Hero, les onglets dynamiques et la structure de chaque magazine.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Chargement des magazines...</div>
      ) : (
        /* Grid of Magazines */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {magazines.map((mag) => (
            <div 
              key={mag.id || mag.slug}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header Cover Banner */}
              <div 
                style={{
                  height: '140px',
                  background: mag.gradient || `linear-gradient(135deg, ${mag.themePrimary || '#a31835'}, #111)`,
                  position: 'relative',
                  padding: '16px',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', background: 'rgba(0,0,0,0.3)', padding: '2px 10px', borderRadius: '12px' }}>
                    {mag.slug ? mag.slug.replace('magazine-', '').substring(0, 2) : '01'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '600', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                    {mag.tabs?.length || 0} Onglets
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {mag.title}
                  </h3>
                  <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>
                    {mag.subtitle}
                  </p>
                </div>
              </div>

              {/* Magazine Details */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, lineHeight: '1.5' }}>
                  {mag.description || "Présentation stratégique et analyses éditoriales."}
                </p>

                {/* Tabs summary */}
                <div style={{ background: '#F9FAFB', padding: '10px 12px', borderRadius: '6px', border: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Onglets Actifs ({mag.tabs?.filter(t => !t.hidden).length || 0}) :
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {mag.tabs?.slice(0, 4).map(t => (
                      <span key={t.id} style={{ fontSize: '11px', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '2px 8px', borderRadius: '4px', color: '#374151' }}>
                        {t.name}
                      </span>
                    ))}
                    {mag.tabs?.length > 4 && (
                      <span style={{ fontSize: '11px', color: '#6B7280', padding: '2px 4px' }}>+{mag.tabs.length - 4} autres</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleOpenEdit(mag)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: mag.themePrimary || '#a31835',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    Gérer ce Magazine
                  </button>
                  <a 
                    href={`/magazines/${mag.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      color: '#374151',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Drawer */}
      <MagazineEditDrawer 
        isOpen={isDrawerOpen}
        magazine={selectedMagazine}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveMagazine}
      />

    </div>
  );
}

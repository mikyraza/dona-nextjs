"use client";

import React, { useState, useEffect } from 'react';
import MagazineEditDrawer from '../components/MagazineEditDrawer';

export default function MagazinesAdminPage() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleOpenCreate = () => {
    setSelectedMagazine(null);
    setIsDrawerOpen(true);
  };

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
        const result = await res.json();
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('dona_content_updated', Date.now().toString());
            const channel = new BroadcastChannel('dona_live_sync');
            channel.postMessage({ type: 'CONTENT_UPDATED', timestamp: Date.now() });
            channel.close();
          } catch (e) {}
        }
        alert(selectedMagazine ? "Magazine modifié avec succès !" : "Nouveau magazine créé avec succès !");
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

  const handleDeleteMagazine = async (mag) => {
    if (!confirm(`Voulez-vous vraiment supprimer l'édition "${mag.title}" (${mag.slug}) ?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/magazines?slug=${encodeURIComponent(mag.slug)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('dona_content_updated', Date.now().toString());
            const channel = new BroadcastChannel('dona_live_sync');
            channel.postMessage({ type: 'CONTENT_UPDATED', timestamp: Date.now() });
            channel.close();
          } catch (e) {}
        }
        alert("Magazine supprimé avec succès.");
        fetchMagazines();
      } else {
        const errData = await res.json();
        alert("Erreur lors de la suppression : " + (errData.error || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("Delete magazine error:", err);
      alert("Erreur de connexion lors de la suppression.");
    }
  };

  // Next suggested numeric ID
  const nextSuggestedId = magazines.length > 0 
    ? Math.max(16, ...magazines.map(m => m.id || 0)) + 1 
    : 17;

  // Filtered magazines
  const filteredMagazines = magazines.filter(mag => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (mag.title && mag.title.toLowerCase().includes(q)) ||
      (mag.subtitle && mag.subtitle.toLowerCase().includes(q)) ||
      (mag.slug && mag.slug.toLowerCase().includes(q)) ||
      (mag.description && mag.description.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--admin-accent-color)' }}>
            GESTION ÉDITORIALE & CMS
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: '4px 0 0 0' }}>
            Gestion des Magazines ({magazines.length})
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
            Configurez les univers éditoriaux, les bannières Hero, les rubriques dynamiques et la hiérarchie des pages.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#9CA3AF' }}>
              search
            </span>
            <input 
              type="text" 
              placeholder="Rechercher un magazine..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '9px 12px 9px 34px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '13px',
                width: '240px',
                background: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>

          {/* Add Magazine Action Button */}
          <button 
            type="button"
            onClick={handleOpenCreate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--admin-accent-color)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '9px 18px',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(163, 24, 53, 0.25)',
              transition: 'background-color 0.2s'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Nouveau Magazine
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', display: 'block', margin: '0 auto 8px', color: 'var(--admin-accent-color)' }}>
            sync
          </span>
          Chargement des univers magazines...
        </div>
      ) : filteredMagazines.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#9CA3AF', marginBottom: '8px' }}>
            search_off
          </span>
          <h3 style={{ fontSize: '16px', color: '#111827', margin: '0 0 4px 0' }}>Aucun magazine trouvé</h3>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>Aucun univers ne correspond à votre recherche "{searchQuery}".</p>
          <button 
            onClick={() => setSearchQuery("")}
            style={{ padding: '6px 14px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        /* Grid of Magazines */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '24px' }}>
          {filteredMagazines.map((mag) => {
            const magNum = mag.id ? String(mag.id).padStart(2, '0') : (mag.slug ? mag.slug.replace('magazine-', '').substring(0, 2) : '01');
            const primaryColor = mag.themePrimary || '#a31835';
            const isDraft = mag.status === 'Draft';

            return (
              <div 
                key={mag.id || mag.slug}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                {/* Header Cover Banner */}
                <div 
                  style={{
                    height: '145px',
                    background: mag.gradient || `linear-gradient(135deg, ${primaryColor}, #111111)`,
                    position: 'relative',
                    padding: '16px',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden'
                  }}
                >
                  {mag.heroImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={mag.heroImage} 
                      alt="" 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.18,
                        mixBlendMode: 'luminosity',
                        pointerEvents: 'none'
                      }}
                    />
                  )}

                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>
                        N° {magNum}
                      </span>
                      {isDraft && (
                        <span style={{ fontSize: '10px', fontWeight: '700', background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>
                          Brouillon
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: '4px' }}>
                      {mag.tabs?.length || 0} Onglets
                    </span>
                  </div>

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', fontWeight: '700', margin: '0 0 2px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)', textTransform: 'uppercase' }}>
                      {mag.title}
                    </h3>
                    <p style={{ fontSize: '12px', opacity: 0.9, margin: 0, fontStyle: 'italic' }}>
                      {mag.subtitle || "Savoir & Décision"}
                    </p>
                  </div>
                </div>

                {/* Magazine Details */}
                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, lineHeight: '1.5' }}>
                    {mag.description || "Présentation stratégique et analyses éditoriales."}
                  </p>

                  {/* Tabs summary */}
                  <div style={{ background: '#F9FAFB', padding: '10px 12px', borderRadius: '6px', border: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
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
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      type="button"
                      onClick={() => handleOpenEdit(mag)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        background: primaryColor,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                      Gérer ce Magazine
                    </button>

                    <a 
                      href={`/magazines/${mag.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Voir la page publique du magazine"
                      style={{
                        padding: '9px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#FFFFFF'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                    </a>

                    {/* Delete button if custom / id > 16 */}
                    {mag.id > 16 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMagazine(mag)}
                        title="Supprimer ce magazine personnalisé"
                        style={{
                          padding: '9px 10px',
                          border: '1px solid #FCA5A5',
                          borderRadius: '4px',
                          color: '#DC2626',
                          background: '#FEF2F2',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Magazine Drawer */}
      <MagazineEditDrawer 
        isOpen={isDrawerOpen}
        magazine={selectedMagazine}
        nextSuggestedId={nextSuggestedId}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveMagazine}
      />

    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';

export default function MagazineEditDrawer({ isOpen, magazine, onClose, onSave }) {
  const [activeSubTab, setActiveSubTab] = useState("hero"); // "hero", "tabs", "sections"
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    heroImage: "",
    themePrimary: "#a31835",
    themeSecondary: "#3d0c1b",
    gradient: "linear-gradient(135deg, #2b1126, #411d3d)",
    heroButtons: [],
    essenceTitle: "",
    essenceText: "",
    essenceQuote: "",
    essenceImage: "",
    tabs: [],
    sections: []
  });

  const [newTabName, setNewTabName] = useState("");

  useEffect(() => {
    if (magazine) {
      setFormData({
        title: magazine.title || "",
        subtitle: magazine.subtitle || "",
        description: magazine.description || "",
        heroImage: magazine.heroImage || "",
        themePrimary: magazine.themePrimary || "#a31835",
        themeSecondary: magazine.themeSecondary || "#3d0c1b",
        gradient: magazine.gradient || "linear-gradient(135deg, #2b1126, #411d3d)",
        heroButtons: magazine.heroButtons || [
          { id: "btn-1", label: "Explorer les Éditions", url: "#articles", visible: true },
          { id: "btn-2", label: "S'abonner au Magazine", url: "/abonnement", visible: true }
        ],
        essenceTitle: magazine.essenceTitle || `L'Essence de ${magazine.title}`,
        essenceText: magazine.essenceText || magazine.essenceText || "",
        essenceQuote: magazine.essenceQuote || "",
        essenceImage: magazine.essenceImage || "",
        tabs: magazine.tabs || [
          { id: "tab-1", slug: "the-pulse", name: "The Pulse", order: 1, defaultActive: true, hidden: false }
        ],
        sections: magazine.sections || [
          { id: "sec-hero", type: "HERO", name: "Hero Banner", visible: true, order: 1 },
          { id: "sec-essence", type: "PRESENTATION", name: "Présentation Éditoriale", visible: true, order: 2 },
          { id: "sec-tabs", type: "CATEGORIES_FEED", name: "Onglets & Articles", visible: true, order: 3 },
          { id: "sec-tools", type: "TOOLS", name: "Outils & Services", visible: true, order: 4 },
          { id: "sec-cta", type: "CTA_PREMIUM", name: "Appel à l'Abonnement", visible: true, order: 5 }
        ]
      });
    }
  }, [magazine]);

  if (!isOpen || !magazine) return null;

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Tab Management Helpers
  const handleAddTab = () => {
    if (!newTabName.trim()) return;
    const slug = newTabName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newTab = {
      id: `tab-${Date.now()}`,
      slug,
      name: newTabName.trim(),
      order: formData.tabs.length + 1,
      defaultActive: formData.tabs.length === 0,
      hidden: false
    };
    setFormData(prev => ({ ...prev, tabs: [...prev.tabs, newTab] }));
    setNewTabName("");
  };

  const handleRenameTab = (id, newName) => {
    setFormData(prev => ({
      ...prev,
      tabs: prev.tabs.map(t => t.id === id ? { ...t, name: newName } : t)
    }));
  };

  const handleToggleHideTab = (id) => {
    setFormData(prev => ({
      ...prev,
      tabs: prev.tabs.map(t => t.id === id ? { ...t, hidden: !t.hidden } : t)
    }));
  };

  const handleDeleteTab = (id) => {
    if (confirm("Voulez-vous vraiment supprimer cet onglet ?")) {
      setFormData(prev => ({
        ...prev,
        tabs: prev.tabs.filter(t => t.id !== id)
      }));
    }
  };

  const handleMoveTab = (index, direction) => {
    const newTabs = [...formData.tabs];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newTabs.length) return;
    const temp = newTabs[index];
    newTabs[index] = newTabs[targetIndex];
    newTabs[targetIndex] = temp;
    // Re-index order
    const reindexed = newTabs.map((t, idx) => ({ ...t, order: idx + 1 }));
    setFormData(prev => ({ ...prev, tabs: reindexed }));
  };

  // Section Management Helpers
  const handleToggleSectionVisibility = (id) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    }));
  };

  const handleMoveSection = (index, direction) => {
    const newSections = [...formData.sections];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    const reindexed = newSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setFormData(prev => ({ ...prev, sections: reindexed }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(magazine.slug, formData);
  };

  return (
    <div className="drawer-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end'
    }}>
      <div className="drawer-container" onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: '750px', background: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.2)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', color: magazine.themePrimary || '#a31835' }}>
              GESTION ÉDITORIALE & CMS
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '2px 0 0 0' }}>
              {magazine.title}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={onClose} style={{ background: 'none', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px 14px', cursor: 'pointer', fontWeight: '500' }}>
              Annuler
            </button>
            <button onClick={handleSubmit} style={{ background: magazine.themePrimary || '#a31835', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '8px 18px', fontWeight: '600', cursor: 'pointer' }}>
              Enregistrer
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF', padding: '0 24px' }}>
          <button 
            onClick={() => setActiveSubTab("hero")}
            style={{
              padding: '14px 18px', border: 'none', background: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              borderBottom: activeSubTab === "hero" ? `3px solid ${magazine.themePrimary || '#a31835'}` : '3px solid transparent',
              color: activeSubTab === "hero" ? (magazine.themePrimary || '#a31835') : '#6B7280'
            }}
          >
            1. Hero & Présentation
          </button>
          <button 
            onClick={() => setActiveSubTab("tabs")}
            style={{
              padding: '14px 18px', border: 'none', background: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              borderBottom: activeSubTab === "tabs" ? `3px solid ${magazine.themePrimary || '#a31835'}` : '3px solid transparent',
              color: activeSubTab === "tabs" ? (magazine.themePrimary || '#a31835') : '#6B7280'
            }}
          >
            2. Onglets (Catégories) ({formData.tabs.length})
          </button>
          <button 
            onClick={() => setActiveSubTab("sections")}
            style={{
              padding: '14px 18px', border: 'none', background: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              borderBottom: activeSubTab === "sections" ? `3px solid ${magazine.themePrimary || '#a31835'}` : '3px solid transparent',
              color: activeSubTab === "sections" ? (magazine.themePrimary || '#a31835') : '#6B7280'
            }}
          >
            3. Sections de la Page ({formData.sections.length})
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* TAB 1: HERO & PRESENTATION */}
          {activeSubTab === "hero" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#111827' }}>Section 1 : Hero Banner</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Titre Principal (Hero)</label>
                    <input type="text" value={formData.title} onChange={e => handleTextChange('title', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Sous-Titre / Slogan</label>
                    <input type="text" value={formData.subtitle} onChange={e => handleTextChange('subtitle', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Description Courte</label>
                    <textarea value={formData.description} onChange={e => handleTextChange('description', e.target.value)} rows={2} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>URL de l'Image de Fond (Hero Banner)</label>
                    <input type="text" value={formData.heroImage} onChange={e => handleTextChange('heroImage', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#111827' }}>Section 2 : Présentation Éditioriale (Essence)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Titre de Présentation</label>
                    <input type="text" value={formData.essenceTitle} onChange={e => handleTextChange('essenceTitle', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Texte de Présentation (Essence)</label>
                    <textarea value={formData.essenceText} onChange={e => handleTextChange('essenceText', e.target.value)} rows={4} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Citation Éditoriale</label>
                    <input type="text" value={formData.essenceQuote} onChange={e => handleTextChange('essenceQuote', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>URL Image de Présentation</label>
                    <input type="text" value={formData.essenceImage} onChange={e => handleTextChange('essenceImage', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#111827' }}>Couleurs Thématiques & Design</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Couleur Primaire</label>
                    <input type="color" value={formData.themePrimary} onChange={e => handleTextChange('themePrimary', e.target.value)} style={{ width: '100%', height: '38px', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Couleur Secondaire</label>
                    <input type="color" value={formData.themeSecondary} onChange={e => handleTextChange('themeSecondary', e.target.value)} style={{ width: '100%', height: '38px', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DYNAMIC CATEGORIES (TABS) */}
          {activeSubTab === "tabs" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Nom du nouvel onglet (ex: IA Générative, Cybersécurité...)" 
                  value={newTabName}
                  onChange={e => setNewTabName(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px' }}
                />
                <button 
                  onClick={handleAddTab}
                  style={{ background: magazine.themePrimary || '#a31835', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '0 20px', fontWeight: '600', cursor: 'pointer' }}
                >
                  + Ajouter l'Onglet
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {formData.tabs.map((tab, idx) => (
                  <div key={tab.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: tab.hidden ? '#F3F4F6' : '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', opacity: tab.hidden ? 0.6 : 1 }}>
                    <span style={{ fontWeight: '700', color: '#9CA3AF', width: '24px' }}>#{idx + 1}</span>
                    <input 
                      type="text" 
                      value={tab.name} 
                      onChange={e => handleRenameTab(tab.id, e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: '4px', fontWeight: '600' }}
                    />
                    <span style={{ fontSize: '11px', color: '#9CA3AF', background: '#F3F4F6', padding: '4px 8px', borderRadius: '4px' }}>slug: {tab.slug}</span>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => handleMoveTab(idx, -1)} disabled={idx === 0} style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>⬆️</button>
                      <button onClick={() => handleMoveTab(idx, 1)} disabled={idx === formData.tabs.length - 1} style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: idx === formData.tabs.length - 1 ? 'not-allowed' : 'pointer' }}>⬇️</button>
                      <button onClick={() => handleToggleHideTab(tab.id)} style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: tab.hidden ? '#FEF3C7' : '#FFFFFF', borderRadius: '4px', cursor: 'pointer' }}>{tab.hidden ? "🙈 Masqué" : "👁️ Visible"}</button>
                      <button onClick={() => handleDeleteTab(tab.id)} style={{ padding: '4px 8px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#DC2626', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAGE SECTIONS ORDER & VISIBILITY */}
          {activeSubTab === "sections" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px 0' }}>
                Activez, masquez ou réorganisez l'ordre des sections de la page du magazine.
              </p>
              
              {formData.sections.map((sec, idx) => (
                <div key={sec.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: sec.visible ? '#FFFFFF' : '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '700', color: '#9CA3AF' }}>Pos {idx + 1}</span>
                    <strong style={{ fontSize: '14px', color: sec.visible ? '#111827' : '#9CA3AF' }}>{sec.name}</strong>
                    <span style={{ fontSize: '11px', background: '#E5E7EB', padding: '2px 6px', borderRadius: '3px', color: '#4B5563' }}>TYPE: {sec.type}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => handleMoveSection(idx, -1)} disabled={idx === 0} style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>⬆️</button>
                    <button onClick={() => handleMoveSection(idx, 1)} disabled={idx === formData.sections.length - 1} style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: idx === formData.sections.length - 1 ? 'not-allowed' : 'pointer' }}>⬇️</button>
                    <button 
                      onClick={() => handleToggleSectionVisibility(sec.id)}
                      style={{ 
                        padding: '6px 12px', border: 'none', borderRadius: '4px', fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                        background: sec.visible ? '#D1FAE5' : '#F3F4F6', color: sec.visible ? '#065F46' : '#6B7280'
                      }}
                    >
                      {sec.visible ? "Section Active" : "Masquée"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

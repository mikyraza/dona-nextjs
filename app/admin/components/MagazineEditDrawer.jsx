"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MediaPickerModal = dynamic(() => import('./MediaPickerModal'), { ssr: false });

// Shared Image Uploader widget with Media Library integration
function ImageUploader({ value, onChange, label = "Image", placeholderText = "Choisir depuis la médiathèque" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '6px' }}>
        {label}
      </div>
      {value ? (
        <div className="media-compact-row">
          <div className="media-compact-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" />
          </div>
          <div className="media-compact-info">
            <div className="media-compact-filename">{value.split('/').pop()}</div>
            <div style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span> Configurée
            </div>
            <div className="media-compact-actions" style={{ marginTop: '6px' }}>
              <button type="button" className="btn-media-action" onClick={() => setIsModalOpen(true)}>Changer</button>
              <button type="button" className="btn-media-action danger" onClick={() => onChange('')}>Supprimer</button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="cover-placeholder-btn" onClick={() => setIsModalOpen(true)} style={{ padding: '16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>add_photo_alternate</span>
          <span style={{ fontSize: '12px' }}>{placeholderText}</span>
        </button>
      )}
      <MediaPickerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default function MagazineEditDrawer({ isOpen, magazine, nextSuggestedId = 17, onClose, onSave }) {
  const isNew = !magazine || !magazine.slug;
  const [activeSubTab, setActiveSubTab] = useState("hero"); // "hero", "essence", "style", "tabs", "sections"
  const [status, setStatus] = useState("Published"); // "Published" | "Draft"

  const [formData, setFormData] = useState({
    id: nextSuggestedId,
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    heroImage: "",
    themePrimary: "#a31835",
    themeSecondary: "#3d0c1b",
    gradient: "linear-gradient(135deg, #2b1126, #411d3d)",
    heroButtons: [
      { id: "btn-1", label: "Explorer les Éditions", url: "#articles", visible: true },
      { id: "btn-2", label: "S'abonner au Magazine", url: "/abonnement", visible: true }
    ],
    essenceTitle: "",
    essenceText: "",
    essenceQuote: "",
    essenceImage: "",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>`,
    features: [
      { title: "The Brief", subtitle: "SYNTHÈSE QUOTIDIENNE STRATÉGIQUE", meta: "EST. 2024 • 08:00 CET", icon: "assignment" },
      { title: "The Pulse", subtitle: "SIGNAUX FAIBLES & DÉTECTION PRÉCOCE", meta: "LIVE UPDATE • GLOBAL FEED", icon: "pulse" }
    ],
    tabs: [
      { id: "tab-1", slug: "the-pulse", name: "The Pulse", order: 1, defaultActive: true, hidden: false },
      { id: "tab-2", slug: "analyses", name: "Analyses & Enquêtes", order: 2, defaultActive: false, hidden: false }
    ],
    sections: [
      { id: "sec-hero", type: "HERO", name: "Hero Banner", visible: true, order: 1 },
      { id: "sec-essence", type: "PRESENTATION", name: "Présentation Éditoriale", visible: true, order: 2 },
      { id: "sec-tabs", type: "CATEGORIES_FEED", name: "Onglets & Articles", visible: true, order: 3 },
      { id: "sec-tools", type: "TOOLS", name: "Outils & Services", visible: true, order: 4 },
      { id: "sec-cta", type: "CTA_PREMIUM", name: "Appel à l'Abonnement", visible: true, order: 5 }
    ]
  });

  const [newTabName, setNewTabName] = useState("");
  const [activePreviewTabId, setActivePreviewTabId] = useState("tab-1");

  useEffect(() => {
    if (magazine) {
      setFormData({
        id: magazine.id || nextSuggestedId,
        slug: magazine.slug || "",
        title: magazine.title || "",
        subtitle: magazine.subtitle || "",
        description: magazine.description || "",
        heroImage: magazine.heroImage || "",
        themePrimary: magazine.themePrimary || "#a31835",
        themeSecondary: magazine.themeSecondary || "#3d0c1b",
        gradient: magazine.gradient || `linear-gradient(135deg, ${magazine.themePrimary || '#a31835'}, #111111)`,
        heroButtons: magazine.heroButtons || [
          { id: "btn-1", label: "Explorer les Éditions", url: "#articles", visible: true },
          { id: "btn-2", label: "S'abonner au Magazine", url: "/abonnement", visible: true }
        ],
        essenceTitle: magazine.essenceTitle || (magazine.title ? `L'Essence de ${magazine.title}` : ""),
        essenceText: magazine.essenceText || "",
        essenceQuote: magazine.essenceQuote || "",
        essenceImage: magazine.essenceImage || "",
        icon: magazine.icon || `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>`,
        features: magazine.features?.length > 0 ? magazine.features : [
          { title: "The Brief", subtitle: "SYNTHÈSE QUOTIDIENNE STRATÉGIQUE", meta: "EST. 2024 • 08:00 CET", icon: "assignment" },
          { title: "The Pulse", subtitle: "SIGNAUX FAIBLES & DÉTECTION PRÉCOCE", meta: "LIVE UPDATE • GLOBAL FEED", icon: "pulse" }
        ],
        tabs: magazine.tabs?.length > 0 ? magazine.tabs : [
          { id: "tab-1", slug: "the-pulse", name: "The Pulse", order: 1, defaultActive: true, hidden: false },
          { id: "tab-2", slug: "analyses", name: "Analyses & Enquêtes", order: 2, defaultActive: false, hidden: false }
        ],
        sections: magazine.sections?.length > 0 ? magazine.sections : [
          { id: "sec-hero", type: "HERO", name: "Hero Banner", visible: true, order: 1 },
          { id: "sec-essence", type: "PRESENTATION", name: "Présentation Éditoriale", visible: true, order: 2 },
          { id: "sec-tabs", type: "CATEGORIES_FEED", name: "Onglets & Articles", visible: true, order: 3 },
          { id: "sec-tools", type: "TOOLS", name: "Outils & Services", visible: true, order: 4 },
          { id: "sec-cta", type: "CTA_PREMIUM", name: "Appel à l'Abonnement", visible: true, order: 5 }
        ]
      });
      setStatus(magazine.status || "Published");
      if (magazine.tabs?.length > 0) {
        setActivePreviewTabId(magazine.tabs[0].id);
      }
    } else {
      // Default template for new magazine creation
      setFormData({
        id: nextSuggestedId,
        slug: "",
        title: "",
        subtitle: "",
        description: "",
        heroImage: "/assets/core/img/mag_hero_01.png",
        themePrimary: "#a31835",
        themeSecondary: "#3d0c1b",
        gradient: "linear-gradient(135deg, #2b1126, #411d3d)",
        heroButtons: [
          { id: "btn-1", label: "Explorer les Éditions", url: "#articles", visible: true },
          { id: "btn-2", label: "S'abonner au Magazine", url: "/abonnement", visible: true }
        ],
        essenceTitle: "",
        essenceText: "",
        essenceQuote: "",
        essenceImage: "/assets/core/img/mag_hero_02.png",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m0-20a9 9 0 019 9m-9-9a9 9 0 00-9 9m9 11a9 9 0 01-9-9m9 9a9 9 0 009-9M2 12h20"></path></svg>`,
        features: [
          { title: "The Brief", subtitle: "SYNTHÈSE QUOTIDIENNE STRATÉGIQUE", meta: "EST. 2024 • 08:00 CET", icon: "assignment" },
          { title: "The Pulse", subtitle: "SIGNAUX FAIBLES & DÉTECTION PRÉCOCE", meta: "LIVE UPDATE • GLOBAL FEED", icon: "pulse" }
        ],
        tabs: [
          { id: "tab-1", slug: "the-pulse", name: "The Pulse", order: 1, defaultActive: true, hidden: false },
          { id: "tab-2", slug: "analyses", name: "Analyses & Enquêtes", order: 2, defaultActive: false, hidden: false }
        ],
        sections: [
          { id: "sec-hero", type: "HERO", name: "Hero Banner", visible: true, order: 1 },
          { id: "sec-essence", type: "PRESENTATION", name: "Présentation Éditoriale", visible: true, order: 2 },
          { id: "sec-tabs", type: "CATEGORIES_FEED", name: "Onglets & Articles", visible: true, order: 3 },
          { id: "sec-tools", type: "TOOLS", name: "Outils & Services", visible: true, order: 4 },
          { id: "sec-cta", type: "CTA_PREMIUM", name: "Appel à l'Abonnement", visible: true, order: 5 }
        ]
      });
      setStatus("Published");
      setActivePreviewTabId("tab-1");
    }
  }, [magazine, isOpen, nextSuggestedId]);

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-update slug if title changes in creation mode
      if (field === 'title' && isNew && !prev.slug) {
        const cleanSlug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        updated.slug = `magazine-${String(prev.id).padStart(2, '0')}-${cleanSlug}`;
        if (!prev.essenceTitle) {
          updated.essenceTitle = `L'Essence de ${value}`;
        }
      }
      return updated;
    });
  };

  const handleColorChange = (type, hex) => {
    setFormData(prev => {
      const primary = type === 'themePrimary' ? hex : prev.themePrimary;
      const secondary = type === 'themeSecondary' ? hex : prev.themeSecondary;
      return {
        ...prev,
        [type]: hex,
        gradient: `linear-gradient(135deg, ${primary}, ${secondary})`
      };
    });
  };

  // Tab Management
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
    const reindexed = newTabs.map((t, idx) => ({ ...t, order: idx + 1 }));
    setFormData(prev => ({ ...prev, tabs: reindexed }));
  };

  // Section Management
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

  // Features Management
  const handleFeatureChange = (index, field, value) => {
    setFormData(prev => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        { title: "Nouveau Format", subtitle: "DESCRIPTION COURTE", meta: "HEBDOMADAIRE", icon: "explore" }
      ]
    }));
  };

  const handleDeleteFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Veuillez saisir un titre pour le magazine.");
      return;
    }

    let finalSlug = formData.slug.trim();
    if (!finalSlug) {
      const cleanSlug = formData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      finalSlug = `magazine-${String(formData.id).padStart(2, '0')}-${cleanSlug}`;
    }

    onSave(finalSlug, {
      ...formData,
      slug: finalSlug,
      status
    });
  };

  const primaryColor = formData.themePrimary || "#a31835";
  const secondaryColor = formData.themeSecondary || "#3d0c1b";

  return (
    <div className="drawer-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="drawer-panel" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          width: '1440px', 
          maxWidth: '98vw', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          background: '#FFFFFF'
        }}
      >
        
        {/* TOP HEADER */}
        <div className="drawer-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #EAEAEA',
          padding: '14px 24px',
          flexShrink: 0,
          background: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: primaryColor }}>
              menu_book
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  letterSpacing: '0.12em', 
                  textTransform: 'uppercase', 
                  color: primaryColor,
                  background: '#FFF0F2',
                  padding: '2px 8px',
                  borderRadius: '2px'
                }}>
                  {isNew ? "+ NOUVEAU MAGAZINE" : `${String(formData.id).padStart(2, '0')}. ${formData.title.toUpperCase()}`}
                </span>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  {isNew ? "Créer une Édition Magazine" : formData.title}
                </h2>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Status Toggle */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '4px 10px', 
              background: status === 'Published' ? '#ECFDF5' : '#F3F4F6', 
              borderRadius: '4px', 
              border: `1px solid ${status === 'Published' ? '#A7F3D0' : '#E5E7EB'}` 
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: status === 'Published' ? '#059669' : '#6B7280' }}>
                {status === 'Published' ? 'public' : 'visibility_off'}
              </span>
              <span style={{ fontSize: '11px', fontWeight: '600', color: status === 'Published' ? '#059669' : '#4B5563', textTransform: 'uppercase' }}>
                {status === 'Published' ? 'Publié' : 'Brouillon'}
              </span>
              <label className="switch" style={{ margin: '0 0 0 6px', transform: 'scale(0.8)' }}>
                <input 
                  type="checkbox" 
                  checked={status === 'Published'} 
                  onChange={e => setStatus(e.target.checked ? 'Published' : 'Draft')} 
                />
                <span className="slider round"></span>
              </label>
            </div>

            <button 
              type="button" 
              onClick={onClose} 
              className="btn-drawer secondary" 
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              Annuler
            </button>
            <button 
              type="button" 
              onClick={handleSubmit} 
              className="btn-drawer primary" 
              style={{ 
                background: primaryColor, 
                padding: '8px 20px', 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
              {isNew ? "Créer le Magazine" : "Enregistrer"}
            </button>
          </div>
        </div>

        {/* SUB-TABS NAVIGATION */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #E5E7EB', 
          background: '#FAFAFA', 
          padding: '0 24px',
          gap: '4px',
          flexShrink: 0
        }}>
          {[
            { id: "hero", label: "1. Identité & Hero", icon: "dashboard" },
            { id: "essence", label: "2. Essence Éditoriale", icon: "auto_stories" },
            { id: "style", label: "3. Couleurs & Style", icon: "palette" },
            { id: "tabs", label: `4. Onglets & Rubriques (${formData.tabs.length})`, icon: "tab" },
            { id: "sections", label: `5. Features & Sections (${formData.sections.length})`, icon: "view_agenda" }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                fontWeight: activeSubTab === tab.id ? '700' : '500',
                fontSize: '12px',
                cursor: 'pointer',
                borderBottom: activeSubTab === tab.id ? `3px solid ${primaryColor}` : '3px solid transparent',
                color: activeSubTab === tab.id ? primaryColor : '#6B7280',
                transition: 'all 0.15s'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* SPLIT SCREEN BODY */}
        <div className="article-editor-split" style={{ flex: 1, height: 'calc(100% - 110px)', width: '100%' }}>

          {/* ====== LEFT COLUMN: EDITING FORM ====== */}
          <div className="editor-left-col" style={{ flex: '0 0 58%', padding: '24px 28px', overflowY: 'auto' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* SUB-TAB 1: IDENTITÉ & HERO */}
              {activeSubTab === "hero" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Title & Number */}
                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">title</span>
                      Identité de l'Édition
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="editor-meta-field">
                        <label>Numéro</label>
                        <input 
                          type="number" 
                          value={formData.id} 
                          onChange={e => handleFieldChange('id', parseInt(e.target.value, 10) || 1)} 
                          style={{ fontWeight: 700, textAlign: 'center' }}
                        />
                      </div>
                      <div className="editor-meta-field">
                        <label>Titre Principal du Magazine *</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Intelligence, Power Lab, Longevity..."
                          value={formData.title} 
                          onChange={e => handleFieldChange('title', e.target.value)} 
                          className="editor-title-input"
                          style={{ fontSize: '18px', padding: '6px 10px', background: '#FFFFFF' }}
                        />
                      </div>
                    </div>

                    <div className="editor-meta-row">
                      <div className="editor-meta-field">
                        <label>Slug URL (Identifiant Technique)</label>
                        <input 
                          type="text" 
                          placeholder="magazine-01-intelligence"
                          value={formData.slug} 
                          onChange={e => handleFieldChange('slug', e.target.value)} 
                        />
                      </div>
                      <div className="editor-meta-field">
                        <label>Sous-Titre / Slogan Éditorial</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Savoir & Décision Stratégique"
                          value={formData.subtitle} 
                          onChange={e => handleFieldChange('subtitle', e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="editor-meta-field" style={{ marginTop: '12px' }}>
                      <label>Description Stratégique Courte</label>
                      <textarea 
                        rows={5}
                        placeholder="Présentation synthétique de la vision éditoriale..."
                        value={formData.description} 
                        onChange={e => handleFieldChange('description', e.target.value)} 
                        className="drawer-textarea"
                        style={{ minHeight: '120px', width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Hero Cover Image */}
                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">image</span>
                      Image de Couverture Hero
                    </div>
                    <ImageUploader 
                      label="Hero Banner Illustration (Grand Format)"
                      value={formData.heroImage}
                      onChange={url => handleFieldChange('heroImage', url)}
                      placeholderText="Choisir la photo Hero depuis la médiathèque"
                    />
                  </div>

                  {/* Hero Action Buttons */}
                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">smart_button</span>
                      Boutons d'Appel à l'Action (Hero)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {formData.heroButtons.map((btn, idx) => (
                        <div key={btn.id || idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '10px', alignItems: 'center', background: '#FFFFFF', padding: '10px', border: '1px solid #EAEAEA', borderRadius: '4px' }}>
                          <input 
                            type="text" 
                            placeholder="Libellé du bouton"
                            value={btn.label} 
                            onChange={e => {
                              const updated = [...formData.heroButtons];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              handleFieldChange('heroButtons', updated);
                            }}
                            style={{ padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: '3px', fontSize: '12px' }}
                          />
                          <input 
                            type="text" 
                            placeholder="URL de redirection (ex: #articles, /abonnement)"
                            value={btn.url} 
                            onChange={e => {
                              const updated = [...formData.heroButtons];
                              updated[idx] = { ...updated[idx], url: e.target.value };
                              handleFieldChange('heroButtons', updated);
                            }}
                            style={{ padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: '3px', fontSize: '12px' }}
                          />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={btn.visible} 
                              onChange={e => {
                                const updated = [...formData.heroButtons];
                                updated[idx] = { ...updated[idx], visible: e.target.checked };
                                handleFieldChange('heroButtons', updated);
                              }}
                            />
                            Visible
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 2: ESSENCE ÉDITORIALE */}
              {activeSubTab === "essence" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">menu_book</span>
                      Présentation de l'Essence
                    </div>
                    
                    <div className="editor-meta-field" style={{ marginBottom: '16px' }}>
                      <label>Titre de Présentation</label>
                      <input 
                        type="text" 
                        placeholder="Ex: L'Essence de l'Intelligence"
                        value={formData.essenceTitle} 
                        onChange={e => handleFieldChange('essenceTitle', e.target.value)} 
                      />
                    </div>

                    <div className="editor-meta-field" style={{ marginBottom: '16px' }}>
                      <label>Texte Éditorial Approfondi (Manifeste & Vision)</label>
                      <textarea 
                        rows={12}
                        placeholder="Expliquez la mission éditoriale, l'ambition et la portée du magazine..."
                        value={formData.essenceText} 
                        onChange={e => handleFieldChange('essenceText', e.target.value)} 
                        className="drawer-textarea"
                        style={{ minHeight: '260px', width: '100%', fontSize: '13px', lineHeight: '1.7' }}
                      />
                    </div>

                    <div className="editor-meta-field" style={{ marginBottom: '16px' }}>
                      <label>Citation Éditoriale en Exergue (Blockquote)</label>
                      <textarea 
                        rows={3}
                        placeholder="Ex: L'intelligence n'est pas seulement l'accumulation de données, c'est l'art de discerner le motif au milieu du chaos..."
                        value={formData.essenceQuote} 
                        onChange={e => handleFieldChange('essenceQuote', e.target.value)} 
                        className="drawer-textarea"
                        style={{ minHeight: '80px', width: '100%', fontStyle: 'italic' }}
                      />
                    </div>

                    <ImageUploader 
                      label="Illustration de l'Essence Éditoriale"
                      value={formData.essenceImage}
                      onChange={url => handleFieldChange('essenceImage', url)}
                      placeholderText="Choisir l'illustration de l'essence depuis la médiathèque"
                    />
                  </div>

                </div>
              )}

              {/* SUB-TAB 3: COULEURS & STYLE */}
              {activeSubTab === "style" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">palette</span>
                      Palette Chromatique du Magazine
                    </div>

                    <div className="editor-meta-row">
                      <div className="editor-meta-field">
                        <label>Couleur Primaire (Accent & Boutons)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="color" 
                            value={formData.themePrimary} 
                            onChange={e => handleColorChange('themePrimary', e.target.value)} 
                            style={{ width: '44px', height: '40px', padding: '0', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer' }}
                          />
                          <input 
                            type="text" 
                            value={formData.themePrimary} 
                            onChange={e => handleColorChange('themePrimary', e.target.value)} 
                            style={{ flex: 1, fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>

                      <div className="editor-meta-field">
                        <label>Couleur Secondaire (Ombres & Textes sombres)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="color" 
                            value={formData.themeSecondary} 
                            onChange={e => handleColorChange('themeSecondary', e.target.value)} 
                            style={{ width: '44px', height: '40px', padding: '0', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer' }}
                          />
                          <input 
                            type="text" 
                            value={formData.themeSecondary} 
                            onChange={e => handleColorChange('themeSecondary', e.target.value)} 
                            style={{ flex: 1, fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="editor-meta-field" style={{ marginTop: '16px' }}>
                      <label>Dégradé CSS (Hero Background Gradient)</label>
                      <input 
                        type="text" 
                        value={formData.gradient} 
                        onChange={e => handleFieldChange('gradient', e.target.value)} 
                        style={{ fontFamily: 'monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">code</span>
                      Icône SVG du Magazine
                    </div>
                    <div className="editor-meta-field">
                      <label>Code SVG Intégré</label>
                      <textarea 
                        rows={6}
                        value={formData.icon} 
                        onChange={e => handleFieldChange('icon', e.target.value)} 
                        className="drawer-textarea"
                        style={{ fontFamily: 'monospace', fontSize: '11px', minHeight: '130px', width: '100%' }}
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 4: ONGLETS (CATÉGORIES DYNAMIQUES) */}
              {activeSubTab === "tabs" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">add_circle</span>
                      Ajouter une Rubrique / Onglet
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="Nom du nouvel onglet (ex: Signaux Faibles, Deep-Tech...)" 
                        value={newTabName}
                        onChange={e => setNewTabName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTab(); }}}
                        style={{ flex: 1, padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '13px' }}
                      />
                      <button 
                        type="button"
                        onClick={handleAddTab}
                        style={{ 
                          background: primaryColor, 
                          color: '#FFFFFF', 
                          border: 'none', 
                          borderRadius: '4px', 
                          padding: '0 20px', 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        Ajouter
                      </button>
                    </div>
                  </div>

                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">list</span>
                      Onglets Existants ({formData.tabs.length})
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {formData.tabs.map((tab, idx) => (
                        <div 
                          key={tab.id} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            padding: '12px 14px', 
                            background: tab.hidden ? '#F3F4F6' : '#FFFFFF', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '6px', 
                            opacity: tab.hidden ? 0.6 : 1 
                          }}
                        >
                          <span style={{ fontWeight: 700, color: '#9CA3AF', width: '24px', textAlign: 'center' }}>
                            #{idx + 1}
                          </span>
                          <input 
                            type="text" 
                            value={tab.name} 
                            onChange={e => handleRenameTab(tab.id, e.target.value)}
                            style={{ flex: 1, padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: '4px', fontWeight: '600', fontSize: '13px' }}
                          />
                          <span style={{ fontSize: '11px', color: '#9CA3AF', background: '#F3F4F6', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                            {tab.slug}
                          </span>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button 
                              type="button" 
                              onClick={() => handleMoveTab(idx, -1)} 
                              disabled={idx === 0} 
                              style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                              title="Monter"
                            >
                              ⬆️
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleMoveTab(idx, 1)} 
                              disabled={idx === formData.tabs.length - 1} 
                              style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: idx === formData.tabs.length - 1 ? 'not-allowed' : 'pointer' }}
                              title="Descendre"
                            >
                              ⬇️
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleToggleHideTab(tab.id)} 
                              style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: tab.hidden ? '#FEF3C7' : '#FFFFFF', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                            >
                              {tab.hidden ? "🙈 Masqué" : "👁️ Visible"}
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleDeleteTab(tab.id)} 
                              style={{ padding: '4px 8px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#DC2626', borderRadius: '4px', cursor: 'pointer' }}
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 5: FEATURES & SECTIONS */}
              {activeSubTab === "sections" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Features Cards */}
                  <div className="editor-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div className="editor-section-title" style={{ margin: 0 }}>
                        <span className="material-symbols-outlined">featured_play_list</span>
                        Cartes Formats Clés (Features)
                      </div>
                      <button 
                        type="button"
                        onClick={handleAddFeature}
                        style={{ fontSize: '11px', fontWeight: 600, color: primaryColor, background: '#FFF0F2', border: 'none', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        + Ajouter un Format
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {formData.features.map((feat, idx) => (
                        <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: '4px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '12px', color: '#374151' }}>Format #{idx + 1}</strong>
                            <button type="button" onClick={() => handleDeleteFeature(idx)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Supprimer</button>
                          </div>
                          <div className="editor-meta-row">
                            <input 
                              type="text" 
                              placeholder="Titre du Format (ex: The Brief)"
                              value={feat.title} 
                              onChange={e => handleFeatureChange(idx, 'title', e.target.value)}
                              style={{ padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: '3px', fontSize: '12px' }}
                            />
                            <input 
                              type="text" 
                              placeholder="Sous-titre / Description"
                              value={feat.subtitle} 
                              onChange={e => handleFeatureChange(idx, 'subtitle', e.target.value)}
                              style={{ padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: '3px', fontSize: '12px' }}
                            />
                          </div>
                          <div className="editor-meta-row" style={{ marginTop: '8px' }}>
                            <input 
                              type="text" 
                              placeholder="Méta (ex: EST. 2024 • 08:00 CET)"
                              value={feat.meta} 
                              onChange={e => handleFeatureChange(idx, 'meta', e.target.value)}
                              style={{ padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: '3px', fontSize: '12px' }}
                            />
                            <input 
                              type="text" 
                              placeholder="Icône Material (ex: assignment, pulse, search)"
                              value={feat.icon} 
                              onChange={e => handleFeatureChange(idx, 'icon', e.target.value)}
                              style={{ padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: '3px', fontSize: '12px' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section Ordering & Visibility */}
                  <div className="editor-section">
                    <div className="editor-section-title">
                      <span className="material-symbols-outlined">layers</span>
                      Agencement des Sections de la Page
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {formData.sections.map((sec, idx) => (
                        <div 
                          key={sec.id} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '12px 14px', 
                            background: sec.visible ? '#FFFFFF' : '#F9FAFB', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '6px' 
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 700, color: '#9CA3AF', width: '20px' }}>#{idx + 1}</span>
                            <strong style={{ fontSize: '13px', color: sec.visible ? '#111827' : '#9CA3AF' }}>{sec.name}</strong>
                            <span style={{ fontSize: '10px', background: '#E5E7EB', padding: '2px 6px', borderRadius: '3px', color: '#4B5563' }}>{sec.type}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button 
                              type="button" 
                              onClick={() => handleMoveSection(idx, -1)} 
                              disabled={idx === 0} 
                              style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                            >
                              ⬆️
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleMoveSection(idx, 1)} 
                              disabled={idx === formData.sections.length - 1} 
                              style={{ padding: '4px 8px', border: '1px solid #D1D5DB', background: '#FFFFFF', borderRadius: '4px', cursor: idx === formData.sections.length - 1 ? 'not-allowed' : 'pointer' }}
                            >
                              ⬇️
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleToggleSectionVisibility(sec.id)}
                              style={{ 
                                padding: '4px 10px', 
                                border: 'none', 
                                borderRadius: '4px', 
                                fontWeight: 600, 
                                fontSize: '11px', 
                                cursor: 'pointer',
                                background: sec.visible ? '#D1FAE5' : '#F3F4F6', 
                                color: sec.visible ? '#065F46' : '#6B7280'
                              }}
                            >
                              {sec.visible ? "Active" : "Masquée"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </form>
          </div>

          {/* ====== RIGHT COLUMN: REAL-TIME LIVE PREVIEW ====== */}
          <div className="editor-right-col" style={{ flex: '0 0 42%', background: '#FAF9F6', borderLeft: '1px solid #EAEAEA', overflowY: 'auto' }}>
            <div className="live-preview-header">
              <div className="preview-live-dot"></div>
              Aperçu en direct — Template Public DONA
            </div>

            <div className="live-preview-body" style={{ padding: '20px' }}>

              {/* 1. Live Hero Banner */}
              <div style={{
                position: 'relative',
                minHeight: '220px',
                borderRadius: '6px',
                overflow: 'hidden',
                background: formData.gradient || `linear-gradient(135deg, ${primaryColor}, #111111)`,
                color: '#FFFFFF',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}>
                {formData.heroImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={formData.heroImage} 
                    alt="Hero" 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.25,
                      mixBlendMode: 'luminosity',
                      pointerEvents: 'none'
                    }}
                  />
                )}
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>
                      MAGAZINE NUMÉRO {String(formData.id).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>
                      {status === 'Published' ? 'En ligne' : 'Brouillon'}
                    </span>
                  </div>
                  <h1 style={{ 
                    fontFamily: 'Cormorant Garamond, Georgia, serif', 
                    fontSize: '28px', 
                    fontWeight: 700, 
                    margin: '0 0 4px 0', 
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em'
                  }}>
                    {formData.title || <span style={{ opacity: 0.4 }}>Titre du Magazine</span>}
                  </h1>
                  <p style={{ fontSize: '13px', fontStyle: 'italic', opacity: 0.9, margin: 0 }}>
                    {formData.subtitle || "Slogan & direction éditoriale..."}
                  </p>
                </div>

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '8px', marginTop: '16px' }}>
                  {formData.heroButtons.filter(b => b.visible).map(btn => (
                    <span 
                      key={btn.id} 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        background: 'rgba(255,255,255,0.2)', 
                        backdropFilter: 'blur(4px)',
                        padding: '4px 10px', 
                        borderRadius: '3px',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    >
                      {btn.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Live Dynamic Tabs Navigation */}
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #EAEAEA' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', display: 'block', marginBottom: '8px' }}>
                  Navigation par Onglets
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formData.tabs.filter(t => !t.hidden).map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActivePreviewTabId(t.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: activePreviewTabId === t.id ? `1px solid ${primaryColor}` : '1px solid #E5E7EB',
                        background: activePreviewTabId === t.id ? primaryColor : '#F9FAFB',
                        color: activePreviewTabId === t.id ? '#FFFFFF' : '#374151'
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Live Essence Section */}
              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '6px', border: '1px solid #EAEAEA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '4px', height: '16px', background: primaryColor, borderRadius: '2px' }}></div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#111827' }}>
                    {formData.essenceTitle || `L'Essence du Magazine`}
                  </h3>
                </div>
                
                <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#4B5563', margin: '0 0 10px 0' }}>
                  {formData.essenceText || "Présentation et manifeste éditorial du magazine..."}
                </p>

                {formData.essenceQuote && (
                  <blockquote style={{
                    margin: '0 0 12px 0',
                    padding: '8px 12px',
                    borderLeft: `3px solid ${primaryColor}`,
                    background: '#FAF9F6',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: '#1F2937'
                  }}>
                    &ldquo;{formData.essenceQuote}&rdquo;
                  </blockquote>
                )}

                {formData.essenceImage && (
                  <div style={{ width: '100%', height: '100px', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.essenceImage} alt="Essence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* 4. Live Features Grid */}
              {formData.features?.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {formData.features.map((feat, idx) => (
                    <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: '4px', padding: '10px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: primaryColor }}>
                        {feat.icon || 'explore'}
                      </span>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>{feat.title}</div>
                      <div style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{feat.subtitle}</div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

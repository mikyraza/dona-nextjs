"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MediaPickerModal = dynamic(() => import('./MediaPickerModal'), { ssr: false });

const LABELS = [
  'DOSSIER SPÉCIAL',
  'GRANDE ENQUÊTE',
  'REPORTAGE LONG-FORMAT',
  'FOCUS STRATÉGIQUE',
  'ANALYSE PROSPECTIVE',
  'DOSSIER CONFIDENTIEL'
];

const DEFAULT_UNIVERSES = [
  { 
    id: "general", 
    name: "— Général (Sans magazine) —", 
    slug: "",
    rubriques: ['Culture', 'Économie', 'Politique', 'Masterclass', 'Événement', 'Documentaire', 'Interview', 'Société', 'Art & Design'] 
  },
  { 
    id: "intelligence", 
    name: "01. Intelligence",
    slug: "magazine-01-intelligence",
    rubriques: ["The Brief", "The Pulse", "Deep-Dive", "Radar", "Analyses & Enquêtes", "Voices & Tribunes", "Général"] 
  },
  { 
    id: "power-lab", 
    name: "02. Power Lab",
    slug: "magazine-02-power-lab",
    rubriques: ["The Pulse", "Lab Reports", "Beta Test", "Metrics", "Analyses & Enquêtes", "Général"] 
  },
  { 
    id: "alliance", 
    name: "03. L'Alliance",
    slug: "magazine-03-alliance",
    rubriques: ["Net Map", "Briefing", "Diplomatie & Réseaux", "Analyses & Enquêtes", "Général"] 
  },
  { 
    id: "agenda", 
    name: "04. L'Agenda",
    slug: "magazine-04-agenda",
    rubriques: ["FlowState", "Rythmes & Temps", "Chronobiologie", "Analyses & Enquêtes", "Général"] 
  },
  { 
    id: "passions", 
    name: "05. Passions",
    slug: "magazine-05-passions",
    rubriques: ["Portraits", "Création & Dépassement", "Esthétique & Effort", "Général"] 
  },
  { 
    id: "art-de-vivre", 
    name: "06. Art de Vivre",
    slug: "magazine-06-art-de-vivre",
    rubriques: ["Spaces", "Architecture & Design", "Élégance & Sérénité", "Général"] 
  },
  { 
    id: "academie", 
    name: "07. Académie",
    slug: "magazine-07-academie",
    rubriques: ["Lectures", "Sagesse & Transmission", "Classiques & Savoir", "Général"] 
  },
  { 
    id: "patrimoine", 
    name: "08. Patrimoine",
    slug: "magazine-08-patrimoine",
    rubriques: ["Héritage & Histoire", "Transmission Familiale", "Préservation & Racines", "Général"] 
  },
  { 
    id: "longevity", 
    name: "09. Longevity",
    slug: "magazine-09-longevity",
    rubriques: ["Biologie & Prévention", "Protocoles & Science", "Nutrition Cellulaire", "Général"] 
  },
  { 
    id: "impact", 
    name: "10. Impact",
    slug: "magazine-10-impact",
    rubriques: ["Initiatives Durables", "Gouvernance & Climat", "Économie Régénérative", "Général"] 
  },
  { 
    id: "culture-medias", 
    name: "11. Culture & Médias",
    slug: "magazine-11-culture-medias",
    rubriques: ["Critique Culturelle", "Médias du Futur", "Arts & Société", "Général"] 
  },
  { 
    id: "cercle", 
    name: "12. Le Cercle",
    slug: "magazine-12-cercle",
    rubriques: ["Débats Exclusifs", "Leaders & Décideurs", "Rencontres Confidentielles", "Général"] 
  },
  { 
    id: "amour", 
    name: "13. Amour",
    slug: "magazine-13-amour",
    rubriques: ["Psychologie & Liens", "Intimité & Philosophie", "L'Art d'Aimer", "Général"] 
  },
  { 
    id: "beaute", 
    name: "14. Beauté",
    slug: "magazine-14-beaute",
    rubriques: ["Esthétique & Soins", "Rituels & Bien-être", "Harmonie & Corps", "Général"] 
  },
  { 
    id: "mariages", 
    name: "15. Mariages",
    slug: "magazine-15-mariages",
    rubriques: ["Cérémonies & Lieux", "L'Art du Mariage", "Couture & Élégance", "Général"] 
  },
  { 
    id: "sante", 
    name: "16. Santé",
    slug: "magazine-16-sante",
    rubriques: ["The Pulse", "Médecine & Science", "Neurosciences & Corps", "Équilibre de Vie", "Général"] 
  }
];

export default function DossierDrawer({ isOpen, onClose, onSave, articles = [], dossier = null }) {
  const [title, setTitle] = useState('');
  const [coordinator, setCoordinator] = useState('Hélène de Ségur');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Draft');
  const [isVipOnly, setIsVipOnly] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [magazine, setMagazine] = useState('general');
  const [category, setCategory] = useState('Analyses & Enquêtes');
  const [label, setLabel] = useState('DOSSIER SPÉCIAL');
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [articleSearch, setArticleSearch] = useState('');

  // Media & Cover
  const [coverUrl, setCoverUrl] = useState('');
  const [coverFileName, setCoverFileName] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [magazinesList, setMagazinesList] = useState(DEFAULT_UNIVERSES);

  useEffect(() => {
    async function loadMagazines() {
      try {
        const res = await fetch('/api/admin/magazines');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = [
              DEFAULT_UNIVERSES[0],
              ...data.map(m => {
                const defaultUniv = DEFAULT_UNIVERSES.find(u => 
                  u.slug === m.slug || 
                  (m.id && u.id === String(m.id)) ||
                  (m.title && u.name.toLowerCase().includes(m.title.toLowerCase()))
                );

                const customRubriques = [];
                if (m.rubriques && Array.isArray(m.rubriques)) {
                  m.rubriques.forEach(r => {
                    const rName = typeof r === 'string' ? r : (r.title || r.name);
                    if (rName) customRubriques.push(rName);
                  });
                }

                const combinedRubriques = [
                  ...customRubriques,
                  ...(defaultUniv?.rubriques || ["Général"])
                ].filter((v, i, a) => a.indexOf(v) === i);

                const numStr = m.id ? String(m.id).padStart(2, '0') + '. ' : '';

                return {
                  id: defaultUniv ? defaultUniv.id : (m.slug || `magazine-${m.id}`),
                  name: m.title ? (m.title.startsWith(numStr) ? m.title : `${numStr}${m.title}`) : (defaultUniv?.name || `Magazine ${m.id}`),
                  slug: m.slug,
                  rubriques: combinedRubriques.length > 0 ? combinedRubriques : ["Général"]
                };
              })
            ];
            setMagazinesList(mapped);
          }
        }
      } catch (e) {
        console.warn("Could not fetch magazines for dossier drawer", e);
      }
    }

    if (isOpen) {
      loadMagazines();
    }
  }, [isOpen]);

  // Helper to get rubriques for a given magazine ID
  const getRubriquesForMagazine = (magId) => {
    if (!magId || magId === 'general') {
      return DEFAULT_UNIVERSES[0].rubriques;
    }
    const found = magazinesList.find(m => m.id === magId || m.slug === magId || (m.name && m.name.toLowerCase().includes(magId.toLowerCase())));
    if (found && found.rubriques?.length > 0) {
      return found.rubriques;
    }
    const defaultFound = DEFAULT_UNIVERSES.find(u => u.id === magId || u.slug === magId);
    return defaultFound?.rubriques || ["Analyses & Enquêtes", "Général", "Culture", "Économie"];
  };

  const currentRubriques = getRubriquesForMagazine(magazine);

  const handleMagazineChange = (newMagId) => {
    setMagazine(newMagId);
    const rubriques = getRubriquesForMagazine(newMagId);
    if (!rubriques.includes(category)) {
      setCategory(rubriques[0] || 'Analyses & Enquêtes');
    }
  };

  useEffect(() => {
    if (dossier) {
      setTitle(dossier.title || '');
      setCoordinator(dossier.coordinator || 'Hélène de Ségur');
      setDescription(dossier.description || dossier.summary || '');
      setStatus(dossier.status || 'Draft');
      setIsVipOnly(dossier.isVipOnly ?? true);
      setIsFeatured(dossier.isFeatured || false);

      // Resolve magazine & category
      const targetMag = dossier.magazine || dossier.universe || 'general';
      setMagazine(targetMag);
      const availableRubriques = getRubriquesForMagazine(targetMag);
      setCategory(dossier.category && availableRubriques.includes(dossier.category) ? dossier.category : (dossier.category || availableRubriques[0] || 'Analyses & Enquêtes'));

      setLabel(dossier.label || 'DOSSIER SPÉCIAL');
      setSelectedArticles(dossier.articles || []);
      setCoverUrl(dossier.coverImage || '');
      setCoverFileName(dossier.coverImage ? dossier.coverImage.split('/').pop() : '');
      setFileName(dossier.coverImage ? dossier.coverImage.split('/').pop() : '');
      setUploadProgress(dossier.coverImage ? 100 : 0);
      setIsUploading(false);
    } else {
      resetForm();
    }
  }, [dossier, isOpen]);

  function resetForm() {
    setTitle('');
    setCoordinator('Hélène de Ségur');
    setDescription('');
    setStatus('Draft');
    setIsVipOnly(true);
    setIsFeatured(false);
    setMagazine('general');
    setCategory('Analyses & Enquêtes');
    setLabel('DOSSIER SPÉCIAL');
    setSelectedArticles([]);
    setArticleSearch('');
    setCoverUrl('');
    setCoverFileName('');
    setFileName('');
    setUploadProgress(0);
    setIsUploading(false);
  }

  if (!isOpen) return null;

  // Handle Cover Image upload via /api/media
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(15);

    const formData = new FormData();
    formData.append("file", file);

    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 10 : 85));
    }, 150);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      clearInterval(interval);

      if (data.success && data.url) {
        setUploadProgress(100);
        setCoverUrl(data.url);
        setCoverFileName(file.name);
      } else {
        alert(`Erreur: ${data.error || "Téléversement échoué"}`);
        setUploadProgress(0);
      }
    } catch (err) {
      clearInterval(interval);
      console.error("Cover upload error:", err);
      alert("Erreur de connexion lors du téléversement");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMediaSelect = (url) => {
    setCoverUrl(url);
    setCoverFileName(url.split('/').pop());
  };

  const handleArticleToggle = (articleId) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId) 
        : [...prev, articleId]
    );
  };

  const filteredArticles = articles.filter(art => {
    if (!articleSearch.trim()) return true;
    const q = articleSearch.toLowerCase();
    return (
      (art.title && art.title.toLowerCase().includes(q)) ||
      (art.category && art.category.toLowerCase().includes(q)) ||
      (art.author && art.author.toLowerCase().includes(q))
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedMagObj = magazinesList.find(m => m.id === magazine);
    const magDisplayName = selectedMagObj && selectedMagObj.id !== 'general' ? selectedMagObj.name : '';

    const payload = {
      id: dossier?.id || `dos-${Date.now()}`,
      title: title.trim(),
      coordinator: coordinator.trim(),
      description: description.trim(),
      summary: description.trim(),
      status,
      isVipOnly,
      isFeatured,
      category: category || 'Analyses & Enquêtes',
      rubrique: category || 'Analyses & Enquêtes',
      magazine: magDisplayName,
      universe: magazine,
      label,
      articles: selectedArticles,
      coverImage: coverUrl || '/assets/core/img/vault-1.png',
      updated: "À l'instant"
    };

    setIsSaving(true);
    try {
      onSave(payload);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '1440px', maxWidth: '98vw', display: 'flex', flexDirection: 'column' }}
      >
        {/* HEADER */}
        <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAEAEA', padding: '14px 24px', flexShrink: 0, background: '#FFFFFF', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--admin-accent-color)' }}>topic</span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {dossier ? "Modifier le dossier" : "Nouveau Dossier d'Enquête"}
            </h2>
            {title && (
              <span style={{ fontSize: '12px', color: '#9CA3AF', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                — {title}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            
            {/* Status Toggle in Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '16px', padding: '4px 8px', background: status === 'Published' ? '#ECFDF5' : '#F3F4F6', borderRadius: '4px', border: `1px solid ${status === 'Published' ? '#A7F3D0' : '#E5E7EB'}` }}>
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
                  onChange={(e) => setStatus(e.target.checked ? 'Published' : 'Draft')}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <button type="button" className="btn-drawer secondary" onClick={onClose} style={{ padding: '7px 14px', fontSize: '12px' }}>
              Annuler
            </button>
            <button
              type="button"
              className="btn-drawer primary"
              onClick={handleSubmit}
              disabled={isSaving || isUploading || !title.trim()}
              style={{ padding: '7px 16px', fontSize: '12px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {status === 'Published' ? 'publish' : 'save'}
              </span>
              {status === 'Published' ? (dossier ? "Mettre à jour" : "Publier") : "Enregistrer brouillon"}
            </button>
            <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* SPLIT BODY */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'hidden', display: 'flex', height: 'calc(100% - 56px)' }}>
          <div className="article-editor-split" style={{ flex: 1 }}>

            {/* ====== LEFT COLUMN: FORM ====== */}
            <div className="editor-left-col">

              {/* SECTION 1: IDENTITÉ DU DOSSIER */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">folder_special</span>
                  Identité du Dossier & Thématique
                </div>

                {/* Main Dossier Title */}
                <input
                  className="editor-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre du grand dossier d'enquête (ex: L'Empire du Silicium...)"
                  required
                  autoFocus
                  style={{ marginBottom: '16px' }}
                />

                {/* Row 1: Univers / Magazine & Rubrique / Catégorie dynamique */}
                <div className="editor-meta-row" style={{ marginBottom: '14px' }}>
                  <div className="editor-meta-field">
                    <label htmlFor="dos-magazine">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>menu_book</span>
                      1. Univers / Magazine
                    </label>
                    <select
                      id="dos-magazine"
                      value={magazine}
                      onChange={(e) => handleMagazineChange(e.target.value)}
                      style={{ fontWeight: '600' }}
                    >
                      {magazinesList.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="editor-meta-field">
                    <label htmlFor="dos-category">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>category</span>
                      2. Rubrique / Catégorie ({currentRubriques.length})
                    </label>
                    <select
                      id="dos-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ fontWeight: '600', borderColor: 'var(--admin-accent-color)' }}
                    >
                      {currentRubriques.map((rub) => (
                        <option key={rub} value={rub}>{rub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Coordinateur & Format (Gauche) + Chapeau éditorial élargi (Droite) */}
                <div className="editor-meta-row" style={{ marginBottom: '14px', alignItems: 'stretch' }}>
                  
                  {/* Colonne gauche : Coordinateur + Format */}
                  <div className="editor-meta-field" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label htmlFor="dos-coord">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>person</span>
                        3. Rédacteur en chef / Coordinateur
                      </label>
                      <input
                        id="dos-coord"
                        type="text"
                        value={coordinator}
                        onChange={(e) => setCoordinator(e.target.value)}
                        placeholder="ex: Hélène de Ségur"
                        required
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="dos-label">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>label</span>
                        4. Format & Badge éditorial
                      </label>
                      <select
                        id="dos-label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        style={{ fontWeight: '600', width: '100%' }}
                      >
                        {LABELS.map((lbl) => (
                          <option key={lbl} value={lbl}>{lbl}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Colonne droite : Résumé / Chapeau élargi */}
                  <div className="editor-meta-field" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="dos-description" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>short_text</span>
                        Résumé / Chapeau du Dossier
                      </span>
                      <span style={{ fontSize: '9px', color: '#888888', fontWeight: 500 }}>
                        Extrait public affiché en couverture
                      </span>
                    </label>
                    <textarea
                      id="dos-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Saisissez l'introduction, la problématique ou le synopsis du dossier d'enquête..."
                      rows={4}
                      style={{
                        width: '100%',
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid var(--admin-border-color, #E5E7EB)',
                        borderRadius: '2px',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        minHeight: '92px'
                      }}
                    />
                  </div>
                </div>

              </div>

              {/* SECTION 2: MÉDIA & COUVERTURE */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">image</span>
                  Image de Couverture du Dossier
                </div>

                {/* Cover visual */}
                <div style={{ marginBottom: '12px' }}>
                  {coverUrl ? (
                    <div className="media-compact-row">
                      <div className="media-compact-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverUrl} alt="Couverture Dossier" />
                      </div>
                      <div className="media-compact-info">
                        <div className="media-compact-filename">{coverFileName || 'couverture-dossier.jpg'}</div>
                        <div style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span>
                          Couverture configurée
                        </div>
                        <div className="media-compact-actions" style={{ marginTop: '6px' }}>
                          <button type="button" className="btn-media-action" onClick={() => setIsMediaModalOpen(true)}>
                            Changer
                          </button>
                          <button type="button" className="btn-media-action danger" onClick={() => { setCoverUrl(''); setCoverFileName(''); }}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <button type="button" className="cover-placeholder-btn" onClick={() => setIsMediaModalOpen(true)}>
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                        Choisir une couverture depuis la médiathèque
                      </button>

                      <div className="media-drag-drop-zone" style={{ padding: '16px' }}>
                        <input
                          type="file"
                          id="dos-cover-file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <label htmlFor="dos-cover-file" className="drag-drop-label" style={{ cursor: 'pointer' }}>
                          <span className="material-symbols-outlined drag-drop-icon" style={{ fontSize: '24px', color: 'var(--admin-accent-color)' }}>cloud_upload</span>
                          <span style={{ fontSize: '12px' }}>Ou téléversez directement : JPG, PNG, WEBP</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: ARTICLES ASSOCIÉS AU DOSSIER */}
              <div className="editor-section">
                <div className="editor-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined">article</span>
                    Articles Associés au Dossier
                  </span>
                  <span style={{ fontSize: '11px', background: '#F3F4F6', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, color: '#4B5563' }}>
                    {selectedArticles.length} sélectionné{selectedArticles.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Article Search Filter */}
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="Filtrer les articles par titre, catégorie ou auteur..."
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '3px'
                    }}
                  />
                </div>

                {/* Articles checklist */}
                <div style={{ 
                  maxHeight: '180px', 
                  overflowY: 'auto', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '3px', 
                  padding: '10px',
                  backgroundColor: '#FAF9F6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {filteredArticles.map((art) => {
                    const isChecked = selectedArticles.includes(art.id);
                    return (
                      <label
                        key={art.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '6px 8px',
                          background: isChecked ? '#FFF' : 'transparent',
                          border: `1px solid ${isChecked ? '#A30626' : 'transparent'}`,
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleArticleToggle(art.id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontWeight: isChecked ? 700 : 500, color: isChecked ? '#A30626' : '#111827' }}>
                            {art.title}
                          </span>
                          <span style={{ color: '#888888', fontSize: '11px', marginLeft: '6px' }}>
                            • {art.category || 'Général'} {art.author ? `(Par ${art.author})` : ''}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                  {filteredArticles.length === 0 && (
                    <p style={{ color: '#888888', fontSize: '12px', fontStyle: 'italic', margin: '4px 0', textAlign: 'center' }}>
                      Aucun article trouvé pour cette recherche.
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION 4: OPTIONS DE DIFFUSION */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">tune</span>
                  Options de diffusion & Visibilité
                </div>

                {/* Accès VIP */}
                <div className="editor-vip-toggle">
                  <div className="editor-vip-label">
                    <span>Dossier VIP Réservé (Club DONA)</span>
                    <span>Limiter l'accès de l'intégralité du dossier aux membres abonnés.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isVipOnly}
                      onChange={(e) => setIsVipOnly(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* À la Une */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Mettre à la Une dans le Grand Kiosque</span>
                    <span>Affiche ce grand dossier en tête de gondole éditoriale.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Publication */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Publier immédiatement</span>
                    <span>Rendre le dossier public et indexé sur le site.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={status === 'Published'}
                      onChange={(e) => setStatus(e.target.checked ? 'Published' : 'Draft')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

              </div>

            </div>

            {/* ====== RIGHT COLUMN: LIVE DOSSIER PREVIEW ====== */}
            <div className="editor-right-col">
              <div className="live-preview-header">
                <div className="preview-live-dot"></div>
                Aperçu en direct — Grand Dossier d'Enquête
              </div>

              <div className="live-preview-body">

                {/* Dossier Vault Card Simulation */}
                <div style={{
                  background: '#1C1B1B',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '16/9',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  marginBottom: '18px'
                }}>
                  {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverUrl}
                      alt="Couverture Dossier"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1C1B1B 0%, #2A2828 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.3 }}>folder_special</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ background: '#A30626', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '3px 7px', borderRadius: '2px', letterSpacing: '0.08em' }}>
                        {label || 'DOSSIER SPÉCIAL'}
                      </span>
                      {isVipOnly && (
                        <span style={{ background: 'rgba(180, 140, 60, 0.9)', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '3px 7px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>lock</span> VIP
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', lineHeight: '1.3' }}>
                      {title || "Titre du dossier d'enquête..."}
                    </div>
                  </div>
                </div>

                {/* Category & Magazine Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span className="preview-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span>{category.toUpperCase()}</span>
                    {label && (
                      <>
                        <span style={{ opacity: 0.6, fontSize: '10px' }}>•</span>
                        <span style={{ fontWeight: 800, color: 'var(--admin-accent-color)' }}>{label.toUpperCase()}</span>
                      </>
                    )}
                  </span>
                  {magazine && magazine !== 'general' && (
                    <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
                      {magazinesList.find(m => m.id === magazine)?.name || magazine}
                    </span>
                  )}
                </div>

                {/* Title Preview */}
                <h1 className="preview-title" style={{ fontSize: '22px', marginBottom: '8px' }}>
                  {title || <span style={{ color: '#CCCCCC', fontStyle: 'italic', fontSize: '18px' }}>Titre du dossier...</span>}
                </h1>

                {/* Coordinator byline */}
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '10px' }}>
                  Coordonné par <strong style={{ color: '#111827' }}>{coordinator || 'Hélène de Ségur'}</strong>
                </div>

                {/* Description Preview */}
                {description && (
                  <p className="preview-summary" style={{
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: '#4B5563',
                    borderLeft: '3px solid var(--admin-accent-color)',
                    paddingLeft: '12px',
                    margin: '12px 0 16px',
                    background: '#FAF9F6',
                    padding: '8px 12px',
                    borderRadius: '2px'
                  }}>
                    {description}
                  </p>
                )}

                {/* Selected articles list preview */}
                {selectedArticles.length > 0 && (
                  <div style={{ background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '12px', marginTop: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--admin-accent-color)', marginBottom: '8px' }}>
                      Sommaire du dossier ({selectedArticles.length} articles)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {selectedArticles.map((artId) => {
                        const artObj = articles.find(a => a.id === artId);
                        return (
                          <li key={artId}>
                            <strong>{artObj?.title || artId}</strong>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Technical Parameters Box */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '14px', marginTop: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#888888', marginBottom: '8px' }}>
                    Paramètres du dossier
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#6B7280' }}>Articles : </span>
                      <strong>{selectedArticles.length} associé{selectedArticles.length > 1 ? 's' : ''}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280' }}>Accès : </span>
                      <strong style={{ color: isVipOnly ? '#B08D57' : '#059669' }}>{isVipOnly ? '👑 Membres VIP' : '🌐 Public'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280' }}>Statut : </span>
                      <strong style={{ color: status === 'Published' ? '#059669' : '#6B7280' }}>{status === 'Published' ? 'Publié' : 'Brouillon'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280' }}>Univers : </span>
                      <strong>{magazinesList.find(m => m.id === magazine)?.name || 'Général'}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>

        {/* Media Picker Modal for Cover */}
        <MediaPickerModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
        />
      </div>
    </div>
  );
}

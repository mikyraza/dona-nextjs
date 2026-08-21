"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MediaPickerModal = dynamic(() => import('./MediaPickerModal'), { ssr: false });

const LABELS = [
  'DOCUMENTAIRE',
  'MASTERCLASS',
  'TABLE RONDE',
  'INTERVIEW',
  'PORTRAITS',
  'REPLAY',
  'SÉRIE',
  'ÉVÉNEMENT'
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

export default function VideoDrawer({ isOpen, onClose, onSave, video }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [duration, setDuration] = useState('24 MIN');
  const [status, setStatus] = useState('Draft');
  const [isVipOnly, setIsVipOnly] = useState(false);
  const [isHD, setIsHD] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isReplay, setIsReplay] = useState(false);
  const [magazine, setMagazine] = useState('general');
  const [category, setCategory] = useState('Culture');
  const [label, setLabel] = useState('DOCUMENTAIRE');

  // Media & Thumbnail
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Video source: 'url' | 'hls' | 'upload'
  const [sourceType, setSourceType] = useState('url');
  const [videoUrl, setVideoUrl] = useState('');
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
        console.warn("Could not fetch magazines for video drawer", e);
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
    return defaultFound?.rubriques || ["Général", "Culture", "Économie", "Masterclass", "Documentaire"];
  };

  const currentRubriques = getRubriquesForMagazine(magazine);

  const handleMagazineChange = (newMagId) => {
    setMagazine(newMagId);
    const rubriques = getRubriquesForMagazine(newMagId);
    if (!rubriques.includes(category)) {
      setCategory(rubriques[0] || 'Général');
    }
  };

  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setSubtitle(video.subtitle || video.desc || '');
      setDuration(video.duration || '24 MIN');
      setStatus(video.status || 'Draft');
      setIsVipOnly(video.isVipOnly || false);
      setIsHD(video.isHD ?? true);
      setIsFeatured(video.isFeatured || false);
      setIsReplay(video.isReplay || false);

      // Resolve magazine & category
      const targetMag = video.magazine || video.universe || 'general';
      setMagazine(targetMag);
      const availableRubriques = getRubriquesForMagazine(targetMag);
      setCategory(video.category && availableRubriques.includes(video.category) ? video.category : (video.category || availableRubriques[0] || 'Culture'));
      
      setLabel(video.label || 'DOCUMENTAIRE');
      setThumbnailUrl(video.thumbnailUrl || '');
      setThumbnailFileName(video.thumbnailUrl ? video.thumbnailUrl.split('/').pop() : '');

      const src = video.source || 'url';
      setSourceType(src);

      if (src === 'upload' || (video.videoUrl && video.videoUrl.startsWith('Fichier :'))) {
        setSourceType('upload');
        setFileName(video.videoUrl?.replace('Fichier : ', '') || '');
        setVideoUrl('');
        setUploadProgress(100);
      } else {
        setVideoUrl(video.videoUrl || '');
        setFileName('');
        setUploadProgress(0);
      }
      setIsUploading(false);
    } else {
      resetForm();
    }
  }, [video, isOpen]);

  function resetForm() {
    setTitle('');
    setSubtitle('');
    setDuration('24 MIN');
    setStatus('Draft');
    setIsVipOnly(false);
    setIsHD(true);
    setIsFeatured(false);
    setIsReplay(false);
    setMagazine('general');
    setCategory('Culture');
    setLabel('DOCUMENTAIRE');
    setThumbnailUrl('');
    setThumbnailFileName('');
    setSourceType('url');
    setVideoUrl('');
    setFileName('');
    setUploadProgress(0);
    setIsUploading(false);
  }

  if (!isOpen) return null;

  // Handle upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(15);

    const formData = new FormData();
    formData.append('file', file);

    const interval = setInterval(() => {
      setUploadProgress(prev => (prev < 85 ? prev + 10 : 85));
    }, 150);

    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      const data = await res.json();
      clearInterval(interval);
      if (data.success && data.url) {
        setUploadProgress(100);
        setVideoUrl(data.url);
      } else {
        alert(`Erreur upload: ${data.error || 'Téléversement échoué'}`);
        setUploadProgress(0);
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Upload error:', err);
      alert('Erreur de connexion lors du téléversement');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMediaSelect = (url) => {
    setThumbnailUrl(url);
    setThumbnailFileName(url.split('/').pop());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedMagObj = magazinesList.find(m => m.id === magazine);
    const magDisplayName = selectedMagObj && selectedMagObj.id !== 'general' ? selectedMagObj.name : '';

    const payload = {
      id: video?.id || `vid-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      duration: duration.trim() || '24 MIN',
      status,
      isVipOnly,
      isHD,
      isFeatured,
      isReplay,
      category: category || 'Culture',
      rubrique: category || 'Culture',
      magazine: magDisplayName,
      universe: magazine,
      label,
      source: sourceType,
      videoUrl: sourceType === 'upload' ? `Fichier : ${fileName}` : videoUrl,
      thumbnailUrl: thumbnailUrl || '/assets/core/img/ecouter-1.png',
      updated: "À l'instant"
    };

    setIsSaving(true);
    try {
      const method = video?.id && !String(video.id).startsWith('vid-local-') ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/videos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onSave(data.video || payload);
        onClose();
      } else {
        onSave(payload);
        onClose();
      }
    } catch (err) {
      console.error('Save error:', err);
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
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--admin-accent-color)' }}>videocam</span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {video ? "Modifier la vidéo" : "Nouvelle Vidéo"}
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
              {status === 'Published' ? (video ? "Mettre à jour" : "Publier") : "Enregistrer brouillon"}
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

              {/* SECTION 1: IDENTITÉ DE LA VIDÉO */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">movie_edit</span>
                  Identité de la vidéo
                </div>

                {/* Title */}
                <input
                  className="editor-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la vidéo ou du grand entretien..."
                  required
                  autoFocus
                  style={{ marginBottom: '16px' }}
                />

                {/* Row 1: Univers / Magazine & Rubrique / Catégorie dynamique */}
                <div className="editor-meta-row" style={{ marginBottom: '14px' }}>
                  <div className="editor-meta-field">
                    <label htmlFor="vid-magazine">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>menu_book</span>
                      1. Univers / Magazine
                    </label>
                    <select
                      id="vid-magazine"
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
                    <label htmlFor="vid-category">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>category</span>
                      2. Rubrique / Catégorie ({currentRubriques.length})
                    </label>
                    <select
                      id="vid-category"
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

                {/* Row 2: Format & Durée (Gauche) + Résumé / Sous-titre élargi (Droite) */}
                <div className="editor-meta-row" style={{ marginBottom: '14px', alignItems: 'stretch' }}>
                  
                  {/* Colonne gauche : Format + Durée */}
                  <div className="editor-meta-field" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label htmlFor="vid-label">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>label</span>
                        3. Format & Badge éditorial
                      </label>
                      <select
                        id="vid-label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        style={{ fontWeight: '600', width: '100%' }}
                      >
                        {LABELS.map((lbl) => (
                          <option key={lbl} value={lbl}>{lbl}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="vid-duration">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>schedule</span>
                        4. Durée de la vidéo
                      </label>
                      <input
                        id="vid-duration"
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="ex: 24 MIN ou 1H 15MIN"
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Colonne droite : Grand champ Résumé / Sous-titre */}
                  <div className="editor-meta-field" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="vid-subtitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>short_text</span>
                        Sous-titre / Résumé de la vidéo
                      </span>
                      <span style={{ fontSize: '9px', color: '#888888', fontWeight: 500 }}>
                        Extrait public affiché dans le Studio
                      </span>
                    </label>
                    <textarea
                      id="vid-subtitle"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Saisissez une description concise ou un résumé éditorial de la vidéo..."
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
                  <span className="material-symbols-outlined">perm_media</span>
                  Médias & Source Vidéo
                </div>

                {/* Vignette / Image de couverture */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '6px' }}>
                    Image de couverture / Miniature
                  </div>
                  {thumbnailUrl ? (
                    <div className="media-compact-row">
                      <div className="media-compact-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumbnailUrl} alt="Miniature Vidéo" />
                      </div>
                      <div className="media-compact-info">
                        <div className="media-compact-filename">{thumbnailFileName || 'miniature-video.jpg'}</div>
                        <div style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span>
                          Vignette configurée
                        </div>
                        <div className="media-compact-actions" style={{ marginTop: '6px' }}>
                          <button type="button" className="btn-media-action" onClick={() => setIsMediaModalOpen(true)}>
                            Changer
                          </button>
                          <button type="button" className="btn-media-action danger" onClick={() => { setThumbnailUrl(''); setThumbnailFileName(''); }}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="cover-placeholder-btn" onClick={() => setIsMediaModalOpen(true)}>
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                      Choisir une miniature depuis la médiathèque
                    </button>
                  )}
                </div>

                {/* Source Vidéo Segmented Tabs */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '6px' }}>
                    Type de source vidéo
                  </div>
                  <div className="editor-format-tabs" style={{ marginBottom: '12px' }}>
                    <button
                      type="button"
                      className={`editor-format-tab ${sourceType === 'url' ? 'active' : ''}`}
                      onClick={() => setSourceType('url')}
                    >
                      <span className="material-symbols-outlined">link</span>
                      URL Externe (YouTube / Vimeo / CDN)
                    </button>
                    <button
                      type="button"
                      className={`editor-format-tab ${sourceType === 'hls' ? 'active' : ''}`}
                      onClick={() => setSourceType('hls')}
                    >
                      <span className="material-symbols-outlined">live_tv</span>
                      Flux HLS / Stream (.m3u8)
                    </button>
                    <button
                      type="button"
                      className={`editor-format-tab ${sourceType === 'upload' ? 'active' : ''}`}
                      onClick={() => setSourceType('upload')}
                    >
                      <span className="material-symbols-outlined">upload_file</span>
                      Téléverser fichier
                    </button>
                  </div>

                  {(sourceType === 'url' || sourceType === 'hls') && (
                    <div>
                      <input
                        type="url"
                        className="editor-title-input"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder={sourceType === 'hls' ? "https://stream.donamagazine.com/live/index.m3u8" : "https://youtube.com/watch?v=... ou URL CDN"}
                        style={{ fontSize: '13px', fontWeight: 400, padding: '10px 12px' }}
                      />
                      {sourceType === 'hls' && (
                        <span style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginTop: '4px' }}>
                          Compatible avec les flux de direct HLS, RTMP et serveurs CDN white-label.
                        </span>
                      )}
                    </div>
                  )}

                  {sourceType === 'upload' && (
                    <div>
                      <div className="media-drag-drop-zone" style={{ padding: '24px 16px' }}>
                        <input
                          type="file"
                          id="vid-upload-input"
                          accept="video/mp4,video/webm,video/ogg"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <label htmlFor="vid-upload-input" className="drag-drop-label" style={{ cursor: 'pointer' }}>
                          <span className="material-symbols-outlined drag-drop-icon" style={{ fontSize: '32px' }}>videocam</span>
                          <span style={{ fontSize: '13px' }}>Glissez-déposez ou <strong>parcourez vos fichiers</strong></span>
                        </label>
                      </div>

                      {fileName && (
                        <div className="file-upload-status-card" style={{ marginTop: '10px', padding: '10px 14px', background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                          <div className="file-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="material-symbols-outlined" style={{ color: 'var(--admin-accent-color)', fontSize: '20px' }}>movie</span>
                              <span style={{ fontSize: '12px', fontWeight: 600 }}>{fileName}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>{uploadProgress}%</span>
                          </div>
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="upload-mini-progress" style={{ marginTop: '6px' }}>
                              <div className="upload-mini-progress-fill" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: OPTIONS DE DIFFUSION */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">tune</span>
                  Options de diffusion & Visibilité
                </div>

                {/* Accès VIP */}
                <div className="editor-vip-toggle">
                  <div className="editor-vip-label">
                    <span>Accès VIP uniquement (Club DONA)</span>
                    <span>Réservé aux membres abonnés avec le badge cadenas doré.</span>
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

                {/* Qualité HD */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Haute Définition (HD / 4K)</span>
                    <span>Afficher le badge de qualité supérieure HD sur la carte.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isHD}
                      onChange={(e) => setIsHD(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* À la Une */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Mettre à la Une dans le Studio</span>
                    <span>Positionne cette vidéo en vedette dans le lecteur principal du Hub.</span>
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

                {/* Replay */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Classer dans les Replays</span>
                    <span>Archive les diffusions et grands entretiens passés.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isReplay}
                      onChange={(e) => setIsReplay(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Publication */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Publier immédiatement</span>
                    <span>Rendre la vidéo visible publiquement sur le Studio.</span>
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

            {/* ====== RIGHT COLUMN: LIVE STUDIO PREVIEW ====== */}
            <div className="editor-right-col">
              <div className="live-preview-header">
                <div className="preview-live-dot"></div>
                Aperçu en direct — Studio Hub & Lecteur Public
              </div>

              <div className="live-preview-body">

                {/* Video Card Player Simulation */}
                <div style={{
                  background: '#1C1B1B',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '16/9',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  marginBottom: '18px'
                }}>
                  {thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailUrl}
                      alt="Aperçu miniature"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1C1B1B 0%, #2A2828 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.3 }}>movie</span>
                    </div>
                  )}

                  {/* Player Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.3s'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#A30626',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(163,6,38,0.4)'
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20" />
                      </svg>
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    {isFeatured && (
                      <span style={{ background: '#A30626', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '3px 7px', borderRadius: '2px', letterSpacing: '0.08em' }}>
                        À LA UNE
                      </span>
                    )}
                    {isHD && (
                      <span style={{ background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '3px 7px', borderRadius: '2px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        HD 4K
                      </span>
                    )}
                  </div>

                  {/* Top Right: VIP Lock */}
                  {isVipOnly && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(180, 140, 60, 0.9)', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>lock</span>
                      VIP
                    </div>
                  )}

                  {/* Bottom Duration Badge */}
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#FFFFFF', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '2px', backdropFilter: 'blur(4px)' }}>
                    {duration || '24 MIN'}
                  </div>
                </div>

                {/* Category & Badge */}
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
                  {title || <span style={{ color: '#CCCCCC', fontStyle: 'italic', fontSize: '18px' }}>Titre de la vidéo...</span>}
                </h1>

                {/* Subtitle Preview */}
                {subtitle && (
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
                    {subtitle}
                  </p>
                )}

                {/* Meta summary card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '14px', marginTop: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#888888', marginBottom: '8px' }}>
                    Paramètres de lecture
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#6B7280' }}>Source : </span>
                      <strong>{sourceType === 'url' ? 'Lien Externe' : (sourceType === 'hls' ? 'Flux HLS' : 'Upload MP4')}</strong>
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
                      <span style={{ color: '#6B7280' }}>Durée : </span>
                      <strong>{duration || 'Non définie'}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>

        {/* Media Picker Modal for Thumbnails */}
        <MediaPickerModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
        />
      </div>
    </div>
  );
}

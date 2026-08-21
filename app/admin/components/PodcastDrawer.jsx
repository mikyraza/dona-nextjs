"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MediaPickerModal = dynamic(() => import('./MediaPickerModal'), { ssr: false });

const LABELS = [
  'GRAND ENTRETIEN',
  'DÉCRYPTAGE',
  'CHRONIQUE',
  'MASTERCLASS AUDIO',
  'TABLE RONDE',
  'IMMERSION',
  'REPORTAGE',
  'DOCUMENTAIRE AUDIO'
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

export default function PodcastDrawer({ isOpen, onClose, onSave, podcast }) {
  const [title, setTitle] = useState('');
  const [episode, setEpisode] = useState('');
  const [host, setHost] = useState('Alexandre Vaugirard');
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState('38:00');
  const [status, setStatus] = useState('Draft');
  const [isVipOnly, setIsVipOnly] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLossless, setIsLossless] = useState(true);
  const [magazine, setMagazine] = useState('general');
  const [category, setCategory] = useState('Culture');
  const [label, setLabel] = useState('GRAND ENTRETIEN');

  // Media & Cover
  const [coverUrl, setCoverUrl] = useState('');
  const [coverFileName, setCoverFileName] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Audio source: 'upload' | 'url' | 'stream'
  const [sourceType, setSourceType] = useState('upload');
  const [audioUrl, setAudioUrl] = useState('');
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
        console.warn("Could not fetch magazines for podcast drawer", e);
      }
    }

    if (isOpen) {
      loadMagazines();
    }
  }, [isOpen]);

  // Helper for dynamic rubriques per magazine
  const getRubriquesForMagazine = (magId) => {
    if (!magId || magId === 'general') {
      return DEFAULT_UNIVERSES[0].rubriques;
    }
    const found = magazinesList.find(m => m.id === magId || m.slug === magId || (m.name && m.name.toLowerCase().includes(magId.toLowerCase())));
    if (found && found.rubriques?.length > 0) {
      return found.rubriques;
    }
    const defaultFound = DEFAULT_UNIVERSES.find(u => u.id === magId || u.slug === magId);
    return defaultFound?.rubriques || ["Général", "Culture", "Économie", "Masterclass"];
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
    if (podcast) {
      setTitle(podcast.title || '');
      setEpisode(podcast.episode || '');
      setHost(podcast.host || 'Alexandre Vaugirard');
      setSummary(podcast.summary || podcast.desc || '');
      setDuration(podcast.duration || '38:00');
      setStatus(podcast.status || 'Draft');
      setIsVipOnly(podcast.isVipOnly || false);
      setIsFeatured(podcast.isFeatured || false);
      setIsLossless(podcast.isLossless ?? true);

      // Resolve magazine & category
      const targetMag = podcast.magazine || podcast.universe || 'general';
      setMagazine(targetMag);
      const availableRubriques = getRubriquesForMagazine(targetMag);
      setCategory(podcast.category && availableRubriques.includes(podcast.category) ? podcast.category : (podcast.category || availableRubriques[0] || 'Culture'));

      setLabel(podcast.label || 'GRAND ENTRETIEN');
      setCoverUrl(podcast.coverImage || podcast.thumbnailUrl || '');
      setCoverFileName(podcast.coverImage ? podcast.coverImage.split('/').pop() : '');

      const src = podcast.source || (podcast.audioFile && !podcast.audioFile.startsWith('http') ? 'upload' : 'url');
      setSourceType(src);

      if (src === 'upload' || (podcast.audioFile && !podcast.audioFile.startsWith('http'))) {
        setSourceType('upload');
        setFileName(podcast.audioFile || '');
        setAudioUrl('');
        setUploadProgress(podcast.audioFile ? 100 : 0);
      } else {
        setAudioUrl(podcast.audioFile || podcast.audioUrl || '');
        setFileName('');
        setUploadProgress(0);
      }
      setIsUploading(false);
    } else {
      resetForm();
    }
  }, [podcast, isOpen]);

  function resetForm() {
    setTitle('');
    setEpisode('');
    setHost('Alexandre Vaugirard');
    setSummary('');
    setDuration('38:00');
    setStatus('Draft');
    setIsVipOnly(false);
    setIsFeatured(false);
    setIsLossless(true);
    setMagazine('general');
    setCategory('Culture');
    setLabel('GRAND ENTRETIEN');
    setCoverUrl('');
    setCoverFileName('');
    setSourceType('upload');
    setAudioUrl('');
    setFileName('');
    setUploadProgress(0);
    setIsUploading(false);
  }

  if (!isOpen) return null;

  // Handle audio upload via /api/media
  const handleAudioChange = async (e) => {
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
        setAudioUrl(data.url);
      } else {
        alert(`Erreur: ${data.error || "Téléversement échoué"}`);
        setUploadProgress(0);
      }
    } catch (err) {
      clearInterval(interval);
      console.error("Upload error:", err);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !episode.trim()) return;

    const selectedMagObj = magazinesList.find(m => m.id === magazine);
    const magDisplayName = selectedMagObj && selectedMagObj.id !== 'general' ? selectedMagObj.name : '';

    const payload = {
      id: podcast?.id || `pod-${Date.now()}`,
      title: title.trim(),
      episode: episode.trim() || title.trim(),
      host: host.trim(),
      summary: summary.trim(),
      desc: summary.trim(),
      duration: duration.trim() || '38:00',
      status,
      isVipOnly,
      isFeatured,
      isLossless,
      category: category || 'Culture',
      rubrique: category || 'Culture',
      magazine: magDisplayName,
      universe: magazine,
      label,
      source: sourceType,
      audioFile: sourceType === 'upload' ? fileName : audioUrl,
      audioUrl: sourceType === 'upload' ? fileName : audioUrl,
      coverImage: coverUrl || '/assets/core/img/ecouter-1.png',
      thumbnailUrl: coverUrl || '/assets/core/img/ecouter-1.png',
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
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--admin-accent-color)' }}>podcasts</span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {podcast ? "Modifier l'épisode" : "Nouvel Épisode / Podcast"}
            </h2>
            {(title || episode) && (
              <span style={{ fontSize: '12px', color: '#9CA3AF', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                — {episode || title}
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
              disabled={isSaving || isUploading || (!title.trim() && !episode.trim())}
              style={{ padding: '7px 16px', fontSize: '12px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {status === 'Published' ? 'publish' : 'save'}
              </span>
              {status === 'Published' ? (podcast ? "Mettre à jour" : "Publier") : "Enregistrer brouillon"}
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

              {/* SECTION 1: IDENTITÉ DU PODCAST */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">mic_external_on</span>
                  Identité de l'émission & Podcast
                </div>

                {/* Main Show Title */}
                <input
                  className="editor-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nom de la série ou de l'émission audio (ex: The Brief, Le Grand Entretien...)"
                  required
                  autoFocus
                  style={{ marginBottom: '16px' }}
                />

                {/* Row 1: Univers / Magazine & Rubrique / Catégorie dynamique */}
                <div className="editor-meta-row" style={{ marginBottom: '14px' }}>
                  <div className="editor-meta-field">
                    <label htmlFor="pod-magazine">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>menu_book</span>
                      1. Univers / Magazine
                    </label>
                    <select
                      id="pod-magazine"
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
                    <label htmlFor="pod-category">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>category</span>
                      2. Rubrique / Catégorie ({currentRubriques.length})
                    </label>
                    <select
                      id="pod-category"
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

                {/* Row 2: Hôte & Durée (Gauche) + Résumé élargi (Droite pour couvrir tout l'espace) */}
                <div className="editor-meta-row" style={{ marginBottom: '14px', alignItems: 'stretch' }}>
                  
                  {/* Colonne gauche : Hôte + Durée */}
                  <div className="editor-meta-field" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label htmlFor="pod-host">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>record_voice_over</span>
                        3. Hôte / Voix de l'émission
                      </label>
                      <input
                        id="pod-host"
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        placeholder="ex: Alexandre Vaugirard"
                        required
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="pod-duration">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>timer</span>
                        4. Durée de l'épisode
                      </label>
                      <input
                        id="pod-duration"
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="ex: 38:00 ou 45 MIN"
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Colonne droite : Résumé de l'épisode (Élargi) */}
                  <div className="editor-meta-field" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="pod-summary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>short_text</span>
                        Résumé / Chapeau de l'épisode
                      </span>
                      <span style={{ fontSize: '9px', color: '#888888', fontWeight: 500 }}>
                        Extrait public affiché dans le lecteur audio
                      </span>
                    </label>
                    <textarea
                      id="pod-summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Saisissez le résumé éditorial, les thèmes abordés ou le synopsis de cet épisode..."
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

                {/* Row 3: Titre de l'épisode & Badge éditorial */}
                <div className="editor-meta-row" style={{ marginBottom: '14px' }}>
                  <div className="editor-meta-field">
                    <label htmlFor="pod-episode">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>tag</span>
                      5. Titre ou Numéro d'épisode
                    </label>
                    <input
                      id="pod-episode"
                      type="text"
                      value={episode}
                      onChange={(e) => setEpisode(e.target.value)}
                      placeholder="ex: Épisode 12: L'Architecture du Silence"
                      required
                    />
                  </div>
                  <div className="editor-meta-field">
                    <label htmlFor="pod-label">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>label</span>
                      6. Format & Badge éditorial
                    </label>
                    <select
                      id="pod-label"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      style={{ fontWeight: '600' }}
                    >
                      {LABELS.map((lbl) => (
                        <option key={lbl} value={lbl}>{lbl}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* SECTION 2: MÉDIA & SOURCE AUDIO */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">library_music</span>
                  Pochette & Fichier Audio Master
                </div>

                {/* Cover / Pochette */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '6px' }}>
                    Pochette / Visuel de l'épisode (Format Carré)
                  </div>
                  {coverUrl ? (
                    <div className="media-compact-row">
                      <div className="media-compact-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverUrl} alt="Pochette Podcast" />
                      </div>
                      <div className="media-compact-info">
                        <div className="media-compact-filename">{coverFileName || 'pochette-podcast.jpg'}</div>
                        <div style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span>
                          Visuel configuré
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
                    <button type="button" className="cover-placeholder-btn" onClick={() => setIsMediaModalOpen(true)}>
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                      Choisir une pochette depuis la médiathèque
                    </button>
                  )}
                </div>

                {/* Source Audio Segmented Tabs */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '6px' }}>
                    Source du fichier audio
                  </div>
                  <div className="editor-format-tabs" style={{ marginBottom: '12px' }}>
                    <button
                      type="button"
                      className={`editor-format-tab ${sourceType === 'upload' ? 'active' : ''}`}
                      onClick={() => setSourceType('upload')}
                    >
                      <span className="material-symbols-outlined">upload_file</span>
                      Téléverser Fichier Audio (.mp3, .wav, .aac)
                    </button>
                    <button
                      type="button"
                      className={`editor-format-tab ${sourceType === 'url' ? 'active' : ''}`}
                      onClick={() => setSourceType('url')}
                    >
                      <span className="material-symbols-outlined">link</span>
                      URL Externe (CDN / SoundCloud / Flux RSS)
                    </button>
                    <button
                      type="button"
                      className={`editor-format-tab ${sourceType === 'stream' ? 'active' : ''}`}
                      onClick={() => setSourceType('stream')}
                    >
                      <span className="material-symbols-outlined">radio</span>
                      Flux HLS / Live Radio
                    </button>
                  </div>

                  {sourceType === 'upload' && (
                    <div>
                      <div className="media-drag-drop-zone audio-zone" style={{ padding: '24px 16px' }}>
                        <input
                          type="file"
                          id="pod-audio-file"
                          accept="audio/mpeg,audio/wav,audio/aac,audio/mp4"
                          style={{ display: 'none' }}
                          onChange={handleAudioChange}
                        />
                        <label htmlFor="pod-audio-file" className="drag-drop-label" style={{ cursor: 'pointer' }}>
                          <span className="material-symbols-outlined drag-drop-icon" style={{ fontSize: '32px', color: 'var(--admin-accent-color)' }}>mic</span>
                          <span style={{ fontSize: '13px' }}>Glissez-déposez le fichier audio master ou <strong>cliquez pour parcourir</strong></span>
                          <span style={{ fontSize: '11px', color: '#888888', marginTop: '4px' }}>Formats acceptés : MP3, WAV, AAC — Max 150 Mo</span>
                        </label>
                      </div>

                      {fileName && (
                        <div className="file-upload-status-card" style={{ marginTop: '10px', padding: '10px 14px', background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                          <div className="file-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="material-symbols-outlined" style={{ color: 'var(--admin-accent-color)', fontSize: '20px' }}>volume_up</span>
                              <span style={{ fontSize: '12px', fontWeight: 600 }}>{fileName}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>{uploadProgress}%</span>
                          </div>
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="upload-mini-progress" style={{ marginTop: '6px' }}>
                              <div className="upload-mini-progress-fill" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          )}
                          {uploadProgress === 100 && (
                            <div style={{ marginTop: '6px', fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>check_circle</span>
                              Piste audio encodée et prête pour diffusion
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {(sourceType === 'url' || sourceType === 'stream') && (
                    <div>
                      <input
                        type="url"
                        className="editor-title-input"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        placeholder={sourceType === 'stream' ? "https://stream.donamagazine.com/radio/audio.m3u8" : "https://cdn.donamagazine.com/podcasts/episode-12.mp3"}
                        style={{ fontSize: '13px', fontWeight: 400, padding: '10px 12px' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: OPTIONS DE DIFFUSION */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">tune</span>
                  Options de diffusion & Accès
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

                {/* À la Une */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Mettre à la Une dans le Hub Écouter</span>
                    <span>Positionne ce podcast en avant-plan dans le lecteur principal.</span>
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

                {/* Haute Fidélité / Lossless */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Audio Haute Définition (Lossless Master)</span>
                    <span>Bénéficie d'un traitement acoustique binaural et spatialisé.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isLossless}
                      onChange={(e) => setIsLossless(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Publication */}
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Publier immédiatement</span>
                    <span>Rendre le podcast accessible aux auditeurs du site.</span>
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

            {/* ====== RIGHT COLUMN: LIVE AUDIO PLAYER PREVIEW ====== */}
            <div className="editor-right-col">
              <div className="live-preview-header">
                <div className="preview-live-dot"></div>
                Aperçu en direct — Hub Écouter & Lecteur Audio
              </div>

              <div className="live-preview-body">

                {/* Vinyl / Cover Art Player Card Simulation */}
                <div style={{
                  background: '#1C1B1B',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  marginBottom: '18px',
                  color: '#FFFFFF'
                }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    
                    {/* Square Artwork */}
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      background: '#2A2828'
                    }}>
                      {coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coverUrl} alt="Pochette" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '36px', opacity: 0.3 }}>podcasts</span>
                        </div>
                      )}
                    </div>

                    {/* Meta and Player Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                        {isFeatured && (
                          <span style={{ background: '#A30626', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '2px' }}>
                            À LA UNE
                          </span>
                        )}
                        {isLossless && (
                          <span style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '2px' }}>
                            HI-FI LOSSLESS
                          </span>
                        )}
                        {isVipOnly && (
                          <span style={{ background: 'rgba(180, 140, 60, 0.9)', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>lock</span> VIP
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {title || 'Émission DONA'}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        {episode || 'Titre de l’épisode...'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                        Par {host || 'Alexandre Vaugirard'}
                      </div>
                    </div>
                  </div>

                  {/* Waveform Sound Bar Simulation */}
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#A30626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#FFFFFF', marginLeft: '2px' }}>play_arrow</span>
                      </div>

                      {/* Fake Progress / Waveform */}
                      <div style={{ flex: 1 }}>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                          <div style={{ width: '35%', height: '100%', background: '#A30626' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontFamily: 'monospace' }}>
                          <span>00:00</span>
                          <span>{duration || '38:00'}</span>
                        </div>
                      </div>
                    </div>
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

                {/* Episode Title Preview */}
                <h1 className="preview-title" style={{ fontSize: '22px', marginBottom: '6px' }}>
                  {episode || title || <span style={{ color: '#CCCCCC', fontStyle: 'italic', fontSize: '18px' }}>Titre du podcast...</span>}
                </h1>

                {/* Summary / Chapeau Preview */}
                {summary && (
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
                    {summary}
                  </p>
                )}

                {/* Audio Details Meta Box */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '14px', marginTop: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#888888', marginBottom: '8px' }}>
                    Paramètres de diffusion audio
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#6B7280' }}>Source : </span>
                      <strong>{sourceType === 'upload' ? 'Fichier Audio Local' : (sourceType === 'stream' ? 'Flux HLS Radio' : 'Lien Externe')}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280' }}>Accès : </span>
                      <strong style={{ color: isVipOnly ? '#B08D57' : '#059669' }}>{isVipOnly ? '👑 Membres VIP' : '🌐 Public'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280' }}>Hôte : </span>
                      <strong>{host || 'Alexandre Vaugirard'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280' }}>Durée : </span>
                      <strong>{duration || '38:00'}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>

        {/* Media Picker Modal for Artwork */}
        <MediaPickerModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
        />
      </div>
    </div>
  );
}

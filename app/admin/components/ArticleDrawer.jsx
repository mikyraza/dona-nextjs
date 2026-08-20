"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const MediaPickerModal = dynamic(() => import('./MediaPickerModal'), { ssr: false });

// Default 16 official magazine universes with fallback rubriques/subcategories
const DEFAULT_UNIVERSES = [
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

export const UNIVERSES = DEFAULT_UNIVERSES;

export default function ArticleDrawer({ isOpen, onClose, onSave, article }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Elena Moretti');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('intelligence');
  const [rubrique, setRubrique] = useState('The Brief');
  const [content, setContent] = useState('');
  const [isVipOnly, setIsVipOnly] = useState(false);
  const [status, setStatus] = useState('Draft');
  const [magazinesList, setMagazinesList] = useState(DEFAULT_UNIVERSES);
  
  // Dynamic Format Selection
  const [format, setFormat] = useState('text'); // 'text' | 'video' | 'audio'

  // Cover Image Upload States
  const [coverImage, setCoverImage] = useState('');
  const [coverImageFileName, setCoverImageFileName] = useState('');
  const [coverImageUploadProgress, setCoverImageUploadProgress] = useState(0);
  const [coverImageIsUploading, setCoverImageIsUploading] = useState(false);

  // Gallery Upload States
  const [articleGallery, setArticleGallery] = useState([]);
  const [galleryIsUploading, setGalleryIsUploading] = useState(false);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState(0);

  // Video Upload States
  const [videoSourceType, setVideoSourceType] = useState('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoIsUploading, setVideoIsUploading] = useState(false);

  // Audio Upload States
  const [audioFileName, setAudioFileName] = useState('');
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
  const [audioIsUploading, setAudioIsUploading] = useState(false);

  // Media Picker Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalTarget, setMediaModalTarget] = useState(null); // 'cover' | 'gallery' | 'video' | 'audio' | 'editor'

  const editorRef = useRef(null);

  // Fetch dynamic magazines on open
  useEffect(() => {
    async function loadMagazines() {
      try {
        const res = await fetch('/api/admin/magazines');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(m => {
              const defaultUniv = DEFAULT_UNIVERSES.find(u => 
                u.slug === m.slug || 
                (m.slug && m.slug.includes(u.id)) ||
                (m.title && u.name.toLowerCase().includes(m.title.toLowerCase()))
              );
              
              // Extract subcategories from features and tabs
              const customRubriques = [];
              if (Array.isArray(m.features)) {
                m.features.forEach(f => {
                  if (f.title && !customRubriques.includes(f.title)) customRubriques.push(f.title);
                });
              }
              if (Array.isArray(m.tabs)) {
                m.tabs.forEach(t => {
                  if (t.name && !customRubriques.includes(t.name)) customRubriques.push(t.name);
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
            });
            setMagazinesList(mapped);
          }
        }
      } catch (err) {
        console.warn("Could not fetch dynamic magazines, using default universes:", err);
      }
    }

    if (isOpen) {
      loadMagazines();
    }
  }, [isOpen]);

  // Helper to get rubriques for current magazine
  const getRubriquesForMagazine = (magId) => {
    const found = magazinesList.find(m => m.id === magId || m.slug === magId || m.name.toLowerCase().includes(magId.toLowerCase()));
    if (found && found.rubriques?.length > 0) {
      return found.rubriques;
    }
    const defaultFound = DEFAULT_UNIVERSES.find(u => u.id === magId);
    return defaultFound?.rubriques || ["Général"];
  };

  // Sync state when article prop changes (Edit vs Create mode)
  useEffect(() => {
    let initialContent = '';
    if (article) {
      setTitle(article.title || '');
      setAuthor(article.author || 'Elena Moretti');
      setSummary(article.summary || article.desc || '');
      setCoverImage(article.coverImage || '');
      setCoverImageFileName(article.coverImage ? article.coverImage.split('/').pop() : '');
      setCoverImageUploadProgress(article.coverImage ? 100 : 0);
      setCoverImageIsUploading(false);
      const galleryData = article.articleGallery || article.galerie_photos || [];
      const parsedGallery = galleryData.map(item => {
        if (typeof item === 'string') {
          return { url: item, caption: '' };
        }
        return { url: item.url || '', caption: item.caption || '' };
      });
      setArticleGallery(parsedGallery);
      setGalleryIsUploading(false);
      setGalleryUploadProgress(0);
      
      // Match category slug
      const categoryLower = (article.category || article.type || 'intelligence').toLowerCase();
      const matchedUniverse = DEFAULT_UNIVERSES.find(u => 
        categoryLower.includes(u.id) || u.name.toLowerCase().includes(categoryLower)
      );
      const matchedId = matchedUniverse ? matchedUniverse.id : 'intelligence';
      setCategory(matchedId);
      
      // Match rubrique / subcategory
      const availableRubriques = getRubriquesForMagazine(matchedId);
      const initialRubrique = article.rubrique || article.subcategory || article.badge || (availableRubriques[0] || 'The Brief');
      setRubrique(initialRubrique);

      initialContent = article.content || '';
      setIsVipOnly(article.isVipOnly || false);
      setStatus(article.status || 'Draft');
      
      // Detect Format from initial values
      if (article.format) {
        setFormat(article.format);
      } else if (article.videoUrl || (article.url && article.type === "Vidéo")) {
        setFormat('video');
        setVideoUrl(article.videoUrl || article.url || '');
        setVideoSourceType('url');
      } else if (article.audioFile || (article.url && article.type === "Podcast")) {
        setFormat('audio');
        setAudioFileName(article.audioFile || article.url || '');
      } else {
        setFormat('text');
      }
    } else {
      // Reset form for new article
      setTitle('');
      setAuthor('Elena Moretti');
      setSummary('');
      setCategory('intelligence');
      const defaultRubriques = getRubriquesForMagazine('intelligence');
      setRubrique(defaultRubriques[0] || 'The Brief');
      setCoverImage('');
      setCoverImageFileName('');
      setCoverImageUploadProgress(0);
      setCoverImageIsUploading(false);
      setArticleGallery([]);
      setGalleryIsUploading(false);
      setGalleryUploadProgress(0);
      initialContent = '';
      setIsVipOnly(false);
      setFormat('text');
      setVideoSourceType('url');
      setVideoUrl('');
      setVideoFileName('');
      setAudioFileName('');
      setVideoUploadProgress(0);
      setAudioUploadProgress(0);
    }

    setContent(initialContent);
    
    // Sync the contentEditable div content manually to avoid cursor jumps
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [article, isOpen]);

  // Handle Magazine Universe Change
  const handleCategoryChange = (newCatId) => {
    setCategory(newCatId);
    const available = getRubriquesForMagazine(newCatId);
    if (!available.includes(rubrique)) {
      setRubrique(available[0] || "Général");
    }
  };

  if (!isOpen) return null;

  const handleRemoveGalleryImage = (indexToRemove) => {
    setArticleGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle rich text editor command - preserve onMouseDown to keep focus
  const execEditorCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Prompts for adding dynamic hyperlinks
  const handleAddLink = () => {
    const url = prompt("Entrez l'adresse URL du lien :");
    if (url) {
      execEditorCommand('createLink', url);
    }
  };

  const handleEditorInput = (e) => {
    setContent(e.target.innerHTML);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formatMeta = {};
    if (format === 'video') {
      formatMeta.videoUrl = videoSourceType === 'url' ? videoUrl : `Fichier : ${videoFileName}`;
      formatMeta.videoSourceType = videoSourceType;
    } else if (format === 'audio') {
      formatMeta.audioFile = audioFileName;
    }

    const currentMag = magazinesList.find(m => m.id === category || m.slug === category);
    onSave({
      id: article?.id || `art-${Date.now()}`,
      title,
      author,
      summary,
      desc: summary || (content ? content.replace(/<[^>]*>?/gm, '').substring(0, 160) : ""),
      category: currentMag?.name || category,
      rubrique: rubrique,
      subcategory: rubrique,
      badge: (rubrique || 'ARTICLE').toUpperCase(),
      content,
      format,
      coverImage,
      articleGallery,
      galerie_photos: articleGallery,
      ...formatMeta,
      status: status,
      isVipOnly,
      updated: "À l'instant"
    });

    onClose();
  };

  // Derived display values for preview
  const currentMag = magazinesList.find(m => m.id === category || m.slug === category);
  const currentRubriques = getRubriquesForMagazine(category);
  const categoryLabel = currentMag?.name ? currentMag.name.replace(/^[0-9]+\.\s*/, '').trim() : category;
  const previewDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

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
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--admin-accent-color)' }}>edit_note</span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {article ? "Modifier l'article" : "Nouvel Article"}
            </h2>
            {title && (
              <span style={{ fontSize: '12px', color: '#9CA3AF', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                — {title}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            
            {/* Status Toggle in Header for better visibility */}
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
              disabled={videoIsUploading || audioIsUploading || !title.trim()}
              style={{ padding: '7px 16px', fontSize: '12px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {status === 'Published' ? 'publish' : 'save'}
              </span>
              {status === 'Published' ? (article ? "Mettre à jour" : "Publier") : "Enregistrer brouillon"}
            </button>
            <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* SPLIT BODY */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'hidden', display: 'flex', height: 'calc(100% - 56px)' }}>
          <div className="article-editor-split" style={{ flex: 1 }}>

            {/* ====== LEFT COLUMN: EDITOR ====== */}
            <div className="editor-left-col">

              {/* SECTION 1: IDENTITÉ */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">badge</span>
                  Identité de l&apos;article
                </div>

                {/* Title */}
                <input
                  className="editor-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de l'article..."
                  required
                  autoFocus
                  style={{ marginBottom: '16px' }}
                />

                {/* 1. Univers/Magazine & 2. Catégorie/Rubrique */}
                <div className="editor-meta-row" style={{ marginBottom: '14px' }}>
                  <div className="editor-meta-field">
                    <label htmlFor="ed-category">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>menu_book</span>
                      1. Univers / Magazine
                    </label>
                    <select
                      id="ed-category"
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      style={{ fontWeight: '600' }}
                    >
                      {magazinesList.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="editor-meta-field">
                    <label htmlFor="ed-rubrique">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>category</span>
                      2. Rubrique / Catégorie ({currentRubriques.length})
                    </label>
                    <select
                      id="ed-rubrique"
                      value={rubrique}
                      onChange={(e) => setRubrique(e.target.value)}
                      style={{ fontWeight: '600', borderColor: 'var(--admin-accent-color)' }}
                    >
                      {currentRubriques.map((rub) => (
                        <option key={rub} value={rub}>{rub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Auteur */}
                <div className="editor-meta-row" style={{ marginBottom: '14px' }}>
                  <div className="editor-meta-field">
                    <label htmlFor="ed-author">Auteur de la publication</label>
                    <input
                      id="ed-author"
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Nom de l'auteur"
                      required
                    />
                  </div>
                </div>

                {/* Résumé / Chapeau */}
                <div className="editor-meta-row" style={{ marginBottom: '14px' }}>
                  <div className="editor-meta-field" style={{ width: '100%' }}>
                    <label htmlFor="ed-summary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>short_text</span>
                        Résumé / Chapeau
                      </span>
                      <span style={{ fontSize: '10px', color: '#888888', fontWeight: 500 }}>
                        Visible par tous les utilisateurs (Extrait public)
                      </span>
                    </label>
                    <textarea
                      id="ed-summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Saisissez un résumé ou chapeau éditorial clair (accessible aux utilisateurs standards avant le déblocage VIP)..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '4px',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>


                {/* Format tabs */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '6px' }}>Format</div>
                  <div className="editor-format-tabs">
                    <button type="button" className={`editor-format-tab ${format === 'text' ? 'active' : ''}`} onClick={() => setFormat('text')}>
                      <span className="material-symbols-outlined">article</span>
                      Texte
                    </button>
                    <button type="button" className={`editor-format-tab ${format === 'video' ? 'active' : ''}`} onClick={() => setFormat('video')}>
                      <span className="material-symbols-outlined">videocam</span>
                      Vidéo
                    </button>
                    <button type="button" className={`editor-format-tab ${format === 'audio' ? 'active' : ''}`} onClick={() => setFormat('audio')}>
                      <span className="material-symbols-outlined">mic</span>
                      Audio
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: MÉDIAS (thumbnails compacts uniquement) */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">perm_media</span>
                  Médias
                </div>

                {/* Cover Image compact */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '6px' }}>Image à la une</div>
                  {coverImage ? (
                    <div className="media-compact-row">
                      <div className="media-compact-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverImage} alt="Couverture" />
                      </div>
                      <div className="media-compact-info">
                        <div className="media-compact-filename">{coverImageFileName || 'image-couverture.jpg'}</div>
                        {coverImageIsUploading ? (
                          <div className="upload-mini-progress">
                            <div className="upload-mini-progress-fill" style={{ width: `${coverImageUploadProgress}%` }} />
                          </div>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span>
                            Image configurée
                          </div>
                        )}
                        <div className="media-compact-actions" style={{ marginTop: '6px' }}>
                          <button type="button" className="btn-media-action" onClick={() => { setMediaModalTarget('cover'); setIsMediaModalOpen(true); }}>
                            Changer
                          </button>
                          <button type="button" className="btn-media-action danger" onClick={() => { setCoverImage(''); setCoverImageFileName(''); setCoverImageUploadProgress(0); }}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="cover-placeholder-btn" onClick={() => { setMediaModalTarget('cover'); setIsMediaModalOpen(true); }}>
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                      Choisir depuis la médiathèque
                    </button>
                  )}
                </div>

                {/* Gallery compact strip */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Galerie ({articleGallery.length} photo{articleGallery.length !== 1 ? 's' : ''})</span>
                    {galleryIsUploading && <span style={{ fontSize: '10px', color: 'var(--admin-accent-color)' }}>Envoi {galleryUploadProgress}%...</span>}
                  </div>
                  <div className="gallery-compact-strip">
                    {articleGallery.map((item, idx) => (
                      <div key={idx} className="gallery-compact-item">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url} alt={`Photo ${idx + 1}`} />
                        <button
                          type="button"
                          className="gallery-compact-item-delete"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          title="Supprimer"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="gallery-add-btn"
                      onClick={() => { setMediaModalTarget('gallery'); setIsMediaModalOpen(true); }}
                      title="Ajouter depuis la médiathèque"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>

                {/* Video source (if format = video) */}
                {format === 'video' && (
                  <div style={{ marginTop: '14px', borderTop: '1px solid #EAEAEA', paddingTop: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '8px' }}>Source Vidéo</div>
                    <div className="editor-format-tabs" style={{ marginBottom: '10px' }}>
                      <button type="button" className={`editor-format-tab ${videoSourceType === 'url' ? 'active' : ''}`} onClick={() => setVideoSourceType('url')}>
                        <span className="material-symbols-outlined">link</span>
                        Lien externe
                      </button>
                      <button type="button" className={`editor-format-tab ${videoSourceType === 'upload' ? 'active' : ''}`} onClick={() => setVideoSourceType('upload')}>
                        <span className="material-symbols-outlined">upload</span>
                        Uploader
                      </button>
                    </div>
                    {videoSourceType === 'url' ? (
                      <input
                        type="url"
                        className="drawer-text-input"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    ) : (
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>Le fichier sélectionné sera uploadé lors de la sauvegarde.</div>
                        <button type="button" className="cover-placeholder-btn" onClick={() => { setMediaModalTarget('video'); setIsMediaModalOpen(true); }}>
                          <span className="material-symbols-outlined">videocam</span>
                          {videoFileName ? videoFileName : 'Choisir une vidéo depuis la médiathèque'}
                        </button>
                        {videoUploadProgress > 0 && videoUploadProgress < 100 && (
                          <div className="upload-mini-progress" style={{ marginTop: '6px' }}>
                            <div className="upload-mini-progress-fill" style={{ width: `${videoUploadProgress}%` }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Audio source (if format = audio) */}
                {format === 'audio' && (
                  <div style={{ marginTop: '14px', borderTop: '1px solid #EAEAEA', paddingTop: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '8px' }}>Piste Audio</div>
                    <button type="button" className="cover-placeholder-btn" onClick={() => { setMediaModalTarget('audio'); setIsMediaModalOpen(true); }}>
                      <span className="material-symbols-outlined">mic</span>
                      {audioFileName ? audioFileName.split('/').pop() : 'Choisir un fichier audio depuis la médiathèque'}
                    </button>
                    {audioUploadProgress > 0 && audioUploadProgress < 100 && (
                      <div className="upload-mini-progress" style={{ marginTop: '6px' }}>
                        <div className="upload-mini-progress-fill" style={{ width: `${audioUploadProgress}%` }} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 3: CONTENU ÉDITORIAL */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">edit</span>
                  Contenu éditorial
                </div>

                {/* Inline asset helper — compact bar above editor */}
                {(coverImage || articleGallery.length > 0) && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px', padding: '8px', background: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', alignSelf: 'center', marginRight: '4px' }}>
                      Insérer :
                    </span>
                    {coverImage && (
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (editorRef.current) {
                            document.execCommand('insertImage', false, coverImage);
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, padding: '3px 7px', border: '1px solid #EAEAEA', borderRadius: '3px', background: '#FAF9F6', cursor: 'pointer', color: '#374151' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverImage} alt="" style={{ width: '16px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
                        Couverture
                      </button>
                    )}
                    {articleGallery.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (editorRef.current) {
                            document.execCommand('insertImage', false, item.url);
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, padding: '3px 7px', border: '1px solid #EAEAEA', borderRadius: '3px', background: '#FAF9F6', cursor: 'pointer', color: '#374151' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url} alt="" style={{ width: '16px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
                        Photo {idx + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* WYSIWYG toolbar */}
                <div className="rich-editor-container">
                  <div className="rich-editor-toolbar">
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execEditorCommand('bold')} className="toolbar-btn" title="Gras">
                      <span className="material-symbols-outlined">format_bold</span>
                    </button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execEditorCommand('italic')} className="toolbar-btn" title="Italique">
                      <span className="material-symbols-outlined">format_italic</span>
                    </button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execEditorCommand('underline')} className="toolbar-btn" title="Souligné">
                      <span className="material-symbols-outlined">format_underlined</span>
                    </button>

                    <span className="toolbar-divider"></span>

                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execEditorCommand('formatBlock', '<h2>')} className="toolbar-btn" title="Titre H2">
                      <span className="material-symbols-outlined">title</span>
                    </button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execEditorCommand('formatBlock', '<blockquote>')} className="toolbar-btn" title="Citation">
                      <span className="material-symbols-outlined">format_quote</span>
                    </button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execEditorCommand('insertUnorderedList')} className="toolbar-btn" title="Liste à puces">
                      <span className="material-symbols-outlined">format_list_bulleted</span>
                    </button>

                    <span className="toolbar-divider"></span>

                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setMediaModalTarget('editor'); setIsMediaModalOpen(true); }} className="toolbar-btn" title="Insérer une image">
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                    </button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={handleAddLink} className="toolbar-btn" title="Insérer un lien">
                      <span className="material-symbols-outlined">link</span>
                    </button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execEditorCommand('removeFormat')} className="toolbar-btn" title="Effacer les styles">
                      <span className="material-symbols-outlined">format_clear</span>
                    </button>
                  </div>

                  <div
                    ref={editorRef}
                    className="editor-wysiwyg-area"
                    contentEditable={true}
                    onInput={handleEditorInput}
                    placeholder="Écrivez le corps de l'article ici..."
                  />
                </div>
              </div>

              {/* SECTION 4: OPTIONS */}
              <div className="editor-section">
                <div className="editor-section-title">
                  <span className="material-symbols-outlined">tune</span>
                  Options de publication
                </div>
                <div className="editor-vip-toggle">
                  <div className="editor-vip-label">
                    <span>Accès VIP uniquement</span>
                    <span>Restreindre cet article aux membres abonnés au Club DONA.</span>
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
                <div className="editor-vip-toggle" style={{ marginTop: '12px' }}>
                  <div className="editor-vip-label">
                    <span>Publier l'article</span>
                    <span>Rendre l'article visible publiquement sur le site (sinon, il reste en brouillon).</span>
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

            {/* ====== RIGHT COLUMN: LIVE PREVIEW ====== */}
            <div className="editor-right-col">
              <div className="live-preview-header">
                <div className="preview-live-dot"></div>
                Aperçu en direct — Template Public
              </div>

              <div className="live-preview-body">

                {/* Badge + VIP */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="preview-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span>{categoryLabel.toUpperCase()}</span>
                    {rubrique && (
                      <>
                        <span style={{ opacity: 0.6, fontSize: '10px' }}>•</span>
                        <span style={{ fontWeight: 800, color: 'var(--admin-accent-color)' }}>{rubrique.toUpperCase()}</span>
                      </>
                    )}
                  </span>
                  {isVipOnly && (
                    <span className="preview-vip-badge">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span>
                      VIP
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="preview-title">
                  {title || <span style={{ color: '#CCCCCC', fontStyle: 'italic', fontSize: '20px' }}>Titre de l&apos;article...</span>}
                </h1>

                {/* Meta bar */}
                <div className="preview-meta-bar">
                  <span>PAR <strong>{(author || 'RÉDACTION').toUpperCase()}</strong></span>
                  <span>•</span>
                  <span>{previewDate}</span>
                  {format === 'audio' && <><span>•</span><span>🎙 PODCAST</span></>}
                  {format === 'video' && <><span>•</span><span>▶ VIDÉO</span></>}
                </div>

                {/* Résumé / Chapeau Preview */}
                {summary && (
                  <p className="preview-summary" style={{
                    fontStyle: 'italic',
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
                    <strong>Résumé : </strong>{summary}
                  </p>
                )}

                {/* Hero image — ratio 21:9 comme le template public */}
                {coverImage ? (
                  <div className="preview-hero-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImage} alt={title} />
                  </div>
                ) : (
                  <div className="preview-hero-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#CCCCCC', fontStyle: 'italic' }}>Image à la une (ratio 21:9)</span>
                  </div>
                )}

                {/* Video block */}
                {format === 'video' && (videoUrl || videoFileName) && (
                  <div className="preview-video-block">
                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#9CA3AF' }}>play_circle</span>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Lecteur Vidéo</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', wordBreak: 'break-all' }}>
                      {videoSourceType === 'url' ? videoUrl : videoFileName}
                    </div>
                  </div>
                )}

                {/* Audio block */}
                {format === 'audio' && audioFileName && (
                  <div className="preview-audio-block">
                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--admin-accent-color)' }}>play_circle</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#1F2937' }}>Podcast Audio</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{audioFileName.split('/').pop()}</div>
                    </div>
                  </div>
                )}

                {/* Article body */}
                {content ? (
                  <div
                    className="preview-article-body"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <p className="preview-empty-state">Commencez à écrire pour voir l&apos;aperçu ici...</p>
                )}

                {/* Gallery grid */}
                {articleGallery.length > 0 && (
                  <div className="preview-gallery-grid">
                    {articleGallery.map((item, idx) => (
                      <div key={idx} className="preview-gallery-item">
                        <div className="preview-gallery-item-img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt={item.caption || `Photo ${idx + 1}`} />
                        </div>
                        {item.caption && (
                          <span className="preview-gallery-item-caption">{item.caption}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* VIP Paywall preview */}
                {isVipOnly && (
                  <div className="preview-vip-banner">
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#B45309' }}>lock</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E' }}>Contenu Réservé aux Membres VIP</div>
                    <div style={{ fontSize: '11px', color: '#B45309' }}>Un mur d&apos;abonnement sera affiché à cet emplacement.</div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </form>
      </div>

      <MediaPickerModal 
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setMediaModalTarget(null);
        }}
        onSelect={(url) => {
          if (mediaModalTarget === 'cover') {
            setCoverImage(url);
            setCoverImageFileName(url.split('/').pop());
          } else if (mediaModalTarget === 'gallery') {
            setArticleGallery(prev => [...prev, { url, caption: '' }]);
          } else if (mediaModalTarget === 'video') {
            setVideoUrl(url);
            setVideoFileName(url.split('/').pop());
          } else if (mediaModalTarget === 'audio') {
            setAudioFileName(url.split('/').pop());
          } else if (mediaModalTarget === 'editor') {
            if (editorRef.current) {
              editorRef.current.focus();
              document.execCommand('insertImage', false, url);
              setContent(editorRef.current.innerHTML);
            }
          }
          setIsMediaModalOpen(false);
          setMediaModalTarget(null);
        }}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';

// The 16 official magazine universes
const UNIVERSES = [
  { id: "intelligence", name: "01. Intelligence" },
  { id: "power-lab", name: "02. Power Lab" },
  { id: "alliance", name: "03. L'Alliance" },
  { id: "agenda", name: "04. L'Agenda" },
  { id: "passions", name: "05. Passions" },
  { id: "art-de-vivre", name: "06. Art de Vivre" },
  { id: "academie", name: "07. Académie" },
  { id: "patrimoine", name: "08. Patrimoine" },
  { id: "longevity", name: "09. Longevity" },
  { id: "impact", name: "10. Impact" },
  { id: "culture-medias", name: "11. Culture & Médias" },
  { id: "cercle", name: "12. Le Cercle" },
  { id: "amour", name: "13. Amour" },
  { id: "beaute", name: "14. Beauté" },
  { id: "mariages", name: "15. Mariages" },
  { id: "sante", name: "16. Santé" }
];

export default function ArticleDrawer({ isOpen, onClose, onSave, article }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Elena Moretti');
  const [category, setCategory] = useState('intelligence');
  const [content, setContent] = useState('');
  const [isVipOnly, setIsVipOnly] = useState(false);
  
  // Dynamic Format Selection
  const [format, setFormat] = useState('text'); // 'text' | 'video' | 'audio'

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

  const editorRef = useRef(null);

  // Sync state when article prop changes (Edit vs Create mode)
  useEffect(() => {
    let initialContent = '';
    if (article) {
      setTitle(article.title || '');
      setAuthor(article.author || 'Elena Moretti');
      
      // Match category slug
      const categoryLower = (article.category || article.type || 'intelligence').toLowerCase();
      const matchedUniverse = UNIVERSES.find(u => 
        categoryLower.includes(u.id) || u.name.toLowerCase().includes(categoryLower)
      );
      setCategory(matchedUniverse ? matchedUniverse.id : 'intelligence');
      
      initialContent = article.content || '';
      setIsVipOnly(article.status === 'Published' || article.isVipOnly || false);
      
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
      setCategory('intelligence');
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

  if (!isOpen) return null;

  // Handle video upload via /api/media
  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFileName(file.name);
      setVideoIsUploading(true);
      setVideoUploadProgress(10);
      
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress up to 90%
      const interval = setInterval(() => {
        setVideoUploadProgress((prev) => (prev < 90 ? prev + 10 : 90));
      }, 150);

      try {
        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        clearInterval(interval);
        
        if (data.success && data.url) {
          setVideoUploadProgress(100);
          setVideoUrl(data.url);
        } else {
          alert(`Erreur: ${data.error || "Téléversement échoué"}`);
          setVideoUploadProgress(0);
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Upload error:", err);
        alert("Erreur de connexion lors du téléversement");
        setVideoUploadProgress(0);
      } finally {
        setVideoIsUploading(false);
      }
    }
  };

  // Handle audio upload via /api/media
  const handleAudioFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFileName(file.name);
      setAudioIsUploading(true);
      setAudioUploadProgress(10);

      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress up to 90%
      const interval = setInterval(() => {
        setAudioUploadProgress((prev) => (prev < 90 ? prev + 15 : 90));
      }, 120);

      try {
        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        clearInterval(interval);

        if (data.success && data.url) {
          setAudioUploadProgress(100);
          setAudioFileName(data.url);
        } else {
          alert(`Erreur: ${data.error || "Téléversement échoué"}`);
          setAudioUploadProgress(0);
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Upload error:", err);
        alert("Erreur de connexion lors du téléversement");
        setAudioUploadProgress(0);
      } finally {
        setAudioIsUploading(false);
      }
    }
  };

  // Handle rich text editor command
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

    // Gather format details
    const formatMeta = {};
    if (format === 'video') {
      formatMeta.videoUrl = videoSourceType === 'url' ? videoUrl : `Fichier : ${videoFileName}`;
      formatMeta.videoSourceType = videoSourceType;
    } else if (format === 'audio') {
      formatMeta.audioFile = audioFileName;
    }

    onSave({
      id: article?.id || `art-${Date.now()}`,
      title,
      author,
      category: UNIVERSES.find(u => u.id === category)?.name || category,
      content,
      format,
      ...formatMeta,
      status: isVipOnly ? "Published" : "Draft",
      isVipOnly,
      updated: "À l'instant"
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div 
        className="drawer-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2>{article ? "Modifier l'article" : "Nouvel Article"}</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          {/* Format selector */}
          <div className="drawer-input-group">
            <label>Format de l'article</label>
            <div className="media-segmented-control">
              <button
                type="button"
                className={`segmented-btn ${format === 'text' ? 'active' : ''}`}
                onClick={() => setFormat('text')}
              >
                Texte
              </button>
              <button
                type="button"
                className={`segmented-btn ${format === 'video' ? 'active' : ''}`}
                onClick={() => setFormat('video')}
              >
                Vidéo
              </button>
              <button
                type="button"
                className={`segmented-btn ${format === 'audio' ? 'active' : ''}`}
                onClick={() => setFormat('audio')}
              >
                Audio
              </button>
            </div>
          </div>

          {/* Title input */}
          <div className="drawer-input-group">
            <label htmlFor="drawer-title">Titre de l'article</label>
            <input
              id="drawer-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Saisissez un titre élégant..."
              required
              className="drawer-text-input title-field"
              autoFocus
            />
          </div>

          {/* Conditional Video Fields */}
          {format === 'video' && (
            <div className="drawer-input-group media-field-section">
              <label>Source de la Vidéo</label>
              <div className="media-segmented-control" style={{ marginBottom: '10px' }}>
                <button
                  type="button"
                  className={`segmented-btn ${videoSourceType === 'url' ? 'active' : ''}`}
                  onClick={() => setVideoSourceType('url')}
                >
                  Lien Externe
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${videoSourceType === 'upload' ? 'active' : ''}`}
                  onClick={() => setVideoSourceType('upload')}
                >
                  Uploader
                </button>
              </div>

              {videoSourceType === 'url' ? (
                <input
                  type="url"
                  required={format === 'video' && videoSourceType === 'url'}
                  className="drawer-text-input"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              ) : (
                <>
                  <div className="media-drag-drop-zone">
                    <input
                      type="file"
                      id="drawer-video-file"
                      accept="video/mp4"
                      style={{ display: 'none' }}
                      onChange={handleVideoFileChange}
                    />
                    <label htmlFor="drawer-video-file" className="drag-drop-label">
                      <span className="material-symbols-outlined drag-drop-icon">videocam</span>
                      <span>Glissez-déposez votre vidéo MP4 ici ou <strong>parcourez</strong></span>
                    </label>
                  </div>
                  {videoFileName && (
                    <div className="file-upload-status-card">
                      <div className="file-info">
                        <div className="video-thumbnail-placeholder">
                          <span className="material-symbols-outlined">movie</span>
                        </div>
                        <div className="file-details">
                          <span className="file-name">{videoFileName}</span>
                          <span className="file-progress-percent">{videoUploadProgress}%</span>
                        </div>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${videoUploadProgress}%` }} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Conditional Audio Fields */}
          {format === 'audio' && (
            <div className="drawer-input-group media-field-section">
              <label>Piste Audio</label>
              <div className="media-drag-drop-zone">
                <input
                  type="file"
                  id="drawer-audio-file"
                  accept="audio/mpeg,audio/wav"
                  style={{ display: 'none' }}
                  onChange={handleAudioFileChange}
                />
                <label htmlFor="drawer-audio-file" className="drag-drop-label">
                  <span className="material-symbols-outlined drag-drop-icon">mic</span>
                  <span>Glissez-déposez votre fichier audio (.mp3, .wav) ou <strong>parcourez</strong></span>
                </label>
              </div>
              {audioFileName && (
                <div className="file-upload-status-card">
                  <div className="file-info" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                    <div className="file-details">
                      <span className="file-name">{audioFileName}</span>
                      <span className="file-progress-percent">{audioUploadProgress}%</span>
                    </div>
                    {/* Visual Audio Wave */}
                    <div className="audio-wave-preview">
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '14px' }}></div>
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '24px' }}></div>
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '18px' }}></div>
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '28px' }}></div>
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '32px' }}></div>
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '20px' }}></div>
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '10px' }}></div>
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '26px' }}></div>
                      <div className={`wave-bar ${audioIsUploading ? 'animating' : ''}`} style={{ height: '16px' }}></div>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${audioUploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Author input (Pre-populated) */}
          <div className="drawer-input-group">
            <label htmlFor="drawer-author">Auteur</label>
            <input
              id="drawer-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nom de l'auteur"
              required
              className="drawer-text-input"
            />
          </div>

          {/* Category Selector (Universes) */}
          <div className="drawer-input-group">
            <label htmlFor="drawer-category">Univers / Magazine</label>
            <div className="select-wrapper">
              <select
                id="drawer-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="drawer-select"
              >
                {UNIVERSES.map((universe) => (
                  <option key={universe.id} value={universe.id}>
                    {universe.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rich Content Editor (Editorial WYSIWYG) */}
          <div className="drawer-input-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <label>Contenu éditorial (Texte Enrichi)</label>
            <div className="rich-editor-container">
              <div className="rich-editor-toolbar">
                <button 
                  type="button" 
                  onClick={() => execEditorCommand('bold')}
                  className="toolbar-btn" 
                  title="Gras"
                >
                  <span className="material-symbols-outlined">format_bold</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => execEditorCommand('italic')}
                  className="toolbar-btn" 
                  title="Italique"
                >
                  <span className="material-symbols-outlined">format_italic</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => execEditorCommand('underline')}
                  className="toolbar-btn" 
                  title="Souligné"
                >
                  <span className="material-symbols-outlined">format_underlined</span>
                </button>
                
                <span className="toolbar-divider"></span>
                
                <button 
                  type="button" 
                  onClick={() => execEditorCommand('formatBlock', '<h2>')}
                  className="toolbar-btn" 
                  title="Titre H2"
                >
                  <span className="material-symbols-outlined">title</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => execEditorCommand('formatBlock', '<blockquote>')}
                  className="toolbar-btn" 
                  title="Citation"
                >
                  <span className="material-symbols-outlined">format_quote</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => execEditorCommand('insertUnorderedList')}
                  className="toolbar-btn" 
                  title="Liste à puces"
                >
                  <span className="material-symbols-outlined">format_list_bulleted</span>
                </button>
                
                <span className="toolbar-divider"></span>
                
                <button 
                  type="button" 
                  onClick={handleAddLink}
                  className="toolbar-btn" 
                  title="Insérer un lien"
                >
                  <span className="material-symbols-outlined">link</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => execEditorCommand('removeFormat')}
                  className="toolbar-btn" 
                  title="Effacer les styles"
                >
                  <span className="material-symbols-outlined">format_clear</span>
                </button>
              </div>

              <div 
                ref={editorRef}
                className="rich-editor-area"
                contentEditable={true}
                onInput={handleEditorInput}
                placeholder="Écrivez le corps de l'article ici..."
                style={{ minHeight: '180px' }}
              />
            </div>
          </div>

          {/* VIP Toggle Switch */}
          <div className="drawer-toggle-group">
            <div className="toggle-info">
              <span className="toggle-label">Accès VIP uniquement</span>
              <span className="toggle-desc">Restreindre cet article aux membres abonnés au Club DONA.</span>
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

          {/* Action Buttons */}
          <div className="drawer-actions">
            <button 
              type="button" 
              className="btn-drawer secondary" 
              onClick={onClose}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-drawer primary"
              disabled={videoIsUploading || audioIsUploading}
            >
              {article ? "Enregistrer" : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

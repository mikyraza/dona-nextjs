"use client";

import React, { useState, useEffect } from 'react';

export default function DossierDrawer({ isOpen, onClose, onSave, articles = [], dossier = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [isVipOnly, setIsVipOnly] = useState(false);
  
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (dossier) {
      setTitle(dossier.title || '');
      setDescription(dossier.description || '');
      setCoverImage(dossier.coverImage || '');
      setSelectedArticles(dossier.articles || []);
      setIsVipOnly(dossier.isVipOnly || false);
      setFileName(dossier.coverImage ? dossier.coverImage.split('/').pop() : '');
      setUploadProgress(dossier.coverImage ? 100 : 0);
      setIsUploading(false);
    } else {
      setTitle('');
      setDescription('');
      setCoverImage('');
      setSelectedArticles([]);
      setIsVipOnly(false);
      setFileName('');
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [dossier, isOpen]);

  if (!isOpen) return null;

  // Handle Cover Image upload via /api/media
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(10);
      
      const formData = new FormData();
      formData.append("file", file);

      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : 90));
      }, 100);

      try {
        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        clearInterval(interval);
        
        if (data.success && data.url) {
          setUploadProgress(100);
          setCoverImage(data.url);
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
    }
  };

  const handleArticleToggle = (articleId) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId) 
        : [...prev, articleId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: dossier?.id || `dos-${Date.now()}`,
      title,
      description,
      coverImage,
      articles: selectedArticles,
      isVipOnly,
      updated: "À l'instant"
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '520px' }}>
        <div className="drawer-header">
          <h2>{dossier ? "Modifier le dossier" : "Nouveau Dossier d'Enquête"}</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          <div className="drawer-input-group">
            <label htmlFor="dossier-title">Titre du Dossier</label>
            <input
              id="dossier-title"
              type="text"
              required
              className="drawer-text-input title-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: L'Empire du Silicium..."
            />
          </div>

          <div className="drawer-input-group">
            <label htmlFor="dossier-description">Description / Chapeau éditorial</label>
            <textarea
              id="dossier-description"
              required
              className="drawer-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Introduction ou résumé détaillé du dossier..."
              rows={4}
            />
          </div>

          <div className="drawer-input-group">
            <label>Image de Couverture</label>
            <div className="media-drag-drop-zone">
              <input
                type="file"
                id="dossier-cover-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="dossier-cover-upload" className="drag-drop-label">
                <span className="material-symbols-outlined drag-drop-icon" style={{ color: 'var(--admin-accent-color)' }}>image</span>
                <span>Glissez-déposez une image ici ou <strong>parcourez</strong></span>
                <span className="file-limits">Format : JPG, PNG, WEBP</span>
              </label>
            </div>

            {fileName && (
              <div className="file-upload-status-card">
                <div className="file-info">
                  <span className="material-symbols-outlined file-icon">photo_library</span>
                  <div className="file-details">
                    <span className="file-name">{fileName}</span>
                    <span className="file-progress-percent">{uploadProgress}%</span>
                  </div>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${uploadProgress}%`, backgroundColor: 'var(--admin-accent-color)' }}
                  />
                </div>
                {uploadProgress === 100 && (
                  <span className="upload-success-badge" style={{ color: '#03543F' }}>
                    <span className="material-symbols-outlined" style={{ color: '#31C48D' }}>check_circle</span>
                    Couverture configurée
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="drawer-input-group">
            <label>Associer des Articles</label>
            <div style={{ 
              maxHeight: '160px', 
              overflowY: 'auto', 
              border: '1px solid var(--admin-border-color)', 
              borderRadius: '2px', 
              padding: '12px',
              backgroundColor: '#FAF9F6',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {articles.map((art) => (
                <label key={art.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(art.id)}
                    onChange={() => handleArticleToggle(art.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>
                    <strong>{art.title}</strong> <span style={{ color: '#888888', fontSize: '11px' }}>({art.category})</span>
                  </span>
                </label>
              ))}
              {articles.length === 0 && (
                <p style={{ color: '#888888', fontSize: '12px', fontStyle: 'italic', margin: 0 }}>Aucun article disponible.</p>
              )}
            </div>
          </div>

          <div className="drawer-input-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <div>
              <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--admin-text-color)' }}>Dossier VIP Réservé</span>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--admin-text-muted)' }}>Limiter l'accès aux membres abonnés du Club DONA.</p>
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

          <div className="drawer-actions" style={{ marginTop: '30px' }}>
            <button type="button" className="btn-drawer secondary" onClick={onClose}>
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-drawer primary"
              disabled={isUploading}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

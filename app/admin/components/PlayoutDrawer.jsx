"use client";

import React, { useState, useEffect } from 'react';

export default function PlayoutDrawer({ isOpen, onClose, onAdd, targetType, dbArticles = [] }) {
  const [activeTab, setActiveTab] = useState('db'); // 'db' (pick from DB) or 'upload' (upload file)
  const [selectedArticleId, setSelectedArticleId] = useState('');
  
  const [fileName, setFileName] = useState('');
  const [fileDuration, setFileDuration] = useState('10:00');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('db');
      setSelectedArticleId('');
      setFileName('');
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter articles based on targetType ('radio' maps to Audio articles, 'tv' maps to Video articles)
  const filterFormat = targetType === 'radio' ? 'audio' : 'video';
  const availableArticles = dbArticles.filter(art => 
    art.format === filterFormat || 
    (filterFormat === 'video' && (art.category === "02. Power Lab" || art.title.toLowerCase().includes("video") || art.title.toLowerCase().includes("coulisses"))) ||
    (filterFormat === 'audio' && (art.category === "11. Culture & Médias" || art.title.toLowerCase().includes("podcast")))
  );

  const handleFileUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 20;
        });
      }, 250);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'db') {
      if (!selectedArticleId) return;
      const article = availableArticles.find(a => a.id === selectedArticleId);
      if (article) {
        onAdd({
          id: `q-${Date.now()}`,
          title: article.title,
          format: targetType === 'radio' ? 'Audio' : 'Vidéo',
          duration: article.duration || "15:00"
        });
      }
    } else {
      if (!fileName.trim()) return;
      onAdd({
        id: `q-${Date.now()}`,
        title: fileName,
        format: targetType === 'radio' ? 'Audio' : 'Vidéo',
        duration: fileDuration || "10:00"
      });
    }
    
    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
        <div className="drawer-header">
          <h2>Ajouter à la diffusion ({targetType === 'radio' ? 'Radio' : 'TV'})</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          {/* Tabs */}
          <div className="media-segmented-control" style={{ marginBottom: '20px' }}>
            <button
              type="button"
              className={`segmented-btn ${activeTab === 'db' ? 'active' : ''}`}
              onClick={() => setActiveTab('db')}
            >
              Choisir de la BDD
            </button>
            <button
              type="button"
              className={`segmented-btn ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Uploader un Fichier
            </button>
          </div>

          {activeTab === 'db' ? (
            <div className="drawer-input-group">
              <label htmlFor="playout-pick-db">Sélectionner un contenu publié</label>
              <div className="select-wrapper">
                <select
                  id="playout-pick-db"
                  className="drawer-select"
                  value={selectedArticleId}
                  onChange={(e) => setSelectedArticleId(e.target.value)}
                  required
                >
                  <option value="">-- Sélectionner un média ({targetType === 'radio' ? 'Audio' : 'Vidéo'}) --</option>
                  {availableArticles.map((art) => (
                    <option key={art.id} value={art.id}>
                      {art.title} ({art.category || 'Non classé'})
                    </option>
                  ))}
                </select>
              </div>
              {availableArticles.length === 0 && (
                <p style={{ fontSize: '11px', color: '#D11A2A', marginTop: '6px' }}>
                  Aucun contenu publié de type {targetType === 'radio' ? 'Audio' : 'Vidéo'} disponible dans la BDD locale.
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="drawer-input-group">
                <label>Fichier Média raw ({targetType === 'radio' ? 'MP3 / WAV' : 'MP4'})</label>
                <div className="media-drag-drop-zone">
                  <input
                    type="file"
                    id="playout-file-input"
                    accept={targetType === 'radio' ? 'audio/mpeg,audio/wav' : 'video/mp4'}
                    style={{ display: 'none' }}
                    onChange={handleFileUploadChange}
                  />
                  <label htmlFor="playout-file-input" className="drag-drop-label">
                    <span className="material-symbols-outlined drag-drop-icon">
                      {targetType === 'radio' ? 'mic' : 'videocam'}
                    </span>
                    <span>Glissez-déposez ou <strong>parcourez</strong></span>
                  </label>
                </div>
              </div>

              {fileName && (
                <>
                  <div className="file-upload-status-card">
                    <div className="file-info">
                      <span className="material-symbols-outlined file-icon">
                        {targetType === 'radio' ? 'volume_up' : 'movie'}
                      </span>
                      <div className="file-details">
                        <span className="file-name">{fileName}</span>
                        <span className="file-progress-percent">{uploadProgress}%</span>
                      </div>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>

                  <div className="drawer-input-group">
                    <label htmlFor="playout-file-duration">Durée estimée du média</label>
                    <input
                      id="playout-file-duration"
                      type="text"
                      className="drawer-text-input"
                      value={fileDuration}
                      onChange={(e) => setFileDuration(e.target.value)}
                      placeholder="10:00"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="drawer-actions" style={{ marginTop: '30px' }}>
            <button type="button" className="btn-drawer secondary" onClick={onClose}>
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-drawer primary"
              disabled={activeTab === 'upload' && (!fileName || isUploading)}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

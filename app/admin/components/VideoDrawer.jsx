"use client";

import React, { useState, useEffect } from 'react';

export default function VideoDrawer({ isOpen, onClose, onSave, video }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('Draft');
  
  // Segmented input selection: 'upload' or 'url'
  const [sourceType, setSourceType] = useState('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setDuration(video.duration || '');
      setStatus(video.status || 'Draft');
      if (video.url && !video.url.startsWith('Fichier :')) {
        setSourceType('url');
        setVideoUrl(video.url);
        setFileName('');
      } else if (video.url) {
        setSourceType('upload');
        setFileName(video.url.replace('Fichier : ', ''));
        setVideoUrl('');
      } else {
        setSourceType('url');
        setVideoUrl('');
        setFileName('');
      }
      setUploadProgress(100);
      setIsUploading(false);
    } else {
      setTitle('');
      setDuration('');
      setStatus('Draft');
      setSourceType('url');
      setVideoUrl('');
      setFileName('');
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [video, isOpen]);

  if (!isOpen) return null;

  // Handle video upload via /api/media
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(10);
      
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress up to 90%
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : 90));
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
          // Set videoUrl to the uploaded file's URL
          setVideoUrl(data.url);
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const urlValue = sourceType === 'url' ? videoUrl : `Fichier : ${fileName}`;

    onSave({
      id: video?.id || `vid-${Date.now()}`,
      title,
      duration,
      status,
      url: urlValue,
      updated: "À l'instant"
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '520px' }}>
        <div className="drawer-header">
          <h2>{video ? "Modifier la vidéo" : "Nouvelle Vidéo"}</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          <div className="drawer-input-group">
            <label htmlFor="video-title">Titre de la vidéo</label>
            <input
              id="video-title"
              type="text"
              required
              className="drawer-text-input title-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la vidéo..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="drawer-input-group">
              <label htmlFor="video-duration">Durée (ex: 14:20)</label>
              <input
                id="video-duration"
                type="text"
                required
                className="drawer-text-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="00:00"
              />
            </div>

            <div className="drawer-input-group">
              <label htmlFor="video-status">Statut</label>
              <div className="select-wrapper">
                <select
                  id="video-status"
                  className="drawer-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Segmented Source selection */}
          <div className="drawer-input-group">
            <label>Source du média</label>
            <div className="media-segmented-control">
              <button
                type="button"
                className={`segmented-btn ${sourceType === 'url' ? 'active' : ''}`}
                onClick={() => setSourceType('url')}
              >
                Lien Externe
              </button>
              <button
                type="button"
                className={`segmented-btn ${sourceType === 'upload' ? 'active' : ''}`}
                onClick={() => setSourceType('upload')}
              >
                Uploader un fichier
              </button>
            </div>
          </div>

          {/* Conditional inputs based on source type */}
          {sourceType === 'url' ? (
            <div className="drawer-input-group">
              <label htmlFor="video-url">URL de la vidéo (YouTube, Vimeo, CDN)</label>
              <input
                id="video-url"
                type="url"
                required={sourceType === 'url'}
                className="drawer-text-input"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          ) : (
            <div className="drawer-input-group">
              <label>Fichier vidéo (MP4, WebM)</label>
              <div className="media-drag-drop-zone">
                <input
                  type="file"
                  id="video-file-upload"
                  accept="video/mp4,video/webm"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label htmlFor="video-file-upload" className="drag-drop-label">
                  <span className="material-symbols-outlined drag-drop-icon">videocam</span>
                  <span>Glissez-déposez votre fichier MP4 ici ou <strong>cliquez pour parcourir</strong></span>
                  <span className="file-limits">Taille max : 500 Mo</span>
                </label>
              </div>

              {fileName && (
                <div className="file-upload-status-card">
                  <div className="file-info">
                    <span className="material-symbols-outlined file-icon">movie</span>
                    <div className="file-details">
                      <span className="file-name">{fileName}</span>
                      <span className="file-progress-percent">{uploadProgress}%</span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  {uploadProgress === 100 && (
                    <span className="upload-success-badge">
                      <span className="material-symbols-outlined">check_circle</span>
                      Fichier prêt pour intégration
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="drawer-actions">
            <button type="button" className="btn-drawer secondary" onClick={onClose}>
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-drawer primary"
              disabled={sourceType === 'upload' && isUploading}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

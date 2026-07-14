"use client";

import React, { useState, useEffect } from 'react';

export default function ReplayDrawer({ isOpen, onClose, onSave, replay = null }) {
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState('video'); // 'video' | 'audio'
  const [duration, setDuration] = useState('10:00');
  const [accessLevel, setAccessLevel] = useState('Public'); // 'Public' | 'VIP'
  const [fileName, setFileName] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (replay) {
      setTitle(replay.title || '');
      setFormat(replay.format?.toLowerCase() === 'audio' ? 'audio' : 'video');
      setDuration(replay.duration || '10:00');
      setAccessLevel(replay.accessLevel || 'Public');
      setFileName(replay.mediaUrl ? replay.mediaUrl.split('/').pop() : '');
      setMediaUrl(replay.mediaUrl || '');
      setUploadProgress(replay.mediaUrl ? 100 : 0);
      setIsUploading(false);
    } else {
      setTitle('');
      setFormat('video');
      setDuration('10:00');
      setAccessLevel('Public');
      setFileName('');
      setMediaUrl('');
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [replay, isOpen]);

  if (!isOpen) return null;

  // Handle file upload via /api/media
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(10);
      
      const formData = new FormData();
      formData.append("file", file);

      // Set format based on mime type or extension
      if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')) {
        setFormat('audio');
      } else {
        setFormat('video');
      }

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
          setMediaUrl(data.url);
        } else {
          alert(`Erreur: ${data.error || "Téléversement échoué"}`);
          setUploadProgress(0);
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Replay upload error:", err);
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

    onSave({
      id: replay?.id || `rep-${Date.now()}`,
      title,
      format: format === 'audio' ? 'Audio' : 'Vidéo',
      duration,
      accessLevel,
      mediaUrl,
      date: replay?.date || new Date().toLocaleDateString('fr-FR')
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '500px' }}>
        <div className="drawer-header">
          <h2>{replay ? "Modifier le Replay" : "Importer un Replay"}</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          <div className="drawer-input-group">
            <label htmlFor="replay-title">Titre de la Rediffusion</label>
            <input
              id="replay-title"
              type="text"
              required
              className="drawer-text-input title-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Emission Spéciale Mode..."
            />
          </div>

          <div className="drawer-input-group">
            <label>Format de Rediffusion</label>
            <div className="media-segmented-control">
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="drawer-input-group">
              <label htmlFor="replay-duration">Durée (ex: 54:20)</label>
              <input
                id="replay-duration"
                type="text"
                required
                className="drawer-text-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="00:00"
              />
            </div>

            <div className="drawer-input-group">
              <label htmlFor="replay-access">Niveau d'accès</label>
              <div className="select-wrapper">
                <select
                  id="replay-access"
                  className="drawer-select"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                >
                  <option value="Public">Public (Gratuit)</option>
                  <option value="VIP">VIP (Abonnés)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="drawer-input-group">
            <label>Fichier Médias (.mp3, .mp4, .wav)</label>
            <div className="media-drag-drop-zone">
              <input
                type="file"
                id="replay-file-upload"
                accept="audio/*,video/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="replay-file-upload" className="drag-drop-label">
                <span className="material-symbols-outlined drag-drop-icon" style={{ color: 'var(--admin-accent-color)' }}>
                  {format === 'audio' ? 'mic' : 'videocam'}
                </span>
                <span>Glissez-déposez le fichier ici ou <strong>parcourez</strong></span>
                <span className="file-limits">Taille max : 500 Mo</span>
              </label>
            </div>

            {fileName && (
              <div className="file-upload-status-card">
                <div className="file-info">
                  <span className="material-symbols-outlined file-icon">
                    {format === 'audio' ? 'volume_up' : 'movie'}
                  </span>
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
                    Média prêt pour la diffusion
                  </span>
                )}
              </div>
            )}
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

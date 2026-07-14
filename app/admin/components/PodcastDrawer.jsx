"use client";

import React, { useState, useEffect } from 'react';

export default function PodcastDrawer({ isOpen, onClose, onSave, podcast }) {
  const [title, setTitle] = useState('');
  const [episode, setEpisode] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('Draft');
  
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (podcast) {
      setTitle(podcast.title || '');
      setEpisode(podcast.episode || '');
      setDuration(podcast.duration || '');
      setStatus(podcast.status || 'Draft');
      setFileName(podcast.audioFile || '');
      setUploadProgress(podcast.audioFile ? 100 : 0);
      setIsUploading(false);
    } else {
      setTitle('');
      setEpisode('');
      setDuration('');
      setStatus('Draft');
      setFileName('');
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [podcast, isOpen]);

  if (!isOpen) return null;

  // Handle audio upload via /api/media
  const handleAudioChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(10);
      
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress up to 90%
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : 90));
      }, 120);

      try {
        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        clearInterval(interval);
        
        if (data.success && data.url) {
          setUploadProgress(100);
          // Set fileName to the uploaded file's URL
          setFileName(data.url);
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
    if (!title.trim() || !episode.trim()) return;

    onSave({
      id: podcast?.id || `pod-${Date.now()}`,
      title,
      episode,
      duration,
      status,
      audioFile: fileName,
      updated: "À l'instant"
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '520px' }}>
        <div className="drawer-header">
          <h2>{podcast ? "Modifier l'épisode" : "Nouvel Épisode"}</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          <div className="drawer-input-group">
            <label htmlFor="podcast-title">Nom de l'émission / Série</label>
            <input
              id="podcast-title"
              type="text"
              required
              className="drawer-text-input title-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: The Brief: L'Analyse Hebdomadaire..."
            />
          </div>

          <div className="drawer-input-group">
            <label htmlFor="podcast-episode">Titre de l'épisode</label>
            <input
              id="podcast-episode"
              type="text"
              required
              className="drawer-text-input"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              placeholder="Ex: Épisode 13 : L'Architecture du Silence..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="drawer-input-group">
              <label htmlFor="podcast-duration">Durée (ex: 45:00)</label>
              <input
                id="podcast-duration"
                type="text"
                required
                className="drawer-text-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="00:00"
              />
            </div>

            <div className="drawer-input-group">
              <label htmlFor="podcast-status">Statut</label>
              <div className="select-wrapper">
                <select
                  id="podcast-status"
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

          {/* Dedicated Audio Upload Zone */}
          <div className="drawer-input-group">
            <label>Fichier Audio (MP3, WAV)</label>
            <div className="media-drag-drop-zone audio-zone">
              <input
                type="file"
                id="podcast-audio-upload"
                accept="audio/mpeg,audio/wav"
                style={{ display: 'none' }}
                onChange={handleAudioChange}
              />
              <label htmlFor="podcast-audio-upload" className="drag-drop-label">
                <span className="material-symbols-outlined drag-drop-icon" style={{ color: 'var(--admin-accent-color)' }}>mic</span>
                <span>Glissez-déposez votre fichier audio (.mp3, .wav) ici ou <strong>cliquez pour parcourir</strong></span>
                <span className="file-limits">Taille max : 100 Mo</span>
              </label>
            </div>

            {fileName && (
              <div className="file-upload-status-card">
                <div className="file-info">
                  <span className="material-symbols-outlined file-icon">volume_up</span>
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
                  <span className="upload-success-badge" style={{ color: 'var(--admin-accent-color)' }}>
                    <span className="material-symbols-outlined">check_circle</span>
                    Audio prêt pour diffusion
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="drawer-actions">
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

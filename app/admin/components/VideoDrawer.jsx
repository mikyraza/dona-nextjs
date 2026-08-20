"use client";

import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Économie', 'Politique', 'Culture', 'Masterclass', 'Événement', 'Documentaire', 'Interview'];
const MAGAZINES = ['focus', 'mode', 'eclat', 'style', 'vital', 'tribu', 'caps', 'icones'];
const LABELS = ['ÉVÉNEMENT', 'DOCUMENTAIRE', 'MASTERCLASS', 'TABLE RONDE', 'INTERVIEW', 'PORTRAITS', 'REPLAY', 'SÉRIE'];

export default function VideoDrawer({ isOpen, onClose, onSave, video }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('Draft');
  const [isVipOnly, setIsVipOnly] = useState(false);
  const [isHD, setIsHD] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isReplay, setIsReplay] = useState(false);
  const [category, setCategory] = useState('Culture');
  const [magazine, setMagazine] = useState('');
  const [label, setLabel] = useState('DOCUMENTAIRE');

  // Source segmented: 'url' | 'upload' | 'hls'
  const [sourceType, setSourceType] = useState('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setSubtitle(video.subtitle || '');
      setDuration(video.duration || '');
      setStatus(video.status || 'Draft');
      setIsVipOnly(video.isVipOnly || false);
      setIsHD(video.isHD || false);
      setIsFeatured(video.isFeatured || false);
      setIsReplay(video.isReplay || false);
      setCategory(video.category || 'Culture');
      setMagazine(video.magazine || '');
      setLabel(video.label || 'DOCUMENTAIRE');

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
    setDuration('');
    setStatus('Draft');
    setIsVipOnly(false);
    setIsHD(false);
    setIsFeatured(false);
    setIsReplay(false);
    setCategory('Culture');
    setMagazine('');
    setLabel('DOCUMENTAIRE');
    setSourceType('url');
    setVideoUrl('');
    setFileName('');
    setUploadProgress(0);
    setIsUploading(false);
  }

  if (!isOpen) return null;

  // Handle video upload via /api/media
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(10);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      id: video?.id,
      title: title.trim(),
      subtitle: subtitle.trim(),
      duration,
      status,
      isVipOnly,
      isHD,
      isFeatured,
      isReplay,
      category,
      magazine,
      label,
      source: sourceType,
      videoUrl: sourceType === 'upload' ? `Fichier : ${fileName}` : videoUrl,
      thumbnailUrl: video?.thumbnailUrl || '',
    };

    setIsSaving(true);
    try {
      const method = video?.id && !video.id.startsWith('vid-local-') ? 'PUT' : 'POST';
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
        alert(`Erreur lors de la sauvegarde: ${data.error}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      // Fallback: save locally anyway
      onSave({ ...payload, id: payload.id || `vid-local-${Date.now()}` });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const sourceTypes = [
    { id: 'url', label: 'URL Externe' },
    { id: 'hls', label: 'Stream HLS' },
    { id: 'upload', label: 'Upload' },
  ];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">
            {video ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
          </h2>
          <button className="drawer-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Title */}
          <div className="drawer-input-group">
            <label htmlFor="vid-title">Titre *</label>
            <input
              id="vid-title"
              type="text"
              className="drawer-text-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titre de la vidéo"
              required
            />
          </div>

          {/* Subtitle */}
          <div className="drawer-input-group">
            <label htmlFor="vid-subtitle">Sous-titre / Description courte</label>
            <input
              id="vid-subtitle"
              type="text"
              className="drawer-text-input"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Description courte visible dans les cartes"
            />
          </div>

          {/* Duration + Status — 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="drawer-input-group">
              <label htmlFor="vid-duration">Durée</label>
              <input
                id="vid-duration"
                type="text"
                className="drawer-text-input"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="ex: 45MIN ou 1H 24MIN"
              />
            </div>
            <div className="drawer-input-group">
              <label htmlFor="vid-status">Statut</label>
              <select
                id="vid-status"
                className="drawer-text-input"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="Draft">Brouillon</option>
                <option value="Published">Publié</option>
              </select>
            </div>
          </div>

          {/* Category + Label — 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="drawer-input-group">
              <label htmlFor="vid-category">Catégorie</label>
              <select
                id="vid-category"
                className="drawer-text-input"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="drawer-input-group">
              <label htmlFor="vid-label">Badge Affiché</label>
              <select
                id="vid-label"
                className="drawer-text-input"
                value={label}
                onChange={e => setLabel(e.target.value)}
              >
                {LABELS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Magazine */}
          <div className="drawer-input-group">
            <label htmlFor="vid-magazine">Magazine associé (optionnel)</label>
            <select
              id="vid-magazine"
              className="drawer-text-input"
              value={magazine}
              onChange={e => setMagazine(e.target.value)}
            >
              <option value="">— Aucun —</option>
              {MAGAZINES.map(m => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Access Level Toggle */}
          <div className="drawer-input-group">
            <label>Niveau d'accès</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsVipOnly(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `2px solid ${!isVipOnly ? 'var(--admin-accent-color)' : '#E0E0E0'}`,
                  background: !isVipOnly ? 'rgba(163,6,38,0.07)' : '#fff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: !isVipOnly ? '700' : '400',
                  fontSize: '12px',
                  color: !isVipOnly ? 'var(--admin-accent-color)' : '#666',
                  transition: 'all 0.2s',
                }}
              >
                🌐 Public
              </button>
              <button
                type="button"
                onClick={() => setIsVipOnly(true)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `2px solid ${isVipOnly ? '#B08D57' : '#E0E0E0'}`,
                  background: isVipOnly ? 'rgba(176,141,87,0.1)' : '#fff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: isVipOnly ? '700' : '400',
                  fontSize: '12px',
                  color: isVipOnly ? '#B08D57' : '#666',
                  transition: 'all 0.2s',
                }}
              >
                👑 VIP Exclusif
              </button>
            </div>
          </div>

          {/* Flags row: HD, Featured, Replay */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { state: isHD, setter: setIsHD, label: 'HD / 4K' },
              { state: isFeatured, setter: setIsFeatured, label: 'À la Une' },
              { state: isReplay, setter: setIsReplay, label: 'Replay Direct' },
            ].map(({ state, setter, label: lbl }) => (
              <label key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: 'var(--admin-text-color)' }}>
                <input
                  type="checkbox"
                  checked={state}
                  onChange={e => setter(e.target.checked)}
                  style={{ accentColor: 'var(--admin-accent-color)', width: '16px', height: '16px' }}
                />
                {lbl}
              </label>
            ))}
          </div>

          {/* Source type segmented control */}
          <div className="drawer-input-group">
            <label>Source vidéo</label>
            <div style={{ display: 'flex', gap: '0', marginTop: '6px', border: '1px solid #E0E0E0', borderRadius: '6px', overflow: 'hidden' }}>
              {sourceTypes.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSourceType(s.id)}
                  style={{
                    flex: 1,
                    padding: '9px 4px',
                    border: 'none',
                    borderRight: s.id !== 'upload' ? '1px solid #E0E0E0' : 'none',
                    background: sourceType === s.id ? 'var(--admin-accent-color)' : '#fff',
                    color: sourceType === s.id ? '#fff' : '#555',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* URL / HLS input */}
          {(sourceType === 'url' || sourceType === 'hls') && (
            <div className="drawer-input-group">
              <label htmlFor="vid-url">
                {sourceType === 'hls' ? 'URL HLS (.m3u8) ou RTMP' : 'URL vidéo (YouTube, Vimeo, CDN…)'}
              </label>
              <input
                id="vid-url"
                type="url"
                className="drawer-text-input"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder={sourceType === 'hls' ? 'https://stream.example.com/live.m3u8' : 'https://youtube.com/watch?v=...'}
              />
              {sourceType === 'hls' && (
                <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                  Supports HLS (.m3u8), RTMP, Cloudflare Stream, Mux, et CDN privés white-label.
                </p>
              )}
            </div>
          )}

          {/* Upload input */}
          {sourceType === 'upload' && (
            <div className="drawer-input-group">
              <label>Fichier MP4 / WebM</label>
              <div className="media-drag-drop-zone">
                <input
                  type="file"
                  id="video-file-input"
                  accept="video/mp4,video/webm,video/ogg"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label htmlFor="video-file-input" className="drag-drop-label">
                  <span className="material-symbols-outlined drag-drop-icon">videocam</span>
                  <span>Glissez-déposez ou <strong>parcourez</strong></span>
                </label>
              </div>
              {fileName && (
                <div className="file-upload-status-card" style={{ marginTop: '12px' }}>
                  <div className="file-info">
                    <span className="material-symbols-outlined file-icon">movie</span>
                    <div className="file-details">
                      <span className="file-name">{fileName}</span>
                      <span className="file-progress-percent">{uploadProgress}%</span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="drawer-actions" style={{ marginTop: '10px' }}>
            <button type="button" className="btn-drawer secondary" onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn-drawer primary"
              disabled={isSaving || (sourceType === 'upload' && isUploading)}
            >
              {isSaving ? 'Enregistrement…' : (video ? 'Mettre à jour' : 'Ajouter la vidéo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

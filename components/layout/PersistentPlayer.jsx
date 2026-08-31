'use client';

import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { useRef } from 'react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PersistentPlayer() {
  const {
    track,
    isPlaying,
    isMuted,
    volume,
    progress,
    currentTime,
    duration,
    isVisible,
    audioError,
    playlist,
    currentIndex,
    togglePlay,
    toggleMute,
    setVolume,
    dismiss,
    clearError,
    handleError,
    playNext,
    playPrevious,
    audioRef,
    handleTimeUpdate,
    handleEnded,
  } = useAudioPlayer();

  const progressBarRef = useRef(null);

  if (!isVisible || !track) return null;

  const handleSeek = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = ratio * audioRef.current.duration;
    }
  };

  // Keyboard navigation for progress bar (N°26)
  const handleProgressKeyDown = (e) => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration || duration || 0;
    if (!dur) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        audioRef.current.currentTime = Math.min(dur, (audioRef.current.currentTime || 0) + 5);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        audioRef.current.currentTime = Math.max(0, (audioRef.current.currentTime || 0) - 5);
        break;
      case 'Home':
        e.preventDefault();
        audioRef.current.currentTime = 0;
        break;
      case 'End':
        e.preventDefault();
        audioRef.current.currentTime = dur;
        break;
      default:
        break;
    }
  };

  // Volume icon based on level (N°25)
  const VolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      );
    }
    if (volume <= 50) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
  };

  const hasPlaylist = playlist.length > 1;
  const canPrev = hasPlaylist && (currentIndex > 0 || currentTime > 3);
  const canNext = hasPlaylist && currentIndex < playlist.length - 1;

  return (
    <>
      {/* Hidden real audio element – persists in DOM */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
        style={{ display: 'none' }}
      />

      <div className={`dona-player ${isVisible ? 'dona-player--visible' : ''}`} role="region" aria-label="Lecteur audio DONA">

        {/* Progress bar – sits at very top of bar (N°26 a11y) */}
        <div
          className="dona-player__progress-rail"
          ref={progressBarRef}
          onClick={handleSeek}
          onKeyDown={handleProgressKeyDown}
          role="slider"
          tabIndex={0}
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration || 0)}
          aria-label="Progression de la lecture audio"
        >
          <div
            className="dona-player__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="dona-player__body">
          {/* LEFT — Track metadata */}
          <div className="dona-player__meta">
            <span className="dona-player__source">{track.source || 'DONA AUDIO'}</span>
            <span className="dona-player__title">{track.title}</span>
            <span className="dona-player__time">
              {formatTime(currentTime)}
              {duration > 0 ? ` / ${formatTime(duration)}` : track.isLive ? ' · LIVE' : ''}
              {hasPlaylist && <span className="dona-player__playlist-pos"> · {currentIndex + 1}/{playlist.length}</span>}
            </span>
          </div>

          {/* CENTER — Controls */}
          <div className="dona-player__controls">
            {/* Previous track (N°28) */}
            <button
              className="dona-player__btn dona-player__btn--sm"
              onClick={playPrevious}
              disabled={!canPrev}
              aria-label="Piste précédente"
              style={!canPrev ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="5" width="3" height="14" rx="1" />
                <polygon points="21 5 10 12 21 19 21 5" />
              </svg>
            </button>

            {/* Rewind 15s */}
            <button
              className="dona-player__btn dona-player__btn--sm"
              onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15); }}
              aria-label="Reculer de 15 secondes"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2.5 12a9.5 9.5 0 1 1 9.5 9.5" />
                <polyline points="2.5 5.5 2.5 12 9 12" />
                <text x="8" y="15" fontSize="6" fill="currentColor" stroke="none" fontFamily="Inter,sans-serif" fontWeight="600">15</text>
              </svg>
            </button>

            {/* Play / Pause */}
            <button
              className={`dona-player__btn dona-player__btn--play ${isPlaying ? 'dona-player__btn--playing' : ''}`}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="3" width="5" height="18" rx="1" />
                  <rect x="14" y="3" width="5" height="18" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21" />
                </svg>
              )}
            </button>

            {/* Forward 30s */}
            <button
              className="dona-player__btn dona-player__btn--sm"
              onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 9999, audioRef.current.currentTime + 30); }}
              aria-label="Avancer de 30 secondes"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21.5 12a9.5 9.5 0 1 0-9.5 9.5" />
                <polyline points="21.5 5.5 21.5 12 15 12" />
                <text x="7.5" y="15" fontSize="6" fill="currentColor" stroke="none" fontFamily="Inter,sans-serif" fontWeight="600">30</text>
              </svg>
            </button>

            {/* Next track (N°28) */}
            <button
              className="dona-player__btn dona-player__btn--sm"
              onClick={playNext}
              disabled={!canNext}
              aria-label="Piste suivante"
              style={!canNext ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="3 5 14 12 3 19 3 5" />
                <rect x="18" y="5" width="3" height="14" rx="1" />
              </svg>
            </button>
          </div>

          {/* RIGHT — Volume + Visualizer + dismiss */}
          <div className="dona-player__actions">
            {/* Animated visualizer bars */}
            <div className={`dona-player__visualizer ${isPlaying ? 'dona-player__visualizer--active' : ''}`} aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="dona-player__bar" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>

            {/* Volume control (N°25) */}
            <div className="dona-player__volume-group">
              <button
                className="dona-player__btn dona-player__btn--icon"
                onClick={toggleMute}
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                <VolumeIcon />
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                className="dona-player__volume-slider"
                aria-label="Volume"
              />
            </div>

            {/* Close */}
            <button
              className="dona-player__btn dona-player__btn--icon dona-player__btn--close"
              onClick={dismiss}
              aria-label="Fermer le lecteur"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error banner (N°24) */}
        {audioError && (
          <div className="dona-player__error" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{audioError}</span>
            <button onClick={clearError} aria-label="Fermer le message d'erreur" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px 6px', fontSize: '14px' }}>✕</button>
          </div>
        )}
      </div>
    </>
  );
}

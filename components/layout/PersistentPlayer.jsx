'use client';

import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { useEffect, useRef } from 'react';

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
    progress,
    currentTime,
    duration,
    isVisible,
    togglePlay,
    toggleMute,
    dismiss,
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

  return (
    <>
      {/* Hidden real audio element – persists in DOM */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{ display: 'none' }}
      />

      <div className={`dona-player ${isVisible ? 'dona-player--visible' : ''}`} role="region" aria-label="Lecteur audio DONA">

        {/* Progress bar – sits at very top of bar */}
        <div
          className="dona-player__progress-rail"
          ref={progressBarRef}
          onClick={handleSeek}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="dona-player__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="dona-player__body">
          {/* LEFT — Track metadata */}
          <div className="dona-player__meta">
            <span className="dona-player__source">{track.source}</span>
            <span className="dona-player__title">{track.title}</span>
            <span className="dona-player__time">
              {formatTime(currentTime)}
              {duration > 0 ? ` / ${formatTime(duration)}` : track.isLive ? ' · LIVE' : ''}
            </span>
          </div>

          {/* CENTER — Controls */}
          <div className="dona-player__controls">
            {/* Rewind 15s */}
            <button
              className="dona-player__btn dona-player__btn--sm"
              onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 15; }}
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
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
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
              onClick={() => { if (audioRef.current) audioRef.current.currentTime += 30; }}
              aria-label="Avancer de 30 secondes"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21.5 12a9.5 9.5 0 1 0-9.5 9.5" />
                <polyline points="21.5 5.5 21.5 12 15 12" />
                <text x="7.5" y="15" fontSize="6" fill="currentColor" stroke="none" fontFamily="Inter,sans-serif" fontWeight="600">30</text>
              </svg>
            </button>
          </div>

          {/* RIGHT — Mute + dismiss */}
          <div className="dona-player__actions">
            {/* Visualizer bars (animated when playing) */}
            <div className={`dona-player__visualizer ${isPlaying ? 'dona-player__visualizer--active' : ''}`} aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="dona-player__bar" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>

            <button
              className="dona-player__btn dona-player__btn--icon"
              onClick={toggleMute}
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

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
      </div>
    </>
  );
}

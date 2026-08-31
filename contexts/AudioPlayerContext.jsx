'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [track, setTrack] = useState(null);
  // { src, title, source, duration, isLive }
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(80); // 0–100
  const [progress, setProgress] = useState(0); // 0–100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // Playlist state (N°28)
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Restore volume from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dona_player_volume');
      if (saved !== null) {
        const vol = parseInt(saved, 10);
        if (!isNaN(vol) && vol >= 0 && vol <= 100) {
          setVolumeState(vol);
          if (audioRef.current) audioRef.current.volume = vol / 100;
        }
      }
    } catch (e) { /* ignore */ }
  }, []);

  // Internal: play a single track object
  const _playTrack = useCallback((newTrack) => {
    setTrack(newTrack);
    setIsVisible(true);
    setProgress(0);
    setCurrentTime(0);
    setAudioError(null);

    if (audioRef.current && newTrack.src) {
      audioRef.current.src = newTrack.src;
      audioRef.current.volume = volume / 100;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // autoplay blocked
        setIsPlaying(false);
      });
    } else {
      // No real audio src — simulate UI playing state
      setIsPlaying(true);
      setDuration(newTrack.duration || 2655);
    }
  }, [volume]);

  // Load & auto-play a new single track (keeps backward compat)
  const loadTrack = useCallback((newTrack) => {
    setPlaylist([]);
    setCurrentIndex(-1);
    _playTrack(newTrack);
  }, [_playTrack]);

  // Load a playlist and start from given index (N°28)
  const loadPlaylist = useCallback((tracks, startIndex = 0) => {
    if (!tracks || tracks.length === 0) return;
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
    _playTrack(tracks[startIndex]);
  }, [_playTrack]);

  // Play next track in playlist (N°28)
  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIdx = currentIndex + 1;
    if (nextIdx < playlist.length) {
      setCurrentIndex(nextIdx);
      _playTrack(playlist[nextIdx]);
    } else {
      // End of playlist
      setIsPlaying(false);
      setProgress(100);
    }
  }, [playlist, currentIndex, _playTrack]);

  // Play previous track in playlist (N°28)
  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;
    // If more than 3s into the track, restart it instead
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIdx = currentIndex - 1;
    if (prevIdx >= 0) {
      setCurrentIndex(prevIdx);
      _playTrack(playlist[prevIdx]);
    }
  }, [playlist, currentIndex, currentTime, _playTrack]);

  const togglePlay = useCallback(() => {
    if (!track) return;
    if (audioRef.current && audioRef.current.src && audioRef.current.src !== window.location.href) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying((p) => !p);
  }, [track, isPlaying]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted((m) => !m);
  }, [isMuted]);

  // Volume control (N°25)
  const setVolume = useCallback((val) => {
    const v = Math.max(0, Math.min(100, val));
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
      if (v === 0) {
        audioRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
    try {
      localStorage.setItem('dona_player_volume', String(v));
    } catch (e) { /* ignore */ }
  }, [isMuted]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setIsPlaying(false);
    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Audio error handler (N°24)
  const handleError = useCallback((e) => {
    console.error('[DONA Audio] Playback error:', e?.target?.error || e);
    setIsPlaying(false);
    setAudioError('Erreur de chargement audio. Vérifiez votre connexion ou réessayez.');
    setTimeout(() => setAudioError(null), 6000);
  }, []);

  const clearError = useCallback(() => {
    setAudioError(null);
  }, []);

  // Audio element event handlers
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress(dur ? (cur / dur) * 100 : 0);
  }, []);

  // Auto-chain to next track on end (N°28)
  const handleEnded = useCallback(() => {
    if (playlist.length > 0 && currentIndex < playlist.length - 1) {
      // Auto-play next track
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      _playTrack(playlist[nextIdx]);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  }, [playlist, currentIndex, _playTrack]);

  // Simulated progress for demo tracks without real src
  useEffect(() => {
    if (!track || !isPlaying) return;
    // If audio element has a real source loaded, don't simulate
    if (audioRef.current && audioRef.current.src && audioRef.current.src !== '' && audioRef.current.src !== window.location.href) return;
    const dur = track.duration || 2655;
    const interval = setInterval(() => {
      setCurrentTime((t) => {
        const next = t + 1;
        if (next >= dur) {
          clearInterval(interval);
          handleEnded();
          return dur;
        }
        setProgress((next / dur) * 100);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [track, isPlaying, handleEnded]);

  const value = {
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
    loadTrack,
    loadPlaylist,
    playNext,
    playPrevious,
    togglePlay,
    toggleMute,
    setVolume,
    dismiss,
    clearError,
    handleError,
    audioRef,
    handleTimeUpdate,
    handleEnded,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}

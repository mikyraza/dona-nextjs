'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [track, setTrack] = useState(null);
  const [trackSeq, setTrackSeq] = useState(0); // sequence number to guard against stale audio responses
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
        }
      }
    } catch (e) { /* ignore */ }
  }, []);

  // Apply volume to audio element whenever it appears or changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted || volume === 0;
    }
  }, [volume, isMuted, isVisible]);

  // Internal: play a single track object
  const _playTrack = useCallback((newTrack) => {
    setTrack(newTrack);
    setIsVisible(true);
    setProgress(0);
    setCurrentTime(0);
    setAudioError(null);

    // Wait one frame so the <audio> element mounts (PersistentPlayer is gated on isVisible/track)
    requestAnimationFrame(() => {
      const audio = audioRef.current;
      if (!audio) {
        // Still no audio element — fall back to simulated playback
        setIsPlaying(true);
        setDuration(newTrack.duration || 2655);
        return;
      }
      // Always (re)apply current volume and unmute state
      audio.volume = volume / 100;
      audio.muted = isMuted || volume === 0;

      if (newTrack.src) {
        audio.src = newTrack.src;
        audio.load();
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch((err) => {
            console.warn('[DONA Audio] Autoplay blocked or failed:', err?.message || err);
            setIsPlaying(false);
          });
        } else {
          setIsPlaying(true);
        }
      } else {
        // No real audio src — simulate UI playing state
        setIsPlaying(true);
        setDuration(newTrack.duration || 2655);
      }
    });
  }, [volume, isMuted]);

  // Load & auto-play a new single track (keeps backward compat)
  const loadTrack = useCallback((newTrack) => {
    setPlaylist([]);
    setCurrentIndex(-1);
    setTrackSeq((s) => s + 1); // increment sequence to invalidate any in-flight audio responses
    _playTrack(newTrack);
  }, [_playTrack]);

  // Load a playlist and start from given index (N°28)
  const loadPlaylist = useCallback((tracks, startIndex = 0) => {
    if (!tracks || tracks.length === 0) return;
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
    setTrackSeq((s) => s + 1);
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
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('[DONA Audio] Playback failed:', err?.message || err);
          setIsPlaying(false);
        });
      }
    } else {
      // Simulated track — toggle simulated state
      setIsPlaying((p) => !p);
    }
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
  const handleTimeUpdate = useCallback((seq) => {
    if (!audioRef.current || seq !== trackSeq) return; // guard against stale updates
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress(dur ? (cur / dur) * 100 : 0);
  }, [trackSeq]);

  // Auto-chain to next track on end (N°28)
  const handleEnded = useCallback((seq) => {
    if (seq !== trackSeq) return;
    if (playlist.length > 0 && currentIndex < playlist.length - 1) {
      // Auto-play next track
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      _playTrack(playlist[nextIdx]);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  }, [playlist, currentIndex, trackSeq, _playTrack]);

  // Simulated progress for demo tracks without real src
  useEffect(() => {
    if (!track || !isPlaying) return;
    // If audio element has a real source loaded, don't simulate
    if (audioRef.current && audioRef.current.src && audioRef.current.src !== '' && audioRef.current.src !== window.location.href) return;
    const dur = track.duration || 2655;
    const seq = trackSeq;
    const interval = setInterval(() => {
      setCurrentTime((t) => {
        const next = t + 1;
        if (next >= dur) {
          clearInterval(interval);
          handleEnded(seq);
          return dur;
        }
        setProgress((next / dur) * 100);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [track, isPlaying, handleEnded, trackSeq]);

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
    trackSeq,
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

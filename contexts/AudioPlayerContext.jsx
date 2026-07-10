'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [track, setTrack] = useState(null);
  // { src, title, source, duration }
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Load & auto-play a new track
  const loadTrack = useCallback((newTrack) => {
    setTrack(newTrack);
    setIsVisible(true);
    setProgress(0);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.src = newTrack.src || '';
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // autoplay blocked: show UI but not playing
        setIsPlaying(false);
      });
    } else {
      // No real audio src — simulate UI playing state
      setIsPlaying(true);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!track) return;
    if (audioRef.current && audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
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

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
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

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(100);
  }, []);

  // Simulated progress for demo tracks without real src
  useEffect(() => {
    if (!track || !isPlaying || (audioRef.current && audioRef.current.src)) return;
    const interval = setInterval(() => {
      setCurrentTime((t) => {
        const next = t + 1;
        const dur = track.duration || 2655;
        if (next >= dur) {
          setIsPlaying(false);
          setProgress(100);
          clearInterval(interval);
          return dur;
        }
        setProgress((next / dur) * 100);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [track, isPlaying]);

  const value = {
    track,
    isPlaying,
    isMuted,
    progress,
    currentTime,
    duration,
    isVisible,
    loadTrack,
    togglePlay,
    toggleMute,
    dismiss,
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

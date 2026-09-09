'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export default function ArticleAudioPlayer({ article, magazine, primaryColor = '#A30626' }) {
  const { loadTrack, isPlaying, track, dismiss } = useAudioPlayer();

  const [ttsActive, setTtsActive] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const utteranceRef = useRef(null);
  const keepAliveRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsSupported(true);
    }
    return () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const hasRealAudio = Boolean(article?.audioFile);
  const isThisTrackPlaying = isPlaying && track?.src === article?.audioFile;

  const buildTtsText = useCallback(() => {
    const parts = [];
    if (article?.title) parts.push(article.title + '.');
    if (article?.desc || article?.summary) parts.push((article.desc || article.summary) + '.');
    if (article?.content) {
      const tmp = document.createElement('div');
      tmp.innerHTML = article.content;
      const text = (tmp.textContent || tmp.innerText || '').trim();
      parts.push(text.slice(0, 3000));
    }
    return parts.join(' ').trim();
  }, [article]);

  const handleRealAudioClick = () => {
    if (isThisTrackPlaying) {
      dismiss();
    } else {
      loadTrack({
        src: article.audioFile,
        title: article.title,
        source: (magazine?.title || 'DONA').toUpperCase(),
        duration: article.audioDuration || 0,
      });
    }
  };

  const handleTtsClick = () => {
    if (!ttsSupported) return;

    if (ttsActive) {
      if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
      window.speechSynthesis.cancel();
      setTtsActive(false);
      return;
    }

    const text = buildTtsText();
    if (!text) return;

    // Cancel any pending speech first (Chrome workaround)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang === 'fr-FR') || voices.find(v => v.lang.startsWith('fr'));
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = () => {
      if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
      setTtsActive(false);
    };
    utterance.onerror = (e) => {
      if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
      if (e.error !== 'interrupted') setTtsActive(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setTtsActive(true);

    // Chrome keep-alive: prevents auto-pause after ~15s
    // We only apply this on Chrome, as it breaks Firefox.
    keepAliveRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
        setTtsActive(false);
        return;
      }
      
      const isChrome = typeof window !== 'undefined' && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if (isChrome) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 14000);
  };

  const pulseStyle = `
    @keyframes dona-audio-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.65; transform: scale(1.14); }
    }
  `;

  const btnBase = {
    border: 'none', background: 'none', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '4px', padding: '4px', borderRadius: '6px', transition: 'color 0.2s ease',
  };

  if (hasRealAudio) {
    return (
      <>
        <style>{pulseStyle}</style>
        <button
          onClick={handleRealAudioClick}
          style={{ ...btnBase, color: isThisTrackPlaying ? primaryColor : 'var(--color-text-muted)' }}
          aria-label={isThisTrackPlaying ? 'Mettre en pause' : `Écouter l'article : ${article.title}`}
          title={isThisTrackPlaying ? 'Mettre en pause' : "Écouter l'article"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px', animation: isThisTrackPlaying ? 'dona-audio-pulse 1.2s ease-in-out infinite' : 'none' }}>
            {isThisTrackPlaying ? 'pause_circle' : 'volume_up'}
          </span>
          <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.05em' }}>
            {isThisTrackPlaying ? 'PAUSE' : 'ÉCOUTER'}
          </span>
        </button>

        {ttsSupported && (
          <button
            onClick={handleTtsClick}
            style={{ ...btnBase, color: ttsActive ? primaryColor : 'var(--color-text-muted)' }}
            aria-label={ttsActive ? 'Arrêter la lecture' : "Lire l'article à voix haute (TTS)"}
            title={ttsActive ? 'Arrêter la lecture vocale' : 'Lecture vocale'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', animation: ttsActive ? 'dona-audio-pulse 1.2s ease-in-out infinite' : 'none' }}>
              {ttsActive ? 'stop_circle' : 'record_voice_over'}
            </span>
            <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.05em' }}>
              {ttsActive ? 'STOP' : 'LIRE'}
            </span>
          </button>
        )}
      </>
    );
  }

  if (ttsSupported) {
    return (
      <>
        <style>{pulseStyle}</style>
        <button
          onClick={handleTtsClick}
          style={{ ...btnBase, color: ttsActive ? primaryColor : 'var(--color-text-muted)' }}
          aria-label={ttsActive ? 'Arrêter la lecture' : "Lire l'article à voix haute"}
          title={ttsActive ? 'Arrêter la lecture vocale' : 'Lecture vocale en français'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px', animation: ttsActive ? 'dona-audio-pulse 1.2s ease-in-out infinite' : 'none' }}>
            {ttsActive ? 'stop_circle' : 'record_voice_over'}
          </span>
          <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.05em' }}>
            {ttsActive ? 'STOP' : 'LIRE'}
          </span>
        </button>
      </>
    );
  }

  return null;
}

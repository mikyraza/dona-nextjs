'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ArticleTtsBanner
 *
 * Immersive TTS banner at the end of article body.
 * Uses browser Web Speech API with speech-dispatcher backend (fr-FR).
 * Shows diagnostic state when voices are not yet loaded.
 */
export default function ArticleTtsBanner({ article, primaryColor = '#A30626' }) {
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [voiceLabel, setVoiceLabel] = useState('fr-FR');
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [ttsError, setTtsError] = useState(null);
  const utteranceRef = useRef(null);
  const keepAliveRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setTtsSupported(true);

    const tryLoadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        const frVoice =
          voices.find(v => v.lang === 'fr-FR') ||
          voices.find(v => v.lang.startsWith('fr'));
        if (frVoice) {
          setVoiceLabel(frVoice.name.split(' ').slice(0, 2).join(' ') || 'fr-FR');
        }
      }
    };

    tryLoadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', tryLoadVoices);

    // Some browsers (Firefox/Linux) need a small delay before voiceschanged fires
    const timer = setTimeout(tryLoadVoices, 500);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', tryLoadVoices);
      clearTimeout(timer);
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  const buildText = useCallback(() => {
    const parts = [];
    if (article?.title) parts.push(article.title + '.');
    if (article?.desc || article?.summary) {
      parts.push((article.desc || article.summary) + '.');
    }
    if (article?.content) {
      const div = document.createElement('div');
      div.innerHTML = article.content;
      const raw = (div.textContent || div.innerText || '').trim();
      if (raw) parts.push(raw.slice(0, 3000));
    }
    return parts.join(' ').trim();
  }, [article]);

  const getFrenchVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.lang === 'fr-FR') ||
      voices.find(v => v.lang.startsWith('fr')) ||
      null
    );
  };

  const handleToggle = () => {
    if (!ttsSupported) return;
    setTtsError(null);

    if (ttsActive) {
      // Stop
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
      window.speechSynthesis.cancel();
      setTtsActive(false);
      return;
    }

    // Make sure synthesis is not paused (Chrome bug)
    window.speechSynthesis.cancel();

    const text = buildText();
    if (!text) {
      setTtsError("Contenu de l'article non disponible pour la lecture.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const frVoice = getFrenchVoice();
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = () => {
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
      setTtsActive(false);
    };

    utterance.onerror = (e) => {
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
      setTtsActive(false);
      if (e.error !== 'interrupted') {
        console.error('[TTS] Error:', e.error);
        setTtsError(`Erreur TTS : ${e.error}. Vérifiez que le son est activé.`);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setTtsActive(true);

    // Chrome workaround: speechSynthesis pauses after ~15s without this
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

  if (!ttsSupported) return null;

  const isReady = voicesLoaded;

  return (
    <div style={{ marginTop: '48px', borderTop: `2px solid ${primaryColor}22`, paddingTop: '32px' }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor}0a 0%, ${primaryColor}18 100%)`,
          border: `1px solid ${primaryColor}33`,
          borderLeft: `4px solid ${primaryColor}`,
          borderRadius: '6px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {/* Animated icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: ttsActive ? primaryColor : `${primaryColor}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.3s ease',
            animation: ttsActive ? 'dona-tts-ring 1.4s ease-in-out infinite' : 'none',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '24px',
              color: ttsActive ? '#fff' : primaryColor,
              transition: 'color 0.3s ease',
            }}
          >
            {ttsActive ? 'stop_circle' : 'record_voice_over'}
          </span>
        </div>

        {/* Text block */}
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text)', marginBottom: '4px' }}>
            {ttsActive ? '🎙 Lecture en cours…' : '🎙 Écouter cet article'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            {ttsError ? (
              <span style={{ color: '#dc2626' }}>⚠ {ttsError}</span>
            ) : ttsActive ? (
              'Cliquez sur Stop pour interrompre la lecture.'
            ) : isReady ? (
              `Synthèse vocale native en français — voix ${voiceLabel}. Sans abonnement audio ni clé API.`
            ) : (
              'Chargement des voix en cours…'
            )}
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={handleToggle}
          disabled={!isReady && !ttsActive}
          style={{
            border: `1.5px solid ${ttsActive ? '#dc2626' : isReady ? primaryColor : '#ccc'}`,
            background: ttsActive ? '#dc2626' : isReady ? primaryColor : '#eee',
            color: isReady || ttsActive ? '#fff' : '#999',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: isReady || ttsActive ? 'pointer' : 'wait',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          aria-label={ttsActive ? 'Arrêter la lecture vocale' : "Lancer la lecture vocale de l'article"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {ttsActive ? 'stop' : 'play_arrow'}
          </span>
          {ttsActive ? 'STOP' : isReady ? 'ÉCOUTER' : '…'}
        </button>
      </div>

      <style>{`
        @keyframes dona-tts-ring {
          0%, 100% { box-shadow: 0 0 0 0 ${primaryColor}55; }
          50%       { box-shadow: 0 0 0 8px ${primaryColor}00; }
        }
      `}</style>
    </div>
  );
}

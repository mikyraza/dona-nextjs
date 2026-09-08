"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'FR', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'EN', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'SW', name: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' },
  { code: 'ES', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'PT', name: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'IT', name: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'AR', name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

import { TRANSLATIONS } from '@/lib/i18n/translations';
import { MASTER_PHRASES, translateText } from '@/lib/i18n/masterDictionary';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('FR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('dona_language');
      if (saved && (TRANSLATIONS[saved] || ['FR', 'EN', 'SW', 'ES', 'PT', 'DE', 'IT', 'AR'].includes(saved))) {
        setLang(saved);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('dona_language', lang);
      } catch (e) {}
      const targetLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
      document.documentElement.setAttribute('lang', lang.toLowerCase());
      document.documentElement.setAttribute('dir', targetLangObj.dir);
    }
  }, [lang, mounted]);

  // Universal Direct-DOM Translation Engine
  useEffect(() => {
    if (!mounted || typeof document === 'undefined') return;

    if (!window.__dona_orig_texts) window.__dona_orig_texts = new WeakMap();
    if (!window.__dona_orig_attrs) window.__dona_orig_attrs = new WeakMap();
    const origTexts = window.__dona_orig_texts;
    const origAttrs = window.__dona_orig_attrs;

    let isTranslating = false;

    function walkAndTranslate(root) {
      if (!root || isTranslating) return;
      

      try {
        // 1. Translate all text nodes
        const walker = document.createTreeWalker(
          root,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName;
              if (['SCRIPT', 'STYLE', 'SVG', 'CODE', 'PRE'].includes(tag)) {
                return NodeFilter.FILTER_REJECT;
              }
              if (parent.closest('[data-no-translate="true"]')) {
                return NodeFilter.FILTER_REJECT;
              }
              if (!node.nodeValue || !node.nodeValue.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        const nodes = [];
        let curr;
        while ((curr = walker.nextNode())) {
          nodes.push(curr);
        }

        for (const node of nodes) {
          if (!origTexts.has(node)) {
            origTexts.set(node, node.nodeValue);
          }
          const original = origTexts.get(node);
          if (lang === 'FR') {
            if (node.nodeValue !== original) {
              node.nodeValue = original;
            }
          } else {
            const translated = translateText(original, lang);
            if (translated && node.nodeValue !== translated) {
              node.nodeValue = translated;
            }
          }
        }

        // 2. Translate attributes (placeholder, aria-label, title)
        const selector = 'input[placeholder], textarea[placeholder], [title], [aria-label]';
        const elements = root.querySelectorAll ? root.querySelectorAll(selector) : [];
        for (const el of elements) {
          // Placeholder
          if (el.placeholder) {
            if (!origAttrs.has(el)) origAttrs.set(el, {});
            const saved = origAttrs.get(el);
            if (!saved.placeholder) saved.placeholder = el.placeholder;
            if (lang === 'FR') {
              el.placeholder = saved.placeholder;
            } else {
              const tr = translateText(saved.placeholder, lang);
              if (tr && el.placeholder !== tr) el.placeholder = tr;
            }
          }
          // Aria-label
          const aria = el.getAttribute('aria-label');
          if (aria) {
            if (!origAttrs.has(el)) origAttrs.set(el, {});
            const saved = origAttrs.get(el);
            if (!saved.ariaLabel) saved.ariaLabel = aria;
            if (lang === 'FR') {
              el.setAttribute('aria-label', saved.ariaLabel);
            } else {
              const tr = translateText(saved.ariaLabel, lang);
              if (tr && el.getAttribute('aria-label') !== tr) el.setAttribute('aria-label', tr);
            }
          }
        }
      } finally {
        setTimeout(() => {
          isTranslating = false;
        }, 30);
      }
    }

    // Run on initial language switch
    walkAndTranslate(document.body);

    // Continuous observation for page transitions and newly loaded content
    const observer = new MutationObserver((mutations) => {
      if (isTranslating) return;
      for (const mut of mutations) {
        if (mut.type === 'childList' && mut.addedNodes.length > 0) {
          for (const node of mut.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              walkAndTranslate(node);
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [lang, mounted]);

  const changeLanguage = (newLangCode) => {
    if (TRANSLATIONS[newLangCode] || ['FR', 'EN', 'SW', 'ES', 'PT', 'DE', 'IT', 'AR'].includes(newLangCode)) {
      setLang(newLangCode);
    }
  };

  const t = (key) => {
    if (!key) return '';
    if (lang === 'FR') {
      return TRANSLATIONS.FR[key] || key;
    }
    // 1. Direct dictionary key
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    // 2. Direct master phrase lookup
    const translated = translateText(key, lang);
    if (translated && translated !== key) {
      return translated;
    }
    // 3. Reverse lookup in TRANSLATIONS.FR
    for (const [k, frVal] of Object.entries(TRANSLATIONS.FR)) {
      if (typeof frVal === 'string' && frVal.trim().toLowerCase() === key.trim().toLowerCase()) {
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][k]) {
          return TRANSLATIONS[lang][k];
        }
      }
    }
    return TRANSLATIONS.FR[key] || key;
  };

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, currentLangObj, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'FR',
      changeLanguage: () => {},
      t: (key) => TRANSLATIONS.FR[key] || key,
      currentLangObj: LANGUAGES[0],
      LANGUAGES
    };
  }
  return context;
}

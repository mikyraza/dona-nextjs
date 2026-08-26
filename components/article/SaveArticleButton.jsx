"use client";

import React, { useState, useEffect } from 'react';

export default function SaveArticleButton({ articleId, title, meta, image, ctaHref, type = "ARTICLE", primaryColor = "#a31835" }) {
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dona_saved_items');
      if (stored) {
        const ids = new Set(JSON.parse(stored));
        if (ids.has(articleId)) {
          setIsSaved(true);
        }
      }
    } catch (e) {
      console.error("Error reading dona_saved_items:", e);
    }
  }, [articleId]);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleSave = () => {
    try {
      const stored = localStorage.getItem('dona_saved_items');
      const ids = stored ? new Set(JSON.parse(stored)) : new Set();
      let nextState = false;

      if (ids.has(articleId)) {
        ids.delete(articleId);
        nextState = false;
        showToastMsg("Article retiré de votre Espace Lecture");
      } else {
        ids.add(articleId);
        nextState = true;
        showToastMsg("Article sauvegardé dans votre Espace Lecture !");
      }

      setIsSaved(nextState);
      localStorage.setItem('dona_saved_items', JSON.stringify(Array.from(ids)));
    } catch (e) {
      console.error("Error saving article:", e);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#111111',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'var(--font-primary)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 99999,
          display: 'flex',
          align-items: 'center',
          gap: '8px',
          borderLeft: `4px solid ${primaryColor}`
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: primaryColor }}>bookmark</span>
          {toast}
        </div>
      )}

      <button
        onClick={handleToggleSave}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          color: isSaved ? primaryColor : "var(--color-text-muted)",
          transition: "all 0.2s ease"
        }}
        title={isSaved ? "Retirer des favoris" : "Sauvegarder dans mon Espace Lecture"}
      >
        <span className="material-symbols-outlined" style={{ color: isSaved ? primaryColor : "inherit", fontSize: "22px" }}>
          {isSaved ? "bookmark_added" : "bookmark"}
        </span>
        <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.05em" }}>
          {isSaved ? "SAUVÉ" : "SAUVER"}
        </span>
      </button>
    </div>
  );
}

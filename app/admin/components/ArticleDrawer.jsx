"use client";

import React, { useState, useEffect } from 'react';

// The 16 official magazine universes
const UNIVERSES = [
  { id: "intelligence", name: "01. Intelligence" },
  { id: "power-lab", name: "02. Power Lab" },
  { id: "alliance", name: "03. L'Alliance" },
  { id: "agenda", name: "04. L'Agenda" },
  { id: "passions", name: "05. Passions" },
  { id: "art-de-vivre", name: "06. Art de Vivre" },
  { id: "academie", name: "07. Académie" },
  { id: "patrimoine", name: "08. Patrimoine" },
  { id: "longevity", name: "09. Longevity" },
  { id: "impact", name: "10. Impact" },
  { id: "culture-medias", name: "11. Culture & Médias" },
  { id: "cercle", name: "12. Le Cercle" },
  { id: "amour", name: "13. Amour" },
  { id: "beaute", name: "14. Beauté" },
  { id: "mariages", name: "15. Mariages" },
  { id: "sante", name: "16. Santé" }
];

export default function ArticleDrawer({ isOpen, onClose, onSave, article }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Elena Moretti');
  const [category, setCategory] = useState('intelligence');
  const [content, setContent] = useState('');
  const [isVipOnly, setIsVipOnly] = useState(false);

  // Sync state when article prop changes (Edit vs Create mode)
  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setAuthor(article.author || 'Elena Moretti');
      
      // Match category slug
      const categoryLower = (article.category || article.type || 'intelligence').toLowerCase();
      const matchedUniverse = UNIVERSES.find(u => 
        categoryLower.includes(u.id) || u.name.toLowerCase().includes(categoryLower)
      );
      setCategory(matchedUniverse ? matchedUniverse.id : 'intelligence');
      
      setContent(article.content || '');
      setIsVipOnly(article.status === 'Published' || article.isVipOnly || false);
    } else {
      // Reset form for new article
      setTitle('');
      setAuthor('Elena Moretti');
      setCategory('intelligence');
      setContent('');
      setIsVipOnly(false);
    }
  }, [article, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Call API Integration Blueprint Action
    // In production, this would trigger a real POST or PUT request:
    /*
    const apiEndpoint = article ? `/api/magazines` : `/api/magazines`;
    const apiMethod = article ? 'PUT' : 'POST';
    try {
      const response = await fetch(apiEndpoint, {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.jwt_token}`
        },
        body: JSON.stringify({
          id: article?.id,
          title,
          author,
          category,
          content,
          isVipOnly
        })
      });
      const data = await response.json();
      if (response.ok) {
        onSave(data);
      }
    } catch (err) {
      console.error("API update error:", err);
    }
    */

    // Pass data back to parent state
    onSave({
      id: article?.id || `art-${Date.now()}`,
      title,
      author,
      category: UNIVERSES.find(u => u.id === category)?.name || category,
      content,
      status: isVipOnly ? "Published" : "Draft",
      isVipOnly,
      updated: "À l'instant"
    });

    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div 
        className="drawer-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2>{article ? "Modifier l'article" : "Nouvel Article"}</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          {/* Title input */}
          <div className="drawer-input-group">
            <label htmlFor="drawer-title">Titre de l'article</label>
            <input
              id="drawer-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Saisissez un titre élégant..."
              required
              className="drawer-text-input title-field"
              autoFocus
            />
          </div>

          {/* Author input (Pre-populated) */}
          <div className="drawer-input-group">
            <label htmlFor="drawer-author">Auteur</label>
            <input
              id="drawer-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nom de l'auteur"
              required
              className="drawer-text-input"
            />
          </div>

          {/* Category Selector (Universes) */}
          <div className="drawer-input-group">
            <label htmlFor="drawer-category">Univers / Magazine</label>
            <div className="select-wrapper">
              <select
                id="drawer-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="drawer-select"
              >
                {UNIVERSES.map((universe) => (
                  <option key={universe.id} value={universe.id}>
                    {universe.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rich Content Textarea */}
          <div className="drawer-input-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="drawer-content">Contenu éditorial (HTML / Texte)</label>
            <textarea
              id="drawer-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez le corps de l'article ici..."
              className="drawer-textarea"
            />
          </div>

          {/* VIP Toggle Switch */}
          <div className="drawer-toggle-group">
            <div className="toggle-info">
              <span className="toggle-label">Accès VIP uniquement</span>
              <span className="toggle-desc">Restreindre cet article aux membres abonnés au Club DONA.</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={isVipOnly}
                onChange={(e) => setIsVipOnly(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="drawer-actions">
            <button 
              type="button" 
              className="btn-drawer secondary" 
              onClick={onClose}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-drawer primary"
            >
              {article ? "Enregistrer" : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

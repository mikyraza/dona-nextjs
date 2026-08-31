"use client";

import React, { useState, useEffect } from 'react';

export default function AdminJeuxPage() {
  const DEFAULT_CONFIG = {
    heroRiddle: {
      title: "Le Labyrinthe des Ambitions",
      subtitle: "Seuls 12 % de nos membres trouvent la voie optimale.",
      difficulty: "Expert",
      timeAvg: "14 min",
      question: "Quatre dirigeants siègent à des distances égales. Le premier contrôle la ressource, le deuxième détient l'information, le troisième possède l'influence. Où devez-vous vous placer pour diriger la décision sans jamais révéler votre rôle ?",
      answerKeyword: "centre",
      successRate: "12%"
    },
    gamesList: [
      {
        id: "simulations",
        category: "SIMULATIONS STRATÉGIQUES",
        title: "Théorie des Jeux",
        subtitle: "Scénarios corporatifs et dilemmes historiques en temps réel.",
        badge: "NOUVEAU",
        meta: "12 Cas Actifs"
      },
      {
        id: "echecs",
        category: "ÉCHECS",
        title: "Le Cercle des Maîtres",
        subtitle: "Puzzles de niveau Grand Maître. Analyse des parties historiques.",
        badge: "VIP",
        meta: "Saison 4"
      },
      {
        id: "enigmes",
        category: "ÉNIGMES & CRYPTOGRAMMES",
        title: "L'Atelier des Paradoxes",
        subtitle: "Réflexion pure. Seuls 12 % de nos membres trouvent la voie optimale.",
        badge: "EXPERT",
        meta: "N° 402 · 14 min"
      },
      {
        id: "mots-croises",
        category: "MOTS CROISÉS & FLECHÉS",
        title: "Mots Fléchés du Cercle",
        subtitle: "Grilles thématiques autour du luxe, de la haute couture et de l'économie.",
        badge: "POPULAIRE",
        meta: "Grille Hebdo"
      },
      {
        id: "rebus-visuel",
        category: "REBUS & ÉNIGMES VISUELLES",
        title: "Le Rebus des Symboles",
        subtitle: "Déchiffrez l'énigme visuelle composée de pictogrammes et métaphores.",
        badge: "LITTÉRAIRE",
        meta: "Défi Image"
      }
    ],
    motsCroises: [
      { id: "mc-1", title: "Mots Fléchés N°48 - Spécial Haute Couture", gridSize: "10x10", wordsCount: 15, difficulty: "Avancé" },
      { id: "mc-2", title: "Grille Cryptée N°47 - Géopolitique du Luxe", gridSize: "12x12", wordsCount: 18, difficulty: "Expert" }
    ],
    rebusVisuels: [
      { id: "reb-1", title: "Le Rébus du Pouvoir Solaire", solution: "Souveraineté", hint: "Qualité de ce qui est sans supérieur" },
      { id: "reb-2", title: "Le Cryptogramme Vénitien", solution: "Mascarade", hint: "Fête de personnes masquées" }
    ],
    tournoiConfig: {
      season: "Saison 4",
      nextDate: "28 Juillet 2026",
      status: "Ouvert",
      title: "Le Tournoi des Décideurs",
      desc: "Notre compétition mensuelle de prise de décision sous pression. Affrontez d'autres membres du Cercle dans des scénarios économiques simulés."
    }
  };

  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('riddles'); // 'riddles' | 'games' | 'mots-croises' | 'rebus' | 'tournoi'
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/jeux')
      .then(res => res.json())
      .then(data => {
        if (data && data.heroRiddle) setConfig(data);
      })
      .catch(err => console.error("Error loading jeux config from API:", err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/jeux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('dona_jeux_config', JSON.stringify(config));
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving jeux config:", err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const handleAddGame = () => {
    const newGame = {
      id: `game-${Date.now()}`,
      category: "NOUVEAU GENRE",
      title: "Nouveau Jeu Interactif",
      subtitle: "Description du jeu...",
      badge: "NOUVEAU",
      meta: "Disponible"
    };
    setConfig(prev => ({ ...prev, gamesList: [...prev.gamesList, newGame] }));
  };

  const handleRemoveGame = (id) => {
    setConfig(prev => ({ ...prev, gamesList: prev.gamesList.filter(g => g.id !== id) }));
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="dashboard-title-row" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#111' }}>
          🎮 Gestion du Hub des Jeux & Énigmes du Cercle
        </h1>
        <p style={{ color: '#666', fontSize: '13px' }}>
          Gérez l'énigme du jour, les mots fléchés, les rébus visuels, la grille des jeux et les tournois.
        </p>
      </div>

      {saveSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid #10B981', padding: '12px 20px', borderRadius: '4px', marginBottom: '20px', fontWeight: '600', fontSize: '13px' }}>
          ✓ Configuration de la page Jeux enregistrée avec succès !
        </div>
      )}

      {/* Tabs bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #EFEFEF', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('riddles')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'riddles' ? '700' : '500',
            color: activeTab === 'riddles' ? '#8B002A' : '#666',
            borderBottom: activeTab === 'riddles' ? '3px solid #8B002A' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          1. Énigme du Jour
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mots-croises')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'mots-croises' ? '700' : '500',
            color: activeTab === 'mots-croises' ? '#8B002A' : '#666',
            borderBottom: activeTab === 'mots-croises' ? '3px solid #8B002A' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          2. Mots Croisés & Fléchés
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rebus')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'rebus' ? '700' : '500',
            color: activeTab === 'rebus' ? '#8B002A' : '#666',
            borderBottom: activeTab === 'rebus' ? '3px solid #8B002A' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          3. Rébus & Visuels
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('games')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'games' ? '700' : '500',
            color: activeTab === 'games' ? '#8B002A' : '#666',
            borderBottom: activeTab === 'games' ? '3px solid #8B002A' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          4. Catalogue des Jeux
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tournoi')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'tournoi' ? '700' : '500',
            color: activeTab === 'tournoi' ? '#8B002A' : '#666',
            borderBottom: activeTab === 'tournoi' ? '3px solid #8B002A' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          5. Tournoi des Décideurs
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Tab 1: Hero Riddle */}
        {activeTab === 'riddles' && (
          <div style={{ background: '#FFFFFF', padding: '24px', border: '1px solid #EFEFEF', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#8B002A', marginBottom: '16px' }}>
              Configuration de l'Énigme du Jour (Hero)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Titre de l'Énigme</label>
                <input type="text" className="drawer-text-input" value={config.heroRiddle.title} onChange={(e) => setConfig(prev => ({ ...prev, heroRiddle: { ...prev.heroRiddle, title: e.target.value } }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Niveau de Difficulté</label>
                <input type="text" className="drawer-text-input" value={config.heroRiddle.difficulty} onChange={(e) => setConfig(prev => ({ ...prev, heroRiddle: { ...prev.heroRiddle, difficulty: e.target.value } }))} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Texte de la Question / Dilemme</label>
              <textarea className="drawer-text-input" style={{ height: '80px', resize: 'vertical' }} value={config.heroRiddle.question} onChange={(e) => setConfig(prev => ({ ...prev, heroRiddle: { ...prev.heroRiddle, question: e.target.value } }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Mot-clé de réponse exacte (ex: centre)</label>
                <input type="text" className="drawer-text-input" value={config.heroRiddle.answerKeyword} onChange={(e) => setConfig(prev => ({ ...prev, heroRiddle: { ...prev.heroRiddle, answerKeyword: e.target.value } }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Taux de Réussite Estimé (ex: 12%)</label>
                <input type="text" className="drawer-text-input" value={config.heroRiddle.successRate} onChange={(e) => setConfig(prev => ({ ...prev, heroRiddle: { ...prev.heroRiddle, successRate: e.target.value } }))} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Mots Croisés */}
        {activeTab === 'mots-croises' && (
          <div style={{ background: '#FFFFFF', padding: '24px', border: '1px solid #EFEFEF', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#8B002A', marginBottom: '16px' }}>
              Module Mots Croisés & Mots Fléchés du Cercle
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              Publiez et configurez les grilles hebdomadaires interactives de mots fléchés autour des thèmes de DONA (Haute Couture, Art de Vivre, Géopolitique).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(config.motsCroises || []).map((mc, idx) => (
                <div key={mc.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '4px', background: '#FAF9F6' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#8B002A', marginBottom: '10px' }}>Grille #{idx + 1} : {mc.title}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Titre de la grille</label>
                      <input type="text" className="drawer-text-input" value={mc.title} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, motsCroises: prev.motsCroises.map(m => m.id === mc.id ? { ...m, title: val } : m) }));
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Taille (ex: 10x10)</label>
                      <input type="text" className="drawer-text-input" value={mc.gridSize} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, motsCroises: prev.motsCroises.map(m => m.id === mc.id ? { ...m, gridSize: val } : m) }));
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Difficulté</label>
                      <input type="text" className="drawer-text-input" value={mc.difficulty} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, motsCroises: prev.motsCroises.map(m => m.id === mc.id ? { ...m, difficulty: val } : m) }));
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Rébus & Visuels */}
        {activeTab === 'rebus' && (
          <div style={{ background: '#FFFFFF', padding: '24px', border: '1px solid #EFEFEF', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#8B002A', marginBottom: '16px' }}>
              Module Rébus & Énigmes Visuelles
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              Gérez les rébus littéraires et pictogrammes visuels à déchiffrer.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(config.rebusVisuels || []).map((reb, idx) => (
                <div key={reb.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '4px', background: '#FAF9F6' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#8B002A', marginBottom: '10px' }}>Rébus #{idx + 1} : {reb.title}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Titre du Rébus</label>
                      <input type="text" className="drawer-text-input" value={reb.title} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, rebusVisuels: prev.rebusVisuels.map(r => r.id === reb.id ? { ...r, title: val } : r) }));
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Solution / Mot à trouver</label>
                      <input type="text" className="drawer-text-input" value={reb.solution} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, rebusVisuels: prev.rebusVisuels.map(r => r.id === reb.id ? { ...r, solution: val } : r) }));
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Indice offert</label>
                      <input type="text" className="drawer-text-input" value={reb.hint} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, rebusVisuels: prev.rebusVisuels.map(r => r.id === reb.id ? { ...r, hint: val } : r) }));
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Games Catalogue */}
        {activeTab === 'games' && (
          <div style={{ background: '#FFFFFF', padding: '24px', border: '1px solid #EFEFEF', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#8B002A', margin: 0 }}>
                Catalogue des Jeux de l'Esprit ({config.gamesList.length})
              </h3>
              <button type="button" onClick={handleAddGame} style={{ background: '#8B002A', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '2px', cursor: 'pointer', fontSize: '12px' }}>
                + Ajouter un jeu
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {config.gamesList.map((g, idx) => (
                <div key={g.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '4px', background: '#FAF9F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#8B002A' }}>Jeu #{idx + 1} : {g.title}</span>
                    <button type="button" onClick={() => handleRemoveGame(g.id)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Supprimer</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Titre du Jeu</label>
                      <input type="text" className="drawer-text-input" value={g.title} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, gamesList: prev.gamesList.map(item => item.id === g.id ? { ...item, title: val } : item) }));
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Catégorie</label>
                      <input type="text" className="drawer-text-input" value={g.category} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, gamesList: prev.gamesList.map(item => item.id === g.id ? { ...item, category: val } : item) }));
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Badge (ex: VIP, NOUVEAU, EXPERT)</label>
                      <input type="text" className="drawer-text-input" value={g.badge} onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({ ...prev, gamesList: prev.gamesList.map(item => item.id === g.id ? { ...item, badge: val } : item) }));
                      }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>Sous-titre / Description</label>
                    <input type="text" className="drawer-text-input" value={g.subtitle} onChange={(e) => {
                      const val = e.target.value;
                      setConfig(prev => ({ ...prev, gamesList: prev.gamesList.map(item => item.id === g.id ? { ...item, subtitle: val } : item) }));
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Tournoi */}
        {activeTab === 'tournoi' && (
          <div style={{ background: '#FFFFFF', padding: '24px', border: '1px solid #EFEFEF', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#8B002A', marginBottom: '16px' }}>
              Paramètres du Tournoi des Décideurs
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Saison</label>
                <input type="text" className="drawer-text-input" value={config.tournoiConfig.season} onChange={(e) => setConfig(prev => ({ ...prev, tournoiConfig: { ...prev.tournoiConfig, season: e.target.value } }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Date Prochain Tournoi</label>
                <input type="text" className="drawer-text-input" value={config.tournoiConfig.nextDate} onChange={(e) => setConfig(prev => ({ ...prev, tournoiConfig: { ...prev.tournoiConfig, nextDate: e.target.value } }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Statut (ex: Ouvert / Complet)</label>
                <input type="text" className="drawer-text-input" value={config.tournoiConfig.status} onChange={(e) => setConfig(prev => ({ ...prev, tournoiConfig: { ...prev.tournoiConfig, status: e.target.value } }))} />
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ background: '#8B002A', color: '#FFFFFF', border: 'none', padding: '14px 28px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer' }}>
            Enregistrer la configuration des jeux
          </button>
        </div>

      </form>
    </div>
  );
}

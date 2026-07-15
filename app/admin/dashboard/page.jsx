"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ArticleDrawer from '../components/ArticleDrawer';

export default function DashboardPage() {
  const [activities, setActivities] = useState([
    {
      id: "act-1",
      type: "Article",
      title: "L'avenir de la presse indépendante",
      author: "E. Moretti",
      status: "Published",
      updated: "2h ago",
    },
    {
      id: "act-2",
      type: "Vidéo",
      title: "Reportage: Les coulisses de DONA",
      author: "M. Dupont",
      status: "Scheduled",
      updated: "5h ago",
    },
    {
      id: "act-3",
      type: "Podcast",
      title: "Épisode 12: Tech & Éthique",
      author: "S. Lefebvre",
      status: "Draft",
      updated: "1d ago",
    }
  ]);
  const [globalConfig, setGlobalConfig] = useState(null);
  const [timeRange, setTimeRange] = useState("7D"); // 7 days selected by default
  const [loading, setLoading] = useState(true);

  // Phase 3.2: Drawer & CRUD State Management
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [publishedCount, setPublishedCount] = useState(24);

  // Active sync states
  const [activeMembersCount, setActiveMembersCount] = useState(1284);
  const [activeRadioTrack, setActiveRadioTrack] = useState("Intro Édito DONA Radio");

  // Sync state values on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCount = localStorage.getItem('dona_members_count');
      if (storedCount) {
        setActiveMembersCount(parseInt(storedCount, 10));
      }
      const storedTrack = localStorage.getItem('dona_radio_active_title');
      if (storedTrack) {
        setActiveRadioTrack(storedTrack);
      }
    }
  }, []);

  // Triggered when clicking + NOUVEL ARTICLE
  const handleOpenCreateDrawer = () => {
    setSelectedArticle(null);
    setIsDrawerOpen(true);
  };

  // Triggered when clicking Edit on a table row
  const handleOpenEditDrawer = (article) => {
    setSelectedArticle(article);
    setIsDrawerOpen(true);
  };

  // Handles adding or updating article in local state
  const handleSaveArticle = async (savedArticle) => {
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedArticle)
      });
      if (!response.ok) throw new Error("Erreur de synchronisation avec le serveur");
      const dbArticle = await response.json();
      
      const isEdit = activities.some(act => act.id === savedArticle.id);
      const typeMap = {
        text: "Article",
        video: "Vidéo",
        audio: "Podcast"
      };
      
      const mappedActivity = {
        ...dbArticle,
        type: typeMap[dbArticle.format] || "Article",
        author: "Rédaction",
        updated: "À l'instant"
      };

      if (isEdit) {
        setActivities(prev => prev.map(act => act.id === savedArticle.id ? mappedActivity : act));
        // Persist edits
        const localCustom = JSON.parse(localStorage.getItem('dona_custom_articles') || '[]');
        const updatedCustom = localCustom.map(art => art.id === savedArticle.id ? mappedActivity : art);
        localStorage.setItem('dona_custom_articles', JSON.stringify(updatedCustom));
        alert("Modifications enregistrées avec succès.");
      } else {
        setActivities(prev => [mappedActivity, ...prev]);
        // Persist new article
        const localCustom = JSON.parse(localStorage.getItem('dona_custom_articles') || '[]');
        localStorage.setItem('dona_custom_articles', JSON.stringify([mappedActivity, ...localCustom]));
        if (dbArticle.status === "Published") {
          setPublishedCount(prev => prev + 1);
        }
        alert("La publication a été mise en ligne sur le serveur principal.");
      }
    } catch (err) {
      console.error("API sync error:", err);
      alert("Erreur lors de la synchronisation avec le serveur principal : " + err.message);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [configRes, magazinesRes, articlesRes] = await Promise.all([
          fetch('/api/global-config'),
          fetch('/api/magazines'),
          fetch('/api/admin/articles')
        ]);

        if (configRes.ok) {
          const configData = await configRes.json();
          setGlobalConfig(configData);
        }

        if (magazinesRes.ok) {
          const magazinesData = await magazinesRes.json();
          let apiArticles = [];
          magazinesData.forEach(mag => {
            if (mag.articles) {
              mag.articles.forEach(art => {
                const author = art.meta ? art.meta.split(' • ')[0] : "Rédaction";
                apiArticles.push({
                  id: art.id,
                  type: "Article",
                  title: art.title,
                  author: author.replace("DR. ", ""),
                  status: art.isVipOnly ? "Published" : "Draft",
                  updated: "Récemment"
                });
              });
            }
          });

          if (articlesRes.ok) {
            const wpArticles = await articlesRes.json();
            const typeMap = { text: "Article", video: "Vidéo", audio: "Podcast" };
            wpArticles.forEach(art => {
              apiArticles.push({
                id: art.id,
                type: typeMap[art.format] || "Article",
                title: art.title,
                author: "Rédaction",
                status: art.status,
                updated: "Synchronisé"
              });
            });
          }

          // Merge custom articles from localStorage
          const localCustom = JSON.parse(localStorage.getItem('dona_custom_articles') || '[]');
          apiArticles = [...localCustom, ...apiArticles];

          if (apiArticles.length > 0) {
            setActivities(prev => {
              const combined = [...prev];
              apiArticles.forEach(apiArt => {
                if (!combined.some(c => c.title === apiArt.title || c.id === apiArt.id)) {
                  combined.push(apiArt);
                }
              });
              return combined.slice(0, 5);
            });
          }
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span>Admin</span>
        <span className="breadcrumbs-sep">&gt;</span>
        <span style={{ color: 'var(--admin-text-color)', fontWeight: '600' }}>Dashboard</span>
      </div>

      {/* Title & Time Selection */}
      <div className="dashboard-title-row">
        <h1>Dashboard</h1>
        
        <div className="time-selector">
          <button 
            className={`time-btn ${timeRange === '1D' ? 'active' : ''}`}
            onClick={() => setTimeRange('1D')}
          >
            Today
          </button>
          <button 
            className={`time-btn ${timeRange === '7D' ? 'active' : ''}`}
            onClick={() => setTimeRange('7D')}
          >
            7 days
          </button>
          <button 
            className={`time-btn ${timeRange === '30D' ? 'active' : ''}`}
            onClick={() => setTimeRange('30D')}
          >
            30 days
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <section className="metrics-grid">
        {/* Metric 1 */}
        <div className="metric-card">
          <div className="metric-card-title">Articles Published (7d)</div>
          <div className="metric-card-value">{publishedCount}</div>
          <div className="metric-card-sub" style={{ color: '#03543F' }}>
            <span style={{ fontWeight: '600' }}>+2</span> vs last week
          </div>
        </div>

        {/* Metric 2 */}
        <div className="metric-card">
          <div className="metric-card-title">Active Club Members</div>
          <div className="metric-card-value">{activeMembersCount.toLocaleString('fr-FR')}</div>
          <div className="metric-card-sub">
            Dynamique
          </div>
        </div>

        {/* Metric 3 */}
        <div className="metric-card">
          <div className="metric-card-title">Studio Live Status</div>
          <div className="metric-card-value">
            <span className="status-indicator-dot green" style={{ marginRight: '8px' }}></span>
            2 Active Streams
          </div>
          <div className="metric-card-sub">
            Radio & TV Broadcasting
          </div>
        </div>

        {/* Metric 4 */}
        <div className="metric-card">
          <div className="metric-card-title">Site Performance</div>
          <div className="metric-card-value">98.2%</div>
          <div className="metric-card-sub" style={{ color: '#03543F', fontWeight: '500' }}>
            Optimal
          </div>
        </div>
      </section>

      {/* Primary Action Buttons Row */}
      <section className="action-buttons-row">
        <button 
          className="btn-admin-action primary"
          onClick={() => { setSelectedArticle({ format: 'text' }); setIsDrawerOpen(true); }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Nouvel Article
        </button>
        <button 
          className="btn-admin-action secondary"
          onClick={() => { setSelectedArticle({ format: 'video' }); setIsDrawerOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>videocam</span>
          Nouvelle Vidéo
        </button>
        <button 
          className="btn-admin-action secondary"
          onClick={() => { setSelectedArticle({ format: 'audio' }); setIsDrawerOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mic</span>
          Nouvel Épisode
        </button>
        <button 
          className="btn-admin-action secondary"
          onClick={() => { window.location.href = '/admin/radio-live'; }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_arrow</span>
          Lancer Live
        </button>
      </section>

      {/* Two Column Content Area */}
      <div className="dashboard-columns-wrapper">
        {/* Left Column (Activities Table & System Alerts) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Recent Activities Table */}
          <div className="table-card">
            <div className="table-header">
              <h2 className="table-title">Activités récentes</h2>
              <Link href="/admin/articles" className="table-link">
                Voir tout
              </Link>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Type</th>
                  <th style={{ width: '45%' }}>Title</th>
                  <th style={{ width: '15%' }}>Author</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '10%' }}>Updated</th>
                  <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act.id}>
                    <td style={{ color: '#888888', fontWeight: '500' }}>{act.type}</td>
                    <td className="cell-bold">{act.title}</td>
                    <td>{act.author}</td>
                    <td>
                      <span className={`badge ${act.status.toLowerCase()}`}>
                        {act.status}
                      </span>
                    </td>
                    <td style={{ color: '#888888' }}>{act.updated}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        {act.type === "Article" ? (
                          <button 
                            onClick={() => handleOpenEditDrawer(act)} 
                            className="table-action-btn"
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Edit
                          </button>
                        ) : (
                          <span style={{ color: '#CCCCCC', fontSize: '12px' }}>Edit</span>
                        )}
                        <span className="table-action-divider">|</span>
                        <a href={`/admin/view/${act.id}`} className="table-action-btn secondary">View</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Warning & System Alerts */}
          <div className="alerts-container">
            <div className="admin-alert-box warning">
              <span className="material-symbols-outlined">warning</span>
              <span>3 articles: Missing metadata</span>
            </div>
            
            <div className="admin-alert-box danger">
              <span className="material-symbols-outlined">error</span>
              <span>Broken media links found</span>
            </div>
          </div>

        </div>

        {/* Right Column (Editorial Queue & Studio Status) */}
        <div>
          {/* Editorial Queue */}
          <div className="right-widget-card">
            <h3 className="right-widget-title">Queue éditoriale</h3>
            
            <div className="queue-list">
              <div className="queue-item">
                <span className="queue-badge high">Priorité Haute</span>
                <span className="queue-item-meta">À publier</span>
                <h4 className="queue-title">Correction interview politique</h4>
              </div>
              
              <div className="queue-item">
                <span className="queue-badge standard">Standard</span>
                <span className="queue-item-meta">À publier</span>
                <h4 className="queue-title">Mise en page dossier Culture</h4>
              </div>
            </div>
          </div>

          {/* Studio status widget */}
          <div className="right-widget-card">
            <h3 className="right-widget-title">Status Studio</h3>

            <div className="studio-widget-list">
              {/* Radio */}
              <div className="studio-status-item">
                <div className="studio-circle-icon active">
                  <span className="material-symbols-outlined">mic</span>
                </div>
                <div className="studio-info">
                  <div className="studio-type">Radio</div>
                  <div className="studio-status-text">
                    Live: <span>{activeRadioTrack}</span>
                  </div>
                </div>
                <button 
                  className="btn-studio-config"
                  onClick={() => { window.location.href = '/admin/radio-live'; }}
                >
                  Configurer
                </button>
              </div>

              {/* TV */}
              <div className="studio-status-item">
                <div className="studio-circle-icon inactive">
                  <span className="material-symbols-outlined">videocam</span>
                </div>
                <div className="studio-info">
                  <div className="studio-type">TV</div>
                  <div className="studio-status-text" style={{ color: '#888888' }}>
                    Off Air
                  </div>
                </div>
                <button 
                  className="btn-studio-config"
                  onClick={() => { window.location.href = '/admin/tv-live'; }}
                >
                  Configurer
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Slide-over Edit/Create Article Drawer */}
      <ArticleDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveArticle}
        article={selectedArticle}
      />
    </>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    // Fetch mock data from our local endpoints to simulate database integration
    const fetchDashboardData = async () => {
      try {
        const [configRes, magazinesRes] = await Promise.all([
          fetch('/api/global-config'),
          fetch('/api/magazines')
        ]);

        if (configRes.ok) {
          const configData = await configRes.json();
          setGlobalConfig(configData);
        }

        if (magazinesRes.ok) {
          const magazinesData = await magazinesRes.json();
          // Extract articles from the first magazine dynamically to enrich our activities list
          const apiArticles = [];
          magazinesData.forEach(mag => {
            if (mag.articles) {
              mag.articles.forEach(art => {
                // Extract author name from meta (e.g. "DR. ANTOINE MOREAU • 12 MIN DE LECTURE")
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

          // Merge fetched articles with screenshot activities to show live database sync
          if (apiArticles.length > 0) {
            setActivities(prev => {
              // Deduplicate and keep screenshot visual compliance first, then append API items
              const combined = [...prev];
              apiArticles.forEach(apiArt => {
                if (!combined.some(c => c.title === apiArt.title)) {
                  combined.push(apiArt);
                }
              });
              return combined.slice(0, 5); // Limit to 5 items max for display
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
          <div className="metric-card-value">24</div>
          <div className="metric-card-sub" style={{ color: '#03543F' }}>
            <span style={{ fontWeight: '600' }}>+2</span> vs last week
          </div>
        </div>

        {/* Metric 2 */}
        <div className="metric-card">
          <div className="metric-card-title">Active Club Members</div>
          <div className="metric-card-value">1,284</div>
          <div className="metric-card-sub">
            Stable
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
        <button className="btn-admin-action primary">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Nouvel Article
        </button>
        <button className="btn-admin-action secondary">
          Nouvelle Vidéo
        </button>
        <button className="btn-admin-action secondary">
          Nouvel Épisode
        </button>
        <button className="btn-admin-action secondary">
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
                        <a href={`/admin/edit/${act.id}`} className="table-action-btn">Edit</a>
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
                    Live: <span>Le Matinal</span>
                  </div>
                </div>
                <button className="btn-studio-config">Configurer</button>
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
                <button className="btn-studio-config">Configurer</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

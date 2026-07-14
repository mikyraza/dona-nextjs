"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import ArticleDrawer from '../components/ArticleDrawer';

// The 16 official magazine universes for category matching
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

export default function AdminCatchAllPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || [];
  const section = slug[0] || 'articles';
  const subsection = slug[1] || '';

  // 1. Articles State
  const [articles, setArticles] = useState([
    {
      id: "art-1",
      type: "Article",
      title: "L'avenir de la presse indépendante",
      author: "Elena Moretti",
      category: "01. Intelligence",
      status: "Published",
      updated: "2h ago",
      content: "La presse indépendante fait face à des défis sans précédent. Dans ce manifeste, nous explorons les nouveaux modèles économiques et d'engagement de l'audience."
    },
    {
      id: "art-2",
      type: "Article",
      title: "La Trajectoire de l’Effet Dunning-Kruger dans le Management",
      author: "Dr. Antoine Moreau",
      category: "01. Intelligence",
      status: "Published",
      updated: "1d ago",
      content: "Analyse critique du management moderne et de la perception des compétences au sein des organisations."
    },
    {
      id: "art-3",
      type: "Article",
      title: "L'Architecture du Silence : Esthétique Néo-Minimaliste",
      author: "Hélène de Ségur",
      category: "06. Art de Vivre",
      status: "Draft",
      updated: "3d ago",
      content: "Une plongée visuelle et philosophique dans les espaces calmes et les designs épurés de notre décennie."
    }
  ]);

  // 2. Videos State
  const [videos, setVideos] = useState([
    {
      id: "vid-1",
      title: "Reportage: Les coulisses de DONA",
      duration: "14:20",
      status: "Scheduled",
      updated: "5h ago",
      url: "https://youtube.com/watch?v=dona-backstage"
    },
    {
      id: "vid-2",
      title: "Le Pouvoir du Design Intemporel",
      duration: "08:45",
      status: "Published",
      updated: "2d ago",
      url: "https://youtube.com/watch?v=dona-design"
    }
  ]);

  // 3. Podcasts State
  const [podcasts, setPodcasts] = useState([
    {
      id: "pod-1",
      title: "The Brief: L'Analyse Hebdomadaire",
      episode: "Épisode 12: Tech & Éthique",
      duration: "45:00",
      status: "Draft",
      updated: "1d ago"
    },
    {
      id: "pod-2",
      title: "L'Architecture du Silence",
      episode: "Épisode 3: Espaces sacrés",
      duration: "32:15",
      status: "Published",
      updated: "4d ago"
    }
  ]);

  // 4. Members State
  const [members, setMembers] = useState([
    { id: "mem-1", name: "Marc Aubry", email: "marc@aubry.com", plan: "Club Annuel", status: "Active", joined: "12/03/2026" },
    { id: "mem-2", name: "Hélène de Ségur", email: "vip@dona.com", plan: "Club Premium", status: "Active", joined: "01/05/2026" },
    { id: "mem-3", name: "Claire Martin", email: "free@dona.com", plan: "Free Account", status: "Inactive", joined: "10/06/2026" }
  ]);

  // 5. Settings State
  const [brandSettings, setBrandSettings] = useState({
    siteName: "DONA MAGAZINE",
    tagline: "L'élégance éditoriale au quotidien",
    primaryColor: "#A30626",
    backgroundColor: "#FCF8F8",
    fontFamily: "Newsreader",
    seoTitle: "Dona Magazine | L'art de vivre d'une nouvelle ère",
    seoDescription: "Magazine d'intelligence, d'art de vivre et d'analyse premium.",
    contactEmail: "contact@dona-magazine.com"
  });

  // Drawer States
  const [isArticleDrawerOpen, setIsArticleDrawerOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Generic Media Modal States
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState('video'); // video or podcast
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDuration, setMediaDuration] = useState('');
  const [mediaStatus, setMediaStatus] = useState('Draft');

  // Handle article save
  const handleSaveArticle = (savedArticle) => {
    const isEdit = articles.some(art => art.id === savedArticle.id);

    // API BLUEPRINT COMMENTS:
    // This local state action simulates POST/PUT to /api/magazines
    if (isEdit) {
      setArticles(prev => prev.map(art => art.id === savedArticle.id ? { ...art, ...savedArticle } : art));
    } else {
      setArticles(prev => [savedArticle, ...prev]);
    }
  };

  // Handle media save
  const handleSaveMedia = (e) => {
    e.preventDefault();
    if (!mediaTitle.trim()) return;

    if (mediaType === 'video') {
      if (selectedMedia) {
        setVideos(prev => prev.map(v => v.id === selectedMedia.id ? { ...v, title: mediaTitle, duration: mediaDuration, status: mediaStatus } : v));
      } else {
        setVideos(prev => [{ id: `vid-${Date.now()}`, title: mediaTitle, duration: mediaDuration, status: mediaStatus, updated: "À l'instant" }, ...prev]);
      }
    } else {
      if (selectedMedia) {
        setPodcasts(prev => prev.map(p => p.id === selectedMedia.id ? { ...p, title: mediaTitle, duration: mediaDuration, status: mediaStatus } : p));
      } else {
        setPodcasts(prev => [{ id: `pod-${Date.now()}`, title: mediaTitle, duration: mediaDuration, status: mediaStatus, updated: "À l'instant" }, ...prev]);
      }
    }

    setIsMediaModalOpen(false);
  };

  const handleOpenMediaCreate = (type) => {
    setMediaType(type);
    setSelectedMedia(null);
    setMediaTitle('');
    setMediaDuration('');
    setMediaStatus('Draft');
    setIsMediaModalOpen(true);
  };

  const handleOpenMediaEdit = (type, item) => {
    setMediaType(type);
    setSelectedMedia(item);
    setMediaTitle(item.title);
    setMediaDuration(item.duration);
    setMediaStatus(item.status);
    setIsMediaModalOpen(true);
  };

  // Render Page Content based on route slug
  const renderContent = () => {
    switch (section) {
      case 'articles':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Articles</h1>
              <button className="btn-admin-action primary" onClick={() => { setSelectedArticle(null); setIsArticleDrawerOpen(true); }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Nouvel Article
              </button>
            </div>

            <div className="table-card" style={{ marginTop: '20px' }}>
              <div className="table-header">
                <h2 className="table-title">Liste des articles</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Magazine / Univers</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((art) => (
                    <tr key={art.id}>
                      <td className="cell-bold">{art.title}</td>
                      <td>{art.author}</td>
                      <td style={{ color: '#888888' }}>{art.category}</td>
                      <td>
                        <span className={`badge ${art.status.toLowerCase()}`}>
                          {art.status}
                        </span>
                      </td>
                      <td style={{ color: '#888888' }}>{art.updated}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button onClick={() => { setSelectedArticle(art); setIsArticleDrawerOpen(true); }} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                            Edit
                          </button>
                          <span className="table-action-divider">|</span>
                          <button onClick={() => setArticles(prev => prev.filter(a => a.id !== art.id))} className="table-action-btn secondary" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'var(--admin-accent-color)' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'videos':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Vidéos</h1>
              <button className="btn-admin-action primary" onClick={() => handleOpenMediaCreate('video')}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Nouvelle Vidéo
              </button>
            </div>

            <div className="table-card" style={{ marginTop: '20px' }}>
              <div className="table-header">
                <h2 className="table-title">Bibliothèque Vidéo</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Durée</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((vid) => (
                    <tr key={vid.id}>
                      <td className="cell-bold">{vid.title}</td>
                      <td>{vid.duration}</td>
                      <td>
                        <span className={`badge ${vid.status.toLowerCase()}`}>
                          {vid.status}
                        </span>
                      </td>
                      <td style={{ color: '#888888' }}>{vid.updated}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button onClick={() => handleOpenMediaEdit('video', vid)} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                            Edit
                          </button>
                          <span className="table-action-divider">|</span>
                          <button onClick={() => setVideos(prev => prev.filter(v => v.id !== vid.id))} className="table-action-btn secondary" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'var(--admin-accent-color)' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'podcasts':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Podcasts</h1>
              <button className="btn-admin-action primary" onClick={() => handleOpenMediaCreate('podcast')}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Nouvel Épisode
              </button>
            </div>

            <div className="table-card" style={{ marginTop: '20px' }}>
              <div className="table-header">
                <h2 className="table-title">Archives de Podcasts</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Émission</th>
                    <th>Épisode</th>
                    <th>Durée</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {podcasts.map((pod) => (
                    <tr key={pod.id}>
                      <td className="cell-bold">{pod.title}</td>
                      <td style={{ color: '#555555' }}>{pod.episode}</td>
                      <td>{pod.duration}</td>
                      <td>
                        <span className={`badge ${pod.status.toLowerCase()}`}>
                          {pod.status}
                        </span>
                      </td>
                      <td style={{ color: '#888888' }}>{pod.updated}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button onClick={() => handleOpenMediaEdit('podcast', pod)} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                            Edit
                          </button>
                          <span className="table-action-divider">|</span>
                          <button onClick={() => setPodcasts(prev => prev.filter(p => p.id !== pod.id))} className="table-action-btn secondary" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'var(--admin-accent-color)' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'dossiers':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Dossiers</h1>
              <button className="btn-admin-action primary" onClick={() => alert("Nouveau dossier local")}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Nouveau Dossier
              </button>
            </div>

            <div className="table-card" style={{ marginTop: '20px', padding: '40px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#CCCCCC' }}>folder_open</span>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', fontStyle: 'italic', marginTop: '16px' }}>
                Aucun dossier VIP structuré en local
              </h3>
              <p style={{ color: '#777777', fontSize: '14px', maxWidth: '400px', margin: '8px auto 0' }}>
                Utilisez l'espace d'administration pour organiser les archives et workbooks à télécharger.
              </p>
            </div>
          </>
        );

      case 'membres':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Membres Club</h1>
              <button className="btn-admin-action primary" onClick={() => alert("Ajout membre local")}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                Ajouter Membre
              </button>
            </div>

            <div className="table-card" style={{ marginTop: '20px' }}>
              <div className="table-header">
                <h2 className="table-title">Membres du Club DONA</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom Complet</th>
                    <th>Email</th>
                    <th>Abonnement Plan</th>
                    <th>Status</th>
                    <th>Date d'adhésion</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((mem) => (
                    <tr key={mem.id}>
                      <td className="cell-bold">{mem.name}</td>
                      <td>{mem.email}</td>
                      <td style={{ color: '#555555' }}>{mem.plan}</td>
                      <td>
                        <span className={`badge ${mem.status === 'Active' ? 'published' : 'draft'}`}>
                          {mem.status}
                        </span>
                      </td>
                      <td style={{ color: '#888888' }}>{mem.joined}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button onClick={() => setMembers(prev => prev.map(m => m.id === mem.id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m))} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                            Toggle Access
                          </button>
                          <span className="table-action-divider">|</span>
                          <button onClick={() => setMembers(prev => prev.filter(m => m.id !== mem.id))} className="table-action-btn secondary" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'var(--admin-accent-color)' }}>
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'settings':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Configuration : {subsection.toUpperCase() || 'GENERAL'}</h1>
            </div>

            <div className="table-card" style={{ marginTop: '20px', padding: '30px' }}>
              <form onSubmit={(e) => { e.preventDefault(); alert("Configuration sauvegardée !"); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="drawer-input-group">
                    <label>Nom du site</label>
                    <input
                      type="text"
                      className="drawer-text-input"
                      value={brandSettings.siteName}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div className="drawer-input-group">
                    <label>Slogan du site</label>
                    <input
                      type="text"
                      className="drawer-text-input"
                      value={brandSettings.tagline}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    />
                  </div>
                  <div className="drawer-input-group">
                    <label>Titre SEO Principal</label>
                    <input
                      type="text"
                      className="drawer-text-input"
                      value={brandSettings.seoTitle}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                    />
                  </div>
                  <div className="drawer-input-group">
                    <label>Email de contact général</label>
                    <input
                      type="email"
                      className="drawer-text-input"
                      value={brandSettings.contactEmail}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="drawer-input-group">
                  <label>Description SEO (Meta Description)</label>
                  <textarea
                    className="drawer-textarea"
                    value={brandSettings.seoDescription}
                    onChange={(e) => setBrandSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" className="btn-drawer primary" style={{ width: 'auto' }}>
                    Enregistrer la configuration
                  </button>
                </div>
              </form>
            </div>
          </>
        );

      case 'tags':
      case 'rubriques':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Taxonomies : {section.toUpperCase()}</h1>
            </div>

            <div className="table-card" style={{ marginTop: '20px', padding: '30px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', fontStyle: 'italic' }}>
                Gestionnaire de Taxonomies
              </h3>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input type="text" className="drawer-text-input" placeholder="Ajouter un terme..." style={{ flexGrow: 1 }} />
                <button className="btn-drawer primary" onClick={() => alert("Terme ajouté !")}>Ajouter</button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                {["Actualités", "Analyses", "Direct", "Replay", "VIP", "Tendance", "Management", "Design"].map((term) => (
                  <span key={term} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#FFF0F2', color: 'var(--admin-accent-color)', borderRadius: '2px', fontSize: '13px', fontWeight: '500' }}>
                    {term}
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-accent-color)', display: 'flex', alignItems: 'center', padding: 0 }} onClick={() => alert("Retirer terme")}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </>
        );

      case 'radio-live':
      case 'tv-live':
      case 'replays':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Studio & Direct ({section.toUpperCase()})</h1>
            </div>

            <div className="table-card" style={{ marginTop: '20px', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--admin-border-color)' }}>
                <span className="status-indicator-dot green" style={{ width: '12px', height: '12px' }}></span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Le studio de diffusion est actif</h3>
                  <p style={{ margin: '4px 0 0', color: '#888888', fontSize: '12px' }}>Type : {section === 'radio-live' ? 'Radio Audio Stream' : 'TV Video Stream'}</p>
                </div>
                <button className="btn-drawer primary" style={{ marginLeft: 'auto', background: '#D11A2A' }} onClick={() => alert("Flux arrêté !")}>
                  Couper le flux
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '20px' }}>
                <div className="drawer-input-group">
                  <label>Titre de l'émission courante</label>
                  <input type="text" className="drawer-text-input" defaultValue="Le Brief de Dona" />
                </div>
                <div className="drawer-input-group">
                  <label>Lien de streaming source (RTMP / HLS)</label>
                  <input type="text" className="drawer-text-input" defaultValue="rtmp://live.dona-magazine.com/studio" />
                </div>
              </div>
            </div>
          </>
        );

      case 'plans':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Gestion des Abonnements (Plans & Paywall)</h1>
            </div>

            <div className="metrics-grid" style={{ marginTop: '20px' }}>
              <div className="metric-card">
                <div className="metric-card-title">Plan Actif Principal</div>
                <div className="metric-card-value">950€</div>
                <div className="metric-card-sub">Adhésion Annuelle</div>
              </div>
              <div className="metric-card">
                <div className="metric-card-title">Taux de conversion VIP</div>
                <div className="metric-card-value">12.4%</div>
                <div className="metric-card-sub">Objectif : 15%</div>
              </div>
            </div>

            <div className="table-card" style={{ marginTop: '20px', padding: '30px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', fontStyle: 'italic', marginBottom: '15px' }}>
                Configuration du Paywall VIP
              </h3>
              <div className="drawer-input-group">
                <label>Texte d'appel à l'action paywall</label>
                <textarea className="drawer-textarea" defaultValue="Rejoignez le Club DONA pour débloquer l'accès exclusif à nos magazines, articles premium et documentaires inédits." />
              </div>
              <button className="btn-drawer primary" style={{ marginTop: '15px' }} onClick={() => alert("Paywall sauvegardé !")}>
                Mettre à jour le paywall
              </button>
            </div>
          </>
        );

      default:
        return (
          <div className="table-card" style={{ padding: '40px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>Section en cours de chargement</h2>
            <p style={{ color: '#888888' }}>La configuration de {section} est en attente de synchronisation.</p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span>Admin</span>
        <span className="breadcrumbs-sep">&gt;</span>
        <span style={{ color: 'var(--admin-text-color)', fontWeight: '600' }}>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </span>
      </div>

      {renderContent()}

      {/* Slide-over Edit/Create Article Drawer */}
      <ArticleDrawer
        isOpen={isArticleDrawerOpen}
        onClose={() => setIsArticleDrawerOpen(false)}
        onSave={handleSaveArticle}
        article={selectedArticle}
      />

      {/* Generic Media Modal for Video/Podcast Creation */}
      {isMediaModalOpen && (
        <div className="drawer-overlay" onClick={() => setIsMediaModalOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: '450px' }}>
            <div className="drawer-header">
              <h2>{selectedMedia ? 'Modifier' : 'Ajouter'} {mediaType === 'video' ? 'une Vidéo' : 'un Épisode'}</h2>
              <button className="drawer-close-btn" onClick={() => setIsMediaModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveMedia} className="drawer-form">
              <div className="drawer-input-group">
                <label>Titre</label>
                <input
                  type="text"
                  required
                  className="drawer-text-input"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="Entrez le titre..."
                />
              </div>

              <div className="drawer-input-group">
                <label>Durée (ex: 12:45)</label>
                <input
                  type="text"
                  required
                  className="drawer-text-input"
                  value={mediaDuration}
                  onChange={(e) => setMediaDuration(e.target.value)}
                  placeholder="00:00"
                />
              </div>

              <div className="drawer-input-group">
                <label>Status</label>
                <div className="select-wrapper">
                  <select
                    className="drawer-select"
                    value={mediaStatus}
                    onChange={(e) => setMediaStatus(e.target.value)}
                  >
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="drawer-actions">
                <button type="button" className="btn-drawer secondary" onClick={() => setIsMediaModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-drawer primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

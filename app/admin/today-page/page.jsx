"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import dynamic from 'next/dynamic';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });
const MediaPickerModal = dynamic(() => import('../components/MediaPickerModal'), { ssr: false });

// ─── Shared upload helper ─────────────────────────────────────────────────────
async function uploadImage(file, setProgress, setUploading) {
  setUploading(true);
  setProgress(10);
  const formData = new FormData();
  formData.append("file", file);
  const interval = setInterval(() => setProgress(p => p < 90 ? p + 10 : 90), 120);
  try {
    const res = await fetch("/api/media", { method: "POST", body: formData });
    const data = await res.json();
    clearInterval(interval);
    if (data.success && data.url) {
      setProgress(100);
      return data.url;
    } else {
      alert(`Erreur upload: ${data.error || "Échec"}`);
      setProgress(0);
      return null;
    }
  } catch (err) {
    clearInterval(interval);
    alert("Erreur de connexion lors du téléversement");
    setProgress(0);
    return null;
  } finally {
    setUploading(false);
  }
}

// ─── Image upload widget (same style as ArticleDrawer) ────────────────────────
function ImageUploader({ value, onChange, label = "Image" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (url) => {
    onChange(url);
  };

  return (
    <div style={{ marginBottom: 0 }}>
      <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '6px' }}>{label}</div>
      {value ? (
        <div className="media-compact-row">
          <div className="media-compact-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" />
          </div>
          <div className="media-compact-info">
            <div className="media-compact-filename">{value.split('/').pop()}</div>
            <div style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span> Configurée
            </div>
            <div className="media-compact-actions" style={{ marginTop: '6px' }}>
              <button type="button" className="btn-media-action" onClick={() => setIsModalOpen(true)}>Changer</button>
              <button type="button" className="btn-media-action danger" onClick={() => onChange('')}>Supprimer</button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="cover-placeholder-btn" onClick={() => setIsModalOpen(true)}>
          <span className="material-symbols-outlined">add_photo_alternate</span>
          Choisir depuis la médiathèque
        </button>
      )}
      <MediaPickerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}


// ─── Generic Drawer Shell ─────────────────────────────────────────────────────
function SectionDrawer({ isOpen, onClose, title, icon, children, onSave, saveLabel = "Enregistrer", status, onStatusChange }) {
  if (!isOpen) return null;
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()} style={{ width: '900px', maxWidth: '98vw', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAEAEA', padding: '14px 24px', flexShrink: 0, background: '#FFFFFF', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--admin-accent-color)' }}>{icon || 'edit_note'}</span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{title}</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {onStatusChange && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '16px', padding: '4px 8px', background: status === 'Published' ? '#ECFDF5' : '#F3F4F6', borderRadius: '4px', border: `1px solid ${status === 'Published' ? '#A7F3D0' : '#E5E7EB'}` }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: status === 'Published' ? '#059669' : '#6B7280' }}>{status === 'Published' ? 'public' : 'visibility_off'}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: status === 'Published' ? '#059669' : '#4B5563', textTransform: 'uppercase' }}>{status === 'Published' ? 'Publié' : 'Brouillon'}</span>
                <label className="switch" style={{ margin: '0 0 0 6px', transform: 'scale(0.8)' }}>
                  <input type="checkbox" checked={status === 'Published'} onChange={e => onStatusChange(e.target.checked ? 'Published' : 'Draft')} />
                  <span className="slider round" />
                </label>
              </div>
            )}
            <button type="button" className="btn-drawer secondary" onClick={onClose} style={{ padding: '7px 14px', fontSize: '12px' }}>Annuler</button>
            <button type="button" className="btn-drawer primary" onClick={onSave} style={{ padding: '7px 16px', fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>save</span>
              {saveLabel}
            </button>
            <button className="drawer-close-btn" onClick={onClose} aria-label="Fermer" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────
const F = {
  label: (text) => <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '6px' }}>{text}</div>,
  input: (props) => <input {...props} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', background: '#FAFAFA', ...props.style }} />,
  textarea: (props) => <textarea {...props} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', background: '#FAFAFA', resize: 'vertical', ...props.style }} />,
  row: ({ children, gap = 16 }) => <div style={{ display: 'flex', gap, marginBottom: '16px' }}>{children}</div>,
  col: ({ children, flex = 1 }) => <div style={{ flex }}>{children}</div>,
  section: ({ children, title, icon }) => (
    <div className="editor-section" style={{ marginBottom: '24px' }}>
      <div className="editor-section-title">
        {icon && <span className="material-symbols-outlined">{icon}</span>}
        {title}
      </div>
      {children}
    </div>
  ),
};

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL_TODAY = {
  hero: {
    id: 'hero',
    status: 'Published',
    title: "DONA : La\nRenaissance\nde la Femme Solaire",
    subtitle: "\"Une femme affirmée, positive, ambitieuse et rayonnante,\nen harmonie avec son époque.\"",
    button1Label: "DÉCOUVRIR DONA",
    button1Url: "#",
    button2Label: "LIRE LE MANIFESTE",
    button2Url: "#",
    image: "/assets/core/img/hero_solaire.png",
    updated: "—"
  },
  filters: [
    { id: 'f1', label: "TOUTES", url: "#", updated: "—" },
    { id: 'f2', label: "GÉOPOLITIQUE", url: "#", updated: "—" },
    { id: 'f3', label: "ÉCONOMIE", url: "#", updated: "—" },
    { id: 'f4', label: "BUSINESS", url: "#", updated: "—" },
    { id: 'f5', label: "INNOVATION", url: "#", updated: "—" },
    { id: 'f6', label: "SOCIÉTÉ", url: "#", updated: "—" },
    { id: 'f7', label: "CULTURE", url: "#", updated: "—" },
  ],
  newsItems: [
    { 
      id: 'news-1', 
      status: 'Published', 
      isFeatured: true, 
      isNew: true, 
      time: "15:00", 
      title: "Accord historique sur la parité salariale au sein de l'Union Européenne", 
      desc: "Après des mois de négociations intenses, le Parlement a adopté ce matin une directive contraignante, marquant un tournant décisif pour l'égalité économique.", 
      content: "<p>Après des mois de négociations intenses, le Parlement a adopté ce matin une directive contraignante, marquant un tournant décisif pour l'égalité économique.</p>", 
      image: "/assets/core/img/featured_urgent.png", 
      updated: "À l'instant" 
    },
    { id: 'news-2', status: 'Published', isFeatured: false, isNew: true, time: "14:30", title: "Nominations à la tête des grandes banques centrales", desc: "Trois femmes pressenties pour diriger les institutions clés en Asie et en Europe.", content: "", updated: "À l'instant" },
    { id: 'news-3', status: 'Published', isFeatured: false, isNew: false, time: "13:15", title: "COP29 : Les initiatives climatiques portées par des entrepreneures", desc: "Le sommet met en lumière des solutions innovantes développées par des startups.", content: "", updated: "À l'instant" },
    { id: 'news-4', status: 'Published', isFeatured: false, isNew: false, time: "11:45", title: "Rétrospective : L'impact de l'architecture inclusive", desc: "Comment la nouvelle vague de designers redessine les espaces publics.", content: "", updated: "À l'instant" }
  ],
  editorial: {
    id: 'editorial',
    status: 'Published',
    sectionLabel: "NOTRE ÉDITORIAL",
    title: "Notre Vision\nRéconciliée",
    content: "<p>Le magazine DONA porte une vision réconciliée de la femme moderne. Loin des clivages épuisants, nous célébrons une féminité qui embrasse la réussite professionnelle sans sacrifier la grâce, l'élégance et l'accomplissement personnel.</p>",
    points: [
      { id: 1, title: "L'Harmonie plutôt que le combat", desc: "Cultiver sa force intérieure dans la sérénité." },
      { id: 2, title: "L'Ambition assumée", desc: "Viser l'excellence dans toutes les sphères de la vie." }
    ],
    quote: "\"L'élégance n'est pas de se faire remarquer, mais de s'en souvenir. C'est cette trace lumineuse que laisse la femme DONA.\"",
    image: "/assets/core/img/vision_portrait.png",
    updated: "—"
  },
  values: [
    { id: 'val-1', status: 'Published', title: "Heureuse", desc: "Cultiver la joie quotidienne comme une discipline de vie et un moteur de créativité.", updated: "—" },
    { id: 'val-2', status: 'Published', title: "Affirmée", desc: "Posséder une voix claire, poser des limites saines et assumer ses convictions.", updated: "—" },
    { id: 'val-3', status: 'Published', title: "Ambitieuse", desc: "Vouloir plus grand, sans s'excuser, et se donner les moyens d'atteindre l'excellence.", updated: "—" },
    { id: 'val-4', status: 'Published', title: "Rayonnante", desc: "Être une source d'inspiration lumineuse pour son entourage et sa communauté.", updated: "—" }
  ],
  france: [
    { id: 'fr-1', status: 'Published', category: "POLITIQUE", time: "Il y a 45 min", title: "Loi Égalité Professionnelle : Le Sénat adopte le texte en première lecture", desc: "Les quotas dans les comités de direction des grandes entreprises seront renforcés dès 2026.", content: "", image: "/assets/core/img/france_1.png", updated: "—" },
    { id: 'fr-2', status: 'Published', category: "ÉCONOMIE", time: "Il y a 2h", title: "CAC 40 : Les entreprises dirigées par des femmes surperforment", desc: "Une nouvelle étude démontre une rentabilité supérieure de 12% pour les groupes à parité.", content: "", image: "/assets/core/img/france_2.png", updated: "—" },
    { id: 'fr-3', status: 'Published', category: "CULTURE", time: "Il y a 4h", title: "Cannes 2026 : Record historique de femmes réalisatrices en sélection officielle", desc: "Thierry Frémaux annonce une sélection paritaire pour la première fois dans l'histoire du festival.", content: "", image: "/assets/core/img/france_3.png", updated: "—" }
  ]
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return <span className={`badge ${(status || 'draft').toLowerCase()}`}>{status || 'Draft'}</span>;
}

// ─── TABLE CARD WRAPPER (same style as articles admin) ────────────────────────
function TableCard({ title, subtitle, action, children }) {
  return (
    <div className="table-card" style={{ marginTop: '20px' }}>
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="table-title">{title}</h2>
          {subtitle && <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── SECTION TABS (top navigation for this page) ─────────────────────────────
const SECTIONS = [
  { key: 'hero', icon: 'image', label: 'Hero Header' },
  { key: 'filters', icon: 'filter_list', label: 'Filtres' },
  { key: 'articles', icon: 'article', label: 'Articles' },
  { key: 'editorial', icon: 'auto_stories', label: 'Éditorial' },
  { key: 'values', icon: 'stars', label: 'Nos Valeurs' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminTodayPage() {
  const [data, setData] = useState(INITIAL_TODAY);
  const [activeSection, setActiveSection] = useState('hero');
  const [saveNotif, setSaveNotif] = useState('');

  // Drawers
  const [heroDrawer, setHeroDrawer] = useState(false);
  const [filterDrawer, setFilterDrawer] = useState({ open: false, item: null });
  const [articleDrawer, setArticleDrawer] = useState({ open: false, item: null });
  const [editorialDrawer, setEditorialDrawer] = useState(false);
  const [valueDrawer, setValueDrawer] = useState({ open: false, item: null });

  // Draft state for each drawer
  const [heroDraft, setHeroDraft] = useState({});
  const [filterDraft, setFilterDraft] = useState({});
  const [articleDraft, setArticleDraft] = useState({});
  const [editorialDraft, setEditorialDraft] = useState({});
  const [valueDraft, setValueDraft] = useState({});

  // Load from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dona_today_config_v3');
    if (saved) {
      try { setData(JSON.parse(saved)); } catch (e) {}
    } else {
      // Migrate from v2 if exists
      const savedV2 = localStorage.getItem('dona_today_config_v2');
      if (savedV2) {
        try { 
          const parsedV2 = JSON.parse(savedV2);
          if (parsedV2.urgentArticle && parsedV2.newsTimeline) {
             const mergedNews = [
                {...parsedV2.urgentArticle, id: 'news-0', isFeatured: true, isNew: true, time: "Maintenant"},
                ...parsedV2.newsTimeline.map(n => ({...n, isFeatured: false}))
             ];
             parsedV2.newsItems = mergedNews;
             delete parsedV2.urgentArticle;
             delete parsedV2.newsTimeline;
             setData(parsedV2);
          }
        } catch (e) {}
      }
    }
  }, []);

  const persistAll = (newData) => {
    localStorage.setItem('dona_today_config_v3', JSON.stringify(newData));
    // Sync legacy key so the public page can also read it
    
    // Calculate featured vs timeline
    let urgent = newData.newsItems.find(n => n.isFeatured);
    let timeline = newData.newsItems.filter(n => !n.isFeatured);
    if (!urgent && newData.newsItems.length > 0) {
      urgent = newData.newsItems[0];
      timeline = newData.newsItems.slice(1);
    }
    
    const legacyData = {
      hero: {
        title: newData.hero.title,
        subtitle: newData.hero.subtitle,
        button1: { label: newData.hero.button1Label, url: newData.hero.button1Url },
        button2: { label: newData.hero.button2Label, url: newData.hero.button2Url },
        image: newData.hero.image
      },
      filters: newData.filters.map(f => ({ id: f.id, label: f.label, url: f.url })),
      urgentArticle: urgent ? { id: urgent.id, title: urgent.title, desc: urgent.desc, image: urgent.image || '/assets/core/img/featured_urgent.png', filters: urgent.filters || [], isFeatured: urgent.isFeatured } : null,
      newsTimeline: timeline.map(n => ({ id: n.id, time: n.time, isNew: n.isNew, title: n.title, desc: n.desc, image: n.image, filters: n.filters || [], isFeatured: n.isFeatured })),
      editorial: {
        title: newData.editorial.title,
        desc: newData.editorial.content?.replace(/<[^>]+>/g, ''),
        points: newData.editorial.points,
        quote: newData.editorial.quote,
        image: newData.editorial.image
      },
      values: newData.values.map(v => ({ id: v.id, title: v.title, desc: v.desc })),
      france: newData.france.map(f => ({ id: f.id, category: f.category, time: f.time, title: f.title, desc: f.desc, image: f.image, filters: f.filters || [] }))
    };
    localStorage.setItem('dona_today_config', JSON.stringify(legacyData));
    setSaveNotif('✓ Modifications enregistrées');
    setTimeout(() => setSaveNotif(''), 3000);
  };

  // ─── HERO ─────────────────────────────────────────────────────────────────
  const openHeroDrawer = () => { setHeroDraft({ ...data.hero }); setHeroDrawer(true); };
  const saveHero = () => {
    const newData = { ...data, hero: { ...heroDraft, updated: "À l'instant" } };
    setData(newData); persistAll(newData); setHeroDrawer(false);
  };

  // ─── FILTERS ──────────────────────────────────────────────────────────────
  const openFilterCreate = () => { setFilterDraft({ id: `f-${Date.now()}`, label: '', url: '#', updated: "À l'instant" }); setFilterDrawer({ open: true, item: null }); };
  const openFilterEdit = (item) => { setFilterDraft({ ...item }); setFilterDrawer({ open: true, item }); };
  const saveFilter = () => {
    if (!filterDraft.label?.trim()) return alert("Le label est obligatoire");
    let newFilters;
    if (filterDrawer.item) {
      newFilters = data.filters.map(f => f.id === filterDraft.id ? { ...filterDraft, updated: "À l'instant" } : f);
    } else {
      if (data.filters.length >= 7) return alert("Maximum 7 filtres autorisés !");
      newFilters = [...data.filters, { ...filterDraft, updated: "À l'instant" }];
    }
    const newData = { ...data, filters: newFilters };
    setData(newData); persistAll(newData); setFilterDrawer({ open: false, item: null });
  };
  const deleteFilter = (id) => {
    const newData = { ...data, filters: data.filters.filter(f => f.id !== id) };
    setData(newData); persistAll(newData);
  };
  const moveFilter = (idx, dir) => {
    const arr = [...data.filters];
    const to = idx + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    const newData = { ...data, filters: arr };
    setData(newData); persistAll(newData);
  };

  // ─── ARTICLES (Fil d'actu, À la Une & France en Direct) ───────────────────
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const openArticleCreate = () => { setArticleDraft({ id: `art-${Date.now()}`, status: 'Published', isFeatured: false, isNew: true, time: getCurrentTime(), title: '', desc: '', content: '', image: '', filters: [], category: '', _emplacement: 'news', updated: "À l'instant" }); setArticleDrawer({ open: true, item: null }); };
  const openArticleEdit = (item, type) => { setArticleDraft({ ...item, _emplacement: type }); setArticleDrawer({ open: true, item }); };
  const saveArticle = () => {
    if (!articleDraft.title?.trim()) return alert("Le titre est obligatoire");
    
    let newNewsList = [...data.newsItems];
    let newFranceList = [...data.france];
    
    // If we are setting this one as featured, un-feature the others
    if (articleDraft._emplacement === 'news' && articleDraft.isFeatured) {
        newNewsList = newNewsList.map(n => ({...n, isFeatured: false}));
    }

    if (articleDrawer.item) {
      newNewsList = newNewsList.filter(n => n.id !== articleDraft.id);
      newFranceList = newFranceList.filter(n => n.id !== articleDraft.id);
    }
    
    const newElement = { ...articleDraft, updated: "À l'instant" };
    if (newElement._emplacement !== 'news') {
      newElement.category = "FRANCE EN DIRECT";
    }

    if (articleDraft._emplacement === 'news') {
      newNewsList = [newElement, ...newNewsList];
    } else {
      newFranceList = [newElement, ...newFranceList];
    }
    
    const newData = { ...data, newsItems: newNewsList, france: newFranceList };
    setData(newData); persistAll(newData); setArticleDrawer({ open: false, item: null });
  };
  const deleteArticle = (id, type) => {
    const newData = { ...data };
    if (type === 'news') {
      newData.newsItems = data.newsItems.filter(n => n.id !== id);
    } else {
      newData.france = data.france.filter(f => f.id !== id);
    }
    setData(newData); persistAll(newData);
  };

  // ─── EDITORIAL ────────────────────────────────────────────────────────────
  const openEditorialDrawer = () => { setEditorialDraft({ ...data.editorial, points: data.editorial.points.map(p => ({ ...p })) }); setEditorialDrawer(true); };
  const saveEditorial = () => {
    const newData = { ...data, editorial: { ...editorialDraft, updated: "À l'instant" } };
    setData(newData); persistAll(newData); setEditorialDrawer(false);
  };

  // ─── VALUES ───────────────────────────────────────────────────────────────
  const openValueEdit = (item) => { setValueDraft({ ...item }); setValueDrawer({ open: true, item }); };
  const saveValue = () => {
    const newValues = data.values.map(v => v.id === valueDraft.id ? { ...valueDraft, updated: "À l'instant" } : v);
    const newData = { ...data, values: newValues };
    setData(newData); persistAll(newData); setValueDrawer({ open: false, item: null });
  };


  const resetDemoData = () => {
    if (confirm("Voulez-vous vraiment réinitialiser les données avec des articles factices pour illustrer les filtres ?")) {
      const demoData = JSON.parse(JSON.stringify(INITIAL_TODAY)); // Deep copy
      
      const realFilters = demoData.filters.filter(f => f.id !== 1); // Exclude "TOUTES"
      
      let generatedFrance = [];
      let generatedNews = [];
      let idCounter = 100;
      
      realFilters.forEach(filter => {
          for (let i = 0; i < 4; i++) {
              generatedFrance.push({
                  id: `france-${idCounter++}`,
                  category: filter.label,
                  time: `Il y a ${i+1}h`,
                  title: `[${filter.label}] Article illustratif ${i+1}`,
                  desc: `Description automatique générée pour bien remplir la grille de la section ${filter.label}.`,
                  image: `assets/core/img/france_${(i % 3) + 1}.png`,
                  filters: [filter.id]
              });
              
              generatedNews.push({
                  id: `news-${idCounter++}`,
                  time: `1${i}:${30 + i}`,
                  isNew: i === 0,
                  isFeatured: i === 0 && filter.id === 2, // Only one featured globally
                  title: `[${filter.label}] Actualité en direct ${i+1}`,
                  desc: `Brève information pour le fil d'actualité de la catégorie ${filter.label}.`,
                  filters: [filter.id]
              });
          }
      });
      
      // Assure qu'on a un article "À la Une" pour la page "Toutes"
      if (!generatedNews.find(n => n.isFeatured)) {
          generatedNews[0].isFeatured = true;
      }
      
      demoData.france = generatedFrance;
      demoData.newsItems = generatedNews;
      
      setData(demoData);
      persistAll(demoData);
      setSaveNotif("Articles factices générés (4 par filtre) !");
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══ PAGE TODAY: MAIN VIEW ══════════════════════════════════════════ */}
      <div className="dashboard-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: 0 }}>Page Today — Configuration</h1>
          {saveNotif && (
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
              {saveNotif}
            </span>
          )}
        </div>
        <button onClick={resetDemoData} className="btn-admin-action" style={{ fontSize: '12px', padding: '6px 12px', background: '#F3F4F6', color: '#333', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restart_alt</span>
          Générer articles factices
        </button>
      </div>

      {/* Section tabs (like sub-navigation) */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', borderBottom: '2px solid #F3F4F6', paddingBottom: '0', flexWrap: 'wrap' }}>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', fontSize: '12px', fontWeight: activeSection === s.key ? 700 : 500,
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: activeSection === s.key ? '2px solid var(--admin-accent-color)' : '2px solid transparent',
              color: activeSection === s.key ? 'var(--admin-accent-color)' : '#666',
              marginBottom: '-2px', transition: 'all 0.15s'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      {activeSection === 'hero' && (
        <TableCard
          title="Hero Header"
          subtitle="L'image et le message principal d'accueil de la page Today"
          action={<button className="btn-admin-action primary" onClick={openHeroDrawer}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span> Modifier</button>}
        >
          <table className="admin-table">
            <thead><tr><th>Titre</th><th>Bouton 1</th><th>Bouton 2</th><th>Status</th><th>Modifié</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              <tr>
                <td className="cell-bold">{data.hero.title.split('\n')[0]}…</td>
                <td>{data.hero.button1Label}</td>
                <td>{data.hero.button2Label}</td>
                <td><StatusBadge status={data.hero.status} /></td>
                <td style={{ color: '#888' }}>{data.hero.updated}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={openHeroDrawer} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Edit</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </TableCard>
      )}

      {/* ── 2. FILTERS ──────────────────────────────────────────────────── */}
      {activeSection === 'filters' && (
        <TableCard
          title={`Barre de Filtres (${data.filters.length}/7)`}
          subtitle="Maximum 7 filtres. Utilisez les flèches pour réordonner."
          action={
            <button
              className="btn-admin-action primary"
              onClick={openFilterCreate}
              disabled={data.filters.length >= 7}
              style={{ opacity: data.filters.length >= 7 ? 0.5 : 1, cursor: data.filters.length >= 7 ? 'not-allowed' : 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Nouveau Filtre
            </button>
          }
        >
          <table className="admin-table">
            <thead><tr><th style={{ width: '80px' }}>Ordre</th><th>Label</th><th>Lien URL</th><th>Modifié</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {data.filters.map((f, idx) => (
                <tr key={f.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                      <button onClick={() => moveFilter(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1, padding: '2px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>keyboard_arrow_up</span>
                      </button>
                      <button onClick={() => moveFilter(idx, 1)} disabled={idx === data.filters.length - 1} style={{ background: 'none', border: 'none', cursor: idx === data.filters.length - 1 ? 'default' : 'pointer', opacity: idx === data.filters.length - 1 ? 0.3 : 1, padding: '2px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>keyboard_arrow_down</span>
                      </button>
                    </div>
                  </td>
                  <td className="cell-bold">{f.label}</td>
                  <td style={{ color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>{f.url}</td>
                  <td style={{ color: '#888' }}>{f.updated}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => openFilterEdit(f)} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Edit</button>
                      <span className="table-action-divider">|</span>
                      <button onClick={() => deleteFilter(f.id)} className="table-action-btn secondary" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'var(--admin-accent-color)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      {/* ── 3. ARTICLES ────────────────────────────────────────────── */}
      {activeSection === 'articles' && (
        <TableCard
          title="Articles (Fil d'actu & France en Direct)"
          subtitle="Gérez l'ensemble de vos articles. Choisissez leur emplacement lors de la création."
          action={<button className="btn-admin-action primary" onClick={openArticleCreate}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Nouvel Article</button>}
        >
          <table className="admin-table">
            <thead><tr><th>Visuel</th><th>Titre</th><th>Emplacement</th><th>Timing</th><th>Status</th><th>Modifié</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {[...data.newsItems.map(n => ({ ...n, _type: 'news' })), ...data.france.map(f => ({ ...f, _type: 'france' }))].map(item => (
                <tr key={item.id} style={{ background: item.isFeatured ? '#FFF5F5' : 'transparent' }}>
                  <td>
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="cover" style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '56px', height: '40px', background: '#F3F4F6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#CCC' }}>image</span>
                      </div>
                    )}
                  </td>
                  <td className="cell-bold">{item.title}</td>
                  <td>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '3px', background: item._type === 'news' ? (item.isFeatured ? '#CE0028' : '#EFF6FF') : '#F3F4F6', color: item._type === 'news' ? (item.isFeatured ? '#FFF' : '#1D4ED8') : '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {item._type === 'news' ? (item.isFeatured ? 'À la Une' : 'Fil d\'actu') : 'France en Direct'}
                    </span>
                  </td>
                  <td style={{ color: '#888', fontSize: '12px', whiteSpace: 'nowrap' }}>{item.time}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td style={{ color: '#888' }}>{item.updated}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => openArticleEdit(item, item._type)} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Edit</button>
                      <span className="table-action-divider">|</span>
                      <button onClick={() => deleteArticle(item.id, item._type)} className="table-action-btn secondary" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'var(--admin-accent-color)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  D R A W E R S                                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      {/* ── HERO DRAWER ─────────────────────────────────────────────────── */}
      <SectionDrawer isOpen={heroDrawer} onClose={() => setHeroDrawer(false)} title="Modifier le Hero Header" icon="image" onSave={saveHero}
        saveLabel={heroDraft.status === 'Published' ? 'Mettre à jour' : 'Enregistrer brouillon'}
        status={heroDraft.status} onStatusChange={s => setHeroDraft(p => ({ ...p, status: s }))}>
        <div className="article-editor-split">
          <div className="editor-left-col">
            <F.section title="Identité de la section" icon="badge">
              <div style={{ marginBottom: '16px' }}>
                {F.label("Titre principal (↵ pour les sauts de ligne)")}
                {F.textarea({ value: heroDraft.title || '', rows: 3, onChange: e => setHeroDraft(p => ({ ...p, title: e.target.value })), placeholder: "DONA : La\nRenaissance..." })}
              </div>
              <div style={{ marginBottom: '16px' }}>
                {F.label("Sous-titre / accroche")}
                {F.textarea({ value: heroDraft.subtitle || '', rows: 2, onChange: e => setHeroDraft(p => ({ ...p, subtitle: e.target.value })), placeholder: "\"Une femme affirmée...\"" })}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  {F.label("Bouton 1 — Label")}
                  {F.input({ value: heroDraft.button1Label || '', onChange: e => setHeroDraft(p => ({ ...p, button1Label: e.target.value })), placeholder: "DÉCOUVRIR DONA" })}
                </div>
                <div style={{ flex: 1 }}>
                  {F.label("Bouton 1 — Lien")}
                  {F.input({ value: heroDraft.button1Url || '', onChange: e => setHeroDraft(p => ({ ...p, button1Url: e.target.value })), placeholder: "/today" })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  {F.label("Bouton 2 — Label")}
                  {F.input({ value: heroDraft.button2Label || '', onChange: e => setHeroDraft(p => ({ ...p, button2Label: e.target.value })), placeholder: "LIRE LE MANIFESTE" })}
                </div>
                <div style={{ flex: 1 }}>
                  {F.label("Bouton 2 — Lien")}
                  {F.input({ value: heroDraft.button2Url || '', onChange: e => setHeroDraft(p => ({ ...p, button2Url: e.target.value })), placeholder: "/manifeste" })}
                </div>
              </div>
            </F.section>

            <F.section title="Médias" icon="perm_media">
              <ImageUploader value={heroDraft.image || ''} onChange={url => setHeroDraft(p => ({ ...p, image: url }))} label="Image de couverture principale" />
            </F.section>
          </div>

          {/* Preview */}
          <div className="editor-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>preview</span>
              Aperçu
            </div>
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#111', minHeight: '200px' }}>
              {heroDraft.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroDraft.image} alt="hero preview" style={{ width: '100%', height: '200px', objectFit: 'cover', opacity: 0.6 }} />
              )}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px', color: 'white' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#CE0028', fontWeight: 700, marginBottom: '6px' }}>DONA TODAY</p>
                {(heroDraft.title || '').split('\n').map((line, i) => (
                  <div key={i} style={{ fontSize: i === 0 ? '18px' : '14px', fontWeight: 700, lineHeight: 1.2 }}>{line}</div>
                ))}
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', fontStyle: 'italic' }}>{heroDraft.subtitle}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <span style={{ padding: '5px 12px', background: '#CE0028', color: 'white', borderRadius: '3px', fontSize: '10px', fontWeight: 700 }}>{heroDraft.button1Label}</span>
                  <span style={{ padding: '5px 12px', border: '1px solid white', color: 'white', borderRadius: '3px', fontSize: '10px', fontWeight: 700 }}>{heroDraft.button2Label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionDrawer>

      {/* ── FILTER DRAWER ───────────────────────────────────────────────── */}
      <SectionDrawer isOpen={filterDrawer.open} onClose={() => setFilterDrawer({ open: false, item: null })} title={filterDrawer.item ? "Modifier le filtre" : "Nouveau filtre"} icon="filter_list" onSave={saveFilter}>
        <F.section title="Paramètres du filtre" icon="sell">
          <div style={{ marginBottom: '16px' }}>
            {F.label("Label du filtre (en majuscules recommandé)")}
            {F.input({ value: filterDraft.label || '', onChange: e => setFilterDraft(p => ({ ...p, label: e.target.value })), placeholder: "GÉOPOLITIQUE" })}
          </div>
          <div>
            {F.label("Lien URL (# pour ancre, ou /today?cat=géopolitique)")}
            {F.input({ value: filterDraft.url || '', onChange: e => setFilterDraft(p => ({ ...p, url: e.target.value })), placeholder: "#" })}
          </div>
        </F.section>
      </SectionDrawer>

      {/* ── ARTICLE DRAWER (Merged Fil d'actu, À la Une & France) ───────────── */}
      <SectionDrawer isOpen={articleDrawer.open} onClose={() => setArticleDrawer({ open: false, item: null })} title={articleDrawer.item ? "Modifier l'article" : "Nouvel article"} icon="article" onSave={saveArticle}
        saveLabel={articleDraft.status === 'Published' ? 'Publier' : 'Enregistrer brouillon'}
        status={articleDraft.status} onStatusChange={s => setArticleDraft(p => ({ ...p, status: s }))}>
        <div className="article-editor-split">
          <div className="editor-left-col">
            
            <F.section title="Emplacement de l'article" icon="place">
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="emplacement" checked={articleDraft._emplacement === 'news'} onChange={() => setArticleDraft(p => ({ ...p, _emplacement: 'news' }))} />
                  Fil d'actualité
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="emplacement" checked={articleDraft._emplacement === 'france'} onChange={() => setArticleDraft(p => ({ ...p, _emplacement: 'france' }))} />
                  France en Direct
                </label>
              </div>

              {articleDraft._emplacement === 'news' && (
                <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '6px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#991B1B' }}>Mettre "À la Une" (Article Urgent)</div>
                      <div style={{ fontSize: '11px', color: '#B91C1C', marginTop: '2px' }}>Cet article sera affiché en grand format. S'il y a déjà un article À la Une, il sera remplacé.</div>
                  </div>
                  <label className="switch" style={{ margin: 0 }}>
                    <input type="checkbox" checked={!!articleDraft.isFeatured} onChange={e => setArticleDraft(p => ({ ...p, isFeatured: e.target.checked }))} />
                    <span className="slider round" style={{ backgroundColor: articleDraft.isFeatured ? '#CE0028' : '#CCC' }} />
                  </label>
                </div>
              )}
            </F.section>

            <F.section title="Identité de l'article" icon="badge">
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  {F.label("Heure / Timing de publication")}
                  {F.input({ value: articleDraft.time || '', onChange: e => setArticleDraft(p => ({ ...p, time: e.target.value })), placeholder: "14:30 ou Il y a 45 min" })}
                </div>
                {articleDraft._emplacement === 'news' ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input type="checkbox" checked={!!articleDraft.isNew} onChange={e => setArticleDraft(p => ({ ...p, isNew: e.target.checked }))} />
                      Afficher badge "NOUVEAU"
                    </label>
                  </div>
                ) : (
                  <div style={{ flex: 1 }}>
                    {F.label("Catégorie (ex: POLITIQUE)")}
                    {F.input({ value: articleDraft.category || '', onChange: e => setArticleDraft(p => ({ ...p, category: e.target.value })), placeholder: "POLITIQUE" })}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '16px' }}>
                {F.label("Titre de l'article")}
                {F.input({ value: articleDraft.title || '', onChange: e => setArticleDraft(p => ({ ...p, title: e.target.value })), placeholder: "Titre de l'article...", style: { fontSize: '14px', fontWeight: 600, padding: '12px' } })}
              </div>
              <div style={{ marginBottom: '16px' }}>
                {F.label("Résumé (affiché dans la liste ou sous le titre à la une)")}
                {F.textarea({ value: articleDraft.desc || '', rows: 2, onChange: e => setArticleDraft(p => ({ ...p, desc: e.target.value })), placeholder: "Courte description..." })}
              </div>
            </F.section>

            <F.section title="Filtres / Catégories" icon="filter_list">
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>Sélectionnez un ou deux filtres pour classer cet article.</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {data.filters.filter(f => f.label !== 'TOUTES').map(f => {
                  const isSelected = (articleDraft.filters || []).includes(f.id);
                  return (
                    <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', padding: '6px 12px', borderRadius: '20px', border: `1px solid ${isSelected ? '#CE0028' : '#E5E7EB'}`, background: isSelected ? '#FFF5F5' : '#FFF', color: isSelected ? '#CE0028' : '#333', fontWeight: isSelected ? 600 : 400 }}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => {
                           setArticleDraft(p => {
                              const flts = p.filters || [];
                              return { ...p, filters: e.target.checked ? [...flts, f.id] : flts.filter(id => id !== f.id) };
                           });
                        }}
                        style={{ display: 'none' }}
                      />
                      {f.label}
                    </label>
                  );
                })}
              </div>
            </F.section>

            <F.section title="Médias" icon="perm_media">
              <ImageUploader value={articleDraft.image || ''} onChange={url => setArticleDraft(p => ({ ...p, image: url }))} label="Image de couverture de l'article" />
            </F.section>

            <F.section title="Contenu éditorial" icon="edit">
              <RichEditor value={articleDraft.content || ''} onChange={v => setArticleDraft(p => ({ ...p, content: v }))} placeholder="Développez l'article avec plus de détails (optionnel)..." />
            </F.section>
          </div>

          <div className="editor-right-col">
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>preview</span>
              Aperçu ({articleDraft._emplacement === 'france' ? 'France en Direct' : (articleDraft.isFeatured ? 'À la Une' : 'Dans le fil')})
            </div>
            
            {articleDraft._emplacement === 'france' ? (
                // Aperçu mode France en Direct
                <div style={{ border: '1px solid #EAEAEA', borderRadius: '8px', overflow: 'hidden' }}>
                  {articleDraft.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={articleDraft.image} alt="cover" style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#CE0028', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{articleDraft.category || 'CATÉGORIE'}</span>
                      <span style={{ fontSize: '10px', color: '#888' }}>{articleDraft.time || 'il y a...'}</span>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '4px' }}>{articleDraft.title || 'Titre de l\'article...'}</p>
                    <p style={{ fontSize: '11px', color: '#666', lineHeight: 1.5 }}>{articleDraft.desc || 'Description...'}</p>
                  </div>
                </div>
            ) : articleDraft.isFeatured ? (
                // Aperçu mode Urgent / À la Une
                <div style={{ border: '1px solid #EAEAEA', borderRadius: '8px', overflow: 'hidden' }}>
                  {articleDraft.image && (
                    <div style={{ position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={articleDraft.image} alt="cover" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#CE0028', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>⚠ URGENT</span>
                    </div>
                  )}
                  <div style={{ padding: '12px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.4, marginBottom: '6px' }}>{articleDraft.title || 'Titre de l\'article...'}</p>
                    <p style={{ fontSize: '11px', color: '#666', lineHeight: 1.5 }}>{articleDraft.desc || 'Description courte...'}</p>
                  </div>
                </div>
            ) : (
                // Aperçu mode Fil d'actu
                <div style={{ border: '1px solid #EAEAEA', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ minWidth: '50px', textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>{articleDraft.time || '00:00'}</span>
                      {articleDraft.isNew && <div style={{ fontSize: '9px', fontWeight: 700, color: '#CE0028', marginTop: '2px' }}>NOUVEAU</div>}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{articleDraft.title || 'Titre...'}</p>
                      <p style={{ fontSize: '11px', color: '#666' }}>{articleDraft.desc || 'Description...'}</p>
                    </div>
                  </div>
                </div>
            )}
            
            <div style={{ marginTop: '20px', borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>article</span>
                Rendu de l'Article
              </div>
              <div className="public-article-preview" dangerouslySetInnerHTML={{ __html: articleDraft.content || '<p style="color:#999;font-style:italic;font-size:13px">Le contenu de l\'article s\'affichera ici...</p>' }} />
            </div>
            
          </div>
        </div>
      </SectionDrawer>

      {/* ── EDITORIAL DRAWER ────────────────────────────────────────────── */}
      <SectionDrawer isOpen={editorialDrawer} onClose={() => setEditorialDrawer(false)} title="Notre Éditorial" icon="auto_stories" onSave={saveEditorial}
        saveLabel="Mettre à jour l'Éditorial"
        status={editorialDraft.status} onStatusChange={s => setEditorialDraft(p => ({ ...p, status: s }))}>
        <div className="article-editor-split">
          <div className="editor-left-col">
            <F.section title="Identité éditoriale" icon="badge">
              <div style={{ marginBottom: '16px' }}>
                {F.label("Titre de la section (↵ pour sauts de ligne)")}
                {F.textarea({ value: editorialDraft.title || '', rows: 2, onChange: e => setEditorialDraft(p => ({ ...p, title: e.target.value })), placeholder: "Notre Vision\nRéconciliée" })}
              </div>
              <div style={{ marginBottom: '16px' }}>
                {F.label("Citation / Exergue")}
                {F.textarea({ value: editorialDraft.quote || '', rows: 2, onChange: e => setEditorialDraft(p => ({ ...p, quote: e.target.value })), placeholder: "\"L'élégance n'est pas...\"", style: { fontStyle: 'italic' } })}
              </div>
              <div>
                {F.label("Points forts")}
                {(editorialDraft.points || []).map((pt, idx) => (
                  <div key={pt.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <div style={{ flex: '0 0 36px', paddingTop: '10px', fontSize: '10px', fontWeight: 700, color: '#CCC', textAlign: 'center' }}>0{idx + 1}</div>
                    <div style={{ flex: 1 }}>
                      {F.input({ value: pt.title, onChange: e => { const pts = [...editorialDraft.points]; pts[idx] = { ...pts[idx], title: e.target.value }; setEditorialDraft(p => ({ ...p, points: pts })); }, placeholder: "Titre du point", style: { marginBottom: '6px' } })}
                      {F.input({ value: pt.desc, onChange: e => { const pts = [...editorialDraft.points]; pts[idx] = { ...pts[idx], desc: e.target.value }; setEditorialDraft(p => ({ ...p, points: pts })); }, placeholder: "Description courte" })}
                    </div>
                  </div>
                ))}
              </div>
            </F.section>

            <F.section title="Médias" icon="perm_media">
              <ImageUploader value={editorialDraft.image || ''} onChange={url => setEditorialDraft(p => ({ ...p, image: url }))} label="Portrait de l'auteur / Visuel éditorial" />
            </F.section>

            <F.section title="Contenu éditorial enrichi" icon="edit">
              <RichEditor value={editorialDraft.content || ''} onChange={v => setEditorialDraft(p => ({ ...p, content: v }))} placeholder="Rédigez ici le texte complet de la section éditoriale..." />
            </F.section>
          </div>

          <div className="editor-right-col">
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>preview</span>
              Aperçu
            </div>
            <div style={{ border: '1px solid #EAEAEA', borderRadius: '8px', padding: '20px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: '#CE0028', marginBottom: '6px' }}>NOTRE ÉDITORIAL</p>
              {(editorialDraft.title || '').split('\n').map((l, i) => (
                <p key={i} style={{ fontSize: i === 0 ? '18px' : '15px', fontWeight: 700, lineHeight: 1.2, marginBottom: '2px' }}>{l}</p>
              ))}
              <p style={{ fontSize: '11px', color: '#666', marginTop: '10px', fontStyle: 'italic', borderLeft: '3px solid #CE0028', paddingLeft: '10px' }}>{editorialDraft.quote}</p>
              {editorialDraft.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editorialDraft.image} alt="portrait" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', marginTop: '12px' }} />
              )}
              
              <div style={{ marginTop: '20px', borderTop: '1px dashed #EAEAEA', paddingTop: '20px' }}>
                <div className="public-article-preview" style={{ padding: 0, border: 'none', background: 'transparent', maxHeight: 'none' }} dangerouslySetInnerHTML={{ __html: editorialDraft.content || '<p style="color:#999;font-style:italic;font-size:13px">Le texte de l\'éditorial s\'affichera ici...</p>' }} />
              </div>
            </div>
          </div>
        </div>
      </SectionDrawer>

      {/* ── VALUE DRAWER ────────────────────────────────────────────────── */}
      <SectionDrawer isOpen={valueDrawer.open} onClose={() => setValueDrawer({ open: false, item: null })} title={`Modifier : ${valueDraft.title || 'Valeur'}`} icon="stars" onSave={saveValue}>
        <F.section title="Contenu de la valeur" icon="badge">
          <div style={{ marginBottom: '16px' }}>
            {F.label("Titre de la valeur")}
            {F.input({ value: valueDraft.title || '', onChange: e => setValueDraft(p => ({ ...p, title: e.target.value })), placeholder: "Heureuse", style: { fontSize: '18px', fontWeight: 700 } })}
          </div>
          <div>
            {F.label("Description courte")}
            {F.textarea({ value: valueDraft.desc || '', rows: 4, onChange: e => setValueDraft(p => ({ ...p, desc: e.target.value })), placeholder: "Cultiver la joie quotidienne..." })}
          </div>
        </F.section>
      </SectionDrawer>


    </>
  );
}

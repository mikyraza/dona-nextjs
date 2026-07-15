"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import ArticleDrawer from '../components/ArticleDrawer';
import VideoDrawer from '../components/VideoDrawer';
import PodcastDrawer from '../components/PodcastDrawer';
import PlayoutDrawer from '../components/PlayoutDrawer';
import DossierDrawer from '../components/DossierDrawer';
import ReplayDrawer from '../components/ReplayDrawer';
import PlanDrawer from '../components/PlanDrawer';
import MemberDrawer from '../components/MemberDrawer';

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

  // 4. Members State (Phase 4.5)
  const [members, setMembers] = useState([
    { id: "mem-1", name: "Marc Aubry", email: "marc@aubry.com", plan: "Premium", status: "Active", joined: "12/03/2026" },
    { id: "mem-2", name: "Hélène de Ségur", email: "vip@dona.com", plan: "Élite", status: "Active", joined: "01/05/2026" },
    { id: "mem-3", name: "Claire Martin", email: "free@dona.com", plan: "Essentiel", status: "Inactive", joined: "10/06/2026" }
  ]);
  const [isMemberDrawerOpen, setIsMemberDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dona_members_count', (1281 + members.length).toString());
    }
  }, [members]);

  // Search & Filter State for Members Directory
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberPlanFilter, setMemberPlanFilter] = useState('all');
  const [memberStatusFilter, setMemberStatusFilter] = useState('all');

  const handleSaveMember = (savedMember) => {
    // API BRIDGE INTEGRATION BLUEPRINT:
    // To bridge these member profiles to MongoDB / custom Node APIs:
    // fetch('/api/members', { method: savedMember.id.startsWith('mem-') ? 'PUT' : 'POST', body: JSON.stringify(savedMember) })
    const isEdit = members.some(m => m.id === savedMember.id);
    if (isEdit) {
      setMembers(prev => prev.map(m => m.id === savedMember.id ? savedMember : m));
    } else {
      setMembers(prev => [savedMember, ...prev]);
    }
  };

  // 5. Settings State (Phase 4.6)
  const [brandSettings, setBrandSettings] = useState({
    siteName: "DONA MAGAZINE",
    tagline: "L'élégance éditoriale au quotidien",
    primaryColor: "#A30626",
    backgroundColor: "#111111",
    logoDark: "/uploads/brand/logo-dark.svg",
    logoLight: "/uploads/brand/logo-light.svg",
    favicon: "/uploads/brand/favicon.png",
    flagEnabled: true,
    flagPosition: "header-right",
    flagScale: 100,
    titleFont: "Cormorant Garamond",
    proseFont: "Inter",
    seoTitle: "Dona Magazine | L'art de vivre d'une nouvelle ère",
    seoDescription: "Magazine d'intelligence, d'art de vivre et d'analyse premium.",
    contactEmail: "contact@dona-magazine.com"
  });

  // 6. SEO Settings State (Phase 4.7)
  const [seoSettings, setSeoSettings] = useState({
    titleTemplate: "%title% | Dona Magazine",
    ogImage: "/uploads/brand/default-og.png",
    indexingEnabled: true,
    robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://dona-magazine.com/sitemap.xml",
    googleConsoleKey: "google-site-verification-1a2b3c4d5e6f7g8h",
    googleAnalyticsId: "G-DONA2026",
    metaPixelId: "FB-PIXEL-789012"
  });

  // 7. Navigation Settings State (Phase 4.8)
  const [headerMenu, setHeaderMenu] = useState([
    { id: "h-1", label: "Accueil", url: "/" },
    { id: "h-2", label: "Articles", url: "/articles" },
    { id: "h-3", label: "Vidéos", url: "/videos" },
    { id: "h-4", label: "Podcasts", url: "/podcasts" },
    { id: "h-5", label: "Dossiers", url: "/dossiers" },
    { id: "h-6", label: "Club", url: "/club" }
  ]);

  const [footerColumns, setFooterColumns] = useState([
    {
      id: "fc-1",
      title: "SECTIONS",
      links: [
        { id: "fl-1", label: "Magazines", url: "/magazines" },
        { id: "fl-2", label: "Émissions", url: "/today" },
        { id: "fl-3", label: "Studio", url: "/studio" }
      ]
    },
    {
      id: "fc-2",
      title: "LÉGAL",
      links: [
        { id: "fl-4", label: "Politique de confidentialité", url: "/politique-confidentialite" },
        { id: "fl-5", label: "Recrutement & Emploi", url: "/recrutement" }
      ]
    },
    {
      id: "fc-3",
      title: "COMMUNAUTÉ",
      links: [
        { id: "fl-6", label: "Devenir Membre", url: "/abonnement" },
        { id: "fl-7", label: "Contact", url: "/contact" }
      ]
    }
  ]);

  const [navCtaText, setNavCtaText] = useState("Devenir Membre");
  const [navCtaUrl, setNavCtaUrl] = useState("/abonnement");

  // Auxiliary state for adding menu items
  const [newHeaderLabel, setNewHeaderLabel] = useState('');
  const [newHeaderUrl, setNewHeaderUrl] = useState('');

  // Auxiliary state for adding/editing footer links
  const [newFooterLabel, setNewFooterLabel] = useState({}); // { [colId]: '' }
  const [newFooterUrl, setNewFooterUrl] = useState({}); // { [colId]: '' }

  const moveHeaderItem = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === headerMenu.length - 1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    setHeaderMenu(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      return updated;
    });
  };

  const removeHeaderItem = (id) => {
    setHeaderMenu(prev => prev.filter(item => item.id !== id));
  };

  const addHeaderItem = (e) => {
    e.preventDefault();
    if (!newHeaderLabel.trim() || !newHeaderUrl.trim()) return;
    setHeaderMenu(prev => [
      ...prev,
      {
        id: `h-custom-${Date.now()}`,
        label: newHeaderLabel.trim(),
        url: newHeaderUrl.trim()
      }
    ]);
    setNewHeaderLabel('');
    setNewHeaderUrl('');
  };

  const removeFooterLink = (colId, linkId) => {
    setFooterColumns(prev => prev.map(col => {
      if (col.id === colId) {
        return { ...col, links: col.links.filter(l => l.id !== linkId) };
      }
      return col;
    }));
  };

  const addFooterLink = (colId) => {
    const label = newFooterLabel[colId] || '';
    const url = newFooterUrl[colId] || '';
    if (!label.trim() || !url.trim()) return;

    setFooterColumns(prev => prev.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          links: [
            ...col.links,
            {
              id: `fl-custom-${Date.now()}`,
              label: label.trim(),
              url: url.trim()
            }
          ]
        };
      }
      return col;
    }));

    setNewFooterLabel(prev => ({ ...prev, [colId]: '' }));
    setNewFooterUrl(prev => ({ ...prev, [colId]: '' }));
  };

  const handleFooterLinkChange = (colId, linkId, field, value) => {
    setFooterColumns(prev => prev.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          links: col.links.map(l => l.id === linkId ? { ...l, [field]: value } : l)
        };
      }
      return col;
    }));
  };

  const handleFooterColumnTitleChange = (colId, value) => {
    setFooterColumns(prev => prev.map(col => col.id === colId ? { ...col, title: value } : col));
  };

  // 8. Multilingual i18n States (Phase 4.9)
  const [locales, setLocales] = useState([
    { code: "FR", name: "Français", enabled: true, isDefault: true, rtl: false, flag: "🇫🇷" },
    { code: "EN", name: "Anglais", enabled: true, isDefault: false, rtl: false, flag: "🇬🇧" },
    { code: "SW", name: "Swahili", enabled: false, isDefault: false, rtl: false, flag: "🇰🇪" },
    { code: "ES", name: "Espagnol", enabled: false, isDefault: false, rtl: false, flag: "🇪🇸" },
    { code: "PT", name: "Portugais", enabled: false, isDefault: false, rtl: false, flag: "🇵🇹" },
    { code: "DE", name: "Allemand", enabled: false, isDefault: false, rtl: false, flag: "🇩🇪" },
    { code: "IT", name: "Italien", enabled: false, isDefault: false, rtl: false, flag: "🇮🇹" },
    { code: "AR", name: "Arabe", enabled: false, isDefault: false, rtl: true, flag: "🇸🇦" }
  ]);

  const [translations, setTranslations] = useState([
    { 
      key: "button_subscribe", 
      description: "Bouton d'abonnement principal",
      FR: "S'abonner", EN: "Subscribe", SW: "", ES: "", PT: "", DE: "", IT: "", AR: "" 
    },
    { 
      key: "members_only_badge", 
      description: "Badge réservé aux abonnés",
      FR: "Membres uniquement", EN: "Members only", SW: "", ES: "", PT: "", DE: "", IT: "", AR: "" 
    },
    { 
      key: "footer_copyright", 
      description: "Texte de copyright en pied de page",
      FR: "Tous droits réservés", EN: "All rights reserved", SW: "", ES: "", PT: "", DE: "", IT: "", AR: "" 
    }
  ]);

  const [translationSearch, setTranslationSearch] = useState('');
  const [translationFilter, setTranslationFilter] = useState('all'); // 'all' | 'untranslated'

  // Drawer States
  const [isArticleDrawerOpen, setIsArticleDrawerOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Video & Podcast Drawer States
  const [isVideoDrawerOpen, setIsVideoDrawerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPodcastDrawerOpen, setIsPodcastDrawerOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  // Playout Queue & Now Playing States (Phase 3.3)
  const [radioQueue, setRadioQueue] = useState([
    { id: "q-r-1", title: "The Brief: L'Analyse Hebdomadaire (Épisode 12)", format: "Audio", duration: "45:00" },
    { id: "q-r-2", title: "L'Architecture du Silence (Épisode 3)", format: "Audio", duration: "32:15" },
    { id: "q-r-3", title: "Discussion : Tech et Éthique du 12 Juillet", format: "Audio", duration: "24:10" }
  ]);

  const [tvQueue, setTvQueue] = useState([
    { id: "q-t-1", title: "Reportage: Les coulisses de DONA", format: "Vidéo", duration: "14:20" },
    { id: "q-t-2", title: "Le Pouvoir du Design Intemporel", format: "Vidéo", duration: "08:45" }
  ]);

  const [radioNowPlaying, setRadioNowPlaying] = useState({
    title: "Intro Édito DONA Radio",
    duration: "02:30",
    remaining: "01:15",
    progress: 50
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && radioNowPlaying && radioNowPlaying.title) {
      localStorage.setItem('dona_radio_active_title', radioNowPlaying.title);
    }
  }, [radioNowPlaying]);

  const [tvNowPlaying, setTvNowPlaying] = useState({
    title: "Loop Visuelle DONA TV v2",
    duration: "05:00",
    remaining: "03:45",
    progress: 25
  });

  const [radioOverride, setRadioOverride] = useState(false);
  const [tvOverride, setTvOverride] = useState(false);

  const [isPlayoutDrawerOpen, setIsPlayoutDrawerOpen] = useState(false);
  const [playoutTarget, setPlayoutTarget] = useState('radio'); // 'radio' | 'tv'

  // Queue Reordering logic (Up/Down)
  const handleMoveQueueItem = (target, index, direction) => {
    const queue = target === 'radio' ? [...radioQueue] : [...tvQueue];
    const setQueue = target === 'radio' ? setRadioQueue : setTvQueue;

    if (direction === 'up' && index > 0) {
      const temp = queue[index];
      queue[index] = queue[index - 1];
      queue[index - 1] = temp;
    } else if (direction === 'down' && index < queue.length - 1) {
      const temp = queue[index];
      queue[index] = queue[index + 1];
      queue[index + 1] = temp;
    }
    setQueue(queue);
  };

  // Queue Remove logic
  const handleRemoveQueueItem = (target, id) => {
    const setQueue = target === 'radio' ? setRadioQueue : setTvQueue;
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  // Add to Playout Queue from drawer
  const handleAddToPlayoutQueue = (newItem) => {
    const setQueue = playoutTarget === 'radio' ? setRadioQueue : setTvQueue;
    setQueue(prev => [...prev, newItem]);
  };

  // 6. Dossiers State (Phase 4.2)
  const [dossiers, setDossiers] = useState([
    {
      id: "dos-1",
      title: "L'Empire du Silicium : Les Dessous de la Révolution Tech",
      description: "Une enquête exclusive sur la géopolitique des semi-conducteurs et le rôle de l'Europe dans la course mondiale.",
      coverImage: "/assets/core/img/vault-1.png",
      articles: ["art-1", "art-2"],
      isVipOnly: true,
      updated: "1d ago"
    }
  ]);
  const [isDossierDrawerOpen, setIsDossierDrawerOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);

  const handleSaveDossier = async (savedDossier) => {
    try {
      const response = await fetch('/api/admin/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedDossier)
      });
      if (!response.ok) throw new Error("Erreur de synchronisation avec le serveur");
      const dbDossier = await response.json();

      const mapped = {
        ...dbDossier,
        coverImage: dbDossier.coverImage || "/assets/core/img/vault-1.png",
        updated: "À l'instant"
      };

      const isEdit = dossiers.some(dos => dos.id === savedDossier.id);
      if (isEdit) {
        setDossiers(prev => prev.map(dos => dos.id === savedDossier.id ? mapped : dos));
        alert("Dossier mis à jour avec succès sur WordPress !");
      } else {
        setDossiers(prev => [...prev, mapped]);
        alert("Nouveau dossier créé avec succès sur WordPress !");
      }
    } catch (err) {
      console.error("API sync error:", err);
      alert("Erreur lors de la synchronisation avec WordPress : " + err.message);
    }
  };

  const handleDeleteDossier = (id) => {
    setDossiers(prev => prev.filter(dos => dos.id !== id));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [articlesRes, dossiersRes] = await Promise.all([
          fetch('/api/admin/articles'),
          fetch('/api/admin/dossiers')
        ]);
        if (articlesRes.ok) {
          const wpArticles = await articlesRes.json();
          const mappedArticles = wpArticles.map(art => ({
            id: art.id,
            type: art.format === 'video' ? 'Vidéo' : art.format === 'audio' ? 'Podcast' : 'Article',
            title: art.title,
            author: "Rédaction",
            category: art.category,
            status: art.status,
            updated: "WordPress Sync",
            content: art.content,
            format: art.format,
            videoUrl: art.videoUrl,
            audioFile: art.audioFile,
            isVipOnly: art.isVipOnly
          }));
          setArticles(prev => {
            const combined = [...mappedArticles];
            prev.forEach(p => {
              if (!combined.some(c => c.title === p.title || c.id === p.id)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
        if (dossiersRes.ok) {
          const wpDossiers = await dossiersRes.json();
          const mappedDossiers = wpDossiers.map(dos => ({
            id: dos.id,
            title: dos.title,
            description: dos.description,
            coverImage: dos.coverImage || "/assets/core/img/vault-1.png",
            articles: dos.articles,
            isVipOnly: dos.isVipOnly,
            updated: "WordPress Sync"
          }));
          setDossiers(prev => {
            const combined = [...mappedDossiers];
            prev.forEach(p => {
              if (!combined.some(c => c.title === p.title || c.id === p.id)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      } catch (error) {
        console.error("Error fetching data from WordPress proxy:", error);
      }
    }
    loadData();
  }, []);

  // 7. Replays State (Phase 4.3)
  const [replays, setReplays] = useState([
    {
      id: "rep-1",
      title: "DONA Talks - Table Ronde Art & Rigueur (12 Juillet)",
      date: "12/07/2026",
      duration: "58:45",
      format: "Vidéo",
      accessLevel: "VIP",
      mediaUrl: "/uploads/replays/art_rigueur.mp4"
    },
    {
      id: "rep-2",
      title: "Chronique Hebdo : L'Éditorialisme Moderne (10 Juillet)",
      date: "10/07/2026",
      duration: "32:10",
      format: "Audio",
      accessLevel: "Public",
      mediaUrl: "/uploads/replays/chronique_hebdo.mp3"
    }
  ]);
  const [isReplayDrawerOpen, setIsReplayDrawerOpen] = useState(false);
  const [selectedReplay, setSelectedReplay] = useState(null);

  const handleSaveReplay = (savedReplay) => {
    const isEdit = replays.some(r => r.id === savedReplay.id);
    if (isEdit) {
      setReplays(prev => prev.map(r => r.id === savedReplay.id ? savedReplay : r));
    } else {
      setReplays(prev => [savedReplay, ...prev]);
    }
  };

  const handleDeleteReplay = (id) => {
    setReplays(prev => prev.filter(r => r.id !== id));
  };

  const handlePublishReplayAsArticle = (replayItem) => {
    const newArticle = {
      id: `art-${Date.now()}`,
      type: "Article",
      title: `Rediffusion : ${replayItem.title}`,
      author: "Elena Moretti",
      category: replayItem.format === 'Audio' ? "11. Culture & Médias" : "02. Power Lab",
      status: "Draft",
      updated: "À l'instant",
      content: `<p>Retrouvez la rediffusion complète de notre émission du ${replayItem.date}.</p><p>Durée : ${replayItem.duration}</p>`,
      format: replayItem.format.toLowerCase() === 'audio' ? 'audio' : 'video',
      url: replayItem.mediaUrl || ''
    };
    setArticles(prev => [newArticle, ...prev]);
    alert(`Article de type ${replayItem.format} généré en brouillon (Draft) avec succès ! Retrouvez-le dans la section Articles.`);
  };

  // 8. Subscription Plans State (Phase 4.4)
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: "plan-essentiel",
      name: "Essentiel",
      priceMonthly: 0,
      priceAnnually: 0,
      currency: "€",
      features: [
        "Accès aux articles publics",
        "Newsletter hebdomadaire",
        "Profil membre basique"
      ]
    },
    {
      id: "plan-premium",
      name: "Premium",
      priceMonthly: 23,
      priceAnnually: 278,
      currency: "€",
      features: [
        "Tout de l'offre Essentiel",
        "Articles et dossiers exclusifs",
        "Accès au réseau privé (Slack)",
        "Webinaires mensuels interactifs",
        "Réductions sur les masterclasses"
      ]
    },
    {
      id: "plan-elite",
      name: "Élite",
      priceMonthly: 63,
      priceAnnually: 758,
      currency: "€",
      features: [
        "Tout de l'offre Premium",
        "Mentorat individuel (1h/mois)",
        "Événements physiques exclusifs",
        "Mise en avant sur le réseau"
      ]
    }
  ]);
  const [paywallText, setPaywallText] = useState("Rejoignez le Club DONA pour débloquer l'accès exclusif à nos magazines, articles premium et documentaires inédits.");
  const [paywallDepth, setPaywallDepth] = useState(30); // 30% cutoff depth
  const [paywallTargetTier, setPaywallTargetTier] = useState('Premium');

  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSavePlan = (savedPlan) => {
    // API BRIDGE INTEGRATION BLUEPRINT:
    // To bridge these pricing rate updates to our public facing /abonnement page,
    // we would dispatch a PUT or POST request to:
    // fetch('/api/global-config', { method: 'PUT', body: JSON.stringify(savedPlan) })
    // which synchronizes the WordPress ACF options pages or MongoDB document.
    setSubscriptionPlans(prev => prev.map(p => p.id === savedPlan.id ? savedPlan : p));
  };

  const handleSavePaywall = () => {
    // API BRIDGE INTEGRATION BLUEPRINT:
    // To bridge this paywall context to our Next.js middleware and API layers:
    // fetch('/api/global-config', { method: 'PUT', body: JSON.stringify({ paywallText, paywallDepth, paywallTargetTier }) })
    console.log("Saving Paywall Configuration:", {
      paywallText,
      paywallDepth,
      paywallTargetTier,
      plans: subscriptionPlans
    });
    alert("Configuration du paywall et des offres mise à jour avec succès !");
  };

  // Handle article save
  const handleSaveArticle = async (savedArticle) => {
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedArticle)
      });
      if (!response.ok) throw new Error("Erreur de synchronisation avec le serveur");
      const dbArticle = await response.json();

      const typeMap = { text: "Article", video: "Vidéo", audio: "Podcast" };
      const mapped = {
        ...dbArticle,
        type: typeMap[dbArticle.format] || "Article",
        author: "Rédaction",
        updated: "À l'instant"
      };

      const isEdit = articles.some(art => art.id === savedArticle.id);
      if (isEdit) {
        setArticles(prev => prev.map(art => art.id === savedArticle.id ? mapped : art));
        alert("Contenu mis à jour avec succès sur WordPress !");
      } else {
        setArticles(prev => [mapped, ...prev]);
        alert("Nouveau contenu créé avec succès sur WordPress !");
      }
    } catch (err) {
      console.error("API sync error:", err);
      alert("Erreur lors de la synchronisation avec WordPress : " + err.message);
    }
  };

  // Video Handlers
  const handleOpenVideoCreate = () => {
    setSelectedVideo(null);
    setIsVideoDrawerOpen(true);
  };

  const handleOpenVideoEdit = (videoItem) => {
    setSelectedVideo(videoItem);
    setIsVideoDrawerOpen(true);
  };

  const handleSaveVideo = (savedVideo) => {
    const isEdit = videos.some(v => v.id === savedVideo.id);

    // API INTEGRATION BLUEPRINT:
    // This is where real database updates will hook into our Phase 1 API contracts:
    /*
    const endpoint = '/api/studio';
    const method = isEdit ? 'PUT' : 'POST';
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedVideo)
      });
      if (!response.ok) throw new Error("Failed to sync video with DB");
    } catch (err) {
      console.error("API sync error:", err);
    }
    */

    if (isEdit) {
      setVideos(prev => prev.map(v => v.id === savedVideo.id ? { ...v, ...savedVideo } : v));
    } else {
      setVideos(prev => [savedVideo, ...prev]);
    }
  };

  // Podcast Handlers
  const handleOpenPodcastCreate = () => {
    setSelectedPodcast(null);
    setIsPodcastDrawerOpen(true);
  };

  const handleOpenPodcastEdit = (podcastItem) => {
    setSelectedPodcast(podcastItem);
    setIsPodcastDrawerOpen(true);
  };

  const handleSavePodcast = (savedPodcast) => {
    const isEdit = podcasts.some(p => p.id === savedPodcast.id);

    // API INTEGRATION BLUEPRINT:
    // This is where real database updates will hook into our Phase 1 API contracts:
    /*
    const endpoint = '/api/studio';
    const method = isEdit ? 'PUT' : 'POST';
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedPodcast)
      });
      if (!response.ok) throw new Error("Failed to sync podcast with DB");
    } catch (err) {
      console.error("API sync error:", err);
    }
    */

    if (isEdit) {
      setPodcasts(prev => prev.map(p => p.id === savedPodcast.id ? { ...p, ...savedPodcast } : p));
    } else {
      setPodcasts(prev => [savedPodcast, ...prev]);
    }
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
              <button className="btn-admin-action primary" onClick={handleOpenVideoCreate}>
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
                          <button onClick={() => handleOpenVideoEdit(vid)} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
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
              <button className="btn-admin-action primary" onClick={handleOpenPodcastCreate}>
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
                          <button onClick={() => handleOpenPodcastEdit(pod)} className="table-action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
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
              <h1>Dossiers d'Enquête</h1>
              <button 
                className="btn-admin-action primary" 
                onClick={() => { setSelectedDossier(null); setIsDossierDrawerOpen(true); }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Nouveau Dossier
              </button>
            </div>

            {dossiers.length === 0 ? (
              <div className="table-card" style={{ marginTop: '20px', padding: '40px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#CCCCCC' }}>folder_open</span>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', fontStyle: 'italic', marginTop: '16px' }}>
                  Aucun dossier d'enquête créé pour le moment.
                </h3>
                <p style={{ color: '#777777', fontSize: '14px', maxWidth: '450px', margin: '8px auto 0' }}>
                  Utilisez cet espace pour regrouper vos grands formats et analyses thématiques.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginTop: '20px' }}>
                {dossiers.map((dos) => (
                  <div key={dos.id} className="table-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                      height: '160px', 
                      backgroundColor: '#FFF0F2', 
                      backgroundImage: dos.coverImage ? `url(${dos.coverImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--admin-accent-color)'
                    }}>
                      {!dos.coverImage && (
                        <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>folder</span>
                      )}
                      {dos.isVipOnly && (
                        <span className="badge vip" style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--admin-accent-color)', color: '#FFFFFF', fontSize: '9px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '1px' }}>
                          VIP
                        </span>
                      )}
                    </div>
                    
                    <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', fontWeight: '700', color: 'var(--admin-text-color)', margin: 0 }}>
                        {dos.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0, lineBreak: 'anywhere', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>
                        {dos.description}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid var(--admin-border-color)', paddingTop: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                          {dos.articles?.length || 0} Article(s) associé(s)
                        </span>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            type="button" 
                            className="btn-admin-action"
                            onClick={() => { setSelectedDossier(dos); setIsDossierDrawerOpen(true); }}
                            style={{ padding: '4px 8px', fontSize: '11px', border: '1px solid var(--admin-border-color)', background: '#FFFFFF', cursor: 'pointer' }}
                          >
                            Éditer
                          </button>
                          <button 
                            type="button" 
                            className="btn-admin-action"
                            onClick={() => handleDeleteDossier(dos.id)}
                            style={{ padding: '4px 8px', fontSize: '11px', border: '1px solid #FFF0F2', background: '#FFF0F2', color: 'var(--admin-accent-color)', cursor: 'pointer' }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      case 'membres': {
        // Filter the members list dynamically
        const filteredMembers = members.filter(mem => {
          const matchesSearch = mem.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
                                mem.email.toLowerCase().includes(memberSearchQuery.toLowerCase());
          const matchesPlan = memberPlanFilter === 'all' || mem.plan === memberPlanFilter;
          const matchesStatus = memberStatusFilter === 'all' || mem.status === memberStatusFilter;
          return matchesSearch && matchesPlan && matchesStatus;
        });

        // Compute luxury stats reflecting the local state additions/mutations
        const totalCount = 1281 + members.length;
        const premiumCount = 841 + members.filter(m => m.status === 'Active' && m.plan === 'Premium').length;
        const eliteCount = 42 + members.filter(m => m.plan === 'Élite').length;

        return (
          <>
            <div className="dashboard-title-row">
              <h1>Membres Club</h1>
              <button 
                className="btn-admin-action primary" 
                onClick={() => { setSelectedMember(null); setIsMemberDrawerOpen(true); }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                Ajouter Membre
              </button>
            </div>

            {/* KPI Header Cards */}
            <div className="metrics-grid" style={{ marginTop: '20px', marginBottom: '24px' }}>
              <div className="metric-card">
                <div className="metric-card-title">Total Membres</div>
                <div className="metric-card-value">{totalCount.toLocaleString('fr-FR')}</div>
                <div className="metric-card-sub">Base d'abonnés globale</div>
              </div>
              <div className="metric-card">
                <div className="metric-card-title">Abonnés Premium</div>
                <div className="metric-card-value">{premiumCount.toLocaleString('fr-FR')}</div>
                <div className="metric-card-sub">Accès payant actif</div>
              </div>
              <div className="metric-card">
                <div className="metric-card-title">Membres Élite</div>
                <div className="metric-card-value">{eliteCount.toLocaleString('fr-FR')}</div>
                <div className="metric-card-sub">Offre prestige curation</div>
              </div>
            </div>

            {/* Search & Filter Row */}
            <div className="table-card" style={{ padding: '16px 24px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', fontSize: '20px' }}>
                  search
                </span>
                <input 
                  type="text" 
                  className="drawer-text-input" 
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom ou email..." 
                  style={{ paddingLeft: '40px', margin: 0 }}
                />
              </div>

              <div style={{ width: '180px' }}>
                <div className="select-wrapper">
                  <select 
                    className="drawer-select" 
                    value={memberPlanFilter}
                    onChange={(e) => setMemberPlanFilter(e.target.value)}
                    style={{ margin: 0 }}
                  >
                    <option value="all">Tous les Plans</option>
                    <option value="Essentiel">Essentiel</option>
                    <option value="Premium">Premium</option>
                    <option value="Élite">Élite</option>
                  </select>
                </div>
              </div>

              <div style={{ width: '180px' }}>
                <div className="select-wrapper">
                  <select 
                    className="drawer-select" 
                    value={memberStatusFilter}
                    onChange={(e) => setMemberStatusFilter(e.target.value)}
                    style={{ margin: 0 }}
                  >
                    <option value="all">Tous les Statuts</option>
                    <option value="Active">Actif</option>
                    <option value="Inactive">Inactif</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h2 className="table-title">Annuaire des Membres Club</h2>
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
                  {filteredMembers.map((mem) => (
                    <tr key={mem.id}>
                      <td className="cell-bold">{mem.name}</td>
                      <td>{mem.email}</td>
                      <td>
                        <span className={`badge ${mem.plan === 'Élite' ? 'vip' : mem.plan === 'Premium' ? 'published' : 'draft'}`} style={{ 
                          backgroundColor: mem.plan === 'Élite' ? 'var(--admin-accent-color)' : mem.plan === 'Premium' ? '#EFF6FF' : '#F3F4F6',
                          color: mem.plan === 'Élite' ? '#FFFFFF' : mem.plan === 'Premium' ? '#1E3A8A' : '#374151'
                        }}>
                          {mem.plan}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${mem.status === 'Active' ? 'published' : 'draft'}`}>
                          {mem.status === 'Active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td style={{ color: '#888888' }}>{mem.joined}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            onClick={() => { setSelectedMember(mem); setIsMemberDrawerOpen(true); }} 
                            className="table-action-btn" 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                          >
                            Éditer
                          </button>
                          <span className="table-action-divider">|</span>
                          <button 
                            onClick={() => setMembers(prev => prev.map(m => m.id === mem.id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m))} 
                            className="table-action-btn" 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                          >
                            Basculer Accès
                          </button>
                          <span className="table-action-divider">|</span>
                          <button 
                            onClick={() => {
                              if (confirm(`Supprimer le membre ${mem.name} ?`)) {
                                setMembers(prev => prev.filter(m => m.id !== mem.id));
                              }
                            }} 
                            className="table-action-btn secondary" 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'var(--admin-accent-color)' }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#888888', fontStyle: 'italic' }}>
                        Aucun membre trouvé pour les critères sélectionnés.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        );
      }

      case 'settings': {
        const handleSaveSettingsSubmit = (e) => {
          e.preventDefault();
          // API BRIDGE INTEGRATION BLUEPRINT:
          // To bridge these graphic and brand assets settings to our frontend pages:
          // fetch('/api/global-config', { method: 'PUT', body: JSON.stringify(brandSettings) })
          console.log("Saving Brand Settings:", brandSettings);
          alert("Identité visuelle et configuration de la marque enregistrées avec succès !");
        };

        const handleSaveSeoSubmit = (e) => {
          e.preventDefault();
          // API BRIDGE INTEGRATION BLUEPRINT:
          // To bridge these SEO & tracking settings to public HTML headers and router middleware:
          // fetch('/api/global-config', { method: 'PUT', body: JSON.stringify({ ...seoSettings }) })
          console.log("Saving SEO Settings:", seoSettings);
          alert("Configuration SEO et outils de tracking mis à jour avec succès !");
        };

        if (subsection === 'brand') {
          return (
            <>
              <div className="dashboard-title-row">
                <h1>Identité Graphique & Marque (Brand Settings)</h1>
              </div>

              <div className="table-card" style={{ marginTop: '20px', padding: '30px' }}>
                <form onSubmit={handleSaveSettingsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* 1. Brand Assets Management (Logos & Icons) */}
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                      1. Gestion des Assets de Marque (Logos & Favicon)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                      {/* Logo Principal (Sombre) */}
                      <div className="drawer-input-group">
                        <label>Logo Principal (Version Sombre / Dark Mode)</label>
                        <div style={{
                          border: '2px dashed var(--admin-border-color)',
                          borderRadius: '2px',
                          padding: '20px',
                          textAlign: 'center',
                          backgroundColor: '#FAF9F6',
                          cursor: 'pointer',
                          position: 'relative'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
                            image
                          </span>
                          <p style={{ margin: 0, fontSize: '12px', color: '#555555' }}>
                            Glissez-déposez le logo (.svg, .png) ou cliquez pour parcourir
                          </p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setBrandSettings(prev => ({ ...prev, logoDark: URL.createObjectURL(e.target.files[0]) }));
                              }
                            }}
                          />
                        </div>
                        {brandSettings.logoDark && (
                          <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'green' }}>check_circle</span>
                            <span>Asset chargé : {brandSettings.logoDark.substring(0, 40)}...</span>
                          </div>
                        )}
                      </div>

                      {/* Logo Principal (Clair) */}
                      <div className="drawer-input-group">
                        <label>Logo Principal (Version Claire / Light Mode)</label>
                        <div style={{
                          border: '2px dashed var(--admin-border-color)',
                          borderRadius: '2px',
                          padding: '20px',
                          textAlign: 'center',
                          backgroundColor: '#FAF9F6',
                          cursor: 'pointer',
                          position: 'relative'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
                            image
                          </span>
                          <p style={{ margin: 0, fontSize: '12px', color: '#555555' }}>
                            Glissez-déposez le logo (.svg, .png) ou cliquez pour parcourir
                          </p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setBrandSettings(prev => ({ ...prev, logoLight: URL.createObjectURL(e.target.files[0]) }));
                              }
                            }}
                          />
                        </div>
                        {brandSettings.logoLight && (
                          <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'green' }}>check_circle</span>
                            <span>Asset chargé : {brandSettings.logoLight.substring(0, 40)}...</span>
                          </div>
                        )}
                      </div>

                      {/* Favicon */}
                      <div className="drawer-input-group">
                        <label>Favicon (Icône de Navigateur)</label>
                        <div style={{
                          border: '2px dashed var(--admin-border-color)',
                          borderRadius: '2px',
                          padding: '20px',
                          textAlign: 'center',
                          backgroundColor: '#FAF9F6',
                          cursor: 'pointer',
                          position: 'relative'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
                            dataset
                          </span>
                          <p style={{ margin: 0, fontSize: '12px', color: '#555555' }}>
                            Glissez-déposez l'icône (.ico, .png) ou cliquez pour parcourir
                          </p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setBrandSettings(prev => ({ ...prev, favicon: URL.createObjectURL(e.target.files[0]) }));
                              }
                            }}
                          />
                        </div>
                        {brandSettings.favicon && (
                          <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'green' }}>check_circle</span>
                            <span>Asset chargé : {brandSettings.favicon.substring(0, 40)}...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Dynamic Color Scheme Configurator */}
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                      2. Palette Chromatique
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                      
                      <div className="drawer-input-group">
                        <label htmlFor="primary-color">Couleur Primaire (Accent / Crimson)</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <input 
                            id="primary-color"
                            type="color" 
                            className="drawer-text-input" 
                            style={{ width: '60px', height: '40px', padding: '2px', cursor: 'pointer' }}
                            value={brandSettings.primaryColor}
                            onChange={(e) => setBrandSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          />
                          <input 
                            type="text" 
                            className="drawer-text-input" 
                            value={brandSettings.primaryColor}
                            onChange={(e) => setBrandSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                            style={{ margin: 0, textTransform: 'uppercase', fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>

                      <div className="drawer-input-group">
                        <label htmlFor="background-color">Niveau de Fond Sombre (Charcoal)</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <input 
                            id="background-color"
                            type="color" 
                            className="drawer-text-input" 
                            style={{ width: '60px', height: '40px', padding: '2px', cursor: 'pointer' }}
                            value={brandSettings.backgroundColor}
                            onChange={(e) => setBrandSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          />
                          <input 
                            type="text" 
                            className="drawer-text-input" 
                            value={brandSettings.backgroundColor}
                            onChange={(e) => setBrandSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            style={{ margin: 0, textTransform: 'uppercase', fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>

                    </div>
                    {/* Live CSS variable injection comment explanation */}
                    <p style={{ margin: '12px 0 0', fontSize: '11px', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                      * Note technique : Ces couleurs sont injectées dans la racine document sous forme de variables CSS <code>--primary-color</code> et <code>--bg-dark-color</code> pour rafraîchir instantanément la charte graphique sur le site public.
                    </p>
                  </div>

                  {/* 3. Typography Selectors */}
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                      3. Curation Typographique (Google Fonts)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                      
                      <div className="drawer-input-group">
                        <label htmlFor="title-font">Police des Titres (Headings)</label>
                        <div className="select-wrapper">
                          <select 
                            id="title-font"
                            className="drawer-select"
                            value={brandSettings.titleFont}
                            onChange={(e) => setBrandSettings(prev => ({ ...prev, titleFont: e.target.value }))}
                          >
                            <option value="Cormorant Garamond">Cormorant Garamond (Luxe & Éditorial)</option>
                            <option value="Playfair Display">Playfair Display (Classique & Premium)</option>
                            <option value="Cinzel">Cinzel (Impérial & Historique)</option>
                            <option value="Newsreader">Newsreader (Littéraire & Calme)</option>
                          </select>
                        </div>
                      </div>

                      <div className="drawer-input-group">
                        <label htmlFor="prose-font">Police du Corps de Texte (Prose)</label>
                        <div className="select-wrapper">
                          <select 
                            id="prose-font"
                            className="drawer-select"
                            value={brandSettings.proseFont}
                            onChange={(e) => setBrandSettings(prev => ({ ...prev, proseFont: e.target.value }))}
                          >
                            <option value="Inter">Inter (Moderne & Lisible)</option>
                            <option value="Montserrat">Montserrat (Géométrique & Institutionnel)</option>
                            <option value="Lora">Lora (Sérif contemporain)</option>
                            <option value="Outfit">Outfit (Minimaliste & Épuré)</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Submit button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="submit" className="btn-drawer primary" style={{ width: 'auto' }}>
                      Enregistrer la configuration de marque
                    </button>
                  </div>

                </form>
              </div>
            </>
          );
        }

        if (subsection === 'seo') {
          return (
            <>
              <div className="dashboard-title-row">
                <h1>Configuration SEO & Tracking Analytics</h1>
              </div>

              <div className="table-card" style={{ marginTop: '20px', padding: '30px' }}>
                <form onSubmit={handleSaveSeoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* 1. Global Meta & Social Share Customizer */}
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                      1. Métadonnées Globales & Partage Social (Open Graph)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                      
                      <div className="drawer-input-group">
                        <label htmlFor="title-template">Modèle du Titre SEO (Title Template)</label>
                        <input 
                          id="title-template"
                          type="text" 
                          className="drawer-text-input"
                          value={seoSettings.titleTemplate}
                          onChange={(e) => setSeoSettings(prev => ({ ...prev, titleTemplate: e.target.value }))}
                          placeholder="%title% | Dona Magazine"
                          required
                        />
                        <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                          Le tag <code>%title%</code> sera dynamiquement remplacé par le titre de l'article ou de la rubrique.
                        </p>
                      </div>

                      <div className="drawer-input-group">
                        <label>Visuel de Partage par Défaut (Image Open Graph)</label>
                        <div style={{
                          border: '2px dashed var(--admin-border-color)',
                          borderRadius: '2px',
                          padding: '24px',
                          textAlign: 'center',
                          backgroundColor: '#FAF9F6',
                          cursor: 'pointer',
                          position: 'relative'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
                            share
                          </span>
                          <p style={{ margin: 0, fontSize: '12px', color: '#555555' }}>
                            Glissez-déposez le visuel par défaut ou cliquez pour parcourir (1200x630px recommandé)
                          </p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setSeoSettings(prev => ({ ...prev, ogImage: URL.createObjectURL(e.target.files[0]) }));
                              }
                            }}
                          />
                        </div>
                        {seoSettings.ogImage && (
                          <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'green' }}>check_circle</span>
                            <span>Image Open Graph chargée : {seoSettings.ogImage.substring(0, 40)}...</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* 2. Indexing & Search Control (Robots & Sitemaps) */}
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                      2. Indexation & Visibilité (Robots & Sitemaps)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      <div className="drawer-input-group">
                        <label>Visibilité dans les moteurs de recherche</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                          <span style={{ fontSize: '13px', color: '#555555' }}>Bloquer l'indexation (noindex, nofollow)</span>
                          <button 
                            type="button"
                            onClick={() => {
                              const newEnabled = !seoSettings.indexingEnabled;
                              const newRobots = newEnabled 
                                ? "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://dona-magazine.com/sitemap.xml"
                                : "User-agent: *\nDisallow: /\n# Mode Privé activé";
                              setSeoSettings(prev => ({ 
                                ...prev, 
                                indexingEnabled: newEnabled,
                                robotsTxt: newRobots
                              }));
                            }}
                            style={{
                              border: 'none',
                              backgroundColor: seoSettings.indexingEnabled ? 'var(--admin-accent-color)' : '#CCCCCC',
                              width: '48px',
                              height: '24px',
                              borderRadius: '12px',
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'background-color 0.3s'
                            }}
                          >
                            <span style={{
                              position: 'absolute',
                              top: '2px',
                              left: seoSettings.indexingEnabled ? '26px' : '2px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                              transition: 'left 0.3s'
                            }} />
                          </button>
                          <span style={{ fontSize: '13px', color: '#555555' }}>Autoriser les moteurs à indexer ce site</span>
                        </div>
                      </div>

                      <div className="drawer-input-group">
                        <label htmlFor="robots-txt">Directives Robots.txt personnalisées</label>
                        <textarea 
                          id="robots-txt"
                          className="drawer-textarea"
                          rows={4}
                          value={seoSettings.robotsTxt}
                          onChange={(e) => setSeoSettings(prev => ({ ...prev, robotsTxt: e.target.value }))}
                          style={{ fontFamily: 'monospace', fontSize: '13px', backgroundColor: '#FAF9F6' }}
                        />
                      </div>

                      <div className="drawer-input-group">
                        <label>Index des Fichiers (Sitemaps)</label>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          backgroundColor: '#FFF0F2',
                          border: '1px solid var(--admin-border-color)',
                          borderRadius: '2px',
                          width: 'fit-content'
                        }}>
                          <span className="material-symbols-outlined" style={{ color: 'var(--admin-accent-color)', fontSize: '20px' }}>
                            link
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--admin-text-color)' }}>
                            Sitemap principal détecté : 
                            <a 
                              href="/sitemap.xml" 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ marginLeft: '6px', color: 'var(--admin-accent-color)', textDecoration: 'underline' }}
                            >
                              /sitemap.xml
                            </a>
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 3. Analytics & Integrations */}
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                      3. Analyse d'Audience & Clés de Validation (Tracking)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                      
                      <div className="drawer-input-group">
                        <label htmlFor="google-console">Clé de vérification Google Search Console</label>
                        <input 
                          id="google-console"
                          type="text" 
                          className="drawer-text-input"
                          value={seoSettings.googleConsoleKey}
                          onChange={(e) => setSeoSettings(prev => ({ ...prev, googleConsoleKey: e.target.value }))}
                          placeholder="google-site-verification-..."
                        />
                      </div>

                      <div className="drawer-input-group">
                        <label htmlFor="google-analytics">ID de Mesure Google Analytics (GA4)</label>
                        <input 
                          id="google-analytics"
                          type="text" 
                          className="drawer-text-input"
                          value={seoSettings.googleAnalyticsId}
                          onChange={(e) => setSeoSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>

                      <div className="drawer-input-group">
                        <label htmlFor="meta-pixel">ID de Script Meta Pixel (Facebook)</label>
                        <input 
                          id="meta-pixel"
                          type="text" 
                          className="drawer-text-input"
                          value={seoSettings.metaPixelId}
                          onChange={(e) => setSeoSettings(prev => ({ ...prev, metaPixelId: e.target.value }))}
                          placeholder="FB-PIXEL-..."
                        />
                      </div>

                    </div>
                  </div>

                  {/* Submit button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="submit" className="btn-drawer primary" style={{ width: 'auto' }}>
                      Enregistrer la configuration SEO
                    </button>
                  </div>

                </form>
              </div>
            </>
          );
        }
        const handleSaveNavigationSubmit = (e) => {
          e.preventDefault();
          // API BRIDGE INTEGRATION BLUEPRINT:
          // To bridge these navigation menu configurations to our layouts and header/footer components:
          // fetch('/api/global-config', { method: 'PUT', body: JSON.stringify({ headerMenu, footerColumns, navCtaText, navCtaUrl }) })
          console.log("Saving Navigation Settings:", { headerMenu, footerColumns, navCtaText, navCtaUrl });
          alert("Configuration de la navigation et des menus enregistrée avec succès !");
        };

        if (subsection === 'navigation') {
          return (
            <>
              <div className="dashboard-title-row">
                <h1>Constructeur de Menus & Navigation</h1>
              </div>

              <form onSubmit={handleSaveNavigationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* 1. Header CTA Customizer */}
                <div className="table-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                    1. Bouton d'Action Principal (Header CTA)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="drawer-input-group">
                      <label htmlFor="cta-text">Libellé du Bouton CTA</label>
                      <input 
                        id="cta-text"
                        type="text" 
                        className="drawer-text-input" 
                        value={navCtaText} 
                        onChange={(e) => setNavCtaText(e.target.value)} 
                        placeholder="Ex: Devenir Membre..."
                        required
                      />
                    </div>
                    <div className="drawer-input-group">
                      <label htmlFor="cta-url">Lien de Destination</label>
                      <input 
                        id="cta-url"
                        type="text" 
                        className="drawer-text-input" 
                        value={navCtaUrl} 
                        onChange={(e) => setNavCtaUrl(e.target.value)} 
                        placeholder="Ex: /abonnement..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Main Header Menu Builder */}
                <div className="table-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                    2. Menu de Navigation Supérieur (Header Menu)
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
                    
                    {/* Active Menu List with reorder buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
                        Ordre des Liens Actifs
                      </label>
                      <div style={{ border: '1px solid var(--admin-border-color)', borderRadius: '2px', backgroundColor: '#FAF9F6' }}>
                        {headerMenu.map((item, index) => (
                          <div key={item.id} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '12px 16px',
                            borderBottom: index === headerMenu.length - 1 ? 'none' : '1px solid var(--admin-border-color)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text-color)' }}>{item.label}</span>
                              <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>({item.url})</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <button 
                                type="button" 
                                onClick={() => moveHeaderItem(index, 'up')}
                                disabled={index === 0}
                                style={{ border: 'none', background: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? '#CCC' : 'var(--admin-text-color)', padding: '2px' }}
                                title="Monter"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_upward</span>
                              </button>
                              <button 
                                type="button" 
                                onClick={() => moveHeaderItem(index, 'down')}
                                disabled={index === headerMenu.length - 1}
                                style={{ border: 'none', background: 'none', cursor: index === headerMenu.length - 1 ? 'not-allowed' : 'pointer', color: index === headerMenu.length - 1 ? '#CCC' : 'var(--admin-text-color)', padding: '2px' }}
                                title="Descendre"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_downward</span>
                              </button>
                              <span style={{ margin: '0 4px', color: 'var(--admin-border-color)' }}>|</span>
                              <button 
                                type="button" 
                                onClick={() => removeHeaderItem(item.id)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-accent-color)', padding: '2px' }}
                                title="Retirer"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Custom Link Form */}
                    <div style={{ padding: '20px', border: '1px solid var(--admin-border-color)', borderRadius: '2px', backgroundColor: '#FFFFFF' }}>
                      <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--admin-text-color)' }}>
                        Ajouter un lien personnalisé
                      </h4>
                      <div className="drawer-input-group" style={{ marginBottom: '12px' }}>
                        <label htmlFor="new-header-label">Label du lien</label>
                        <input 
                          id="new-header-label"
                          type="text" 
                          className="drawer-text-input" 
                          value={newHeaderLabel} 
                          onChange={(e) => setNewHeaderLabel(e.target.value)} 
                          placeholder="Ex: Le Club..."
                        />
                      </div>
                      <div className="drawer-input-group" style={{ marginBottom: '16px' }}>
                        <label htmlFor="new-header-url">URL de destination</label>
                        <input 
                          id="new-header-url"
                          type="text" 
                          className="drawer-text-input" 
                          value={newHeaderUrl} 
                          onChange={(e) => setNewHeaderUrl(e.target.value)} 
                          placeholder="Ex: /abonnement..."
                        />
                      </div>
                      <button 
                        type="button" 
                        className="btn-drawer primary" 
                        onClick={addHeaderItem}
                        style={{ width: '100%', padding: '10px' }}
                      >
                        + Ajouter au Menu
                      </button>
                    </div>

                  </div>
                </div>

                {/* 3. Footer Columns Customizer */}
                <div className="table-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                    3. Groupes de Liens du Pied de Page (Footer Columns)
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                    {footerColumns.map((col) => (
                      <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', border: '1px solid var(--admin-border-color)', borderRadius: '2px', backgroundColor: '#FAF9F6' }}>
                        
                        {/* Editable Column Title */}
                        <div className="drawer-input-group" style={{ margin: 0 }}>
                          <label>Titre du groupe (Colonne)</label>
                          <input 
                            type="text" 
                            className="drawer-text-input" 
                            value={col.title}
                            onChange={(e) => handleFooterColumnTitleChange(col.id, e.target.value)}
                            style={{ fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}
                            required
                          />
                        </div>

                        {/* List of Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>
                            Liens Actifs
                          </label>
                          {col.links.map((link) => (
                            <div key={link.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <input 
                                type="text"
                                className="drawer-text-input"
                                value={link.label}
                                onChange={(e) => handleFooterLinkChange(col.id, link.id, 'label', e.target.value)}
                                style={{ margin: 0, flexGrow: 1, fontSize: '12px', padding: '6px 8px' }}
                                placeholder="Label"
                                required
                              />
                              <input 
                                type="text"
                                className="drawer-text-input"
                                value={link.url}
                                onChange={(e) => handleFooterLinkChange(col.id, link.id, 'url', e.target.value)}
                                style={{ margin: 0, flexGrow: 1, fontSize: '12px', padding: '6px 8px' }}
                                placeholder="URL"
                                required
                              />
                              <button 
                                type="button"
                                onClick={() => removeFooterLink(col.id, link.id)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-accent-color)', padding: 0 }}
                                title="Supprimer"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Link inside Column */}
                        <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px dashed var(--admin-border-color)' }}>
                          <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '8px' }}>
                            Ajouter un lien interne
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input 
                              type="text"
                              className="drawer-text-input"
                              value={newFooterLabel[col.id] || ''}
                              onChange={(e) => setNewFooterLabel(prev => ({ ...prev, [col.id]: e.target.value }))}
                              placeholder="Texte (ex: Plan du site)"
                              style={{ margin: 0, fontSize: '12px', padding: '6px 8px' }}
                            />
                            <input 
                              type="text"
                              className="drawer-text-input"
                              value={newFooterUrl[col.id] || ''}
                              onChange={(e) => setNewFooterUrl(prev => ({ ...prev, [col.id]: e.target.value }))}
                              placeholder="URL (ex: /sitemap)"
                              style={{ margin: 0, fontSize: '12px', padding: '6px 8px' }}
                            />
                            <button 
                              type="button"
                              className="btn-drawer secondary"
                              onClick={() => addFooterLink(col.id)}
                              style={{ padding: '6px', fontSize: '12px', marginTop: '4px' }}
                            >
                              + Ajouter le lien
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Action buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '40px' }}>
                  <button type="submit" className="btn-drawer primary" style={{ width: 'auto' }}>
                    Enregistrer la configuration de navigation
                  </button>
                </div>

              </form>
            </>
          );
        };

        const handleSaveLanguesSubmit = (e) => {
          e.preventDefault();
          // API BRIDGE INTEGRATION BLUEPRINT:
          // To bridge these languages and translations configurations to public pages/i18n engine:
          // fetch('/api/global-config', { method: 'PUT', body: JSON.stringify({ locales, translations }) })
          console.log("Saving Multilingual Config:", { locales, translations });
          alert("Configuration multilingue et dictionnaire de traduction enregistrés avec succès !");
        };

        const handleBulkTranslate = () => {
          // Simulate DeepL/Google Translate bulk fill for empty fields
          setTranslations(prev => prev.map(item => {
            const updated = { ...item };
            const fallbackValues = {
              button_subscribe: {
                FR: "S'abonner", EN: "Subscribe", SW: "Kujiandikisha", ES: "Suscribirse", PT: "Inscrever-se", DE: "Abonnieren", IT: "Iscriviti", AR: "اشترك"
              },
              members_only_badge: {
                FR: "Membres uniquement", EN: "Members only", SW: "Wanachama tu", ES: "Solo miembros", PT: "Apenas membros", DE: "Nur für Mitglieder", IT: "Solo membri", AR: "الأعضاء فقط"
              },
              footer_copyright: {
                FR: "Tous droits réservés", EN: "All rights reserved", SW: "Haki zote zimehifadhiwa", ES: "Todos los droits réservés", PT: "Todos os direitos reservados", DE: "Alle Rechte vorbehalten", IT: "Tutti i diritti riservati", AR: "جميع الحقوق محفوظة"
              }
            };

            const keysMap = fallbackValues[item.key] || {};
            locales.forEach(loc => {
              if (!updated[loc.code] && keysMap[loc.code]) {
                updated[loc.code] = keysMap[loc.code];
              }
            });
            return updated;
          }));
          alert("Traduction automatique simulée (via DeepL API) appliquée avec succès sur les champs vides !");
        };

        if (subsection === 'langues') {
          // Filtered translation dictionary list
          const filteredTranslations = translations.filter(item => {
            // Search filter
            const matchesSearch = item.key.toLowerCase().includes(translationSearch.toLowerCase()) || 
                                  item.description.toLowerCase().includes(translationSearch.toLowerCase());
            
            if (!matchesSearch) return false;

            // Translation status filter
            if (translationFilter === 'untranslated') {
              // check if any of the enabled languages has empty string value
              return locales.some(loc => loc.enabled && !item[loc.code]);
            }
            return true;
          });

          return (
            <>
              <div className="dashboard-title-row">
                <h1>Configuration Multilingue & Localisation (i18n)</h1>
                <button 
                  type="button" 
                  className="btn-drawer secondary" 
                  onClick={handleBulkTranslate}
                  style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>translate</span>
                  Pré-remplir via Translation API
                </button>
              </div>

              <form onSubmit={handleSaveLanguesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' }}>
                
                {/* 1. Official 8 Locales Configurator */}
                <div className="table-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                    1. Configuration des 8 Langues Officielles
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    {locales.map((loc, idx) => (
                      <div key={loc.code} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        padding: '16px', 
                        border: '1px solid var(--admin-border-color)', 
                        borderRadius: '2px', 
                        backgroundColor: loc.enabled ? '#FFFFFF' : '#FAF9F6' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px' }}>{loc.flag}</span>
                            <div>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--admin-text-color)', display: 'block' }}>
                                {loc.name}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                                ISO: {loc.code}
                              </span>
                            </div>
                          </div>
                          
                          {/* Visual Tags */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                            {loc.isDefault && (
                              <span style={{ fontSize: '9px', fontWeight: '700', backgroundColor: 'var(--admin-accent-color)', color: '#FFFFFF', padding: '2px 6px', borderRadius: '2px', textTransform: 'uppercase' }}>
                                Par Défaut
                              </span>
                            )}
                            {loc.rtl && (
                              <span style={{ fontSize: '9px', fontWeight: '700', backgroundColor: '#B08D57', color: '#FFFFFF', padding: '2px 6px', borderRadius: '2px', textTransform: 'uppercase' }}>
                                RTL Enabled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Toggle switch */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                            Statut : {loc.enabled ? 'Actif' : 'Inactif'}
                          </span>
                          <button 
                            type="button"
                            disabled={loc.isDefault}
                            onClick={() => {
                              setLocales(prev => prev.map(l => l.code === loc.code ? { ...l, enabled: !l.enabled } : l));
                            }}
                            style={{
                              border: 'none',
                              backgroundColor: loc.enabled ? 'var(--admin-accent-color)' : '#CCCCCC',
                              width: '40px',
                              height: '20px',
                              borderRadius: '10px',
                              position: 'relative',
                              cursor: loc.isDefault ? 'not-allowed' : 'pointer',
                              opacity: loc.isDefault ? 0.6 : 1,
                              transition: 'background-color 0.3s'
                            }}
                          >
                            <span style={{
                              position: 'absolute',
                              top: '2px',
                              left: loc.enabled ? '22px' : '2px',
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                              transition: 'left 0.3s'
                            }} />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive Translation Dictionary */}
                <div className="table-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontStyle: 'italic', marginBottom: '16px', color: 'var(--admin-text-color)', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '8px' }}>
                    2. Dictionnaire de Traduction de l'Interface (Keys Dictionary)
                  </h3>
                  
                  {/* Search and Filters */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ flexGrow: 1, position: 'relative' }}>
                      <input 
                        type="text" 
                        className="drawer-text-input" 
                        value={translationSearch}
                        onChange={(e) => setTranslationSearch(e.target.value)}
                        placeholder="Rechercher une clé ou une description..."
                        style={{ margin: 0, paddingLeft: '36px' }}
                      />
                      <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--admin-text-muted)' }}>
                        search
                      </span>
                    </div>

                    <div className="select-wrapper" style={{ width: '220px' }}>
                      <select 
                        className="drawer-select" 
                        value={translationFilter}
                        onChange={(e) => setTranslationFilter(e.target.value)}
                        style={{ height: '40px' }}
                      >
                        <option value="all">Tous les champs</option>
                        <option value="untranslated">Champs non traduits</option>
                      </select>
                    </div>
                  </div>

                  {/* Translation Matrix Table */}
                  <div style={{ overflowX: 'auto', border: '1px solid var(--admin-border-color)', borderRadius: '2px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FAF9F6', borderBottom: '1px solid var(--admin-border-color)' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', minWidth: '220px' }}>Clé & Description</th>
                          {locales.map(loc => (
                            <th key={loc.code} style={{ 
                              padding: '12px 16px', 
                              textAlign: 'left', 
                              fontWeight: '700',
                              minWidth: '160px',
                              opacity: loc.enabled ? 1 : 0.4
                            }}>
                              <span style={{ marginRight: '6px' }}>{loc.flag}</span>
                              {loc.code}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTranslations.map((item, idx) => (
                          <tr key={item.key} style={{ borderBottom: idx === filteredTranslations.length - 1 ? 'none' : '1px solid var(--admin-border-color)' }}>
                            <td style={{ padding: '12px 16px', backgroundColor: '#FFFFFF' }}>
                              <span style={{ fontWeight: '700', color: 'var(--admin-text-color)', display: 'block', fontFamily: 'monospace' }}>
                                {item.key}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                                {item.description}
                              </span>
                            </td>
                            
                            {locales.map(loc => {
                              const cellValue = item[loc.code] || '';
                              return (
                                <td key={loc.code} style={{ padding: '8px 12px', opacity: loc.enabled ? 1 : 0.5 }}>
                                  <input 
                                    type="text"
                                    disabled={!loc.enabled}
                                    value={cellValue}
                                    onChange={(e) => {
                                      const newVal = e.target.value;
                                      setTranslations(prev => prev.map(t => {
                                        if (t.key === item.key) {
                                          return { ...t, [loc.code]: newVal };
                                        }
                                        return t;
                                      }));
                                    }}
                                    placeholder={!loc.enabled ? "Désactivé" : `Traduction ${loc.code}...`}
                                    style={{
                                      width: '100%',
                                      padding: '6px 8px',
                                      border: '1px solid var(--admin-border-color)',
                                      borderRadius: '2px',
                                      fontSize: '12px',
                                      dir: loc.rtl ? 'rtl' : 'ltr',
                                      backgroundColor: !loc.enabled ? '#ECECEC' : '#FFFFFF'
                                    }}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                        {filteredTranslations.length === 0 && (
                          <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                              Aucune clé de traduction trouvée pour vos critères de filtrage.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Submit button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                  <button type="submit" className="btn-drawer primary" style={{ width: 'auto' }}>
                    Enregistrer la configuration des langues
                  </button>
                </div>

              </form>
            </>
          );
        }

        // Fallback for general settings / SEO Settings
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Configuration : {subsection.toUpperCase() || 'GENERAL'}</h1>
            </div>

            <div className="table-card" style={{ marginTop: '20px', padding: '30px' }}>
              <form onSubmit={handleSaveSettingsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="drawer-input-group">
                    <label htmlFor="site-name">Nom du site</label>
                    <input
                      id="site-name"
                      type="text"
                      className="drawer-text-input"
                      value={brandSettings.siteName}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div className="drawer-input-group">
                    <label htmlFor="site-tagline">Slogan du site</label>
                    <input
                      id="site-tagline"
                      type="text"
                      className="drawer-text-input"
                      value={brandSettings.tagline}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    />
                  </div>
                  <div className="drawer-input-group">
                    <label htmlFor="seo-title">Titre SEO Principal</label>
                    <input
                      id="seo-title"
                      type="text"
                      className="drawer-text-input"
                      value={brandSettings.seoTitle}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                    />
                  </div>
                  <div className="drawer-input-group">
                    <label htmlFor="contact-email">Email de contact général</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="drawer-text-input"
                      value={brandSettings.contactEmail}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="drawer-input-group">
                  <label htmlFor="seo-description">Description SEO (Meta Description)</label>
                  <textarea
                    id="seo-description"
                    className="drawer-textarea"
                    value={brandSettings.seoDescription}
                    onChange={(e) => setBrandSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" className="btn-drawer primary" style={{ width: 'auto' }}>
                    Enregistrer la configuration générale
                  </button>
                </div>
              </form>
            </div>
          </>
        );
      }

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
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Studio Radio Live</h1>
            </div>

            <div className="playout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>
              {/* Column 1: Now Playing & Override */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="now-playing-card">
                  <span className="now-playing-badge">ON AIR</span>
                  <label className="group-title" style={{ padding: 0 }}>En Cours de Lecture</label>
                  <h3 className="now-playing-title">{radioNowPlaying.title}</h3>
                  <div className="now-playing-meta">
                    <span>Durée : {radioNowPlaying.duration}</span>
                    <span>Restant : {radioNowPlaying.remaining}</span>
                  </div>
                  <div className="progress-bar-container" style={{ height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${radioNowPlaying.progress}%` }} />
                  </div>
                  
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      className="btn-drawer secondary" 
                      onClick={() => setRadioNowPlaying({ title: "Edito DONA Spécial Musique", duration: "05:00", remaining: "05:00", progress: 0 })}
                      style={{ padding: '8px 16px' }}
                    >
                      Sauter le média
                    </button>
                  </div>
                </div>

                {/* Override switch block */}
                <div className="playout-override-block">
                  <div className="override-header">
                    <div>
                      <span className="override-title">Bypass Auto-Playlist</span>
                      <p className="override-desc">Forcer le flux de diffusion externe RTMP en direct.</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={radioOverride}
                        onChange={(e) => setRadioOverride(e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  {radioOverride && (
                    <div className="rtmp-keys-box">
                      <div className="rtmp-key-row">
                        <label>URL du Serveur RTMP</label>
                        <div className="rtmp-key-input-group">
                          <input 
                            type="text" 
                            readOnly 
                            className="rtmp-input" 
                            value="rtmp://live.dona-magazine.com/radio" 
                          />
                          <button 
                            type="button" 
                            className="btn-rtmp-copy"
                            onClick={() => { navigator.clipboard.writeText("rtmp://live.dona-magazine.com/radio"); alert("URL copiée !"); }}
                          >
                            Copier
                          </button>
                        </div>
                      </div>
                      <div className="rtmp-key-row">
                        <label>Clé de stream (Stream Key)</label>
                        <div className="rtmp-key-input-group">
                          <input 
                            type="password" 
                            readOnly 
                            className="rtmp-input" 
                            value="dona_radio_key_prod_849a29" 
                          />
                          <button 
                            type="button" 
                            className="btn-rtmp-copy"
                            onClick={() => { navigator.clipboard.writeText("dona_radio_key_prod_849a29"); alert("Clé copiée !"); }}
                          >
                            Copier
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Playout Queue */}
              <div className="table-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="table-title" style={{ margin: 0 }}>File d'attente (Playlist Auto)</h3>
                  <button 
                    type="button" 
                    className="btn-admin-action primary"
                    onClick={() => { setPlayoutTarget('radio'); setIsPlayoutDrawerOpen(true); }}
                    style={{ padding: '8px 16px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    Ajouter
                  </button>
                </div>

                <div className="playout-queue-list">
                  {radioQueue.map((item, index) => (
                    <div key={item.id} className="playout-queue-item">
                      <span className="material-symbols-outlined drag-handle">drag_indicator</span>
                      
                      <div className="queue-item-details">
                        <span className="queue-item-title">{item.title}</span>
                        <div className="queue-item-meta">
                          <span>Format : {item.format}</span>
                          <span>Durée : {item.duration}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveQueueItem('radio', index, 'up')}
                          style={{ border: 'none', background: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? '#CCC' : '#555' }}
                          title="Monter"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_upward</span>
                        </button>
                        <button 
                          type="button"
                          disabled={index === radioQueue.length - 1}
                          onClick={() => handleMoveQueueItem('radio', index, 'down')}
                          style={{ border: 'none', background: 'none', cursor: index === radioQueue.length - 1 ? 'not-allowed' : 'pointer', color: index === radioQueue.length - 1 ? '#CCC' : '#555' }}
                          title="Descendre"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_downward</span>
                        </button>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => handleRemoveQueueItem('radio', item.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-accent-color)', marginLeft: '10px' }}
                        title="Retirer"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  ))}

                  {radioQueue.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#88', padding: '20px' }}>La file d'attente est vide.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 'tv-live':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Studio TV Live</h1>
            </div>

            <div className="playout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>
              {/* Column 1: Now Playing & Override */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="now-playing-card">
                  <span className="now-playing-badge">ON AIR</span>
                  <label className="group-title" style={{ padding: 0 }}>En Cours de Lecture</label>
                  <h3 className="now-playing-title">{tvNowPlaying.title}</h3>
                  <div className="now-playing-meta">
                    <span>Durée : {tvNowPlaying.duration}</span>
                    <span>Restant : {tvNowPlaying.remaining}</span>
                  </div>
                  <div className="progress-bar-container" style={{ height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${tvNowPlaying.progress}%` }} />
                  </div>
                  
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      className="btn-drawer secondary" 
                      onClick={() => setTvNowPlaying({ title: "Loop Visuelle Spéciale Mode", duration: "10:00", remaining: "10:00", progress: 0 })}
                      style={{ padding: '8px 16px' }}
                    >
                      Sauter le média
                    </button>
                  </div>
                </div>

                {/* Override switch block */}
                <div className="playout-override-block">
                  <div className="override-header">
                    <div>
                      <span className="override-title">Bypass Auto-Playlist</span>
                      <p className="override-desc">Forcer le flux de diffusion externe RTMP en direct.</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={tvOverride}
                        onChange={(e) => setTvOverride(e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  {tvOverride && (
                    <div className="rtmp-keys-box">
                      <div className="rtmp-key-row">
                        <label>URL du Serveur RTMP</label>
                        <div className="rtmp-key-input-group">
                          <input 
                            type="text" 
                            readOnly 
                            className="rtmp-input" 
                            value="rtmp://live.dona-magazine.com/tv" 
                          />
                          <button 
                            type="button" 
                            className="btn-rtmp-copy"
                            onClick={() => { navigator.clipboard.writeText("rtmp://live.dona-magazine.com/tv"); alert("URL copiée !"); }}
                          >
                            Copier
                          </button>
                        </div>
                      </div>
                      <div className="rtmp-key-row">
                        <label>Clé de stream (Stream Key)</label>
                        <div className="rtmp-key-input-group">
                          <input 
                            type="password" 
                            readOnly 
                            className="rtmp-input" 
                            value="dona_tv_key_prod_3728f1" 
                          />
                          <button 
                            type="button" 
                            className="btn-rtmp-copy"
                            onClick={() => { navigator.clipboard.writeText("dona_tv_key_prod_3728f1"); alert("Clé copiée !"); }}
                          >
                            Copier
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Playout Queue */}
              <div className="table-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="table-title" style={{ margin: 0 }}>File d'attente (Playlist Auto)</h3>
                  <button 
                    type="button" 
                    className="btn-admin-action primary"
                    onClick={() => { setPlayoutTarget('tv'); setIsPlayoutDrawerOpen(true); }}
                    style={{ padding: '8px 16px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    Ajouter
                  </button>
                </div>

                <div className="playout-queue-list">
                  {tvQueue.map((item, index) => (
                    <div key={item.id} className="playout-queue-item">
                      <span className="material-symbols-outlined drag-handle">drag_indicator</span>
                      
                      <div className="queue-item-details">
                        <span className="queue-item-title">{item.title}</span>
                        <div className="queue-item-meta">
                          <span>Format : {item.format}</span>
                          <span>Durée : {item.duration}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveQueueItem('tv', index, 'up')}
                          style={{ border: 'none', background: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? '#CCC' : '#555' }}
                          title="Monter"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_upward</span>
                        </button>
                        <button 
                          type="button"
                          disabled={index === tvQueue.length - 1}
                          onClick={() => handleMoveQueueItem('tv', index, 'down')}
                          style={{ border: 'none', background: 'none', cursor: index === tvQueue.length - 1 ? 'not-allowed' : 'pointer', color: index === tvQueue.length - 1 ? '#CCC' : '#555' }}
                          title="Descendre"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_downward</span>
                        </button>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => handleRemoveQueueItem('tv', item.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-accent-color)', marginLeft: '10px' }}
                        title="Retirer"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  ))}

                  {tvQueue.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#88', padding: '20px' }}>La file d'attente est vide.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 'replays':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Archives & Rediffusions (Replays)</h1>
              <button 
                className="btn-admin-action primary" 
                onClick={() => { setSelectedReplay(null); setIsReplayDrawerOpen(true); }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
                + Importer un Replay
              </button>
            </div>

            <div className="table-card" style={{ marginTop: '20px' }}>
              <div className="table-header">
                <h2 className="table-title">Répertoire des Enregistrements Live</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre du Replay</th>
                    <th>Date de diffusion</th>
                    <th>Durée</th>
                    <th>Format</th>
                    <th>Niveau d'accès</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {replays.map((rep) => (
                    <tr key={rep.id}>
                      <td className="cell-bold">{rep.title}</td>
                      <td>{rep.date}</td>
                      <td style={{ fontFamily: 'monospace' }}>{rep.duration}</td>
                      <td>
                        <span className={`badge ${rep.format === 'Audio' ? 'draft' : 'published'}`} style={{ color: rep.format === 'Audio' ? '#A30626' : '#1E3A8A', backgroundColor: rep.format === 'Audio' ? '#FFF0F2' : '#EFF6FF' }}>
                          {rep.format}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${rep.accessLevel === 'VIP' ? 'vip' : 'published'}`} style={{ background: rep.accessLevel === 'VIP' ? 'var(--admin-accent-color)' : '#E1F8EB', color: rep.accessLevel === 'VIP' ? '#FFFFFF' : '#03543F' }}>
                          {rep.accessLevel}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            onClick={() => { setSelectedReplay(rep); setIsReplayDrawerOpen(true); }} 
                            className="table-action-btn"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                          >
                            Éditer
                          </button>
                          <span className="table-action-divider">|</span>
                          <button 
                            onClick={() => handlePublishReplayAsArticle(rep)} 
                            className="table-action-btn"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'green', fontWeight: '600' }}
                          >
                            Publier l'Article
                          </button>
                          <span className="table-action-divider">|</span>
                          <button 
                            onClick={() => handleDeleteReplay(rep.id)} 
                            className="table-action-btn secondary"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', color: 'var(--admin-accent-color)' }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {replays.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#888888', fontStyle: 'italic' }}>
                        Aucune rediffusion enregistrée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'plans':
        return (
          <>
            <div className="dashboard-title-row">
              <h1>Gestion des Abonnements (Plans & Paywall)</h1>
            </div>

            {/* Pricing Tiers Manager Section */}
            <div style={{ marginTop: '20px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', fontStyle: 'italic', marginBottom: '16px' }}>
                Offres & Niveaux d'Adhésion
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {subscriptionPlans.map((plan) => (
                  <div key={plan.id} className="table-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                    {plan.name === 'Premium' && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '16px', 
                        right: '16px', 
                        fontSize: '9px', 
                        fontWeight: '700', 
                        letterSpacing: '0.05em', 
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        backgroundColor: 'var(--admin-accent-color)',
                        padding: '3px 8px',
                        borderRadius: '1px'
                      }}>
                        Le Plus Choisi
                      </span>
                    )}

                    <div>
                      <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '20px', fontWeight: '700', color: 'var(--admin-text-color)', margin: '0 0 8px' }}>
                        {plan.name}
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'var(--admin-text-color)' }}>
                            {plan.priceMonthly.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '14px', color: 'var(--admin-text-muted)', fontWeight: '600' }}>
                            {plan.currency} / mois
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                          <span>Facturé {plan.priceAnnually.toFixed(2)} {plan.currency} / an</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '8px' }}>
                        Avantages Inclus
                      </label>
                      <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '13px', color: '#555555', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {plan.features.map((feat, index) => (
                          <li key={index} style={{ listStyleType: 'square' }}>{feat}</li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      type="button" 
                      className="btn-drawer secondary"
                      onClick={() => { setSelectedPlan(plan); setIsPlanDrawerOpen(true); }}
                      style={{ width: '100%', padding: '10px', marginTop: '12px' }}
                    >
                      Éditer le Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Paywall Settings Section */}
            <div className="table-card" style={{ marginTop: '30px', padding: '30px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '22px', fontStyle: 'italic', marginBottom: '16px' }}>
                Configuration du Paywall Restrictif
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
                  <div className="drawer-input-group">
                    <label htmlFor="paywall-text">Texte d'appel à l'action paywall</label>
                    <textarea 
                      id="paywall-text"
                      className="drawer-textarea" 
                      value={paywallText}
                      onChange={(e) => setPaywallText(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="drawer-input-group">
                    <label htmlFor="paywall-target-tier">Niveau d'accès requis pour déverrouiller (VIP)</label>
                    <div className="select-wrapper">
                      <select
                        id="paywall-target-tier"
                        className="drawer-select"
                        value={paywallTargetTier}
                        onChange={(e) => setPaywallTargetTier(e.target.value)}
                      >
                        <option value="Premium">Premium</option>
                        <option value="Élite">Élite</option>
                      </select>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                      Les abonnés détenant ce niveau d'offre ou supérieur auront accès aux articles restreints.
                    </p>
                  </div>
                </div>

                <div className="drawer-input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="paywall-depth">Profondeur de déclenchement du Paywall</label>
                    <span className="badge vip" style={{ backgroundColor: 'var(--admin-accent-color)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '1px', fontSize: '11px', fontWeight: '600' }}>
                      Couper à {paywallDepth}% du texte
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '600' }}>10% (Restreint)</span>
                    <input 
                      id="paywall-depth"
                      type="range" 
                      min="10" 
                      max="90" 
                      step="5"
                      value={paywallDepth} 
                      onChange={(e) => setPaywallDepth(parseInt(e.target.value))}
                      style={{ flexGrow: 1, accentColor: 'var(--admin-accent-color)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '600' }}>90% (Permissif)</span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    Détermine l'endroit précis où le lettrage de l'article se floute et demande l'adhésion pour les lecteurs non autorisés.
                  </p>
                </div>

                <button 
                  type="button" 
                  className="btn-drawer primary" 
                  style={{ alignSelf: 'flex-start', marginTop: '10px' }} 
                  onClick={handleSavePaywall}
                >
                  Mettre à jour la configuration
                </button>
              </div>
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

      {/* Slide-over Video Drawer */}
      <VideoDrawer
        isOpen={isVideoDrawerOpen}
        onClose={() => setIsVideoDrawerOpen(false)}
        onSave={handleSaveVideo}
        video={selectedVideo}
      />

      {/* Slide-over Podcast Drawer */}
      <PodcastDrawer
        isOpen={isPodcastDrawerOpen}
        onClose={() => setIsPodcastDrawerOpen(false)}
        onSave={handleSavePodcast}
        podcast={selectedPodcast}
      />

      {/* Playout Queue Scheduler Drawer */}
      <PlayoutDrawer
        isOpen={isPlayoutDrawerOpen}
        onClose={() => setIsPlayoutDrawerOpen(false)}
        onAdd={handleAddToPlayoutQueue}
        targetType={playoutTarget}
        dbArticles={articles}
      />

      {/* Slide-over Dossier Drawer */}
      <DossierDrawer
        isOpen={isDossierDrawerOpen}
        onClose={() => setIsDossierDrawerOpen(false)}
        onSave={handleSaveDossier}
        articles={articles}
        dossier={selectedDossier}
      />

      {/* Slide-over Replay Drawer */}
      <ReplayDrawer
        isOpen={isReplayDrawerOpen}
        onClose={() => setIsReplayDrawerOpen(false)}
        onSave={handleSaveReplay}
        replay={selectedReplay}
      />

      {/* Slide-over Plan Drawer */}
      <PlanDrawer
        isOpen={isPlanDrawerOpen}
        onClose={() => setIsPlanDrawerOpen(false)}
        onSave={handleSavePlan}
        plan={selectedPlan}
      />

      {/* Slide-over Member Drawer */}
      <MemberDrawer
        isOpen={isMemberDrawerOpen}
        onClose={() => setIsMemberDrawerOpen(false)}
        onSave={handleSaveMember}
        member={selectedMember}
      />
    </>
  );
}

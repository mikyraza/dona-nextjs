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

const TRANSLATIONS = {
  FR: {
    nav_home: "À LA UNE",
    nav_magazines: "MAGAZINES",
    nav_espace_lecture: "ESPACE LECTURE",
    nav_studio: "STUDIO",
    nav_ecouter: "ÉCOUTER",
    nav_today: "TODAY",
    nav_jeux: "JEUX",
    nav_club: "LE CLUB",
    nav_abonnement: "ABONNEMENT",
    search: "Recherche",
    login: "Connexion",
    my_space: "Mon Espace",
    logout: "Déconnexion",
    admin_portal: "Portail Admin",
    subscribe: "S'ABONNER",
    footer_tagline: "Le magazine d'intelligence, d'architecture et du leadership contemporain.",
    all_rights: "Tous droits réservés.",
    paywall_title: "Accès Réservé aux Abonnés",
    paywall_desc: "Ce contenu est réservé aux membres privilèges du Cercle DONA.",
    continue_reading: "Commencer la lecture"
  },
  EN: {
    nav_home: "FEATURED",
    nav_magazines: "MAGAZINES",
    nav_espace_lecture: "READING HUB",
    nav_studio: "STUDIO",
    nav_ecouter: "LISTEN",
    nav_today: "TODAY",
    nav_jeux: "GAMES",
    nav_club: "THE CLUB",
    nav_abonnement: "SUBSCRIBE",
    search: "Search",
    login: "Sign In",
    my_space: "My Space",
    logout: "Sign Out",
    admin_portal: "Admin Portal",
    subscribe: "SUBSCRIBE",
    footer_tagline: "The magazine of intelligence, architecture, and contemporary leadership.",
    all_rights: "All rights reserved.",
    paywall_title: "Subscriber Exclusive Content",
    paywall_desc: "This content is exclusively available to DONA Circle privilege members.",
    continue_reading: "Start Reading"
  },
  SW: {
    nav_home: "KIPENGELE",
    nav_magazines: "MAGAZETI",
    nav_espace_lecture: "KITUO CHA KUSOMA",
    nav_studio: "STUDIO",
    nav_ecouter: "SIKILIZA",
    nav_today: "LEO",
    nav_jeux: "MICHEZO",
    nav_club: "KLABU",
    nav_abonnement: "JIUNGE",
    search: "Tafuta",
    login: "Ingia",
    my_space: "Eneo Langu",
    logout: "Toka",
    admin_portal: "Tovuti ya Utawala",
    subscribe: "JIUNGE SASA",
    footer_tagline: "Jarida la akili, usanifu, na uongozi wa kisasa.",
    all_rights: "Haki zote zimehifadhiwa.",
    paywall_title: "Maudhui ya Wanachama Pekee",
    paywall_desc: "Maudhui haya ni kwa ajili ya wanachama wa Klabu ya DONA.",
    continue_reading: "Aza Kusoma"
  },
  ES: {
    nav_home: "PORTADA",
    nav_magazines: "REVISTAS",
    nav_espace_lecture: "ESPACIO DE LECTURA",
    nav_studio: "ESTUDIO",
    nav_ecouter: "ESCUCHAR",
    nav_today: "HOY",
    nav_jeux: "JUEGOS",
    nav_club: "EL CLUB",
    nav_abonnement: "SUSCRIBIRSE",
    search: "Buscar",
    login: "Iniciar Sesión",
    my_space: "Mi Espacio",
    logout: "Cerrar Sesión",
    admin_portal: "Portal Admin",
    subscribe: "SUSCRIBIRSE",
    footer_tagline: "La revista de inteligencia, arquitectura y liderazgo contemporáneo.",
    all_rights: "Todos los derechos reservados.",
    paywall_title: "Acceso Reservado a Suscriptores",
    paywall_desc: "Este contenido es exclusivo para los miembros del Club DONA.",
    continue_reading: "Comenzar Lectura"
  },
  PT: {
    nav_home: "DESTAQUE",
    nav_magazines: "REVISTAS",
    nav_espace_lecture: "ESPAÇO DE LEITURA",
    nav_studio: "ESTÚDIO",
    nav_ecouter: "OUVIR",
    nav_today: "HOJE",
    nav_jeux: "JOGOS",
    nav_club: "O CLUBE",
    nav_abonnement: "SUBSCREVER",
    search: "Pesquisar",
    login: "Entrar",
    my_space: "Meu Espaço",
    logout: "Sair",
    admin_portal: "Portal Admin",
    subscribe: "SUBSCREVER",
    footer_tagline: "A revista de inteligência, arquitetura e liderança contemporânea.",
    all_rights: "Todos os direitos reservados.",
    paywall_title: "Acesso Reservado a Subscritores",
    paywall_desc: "Este conteúdo é exclusivo para os membros do Clube DONA.",
    continue_reading: "Iniciar Leitura"
  },
  DE: {
    nav_home: "TITELSEITE",
    nav_magazines: "MAGAZINE",
    nav_espace_lecture: "LESEBEREICH",
    nav_studio: "STUDIO",
    nav_ecouter: "HÖREN",
    nav_today: "HEUTE",
    nav_jeux: "SPIELE",
    nav_club: "DER CLUB",
    nav_abonnement: "ABONNIEREN",
    search: "Suche",
    login: "Anmelden",
    my_space: "Mein Bereich",
    logout: "Abmelden",
    admin_portal: "Admin Portal",
    subscribe: "ABONNIEREN",
    footer_tagline: "Das Magazin für Intelligenz, Architektur und zeitgenössische Führung.",
    all_rights: "Alle Rechte vorbehalten.",
    paywall_title: "Nur für Abonnenten",
    paywall_desc: "Dieser Inhalt ist exklusiv für Mitglieder des DONA Clubs zugänglich.",
    continue_reading: "Lesen Starten"
  },
  IT: {
    nav_home: "IN EVIDENZA",
    nav_magazines: "RIVISTE",
    nav_espace_lecture: "SPAZIO LETTURA",
    nav_studio: "STUDIO",
    nav_ecouter: "ASCOLTA",
    nav_today: "OGGI",
    nav_jeux: "GIOCHI",
    nav_club: "IL CLUB",
    nav_abonnement: "ABBONATI",
    search: "Cerca",
    login: "Accedi",
    my_space: "Il Mio Spazio",
    logout: "Esci",
    admin_portal: "Portale Admin",
    subscribe: "ABBONATI",
    footer_tagline: "La rivista di intelligenza, architettura e leadership contemporanea.",
    all_rights: "Tutti i diritti riservati.",
    paywall_title: "Contenuto Esclusivo per Abbonati",
    paywall_desc: "Questo contenuto è riservato ai membri del Club DONA.",
    continue_reading: "Inizia la Lettura"
  },
  AR: {
    nav_home: "الأخبار الرئيسية",
    nav_magazines: "المجلات",
    nav_espace_lecture: "مساحة القراءة",
    nav_studio: "الاستوديو",
    nav_ecouter: "استمع",
    nav_today: "اليوم",
    nav_jeux: "الألعاب",
    nav_club: "النادِي",
    nav_abonnement: "الاشتراك",
    search: "بحث",
    login: "تسجيل الدخول",
    my_space: "مساحتي الخاصة",
    logout: "تسجيل الخروج",
    admin_portal: "بوابة الإدارة",
    subscribe: "اشترك الآن",
    footer_tagline: "مجلة الذكاء والهندسة المعمارية والقيادة المعاصرة.",
    all_rights: "جميع الحقوق محفوظة.",
    paywall_title: "محتوى حصري للمشتركين",
    paywall_desc: "هذا المحتوى مخصص حصرياً لأعضاء نادي دونا.",
    continue_reading: "ابدأ القراءة"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('FR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('dona_language');
      if (saved && TRANSLATIONS[saved]) {
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

  const changeLanguage = (newLangCode) => {
    if (TRANSLATIONS[newLangCode]) {
      setLang(newLangCode);
    }
  };

  const t = (key) => {
    const currentDict = TRANSLATIONS[lang] || TRANSLATIONS.FR;
    return currentDict[key] || TRANSLATIONS.FR[key] || key;
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
    // Fallback if rendered outside provider
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

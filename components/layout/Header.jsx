'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { getActiveUserSubscription } from '@/lib/subscriptionPermissions';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeDark, setIsThemeDark] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hubData, setHubData] = useState({ liveTv: null, featuredVideo: null });
  const timeoutRef = useRef(null);
  const headerRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { lang, changeLanguage, t, currentLangObj, LANGUAGES } = useLanguage();

  const syncHeaderUser = () => {
    const activeSub = getActiveUserSubscription();
    if (session?.user || (!activeSub.isGuest && activeSub.email)) {
      const allowedAdminRoles = ["Super-Admin", "Éditeur", "Journaliste", "Traducteur"];
      const role = session?.user?.role || activeSub.role || "USER";
      setUserProfile({
        name: session?.user?.name || activeSub.name || activeSub.email?.split('@')[0] || "Membre",
        email: session?.user?.email || activeSub.email || "membre@dona.com",
        plan: activeSub.plan || "Essentiel",
        role: role,
        isAdmin: allowedAdminRoles.includes(role) || role.toLowerCase().includes("admin")
      });
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    syncHeaderUser();
    window.addEventListener('dona_subscription_changed', syncHeaderUser);
    window.addEventListener('storage', syncHeaderUser);
    return () => {
      window.removeEventListener('dona_subscription_changed', syncHeaderUser);
      window.removeEventListener('storage', syncHeaderUser);
    };
  }, [session, authStatus]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('dona_member_profile');
      window.dispatchEvent(new Event('dona_subscription_changed'));
    } catch (e) {}
    signOut({ callbackUrl: '/' });
  };

  // Load video hub data for the Studio Mega Menu
  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const featured = data.videos.find(v => v.isFeatured) || data.videos[0];
          setHubData({ liveTv: data.liveTv, featuredVideo: featured });
        }
      })
      .catch(err => console.error("Failed to fetch hub data", err));
  }, []);

  // Initialize theme from document element attribute
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    setIsThemeDark(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    closeAllMenus();
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = !isThemeDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dona-theme', newTheme);
    setIsThemeDark(!isThemeDark);
  };

  const toggleMenu = (menuId, targetHref, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // If clicking an already open menu, navigate directly to that page
    if (activeMenu === menuId && targetHref) {
      closeAllMenus();
      router.push(targetHref);
      return;
    }
    setActiveMenu((prev) => (prev === menuId ? null : menuId));
  };

  const closeAllMenus = () => {
    setActiveMenu(null);
    setIsLangOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    closeAllMenus();
  };

  // Close menus on click outside or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeAllMenus();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAllMenus();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Determine if a nav item should show the active highlight
  const isItemActive = (menuId, routeMatch) => {
    if (activeMenu !== null) {
      return activeMenu === menuId;
    }
    return Boolean(routeMatch);
  };

  return (
    <header className="site-header" ref={headerRef} onMouseLeave={closeAllMenus}>
      <div className="container header-inner">
        {/* Logo */}
        <Link href="/" className="header-logo" aria-label="Page d'accueil" onClick={closeAllMenus}>
          <img src="/assets/core/img/logo.png?v=3" alt="DONA Magazine" className="logo-image" />
        </Link>

        {/* Main Navigation */}
        <nav className="main-nav">
          <ul className="nav-list">
            <li className={`nav-item ${isItemActive(null, pathname === '/today' || pathname?.startsWith('/today')) ? 'active' : ''}`}>
              <Link href="/today" className="nav-link" onClick={closeAllMenus} onMouseEnter={closeAllMenus}>TODAY</Link>
            </li>
            <li className={`nav-item has-submenu ${activeMenu === 'magazines' ? 'submenu-active' : ''} ${isItemActive('magazines', pathname?.startsWith('/magazines') || pathname?.startsWith('/magazine-')) ? 'active' : ''}`}>
              <Link 
                href="/magazines"
                className="nav-link"
                onClick={closeAllMenus}
                onMouseEnter={() => setActiveMenu('magazines')}
              >
                NOS MAGAZINES
              </Link>
            </li>
            <li className={`nav-item has-submenu ${activeMenu === 'studio' ? 'submenu-active' : ''} ${isItemActive('studio', pathname === '/studio' || pathname?.startsWith('/studio')) ? 'active' : ''}`}>
              <Link 
                href="/studio"
                className="nav-link"
                onClick={closeAllMenus}
                onMouseEnter={() => setActiveMenu('studio')}
              >
                STUDIO
              </Link>
            </li>
            <li className={`nav-item has-submenu ${activeMenu === 'club' ? 'submenu-active' : ''} ${isItemActive('club', pathname === '/club' || pathname?.startsWith('/club')) ? 'active' : ''}`}>
              <Link 
                href="/club"
                className="nav-link"
                onClick={closeAllMenus}
                onMouseEnter={() => setActiveMenu('club')}
              >
                CLUB
              </Link>
            </li>
            <li className={`nav-item has-submenu ${activeMenu === 'ecouter' ? 'submenu-active' : ''} ${isItemActive('ecouter', pathname?.startsWith('/ecouter')) ? 'active' : ''}`}>
              <Link 
                href="/ecouter"
                className="nav-link"
                onClick={closeAllMenus}
              >
                ÉCOUTER
              </Link>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          <Link href="/search" className="btn-icon" aria-label="Recherche" onClick={closeAllMenus}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>

          <div style={{ position: 'relative' }}>
            <button 
              className="btn-icon" 
              aria-label="Langue" 
              id="lang-trigger"
              onClick={() => setIsLangOpen(!isLangOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}
            >
              <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'var(--font-primary)' }}>{currentLangObj.code}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </button>

            {isLangOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                padding: '6px 0',
                minWidth: '170px',
                zIndex: 2500,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      changeLanguage(l.code);
                      setIsLangOpen(false);
                    }}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: lang === l.code ? '700' : '500',
                      color: lang === l.code ? 'var(--color-accent)' : 'var(--color-text)',
                      background: lang === l.code ? 'rgba(163, 6, 38, 0.06)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ fontSize: '15px' }}>{l.flag}</span>
                    <span>{l.name}</span>
                    {lang === l.code && <span className="material-symbols-outlined" style={{ fontSize: '14px', marginLeft: 'auto', color: 'var(--color-accent)' }}>check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            id="theme-toggle" 
            className="btn-icon theme-toggle" 
            aria-label="Mode sombre/clair"
            onClick={toggleTheme}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          
          {userProfile ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  background: 'rgba(163, 6, 38, 0.08)',
                  border: '1px solid rgba(163, 6, 38, 0.25)',
                  color: 'var(--color-text)',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-accent)' }}>account_circle</span>
                <span style={{ textTransform: 'uppercase' }}>{userProfile.name}</span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: '800',
                  background: 'var(--color-accent)',
                  color: '#FFF',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}>
                  {userProfile.plan.toUpperCase()}
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {isUserMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  padding: '8px 0',
                  minWidth: '220px',
                  zIndex: 2000,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text)' }}>{userProfile.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{userProfile.email}</div>
                  </div>

                  <Link
                    href="/member-profile"
                    onClick={() => { setIsUserMenuOpen(false); closeAllMenus(); }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
                    Mon Espace Membre
                  </Link>

                  <Link
                    href="/espace-lecture"
                    onClick={() => { setIsUserMenuOpen(false); closeAllMenus(); }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>auto_stories</span>
                    Mon Espace Lecture
                  </Link>

                  <Link
                    href="/abonnement"
                    onClick={() => { setIsUserMenuOpen(false); closeAllMenus(); }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>stars</span>
                    Offre : {userProfile.plan}
                  </Link>

                  {userProfile.isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => { setIsUserMenuOpen(false); closeAllMenus(); }}
                      style={{
                        padding: '10px 16px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderTop: '1px solid var(--color-border)'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>admin_panel_settings</span>
                      Portail Administration
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      padding: '10px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#C81E1E',
                      background: 'none',
                      border: 'none',
                      borderTop: '1px solid var(--color-border)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
                    Se Déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="account-link" onClick={closeAllMenus}>SE CONNECTER</Link>
              <Link href="/abonnement" className="btn-subscribe" onClick={closeAllMenus}>S'INSCRIRE / S'ABONNER</Link>
            </>
          )}

          {/* ── Hamburger (mobile only) ── */}
          <button
            className="hamburger-btn"
            aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <span className={`ham-bar ham-bar--top${isMobileOpen ? ' open' : ''}`} />
            <span className={`ham-bar ham-bar--mid${isMobileOpen ? ' open' : ''}`} />
            <span className={`ham-bar ham-bar--bot${isMobileOpen ? ' open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mega Menu Panel: Magazines */}
      <div 
        id="mega-menu-magazines" 
        className={`mega-menu-panel ${activeMenu === 'magazines' ? 'open' : ''}`}
      >
        <div className="container mega-menu-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--color-text)' }}>LES 16 UNIVERS DONA</span>
            <Link href="/magazines" onClick={closeAllMenus} style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              VOIR TOUS LES MAGAZINES <span style={{ fontSize: '14px' }}>→</span>
            </Link>
          </div>
          <div className="megamenu-grid">
            {/* Col 1 */}
            <div className="megamenu-col">
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-01-intelligence" onClick={closeAllMenus}><span className="bullet">■</span> 01. Intelligence</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-01-intelligence#articles" onClick={closeAllMenus}>La brève</Link></li>
                  <li><Link href="/magazines/magazine-01-intelligence#articles" onClick={closeAllMenus}>Le pouls</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-07-academie" onClick={closeAllMenus}><span className="bullet">■</span> 07. Académie</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-07-academie#articles" onClick={closeAllMenus}>Parcours professionnel</Link></li>
                  <li><Link href="/magazines/magazine-07-academie#articles" onClick={closeAllMenus}>Compétences</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-13-amour" onClick={closeAllMenus}><span className="bullet">■</span> 13. Amour</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-13-amour#articles" onClick={closeAllMenus}>Parcours professionnel</Link></li>
                  <li><Link href="/magazines/magazine-13-amour#articles" onClick={closeAllMenus}>Compétences</Link></li>
                </ul>
              </div>
            </div>
            {/* Col 2 */}
            <div className="megamenu-col">
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-02-power-lab" onClick={closeAllMenus}><span className="bullet">■</span> 02. Power Lab</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-02-power-lab#articles" onClick={closeAllMenus}>Magazines d'exercices</Link></li>
                  <li><Link href="/magazines/magazine-02-power-lab#articles" onClick={closeAllMenus}>La chambre forte</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-08-patrimoine" onClick={closeAllMenus}><span className="bullet">■</span> 08. Patrimoine</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-08-patrimoine#articles" onClick={closeAllMenus}>Richesse</Link></li>
                  <li><Link href="/magazines/magazine-08-patrimoine#articles" onClick={closeAllMenus}>L'héritage</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-14-beaute" onClick={closeAllMenus}><span className="bullet">■</span> 14. Beauté</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-14-beaute#articles" onClick={closeAllMenus}>Richesse</Link></li>
                  <li><Link href="/magazines/magazine-14-beaute#articles" onClick={closeAllMenus}>L'héritage</Link></li>
                </ul>
              </div>
            </div>
            {/* Col 3 */}
            <div className="megamenu-col">
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-03-alliance" onClick={closeAllMenus}><span className="bullet">■</span> 03. L'Alliance</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-03-alliance#articles" onClick={closeAllMenus}>Le pont</Link></li>
                  <li><Link href="/magazines/magazine-03-alliance#articles" onClick={closeAllMenus}>Annuaire</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-09-longevity" onClick={closeAllMenus}><span className="bullet">■</span> 09. Longevity</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-09-longevity#articles" onClick={closeAllMenus}>Bio-piratage</Link></li>
                  <li><Link href="/magazines/magazine-09-longevity#articles" onClick={closeAllMenus}>Neuro-Gym</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-15-mariages" onClick={closeAllMenus}><span className="bullet">■</span> 15. Mariages</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-15-mariages#articles" onClick={closeAllMenus}>Bio-piratage</Link></li>
                  <li><Link href="/magazines/magazine-15-mariages#articles" onClick={closeAllMenus}>Neuro-Gym</Link></li>
                </ul>
              </div>
            </div>
            {/* Col 4 */}
            <div className="megamenu-col">
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-04-agenda" onClick={closeAllMenus}><span className="bullet">■</span> 04. L'Agenda</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-04-agenda#articles" onClick={closeAllMenus}>Global Cal</Link></li>
                  <li><Link href="/magazines/magazine-04-agenda#articles" onClick={closeAllMenus}>Événements de Dona</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-10-impact" onClick={closeAllMenus}><span className="bullet">■</span> 10. Impact</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-10-impact#articles" onClick={closeAllMenus}>Laboratoire d'éthique</Link></li>
                  <li><Link href="/magazines/magazine-10-impact#articles" onClick={closeAllMenus}>Causes</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-16-sante" onClick={closeAllMenus}><span className="bullet">■</span> 16. Santé</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-16-sante#articles" onClick={closeAllMenus}>Laboratoire d'éthique</Link></li>
                  <li><Link href="/magazines/magazine-16-sante#articles" onClick={closeAllMenus}>Causes</Link></li>
                </ul>
              </div>
            </div>
            {/* Col 5 */}
            <div className="megamenu-col">
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-05-passions" onClick={closeAllMenus}><span className="bullet">■</span> 05. Passions</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-05-passions#articles" onClick={closeAllMenus}>Connexions</Link></li>
                  <li><Link href="/magazines/magazine-05-passions#articles" onClick={closeAllMenus}>Nature</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-11-culture-medias" onClick={closeAllMenus}><span className="bullet">■</span> 11. Culture & Médias</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-11-culture-medias#articles" onClick={closeAllMenus}>L'éditorial</Link></li>
                  <li><Link href="/magazines/magazine-11-culture-medias#articles" onClick={closeAllMenus}>Radiodiffusion</Link></li>
                </ul>
              </div>
            </div>
            {/* Col 6 */}
            <div className="megamenu-col">
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-06-art-de-vivre" onClick={closeAllMenus}><span className="bullet">■</span> 06. Art de Vivre</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-06-art-de-vivre#articles" onClick={closeAllMenus}>Les grands voyages</Link></li>
                  <li><Link href="/magazines/magazine-06-art-de-vivre#articles" onClick={closeAllMenus}>La suite</Link></li>
                </ul>
              </div>
              <div className="megamenu-group">
                <h3 className="megamenu-title">
                  <Link href="/magazines/magazine-12-cercle" onClick={closeAllMenus}><span className="bullet">■</span> 12. Le Cercle</Link>
                </h3>
                <ul className="megamenu-links">
                  <li><Link href="/magazines/magazine-12-cercle#articles" onClick={closeAllMenus}>Le Forum</Link></li>
                  <li><Link href="/magazines/magazine-12-cercle#articles" onClick={closeAllMenus}>La vitrine</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Featured Banner */}
          <div className="megamenu-featured">
            <div className="featured-img-container">
              <img src="/assets/core/img/mega-menu-featured.png" alt="Featured Article Gallery" className="featured-img" />
            </div>
            <div className="featured-content">
              <blockquote className="featured-quote">
                "L'architecture doit parler de son temps<br />
                et de son lieu, mais aspirer à<br />
                l'intemporalité."
              </blockquote>
              <div className="featured-meta">
                <div className="meta-author-info">
                  <span className="meta-label">TEXTE PAR</span>
                  <span className="meta-author">Alessandra Rossi</span>
                </div>
                <Link href="/magazines/magazine-01-intelligence" className="featured-link" onClick={closeAllMenus}>LIRE LE RÉCIT</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Panel: Studio */}
      <div 
        id="mega-menu-studio" 
        className={`mega-menu-panel ${activeMenu === 'studio' ? 'open' : ''}`}
      >
        <div className="mega-menu-inner studio-menu-inner">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--color-text)' }}>ESPACE STUDIO MULTIMÉDIA</span>
              <Link href="/studio" onClick={closeAllMenus} style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                ACCÉDER À TOUT LE STUDIO <span style={{ fontSize: '14px' }}>→</span>
              </Link>
            </div>
            <div className="studio-menu-grid">
              {/* Colonne 1: Navigation Audio/Video */}
              <div className="studio-col-nav">
                <span className="studio-section-title">MULTIMEDIA VIDEO HUB</span>
                <ul className="studio-links-list">
                  <li><Link href="/studio" className="studio-link" onClick={closeAllMenus}>TV en Direct <span className="studio-live-dot"></span></Link></li>
                  <li><Link href="/studio" className="studio-link" onClick={closeAllMenus}>VOD : À la Une</Link></li>
                  <li><Link href="/studio" className="studio-link" onClick={closeAllMenus}>Dernières Sorties</Link></li>
                  <li><Link href="/studio" className="studio-link" onClick={closeAllMenus}>Par Catégories</Link></li>
                  <li><Link href="/studio" className="studio-link" onClick={closeAllMenus}>Replays (Exclusif VIP)</Link></li>
                </ul>
                <div className="studio-live-card">
                  {hubData.liveTv?.isLive ? (
                    <span className="live-badge"><span className="pulse-dot"></span> EN DIRECT</span>
                  ) : (
                    <span className="live-badge" style={{ background: 'transparent', color: 'inherit', border: '1px solid var(--color-border)' }}>HORS ANTENNE</span>
                  )}
                  <h4 className="live-title">{hubData.liveTv?.currentTitle || 'Dona TV Live — Hub Premium'}</h4>
                  <Link href="/studio" className="live-action" onClick={closeAllMenus}>Rejoindre la diffusion</Link>
                </div>
              </div>

              {/* Colonne 2: Vidéo Feature (Center) */}
              <div className="studio-col-video">
                <span className="studio-section-title">À LA UNE</span>
                <Link href="/studio" className="studio-video-card" onClick={closeAllMenus}>
                  <div className="studio-video-img-container">
                    <img src={hubData.featuredVideo?.thumbnailUrl || "/assets/core/img/ecouter-1.png"} alt="Featured Video" className="studio-video-img" />
                    <div className="studio-video-overlay">
                      <div className="play-btn-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M8 5v14l11-7z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                    <span className="studio-video-duration">{hubData.featuredVideo?.duration || 'VIDÉO • HD'}</span>
                  </div>
                  <div className="studio-video-info">
                    <h3 className="studio-video-title">{hubData.featuredVideo?.title || 'Chargement...'}</h3>
                    <p className="studio-video-desc">{hubData.featuredVideo?.subtitle || 'Veuillez patienter'}</p>
                  </div>
                </Link>
              </div>

              {/* Colonne 3: Podcasts (Right) */}
              <div className="studio-col-podcast">
                <span className="studio-section-title">LES PODCASTS</span>
                
                {/* The Brief Card */}
                <div className="studio-podcast-card main-podcast">
                  <img src="/assets/core/img/studio-podcast-brief.png" alt="The Brief" className="podcast-cover" />
                  <div className="podcast-info">
                    <h4 className="podcast-title">The Brief : L'Analyse Hebdomadaire</h4>
                    <Link href="/studio" className="btn-listen-podcast" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }} onClick={closeAllMenus}>Écouter le dernier épisode</Link>
                  </div>
                </div>

                <div className="studio-podcast-grid">
                  <Link href="/studio" className="studio-podcast-card secondary-podcast" style={{ textDecoration: 'none', color: 'inherit' }} onClick={closeAllMenus}>
                    <img src="/assets/core/img/studio-podcast-chronique.png" alt="Chronique" className="podcast-cover" />
                    <div className="podcast-info">
                      <h4 className="podcast-title">Chroniques d'Avenir</h4>
                      <span className="podcast-meta">12 ÉPISODES</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Panel: Club */}
      <div 
        id="mega-menu-club" 
        className={`mega-menu-panel ${activeMenu === 'club' ? 'open' : ''}`}
      >
        <div className="container mega-menu-inner club-menu-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--color-text)' }}>LE DONA CLUB EXCLUSIF</span>
            <Link href="/club" onClick={closeAllMenus} style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ACCÉDER À LA PAGE DU CLUB <span style={{ fontSize: '14px' }}>→</span>
            </Link>
          </div>
          <div className="club-menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {/* Left Column: Connection */}
            <div className="club-col-left">
              <div className="club-connection-box">
                <h2 className="club-title">Le Club <span className="dona-accent">DONA</span></h2>
                <p className="club-desc">Accédez à l'exceptionnel. Un espace dédié à la curation architecturale et aux privilèges exclusifs.</p>
                
                <div className="club-action-group">
                  <span className="club-label">DÉJÀ MEMBRE ?</span>
                  <Link href="/login" className="club-action-link" onClick={closeAllMenus}>
                    <span className="action-text">Connexion</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="action-arrow">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
                
                <div className="club-action-group password-reset">
                  <span className="club-label">MOT DE PASSE OUBLIÉ ?</span>
                  <Link href="/abonnement" className="club-reset-link" onClick={closeAllMenus}>Réinitialiser</Link>
                </div>
              </div>
            </div>

            {/* Middle Column: Offers & Member Space */}
            <div className="club-col-middle">
              {/* Section 1: Offers */}
              <div className="club-section">
                <h4 className="club-section-title">OFFRES / ABONNEMENT</h4>
                <div className="club-offers-list">
                  {/* Premium Offer */}
                  <div className="club-offer-item">
                    <div className="offer-icon premium-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="12 8 13.09 11.36 16.59 11.36 13.75 13.43 14.84 16.79 12 14.73 9.16 16.79 10.25 13.43 7.41 11.36 10.91 11.36 12 8"></polygon>
                      </svg>
                    </div>
                    <div className="offer-details">
                      <h5 className="offer-title">Abonnement Annuel Premium</h5>
                      <p className="offer-desc">L'expérience totale : print, digital & événements privés.</p>
                      <Link href="/abonnement" className="offer-link" onClick={closeAllMenus}>EN SAVOIR PLUS <span className="arrow">→</span></Link>
                    </div>
                  </div>
                  {/* Digital Only Offer */}
                  <div className="club-offer-item">
                    <div className="offer-icon digital-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                      </svg>
                    </div>
                    <div className="offer-details">
                      <h5 className="offer-title">Digital Only</h5>
                      <p className="offer-desc">Accès illimité aux archives et aux contenus Studio.</p>
                      <Link href="/abonnement" className="offer-link link-secondary" onClick={closeAllMenus}>DÉTAILS DE L'OFFRE <span className="arrow">→</span></Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Member Space */}
              <div className="club-section space-section">
                <h4 className="club-section-title">ESPACE MEMBRE</h4>
                <ul className="club-member-grid">
                  <li><Link href="/member-profile" className="member-grid-link" onClick={closeAllMenus}>Mon Tableau de bord</Link></li>
                  <li><Link href="/espace-lecture" className="member-grid-link" onClick={closeAllMenus}>Mes Favoris & Lectures</Link></li>
                  <li><Link href="/member-profile" className="member-grid-link" onClick={closeAllMenus}>Historique des commandes</Link></li>
                  <li><Link href="/member-profile" className="member-grid-link" onClick={closeAllMenus}>Gérer mon profil</Link></li>
                </ul>
              </div>
            </div>

            {/* Right Column: Promo Banner */}
            <div className="club-col-right">
              <div className="club-promo-banner">
                <div className="promo-bg-container">
                  <img src="/assets/core/img/club-promo.png" alt="Rejoindre la communauté" className="promo-bg-img" />
                </div>
                <div className="promo-content">
                  <span className="promo-subtitle">Rejoindre la communauté</span>
                  <div className="promo-background-text">SAFE WORK</div>
                  <Link href="/abonnement" className="btn-club-subscribe" onClick={closeAllMenus}>INSCRIPTION AU CLUB</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Panel: Ecouter */}
      <div 
        id="mega-menu-ecouter" 
        className={`mega-menu-panel ${activeMenu === 'ecouter' ? 'open' : ''}`}
      >
        <div className="container mega-menu-inner ecouter-menu-inner">
          {/* Top Header of Menu */}
          <div className="ecouter-menu-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 className="ecouter-header-title" style={{ margin: 0 }}>Hub Écouter l'article</h3>
              <span className="live-tag">LIVE NOW</span>
            </div>
            <Link href="/ecouter" onClick={closeAllMenus} style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ACCÉDER AU HUB ÉCOUTER <span style={{ fontSize: '14px' }}>→</span>
            </Link>
          </div>

          <div className="ecouter-menu-grid">
            {/* Left Column (Featured Content) */}
            <div className="ecouter-col-left">
              <Link href="/ecouter" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} onClick={closeAllMenus}>
                <div className="ecouter-featured-card">
                  <div className="ecouter-featured-img-container">
                    <img src="/assets/core/img/featured-audio.png" alt="Featured Audio" className="ecouter-featured-img" />
                    <div className="audio-play-overlay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                  <div className="ecouter-featured-meta">LONG READ • 24 MIN</div>
                  <h4 className="ecouter-featured-title">L’Architecture du Silence : Une immersion sonore dans le Brutalisme.</h4>
                </div>
              </Link>
            </div>

            {/* Middle Column (À SUIVRE / Up Next) */}
            <div className="ecouter-col-middle">
              <div className="ecouter-section-header">
                <h4 className="ecouter-section-title">À SUIVRE</h4>
                <Link href="/ecouter" className="ecouter-view-all" onClick={closeAllMenus}>TOUT VOIR</Link>
              </div>
              <div className="ecouter-playlist">
                {/* Item 1 */}
                <Link href="/ecouter" className="playlist-item" style={{ textDecoration: 'none', color: 'inherit' }} onClick={closeAllMenus}>
                  <img src="/assets/core/img/audio-thumb-1.png" alt="Le Manifeste du Monochrome" className="playlist-thumb" />
                  <div className="playlist-details">
                    <h5 className="playlist-title">Le Manifeste du Monochrome</h5>
                    <span className="playlist-meta">12 MIN • NARRÉ PAR JULIANNE V.</span>
                  </div>
                  <button type="button" className="playlist-play-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                </Link>
                {/* Item 2 */}
                <Link href="/ecouter" className="playlist-item" style={{ textDecoration: 'none', color: 'inherit' }} onClick={closeAllMenus}>
                  <div className="playlist-thumb graphic-thumb thumb-black">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </div>
                  <div className="playlist-details">
                    <h5 className="playlist-title">Rythme et Rigueur : L'Éditorialisme</h5>
                    <span className="playlist-meta">08 MIN • STUDIO DONA</span>
                  </div>
                  <button type="button" className="playlist-play-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                </Link>
                {/* Item 3 */}
                <Link href="/ecouter" className="playlist-item" style={{ textDecoration: 'none', color: 'inherit' }} onClick={closeAllMenus}>
                  <div className="playlist-thumb graphic-thumb thumb-pink">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                    </svg>
                  </div>
                  <div className="playlist-details">
                    <h5 className="playlist-title">Podcasts : La Voix des Créateurs</h5>
                    <span className="playlist-meta">SAISON 3 • ÉPISODE 12</span>
                  </div>
                  <button type="button" className="playlist-play-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column (Explorer les Formats & DONA CLUB) */}
            <div className="ecouter-col-right">
              <div className="formats-section">
                <h4 className="ecouter-section-title">EXPLORER LES FORMATS</h4>
                <ul className="formats-list">
                  <li><Link href="/ecouter" className="format-link" onClick={closeAllMenus}>Grands Formats Audio</Link></li>
                  <li><Link href="/ecouter" className="format-link" onClick={closeAllMenus}>Conversations DONA</Link></li>
                  <li><Link href="/ecouter" className="format-link" onClick={closeAllMenus}>Lectures Littéraires</Link></li>
                  <li><Link href="/ecouter" className="format-link" onClick={closeAllMenus}>Critiques d'Art (Voix)</Link></li>
                  <li><Link href="/ecouter" className="format-link" onClick={closeAllMenus}>Archives Sonores</Link></li>
                </ul>
              </div>
              
              {/* DONA Club CTA Card */}
              <div className="dona-club-card">
                <div className="dona-club-card-header">
                  <div className="club-card-star">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <span className="club-card-title">DONA CLUB</span>
                </div>
                <p className="club-card-desc">Accédez à l'intégralité de nos archives audio et contenus exclusifs en rejoignant le Club.</p>
                <Link href="/abonnement" className="btn-club-card" onClick={closeAllMenus}>DEVENIR MEMBRE</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE FULL-SCREEN DRAWER
      ═══════════════════════════════════════════ */}
      <div
        className={`mobile-drawer${isMobileOpen ? ' mobile-drawer--open' : ''}`}
        aria-hidden={!isMobileOpen}
        role="dialog"
        aria-label="Menu principal"
      >
        {/* Close button */}
        <button className="mobile-drawer-close" onClick={closeMobileMenu} aria-label="Fermer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="mobile-drawer-logo" onClick={closeMobileMenu}>
          <img src="/assets/core/img/logo.png?v=3" alt="DONA Magazine" />
        </Link>

        {/* Nav links */}
        <nav className="mobile-drawer-nav" aria-label="Navigation principale">
          <Link href="/today"        className="mobile-nav-link" onClick={closeMobileMenu}>TODAY</Link>
          <Link href="/magazines"    className="mobile-nav-link" onClick={closeMobileMenu}>NOS MAGAZINES</Link>
          <Link href="/studio"       className="mobile-nav-link" onClick={closeMobileMenu}>STUDIO</Link>
          <Link href="/club"         className="mobile-nav-link" onClick={closeMobileMenu}>CLUB</Link>
          <Link href="/ecouter"      className="mobile-nav-link" onClick={closeMobileMenu}>ÉCOUTER</Link>
        </nav>

        {/* Auxiliary Controls (Moved from header bar to prevent clutter) */}
        <div className="mobile-drawer-controls">
          <Link href="/search" className="mobile-control-item" onClick={closeMobileMenu}>
            <span className="material-symbols-outlined">search</span>
            <span>Rechercher</span>
          </Link>
          <button className="mobile-control-item" onClick={() => { toggleTheme(); closeMobileMenu(); }}>
            <span className="material-symbols-outlined">{isThemeDark ? 'light_mode' : 'dark_mode'}</span>
            <span>{isThemeDark ? 'Mode Clair' : 'Mode Sombre'}</span>
          </button>
          <div className="mobile-lang-selector">
            <span className="lang-label">LANGUE</span>
            <button className="mobile-lang-btn active">FR</button>
            <span className="lang-sep">|</span>
            <button className="mobile-lang-btn">EN</button>
          </div>
        </div>

        {/* Divider */}
        <div className="mobile-drawer-divider" />

        {/* Bottom actions */}
        <div className="mobile-drawer-actions">
          <Link href="/member-profile" className="mobile-compte-link" onClick={closeMobileMenu}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
            MON COMPTE
          </Link>
          <Link href="/abonnement" className="mobile-subscribe-btn" onClick={closeMobileMenu}>
            S'INSCRIRE / S'ABONNER
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileOpen && (
        <div className="mobile-backdrop" onClick={closeMobileMenu} aria-hidden="true" />
      )}

      {/* ═══════════════════════════════════════════
          RESPONSIVE CSS
      ═══════════════════════════════════════════ */}
      <style>{`
        /* ── Hamburger button ── */
        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          flex-shrink: 0;
        }
        .ham-bar {
          display: block;
          width: 22px;
          height: 1.5px;
          background: var(--color-text);
          border-radius: 2px;
          transition: transform 0.35s cubic-bezier(0.77,0,0.18,1),
                      opacity   0.25s ease,
                      width     0.3s ease;
          transform-origin: center;
        }
        .ham-bar--top.open  { transform: translateY(6.5px) rotate(45deg); }
        .ham-bar--mid.open  { opacity: 0; width: 0; }
        .ham-bar--bot.open  { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .mobile-drawer {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: var(--color-bg);
          display: flex;
          flex-direction: column;
          padding: 28px 32px 48px;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
          overflow-y: auto;
        }
        .mobile-drawer--open {
          transform: translateX(0);
        }
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(2px);
        }
        .mobile-drawer-close {
          align-self: flex-end;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }
        .mobile-drawer-close:hover { color: #A30626; }
        .mobile-drawer-logo {
          display: block;
          width: 120px;
          margin: 20px 0 32px;
        }
        .mobile-drawer-logo img {
          width: 100%;
          height: auto;
        }
        .mobile-drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .mobile-nav-link {
          font-family: var(--font-secondary, 'Playfair Display', serif);
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--color-text);
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid var(--color-border, #E5E7EB);
          transition: color 0.25s ease, padding-left 0.25s ease;
          display: block;
        }
        .mobile-nav-link:hover {
          color: #A30626;
          padding-left: 8px;
        }

        /* ── Auxiliary Controls inside Drawer ── */
        .mobile-drawer-controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 32px;
        }
        .mobile-control-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-primary, 'Inter', sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
          text-decoration: none;
          background: none;
          border: none;
          padding: 10px 0;
          cursor: pointer;
          text-align: left;
          width: 100%;
        }
        .mobile-control-item span {
          transition: color 0.25s ease;
        }
        .mobile-control-item:hover span {
          color: #A30626;
        }
        .mobile-lang-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          font-family: var(--font-primary, 'Inter', sans-serif);
        }
        .lang-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-muted, #6B7280);
          letter-spacing: 0.05em;
        }
        .mobile-lang-btn {
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 400;
          color: var(--color-text-muted, #6B7280);
          cursor: pointer;
          padding: 2px 6px;
        }
        .mobile-lang-btn.active {
          font-weight: 700;
          color: var(--color-text, #111111);
        }
        .lang-sep {
          color: var(--color-border, #E5E7EB);
        }

        .mobile-drawer-divider {
          height: 1px;
          background: var(--color-border, #E5E7EB);
          margin: 24px 0;
        }
        .mobile-drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mobile-compte-link {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-primary, 'Inter', sans-serif);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted, #6B7280);
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .mobile-compte-link:hover { color: var(--color-text); }
        .mobile-subscribe-btn {
          display: block;
          background: #A30626;
          color: #FFFFFF;
          text-align: center;
          padding: 16px 24px;
          font-family: var(--font-primary, 'Inter', sans-serif);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          transition: background 0.25s ease;
        }
        .mobile-subscribe-btn:hover { background: #8c0520; }

        /* ── Breakpoint: hide desktop nav, show hamburger ── */
        @media (max-width: 1024px) {
          .main-nav        { display: none !important; }
          .btn-subscribe   { display: none !important; }
          .account-link    { display: none !important; }
          .hamburger-btn   { display: flex !important; }
          /* Hide other desktop icons from header bar */
          .header-actions > .btn-icon { display: none !important; }
        }
        @media (min-width: 1025px) {
          .hamburger-btn   { display: none !important; }
          .mobile-drawer   { display: none !important; }
          .mobile-backdrop { display: none !important; }
        }
      `}</style>
    </header>
  );
}

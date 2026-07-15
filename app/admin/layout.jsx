"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, SessionProvider, useSession } from 'next-auth/react';
import '../../styles/admin.css';

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <AdminInnerLayout>{children}</AdminInnerLayout>
    </SessionProvider>
  );
}

function AdminInnerLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  // Bypasser le layout pour la page de connexion administrative
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Helper function to check if a navigation route is currently active
  const isActiveRoute = (route) => {
    if (route === '/admin') {
      return pathname === '/admin' || pathname === '/admin/dashboard';
    }
    return pathname.startsWith(route);
  };

  return (
    <div className="admin-layout-wrapper">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/assets/core/img/logo.png" 
            alt="DONA Logo" 
            style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
          />
          <span className="logo-text" style={{ fontSize: '11px', letterSpacing: '0.15em', fontWeight: '700', color: '#111111' }}>ADMIN</span>
        </div>

        <nav className="admin-sidebar-nav">
          {/* Main Dashboard item */}
          <div className="nav-group">
            <Link 
              href="/admin/dashboard" 
              className={`nav-item ${isActiveRoute('/admin') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
          </div>

          {/* CONTENU Group */}
          <div className="nav-group">
            <span className="group-title">Contenu</span>
            <Link 
              href="/admin/articles" 
              className={`nav-item ${isActiveRoute('/admin/articles') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">description</span>
              Articles
            </Link>
            <Link 
              href="/admin/videos" 
              className={`nav-item ${isActiveRoute('/admin/videos') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">videocam</span>
              Vidéos
            </Link>
            <Link 
              href="/admin/podcasts" 
              className={`nav-item ${isActiveRoute('/admin/podcasts') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">mic</span>
              Podcasts
            </Link>
            <Link 
              href="/admin/dossiers" 
              className={`nav-item ${isActiveRoute('/admin/dossiers') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">folder</span>
              Dossiers
            </Link>
          </div>

          {/* TAXONOMIE Group */}
          <div className="nav-group">
            <span className="group-title">Taxonomie</span>
            <Link 
              href="/admin/tags" 
              className={`nav-item ${isActiveRoute('/admin/tags') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">sell</span>
              Tags & Thèmes
            </Link>
            <Link 
              href="/admin/rubriques" 
              className={`nav-item ${isActiveRoute('/admin/rubriques') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">category</span>
              Rubriques
            </Link>
          </div>

          {/* STUDIO / LIVE Group */}
          <div className="nav-group">
            <span className="group-title">Studio / Live</span>
            <Link 
              href="/admin/radio-live" 
              className={`nav-item ${isActiveRoute('/admin/radio-live') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">radio</span>
              Radio Live
            </Link>
            <Link 
              href="/admin/tv-live" 
              className={`nav-item ${isActiveRoute('/admin/tv-live') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">live_tv</span>
              TV Live
            </Link>
            <Link 
              href="/admin/replays" 
              className={`nav-item ${isActiveRoute('/admin/replays') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">replay</span>
              Replays
            </Link>
          </div>

          {/* CLUB Group */}
          <div className="nav-group">
            <span className="group-title">Club</span>
            {session?.user?.role === "Super-Admin" && (
              <Link 
                href="/admin/plans" 
                className={`nav-item ${isActiveRoute('/admin/plans') ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined">payments</span>
                Plans & Paywall
              </Link>
            )}
            <Link 
              href="/admin/membres" 
              className={`nav-item ${isActiveRoute('/admin/membres') ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">group</span>
              Membres
            </Link>
          </div>

          {/* SETTINGS Group */}
          <div className="nav-group">
            <span className="group-title">Settings</span>
            {session?.user?.role === "Super-Admin" ? (
              <>
                <Link 
                  href="/admin/settings/brand" 
                  className={`nav-item ${isActiveRoute('/admin/settings/brand') ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined">palette</span>
                  Brand
                </Link>
                <Link 
                  href="/admin/settings/seo" 
                  className={`nav-item ${isActiveRoute('/admin/settings/seo') ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined">search</span>
                  SEO
                </Link>
                <Link 
                  href="/admin/settings/navigation" 
                  className={`nav-item ${isActiveRoute('/admin/settings/navigation') ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined">menu</span>
                  Navigation
                </Link>
                <Link 
                  href="/admin/settings/langues" 
                  className={`nav-item ${isActiveRoute('/admin/settings/langues') ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined">language</span>
                  Langues (i18n)
                </Link>
                <Link 
                  href="/admin/utilisateurs" 
                  className={`nav-item ${isActiveRoute('/admin/utilisateurs') ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Utilisateurs
                </Link>
              </>
            ) : (
              <div style={{ padding: '8px 16px', fontSize: '11px', color: '#888888', fontStyle: 'italic' }}>
                Accès restreint aux paramètres
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Panel Area */}
      <div className="admin-main-container">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <span className="topbar-title">Dashboard</span>
          </div>

          <div className="topbar-right">
            <button className="topbar-btn" aria-label="Recherche">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="topbar-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notif-badge"></span>
            </button>
            
            <div className="user-block-wrapper">
              <div className="user-block" onClick={() => setShowDropdown(!showDropdown)}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '8px' }}>
                  <span className="user-name" style={{ fontSize: '13px', fontWeight: '600' }}>
                    {session?.user?.name || "Elena Moretti"}
                  </span>
                  <span className="user-role" style={{ fontSize: '10px', color: '#888888', fontWeight: '500' }}>
                    {session?.user?.role || "Super-Admin"}
                  </span>
                </div>
                <img 
                  src="/assets/core/img/avatar-1.png" 
                  alt="Avatar" 
                  className="user-avatar"
                />
                <span className="material-symbols-outlined">
                  {showDropdown ? 'expand_less' : 'expand_more'}
                </span>
              </div>
              
              {showDropdown && (
                <div className="user-dropdown">
                  <Link 
                    href="/admin/settings/brand" 
                    className="user-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>settings</span>
                    Configuration
                  </Link>
                  <div className="user-dropdown-divider"></div>
                  <button 
                    className="user-dropdown-item" 
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    style={{ color: '#A30626' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="admin-content-pane">
          {children}
        </main>

        {/* Admin Footer */}
        <footer className="admin-footer">
          <div>
            © 2024 DONA Media Group — V2.0.4
          </div>
          <div className="footer-links">
            <a href="#docs">Documentation</a>
            <a href="#support">Support</a>
            <a href="#api">API</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import UserDrawer from '../components/UserDrawer';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setErrorMessage(data.error || "Impossible de charger les utilisateurs.");
      }
    } catch (err) {
      console.error('Failed to fetch team users:', err);
      setErrorMessage("Erreur de connexion avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showFeedback = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: data.user.status } : u));
        showFeedback(`Statut mis à jour: ${data.user.status}`);
      } else {
        showError(data.error || "Erreur lors de la mise à jour du statut.");
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
      showError("Erreur réseau lors de la mise à jour.");
    }
  };

  const handleSaveUser = async (savedUser) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedUser)
      });
      const data = await res.json();
      if (data.success && data.user) {
        const exists = users.some(u => u.id === data.user.id || u.email === data.user.email);
        if (exists) {
          setUsers(prev => prev.map(u => (u.id === data.user.id || u.email === data.user.email) ? data.user : u));
        } else {
          setUsers(prev => [data.user, ...prev]);
        }
        showFeedback(`Utilisateur "${data.user.name}" enregistré avec succès dans la base de données !`);
      } else {
        showError(data.error || "Erreur lors de l'enregistrement de l'utilisateur.");
      }
    } catch (err) {
      console.error('Failed to save user:', err);
      showError("Erreur réseau lors de l'enregistrement.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer cet utilisateur de l'équipe administrative ?")) {
      try {
        const res = await fetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          showFeedback("Utilisateur retiré de l'équipe et de la base de données.");
        } else {
          showError(data.error || "Erreur lors de la suppression.");
        }
      } catch (err) {
        console.error('Failed to delete user:', err);
        showError("Erreur réseau lors de la suppression.");
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Super-Admin':
        return { backgroundColor: '#1C1C1C', color: '#D4AF37', border: '1px solid #D4AF37', fontWeight: '700' };
      case 'Éditeur':
        return { backgroundColor: '#A30626', color: '#FFFFFF', fontWeight: '600' };
      case 'Journaliste':
        return { backgroundColor: '#E6F0FA', color: '#1A5276', fontWeight: '600' };
      case 'Traducteur':
        return { backgroundColor: '#F2F2F2', color: '#555555', fontWeight: '600' };
      default:
        return { backgroundColor: '#E5E7EB', color: '#374151' };
    }
  };

  return (
    <div suppressHydrationWarning>
      <div className="dashboard-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }} suppressHydrationWarning>
        <div>
          <h1 style={{ margin: 0 }}>Utilisateurs de l'Administration</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            Synchronisé directement avec la base relationnelle et XAMPP MySQL.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href="/api/admin/export-db"
            download="dona_database_export.sql"
            className="btn-drawer secondary"
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', padding: '10px 16px', fontSize: '13px' }}
            title="Télécharger le fichier SQL complet pour phpMyAdmin / XAMPP"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Exporter SQL (XAMPP)
          </a>
          <button 
            type="button" 
            className="btn-drawer primary" 
            onClick={handleAddUser}
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span className="material-symbols-outlined">person_add</span>
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      {notification && (
        <div style={{
          marginTop: '16px',
          padding: '12px 18px',
          backgroundColor: '#ECFDF5',
          border: '1px solid #10B981',
          borderRadius: '4px',
          color: '#065F46',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10B981' }}>check_circle</span>
          {notification}
        </div>
      )}

      {errorMessage && (
        <div style={{
          marginTop: '16px',
          padding: '12px 18px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #EF4444',
          borderRadius: '4px',
          color: '#991B1B',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#EF4444' }}>error</span>
          {errorMessage}
        </div>
      )}

      {/* Filter Row */}
      <div className="table-card" style={{ marginTop: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flexGrow: 1, position: 'relative', minWidth: '280px' }}>
            <input 
              type="text" 
              className="drawer-text-input" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom complet ou email..."
              style={{ margin: 0, paddingLeft: '36px' }}
            />
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--admin-text-muted)' }}>
              search
            </span>
          </div>

          <div className="select-wrapper" style={{ width: '220px' }}>
            <select 
              className="drawer-select" 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ height: '40px' }}
            >
              <option value="all">Tous les rôles</option>
              <option value="Super-Admin">Super-Admin</option>
              <option value="Éditeur">Éditeur / Édimestre</option>
              <option value="Journaliste">Journaliste</option>
              <option value="Traducteur">Traducteur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Table */}
      <div className="table-card" style={{ marginTop: '20px' }}>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom Complet</th>
                <th>Email</th>
                <th>Rôle de Sécurité</th>
                <th>Statut</th>
                <th>Dernière Connexion</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--admin-text-muted)' }}>
                    Chargement des utilisateurs depuis la base de données...
                  </td>
                </tr>
              )}
              {!loading && filteredUsers.map((user) => (
                <tr key={user.id || user.email}>
                  <td style={{ fontWeight: '600', color: 'var(--admin-text-color)' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span 
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'inline-block',
                        ...getRoleBadgeStyle(user.role)
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span 
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: user.status === 'Actif' ? '#10B981' : '#EF4444',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: '500', color: user.status === 'Actif' ? '#10B981' : '#EF4444' }}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                    {user.lastLogin || user.last_login || 'Jamais connecté'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        type="button"
                        className="btn-drawer secondary"
                        onClick={() => handleEditUser(user)}
                        style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}
                      >
                        Modifier
                      </button>
                      <button 
                        type="button"
                        className="btn-drawer secondary"
                        onClick={() => handleToggleStatus(user.id)}
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '12px', 
                          width: 'auto',
                          color: user.status === 'Actif' ? '#EF4444' : '#10B981',
                          borderColor: user.status === 'Actif' ? '#EF4444' : '#10B981',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {user.status === 'Actif' ? 'Suspendre' : 'Activer'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ 
                          border: 'none', 
                          background: 'none', 
                          cursor: 'pointer', 
                          color: 'var(--admin-accent-color)', 
                          padding: '0 4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Retirer"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                    Aucun utilisateur trouvé pour ces critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
}


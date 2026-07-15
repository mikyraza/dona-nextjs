"use client";

import React, { useState } from 'react';
import UserDrawer from '../components/UserDrawer';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: "u-1", name: "Elena Moretti", email: "elena@donamagazine.com", role: "Super-Admin", status: "Actif", lastLogin: "15/07/2026 10:14" },
    { id: "u-2", name: "Marc Dubois", email: "marc@donamagazine.com", role: "Éditeur", status: "Actif", lastLogin: "14/07/2026 18:32" },
    { id: "u-3", name: "Sophie Laurent", email: "sophie@donamagazine.com", role: "Journaliste", status: "Actif", lastLogin: "15/07/2026 09:44" },
    { id: "u-4", name: "Ahmed Al-Farsi", email: "ahmed@donamagazine.com", role: "Traducteur", status: "Actif", lastLogin: "12/07/2026 11:20" },
    { id: "u-5", name: "Thomas Bernard", email: "thomas@donamagazine.com", role: "Journaliste", status: "Suspendu", lastLogin: "Jamais connecté" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'Actif' ? 'Suspendu' : 'Actif';
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleSaveUser = (savedUser) => {
    const exists = users.some(u => u.id === savedUser.id);
    if (exists) {
      setUsers(prev => prev.map(u => u.id === savedUser.id ? { ...u, ...savedUser } : u));
    } else {
      setUsers(prev => [
        { ...savedUser, lastLogin: "Jamais connecté" },
        ...prev
      ]);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer cet utilisateur de l'équipe administrative ?")) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
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
    <>
      <div className="dashboard-title-row">
        <h1>Utilisateurs de l'Administration</h1>
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
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
                    {user.lastLogin}
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
              {filteredUsers.length === 0 && (
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
    </>
  );
}

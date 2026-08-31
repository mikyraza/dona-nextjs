"use client";

import React, { useState, useEffect } from 'react';

export default function AdminCandidaturesPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterJob, setFilterJob] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [notificationEmail, setNotificationEmail] = useState('recrutement@donamagazine.com');
  const [emailSaved, setEmailSaved] = useState(false);

  useEffect(() => {
    fetchApplications();
    const storedEmail = localStorage.getItem('dona_notification_recrutement_email');
    if (storedEmail) setNotificationEmail(storedEmail);
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recrutement');
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (e) {
      console.error('Error fetching applications:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => ({ ...prev, status: newStatus }));
    }
  };

  const saveNotificationEmail = (e) => {
    e.preventDefault();
    localStorage.setItem('dona_notification_recrutement_email', notificationEmail);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 3000);
  };

  const filteredApps = applications.filter(a => {
    const matchSearch = (a.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.email || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.jobTarget || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.message || '').toLowerCase().includes(search.toLowerCase());
    const matchJob = filterJob === 'ALL' || a.jobTarget === filterJob;
    return matchSearch && matchJob;
  });

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#8B002A', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            RECRUTEMENT & RESS_HUMAINES
          </span>
          <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: '32px', fontWeight: '700', margin: '0', color: 'var(--color-text)' }}>
            Candidatures & Dépôts de CV ({applications.length})
          </h1>
        </div>

        {/* Notification Email Config Box */}
        <form onSubmit={saveNotificationEmail} style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', padding: '16px 20px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              Email de Redirection Candidatures
            </label>
            <input 
              type="email" 
              value={notificationEmail} 
              onChange={e => setNotificationEmail(e.target.value)} 
              required
              style={{ padding: '8px 12px', fontSize: '13px', border: '1px solid var(--color-border)', borderRadius: '2px', background: 'var(--color-bg)', color: 'var(--color-text)', width: '220px' }} 
            />
          </div>
          <button type="submit" style={{ background: '#8B002A', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '2px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', marginTop: '16px' }}>
            {emailSaved ? '✓ Enregistré' : 'Enregistrer'}
          </button>
        </form>
      </div>

      {/* Controls: Search & Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Rechercher par candidat, email, poste ou mot-clé..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ flex: 1, minWidth: '280px', padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-bg-alt)', color: 'var(--color-text)', fontSize: '14px' }}
        />

        <select 
          value={filterJob} 
          onChange={e => setFilterJob(e.target.value)} 
          style={{ padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-bg-alt)', color: 'var(--color-text)', fontSize: '13px' }}
        >
          <option value="ALL">Tous les postes ({applications.length})</option>
          <option value="spontane">Candidature spontanée</option>
          <option value="journaliste-mode">Journaliste de Mode</option>
          <option value="concepteur-visuel">UX Designer</option>
          <option value="redacteur-culture">Rédacteur Culture</option>
        </select>
      </div>

      {/* Table & Detail View */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1fr 450px' : '1fr', gap: '24px' }}>
        
        {/* Table */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden', background: 'var(--color-bg-alt)' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement des candidatures...</div>
          ) : filteredApps.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucune candidature trouvée.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Réf & Date</th>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Candidat</th>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Poste</th>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Document CV PDF</th>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    style={{ 
                      borderBottom: '1px solid var(--color-border)', 
                      cursor: 'pointer', 
                      background: selectedApp?.id === app.id ? 'rgba(139,0,42,0.05)' : 'transparent' 
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '700', fontFamily: 'monospace', fontSize: '11px' }}>{app.id}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{app.dateFormatted || app.appliedAt?.slice(0, 10)}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{app.fullName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '500', color: 'var(--color-text)' }}>
                      {app.jobTarget}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <a 
                        href={app.cvFilePath} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(139,0,42,0.08)', color: '#8B002A', padding: '6px 12px', borderRadius: '2px', textDecoration: 'none', fontWeight: '700', fontSize: '11px' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>description</span>
                        {app.cvFileName || 'Télécharger CV'}
                      </a>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '2px', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        background: app.status === 'Entretien sélectionné' ? 'rgba(16, 185, 129, 0.15)' : app.status === 'Archivé' ? 'rgba(107, 114, 128, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
                        color: app.status === 'Entretien sélectionné' ? '#10B981' : app.status === 'Archivé' ? '#6B7280' : '#2563EB' 
                      }}>
                        {app.status || 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected App Sidebar Details */}
        {selectedApp && (
          <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8B002A', fontWeight: '700' }}>{selectedApp.id}</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>{selectedApp.fullName}</h3>
              </div>
              <button type="button" onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Coordonnées</div>
              <a href={`mailto:${selectedApp.email}`} style={{ fontSize: '13px', color: '#8B002A', textDecoration: 'underline', display: 'block' }}>{selectedApp.email}</a>
              {selectedApp.phone && <div style={{ fontSize: '13px', color: 'var(--color-text)', marginTop: '2px' }}>Tél : {selectedApp.phone}</div>}
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Poste Ciblé</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>{selectedApp.jobTarget}</div>
            </div>

            {/* Document Download Link */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Fichier CV Téléversé (Serveur)</div>
              <a 
                href={selectedApp.cvFilePath} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#8B002A', color: '#fff', padding: '12px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                Ouvrir / Télécharger {selectedApp.cvFileName} ({selectedApp.fileSizeMb} Mo)
              </a>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Changer le statut</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['En attente d\'examen', 'Entretien sélectionné', 'Archivé'].map(st => (
                  <button 
                    key={st}
                    type="button" 
                    onClick={() => handleStatusChange(selectedApp.id, st)}
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '2px', 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      border: '1px solid var(--color-border)', 
                      cursor: 'pointer',
                      background: selectedApp.status === st ? '#8B002A' : 'transparent',
                      color: selectedApp.status === st ? '#fff' : 'var(--color-text)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {selectedApp.message && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Message de motivation</div>
                <div style={{ background: 'var(--color-bg-alt)', padding: '16px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '13px', lineHeight: '1.6', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                  {selectedApp.message}
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <a 
                href={`mailto:${selectedApp.email}?subject=Candidature DONA MAGAZINE - ${encodeURIComponent(selectedApp.jobTarget)}`} 
                style={{ display: 'block', textAlign: 'center', background: '#8B002A', color: '#fff', padding: '12px', borderRadius: '2px', textDecoration: 'none', fontWeight: '700', fontSize: '12px' }}
              >
                Contacter le candidat par Email →
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [notificationEmail, setNotificationEmail] = useState('contact@donamagazine.com');
  const [emailSaved, setEmailSaved] = useState(false);

  useEffect(() => {
    fetchMessages();
    const storedEmail = localStorage.getItem('dona_notification_contact_email');
    if (storedEmail) setNotificationEmail(storedEmail);
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.contacts) {
        setMessages(data.contacts);
      }
    } catch (e) {
      console.error('Error fetching contact messages:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (msgId, newStatus) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: newStatus } : m));
    if (selectedMsg && selectedMsg.id === msgId) {
      setSelectedMsg(prev => ({ ...prev, status: newStatus }));
    }
  };

  const saveNotificationEmail = (e) => {
    e.preventDefault();
    localStorage.setItem('dona_notification_contact_email', notificationEmail);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 3000);
  };

  const filteredMessages = messages.filter(m => {
    const matchSearch = (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
                        (m.subject || '').toLowerCase().includes(search.toLowerCase()) ||
                        (m.message || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#8B002A', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            COMMUNICATION & SUPPORT
          </span>
          <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: '32px', fontWeight: '700', margin: '0', color: 'var(--color-text)' }}>
            Messages de Contact ({messages.length})
          </h1>
        </div>

        {/* Notification Email Config Box */}
        <form onSubmit={saveNotificationEmail} style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', padding: '16px 20px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              Email de Redirection Notifications
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
          placeholder="Rechercher par nom, email, sujet ou mot-clé..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ flex: 1, minWidth: '280px', padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-bg-alt)', color: 'var(--color-text)', fontSize: '14px' }}
        />

        <select 
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value)} 
          style={{ padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-bg-alt)', color: 'var(--color-text)', fontSize: '13px' }}
        >
          <option value="ALL">Tous les statuts ({messages.length})</option>
          <option value="Nouveau">Nouveau ({messages.filter(m => m.status === 'Nouveau').length})</option>
          <option value="En cours">En cours ({messages.filter(m => m.status === 'En cours').length})</option>
          <option value="Traité">Traité ({messages.filter(m => m.status === 'Traité').length})</option>
        </select>
      </div>

      {/* Table & Detail split View */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedMsg ? '1fr 450px' : '1fr', gap: '24px' }}>
        
        {/* Table */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden', background: 'var(--color-bg-alt)' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement des messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucun message trouvé.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Réf & Date</th>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Expéditeur</th>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Sujet</th>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Statut</th>
                  <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr 
                    key={msg.id} 
                    onClick={() => setSelectedMsg(msg)}
                    style={{ 
                      borderBottom: '1px solid var(--color-border)', 
                      cursor: 'pointer', 
                      background: selectedMsg?.id === msg.id ? 'rgba(139,0,42,0.05)' : 'transparent' 
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '700', fontFamily: 'monospace', fontSize: '11px' }}>{msg.id}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{msg.dateFormatted || msg.createdAt?.slice(0, 10)}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{msg.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{msg.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '500', color: 'var(--color-text)' }}>
                      {msg.subject}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '2px', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        background: msg.status === 'Nouveau' ? 'rgba(239, 68, 68, 0.15)' : msg.status === 'En cours' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
                        color: msg.status === 'Nouveau' ? '#EF4444' : msg.status === 'En cours' ? '#D97706' : '#10B981' 
                      }}>
                        {msg.status || 'Nouveau'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedMsg(msg); }} style={{ background: 'none', border: '1px solid var(--color-border)', padding: '6px 12px', borderRadius: '2px', fontSize: '11px', cursor: 'pointer', color: 'var(--color-text)' }}>
                        Consulter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected Message Sidebar Details */}
        {selectedMsg && (
          <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8B002A', fontWeight: '700' }}>{selectedMsg.id}</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>{selectedMsg.subject}</h3>
              </div>
              <button type="button" onClick={() => setSelectedMsg(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Expéditeur</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text)' }}>{selectedMsg.name}</div>
              <a href={`mailto:${selectedMsg.email}`} style={{ fontSize: '13px', color: '#8B002A', textDecoration: 'underline' }}>{selectedMsg.email}</a>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Date d'envoi</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text)' }}>{selectedMsg.dateFormatted || selectedMsg.createdAt}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Changer le statut</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Nouveau', 'En cours', 'Traité'].map(st => (
                  <button 
                    key={st}
                    type="button" 
                    onClick={() => handleStatusChange(selectedMsg.id, st)}
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '2px', 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      border: '1px solid var(--color-border)', 
                      cursor: 'pointer',
                      background: selectedMsg.status === st ? '#8B002A' : 'transparent',
                      color: selectedMsg.status === st ? '#fff' : 'var(--color-text)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Contenu du message</div>
              <div style={{ background: 'var(--color-bg-alt)', padding: '16px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '13px', lineHeight: '1.6', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                {selectedMsg.message}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '12px' }}>
              <a 
                href={`mailto:${selectedMsg.email}?subject=RE: ${encodeURIComponent(selectedMsg.subject)}`} 
                style={{ flex: 1, textAlign: 'center', background: '#8B002A', color: '#fff', padding: '12px', borderRadius: '2px', textDecoration: 'none', fontWeight: '700', fontSize: '12px' }}
              >
                Répondre par Email →
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

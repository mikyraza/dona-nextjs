"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function RecrutementFormContent() {
  const searchParams = useSearchParams();
  const posteParam = searchParams ? searchParams.get('poste') : null;

  const DEFAULT_JOBS = [
    { id: "job-1", title: "Journaliste de Mode & Art de Vivre", posteSlug: "journaliste-mode" },
    { id: "job-2", title: "Concepteur Visuel / UX Designer", posteSlug: "concepteur-visuel" },
    { id: "job-3", title: "Rédacteur Culture & Société", posteSlug: "redacteur-culture" }
  ];

  const [jobs, setJobs] = useState(DEFAULT_JOBS);
  const [selectedPoste, setSelectedPoste] = useState('spontane');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/settings/equipe')
      .then(res => res.json())
      .then(data => {
        if (data && data.rejoignezSettings && data.rejoignezSettings.jobs) {
          setJobs(data.rejoignezSettings.jobs);
        }
      })
      .catch(err => console.error("API load error:", err));

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dona_settings_rejoignez_redaction');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.jobs && parsed.jobs.length > 0) {
            setJobs(parsed.jobs);
          }
        }
      } catch (e) {
        console.error('Error loading jobs in recruitment page:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (posteParam) {
      setSelectedPoste(posteParam);
    }
  }, [posteParam]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        setError('Le fichier dépasse la taille maximale autorisée (15 Mo).');
        setSelectedFile(null);
        setFileInfo(null);
        return;
      }
      setError('');
      setSelectedFile(file);
      setFileInfo({
        name: file.name,
        sizeMb: (file.size / 1024 / 1024).toFixed(2)
      });
    } else {
      setSelectedFile(null);
      setFileInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !selectedFile) {
      setError('Veuillez renseigner votre nom complet, email et téléverser votre fichier CV/Portfolio.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('jobTarget', selectedPoste);
      formData.append('message', message);
      formData.append('file', selectedFile);

      const res = await fetch('/api/recrutement', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors du téléversement de la candidature.');
        setLoading(false);
        return;
      }

      setSubmittedData(data.application);

    } catch (err) {
      console.error('[recrutement] Erreur lors du téléversement:', err);
      setError('Erreur réseau lors du transfert du fichier vers le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recrutement-container">
      <header className="recrutement-header">
        <span style={{fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "600", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B002A", display: "block", marginBottom: "16px"}}>
          RECRUTEMENT & CANDIDATURE
        </span>
        <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "300", lineHeight: "1.2", margin: "0"}}>
          Soumettre votre profil
        </h1>
      </header>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#991B1B', padding: '14px 18px', borderRadius: '4px', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {submittedData ? (
        <div style={{ textAlign: 'center', padding: '48px 32px', background: 'var(--color-bg-alt)', border: '1px solid #8B002A', borderRadius: '6px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📄✨</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#8B002A', marginBottom: '12px' }}>
            Candidature et CV enregistrés avec succès
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 24px auto' }}>
            Merci <strong>{submittedData.fullName}</strong>. Votre dossier et votre document PDF (<em>{submittedData.cvFileName}</em>) ont été téléversés et stockés sur le serveur DONA.
          </p>

          <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '4px', fontSize: '12px', textAlign: 'left', maxWidth: '440px', margin: '0 auto 24px auto', fontFamily: 'monospace' }}>
            <div>Référence dossier : <strong>{submittedData.id}</strong></div>
            <div>Poste ciblé : <strong>{submittedData.jobTarget}</strong></div>
            <div>Fichier serveur : <a href={submittedData.cvFilePath} target="_blank" rel="noopener noreferrer" style={{ color: '#8B002A', textDecoration: 'underline' }}>{submittedData.cvSavedName}</a> ({submittedData.fileSizeMb} Mo)</div>
            <div>Statut : <span style={{ color: '#10B981', fontWeight: 'bold' }}>{submittedData.status}</span></div>
          </div>

          <button 
            type="button" 
            onClick={() => { setSubmittedData(null); setFileInfo(null); setSelectedFile(null); }}
            style={{ background: 'transparent', border: '1px solid #8B002A', color: '#8B002A', padding: '10px 20px', borderRadius: '2px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '600' }}
          >
            Soumettre une autre candidature
          </button>
        </div>
      ) : (
        <form id="recruitment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom complet *</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Ex. Alessandra Rossi" 
            />
          </div>
          
          <div className="form-group" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"}}>
            <div>
              <label className="form-label">Adresse email *</label>
              <input 
                type="email" 
                className="form-input" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ex. alessandra@dona.com" 
              />
            </div>
            <div>
              <label className="form-label">Téléphone</label>
              <input 
                type="tel" 
                className="form-input" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Ex. +33 6 12 34 56 78" 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Poste ciblé</label>
            <select 
              id="poste-select" 
              className="form-input" 
              required 
              value={selectedPoste}
              onChange={(e) => setSelectedPoste(e.target.value)}
              style={{
                appearance: "none", 
                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888888\' strokeWidth=\'2\' strokeLinecap=\'round\' strokeLinejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'></polyline></svg>')", 
                backgroundRepeat: "no-repeat", 
                backgroundPosition: "right 18px center", 
                backgroundSize: "16px"
              }}
            >
              <option value="spontane">Candidature spontanée</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.posteSlug || job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">CV & Portfolio (Fichier PDF/DOCX requis) *</label>
            <div className="drag-drop-zone">
              <input type="file" required id="portfolio-file" accept=".pdf,.doc,.docx,.zip" onChange={handleFileChange} />
              <span style={{fontSize: "32px", display: "block", marginBottom: "12px", color: "#8B002A"}}>📎</span>
              {fileInfo ? (
                <>
                  <span style={{fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px", color: "#8B002A"}}>
                    ✓ Fichier prêt au téléversement : {fileInfo.name}
                  </span>
                  <span style={{fontSize: "11px", color: "#8B002A"}}>
                    Taille : {fileInfo.sizeMb} Mo
                  </span>
                </>
              ) : (
                <>
                  <span style={{fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--color-text)"}}>
                    Glissez votre CV ou cliquez pour parcourir
                  </span>
                  <span style={{fontSize: "11px", color: "var(--color-text-muted)"}}>
                    PDF, DOCX, ZIP jusqu'à 15 Mo (Téléversement serveur)
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Zone de message libre</label>
            <textarea 
              className="form-input" 
              style={{minHeight: "140px", resize: "vertical"}} 
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Partagez-nous votre parcours, votre vision artistique ou vos motivations..."
            ></textarea>
          </div>
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "TÉLÉVERSEMENT DU FICHIER EN COURS..." : "Envoyer la candidature"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        .recrutement-container {
            max-width: 650px;
            margin: 0 auto;
            padding: 0 24px 120px;
        }
        .recrutement-header {
            padding: 120px 0 40px;
            text-align: center;
        }
        .form-group {
            margin-bottom: 24px;
            font-family: 'Inter', sans-serif;
        }
        .form-label {
            display: block;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 10px;
            color: var(--color-text);
        }
        .form-input {
            width: 100%;
            border: 1px solid var(--color-border);
            padding: 16px;
            font-size: 14px;
            background: var(--color-bg-alt);
            color: var(--color-text);
            border-radius: 4px;
            transition: border-color 0.3s, background-color 0.3s;
            font-family: 'Inter', sans-serif;
        }
        .form-input:focus {
            outline: none;
            border-color: #8B002A;
            background: var(--color-bg);
        }
        .drag-drop-zone {
            border: 1px dashed var(--color-border);
            padding: 40px 20px;
            text-align: center;
            border-radius: 4px;
            background: var(--color-bg-alt);
            position: relative;
            cursor: pointer;
            transition: border-color 0.3s, background-color 0.3s;
        }
        .drag-drop-zone:hover {
            border-color: #8B002A;
            background: rgba(139, 0, 42, 0.02);
        }
        .drag-drop-zone input[type="file"] {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
            width: 100%;
            height: 100%;
        }
        .btn-submit {
            display: block;
            width: 100%;
            background: #8B002A;
            color: #FFFFFF;
            border: none;
            padding: 18px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-submit:hover {
            background: #A30031;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 0, 42, 0.15);
        }
      ` }} />

      <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0' }}>Chargement du formulaire...</div>}>
        <RecrutementFormContent />
      </Suspense>
    </main>
  );
}

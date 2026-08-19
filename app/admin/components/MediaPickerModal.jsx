"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function MediaPickerModal({ isOpen, onClose, onSelect }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("library"); // 'library', 'upload', 'url'
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media/list");
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error("Erreur de chargement des médias:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onSelect(data.url);
          onClose();
        } else {
          await fetchMedia();
          setActiveTab("library");
        }
      } else {
        alert("Erreur lors de l'upload");
      }
    } catch (error) {
      alert("Erreur réseau");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlUpload = async (e) => {
    e.preventDefault();
    if (!urlInput) return;

    setUploading(true);
    try {
      const res = await fetch("/api/media/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onSelect(data.url);
        onClose();
      } else {
        alert(`Erreur: ${data.error || "Échec"}`);
      }
    } catch (error) {
      alert("Erreur lors de l'import");
    } finally {
      setUploading(false);
      setUrlInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="media-picker-overlay" onClick={onClose}>
      <div className="media-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="media-picker-header">
          <h2>Médiathèque</h2>
          <button className="media-picker-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="media-picker-tabs">
          <button className={activeTab === "library" ? "active" : ""} onClick={() => setActiveTab("library")}>
            Bibliothèque locale
          </button>
          <button className={activeTab === "upload" ? "active" : ""} onClick={() => setActiveTab("upload")}>
            Envoyer un fichier
          </button>
          <button className={activeTab === "url" ? "active" : ""} onClick={() => setActiveTab("url")}>
            Insérer depuis une URL
          </button>
        </div>

        <div className="media-picker-content">
          {activeTab === "library" && (
            <div className="media-library-grid">
              {loading ? (
                <div className="loading-state">Chargement des médias...</div>
              ) : files.length === 0 ? (
                <div className="empty-state">Aucun média trouvé.</div>
              ) : (
                files.map((file) => (
                  <div key={file.name} className="media-picker-item" onClick={() => { onSelect(file.url); onClose(); }}>
                    <div className="media-thumbnail">
                      {file.type === "image" ? (
                        <Image src={file.url} alt={file.name} fill style={{ objectFit: "cover" }} unoptimized />
                      ) : (
                        <div className="media-icon">
                          <span className="material-symbols-outlined">
                            {file.type === "video" ? "movie" : "description"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "upload" && (
            <div className="media-upload-area">
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ccc" }}>cloud_upload</span>
              <h3>Glissez ou choisissez un fichier</h3>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} />
              <button className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? "Envoi en cours..." : "Parcourir l'ordinateur"}
              </button>
            </div>
          )}

          {activeTab === "url" && (
            <div className="media-url-area">
              <form onSubmit={handleUrlUpload} className="url-form">
                <h3>Ajouter un média depuis un lien externe</h3>
                <p>L'image sera automatiquement téléchargée sur notre serveur.</p>
                <input
                  type="url"
                  placeholder="https://exemple.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary" disabled={uploading || !urlInput}>
                  {uploading ? "Téléchargement..." : "Valider et insérer"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .media-picker-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }
        .media-picker-modal {
          background: #fff;
          width: 90vw;
          max-width: 900px;
          height: 80vh;
          max-height: 700px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }
        .media-picker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #eaeaea;
        }
        .media-picker-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        .media-picker-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
        }
        .media-picker-tabs {
          display: flex;
          border-bottom: 1px solid #eaeaea;
          background: #fafafa;
        }
        .media-picker-tabs button {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: #666;
        }
        .media-picker-tabs button.active {
          color: var(--admin-accent-color);
          border-bottom-color: var(--admin-accent-color);
          background: #fff;
        }
        .media-picker-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          background: #f8fafc;
        }
        .media-library-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }
        .media-picker-item {
          aspect-ratio: 1;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .media-picker-item:hover {
          border-color: var(--admin-accent-color);
          transform: scale(1.02);
        }
        .media-thumbnail {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .media-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: #f1f5f9;
          color: #94a3b8;
        }
        .media-upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          background: #fff;
        }
        .media-url-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .url-form {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fff;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .url-form input {
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}

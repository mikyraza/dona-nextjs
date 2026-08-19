"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function MediaLibraryPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, []);

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

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await fetchMedia();
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.error || "Échec de l'upload"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlUpload = async () => {
    if (!urlInput) return;
    setUploading(true);
    try {
      const res = await fetch("/api/media/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      if (res.ok) {
        await fetchMedia();
        setUrlInput("");
        setShowUrlInput(false);
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.error || "Échec de l'upload depuis l'URL"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName) => {
    if (!confirm("Voulez-vous vraiment supprimer ce fichier ? Cette action est irréversible.")) return;

    try {
      const res = await fetch(`/api/media/delete?fileName=${encodeURIComponent(fileName)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFiles(files.filter(f => f.name !== fileName));
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.error || "Échec de la suppression"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de suppression");
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert("URL copiée dans le presse-papiers !");
  };

  const handleDownload = (url, fileName) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = files.filter(f => {
    if (filter !== "all" && f.type !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="admin-title">Médiathèque</h1>
        <div className="admin-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {showUrlInput && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="URL de l'image..." 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', fontSize: '13px' }}
              />
              <button className="btn-admin-action" onClick={handleUrlUpload} disabled={uploading || !urlInput}>
                Valider
              </button>
              <button className="btn-admin-action" onClick={() => setShowUrlInput(false)} style={{ background: '#eee' }}>
                Annuler
              </button>
            </div>
          )}
          {!showUrlInput && (
            <button 
              className="btn-admin-action" 
              onClick={() => setShowUrlInput(true)}
              style={{ background: '#fff', border: '1px solid #ddd' }}
            >
              <span className="material-symbols-outlined">link</span>
              Depuis une URL
            </button>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            style={{ display: "none" }} 
          />
          <button 
            className="btn-admin-action primary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <span className="material-symbols-outlined">
              {uploading ? "hourglass_empty" : "upload"}
            </span>
            {uploading ? "Upload en cours..." : "Ajouter un fichier"}
          </button>
        </div>
      </div>

      <div className="admin-content" style={{ marginTop: "24px" }}>
        
        {/* Barre de filtres et de recherche */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              className={`filter-badge ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #eee", background: filter === "all" ? "#000" : "#fff", color: filter === "all" ? "#fff" : "#333", cursor: "pointer", fontSize: "13px", fontWeight: "600"
              }}
            >
              Tous
            </button>
            <button 
              className={`filter-badge ${filter === "image" ? "active" : ""}`}
              onClick={() => setFilter("image")}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #eee", background: filter === "image" ? "#000" : "#fff", color: filter === "image" ? "#fff" : "#333", cursor: "pointer", fontSize: "13px", fontWeight: "600"
              }}
            >
              Images
            </button>
            <button 
              className={`filter-badge ${filter === "video" ? "active" : ""}`}
              onClick={() => setFilter("video")}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #eee", background: filter === "video" ? "#000" : "#fff", color: filter === "video" ? "#fff" : "#333", cursor: "pointer", fontSize: "13px", fontWeight: "600"
              }}
            >
              Vidéos
            </button>
            <button 
              className={`filter-badge ${filter === "audio" ? "active" : ""}`}
              onClick={() => setFilter("audio")}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #eee", background: filter === "audio" ? "#000" : "#fff", color: filter === "audio" ? "#fff" : "#333", cursor: "pointer", fontSize: "13px", fontWeight: "600"
              }}
            >
              Audios
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", background: "#f5f5f5", padding: "8px 16px", borderRadius: "20px" }}>
            <span className="material-symbols-outlined" style={{ color: "#888", fontSize: "18px", marginRight: "8px" }}>search</span>
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "200px" }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
            Chargement des médias...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "#f9f9f9", borderRadius: "12px", border: "1px dashed #ddd" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ccc", marginBottom: "16px" }}>perm_media</span>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>Aucun fichier trouvé</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>Commencez par ajouter un fichier multimédia.</p>
            <button 
              className="btn-admin-action primary" 
              onClick={() => fileInputRef.current?.click()}
              style={{ margin: "0 auto" }}
            >
              Ajouter un fichier
            </button>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: "24px" 
          }}>
            {filteredFiles.map((f, i) => (
              <div key={i} style={{ 
                background: "#fff", 
                border: "1px solid #eee", 
                borderRadius: "12px", 
                overflow: "hidden",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
              }}>
                <div style={{ 
                  height: "150px", 
                  background: "#f5f5f5", 
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {f.type === "image" ? (
                    <img src={f.url} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : f.type === "video" ? (
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#aaa" }}>movie</span>
                  ) : f.type === "audio" ? (
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#aaa" }}>audiotrack</span>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#aaa" }}>insert_drive_file</span>
                  )}
                </div>
                
                <div style={{ padding: "12px" }}>
                  <div style={{ 
                    fontSize: "12px", 
                    fontWeight: "600", 
                    color: "#333", 
                    marginBottom: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }} title={f.name}>
                    {f.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888", marginBottom: "12px" }}>
                    {formatSize(f.size)} • {new Date(f.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => copyUrl(f.url)}
                      style={{
                        flex: 1, padding: "6px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "#333", fontWeight: "500"
                      }}
                      title="Copier le lien"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>content_copy</span>
                    </button>
                    <button 
                      onClick={() => handleDownload(f.url, f.name)}
                      style={{
                        flex: 1, padding: "6px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "#333", fontWeight: "500"
                      }}
                      title="Télécharger"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>download</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(f.name)}
                      style={{
                        padding: "6px 12px", background: "#fff0f0", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#d32f2f"
                      }}
                      title="Supprimer"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

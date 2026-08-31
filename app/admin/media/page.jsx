"use client";

import React, { useState, useEffect, useRef } from "react";

export default function MediaLibraryPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Safe Deletion & Orphan Modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [usageData, setUsageData] = useState(null);
  const [checkingUsage, setCheckingUsage] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, itemsPerPage]);

  const showToast = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

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
      showToast("Erreur lors du chargement des médias", "error");
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
        showToast("Fichier importé avec succès !");
      } else {
        const err = await res.json();
        showToast(`Erreur: ${err.error || "Échec de l'upload"}`, "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Erreur réseau lors de l'upload", "error");
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
        showToast("Fichier téléchargé depuis l'URL avec succès !");
      } else {
        const err = await res.json();
        showToast(`Erreur: ${err.error || "Échec de l'import"}`, "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Erreur réseau lors de l'upload", "error");
    } finally {
      setUploading(false);
    }
  };

  // Step 1 of Delete: Check usage in database first
  const initiateDelete = async (file) => {
    setDeleteTarget(file);
    setCheckingUsage(true);
    setUsageData(null);

    try {
      const res = await fetch(`/api/media/usage?url=${encodeURIComponent(file.url)}&fileName=${encodeURIComponent(file.name)}`);
      const data = await res.json();
      if (data.success) {
        setUsageData(data);
      } else {
        setUsageData({ inUse: false, count: 0, usages: [] });
      }
    } catch (e) {
      console.error("Error checking media usage:", e);
      setUsageData({ inUse: false, count: 0, usages: [] });
    } finally {
      setCheckingUsage(false);
    }
  };

  // Step 2 of Delete: Perform deletion with optional fallback protection
  const confirmDelete = async (replaceWithFallback = false, force = false) => {
    if (!deleteTarget) return;

    try {
      const queryParams = new URLSearchParams({
        fileName: deleteTarget.name,
        url: deleteTarget.url,
        replaceFallback: replaceWithFallback ? 'true' : 'false',
        force: force ? 'true' : 'false'
      });

      const res = await fetch(`/api/media/delete?${queryParams.toString()}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFiles(prev => prev.filter(f => f.name !== deleteTarget.name));
        setDeleteTarget(null);
        setUsageData(null);
        showToast(
          replaceWithFallback
            ? `Fichier supprimé. ${data.replacedReferences || 0} lien(s) dans les articles ont été remplacés par l'image de secours pour éviter toute erreur 404.`
            : "Fichier supprimé de la médiathèque."
        );
      } else {
        showToast(`Erreur: ${data.error || "Échec de la suppression"}`, "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Erreur réseau lors de la suppression", "error");
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast("URL copiée dans le presse-papiers !");
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
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Filtering
  const filteredFiles = files.filter(f => {
    if (filter !== "all" && f.type !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Pagination calculation
  const totalItems = filteredFiles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

  return (
    <div className="admin-page-container" suppressHydrationWarning>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 9999,
          background: notification.type === "error" ? "#C53030" : "#1C1C1C",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "13px",
          fontWeight: "500",
          animation: "fadeIn 0.2s ease"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: notification.type === "error" ? "#FEB2B2" : "#D4AF37" }}>
            {notification.type === "error" ? "error" : "check_circle"}
          </span>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Médiathèque</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--admin-text-muted)" }}>
            Gestion centralisée des fichiers avec protection anti-liens brisés (404) et pagination.
          </p>
        </div>
        
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
        
        {/* Filters and Search Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button 
              className={`filter-badge ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #eee", background: filter === "all" ? "#000" : "#fff", color: filter === "all" ? "#fff" : "#333", cursor: "pointer", fontSize: "13px", fontWeight: "600"
              }}
            >
              Tous ({files.length})
            </button>
            <button 
              className={`filter-badge ${filter === "image" ? "active" : ""}`}
              onClick={() => setFilter("image")}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #eee", background: filter === "image" ? "#000" : "#fff", color: filter === "image" ? "#fff" : "#333", cursor: "pointer", fontSize: "13px", fontWeight: "600"
              }}
            >
              Images ({files.filter(f => f.type === 'image').length})
            </button>
            <button 
              className={`filter-badge ${filter === "video" ? "active" : ""}`}
              onClick={() => setFilter("video")}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #eee", background: filter === "video" ? "#000" : "#fff", color: filter === "video" ? "#fff" : "#333", cursor: "pointer", fontSize: "13px", fontWeight: "600"
              }}
            >
              Vidéos ({files.filter(f => f.type === 'video').length})
            </button>
            <button 
              className={`filter-badge ${filter === "audio" ? "active" : ""}`}
              onClick={() => setFilter("audio")}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #eee", background: filter === "audio" ? "#000" : "#fff", color: filter === "audio" ? "#fff" : "#333", cursor: "pointer", fontSize: "13px", fontWeight: "600"
              }}
            >
              Audios ({files.filter(f => f.type === 'audio').length})
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#f5f5f5", padding: "8px 16px", borderRadius: "20px" }}>
              <span className="material-symbols-outlined" style={{ color: "#888", fontSize: "18px", marginRight: "8px" }}>search</span>
              <input 
                type="text" 
                placeholder="Rechercher par nom..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "200px" }}
              />
            </div>

            {/* Items per page selector */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                border: "1px solid #eee",
                background: "#fff",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
            </select>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "36px", animation: "spin 1s linear infinite" }}>refresh</span>
            <p style={{ marginTop: "12px", fontSize: "14px" }}>Chargement des médias...</p>
          </div>
        ) : totalItems === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "#f9f9f9", borderRadius: "12px", border: "1px dashed #ddd" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ccc", marginBottom: "16px" }}>perm_media</span>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>Aucun fichier trouvé</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
              {search ? "Aucun média ne correspond à votre recherche." : "Commencez par ajouter un fichier multimédia."}
            </p>
            <button 
              className="btn-admin-action primary" 
              onClick={() => fileInputRef.current?.click()}
              style={{ margin: "0 auto" }}
            >
              Ajouter un fichier
            </button>
          </div>
        ) : (
          <>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
              gap: "20px" 
            }}>
              {paginatedFiles.map((f, i) => (
                <div key={f.id || i} style={{ 
                  background: "#fff", 
                  border: "1px solid #eee", 
                  borderRadius: "12px", 
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{ 
                    height: "150px", 
                    background: "#f5f5f5", 
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
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
                  
                  <div style={{ padding: "12px", display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-between" }}>
                    <div>
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
                        {formatSize(f.size)} • {f.createdAt ? new Date(f.createdAt).toLocaleDateString('fr-FR') : "Récemment"}
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "6px" }}>
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
                        onClick={() => initiateDelete(f)}
                        style={{
                          padding: "6px 10px", background: "#fff0f0", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#d32f2f"
                        }}
                        title="Supprimer le fichier"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "32px",
              padding: "16px 20px",
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "12px",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              <div style={{ fontSize: "13px", color: "#666" }}>
                Affichage de <strong>{startIndex + 1}</strong> à <strong>{endIndex}</strong> sur <strong>{totalItems}</strong> média(s)
              </div>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={validCurrentPage === 1}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    background: validCurrentPage === 1 ? "#f5f5f5" : "#fff",
                    color: validCurrentPage === 1 ? "#aaa" : "#333",
                    cursor: validCurrentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
                  Précédent
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => {
                  // Show current page, edges, and nearby pages
                  if (totalPages > 7) {
                    if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - validCurrentPage) > 1) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return <span key={pageNum} style={{ padding: "0 4px", color: "#aaa" }}>...</span>;
                      }
                      return null;
                    }
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        minWidth: "32px",
                        height: "32px",
                        borderRadius: "6px",
                        border: pageNum === validCurrentPage ? "1px solid #000" : "1px solid #ddd",
                        background: pageNum === validCurrentPage ? "#000" : "#fff",
                        color: pageNum === validCurrentPage ? "#fff" : "#333",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={validCurrentPage === totalPages}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    background: validCurrentPage === totalPages ? "#f5f5f5" : "#fff",
                    color: validCurrentPage === totalPages ? "#aaa" : "#333",
                    cursor: validCurrentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  Suivant
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Safe Deletion & Orphan Warning Modal */}
      {deleteTarget && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          backdropFilter: "blur(4px)"
        }} onClick={() => setDeleteTarget(null)}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "540px",
            padding: "28px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            animation: "fadeIn 0.2s ease"
          }} onClick={(e) => e.stopPropagation()}>
            
            {checkingUsage ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#888" }}>hourglass_top</span>
                <p style={{ marginTop: "12px", fontSize: "14px", color: "#555" }}>Vérification des liens et articles associés...</p>
              </div>
            ) : usageData && usageData.inUse ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>warning</span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111" }}>
                      Fichier utilisé dans le site
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#666" }}>
                      {deleteTarget.name}
                    </p>
                  </div>
                </div>

                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "14px", marginBottom: "20px", fontSize: "13px", color: "#92400E", lineHeight: "1.5" }}>
                  <strong>Attention :</strong> Cette image est actuellement référencée dans <strong>{usageData.count}</strong> élément(s) éditoriaux. Sa suppression directe provoquera des <strong>liens brisés (erreurs 404)</strong> sur le site public.
                </div>

                <div style={{ marginBottom: "20px", maxHeight: "160px", overflowY: "auto", border: "1px solid #eee", borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#888", marginBottom: "8px" }}>
                    Contenus impactés :
                  </div>
                  {usageData.usages.map((u, idx) => (
                    <div key={idx} style={{ fontSize: "12px", color: "#333", padding: "4px 0", borderBottom: idx < usageData.usages.length - 1 ? "1px solid #f5f5f5" : "none", display: "flex", justifyContent: "space-between" }}>
                      <span><strong>[{u.type}]</strong> {u.title}</span>
                      <span style={{ color: "#888", fontSize: "11px" }}>{u.locations?.join(', ')}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={() => confirmDelete(true, false)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#16A34A",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>shield</span>
                    Remplacer par l'image par défaut & Supprimer (Recommandé)
                  </button>

                  <button
                    onClick={() => confirmDelete(false, true)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: "1px solid #FCA5A5",
                      background: "#FEF2F2",
                      color: "#DC2626",
                      fontWeight: "600",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    Supprimer quand même (Laisser les liens brisés)
                  </button>

                  <button
                    onClick={() => setDeleteTarget(null)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      background: "#fff",
                      color: "#374151",
                      fontWeight: "500",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>delete</span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111" }}>
                      Supprimer ce média ?
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#666" }}>
                      {deleteTarget.name}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.5", marginBottom: "24px" }}>
                  Ce fichier n'est utilisé dans aucun article ou magazine. Sa suppression est sécurisée et libérera de l'espace disque.
                </p>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setDeleteTarget(null)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      background: "#fff",
                      color: "#374151",
                      fontWeight: "500",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => confirmDelete(false, true)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#DC2626",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Confirmer la suppression
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

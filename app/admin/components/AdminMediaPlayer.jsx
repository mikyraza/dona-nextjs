"use client";

import React, { useState } from "react";
import { getMediaFormatInfo } from "@/lib/mediaFormatHelper";

export default function AdminMediaPlayer({
  src,
  poster,
  mediaType = "video", // "video" | "audio"
  title,
  duration,
  className = "",
  style = {}
}) {
  const [playbackError, setPlaybackError] = useState(false);
  const [showTranscodeHelp, setShowTranscodeHelp] = useState(false);

  const mediaInfo = getMediaFormatInfo(src);

  if (!src) {
    return (
      <div style={{
        width: "100%",
        aspectRatio: mediaType === "video" ? "16/9" : "auto",
        minHeight: mediaType === "audio" ? "90px" : "200px",
        background: "#1A1A1A",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#6B7280",
        padding: "16px",
        textAlign: "center",
        ...style
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "36px", opacity: 0.4, marginBottom: "8px" }}>
          {mediaType === "video" ? "videocam_off" : "volume_off"}
        </span>
        <span style={{ fontSize: "12px", color: "#888" }}>Aucun fichier média sélectionné</span>
      </div>
    );
  }

  // Handle Embeds (YouTube / Vimeo)
  if (mediaInfo.isEmbed) {
    let embedUrl = src;
    if (src.includes("youtube.com/watch?v=")) {
      embedUrl = src.replace("watch?v=", "embed/");
    } else if (src.includes("youtu.be/")) {
      const id = src.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    }

    return (
      <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "6px", overflow: "hidden", ...style }}>
        <iframe
          src={embedUrl}
          title={title || "Lecteur vidéo intégré"}
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Handle Unsupported Containers (.avi, .mkv, .wmv, .flv) or Browser Playback Failures
  if (!mediaInfo.isHtml5Supported || playbackError) {
    const extUpper = (mediaInfo.extension || "MKV/AVI").toUpperCase();
    return (
      <div style={{
        background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)",
        border: "1px solid #44403C",
        borderRadius: "8px",
        padding: "20px",
        color: "#FFFFFF",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        ...style
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            background: "#451A03",
            border: "1px solid #78350F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "#F59E0B"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              {mediaType === "video" ? "movie" : "audio_file"}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
              <span style={{
                background: "#78350F",
                color: "#FDE68A",
                fontSize: "10px",
                fontWeight: "800",
                padding: "2px 8px",
                borderRadius: "4px",
                letterSpacing: "0.05em"
              }}>
                CONTENEUR {extUpper}
              </span>
              <span style={{ fontSize: "11px", color: "#A8A29E" }}>
                Format non décodé nativement par les navigateurs web (HTML5)
              </span>
            </div>

            <div style={{ fontSize: "13px", fontWeight: "600", color: "#F5F5F4", marginBottom: "4px", wordBreak: "break-all" }}>
              {src.split("/").pop()}
            </div>

            <p style={{ margin: "6px 0 12px", fontSize: "12px", color: "#D6D3D1", lineHeight: "1.5" }}>
              Ce conteneur multimédia nécessite un lecteur externe ou un transcodage en <strong>MP4 (H.264 / AAC)</strong> ou <strong>WebM</strong> pour être diffusé en streaming sur le site public.
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a
                href={src}
                download
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  background: "#292524",
                  border: "1px solid #57534E",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
                Télécharger le fichier original
              </a>

              <button
                type="button"
                onClick={() => setShowTranscodeHelp(!showTranscodeHelp)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  background: "transparent",
                  border: "1px solid #78350F",
                  color: "#FBBF24",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>info</span>
                {showTranscodeHelp ? "Masquer les conseils" : "Conseils d'encodage MP4"}
              </button>
            </div>

            {showTranscodeHelp && (
              <div style={{
                marginTop: "12px",
                padding: "12px",
                background: "#1C1917",
                border: "1px solid #44403C",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#A8A29E",
                lineHeight: "1.6"
              }}>
                <strong style={{ color: "#F5F5F4" }}>💡 Recommandation pour diffusion optimale :</strong>
                <ul style={{ margin: "4px 0 0", paddingLeft: "16px" }}>
                  <li><strong>Format vidéo recommandé :</strong> MP4 (Codec vidéo H.264 / AVC + Codec audio AAC).</li>
                  <li><strong>Outils gratuits recommandés :</strong> HandBrake, FFmpeg ou VLC (Convertir / Enregistrer).</li>
                  <li><strong>Commande FFmpeg rapide :</strong> <code>ffmpeg -i input.{mediaInfo.extension || "mkv"} -c:v libx264 -c:a aac output.mp4</code></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Native HTML5 Video
  if (mediaType === "video") {
    return (
      <div style={{ width: "100%", borderRadius: "6px", overflow: "hidden", background: "#000", ...style }}>
        <video
          controls
          src={src}
          poster={poster}
          onError={() => setPlaybackError(true)}
          style={{ width: "100%", maxHeight: "380px", display: "block" }}
        >
          Votre navigateur ne prend pas en charge la balise vidéo HTML5.
        </video>
      </div>
    );
  }

  // Native HTML5 Audio
  return (
    <div style={{
      padding: "16px",
      background: "#18181B",
      borderRadius: "8px",
      border: "1px solid #27272A",
      ...style
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <span className="material-symbols-outlined" style={{ color: "var(--admin-accent-color, #E11D48)", fontSize: "22px" }}>
          headphones
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#F4F4F5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title || src.split("/").pop()}
          </div>
          {duration && <div style={{ fontSize: "11px", color: "#71717A" }}>{duration}</div>}
        </div>
      </div>
      <audio
        controls
        src={src}
        onError={() => setPlaybackError(true)}
        style={{ width: "100%", outline: "none" }}
      >
        Votre navigateur ne prend pas en charge la balise audio HTML5.
      </audio>
    </div>
  );
}

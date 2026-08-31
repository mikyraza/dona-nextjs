/**
 * Utility helper to detect media formats and browser HTML5 compatibility.
 */

export function getMediaFormatInfo(urlOrPath = "") {
  if (!urlOrPath) {
    return {
      isValid: false,
      extension: "",
      type: "unknown",
      isHtml5Supported: false,
      formatLabel: "Inconnu",
      isStream: false,
      isEmbed: false
    };
  }

  const cleanUrl = urlOrPath.split("?")[0].split("#")[0].toLowerCase();

  // Check for external embeds
  if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be") || cleanUrl.includes("vimeo.com") || cleanUrl.includes("dailymotion.com")) {
    return {
      isValid: true,
      extension: "embed",
      type: "video_embed",
      isHtml5Supported: true,
      isEmbed: true,
      isStream: false,
      formatLabel: "Lien Intégré (YouTube / Vimeo)",
      badge: "EMBED"
    };
  }

  // Check for HLS / live stream
  if (cleanUrl.endsWith(".m3u8") || cleanUrl.includes("/hls/") || cleanUrl.includes("/live/")) {
    return {
      isValid: true,
      extension: "m3u8",
      type: "hls_stream",
      isHtml5Supported: true,
      isEmbed: false,
      isStream: true,
      formatLabel: "Flux Vidéo HLS (.m3u8)",
      badge: "HLS STREAM"
    };
  }

  const extMatch = cleanUrl.match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : "";

  // HTML5 Native Video Formats
  const NATIVE_VIDEO_EXTS = ["mp4", "webm", "ogg", "ogv", "mov"];
  // HTML5 Native Audio Formats
  const NATIVE_AUDIO_EXTS = ["mp3", "wav", "aac", "m4a", "oga", "flac"];
  // Unsupported / Legacy Containers requiring transcoding
  const UNSUPPORTED_CONTAINERS = ["avi", "mkv", "wmv", "flv", "vob", "divx", "rmvb", "3gp", "ts"];

  if (NATIVE_VIDEO_EXTS.includes(ext)) {
    return {
      isValid: true,
      extension: ext,
      type: "video",
      isHtml5Supported: true,
      isEmbed: false,
      isStream: false,
      formatLabel: `Vidéo Web (${ext.toUpperCase()})`,
      badge: ext.toUpperCase()
    };
  }

  if (NATIVE_AUDIO_EXTS.includes(ext)) {
    return {
      isValid: true,
      extension: ext,
      type: "audio",
      isHtml5Supported: true,
      isEmbed: false,
      isStream: false,
      formatLabel: `Audio Web (${ext.toUpperCase()})`,
      badge: ext.toUpperCase()
    };
  }

  if (UNSUPPORTED_CONTAINERS.includes(ext)) {
    return {
      isValid: true,
      extension: ext,
      type: "unsupported_container",
      isHtml5Supported: false,
      isEmbed: false,
      isStream: false,
      formatLabel: `Conteneur ${ext.toUpperCase()}`,
      badge: `NON-HTML5 (${ext.toUpperCase()})`,
      warning: `Le format .${ext} est un conteneur non supporté nativement par les navigateurs web (HTML5).`,
      recommendation: `Pour une lecture fluide dans le navigateur et sur mobile, convertissez ce fichier en format standard MP4 (codec H.264 / AAC) ou WebM.`
    };
  }

  return {
    isValid: true,
    extension: ext || "fichier",
    type: "unknown",
    isHtml5Supported: true, // Attempt native playback with error fallback
    isEmbed: false,
    isStream: false,
    formatLabel: ext ? ext.toUpperCase() : "Média",
    badge: ext ? ext.toUpperCase() : "MÉDIA"
  };
}

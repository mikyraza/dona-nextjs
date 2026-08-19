import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const directoriesToScan = [
      {
        fsPath: path.join(process.cwd(), "public", "assets", "core", "uploads"),
        publicPath: "/assets/core/uploads/"
      },
      {
        fsPath: path.join(process.cwd(), "public", "assets", "core", "img"),
        publicPath: "/assets/core/img/"
      }
    ];

    const files = [];

    for (const dir of directoriesToScan) {
      if (!fs.existsSync(dir.fsPath)) {
        continue;
      }

      const fileNames = await fs.promises.readdir(dir.fsPath);
      
      for (const fileName of fileNames) {
        if (fileName === '.DS_Store') continue;

        const filePath = path.join(dir.fsPath, fileName);
        const stats = await fs.promises.stat(filePath);

        if (stats.isFile()) {
          const ext = path.extname(fileName).toLowerCase();
          let type = 'other';
          
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
            type = 'image';
          } else if (['.mp4', '.webm', '.ogg', '.mov'].includes(ext)) {
            type = 'video';
          } else if (['.mp3', '.wav', '.m4a'].includes(ext)) {
            type = 'audio';
          }

          files.push({
            id: `${dir.publicPath}${fileName}`,
            name: fileName,
            url: `${dir.publicPath}${fileName}`,
            size: stats.size,
            type: type,
            createdAt: stats.birthtime.toISOString(),
            updatedAt: stats.mtime.toISOString(),
          });
        }
      }
    }
    // Fetch from WordPress API if available
    const WP_API_URL = process.env.WORDPRESS_API_URL;
    if (WP_API_URL) {
      try {
        const wpRes = await fetch(`${WP_API_URL}/wp/v2/media?per_page=100`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        
        if (wpRes.ok) {
          const wpMedia = await wpRes.json();
          if (Array.isArray(wpMedia)) {
            wpMedia.forEach(media => {
              const url = media.source_url;
              if (!url) return;

              const fileName = url.split('/').pop() || `wp-media-${media.id}`;
              const ext = path.extname(fileName).toLowerCase();
              
              let type = 'other';
              if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext) || media.media_type === 'image') {
                type = 'image';
              } else if (['.mp4', '.webm', '.ogg', '.mov'].includes(ext) || media.media_type === 'video') {
                type = 'video';
              } else if (['.mp3', '.wav', '.m4a'].includes(ext) || media.media_type === 'audio') {
                type = 'audio';
              }

              // Transform the WordPress URL to our local proxy URL
              let localProxyUrl = url;
              const wpBase = WP_API_URL.replace('/wp-json', '');
              if (url.startsWith(wpBase + '/wp-content/uploads/')) {
                localProxyUrl = url.replace(wpBase + '/wp-content/uploads/', '/assets/core/uploads/');
              }
              
              // Prevent duplicates if by chance it's the same name
              if (!files.find(f => f.url === localProxyUrl)) {
                files.push({
                  id: `wp-${media.id}`,
                  name: fileName,
                  url: localProxyUrl,
                  size: media.media_details?.filesize || 0,
                  type: type,
                  createdAt: new Date(media.date).toISOString(),
                  updatedAt: new Date(media.modified).toISOString(),
                });
              }
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch media from WordPress:", err);
      }
    }

    // Sort by newest first
    files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Media list API error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des fichiers" }, { status: 500 });
  }
}

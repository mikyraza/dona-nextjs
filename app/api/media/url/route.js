import { writeAtomicSync } from '@/lib/atomicFile';
import { validateRemoteUrl } from '@/lib/ssrfValidator';
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MAX_DOWNLOAD_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB max
const DOWNLOAD_TIMEOUT_MS = 8000; // 8 seconds timeout

export async function POST(req) {
  try {
    const { url } = await req.json();

    // 1. Strict SSRF Validation: protocol, host, and private/loopback IP filter
    const validation = await validateRemoteUrl(url);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error || "URL non autorisée." },
        { status: 400 }
      );
    }

    // 2. Controlled remote download with AbortController timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DONA-MediaBot/1.0'
        }
      });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: "Délai d'attente dépassé lors du téléchargement de l'image (Timeout)." },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { success: false, error: `Échec de connexion vers l'URL distante: ${fetchErr.message}` },
        { status: 502 }
      );
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Le serveur distant a répondu avec le statut ${response.status}.` },
        { status: 400 }
      );
    }

    // 3. Content-Type and size validation
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    const contentLength = parseInt(response.headers.get('content-length') || '0', 10);

    if (contentLength > MAX_DOWNLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Le fichier distant dépasse la taille maximale autorisée (15 Mo)." },
        { status: 413 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_DOWNLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Le fichier distant dépasse la taille maximale autorisée (15 Mo)." },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(arrayBuffer);

    // 4. Generate unique secure filename
    const urlParts = new URL(url);
    let originalName = path.basename(urlParts.pathname);
    
    // Ensure it has an extension, fallback to .jpg if unknown
    if (!originalName || !originalName.includes('.')) {
      let ext = 'jpg';
      if (contentType.includes('image/png')) ext = 'png';
      else if (contentType.includes('image/webp')) ext = 'webp';
      else if (contentType.includes('image/gif')) ext = 'gif';
      else if (contentType.includes('image/svg')) ext = 'svg';
      
      originalName = `external_image_${Date.now()}.${ext}`;
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(originalName) || '.jpg';
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalFilename = `${baseName}-${uniqueSuffix}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "assets", "core", "uploads");

    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, finalFilename);
    writeAtomicSync(filePath, buffer);

    const fileUrl = `/assets/core/uploads/${finalFilename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload par URL:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la sauvegarde de l'image externe." },
      { status: 500 }
    );
  }
}

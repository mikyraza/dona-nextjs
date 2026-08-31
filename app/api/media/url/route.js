import { writeAtomicSync } from '@/lib/atomicFile';
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ success: false, error: "URL invalide fournie." }, { status: 400 });
    }

    // Fetch the external image
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Impossible de récupérer l'image distante." }, { status: 400 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const urlParts = new URL(url);
    let originalName = path.basename(urlParts.pathname);
    
    // Ensure it has an extension, fallback to .jpg if unknown
    if (!originalName || !originalName.includes('.')) {
      const contentType = response.headers.get('content-type');
      let ext = 'jpg';
      if (contentType === 'image/png') ext = 'png';
      else if (contentType === 'image/webp') ext = 'webp';
      else if (contentType === 'image/gif') ext = 'gif';
      
      originalName = `external_image_${Date.now()}.${ext}`;
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
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

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { dbFindMediaUsage, dbReplaceMediaUrl } from "@/lib/db";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');
    const mediaUrl = searchParams.get('url') || `/assets/core/uploads/${fileName}`;
    const replaceFallback = searchParams.get('replaceFallback') === 'true';
    const fallbackUrl = searchParams.get('fallbackUrl') || '/assets/core/img/mag_hero_03.png';
    const force = searchParams.get('force') === 'true';

    if (!fileName) {
      return NextResponse.json({ error: "Nom du fichier manquant" }, { status: 400 });
    }

    // Check usage before deleting
    const usage = dbFindMediaUsage(mediaUrl);

    if (usage.inUse && !force && !replaceFallback) {
      return NextResponse.json({
        error: "Fichier en cours d'utilisation",
        inUse: true,
        count: usage.count,
        usages: usage.usages,
        message: `Ce média est actuellement utilisé dans ${usage.count} contenu(s). Veuillez confirmer le remplacement par un visuel de secours ou la suppression forcée.`
      }, { status: 409 });
    }

    // If replacement requested or file in use, replace broken links automatically
    if (usage.inUse && (replaceFallback || !force)) {
      dbReplaceMediaUrl(mediaUrl, fallbackUrl);
    }

    // Security: prevent Path Traversal
    const normalizedFileName = path.basename(fileName);

    const directoriesToCheck = [
      path.join(process.cwd(), "public", "assets", "core", "uploads"),
      path.join(process.cwd(), "public", "assets", "core", "img")
    ];

    let deleted = false;
    for (const dir of directoriesToCheck) {
      const filePath = path.join(dir, normalizedFileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        deleted = true;
        break;
      }
    }

    return NextResponse.json({
      success: true,
      message: deleted ? "Fichier supprimé et liens sécurisés" : "Référence supprimée",
      replacedReferences: usage.inUse ? usage.count : 0
    });

  } catch (error) {
    console.error("Media delete API error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json({ error: "Nom du fichier manquant" }, { status: 400 });
    }

    // Sécurité: empêcher de remonter dans les dossiers (Path Traversal)
    const normalizedFileName = path.basename(fileName);

    const publicUploadsDir = path.join(process.cwd(), "public", "assets", "core", "uploads");
    const filePath = path.join(publicUploadsDir, normalizedFileName);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return NextResponse.json({ success: true, message: "Fichier supprimé" });
    } else {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

  } catch (error) {
    console.error("Media delete API error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}

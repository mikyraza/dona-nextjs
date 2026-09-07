import { NextResponse } from 'next/server';
import { dbGetDossiers, dbUpsertDossier, dbDeleteDossier, exportDatabaseToSqlFile } from '@/lib/db';
import { validateAdminSession } from '@/lib/adminAuth';

export async function GET(req) {
  try {
    const auth = await validateAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
    }

    const dossiers = dbGetDossiers();
    return NextResponse.json(dossiers);
  } catch (error) {
    console.error("GET /api/admin/dossiers error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await validateAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const result = dbUpsertDossier(body);
    try { exportDatabaseToSqlFile(); } catch (e) {}
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/admin/dossiers error:", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await validateAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    const success = dbDeleteDossier(id);
    try { exportDatabaseToSqlFile(); } catch (e) {}
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/admin/dossiers error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}

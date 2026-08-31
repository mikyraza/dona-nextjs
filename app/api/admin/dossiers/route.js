import { NextResponse } from 'next/server';
import { dbGetDossiers, dbUpsertDossier, dbDeleteDossier, exportDatabaseToSqlFile } from '@/lib/db';

export async function GET() {
  try {
    const dossiers = dbGetDossiers();
    return NextResponse.json(dossiers);
  } catch (error) {
    console.error("GET /api/admin/dossiers error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
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

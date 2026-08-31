import { NextResponse } from 'next/server';
import { dbGetUsers, dbUpsertUser, dbDeleteUser, dbToggleUserStatus, exportDatabaseToSqlFile } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';

    const users = dbGetUsers({ search, role, status });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: "Nom et email obligatoires" }, { status: 400 });
    }

    const saved = dbUpsertUser(body);
    try { exportDatabaseToSqlFile(); } catch (e) {}
    return NextResponse.json({ success: true, user: saved });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "ID utilisateur manquant" }, { status: 400 });
    }

    const updated = dbToggleUserStatus(body.id);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 });
    }

    try { exportDatabaseToSqlFile(); } catch (e) {}
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("PATCH /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
    }

    const deleted = dbDeleteUser(id);
    try { exportDatabaseToSqlFile(); } catch (e) {}
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

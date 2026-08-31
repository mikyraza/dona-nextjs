import { NextResponse } from 'next/server';
import { dbGetMembers, dbUpsertMember, dbDeleteMember, dbUpsertUser } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

async function checkAuth(req) {
  if (process.env.NODE_ENV === 'development') return true;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "dona-magazine-super-secret-key-987654321" });
  return Boolean(token);
}

// GET /api/admin/members — list all circle members from SQLite DB
export async function GET(req) {
  try {
    const isAuth = await checkAuth(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || 'all';
    const status = searchParams.get('status') || 'all';

    const members = dbGetMembers({ search, plan, status });
    return NextResponse.json({ success: true, members });
  } catch (error) {
    console.error("GET /api/admin/members error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/members — add or update member in SQLite DB
export async function POST(req) {
  try {
    const isAuth = await checkAuth(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: "Nom et email obligatoires" }, { status: 400 });
    }

    // Save to members table
    const savedMember = dbUpsertMember(body);

    // Also synchronize into users table so they can log in
    dbUpsertUser({
      name: body.name,
      email: body.email,
      password: body.password || 'dona2026',
      role: 'USER',
      status: body.status === 'Inactive' ? 'Suspendu' : 'Actif',
      plan: body.plan || 'Essentiel',
      phone: body.phone || '',
      avatar: body.avatar || null
    });

    return NextResponse.json({ success: true, member: savedMember });
  } catch (error) {
    console.error("POST /api/admin/members error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/members?id=... — remove member from SQLite DB
export async function DELETE(req) {
  try {
    const isAuth = await checkAuth(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
    }

    const deleted = dbDeleteMember(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE /api/admin/members error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

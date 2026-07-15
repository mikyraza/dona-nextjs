import { NextResponse } from 'next/server';
import { fetchDossiers, createOrUpdateDossier } from '@/lib/wordpress';
import { getToken } from 'next-auth/jwt';

async function checkAuth(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "dona-magazine-super-secret-key-987654321" });
  const allowedAdminRoles = ["Super-Admin", "Éditeur", "Journaliste", "Traducteur"];
  return token && allowedAdminRoles.includes(token.role);
}

export async function GET(req) {
  try {
    const isAuth = await checkAuth(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dossiers = await fetchDossiers();
    return NextResponse.json(dossiers);
  } catch (error) {
    console.error("GET dossiers proxy error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const isAuth = await checkAuth(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const result = await createOrUpdateDossier(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST dossiers proxy error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de l'enregistrement" }, { status: 500 });
  }
}

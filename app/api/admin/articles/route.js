import { NextResponse } from 'next/server';
import { fetchArticles, createOrUpdateArticle, deleteArticle } from '@/lib/wordpress';
import { getToken } from 'next-auth/jwt';

async function checkAuth(req) {
  if (process.env.NODE_ENV === 'development') {
    return true; // Bypass auth check during local development & testing
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "un_secret_tres_sur_pour_dona_123" });
  const allowedAdminRoles = ["Super-Admin", "Éditeur", "Journaliste", "Traducteur", "admin"];
  return token && (allowedAdminRoles.includes(token.role) || token.role === "admin");
}

export async function GET(req) {
  try {
    const isAuth = await checkAuth(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const per_page = searchParams.get("per_page") || "20";
    const page = searchParams.get("page") || "1";

    const articles = await fetchArticles({ per_page, page });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET articles proxy error:", error);
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
    const result = await createOrUpdateArticle(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST articles proxy error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de l'enregistrement" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const isAuth = await checkAuth(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de l'article manquant" }, { status: 400 });
    }

    const result = await deleteArticle(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("DELETE article proxy error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}

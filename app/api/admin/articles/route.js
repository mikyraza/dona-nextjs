import { NextResponse } from 'next/server';
import { fetchArticles, createOrUpdateArticle, deleteArticle } from '@/lib/wordpress';
import { validateAdminSession } from '@/lib/adminAuth';

export async function GET(req) {
  try {
    const auth = await validateAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
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
    const auth = await validateAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
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
    const auth = await validateAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
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

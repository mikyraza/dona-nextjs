import React from 'react';
import { dbGetTodayPageConfig } from '@/lib/db';
import {
  DEFAULT_ARTICLES,
  findMatchingArticle,
  normalizeArticle
} from '@/lib/todayArticles';
import TodayArticleClient from '@/components/today/TodayArticleClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function resolveTodayArticle(slug) {
  try {
    const cfg = dbGetTodayPageConfig();
    if (cfg) {
      const combined = [
        ...(cfg.newsItems || []),
        ...(cfg.france || [])
      ];
      const found = findMatchingArticle(combined, slug);
      if (found) return normalizeArticle(found);
    }
  } catch (e) {
    console.error("Error resolving today article from database:", e);
  }
  const fallback = findMatchingArticle(DEFAULT_ARTICLES, slug);
  return fallback ? normalizeArticle(fallback) : null;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { articleSlug } = resolvedParams;
  const article = resolveTodayArticle(articleSlug);

  if (!article) {
    return {
      title: 'Article introuvable | DONA Today',
      description: "L'actualité demandée n'est plus disponible ou a été archivée sur DONA Magazine.",
      robots: { index: false, follow: true }
    };
  }

  const title = `${article.title} | DONA Today`;
  const description = article.desc || article.description || "Actualité et décryptage stratégique en continu sur DONA Magazine.";
  let imageUrl = article.image || '/assets/core/img/featured_urgent.png';
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = '/' + imageUrl;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/today/${articleSlug}`
    },
    openGraph: {
      title,
      description,
      url: `/today/${articleSlug}`,
      siteName: 'DONA Magazine',
      locale: 'fr_FR',
      type: 'article',
      publishedTime: article.time,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function TodayArticlePage({ params }) {
  const resolvedParams = await params;
  const { articleSlug } = resolvedParams;
  const initialArticle = resolveTodayArticle(articleSlug);

  return (
    <TodayArticleClient
      initialArticle={initialArticle}
      articleSlug={articleSlug}
    />
  );
}

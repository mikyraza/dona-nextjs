import React from 'react';
import { notFound } from 'next/navigation';
import { fetchMagazineConfig, fetchArticleById } from '@/lib/wordpress';
import { magazines as staticMagazines } from '../../../data';
import ArticleDetailClient from '@/components/article/ArticleDetailClient';
import { slugify } from '@/lib/slugHelper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { magazineSlug, articleSlug } = resolvedParams;

  const baseMag = staticMagazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  const dynamicConfig = await fetchMagazineConfig(magazineSlug);

  const magazine = {
    ...baseMag,
    ...dynamicConfig
  };

  let article = await fetchArticleById(articleSlug);

  if (!article && magazine.articles) {
    article = magazine.articles.find(a => a.id === articleSlug || a.slug === articleSlug || slugify(a.title) === articleSlug);
  }

  if (!article) {
    const formattedTitle = articleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    article = {
      title: formattedTitle,
      desc: `Analyse approfondie au coeur des enjeux contemporains de l'univers ${magazine.title || 'DONA Magazine'}.`,
      image: magazine.heroImage || "/assets/core/img/mag_hero_03.png"
    };
  }

  const pageTitle = `${article.title} — ${magazine.title || 'DONA'} | DONA Magazine`;
  const description = article.desc || article.description || `Article exclusif publié dans l'édition ${magazine.title || 'DONA'}.`;
  let imageUrl = article.image || article.coverImage || magazine.heroImage || '/assets/core/img/mag_hero_03.png';
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = '/' + imageUrl;
  }

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: `/magazines/${magazineSlug}/articles/${articleSlug}`
    },
    openGraph: {
      title: pageTitle,
      description,
      url: `/magazines/${magazineSlug}/articles/${articleSlug}`,
      siteName: 'DONA Magazine',
      locale: 'fr_FR',
      type: 'article',
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
      title: pageTitle,
      description,
      images: [imageUrl]
    }
  };
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const { magazineSlug, articleSlug } = resolvedParams;

  const baseMag = staticMagazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  const dynamicConfig = await fetchMagazineConfig(magazineSlug);

  if (!baseMag && !dynamicConfig) {
    notFound();
  }

  const magazine = {
    ...baseMag,
    ...dynamicConfig
  };

  let article = await fetchArticleById(articleSlug);

  if (!article && magazine.articles) {
    article = magazine.articles.find(a => a.id === articleSlug || a.slug === articleSlug || slugify(a.title) === articleSlug);
  }

  if (!article) {
    article = {
      id: articleSlug,
      title: articleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      desc: `Analyse approfondie au coeur des enjeux contemporains de l'univers ${magazine.title}.`,
      badge: "EXCLUSIF",
      meta: "RÉDACTION • 10 MIN DE LECTURE",
      image: magazine.heroImage || "/assets/core/img/mag_hero_03.png",
      content: "<p>Contenu en cours de rédaction par le comité éditorial.</p>"
    };
  }

  return (
    <ArticleDetailClient
      magazine={magazine}
      article={article}
      magazineSlug={magazineSlug}
      articleSlug={articleSlug}
    />
  );
}

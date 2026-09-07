/**
 * Slug generation utilities for DONA Magazine
 */

export function slugify(text) {
  if (!text) return '';
  return String(text)
    .normalize('NFD') // separate characters from their diacritics
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
}

export function getArticleSlug(article) {
  if (!article) return '';
  if (article.slug && typeof article.slug === 'string' && article.slug.trim()) {
    return slugify(article.slug);
  }
  if (article.title && typeof article.title === 'string' && article.title.trim()) {
    return slugify(article.title);
  }
  return String(article.id || '');
}

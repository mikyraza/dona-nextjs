import React from 'react';
import { fetchArticles, fetchMagazinesConfig } from '@/lib/wordpress';
import { magazines as defaultMagazines } from './magazines/data';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [articles, dynamicConfigs] = await Promise.all([
    fetchArticles(),
    fetchMagazinesConfig()
  ]);

  // Merge dynamic magazine configurations
  const seenSlugs = new Set();
  const magazines = [];

  [...dynamicConfigs, ...defaultMagazines].forEach(m => {
    const cleanSlug = m.slug?.replace(/^magazine-\d{2}-/, '') || m.slug;
    if (!seenSlugs.has(cleanSlug)) {
      seenSlugs.add(cleanSlug);
      const conf = dynamicConfigs.find(c => c.slug === m.slug || c.slug?.replace(/^magazine-\d{2}-/, '') === cleanSlug) || {};
      magazines.push({
        num: String(conf.id || m.id || 1).padStart(2, '0'),
        title: conf.title || m.title,
        slug: m.slug,
        vol: "Vol. I",
        desc: conf.description || conf.subtitle || m.description || m.subtitle || "",
        img: conf.heroImage || m.heroImage || m.img || "/assets/core/img/home_mag_01_1782125759189.png",
        grad: conf.gradient || m.gradient || m.grad || "linear-gradient(135deg, #2b1126, #411d3d)",
        icon: conf.icon || m.icon || ""
      });
    }
  });

  magazines.sort((a, b) => (parseInt(a.num, 10) || 0) - (parseInt(b.num, 10) || 0));
  
  const mainFeature = articles.find(a => a.placementTarget === 'HERO_MAIN') || articles[0] || {
    id: "hero-main-default",
    title: "La Métamorphose du Pouvoir à l'Ère des Algorithmes",
    category: "INTELLIGENCE",
    desc: "Dans un monde en mutation constante, la capacité à naviguer dans l'incertitude devient le premier levier de puissance souveraine.",
    author: "HÉLÈNE GIRARD",
    updated: "8 MIN DE LECTURE",
    coverImage: "/assets/core/img/home_alaune_main_1782125698619.png"
  };

  let sideFeatures = articles.filter(a => a.id !== mainFeature.id && (a.placementTarget === 'HERO_SIDE' || a.placementTarget === 'FEATURED'));
  if (sideFeatures.length < 2) {
    const fallback = articles.filter(a => a.id !== mainFeature.id && a.placementTarget !== 'HERO_SIDE' && a.placementTarget !== 'FEATURED');
    sideFeatures = [...sideFeatures, ...fallback];
  }
  sideFeatures = sideFeatures.slice(0, 2);

  const side1 = sideFeatures[0] || {
    title: "L'Art de la Transmission",
    category: "HÉRITAGE",
    desc: "Comment préserver les valeurs au-delà du succès matériel.",
    coverImage: "/assets/core/img/home_alaune_side1_1782125709654.png"
  };
  const side2 = sideFeatures[1] || {
    title: "Le Rituel du Matin Solaire",
    category: "AGENDA",
    desc: "Trois étapes pour aligner votre intention quotidienne.",
    coverImage: "/assets/core/img/home_alaune_side2_1782125722981.png"
  };

  return (
    <HomeClient
      magazines={magazines}
      mainFeature={mainFeature}
      side1={side1}
      side2={side2}
    />
  );
}

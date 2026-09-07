import React from 'react';
import { fetchMagazinesConfig } from '@/lib/wordpress';
import { magazines as defaultMagazines } from './data';
import MagazinesClient from '@/components/magazine/MagazinesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const dynamicConfigs = await fetchMagazinesConfig();

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

  return <MagazinesClient magazines={magazines} />;
}

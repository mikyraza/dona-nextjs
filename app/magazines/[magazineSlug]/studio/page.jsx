import React from 'react';
import { dbGetVideos, dbGetTvLive } from '@/lib/db';
import { magazines } from '../../data';
import StudioClient from './StudioClient';

export const dynamic = 'force-dynamic';

export default async function StudioPage({ params }) {
  const resolvedParams = await params;
  const { magazineSlug } = resolvedParams;

  const mag = magazines.find(m => m.slug === magazineSlug || m.slug.replace(/^magazine-\d{2}-/, '') === magazineSlug);
  const magazineTitle = mag?.title || (magazineSlug ? magazineSlug.replace(/^magazine-\d{2}-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Magazine');

  const initialVideos = dbGetVideos({
    status: 'Published',
    magazine: magazineSlug
  });

  const initialTvLive = dbGetTvLive();

  return (
    <StudioClient
      magazineSlug={magazineSlug}
      magazineTitle={magazineTitle}
      primaryColor={mag?.themePrimary || '#a31835'}
      initialVideos={initialVideos}
      initialTvLive={{
        isLive: initialTvLive?.isLive || false,
        currentTitle: initialTvLive?.currentTitle || '',
        currentSubtitle: initialTvLive?.currentSubtitle || '',
        hlsUrl: initialTvLive?.hlsUrl || ''
      }}
    />
  );
}

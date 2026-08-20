import { NextResponse } from 'next/server';
import { fetchArticles } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const articles = await fetchArticles();

    const audioArticles = articles
      .filter(a => a.format === 'audio' || a.audioFile)
      .map((a, idx) => ({
        id: a.id,
        title: a.title,
        subtitle: a.desc || `Épisode issu de ${a.category}`,
        series: (a.rubrique || a.badge || 'DONA STUDIO').toUpperCase(),
        episode: `ÉP. ${idx + 1}`,
        duration: '35 MIN',
        durationSec: 2100,
        src: a.audioFile || '',
      }));

    const videoArticles = articles
      .filter(a => a.format === 'video' || a.videoUrl)
      .map((a, idx) => ({
        id: a.id,
        title: a.title,
        subtitle: a.desc || `Production ${a.category}`,
        label: (a.rubrique || a.badge || 'VIDÉO').toUpperCase(),
        duration: '45MIN',
        featured: idx === 0,
        videoUrl: a.videoUrl || '',
        thumbnailUrl: a.coverImage || a.image || '/assets/core/img/studio-video-featured.png'
      }));

    const defaultPodcasts = [
      {
        id: 'ep-42',
        title: 'Architecture of Tomorrow',
        subtitle: "A Conversation with Zaha's Protégés",
        series: 'THE BRIEF',
        episode: 'ÉP. 42',
        duration: '45 MIN',
        durationSec: 2700,
        src: '',
      },
      {
        id: 'ep-41',
        title: "L'Art de la Diplomatie Silencieuse",
        subtitle: 'Narratives cachées des négociations globales',
        series: 'MASTERCLASS',
        episode: 'ÉP. 41',
        duration: '38 MIN',
        durationSec: 2280,
        src: '',
      },
      {
        id: 'ep-40',
        title: 'Décoder les Indices du Luxe',
        subtitle: 'Intelligence de marché pour le curateur moderne',
        series: 'INSIGHTS',
        episode: 'ÉP. 40',
        duration: '52 MIN',
        durationSec: 3120,
        src: '',
      }
    ];

    const defaultVideos = [
      {
        id: 'vid-1',
        title: 'The Global Intelligence Summit',
        subtitle: 'Keynote from the Grand Palais — Jean Nouvel in conversation',
        label: 'ÉVÉNEMENT',
        duration: '1H 24MIN',
        featured: true,
        videoUrl: '',
        thumbnailUrl: '/assets/core/img/studio-video-featured.png'
      },
      {
        id: 'vid-2',
        title: 'Architectures du Silence',
        subtitle: 'Documentaire exclusif — 4 épisodes',
        label: 'DOCUMENTAIRE',
        duration: '4 × 52MIN',
        featured: false,
        videoUrl: '',
        thumbnailUrl: '/assets/core/img/avantage-1.png'
      }
    ];

    return NextResponse.json({
      liveStream: {
        isActive: true,
        title: "The Global Intelligence Summit",
        subtitle: "Live depuis le Grand Palais. Interviews exclusives avec les grandes figures de l'économie et du design mondial.",
        guest: "Jean Nouvel",
        format: "Keynote · Q&A",
        location: "Grand Palais, Paris",
        streamUrl: "",
        backgroundImage: "/assets/core/img/ecouter-hero.png"
      },
      podcastEpisodes: [...audioArticles, ...defaultPodcasts],
      videoArchives: [...videoArticles, ...defaultVideos]
    });
  } catch (err) {
    console.error("GET /api/studio error:", err);
    return NextResponse.json({
      liveStream: { isActive: true, title: "DONA Live" },
      podcastEpisodes: [],
      videoArchives: []
    });
  }
}

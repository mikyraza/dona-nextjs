import { NextResponse } from 'next/server';

export async function GET() {
  /*
  // FUTURE WORDPRESS HEADLESS API FETCH INTEGRATION:
  try {
    // 1. Fetch CPT 'studio_live' (should return single active option block or latest post)
    const responseLive = await fetch('http://localhost/wp-json/wp/v2/studio_live?per_page=1', {
      headers: { 'Accept': 'application/json' }
    });
    const lives = await responseLive.json();
    const activeLive = lives[0] || null;

    // 2. Fetch CPT 'podcast_episode'
    const responsePodcasts = await fetch('http://localhost/wp-json/wp/v2/podcast_episode?per_page=10', {
      headers: { 'Accept': 'application/json' }
    });
    const wpPodcasts = await responsePodcasts.json();

    // 3. Fetch CPT 'video_archive'
    const responseVideos = await fetch('http://localhost/wp-json/wp/v2/video_archive?per_page=10', {
      headers: { 'Accept': 'application/json' }
    });
    const wpVideos = await responseVideos.json();

    return NextResponse.json({
      liveStream: activeLive ? {
        isActive: activeLive.acf.is_active || false,
        title: activeLive.title.rendered,
        subtitle: activeLive.acf.subtitle || '',
        guest: activeLive.acf.featured_guest || '',
        format: activeLive.acf.broadcast_format || '',
        location: activeLive.acf.location || '',
        streamUrl: activeLive.acf.stream_url || '',
        backgroundImage: activeLive.acf.background_image_path || ''
      } : null,
      podcastEpisodes: wpPodcasts.map(ep => ({
        id: ep.acf.episode_id || ep.slug,
        title: ep.title.rendered,
        subtitle: ep.acf.subtitle || '',
        series: ep.acf.series_tag || '',
        episode: ep.acf.episode_label || '',
        duration: ep.acf.duration || '',
        durationSec: ep.acf.duration_seconds || 0,
        src: ep.acf.audio_url || ''
      })),
      videoArchives: wpVideos.map(vid => ({
        id: vid.id,
        title: vid.title.rendered,
        subtitle: vid.acf.subtitle || '',
        label: vid.acf.label_text || '',
        duration: vid.acf.duration || '',
        featured: vid.acf.is_featured || false,
        videoUrl: vid.acf.video_url || '',
        thumbnailUrl: vid.acf.thumbnail_path || ''
      }))
    });
  } catch (error) {
    console.error("WordPress API Fetch Error:", error);
    // Fallback to static mock below
  }
  */

  // Mock response mapping docs/dynamic-matrix.md
  return NextResponse.json({
    liveStream: {
      isActive: true,
      title: "The Global Intelligence Summit",
      subtitle: "Live depuis le Grand Palais. Interviews exclusives avec les grandes figures de l'économie et du design mondial.",
      guest: "Jean Nouvel",
      format: "Keynote · Q&A",
      location: "Grand Palais, Paris",
      streamUrl: "https://example.com/live-stream.mp3",
      backgroundImage: "/assets/core/img/ecouter-hero.png"
    },
    podcastEpisodes: [
      {
        id: 'ep-42',
        title: 'Architecture of Tomorrow',
        subtitle: "A Conversation with Zaha's Protégés",
        series: 'THE BRIEF',
        episode: 'ÉP. 42',
        duration: '45 MIN',
        durationSec: 2700,
        src: 'https://example.com/podcasts/ep42.mp3',
      },
      {
        id: 'ep-41',
        title: "L'Art de la Diplomatie Silencieuse",
        subtitle: 'Narratives cachées des négociations globales',
        series: 'MASTERCLASS',
        episode: 'ÉP. 41',
        duration: '38 MIN',
        durationSec: 2280,
        src: 'https://example.com/podcasts/ep41.mp3',
      },
      {
        id: 'ep-40',
        title: 'Décoder les Indices du Luxe',
        subtitle: 'Intelligence de marché pour le curateur moderne',
        series: 'INSIGHTS',
        episode: 'ÉP. 40',
        duration: '52 MIN',
        durationSec: 3120,
        src: 'https://example.com/podcasts/ep40.mp3',
      }
    ],
    videoArchives: [
      {
        id: 'vid-1',
        title: 'The Global Intelligence Summit',
        subtitle: 'Keynote from the Grand Palais — Jean Nouvel in conversation',
        label: 'ÉVÉNEMENT',
        duration: '1H 24MIN',
        featured: true,
        videoUrl: 'https://example.com/videos/summit2024.mp4',
        thumbnailUrl: '/assets/core/img/studio-video-featured.png'
      },
      {
        id: 'vid-2',
        title: 'Architectures du Silence',
        subtitle: 'Documentaire exclusif — 4 épisodes',
        label: 'DOCUMENTAIRE',
        duration: '4 × 52MIN',
        featured: false,
        videoUrl: 'https://example.com/videos/silence.mp4',
        thumbnailUrl: '/assets/core/img/avantage-1.png'
      }
    ]
  });
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbGetVideos, dbGetTvLive } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isVipUser(session) {
  if (!session?.user) return false;
  const role = session.user.role || '';
  return role !== 'INACTIVE';
}

// GET /api/videos — public video hub feed from relational SQL DB
// Supports: ?category=, ?magazine=, ?featured=true, ?replay=true, ?limit=N
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const magazine = searchParams.get('magazine');
  const featured = searchParams.get('featured');
  const replay = searchParams.get('replay');
  const limit = parseInt(searchParams.get('limit') || '50');

  // Check session to determine VIP access
  const session = await getServerSession();
  const userIsVip = isVipUser(session);

  let videos = dbGetVideos({
    status: 'Published',
    category: category && category !== 'all' ? category : undefined,
    magazine: magazine && magazine !== 'all' ? magazine : undefined,
    featured: featured === 'true',
    replay: replay === 'true',
    limit,
  });

  // Filter VIP-only for non-VIP users — replace content with placeholder
  videos = videos.map(v => {
    if (v.isVipOnly && !userIsVip) {
      return {
        ...v,
        videoUrl: '',     // never expose stream URL
        isLocked: true,
      };
    }
    return { ...v, isLocked: false };
  });

  // Get live TV state from relational DB
  const tvLive = dbGetTvLive();
  const liveTvPayload = {
    isLive: tvLive.isLive,
    currentTitle: tvLive.currentTitle,
    currentSubtitle: tvLive.currentSubtitle,
    currentGuest: tvLive.currentGuest,
    format: tvLive.format,
    location: tvLive.location,
    epg: tvLive.epg,
    // Expose Live stream URL and start time
    hlsUrl: tvLive.hlsUrl || '',
    liveStartTime: tvLive.liveStartTime || Date.now(),
    isUserVip: userIsVip,
  };

  return NextResponse.json({
    success: true,
    liveTv: liveTvPayload,
    videos,
    userIsVip,
  });
}


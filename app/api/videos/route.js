import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';

const VIDEOS_DB_PATH = path.join(process.cwd(), 'lib', 'videos_db.json');
const TVLIVE_DB_PATH = path.join(process.cwd(), 'lib', 'tvlive_db.json');

function readVideosDB() {
  try {
    if (fs.existsSync(VIDEOS_DB_PATH)) {
      return JSON.parse(fs.readFileSync(VIDEOS_DB_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('readVideosDB error:', e);
  }
  return [];
}

function readTvLiveDB() {
  try {
    if (fs.existsSync(TVLIVE_DB_PATH)) {
      return JSON.parse(fs.readFileSync(TVLIVE_DB_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('readTvLiveDB error:', e);
  }
  return { isLive: false, epg: [] };
}

function isVipUser(session) {
  if (!session?.user?.role) return false;
  const vipRoles = ['Super-Admin', 'Éditeur', 'VIP', 'Premium', 'Élite'];
  return vipRoles.includes(session.user.role);
}

// GET /api/videos — public video hub feed
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

  let videos = readVideosDB().filter(v => v.status === 'Published');

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

  // Apply filters
  if (category && category !== 'all') {
    videos = videos.filter(v => v.category === category);
  }
  if (magazine && magazine !== 'all') {
    videos = videos.filter(v => v.magazine === magazine);
  }
  if (featured === 'true') {
    videos = videos.filter(v => v.isFeatured);
  }
  if (replay === 'true') {
    videos = videos.filter(v => v.isReplay);
  }

  // Sort by publishedAt desc
  videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  videos = videos.slice(0, limit);

  // Get live TV state
  const tvLive = readTvLiveDB();
  const liveTvPayload = {
    isLive: tvLive.isLive,
    currentTitle: tvLive.currentTitle,
    currentSubtitle: tvLive.currentSubtitle,
    currentGuest: tvLive.currentGuest,
    format: tvLive.format,
    location: tvLive.location,
    epg: tvLive.epg,
    // Only expose HLS URL if user is VIP
    hlsUrl: userIsVip ? (tvLive.hlsUrl || '') : '',
    isUserVip: userIsVip,
  };

  return NextResponse.json({
    success: true,
    liveTv: liveTvPayload,
    videos,
    userIsVip,
  });
}

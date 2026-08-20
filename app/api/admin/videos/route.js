import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VIDEOS_DB_PATH = path.join(process.cwd(), 'lib', 'videos_db.json');

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

function writeVideosDB(data) {
  fs.writeFileSync(VIDEOS_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/admin/videos — list all videos
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const magazine = searchParams.get('magazine');
  const status = searchParams.get('status');

  let videos = readVideosDB();

  if (category && category !== 'all') {
    videos = videos.filter(v => v.category === category);
  }
  if (magazine && magazine !== 'all') {
    videos = videos.filter(v => v.magazine === magazine);
  }
  if (status && status !== 'all') {
    videos = videos.filter(v => v.status === status);
  }

  return NextResponse.json({ success: true, videos });
}

// POST /api/admin/videos — create a new video
export async function POST(request) {
  try {
    const body = await request.json();
    const videos = readVideosDB();

    const newVideo = {
      id: `vid-${Date.now()}`,
      title: body.title || '',
      subtitle: body.subtitle || '',
      category: body.category || 'Culture',
      magazine: body.magazine || '',
      label: body.label || body.category?.toUpperCase() || 'VIDÉO',
      duration: body.duration || '',
      isVipOnly: body.isVipOnly || false,
      isHD: body.isHD || false,
      isFeatured: body.isFeatured || false,
      isReplay: body.isReplay || false,
      source: body.source || 'url',
      videoUrl: body.videoUrl || '',
      thumbnailUrl: body.thumbnailUrl || '',
      publishedAt: new Date().toISOString(),
      status: body.status || 'Draft',
    };

    videos.unshift(newVideo);
    writeVideosDB(videos);

    return NextResponse.json({ success: true, video: newVideo });
  } catch (error) {
    console.error('POST /api/admin/videos error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/videos — update an existing video
export async function PUT(request) {
  try {
    const body = await request.json();
    const videos = readVideosDB();
    const idx = videos.findIndex(v => v.id === body.id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    videos[idx] = { ...videos[idx], ...body, updatedAt: new Date().toISOString() };
    writeVideosDB(videos);

    return NextResponse.json({ success: true, video: videos[idx] });
  } catch (error) {
    console.error('PUT /api/admin/videos error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/videos — delete a video by id
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    let videos = readVideosDB();
    videos = videos.filter(v => v.id !== id);
    writeVideosDB(videos);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/videos error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

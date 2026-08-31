import { NextResponse } from 'next/server';
import { dbGetVideos, dbUpsertVideo, dbDeleteVideo } from '@/lib/db';

// GET /api/admin/videos — list all videos from relational SQL DB
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const magazine = searchParams.get('magazine');
    const status = searchParams.get('status');

    const videos = dbGetVideos({
      category: category && category !== 'all' ? category : undefined,
      magazine: magazine && magazine !== 'all' ? magazine : undefined,
      status: status && status !== 'all' ? status : undefined,
    });

    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error('GET /api/admin/videos error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/videos — create a new video in relational SQL DB
export async function POST(request) {
  try {
    const body = await request.json();

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

    const saved = dbUpsertVideo(newVideo);

    return NextResponse.json({ success: true, video: saved || newVideo });
  } catch (error) {
    console.error('POST /api/admin/videos error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/videos — update an existing video in relational SQL DB
export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Missing video id' }, { status: 400 });
    }

    const saved = dbUpsertVideo(body);

    return NextResponse.json({ success: true, video: saved || body });
  } catch (error) {
    console.error('PUT /api/admin/videos error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/videos — delete a video by id from relational SQL DB
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    dbDeleteVideo(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/videos error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


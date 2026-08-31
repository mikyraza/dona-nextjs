import { NextResponse } from 'next/server';
import { dbGetTvLive, dbUpdateTvLive } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/tv-live — get live state + EPG from relational SQL DB
export async function GET() {
  const state = dbGetTvLive();
  return NextResponse.json({ success: true, ...state });
}

// POST /api/admin/tv-live — update live state in relational SQL DB
export async function POST(request) {
  try {
    const body = await request.json();
    const updated = dbUpdateTvLive(body);
    return NextResponse.json({ success: true, ...updated });
  } catch (error) {
    console.error('POST /api/admin/tv-live error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/tv-live — manage EPG in relational SQL DB
export async function PUT(request) {
  try {
    const body = await request.json();
    const current = dbGetTvLive();

    let epg = [...(current.epg || [])];

    if (body.action === 'add' && body.item) {
      const newItem = {
        id: `epg-${Date.now()}`,
        title: body.item.title || '',
        duration: body.item.duration || '',
        scheduledAt: body.item.scheduledAt || new Date().toISOString(),
        type: body.item.type || 'live',
        videoId: body.item.videoId || null,
      };
      epg.push(newItem);
    } else if (body.action === 'remove' && body.id) {
      epg = epg.filter(item => item.id !== body.id);
    } else if (body.action === 'move-up' && body.id) {
      const idx = epg.findIndex(item => item.id === body.id);
      if (idx > 0) {
        [epg[idx - 1], epg[idx]] = [epg[idx], epg[idx - 1]];
      }
    } else if (body.action === 'move-down' && body.id) {
      const idx = epg.findIndex(item => item.id === body.id);
      if (idx < epg.length - 1) {
        [epg[idx], epg[idx + 1]] = [epg[idx + 1], epg[idx]];
      }
    } else if (body.action === 'replace' && body.epg) {
      epg = body.epg;
    }

    const updated = dbUpdateTvLive({ epg });
    return NextResponse.json({ success: true, epg: updated.epg });
  } catch (error) {
    console.error('PUT /api/admin/tv-live error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


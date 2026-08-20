import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TVLIVE_DB_PATH = path.join(process.cwd(), 'lib', 'tvlive_db.json');

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

function writeTvLiveDB(data) {
  fs.writeFileSync(TVLIVE_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/admin/tv-live — get live state + EPG
export async function GET() {
  const state = readTvLiveDB();
  return NextResponse.json({ success: true, ...state });
}

// POST /api/admin/tv-live — update live state (toggle, stream URL, metadata)
export async function POST(request) {
  try {
    const body = await request.json();
    const current = readTvLiveDB();

    const updated = {
      ...current,
      isLive: body.isLive !== undefined ? body.isLive : current.isLive,
      streamUrl: body.streamUrl !== undefined ? body.streamUrl : current.streamUrl,
      hlsUrl: body.hlsUrl !== undefined ? body.hlsUrl : current.hlsUrl,
      currentTitle: body.currentTitle !== undefined ? body.currentTitle : current.currentTitle,
      currentSubtitle: body.currentSubtitle !== undefined ? body.currentSubtitle : current.currentSubtitle,
      currentGuest: body.currentGuest !== undefined ? body.currentGuest : current.currentGuest,
      format: body.format !== undefined ? body.format : current.format,
      location: body.location !== undefined ? body.location : current.location,
      updatedAt: new Date().toISOString(),
    };

    writeTvLiveDB(updated);
    return NextResponse.json({ success: true, ...updated });
  } catch (error) {
    console.error('POST /api/admin/tv-live error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/tv-live — manage EPG (add/remove/reorder items)
export async function PUT(request) {
  try {
    const body = await request.json();
    const current = readTvLiveDB();

    // action: 'add' | 'remove' | 'move-up' | 'move-down' | 'replace'
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

    const updated = { ...current, epg, updatedAt: new Date().toISOString() };
    writeTvLiveDB(updated);

    return NextResponse.json({ success: true, epg });
  } catch (error) {
    console.error('PUT /api/admin/tv-live error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

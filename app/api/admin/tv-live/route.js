import { NextResponse } from 'next/server';
import { dbGetTvLive, dbUpdateTvLive } from '@/lib/db';
import { validateAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

function parseDurationToMinutes(durationInput) {
  if (typeof durationInput === 'number') return durationInput;
  if (!durationInput) return 0;
  const str = String(durationInput).toLowerCase().trim();
  if (/^\d+$/.test(str)) return parseInt(str, 10);
  let totalMinutes = 0;
  const hoursMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:h|hour|heure)/);
  if (hoursMatch) totalMinutes += parseFloat(hoursMatch[1]) * 60;
  const minsMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:m|min|minute)/);
  if (minsMatch) totalMinutes += parseFloat(minsMatch[1]);
  const timeMatch = str.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) totalMinutes += parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
  return Math.round(totalMinutes) || parseInt(str, 10) || 0;
}

// GET /api/admin/tv-live — get live state + EPG from relational SQL DB
export async function GET(request) {
  try {
    const auth = await validateAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
    }

    const state = dbGetTvLive();
    return NextResponse.json({ success: true, ...state });
  } catch (error) {
    console.error('GET /api/admin/tv-live error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/tv-live — update live state in relational SQL DB
export async function POST(request) {
  try {
    const auth = await validateAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
    }

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
    const auth = await validateAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Non autorisé" }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const current = dbGetTvLive();

    let epg = [...(current.epg || [])];

    if (body.action === 'add' && body.item) {
      const newItem = {
        id: `epg-${Date.now()}`,
        title: body.item.title || '',
        duration: parseDurationToMinutes(body.item.duration),
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
      epg = body.epg.map(item => ({
        ...item,
        duration: parseDurationToMinutes(item.duration)
      }));
    }

    const updated = dbUpdateTvLive({ epg });
    return NextResponse.json({ success: true, epg: updated.epg });
  } catch (error) {
    console.error('PUT /api/admin/tv-live error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


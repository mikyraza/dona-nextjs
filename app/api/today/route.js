export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from 'next/server';
import { dbGetTodayPageConfig } from '@/lib/db';

export async function GET() {
  try {
    const config = dbGetTodayPageConfig();
    return NextResponse.json(config || {}, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } });
  } catch (error) {
    console.error("GET /api/today error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } });
  }
}

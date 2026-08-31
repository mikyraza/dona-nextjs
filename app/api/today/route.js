import { NextResponse } from 'next/server';
import { dbGetTodayPageConfig } from '@/lib/db';

export async function GET() {
  try {
    const config = dbGetTodayPageConfig();
    return NextResponse.json(config || {});
  } catch (error) {
    console.error("GET /api/today error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

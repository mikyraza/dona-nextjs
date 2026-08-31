import { NextResponse } from 'next/server';
import { dbGetTodayPageConfig, dbUpdateTodayPageConfig, exportDatabaseToSqlFile } from '@/lib/db';

export async function GET() {
  try {
    const config = dbGetTodayPageConfig();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("GET /api/admin/today-page error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const updated = dbUpdateTodayPageConfig(body);
    try { exportDatabaseToSqlFile(); } catch (e) {}
    return NextResponse.json({ success: true, config: updated });
  } catch (error) {
    console.error("POST /api/admin/today-page error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

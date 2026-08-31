import { NextResponse } from 'next/server';
import { dbGetDashboardStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = dbGetDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

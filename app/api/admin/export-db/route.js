import { NextResponse } from 'next/server';
import { exportDatabaseToSqlFile } from '@/lib/db';

export async function GET() {
  try {
    const sql = exportDatabaseToSqlFile();
    return new NextResponse(sql, {
      status: 200,
      headers: {
        'Content-Type': 'application/sql; charset=utf-8',
        'Content-Disposition': 'attachment; filename="dona_database_export.sql"'
      }
    });
  } catch (error) {
    console.error("GET /api/admin/export-db error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

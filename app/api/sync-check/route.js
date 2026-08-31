import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { dbGetArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'lib', 'dona.db');
    let lastModified = Date.now();

    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      lastModified = stats.mtimeMs;
    }

    const articles = dbGetArticles();
    const articlesCount = articles.length;

    return NextResponse.json({
      lastModified: Math.round(lastModified),
      articlesCount,
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (err) {
    return NextResponse.json({
      lastModified: Date.now(),
      articlesCount: 0,
      timestamp: Date.now()
    });
  }
}


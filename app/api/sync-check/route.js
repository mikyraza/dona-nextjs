import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const articlesPath = path.join(process.cwd(), 'lib', 'articles_db.json');
    const magsPath = path.join(process.cwd(), 'lib', 'magazines_db.json');

    let lastModified = 0;
    let articlesCount = 0;

    if (fs.existsSync(articlesPath)) {
      const stats = fs.statSync(articlesPath);
      lastModified = Math.max(lastModified, stats.mtimeMs);
      try {
        const content = fs.readFileSync(articlesPath, 'utf8');
        const arr = JSON.parse(content);
        articlesCount = Array.isArray(arr) ? arr.length : 0;
      } catch (e) {}
    }

    if (fs.existsSync(magsPath)) {
      const stats = fs.statSync(magsPath);
      lastModified = Math.max(lastModified, stats.mtimeMs);
    }

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

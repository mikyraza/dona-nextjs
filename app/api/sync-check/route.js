import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { dbGetArticles } from '@/lib/db';
import { verifyDiskIntegrity } from '@/lib/configBackup';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const dbPath = path.join(process.cwd(), 'lib', 'dona.db');
    let lastModified = Date.now();

    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      lastModified = stats.mtimeMs;
    }

    const articles = dbGetArticles();
    const articlesCount = articles.length;

    // Generate lightweight ETag
    const roundedMod = Math.round(lastModified);
    const etag = `W/"${roundedMod}-${articlesCount}"`;

    // Check If-None-Match header for conditional 304
    const ifNoneMatch = req?.headers?.get ? req.headers.get('if-none-match') : null;
    if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch === `"${roundedMod}-${articlesCount}"`)) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'no-cache, must-revalidate'
        }
      });
    }

    const diskIntegrity = verifyDiskIntegrity();

    return NextResponse.json({
      // Backward-compatible fields for BackgroundSync.jsx
      lastModified: roundedMod,
      articlesCount,
      timestamp: Date.now(),

      // Comprehensive disk and database integrity check
      integrity: {
        status: diskIntegrity.status,
        database: diskIntegrity.database,
        configBackup: diskIntegrity.configBackup,
        verifiedAt: new Date().toISOString()
      }
    }, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'no-cache, must-revalidate'
      }
    });
  } catch (err) {
    return NextResponse.json({
      lastModified: Date.now(),
      articlesCount: 0,
      timestamp: Date.now(),
      integrity: {
        status: 'error',
        error: err.message,
        verifiedAt: new Date().toISOString()
      }
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  }
}


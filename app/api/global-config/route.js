import { NextResponse } from 'next/server';
import { dbGetAllSettings, dbSetSetting, exportDatabaseToSqlFile } from '@/lib/db';
import {
  createConfigBackup,
  verifyDiskIntegrity,
  restoreConfigBackup,
  listConfigBackups
} from '@/lib/configBackup';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // Handle explicit backup actions
    if (action === 'backups' || action === 'history') {
      const limit = Number(searchParams.get('limit')) || 20;
      return NextResponse.json({
        success: true,
        backups: listConfigBackups(limit),
        timestamp: Date.now()
      });
    }

    if (action === 'integrity') {
      const integrity = verifyDiskIntegrity();
      return NextResponse.json({
        success: true,
        integrity,
        timestamp: Date.now()
      });
    }

    // Default: return global config with backup & integrity metadata
    const settings = dbGetAllSettings();
    const diskIntegrity = verifyDiskIntegrity();

    return NextResponse.json({
      // Core configuration settings (preserved for root backward compatibility)
      logoPath: settings.logoPath || '/assets/core/img/logo.png',
      ctaText: settings.ctaText || "S'ABONNER",
      ctaLink: settings.ctaLink || '/abonnement',
      crimsonThemeHex: settings.crimsonThemeHex || '#A30626',
      heroTitle: settings.heroTitle || 'DONA MAGAZINE',
      heroSubtitle: settings.heroSubtitle || 'Plateforme éditoriale exclusive',
      heroDescription: settings.heroDescription || "Un espace dédié à l'excellence éditoriale, à la curation architecturale et aux privilèges exclusifs des femmes de pouvoir.",
      footerLegalText: settings.footerLegalText || '© 2026 DONA Magazine. Tous droits réservés.',
      footerAddressText: settings.footerAddressText || 'Paris, France',
      footerBackgroundWatermark: settings.footerBackgroundWatermark || 'DONA.',

      // Server-side backup metadata & integrity status
      _backup: {
        status: diskIntegrity.configBackup.status,
        lastBackupId: diskIntegrity.configBackup.lastBackupId,
        lastBackupTimestamp: diskIntegrity.configBackup.lastBackupTimestamp,
        checksumVerified: diskIntegrity.configBackup.checksumVerified,
        storedChecksum: diskIntegrity.configBackup.storedChecksum,
        backupFileExists: diskIntegrity.configBackup.backupFileExists,
        backupsCount: diskIntegrity.configBackup.backupsCount
      },
      _integrity: {
        status: diskIntegrity.status,
        database: diskIntegrity.database.status,
        sqliteIntegrity: diskIntegrity.database.sqliteIntegrity,
        diskWritable: diskIntegrity.database.diskWritable && diskIntegrity.configBackup.backupDirectoryWritable
      }
    });
  } catch (error) {
    console.error("GET /api/global-config error:", error);
    return NextResponse.json({
      logoPath: '/assets/core/img/logo.png',
      ctaText: "S'ABONNER",
      ctaLink: '/abonnement',
      crimsonThemeHex: '#A30626',
      heroTitle: 'DONA MAGAZINE',
      heroSubtitle: 'Plateforme éditoriale exclusive',
      heroDescription: "Un espace dédié à l'excellence...",
      footerLegalText: '© 2026 DONA Magazine. Tous droits réservés.',
      footerAddressText: 'Paris, France',
      footerBackgroundWatermark: 'DONA.',
      _error: error.message
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Explicit Action: Trigger manual server-side backup
    if (body.action === 'create_backup' || body.action === 'backup') {
      const backup = createConfigBackup(null, body.reason || 'manual_trigger');
      try { exportDatabaseToSqlFile(); } catch (e) {}
      return NextResponse.json({
        success: true,
        action: 'create_backup',
        backup,
        settings: dbGetAllSettings()
      });
    }

    // 2. Explicit Action: Restore from server-side backup
    if (body.action === 'restore_backup' || body.action === 'restore') {
      const restoreResult = restoreConfigBackup(body.backupId || 'latest');
      try { exportDatabaseToSqlFile(); } catch (e) {}
      return NextResponse.json({
        success: true,
        action: 'restore_backup',
        ...restoreResult,
        settings: dbGetAllSettings()
      });
    }

    // 3. Explicit Action: Verify disk integrity on-demand
    if (body.action === 'verify_integrity') {
      const integrity = verifyDiskIntegrity();
      return NextResponse.json({
        success: true,
        action: 'verify_integrity',
        integrity
      });
    }

    // 4. Default: Update settings and automatically create atomic server-side backup
    for (const [k, v] of Object.entries(body)) {
      if (k !== 'action' && k !== 'reason' && k !== 'backupId') {
        dbSetSetting(k, v);
      }
    }

    const updatedSettings = dbGetAllSettings();
    const backup = createConfigBackup(updatedSettings, body.reason || 'config_update');

    try { exportDatabaseToSqlFile(); } catch (e) {}

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      backup: {
        id: backup.id,
        filename: backup.filename,
        checksum: backup.checksum,
        sizeBytes: backup.sizeBytes,
        timestamp: backup.timestamp
      }
    });
  } catch (error) {
    console.error("POST /api/global-config error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

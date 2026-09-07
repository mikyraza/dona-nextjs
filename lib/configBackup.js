import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { writeAtomicSync } from './atomicFile.js';
import {
  dbGetAllSettings,
  dbRecordConfigBackup,
  dbGetConfigBackups,
  dbGetLatestConfigBackup,
  dbGetConfigBackupById,
  dbRestoreConfigFromBackup,
  dbCheckIntegrity
} from './db.js';

const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups', 'config');
const LATEST_BACKUP_PATH = path.join(BACKUP_DIR, 'config_backup_latest.json');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function calculateSha256(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Creates a server-side timestamped backup of the global configuration.
 * Stores both an atomic JSON file on disk and a relational record in the database.
 */
export function createConfigBackup(customSettings = null, reason = 'manual') {
  ensureBackupDir();

  const settings = customSettings || dbGetAllSettings();
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  const backupId = `cfg_bk_${timestamp}_${randomSuffix}`;
  const isoDate = new Date(timestamp).toISOString().replace(/[:.]/g, '-');
  const filename = `config_backup_${isoDate}_${backupId}.json`;
  const filePath = path.join(BACKUP_DIR, filename);
  const relativePath = path.join('data', 'backups', 'config', filename).replace(/\\/g, '/');

  const payload = {
    backupId,
    timestamp: new Date(timestamp).toISOString(),
    reason,
    settingsCount: Object.keys(settings).length,
    settings
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const checksum = calculateSha256(jsonString);
  const sizeBytes = Buffer.byteLength(jsonString, 'utf8');

  // 1. Write timestamped backup file atomically on disk
  writeAtomicSync(filePath, jsonString, 'utf8');

  // 2. Write latest pointer file atomically on disk
  const latestPayload = {
    backupId,
    filename,
    filePath: relativePath,
    checksum,
    sizeBytes,
    settingsCount: payload.settingsCount,
    timestamp: payload.timestamp,
    reason,
    settings
  };
  writeAtomicSync(LATEST_BACKUP_PATH, JSON.stringify(latestPayload, null, 2), 'utf8');

  // 3. Record in relational database (config_backups table)
  dbRecordConfigBackup({
    id: backupId,
    filename,
    filePath: relativePath,
    checksum,
    sizeBytes,
    settingsCount: payload.settingsCount,
    configJson: jsonString
  });

  return {
    success: true,
    id: backupId,
    filename,
    filePath: relativePath,
    checksum,
    sizeBytes,
    settingsCount: payload.settingsCount,
    timestamp: payload.timestamp
  };
}

/**
 * Comprehensive disk integrity verification.
 * Checks SQLite integrity, filesystem write accessibility, and verifies server-side backups against cryptographic checksums.
 */
export function verifyDiskIntegrity() {
  const dbIntegrity = dbCheckIntegrity();

  // Test disk write accessibility in backup directory
  let backupDirWritable = false;
  try {
    ensureBackupDir();
    const testFile = path.join(BACKUP_DIR, `.write_test_${Date.now()}`);
    fs.writeFileSync(testFile, 'ok', 'utf8');
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
      backupDirWritable = true;
    }
  } catch (e) {
    backupDirWritable = false;
  }

  // Test disk write accessibility in lib/ (database directory)
  let dbDirWritable = false;
  try {
    const libDir = path.join(process.cwd(), 'lib');
    const testFile = path.join(libDir, `.write_test_${Date.now()}`);
    fs.writeFileSync(testFile, 'ok', 'utf8');
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
      dbDirWritable = true;
    }
  } catch (e) {
    dbDirWritable = false;
  }

  // Verify latest server-side configuration backup on disk
  let backupFileExists = false;
  let checksumVerified = false;
  let storedChecksum = null;
  let computedChecksum = null;
  let lastBackupId = null;
  let lastBackupTimestamp = null;
  let settingsCount = 0;

  if (fs.existsSync(LATEST_BACKUP_PATH)) {
    backupFileExists = true;
    try {
      const raw = fs.readFileSync(LATEST_BACKUP_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      storedChecksum = parsed.checksum;
      lastBackupId = parsed.backupId;
      lastBackupTimestamp = parsed.timestamp;
      settingsCount = parsed.settingsCount || (parsed.settings ? Object.keys(parsed.settings).length : 0);

      // Re-read the actual timestamped file if present
      const targetFilePath = parsed.filePath ? path.join(process.cwd(), parsed.filePath) : null;
      if (targetFilePath && fs.existsSync(targetFilePath)) {
        const fileContent = fs.readFileSync(targetFilePath, 'utf8');
        computedChecksum = calculateSha256(fileContent);
        checksumVerified = (computedChecksum === storedChecksum);
      } else {
        // Fallback: verify integrity of latest backup content directly
        const payloadToHash = JSON.stringify({
          backupId: parsed.backupId,
          timestamp: parsed.timestamp,
          reason: parsed.reason,
          settingsCount: parsed.settingsCount,
          settings: parsed.settings
        }, null, 2);
        computedChecksum = calculateSha256(payloadToHash);
        checksumVerified = (computedChecksum === storedChecksum);
      }
    } catch (e) {
      checksumVerified = false;
    }
  }

  // Get count of backups in relational database
  const dbBackups = dbGetConfigBackups(50);

  const isDatabaseHealthy = dbIntegrity.status === 'ok' && dbDirWritable;
  const isBackupHealthy = (!backupFileExists && dbBackups.length === 0) || (backupFileExists && checksumVerified && backupDirWritable);

  let overallStatus = 'healthy';
  if (!isDatabaseHealthy || (backupFileExists && !checksumVerified)) {
    overallStatus = (dbIntegrity.status === 'error' || (backupFileExists && !checksumVerified)) ? 'corrupted' : 'degraded';
  } else if (!backupDirWritable || !dbDirWritable) {
    overallStatus = 'degraded';
  }

  return {
    status: overallStatus,
    database: {
      status: dbIntegrity.status,
      sqliteIntegrity: dbIntegrity.sqliteIntegrity,
      sizeBytes: dbIntegrity.file?.sizeBytes || 0,
      tablesCount: dbIntegrity.tablesCount || 0,
      missingTables: dbIntegrity.missingTables || [],
      diskWritable: dbDirWritable,
      lastModified: dbIntegrity.file?.lastModified || Date.now()
    },
    configBackup: {
      status: (backupFileExists && checksumVerified) ? 'ok' : (backupFileExists ? 'corrupted' : 'none'),
      lastBackupId,
      lastBackupTimestamp,
      checksumVerified,
      storedChecksum,
      computedChecksum,
      backupFileExists,
      backupsCount: dbBackups.length,
      backupDirectoryWritable: backupDirWritable,
      settingsCount
    },
    timestamp: Date.now()
  };
}

/**
 * Restores global configuration from a server-side backup (by ID or 'latest').
 */
export function restoreConfigBackup(backupId = 'latest') {
  ensureBackupDir();

  // First verify integrity before restoring
  const backup = (backupId === 'latest') ? dbGetLatestConfigBackup() : dbGetConfigBackupById(backupId);

  if (!backup) {
    // Try to restore directly from disk if database record is missing
    if (fs.existsSync(LATEST_BACKUP_PATH)) {
      try {
        const raw = fs.readFileSync(LATEST_BACKUP_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.settings) {
          const { dbSetSetting } = require('./db.js');
          for (const [k, v] of Object.entries(parsed.settings)) {
            dbSetSetting(k, v);
          }
          return {
            success: true,
            restoredFrom: 'disk:latest',
            filename: parsed.filename || 'config_backup_latest.json',
            restoredSettingsCount: Object.keys(parsed.settings).length,
            timestamp: Date.now()
          };
        }
      } catch (e) {
        throw new Error(`Failed to restore from disk: ${e.message}`);
      }
    }
    throw new Error(`Backup "${backupId}" not found in database or disk`);
  }

  // Checksum validation
  const actualChecksum = calculateSha256(backup.configJson);
  if (actualChecksum !== backup.checksum) {
    throw new Error(`Integrity error: backup ${backup.id} checksum mismatch (expected ${backup.checksum}, got ${actualChecksum})`);
  }

  const result = dbRestoreConfigFromBackup(backup.id);

  // Update latest pointer on disk
  try {
    const parsed = JSON.parse(backup.configJson);
    const latestPayload = {
      backupId: backup.id,
      filename: backup.filename,
      filePath: backup.filePath,
      checksum: backup.checksum,
      sizeBytes: backup.sizeBytes,
      settingsCount: backup.settingsCount,
      timestamp: new Date().toISOString(),
      reason: 'restored',
      settings: parsed.settings || parsed
    };
    writeAtomicSync(LATEST_BACKUP_PATH, JSON.stringify(latestPayload, null, 2), 'utf8');
  } catch (e) {}

  return {
    success: true,
    ...result
  };
}

/**
 * Lists all server-side backups with disk existence status.
 */
export function listConfigBackups(limit = 20) {
  const dbBackups = dbGetConfigBackups(limit);
  return dbBackups.map(b => {
    const fullPath = path.join(process.cwd(), b.filePath);
    const exists = fs.existsSync(fullPath);
    return {
      ...b,
      fileExistsOnDisk: exists
    };
  });
}

const fs = require('fs');
const path = require('path');

// File locking / write queue to serialize concurrent writes to the same path
const fileWriteQueues = new Map();

/**
 * Thread-safe atomic file writer.
 * Writes to a temporary file in the same directory, syncs to disk, and atomically renames.
 * Prevents partial writes, corruption, or race conditions from concurrent requests.
 *
 * @param {string} filePath - Absolute path to target file
 * @param {string|Buffer} data - Content to write
 * @param {object|string} [options='utf8'] - Write options or encoding
 * @returns {Promise<void>}
 */
async function writeAtomic(filePath, data, options = 'utf8') {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Queue wrapper to serialize writes per file
  let queue = fileWriteQueues.get(filePath);
  if (!queue) {
    queue = Promise.resolve();
    fileWriteQueues.set(filePath, queue);
  }

  const writeOperation = queue.then(async () => {
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    try {
      const encoding = typeof options === 'string' ? options : (options?.encoding || 'utf8');
      
      // 1. Write to temporary file
      if (Buffer.isBuffer(data)) {
        fs.writeFileSync(tempPath, data);
      } else {
        fs.writeFileSync(tempPath, data, encoding);
      }

      // 2. Atomically rename temporary file to target path
      fs.renameSync(tempPath, filePath);
    } catch (err) {
      // Clean up temporary file on failure
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch (cleanErr) {}
      throw err;
    }
  });

  fileWriteQueues.set(filePath, writeOperation.catch(() => {}));
  return writeOperation;
}

/**
 * Synchronous atomic file writer with temp-file rename.
 */
function writeAtomicSync(filePath, data, options = 'utf8') {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    const encoding = typeof options === 'string' ? options : (options?.encoding || 'utf8');
    if (Buffer.isBuffer(data)) {
      fs.writeFileSync(tempPath, data);
    } else {
      fs.writeFileSync(tempPath, data, encoding);
    }
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch (cleanErr) {}
    throw err;
  }
}

/**
 * Atomically writes JSON data with formatting.
 *
 * @param {string} filePath - Absolute path to target JSON file
 * @param {*} data - JSON serializable data
 * @returns {Promise<void>}
 */
async function writeJsonAtomic(filePath, data) {
  const jsonString = JSON.stringify(data, null, 2);
  return writeAtomic(filePath, jsonString, 'utf8');
}

/**
 * Synchronously writes JSON data atomically.
 */
function writeJsonAtomicSync(filePath, data) {
  const jsonString = JSON.stringify(data, null, 2);
  return writeAtomicSync(filePath, jsonString, 'utf8');
}

/**
 * Safely reads JSON file with corrupt-state protection.
 *
 * @param {string} filePath - Path to JSON file
 * @param {*} [defaultValue=null] - Value returned if file doesn't exist or is invalid
 * @returns {*}
 */
function readJsonSafe(filePath, defaultValue = null) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content || !content.trim()) return defaultValue;
    return JSON.parse(content);
  } catch (err) {
    console.error(`[AtomicFile] Error reading JSON from ${filePath}:`, err.message);
    return defaultValue;
  }
}

module.exports = {
  writeAtomic,
  writeAtomicSync,
  writeJsonAtomic,
  writeJsonAtomicSync,
  readJsonSafe
};

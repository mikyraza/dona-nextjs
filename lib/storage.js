import { get, set } from 'idb-keyval';

export async function getStorageItem(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    let val = await get(key);
    if (val === undefined) {
      // Fallback to localStorage for backward compatibility
      const localVal = localStorage.getItem(key);
      if (localVal) {
        try {
          val = JSON.parse(localVal);
          // Migrate it to IDB
          await set(key, val);
        } catch (e) {
          val = localVal; // In case it wasn't JSON (e.g. string counters)
        }
      }
    }
    return val !== undefined ? val : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from IDB`, error);
    return defaultValue;
  }
}

export async function setStorageItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    await set(key, value);
    // Remove from localStorage to free up space now that it's migrated
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error saving ${key} to IDB`, error);
  }
}

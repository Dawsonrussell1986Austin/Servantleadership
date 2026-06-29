/**
 * Thin async key/value store. Backed by AsyncStorage on native and by
 * localStorage on web (AsyncStorage ships a localStorage shim for web, but we
 * keep this wrapper so callers never have to think about platform or JSON).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // best-effort; persistence is a convenience, not a correctness guarantee
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}

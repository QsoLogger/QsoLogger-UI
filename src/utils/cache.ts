import { useEffect, useState } from 'react';

export function sessionStorageProvider(): Map<any, any> {
  if (typeof window === 'undefined') return new Map([]);
  // When initializing, we restore the data from `sessionStorage` into a map.
  const map = new Map(JSON.parse(sessionStorage.getItem('app-cache') || '[]'));

  // Before unloading the app, we write back all the data into `sessionStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    sessionStorage.setItem('app-cache', appCache);
  });

  // We still use the map for write & read for performance.
  return map;
}

export function localStorageProvider(): Map<any, any> {
  if (typeof window === 'undefined') return new Map([]);
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'));

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem('app-cache', appCache);
  });

  // We still use the map for write & read for performance.
  return map;
}

export async function cachedCall<T>(
  cache: any,
  key: any,
  call: () => T,
  options: any = { EX: 60 }
): Promise<T> {
  const cachedData = await cache.get(key);
  if (cachedData) return JSON.parse(cachedData);
  const result = await call();
  await cache.set(key, JSON.stringify(result), options);
  return result;
}

const memoryCache = new Map();

export const useLocalState = <T>(
  storageKey: string,
  fallbackState?: T,
  storage: 'localStorage' | 'sessionStorage' | 'memory' = 'localStorage'
): [T, (value: T) => void] => {
  let defaultValue = fallbackState;
  if (typeof window !== 'undefined') {
    try {
      if (storage === 'memory') {
        defaultValue = memoryCache.get(storageKey) as T;
      } else {
        const item = window?.[storage].getItem(storageKey);
        defaultValue = JSON.parse(item!) as T;
      }
    } catch (e) {
      defaultValue = undefined as T;
    }
  }
  const [value, setValue] = useState<T>(defaultValue ?? (fallbackState as T));

  useEffect(() => {
    if (storage === 'memory') {
      memoryCache.set(storageKey, value);
    } else if (window?.[storage]) {
      window?.[storage].setItem(storageKey, JSON.stringify(value));
    }
  }, [value, storageKey, storage]);

  return [value, setValue];
};

export const all = {
  sessionStorageProvider,
  localStorageProvider,
  cachedCall,
  useLocalState,
};

export default all;

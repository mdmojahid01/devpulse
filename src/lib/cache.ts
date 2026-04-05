type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const CACHE_PREFIX = "devpulse_cache_";

type ChromeStorageArea = {
  get: (
    keys: string | string[],
    callback: (items: Record<string, unknown>) => void,
  ) => void;
  set: (items: Record<string, unknown>, callback?: () => void) => void;
  remove: (keys: string | string[], callback?: () => void) => void;
};

type ChromeLike = {
  runtime?: { id?: string };
  storage?: { local?: ChromeStorageArea };
};

function getChromeStorageArea(): ChromeStorageArea | null {
  const chromeApi = (globalThis as typeof globalThis & { chrome?: ChromeLike })
    .chrome;

  if (!chromeApi?.runtime?.id || !chromeApi.storage?.local) {
    return null;
  }

  return chromeApi.storage.local;
}

export const cache = {
  async set<T>(key: string, data: T, ttl: number = 3600000): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now() + ttl,
    };
    const storageKey = CACHE_PREFIX + key;
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.set({ [storageKey]: entry }, () => resolve());
      });
    }

    localStorage.setItem(storageKey, JSON.stringify(entry));
  },

  async get<T>(key: string): Promise<T | null> {
    const storageKey = CACHE_PREFIX + key;
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.get(storageKey, items => {
          const entry = items[storageKey] as CacheEntry<T> | undefined;
          if (!entry) {
            resolve(null);
            return;
          }

          if (Date.now() > entry.timestamp) {
            chromeStorage.remove(storageKey);
            resolve(null);
            return;
          }

          resolve(entry.data);
        });
      });
    }

    const item = localStorage.getItem(storageKey);
    if (!item) return null;

    const entry: CacheEntry<T> = JSON.parse(item);
    if (Date.now() > entry.timestamp) {
      localStorage.removeItem(storageKey);
      return null;
    }

    return entry.data;
  },

  async remove(key: string): Promise<void> {
    const storageKey = CACHE_PREFIX + key;
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.remove(storageKey, () => resolve());
      });
    }

    localStorage.removeItem(storageKey);
  },

  async clear(): Promise<void> {
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.get(null as unknown as string, items => {
          const keysToRemove = Object.keys(items).filter(key =>
            key.startsWith(CACHE_PREFIX),
          );
          if (keysToRemove.length > 0) {
            chromeStorage.remove(keysToRemove, () => resolve());
          } else {
            resolve();
          }
        });
      });
    }

    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  },
};

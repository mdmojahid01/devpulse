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

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.get(key, items => {
          const value = items[key] as T | undefined;
          resolve(value ?? null);
        });
      });
    }

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.set({ [key]: value }, () => resolve());
      });
    }

    localStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.remove(key, () => resolve());
      });
    }

    localStorage.removeItem(key);
  },
};

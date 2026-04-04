import type { Theme } from "@/context/theme-context";

const THEME_STORAGE_KEY = "theme";

type ChromeStorageArea = {
  get: (
    keys: string,
    callback: (items: Record<string, unknown>) => void,
  ) => void;
  set: (items: Record<string, Theme>, callback?: () => void) => void;
};

type ChromeLike = {
  runtime?: { id?: string };
  storage?: { local?: ChromeStorageArea };
};

function isTheme(value: unknown): value is Theme {
  return value === "system" || value === "dark" || value === "light";
}

function getChromeStorageArea(): ChromeStorageArea | null {
  const chromeApi = (globalThis as typeof globalThis & { chrome?: ChromeLike })
    .chrome;

  if (!chromeApi?.runtime?.id || !chromeApi.storage?.local) {
    return null;
  }

  return chromeApi.storage.local;
}

export async function readStoredTheme(): Promise<Theme> {
  const chromeStorage = getChromeStorageArea();

  if (chromeStorage) {
    return new Promise(resolve => {
      chromeStorage.get(THEME_STORAGE_KEY, items => {
        const storedTheme = items[THEME_STORAGE_KEY];
        resolve(isTheme(storedTheme) ? storedTheme : "system");
      });
    });
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(storedTheme) ? storedTheme : "system";
}

export async function writeStoredTheme(theme: Theme): Promise<void> {
  const chromeStorage = getChromeStorageArea();

  if (chromeStorage) {
    return new Promise(resolve => {
      chromeStorage.set({ [THEME_STORAGE_KEY]: theme }, () => resolve());
    });
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

import type { Theme } from "@/context/theme-context";
import { storage } from "./storage";

const THEME_STORAGE_KEY = "theme";

function isTheme(value: unknown): value is Theme {
  return value === "system" || value === "dark" || value === "light";
}

export async function readStoredTheme(): Promise<Theme> {
  const storedTheme = await storage.get<Theme>(THEME_STORAGE_KEY);
  return isTheme(storedTheme) ? storedTheme : "system";
}

export async function writeStoredTheme(theme: Theme): Promise<void> {
  await storage.set(THEME_STORAGE_KEY, theme);
}

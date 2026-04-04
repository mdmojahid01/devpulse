import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ThemeContext,
  type Theme,
  type ThemeContextType,
} from "@/context/theme-context";
import { readStoredTheme, writeStoredTheme } from "@/services/themeStorage";

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    let isMounted = true;

    readStoredTheme().then(storedTheme => {
      if (!isMounted) return;
      setTheme(storedTheme);
      setIsThemeLoaded(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark =
        theme === "dark" || (theme === "system" && mediaQuery.matches);

      root.classList.remove("light", "dark");
      root.classList.add(isDark ? "dark" : "light");
      setResolvedTheme(isDark ? "dark" : "light");
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  useEffect(() => {
    if (!isThemeLoaded) return;
    writeStoredTheme(theme);
  }, [isThemeLoaded, theme]);

  const value = useMemo<ThemeContextType>(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

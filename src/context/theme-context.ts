import { createContext } from "react";

export type Theme = "system" | "dark" | "light";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

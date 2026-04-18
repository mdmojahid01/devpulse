import envConfig from "@/config/envConfig";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";

export function useTabTitle() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

    if (envConfig.IS_CHROME_EXTENSION) {
      document.title = "New tab";
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href =
        resolvedTheme === "dark"
          ? "/chrome-favicon-dark.svg"
          : "/chrome-favicon-light.svg";
    } else {
      link.href =
        resolvedTheme === "dark" ? "/favicon-dark.svg" : "/favicon-light.svg";
    }
  }, [resolvedTheme]);
}

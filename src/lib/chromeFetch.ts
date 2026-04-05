import envConfig from "@/config/envConfig";

// Chrome extension fetch that bypasses CORS
export const chromeFetch = async (
  url: string,
  options?: RequestInit,
): Promise<Response> => {
  // In extension context, use direct fetch (CORS bypassed with host_permissions)
  if (envConfig.IS_CHROME_EXTENSION) {
    return fetch(url, options);
  }

  // In development, use Vite proxy (configured in vite.config.ts)
  // Replace https://github.com with /github proxy path
  const proxyUrl = url.replace("https://github.com", "/github");
  return fetch(proxyUrl, options);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any;

const envConfig = {
  GITHUB_USERNAME: import.meta.env.VITE_GITHUB_USERNAME as string,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  NODE_ENV: import.meta.env.MODE,
  IS_CHROME_EXTENSION: chrome !== undefined && !!chrome.runtime?.id,
  GITHUB_BASE_URL: "https://github.com",
};

export default envConfig;

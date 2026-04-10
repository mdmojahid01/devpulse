import { storage } from "./storage";

export type AppConfig = {
  githubUsername: string;
  leetcodeUsername?: string;
  customQuote?: string;
};

const CONFIG_STORAGE_KEY = "devpulse_config";

export async function readConfig(): Promise<AppConfig | null> {
  return await storage.get<AppConfig>(CONFIG_STORAGE_KEY);
}

export async function writeConfig(config: AppConfig): Promise<void> {
  await storage.set(CONFIG_STORAGE_KEY, config);
}

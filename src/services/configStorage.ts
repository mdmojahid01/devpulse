import { storage } from "./storage";

export type UIVisibility = {
  showGithub: boolean;
  showTodo: boolean;
  showSearch: boolean;
  showLeetcode: boolean;
  showNotes: boolean;
};

export type AppConfig = {
  githubUsername: string;
  leetcodeUsername?: string;
  customQuote?: string;
  uiVisibility?: UIVisibility;
};

export const DEFAULT_UI_VISIBILITY: UIVisibility = {
  showGithub: true,
  showTodo: true,
  showSearch: true,
  showLeetcode: true,
  showNotes: true,
};

const CONFIG_STORAGE_KEY = "devpulse_config";

export async function readConfig(): Promise<AppConfig | null> {
  return await storage.get<AppConfig>(CONFIG_STORAGE_KEY);
}

export async function writeConfig(config: AppConfig): Promise<void> {
  await storage.set(CONFIG_STORAGE_KEY, config);
}

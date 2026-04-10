import { useState, useEffect } from "react";
import {
  readConfig,
  writeConfig,
  type AppConfig,
} from "@/services/configStorage";
import envConfig from "@/config/envConfig";

export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeConfig = async () => {
      let storedConfig = await readConfig();

      // Migrate from env to storage if not configured
      // Storage Config > Env Variable > Settings Modal
      if (!storedConfig && envConfig.GITHUB_USERNAME) {
        const envBasedConfig: AppConfig = {
          githubUsername: envConfig.GITHUB_USERNAME,
        };
        await writeConfig(envBasedConfig);
        storedConfig = envBasedConfig;
      }

      setConfig(storedConfig);
      setIsConfigured(!!storedConfig?.githubUsername);
      setLoading(false);
    };

    initializeConfig();
  }, []);

  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    setIsConfigured(!!newConfig.githubUsername);
  };

  return { config, isConfigured, loading, updateConfig };
};

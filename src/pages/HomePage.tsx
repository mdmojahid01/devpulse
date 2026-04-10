import GithubActivity from "@/components/github/GithubActivity";
import ThemeToggle from "@/components/ThemeToggle";
import TodoList from "@/components/TodoList";
import SettingsModal from "@/components/SettingsModal";
import AppSpinner from "@/components/ui/AppSpinner";
import { Button, Tooltip } from "@heroui/react";
import { FiRefreshCw, FiSettings } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useGithubData } from "@/hooks/useGithubData";
import { useAppConfig } from "@/hooks/useAppConfig";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { useMemo, useState } from "react";

export default function HomePage() {
  const {
    config,
    isConfigured,
    loading: configLoading,
    updateConfig,
  } = useAppConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Auto-show settings on first load if not configured
  const autoShowSettings = useMemo(
    () => !configLoading && !isConfigured && !showSettingsModal,
    [isConfigured, configLoading, showSettingsModal],
  );

  const githubData = useGithubData(config?.githubUsername || "");
  const { refreshData, loading } = githubData;

  const handleGoogleSearch = () => {
    const query = searchQuery.trim();
    if (query) {
      globalThis.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    } else {
      globalThis.location.href = "https://www.google.com";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoogleSearch();
    }
  };

  // Show full page loader only on initial load
  if (configLoading) {
    return (
      <main className="bg-background flex min-h-screen items-center justify-center">
        <AppSpinner
          size="lg"
          color="accent"
          label="Loading your dashboard..."
        />
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen px-4 py-6">
      <div className="mx-auto max-w-[90dvw] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Dev Pulse</h1>
            <p className="text-muted text-sm">
              Your developer activity dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  onPress={refreshData}
                  isDisabled={loading || !isConfigured}
                >
                  <FiRefreshCw
                    className={`size-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">Refresh data</p>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip>
              <Tooltip.Trigger>
                <AppButton
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  onPress={handleGoogleSearch}
                  suffix={<FaGoogle className="size-4" />}
                />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">Open Google</p>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  onPress={() => setShowSettingsModal(true)}
                >
                  <FiSettings className="size-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">Settings</p>
              </Tooltip.Content>
            </Tooltip>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <AppInput
              placeholder="Search Google..."
              ariaLabel="Search Google"
              value={searchQuery}
              onChange={setSearchQuery}
              onKeyDown={handleKeyPress}
              autoFocus
              fullWidth
              inputGroupClassName="h-14 rounded-full"
              prefix={<FaGoogle className="text-muted size-5" />}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <GithubActivity githubData={githubData} />
          </div>
          <div className="border-divider relative lg:border-l lg:pl-6">
            <TodoList />
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={showSettingsModal || autoShowSettings}
        onClose={() => setShowSettingsModal(false)}
        onSave={config => {
          updateConfig(config);
          setShowSettingsModal(false);
        }}
      />
    </main>
  );
}

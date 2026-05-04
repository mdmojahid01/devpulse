import GithubActivity from "@/components/github/GithubActivity";
import ThemeToggle from "@/components/ThemeToggle";
import TodoList from "@/components/TodoList";
import NoteList from "@/components/notes/NoteList";
import SettingsModal from "@/components/SettingsModal";
import AppSpinner from "@/components/ui/AppSpinner";
import Footer from "@/components/Footer";
import { Tooltip } from "@heroui/react";
import { FiRefreshCw, FiSettings, FiGithub, FiFileText } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useGithubData } from "@/hooks/useGithubData";
import { useAppConfig } from "@/hooks/useAppConfig";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { useMemo, useRef, useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import AppKbd from "@/components/ui/AppKbd";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { DEFAULT_UI_VISIBILITY } from "@/services/configStorage";
import AppLink from "@/components/ui/AppLink";
import { site } from "@/config/site";

export default function HomePage() {
  const {
    config,
    isConfigured,
    loading: configLoading,
    updateConfig,
  } = useAppConfig();
  const visibility = config?.uiVisibility || DEFAULT_UI_VISIBILITY;
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-show settings on first load if not configured
  const autoShowSettings = useMemo(
    () => !configLoading && !isConfigured && !showSettingsModal,
    [isConfigured, configLoading, showSettingsModal],
  );

  const { notes } = useNotes();
  const githubData = useGithubData(config?.githubUsername || "");
  const { refreshData, loading } = githubData;

  useGlobalShortcuts([
    {
      key: "e",
      ctrlOrCmd: true,
      handler: () => searchInputRef.current?.focus(),
      description: "Focus search",
      enabled: visibility.showSearch,
    },
  ]);

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
    <main className="bg-background flex min-h-screen flex-col px-4 pt-6">
      <div className="mx-auto w-full max-w-[90dvw] flex-1 space-y-6">
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
                <AppButton
                  variant="outline"
                  // size="sm"
                  isIconOnly
                  onPress={refreshData}
                  isDisabled={loading || !isConfigured}
                >
                  <FiRefreshCw
                    className={`size-4 ${loading ? "animate-spin" : ""}`}
                  />
                </AppButton>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">Refresh data</p>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip>
              <Tooltip.Trigger>
                <AppButton
                  variant="outline"
                  // size="sm"
                  isIconOnly
                  onPress={handleGoogleSearch}
                  suffix={<FaGoogle className="size-4" />}
                />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="flex items-center gap-1 text-xs">
                  Open Google <AppKbd keyValue="G" cmdOrCtrl={true} />
                </p>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip>
              <Tooltip.Trigger>
                <AppButton
                  variant="outline"
                  // size="sm"
                  isIconOnly
                  onPress={() => setShowSettingsModal(true)}
                >
                  <FiSettings className="size-4" />
                </AppButton>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">Settings</p>
              </Tooltip.Content>
            </Tooltip>
            {visibility.showNotes && (
              <Tooltip>
                <Tooltip.Trigger>
                  <div className="relative">
                    <AppButton
                      variant="outline"
                      isIconOnly
                      onPress={() => setShowNotesDrawer(true)}
                    >
                      <FiFileText className="size-4" />
                    </AppButton>
                    {notes.length > 0 && (
                      <span className="bg-accent text-background absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
                        {notes.length > 99 ? "99+" : notes.length}
                      </span>
                    )}
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p className="text-xs">Notes</p>
                </Tooltip.Content>
              </Tooltip>
            )}
            <ThemeToggle />

            <div className="bg-muted mx-1 h-5 w-0.5" />

            <Tooltip>
              <Tooltip.Trigger>
                <AppLink
                  asButton
                  variant="outline"
                  // size="sm"
                  isIconOnly
                  href={site.githubRepoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  suffix={<FiGithub className="size-4" />}
                />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">View on GitHub</p>
              </Tooltip.Content>
            </Tooltip>
          </div>
        </div>

        {visibility.showSearch && (
          <div className="bg-background/80 sticky top-0 z-10 -mx-4 px-4 py-3 backdrop-blur-md">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <AppInput
                  ref={searchInputRef}
                  placeholder="Search Google..."
                  ariaLabel="Search Google"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onKeyDown={handleKeyPress}
                  autoFocus
                  fullWidth
                  inputGroupClassName="h-14 rounded-full"
                  prefix={<FaGoogle className="text-muted size-5" />}
                  suffix={
                    <AppKbd keyValue="E" cmdOrCtrl={true} className="mr-2" />
                  }
                />
              </div>
            </div>
          </div>
        )}
        {(visibility.showGithub || visibility.showTodo) && (
          <div
            className={`grid grid-cols-1 gap-6 ${
              visibility.showGithub && visibility.showTodo
                ? "lg:grid-cols-2"
                : "mx-auto max-w-2xl"
            }`}
          >
            {visibility.showGithub && (
              <div className="min-w-0">
                <GithubActivity
                  githubData={githubData}
                  username={config?.githubUsername || ""}
                />
              </div>
            )}
            {visibility.showTodo && (
              <div
                className={`border-divider relative min-w-0 ${
                  visibility.showGithub ? "lg:border-l lg:pl-6" : ""
                }`}
              >
                <TodoList />
              </div>
            )}
          </div>
        )}
      </div>

      <SettingsModal
        isOpen={showSettingsModal || autoShowSettings}
        onClose={() => setShowSettingsModal(false)}
        onSave={config => {
          updateConfig(config);
          setShowSettingsModal(false);
        }}
      />
      {visibility.showNotes && (
        <NoteList isOpen={showNotesDrawer} onOpenChange={setShowNotesDrawer} />
      )}
      <Footer />
    </main>
  );
}

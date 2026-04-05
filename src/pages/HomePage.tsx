import GithubActivity from "@/components/github/GithubActivity";
import ThemeToggle from "@/components/ThemeToggle";
import { Button, Tooltip } from "@heroui/react";
import { FiRefreshCw } from "react-icons/fi";
import { useGithubData } from "@/hooks/useGithubData";
import envConfig from "@/config/envConfig";

export default function HomePage() {
  const { refreshData, loading } = useGithubData(envConfig.GITHUB_USERNAME);

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
                  isDisabled={loading}
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
            <ThemeToggle />
          </div>
        </div>
        <div className="">
          <GithubActivity />
        </div>
      </div>
    </main>
  );
}

import {
  FiGithub,
  FiGitCommit,
  FiActivity,
  FiGrid,
  FiCalendar,
} from "react-icons/fi";
import { useGithubData } from "@/hooks/useGithubData";
import AppSpinner from "@/components/ui/AppSpinner";
import AppChip from "@/components/ui/AppChip";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";
import AppSelect, { ListBox } from "@/components/ui/AppSelect";
import { formatDate } from "@/lib/dateFormat";
import { useState } from "react";
import GithubStyleGraph from "./GithubStyleGraph";
import MonthlyStyleGraph from "./MonthlyStyleGraph";

type GithubActivityProps = {
  githubData: ReturnType<typeof useGithubData>;
};

function GithubActivity({ githubData }: Readonly<GithubActivityProps>) {
  const {
    contributions,
    repos,
    todayCommits,
    totalContributions,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    availableYears,
  } = githubData;

  const [viewMode, setViewMode] = useState<"github" | "monthly">("github");

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <AppSpinner size="lg" label="Loading GitHub activity..." />
      </div>
    );
  }

  if (error) {
    return (
      <AppCard className="p-6">
        <AppCard.Content className="text-danger text-center">
          {error}
        </AppCard.Content>
      </AppCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AppCard className="p-4">
          <AppCard.Content className="flex items-center gap-3">
            <FiGitCommit className="text-accent text-2xl" />
            <div>
              <p className="text-muted text-sm">Today's Pushes</p>
              <p className="text-center text-2xl font-bold">{todayCommits}</p>
            </div>
          </AppCard.Content>
        </AppCard>

        <AppCard className="p-4">
          <AppCard.Content className="flex items-center gap-3">
            <FiActivity className="text-success text-2xl" />
            <div>
              <p className="text-muted text-sm">Total Contributions</p>
              <p className="text-center text-2xl font-bold">
                {totalContributions}
              </p>
            </div>
          </AppCard.Content>
        </AppCard>

        <AppCard className="p-4">
          <AppCard.Content className="flex items-center gap-3">
            <FiGithub className="text-2xl" />
            <div>
              <p className="text-muted text-sm">Active Repos</p>
              <p className="text-center text-2xl font-bold">{repos.length}</p>
            </div>
          </AppCard.Content>
        </AppCard>
      </div>

      {/* Contribution Calendar */}
      <AppCard className="p-6">
        <AppCard.Header className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-lg font-semibold">Contribution Calendar</h3>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex gap-1 rounded-lg border p-1">
              <AppButton
                size="sm"
                variant={viewMode === "github" ? "primary" : "ghost"}
                onPress={() => setViewMode("github")}
                className="min-w-0 rounded-lg px-2"
                isIconOnly
                prefix={<FiGrid className="text-sm" />}
              />
              <AppButton
                size="sm"
                variant={viewMode === "monthly" ? "primary" : "ghost"}
                onPress={() => setViewMode("monthly")}
                className="min-w-0 rounded-lg px-2"
                isIconOnly
                prefix={<FiCalendar className="text-sm" />}
              />
            </div>
            {/* Year Selector */}
            {availableYears.length > 0 && (
              <AppSelect
                className="w-32"
                value={selectedYear.toString()}
                onChange={value => {
                  if (value) {
                    const val = value as string;
                    setSelectedYear(val === "last" ? "last" : Number(val));
                  }
                }}
              >
                <AppSelect.Trigger>
                  <AppSelect.Value />
                  <AppSelect.Indicator />
                </AppSelect.Trigger>
                <AppSelect.Popover>
                  <ListBox>
                    <ListBox.Item id="last" textValue="Last Year">
                      Last Year
                    </ListBox.Item>
                    {availableYears.map(year => (
                      <ListBox.Item
                        id={year.toString()}
                        key={year}
                        textValue={year.toString()}
                      >
                        {year}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </AppSelect.Popover>
              </AppSelect>
            )}
          </div>
        </AppCard.Header>
        <AppCard.Content>
          {viewMode === "github" ? (
            <GithubStyleGraph
              contributions={contributions?.contributions || []}
            />
          ) : (
            <MonthlyStyleGraph
              contributions={contributions?.contributions || []}
            />
          )}
        </AppCard.Content>
      </AppCard>

      {/* Recent Activity in Public Repos */}
      <AppCard className="p-6">
        <AppCard.Header className="pb-4">
          <h3 className="text-lg font-semibold">
            Recent Activity in Public Repos
          </h3>
        </AppCard.Header>
        <AppCard.Content>
          <div className="space-y-3">
            {repos.map(repo => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-surface-hover block rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold">{repo.name}</h4>
                    {repo.description && (
                      <p className="text-muted mt-1 text-sm">
                        {repo.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {repo.language && (
                        <AppChip size="sm">{repo.language}</AppChip>
                      )}
                      {repo.stargazers_count > 0 && (
                        <AppChip size="sm">⭐ {repo.stargazers_count}</AppChip>
                      )}
                    </div>
                  </div>
                  <span className="text-muted text-xs">
                    {formatDate(repo.updated_at)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </AppCard.Content>
      </AppCard>
    </div>
  );
}

export default GithubActivity;

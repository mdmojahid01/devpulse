import { useState, useEffect, useCallback, useMemo } from "react";
import {
  scrapeContributions,
  fetchRecentRepos,
  fetchRecentEvents,
  getTodayCommitCount,
  type Response,
  type GithubRepo,
  type GithubEvent,
} from "@/services/github";
import { cache } from "@/lib/cache";

type UseGithubDataReturn = {
  contributions: Response | null;
  repos: GithubRepo[];
  todayCommits: number;
  totalContributions: number;
  loading: boolean;
  error: string | null;
  selectedYear: "last" | number;
  setSelectedYear: (year: "last" | number) => void;
  availableYears: number[];
  refreshData: () => Promise<void>;
};

export const useGithubData = (username: string): UseGithubDataReturn => {
  const [contributions, setContributions] = useState<Response | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<"last" | number>("last");
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const fetchData = useCallback(
    async (skipCache = false) => {
      if (!username) {
        setError("GitHub username not configured");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (skipCache) {
          await cache.clear();
        }

        const yearQuery = selectedYear === "last" ? "last" : [selectedYear];

        const [contributionsData, reposData, eventsData] = await Promise.all([
          scrapeContributions(username, { y: yearQuery }),
          fetchRecentRepos(username, 10),
          fetchRecentEvents(username, 100),
        ]);

        setContributions(contributionsData as Response);
        setRepos(reposData);
        setEvents(eventsData);

        // Extract available years from contributions
        if (selectedYear === "last" && contributionsData.total) {
          const years = Object.keys(contributionsData.total)
            .filter(key => key !== "lastYear")
            .map(Number)
            .sort((a, b) => b - a);
          setAvailableYears(years);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    },
    [username, selectedYear],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const todayCommits = useMemo(() => getTodayCommitCount(events), [events]);
  const totalContributions = contributions?.total?.lastYear ?? 0;

  return {
    contributions,
    repos,
    todayCommits,
    totalContributions,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    availableYears,
    refreshData,
  };
};

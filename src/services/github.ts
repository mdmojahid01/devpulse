import { chromeFetch } from "@/lib/chromeFetch";
import { cache } from "@/lib/cache";
import envConfig from "@/config/envConfig";

type Level = 0 | 1 | 2 | 3 | 4;

type Contribution = {
  date: string;
  count: number;
  level: Level;
};

export type Response = {
  total: {
    [year: number]: number;
    [year: string]: number; // 'lastYear;
  };
  contributions: Array<Contribution>;
};

export type NestedResponse = {
  total: {
    [year: number]: number;
    [year: string]: number; // 'lastYear;
  };
  contributions: Record<number, Record<number, Record<number, Contribution>>>; // [y][m][d]
};

export const scrapeContributions = async (
  username: string,
  query: {
    y: "last" | "all" | Array<number>;
    format?: "nested";
  },
): Promise<Response | NestedResponse> => {
  const cacheKey = `contributions_${username}_${query.y}_${query.format || "default"}`;
  const cached = await cache.get<Response | NestedResponse>(cacheKey);
  if (cached) return cached;

  let requests = [];

  if (query.y === "last") {
    requests.push(scrapeYear(username, "lastYear", query.format));
  } else {
    const yearLinks = await scrapeYearLinks(username, query.y);
    requests = yearLinks.map(link =>
      scrapeYear(username, link.year, query.format),
    );
  }

  const result = await Promise.all(requests).then(contributions => {
    if (query.format === "nested") {
      return (contributions as Array<NestedResponse>).reduce(
        (resp, curr) => ({
          total: { ...resp.total, ...curr.total },
          contributions: { ...resp.contributions, ...curr.contributions },
        }),
        {
          total: {},
          contributions: {},
        },
      );
    }

    return (contributions as Array<Response>).reduce(
      (resp, curr) => {
        return {
          total: { ...resp.total, ...curr.total },
          contributions: [...resp.contributions, ...curr.contributions],
        };
      },
      {
        total: {},
        contributions: [],
      },
    );
  });

  await cache.set(cacheKey, result, 3600000); // 1 hour
  return result;
};

const scrapeYear = async (
  username: string,
  year: number | "lastYear",
  format?: "nested",
): Promise<Response | NestedResponse> => {
  const url =
    year === "lastYear"
      ? `${envConfig.GITHUB_BASE_URL}/users/${username}/contributions`
      : `${envConfig.GITHUB_BASE_URL}/users/${username}/contributions?tab=overview&from=${year}-12-01&to=${year}-12-31`;

  const res = await chromeFetch(url, requestOptions(username));
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  const days = Array.from(
    doc.querySelectorAll(".js-calendar-graph-table .ContributionCalendar-day"),
  );
  const sortedDays = days.toSorted((a, b) => {
    const dateA = a.getAttribute("data-date") ?? "";
    const dateB = b.getAttribute("data-date") ?? "";

    return dateA.localeCompare(dateB, "en");
  });

  const h2 = doc.querySelector(".js-yearly-contributions h2");
  const totalMatch = /^([0-9,]+)\s/.exec(h2?.textContent?.trim() ?? "");

  if (!totalMatch) {
    throw new Error("Failed parsing total contributions count");
  }

  const total = Number.parseInt(totalMatch[0].replaceAll(",", ""));

  // Required for contribution count
  const tooltipsByDayId = Array.from(
    doc.querySelectorAll(".js-calendar-graph tool-tip"),
  ).reduce<Record<string, Element>>((map, elem) => {
    const forAttr = elem.getAttribute("for");
    if (forAttr) map[forAttr] = elem;
    return map;
  }, {});

  const response = {
    total: {
      [year]: total,
    },
    contributions: {},
  };

  if (format === "nested") {
    return sortedDays.reduce<NestedResponse>((data, day) => {
      const { date, contribution } = parseDay(day, tooltipsByDayId);
      const [y, m, d] = date;

      data.contributions[y] ??= {};
      data.contributions[y][m] ??= {};
      data.contributions[y][m][d] = contribution;

      return data;
    }, response);
  }

  return {
    ...response,
    contributions: sortedDays.map(
      day => parseDay(day, tooltipsByDayId).contribution,
    ),
  };
};

const parseDay = (day: Element, tooltipsByDayId: Record<string, Element>) => {
  const attr = {
    id: day.getAttribute("id") ?? "",
    date: day.getAttribute("data-date") ?? "",
    level: day.getAttribute("data-level") ?? "",
  };

  if (!attr.date) {
    throw new Error("Failed parsing contribution date attribute");
  }

  if (!attr.level) {
    throw new Error("Failed parsing contribution level attribute");
  }

  let count = 0;

  const tooltip = tooltipsByDayId[attr.id];
  if (tooltip?.textContent) {
    const countMatch = /^\d+/.exec(tooltip.textContent.trim());
    if (countMatch) {
      count = Number.parseInt(countMatch[0]);
    }
  }

  const level = Number.parseInt(attr.level) as Level;

  if (Number.isNaN(count)) {
    throw new TypeError("Failed parsing contribution count");
  }

  if (Number.isNaN(level)) {
    throw new TypeError("Failed parsing contribution level");
  }

  const contribution = {
    date: attr.date,
    count,
    level,
  } satisfies Contribution;

  return {
    date: attr.date.split("-").map((d: string) => Number.parseInt(d)),
    contribution,
  };
};

const scrapeYearLinks = async (
  username: string,
  years: "all" | Array<number>,
) => {
  const url = `${envConfig.GITHUB_BASE_URL}/${username}?action=show&controller=profiles&tab=contributions&user_id=${username}`;
  const res = await chromeFetch(url, requestOptions(username));
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  return Array.from(doc.querySelectorAll(".js-year-link"))
    .map(a => ({ year: Number.parseInt(a.textContent?.trim() ?? "0") }))
    .filter(link => (years === "all" ? true : years.includes(link.year)));
};

const requestOptions = (username: string): RequestInit => ({
  method: "GET",
  headers: {
    accept: "text/html",
    referer: `https://github.com/${username}`,
    "x-requested-with": "XMLHttpRequest",
  },
});

// GitHub API Types
export type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

export type GithubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    repository_id?: number;
    push_id?: number;
    ref?: string;
    head?: string;
    before?: string;
  };
};

// Validate if a GitHub user exists
export const validateGithubUser = async (
  username: string,
): Promise<boolean> => {
  const response = await chromeFetch(
    `https://api.github.com/users/${username}`,
    { headers: { Accept: "application/vnd.github.v3+json" } },
  );
  return response.ok;
};

// Fetch user's recent repositories
export const fetchRecentRepos = async (
  username: string,
  limit = 10,
): Promise<GithubRepo[]> => {
  const cacheKey = `repos_${username}_${limit}`;
  const cached = await cache.get<GithubRepo[]>(cacheKey);
  if (cached) return cached;

  const response = await chromeFetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repos: ${response.statusText}`);
  }

  const data = await response.json();
  await cache.set(cacheKey, data, 1800000); // 30 minutes
  return data;
};

// Fetch user's recent events
export const fetchRecentEvents = async (
  username: string,
  limit = 100,
): Promise<GithubEvent[]> => {
  const cacheKey = `events_${username}_${limit}`;
  const cached = await cache.get<GithubEvent[]>(cacheKey);
  if (cached) return cached;

  const response = await chromeFetch(
    `https://api.github.com/users/${username}/events/public?per_page=${limit}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }

  const data = await response.json();
  await cache.set(cacheKey, data, 300000); // 5 minutes
  return data;
};

// Calculate today's commit count from events
export const getTodayCommitCount = (events: GithubEvent[]): number => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const todayPushEvents = events.filter(event => {
    if (event.type !== "PushEvent") return false;
    const eventTime = new Date(event.created_at);
    return eventTime >= todayStart && eventTime < todayEnd;
  });

  return todayPushEvents.length;
};

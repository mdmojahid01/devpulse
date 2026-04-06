import { parseDateString } from "@/lib/dateFormat";

export function getMonthLabelsWithPositions(
  weeks: Array<Array<{ date: string; count: number; level: number }>>,
) {
  const monthLabels: Array<{ label: string; weekIndex: number }> = [];
  let lastMonth = "";

  weeks.forEach((week, weekIndex) => {
    if (week.length === 0) return;

    // Check all days in the week to find when a new month starts
    const sortedWeek = [...week].sort((a, b) => a.date.localeCompare(b.date));

    for (const day of sortedWeek) {
      const date = parseDateString(day.date);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      // If this is a new month, mark this column
      if (monthName !== lastMonth) {
        monthLabels.push({
          label: monthName,
          weekIndex: weekIndex,
        });
        lastMonth = monthName;
        break; // Only add the label once per week
      }
    }
  });

  return monthLabels;
}

export function groupByMonth(
  contributions: Array<{ date: string; count: number; level: number }>,
) {
  const monthsMap = new Map<
    string,
    {
      label: string;
      days: Array<{ date: string; count: number; level: number }>;
      total: number;
    }
  >();

  contributions.forEach(day => {
    const date = parseDateString(day.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!monthsMap.has(monthKey)) {
      monthsMap.set(monthKey, {
        label: monthLabel,
        days: [],
        total: 0,
      });
    }

    const monthData = monthsMap.get(monthKey)!;
    monthData.days.push(day);
    monthData.total += day.count;
  });

  // Convert to array and sort by date
  return Array.from(monthsMap.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, data]) => ({ key, ...data }));
}

export const LEVEL_COLORS = [
  "bg-surface-hover",
  "bg-success/30",
  "bg-success/50",
  "bg-success/70",
  "bg-success",
];

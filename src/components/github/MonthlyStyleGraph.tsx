import AppCard from "@/components/ui/AppCard";
import { groupByMonth, LEVEL_COLORS } from "@/lib/githubUtils";
import MonthGrid from "./MonthGrid";

function MonthlyStyleGraph({
  contributions,
}: Readonly<{
  contributions: Array<{ date: string; count: number; level: number }>;
}>) {
  // Group contributions by month
  const monthsData = groupByMonth(contributions);

  return (
    <div className="space-y-4">
      {/* Month boxes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {monthsData.map(monthData => (
          <AppCard key={monthData.key} className="p-4">
            <AppCard.Header className="pb-3">
              <h4 className="text-sm font-semibold">{monthData.label}</h4>
              <p className="text-muted text-xs">
                {monthData.total} contribution{monthData.total === 1 ? "" : "s"}
              </p>
            </AppCard.Header>
            <AppCard.Content>
              <MonthGrid days={monthData.days} levelColors={LEVEL_COLORS} />
            </AppCard.Content>
          </AppCard>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-muted text-xs">Less</span>
        {LEVEL_COLORS.map((color, index) => (
          <div
            key={`legend-${index}`}
            className={`h-2.5 w-2.5 rounded-sm ${color}`}
          />
        ))}
        <span className="text-muted text-xs">More</span>
      </div>
    </div>
  );
}

export default MonthlyStyleGraph;

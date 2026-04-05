import AppTooltip from "@/components/ui/AppTooltip";
import { formatDate } from "@/lib/dateFormat";
import { getMonthLabelsWithPositions, LEVEL_COLORS } from "@/lib/githubUtils";

function GithubStyleGraph({
  contributions,
}: Readonly<{
  contributions: Array<{ date: string; count: number; level: number }>;
}>) {
  // Group contributions by week (Sunday to Saturday)
  const weeks: Array<Array<{ date: string; count: number; level: number }>> =
    [];
  let currentWeek: Array<{ date: string; count: number; level: number }> = [];

  contributions.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay(); // 0 = Sunday, 6 = Saturday

    // Start a new week on Sunday (except for the first day)
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(day);

    // Push the last week
    if (index === contributions.length - 1) {
      weeks.push(currentWeek);
    }
  });

  // Get month labels with their starting column positions
  const monthLabels = getMonthLabelsWithPositions(weeks);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="relative mb-2 flex h-4 gap-0.75">
          {/* Empty space for day labels */}
          <div className="w-7" />
          {/* Month labels positioned at their starting columns */}
          <div className="relative flex gap-0.75">
            {weeks.map((_, weekIndex) => {
              const monthLabel = monthLabels.find(
                m => m.weekIndex === weekIndex,
              );
              return (
                <div key={`month-col-${weekIndex}`} className="relative w-2.5">
                  {monthLabel && (
                    <span className="text-muted absolute top-0 left-0 text-xs whitespace-nowrap">
                      {monthLabel.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex gap-0.75">
          {/* Day labels */}
          <div className="flex w-7 flex-col gap-0.75">
            <div className="h-2.5" /> {/* Sunday - empty */}
            <span className="text-muted h-2.5 text-[10px] leading-2.5">
              Mon
            </span>
            <div className="h-2.5" /> {/* Tuesday - empty */}
            <span className="text-muted h-2.5 text-[10px] leading-2.5">
              Wed
            </span>
            <div className="h-2.5" /> {/* Thursday - empty */}
            <span className="text-muted h-2.5 text-[10px] leading-2.5">
              Fri
            </span>
            <div className="h-2.5" /> {/* Saturday - empty */}
          </div>

          {/* Contribution squares */}
          <div className="flex gap-0.75">
            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="flex flex-col gap-0.75">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  // dayIndex: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
                  const day = week.find(
                    d => new Date(d.date).getDay() === dayIndex,
                  );

                  if (!day) {
                    return (
                      <div
                        key={`empty-${weekIndex}-${dayIndex}`}
                        className="h-2.5 w-2.5"
                      />
                    );
                  }

                  return (
                    <AppTooltip key={`day-${day.date}`}>
                      <AppTooltip.Trigger>
                        <div
                          className={`h-2.5 w-2.5 rounded-sm ${LEVEL_COLORS[day.level]} cursor-pointer transition-transform hover:scale-125`}
                        />
                      </AppTooltip.Trigger>
                      <AppTooltip.Content>
                        <div className="p-1">
                          <p className="text-xs">
                            <span className="font-semibold">
                              {day.count === 0
                                ? "No contributions"
                                : `${day.count} contribution${day.count > 1 ? "s" : ""}`}
                            </span>
                            {" on "}
                            <span className="text-muted">
                              {formatDate(day.date)}
                            </span>
                          </p>
                        </div>
                      </AppTooltip.Content>
                    </AppTooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-muted text-xs">Less</span>
          {LEVEL_COLORS.map((color, index) => (
            <div
              key={`legend-${color}-${index}`}
              className={`h-2.5 w-2.5 rounded-sm ${color}`}
            />
          ))}
          <span className="text-muted text-xs">More</span>
        </div>
      </div>
    </div>
  );
}

export default GithubStyleGraph;

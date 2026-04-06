import AppTooltip from "@/components/ui/AppTooltip";
import { formatDate, parseDateString } from "@/lib/dateFormat";

function MonthGrid({
  days,
  levelColors,
}: Readonly<{
  days: Array<{ date: string; count: number; level: number }>;
  levelColors: string[];
}>) {
  // Group days by week for this month
  const weeks: Array<
    Array<{ date: string; count: number; level: number } | null>
  > = [];
  let currentWeek: Array<{
    date: string;
    count: number;
    level: number;
  } | null> = [];

  // Get the first day of the month to determine starting day of week
  const firstDate = parseDateString(days[0].date);
  const startDayOfWeek = firstDate.getDay(); // 0 = Sunday

  // Fill empty days at the start of the first week
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Add all days
  days.forEach(day => {
    currentWeek.push(day);

    // If week is complete (7 days), start a new week
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Fill remaining days in the last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="space-y-2">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={`day-label-${day}-${index}`}
            className="text-muted text-center text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${weekIndex}-${dayIndex}`}
                    className="h-2.5"
                  />
                );
              }

              return (
                <AppTooltip key={day.date}>
                  <AppTooltip.Trigger>
                    <div
                      className={`h-2.5 w-full rounded-sm ${levelColors[day.level]} cursor-pointer transition-transform hover:scale-110`}
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
  );
}

export default MonthGrid;

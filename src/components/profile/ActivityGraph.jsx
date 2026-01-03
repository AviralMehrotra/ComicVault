import React from "react";
import Tooltip from "@/components/ui/Tooltip";

const ActivityGraph = ({ data = [] }) => {
  // Generate last 365 days
  const generateCalendarData = () => {
    const today = new Date();
    const days = [];
    const oneYearAgo = new Date();
    oneYearAgo.setDate(today.getDate() - 364); // 52 weeks * 7 days = 364

    // Create a map of date string to count for O(1) lookup
    const activityMap = {};
    data.forEach((dateStr) => {
      const date = new Date(dateStr).toDateString();
      activityMap[date] = (activityMap[date] || 0) + 1;
    });

    for (let i = 0; i < 365; i++) {
      const date = new Date(oneYearAgo);
      date.setDate(oneYearAgo.getDate() + i);
      const dateString = date.toDateString();

      days.push({
        date: date,
        dateString: dateString,
        count: activityMap[dateString] || 0,
      });
    }
    return days;
  };

  const calendarData = generateCalendarData();

  // Group by weeks for the grid
  const weeks = [];
  let currentWeek = [];

  calendarData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === calendarData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Determine color based on count
  const getColorClass = (count) => {
    if (count === 0) return "bg-muted"; // No activity
    if (count === 1) return "bg-chart-5"; // Low
    if (count === 2) return "bg-chart-4"; // Medium-Low
    if (count === 3) return "bg-chart-3"; // Medium
    if (count === 4) return "bg-chart-2"; // High
    return "bg-chart-1"; // Very High
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[700px]">
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <Tooltip
                  key={`${weekIndex}-${dayIndex}`}
                  content={`${
                    day.count
                  } activities on ${day.date.toLocaleDateString()}`}
                >
                  <div
                    className={`w-3 h-3 rounded-sm ${getColorClass(
                      day.count
                    )} hover:ring-1 hover:ring-ring transition-all`}
                  />
                </Tooltip>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-chart-5" />
            <div className="w-3 h-3 rounded-sm bg-chart-4" />
            <div className="w-3 h-3 rounded-sm bg-chart-3" />
            <div className="w-3 h-3 rounded-sm bg-chart-2" />
            <div className="w-3 h-3 rounded-sm bg-chart-1" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityGraph;

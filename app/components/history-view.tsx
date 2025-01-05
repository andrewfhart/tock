import { useEffect, useState } from "react";
import { Activity } from "~/types/activity";
import { getActivityTimes, formatTime, getDateKey } from "~/utils/storage";
import { calculateDurations } from "~/utils/duration";
import { Card } from "~/components/ui/card";

interface HistoryViewProps {
  activities: Activity[];
  date: Date;
}

export function HistoryView({ activities, date }: HistoryViewProps) {
  const [activityDurations, setActivityDurations] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const times = getActivityTimes();
    const dateKey = getDateKey(date);
    const dayActivities = times[dateKey] || [];

    const { durations } = calculateDurations(dayActivities, date);
    setActivityDurations(durations);
  }, [date]);

  return (
    <Card className="p-4">
      <div className="text-lg font-semibold mb-4">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>

      {activities.map((activity) => {
        const duration = activityDurations[activity.id] || 0;
        const progress = activity.timeGoal
          ? (duration / activity.timeGoal) * 100
          : 0;

        return (
          <div key={activity.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{activity.label}</span>
              <span>{formatTime(duration)}</span>
            </div>
            {activity.timeGoal && (
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor:
                      activity.goalType === "more"
                        ? progress >= 100
                          ? "rgb(34 197 94)"
                          : "rgb(239 68 68)"
                        : activity.goalType === "less"
                        ? progress >= 100
                          ? "rgb(239 68 68)"
                          : "rgb(34 197 94)"
                        : "rgb(59 130 246)",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
}

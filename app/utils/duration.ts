import { Activity, ActivityTime } from "~/types/activity";
import { getActivityTimes, getDateKey } from "~/utils/storage";

export function calculateProgress(activity: Activity): number {
  if (!activity.timeGoal) return 0;

  const times = getActivityTimes();
  const dateKey = getDateKey();
  const dayActivities = times[dateKey] || [];

  // Calculate total minutes spent on this activity today
  const totalMinutes = dayActivities
    .filter((time) => time.activityId === activity.id)
    .reduce((sum, time) => {
      const duration =
        ((time.endTime || Date.now()) - time.startTime) / 1000 / 60;
      return sum + duration;
    }, 0);

  // Convert to percentage based on daily goal
  return Math.min(100, (totalMinutes / activity.timeGoal) * 100);
}

interface DurationCalculationResult {
  durations: Record<string, number>;
  elapsedMinutes: number;
  totalTrackedMinutes: number;
}

export function calculateDurations(
  dayActivities: ActivityTime[],
  date: Date
): DurationCalculationResult {
  const durations: Record<string, number> = {};

  // Calculate durations for known activities
  dayActivities.forEach((activity) => {
    if (activity.activityId === "unknown") return;
    const duration =
      ((activity.endTime || Date.now()) - activity.startTime) / 1000 / 60;
    durations[activity.activityId] =
      (durations[activity.activityId] || 0) + duration;
  });

  // Calculate total elapsed minutes for the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  const elapsedMinutes = Math.min(
    (Math.min(Date.now(), endOfDay.getTime()) - startOfDay.getTime()) /
      1000 /
      60,
    24 * 60
  );

  // Calculate total tracked minutes
  const totalTrackedMinutes = Object.values(durations).reduce(
    (sum, duration) => sum + duration,
    0
  );

  // Set unknown duration
  durations["unknown"] = Math.max(0, elapsedMinutes - totalTrackedMinutes);

  return { durations, elapsedMinutes, totalTrackedMinutes };
}

import { Activity, ActivityTime, DailyActivities } from "~/types/activity";

const ACTIVITIES_KEY = "timeTracker_activities";
const ACTIVITY_TIMES_KEY = "timeTracker_activityTimes";

export function getStoredActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function storeActivity(activity: Activity) {
  const activities = getStoredActivities();
  activities.push(activity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

export function getActivityTimes(): DailyActivities {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(ACTIVITY_TIMES_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function storeActivityTime(date: string, activityTime: ActivityTime) {
  const times = getActivityTimes();
  if (!times[date]) {
    times[date] = [];
  }
  // End the previous activity if it exists
  const lastActivity = times[date][times[date].length - 1];
  if (lastActivity && !lastActivity.endTime) {
    lastActivity.endTime = activityTime.startTime;
  }
  // Only store the activity if it's not the "unknown" activity
  if (activityTime.activityId !== "unknown") {
    times[date].push(activityTime);
  }
  localStorage.setItem(ACTIVITY_TIMES_KEY, JSON.stringify(times));
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}

export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export function getActivity(id: string): Activity | undefined {
  const activities = getStoredActivities();
  return activities.find((a) => a.id === id);
}

export function updateActivity(id: string, updatedActivity: Activity) {
  const activities = getStoredActivities();
  const index = activities.findIndex((a) => a.id === id);

  if (index !== -1) {
    activities[index] = { ...updatedActivity, id };
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  }
}

export function deleteActivity(id: string) {
  // Remove from activities list
  const activities = getStoredActivities();
  const filteredActivities = activities.filter((a) => a.id !== id);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filteredActivities));

  // Remove from activity times
  const times = getActivityTimes();
  Object.keys(times).forEach((date) => {
    times[date] = times[date].filter((time) => time.activityId !== id);
  });
  localStorage.setItem(ACTIVITY_TIMES_KEY, JSON.stringify(times));
}

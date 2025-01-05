import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Plus, Bug } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ActivityButton } from "~/components/activity-button";
import { CreateActivity } from "~/components/create-activity";
import { HistoryView } from "~/components/history-view";
import { DebugView } from "~/components/debug-view";
import { Activity } from "~/types/activity";
import {
  getStoredActivities,
  storeActivity,
  storeActivityTime,
  getActivityTimes,
  formatTime,
  getDateKey,
} from "~/utils/storage";

import { useSwipeable } from "react-swipeable";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const DEFAULT_ACTIVITY: Activity = {
  id: "unknown",
  label: "Unknown (Unallocated)",
};

export default function TimeTracker() {
  const [activities, setActivities] = useState<Activity[]>([DEFAULT_ACTIVITY]);
  const [activeActivityId, setActiveActivityId] = useState<string>(
    DEFAULT_ACTIVITY.id
  );
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showDebugView, setShowDebugView] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"main" | "history">("main");
  const [activityDurations, setActivityDurations] = useState<
    Record<string, number>
  >({});

  // Load activities from storage
  useEffect(() => {
    const stored = getStoredActivities();
    setActivities([DEFAULT_ACTIVITY, ...stored]);
  }, []);

  // Update activity durations
  useEffect(() => {
    const interval = setInterval(() => {
      const times = getActivityTimes();
      const dateKey = getDateKey(currentDate);
      const dayActivities = times[dateKey] || [];

      const durations: Record<string, number> = {};

      // Calculate durations for known activities
      dayActivities.forEach((activity) => {
        if (activity.activityId === "unknown") return; // Skip unknown activity
        const duration =
          ((activity.endTime || Date.now()) - activity.startTime) / 1000 / 60;
        durations[activity.activityId] =
          (durations[activity.activityId] || 0) + duration;
      });

      // Calculate total elapsed minutes for today
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const elapsedMinutes = (Date.now() - startOfDay.getTime()) / 1000 / 60;

      // Calculate total tracked minutes
      const totalTrackedMinutes = Object.values(durations).reduce(
        (sum, duration) => sum + duration,
        0
      );

      // Set unknown duration as the difference
      durations["unknown"] = Math.max(0, elapsedMinutes - totalTrackedMinutes);

      setActivityDurations(durations);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (view === "main") {
        setView("history");
      } else {
        setCurrentDate(
          new Date(currentDate.setDate(currentDate.getDate() - 1))
        );
      }
    },
    onSwipedRight: () => {
      if (
        view === "history" &&
        getDateKey(currentDate) === getDateKey(new Date())
      ) {
        setView("main");
      } else if (view === "history") {
        setCurrentDate(
          new Date(currentDate.setDate(currentDate.getDate() + 1))
        );
      }
    },
  });

  const handleActivityClick = (activityId: string) => {
    if (activityId === activeActivityId) {
      setActiveActivityId(DEFAULT_ACTIVITY.id);
    } else {
      setActiveActivityId(activityId);
    }

    storeActivityTime(getDateKey(), {
      activityId,
      startTime: Date.now(),
    });
  };

  const handleCreateActivity = (activity: Activity) => {
    storeActivity(activity);
    setActivities([...activities, activity]);
    setShowCreateActivity(false);
  };

  if (showCreateActivity) {
    return (
      <CreateActivity
        onSave={handleCreateActivity}
        onCancel={() => setShowCreateActivity(false)}
      />
    );
  }

  if (showDebugView) {
    return <DebugView onClose={() => setShowDebugView(false)} />;
  }

  if (view === "history") {
    return (
      <div {...handlers}>
        <HistoryView activities={activities} date={currentDate} />
      </div>
    );
  }

  return (
    <div {...handlers} className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-mono">
          {formatTime(activityDurations[activeActivityId] || 0)}
        </div>
        <Button size="icon" onClick={() => setShowCreateActivity(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {activities.map((activity) => (
          <ActivityButton
            key={activity.id}
            activity={activity}
            isActive={activity.id === activeActivityId}
            timeSpent={activityDurations[activity.id] || 0}
            onClick={() => handleActivityClick(activity.id)}
          />
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={() => setShowDebugView(true)}
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug View
      </Button>
    </div>
  );
}

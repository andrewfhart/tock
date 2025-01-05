import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Plus, Bug } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ActivityButton } from "~/components/activity-button";
import { CreateActivityForm } from "~/components/create-activity";
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
import { calculateDurations } from "~/utils/duration";

import { useSwipeable } from "react-swipeable";
import { useNavigate } from "@remix-run/react";

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
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(true);

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

      const { durations } = calculateDurations(dayActivities, currentDate);
      setActivityDurations(durations);
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (view === "main") {
        setView("history");
      } else {
        setCurrentDate(
          new Date(currentDate.setDate(currentDate.getDate() - 1))
        );
      }
    },
    onSwipedLeft: () => {
      if (view === "main") {
        navigate("/edit");
      } else if (
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
      <CreateActivityForm
        initialValues={undefined}
        onSubmit={handleCreateActivity}
        onCancel={() => setShowCreateActivity(false)}
        submitLabel="Create"
      />
    );
  }

  if (showDebugView) {
    return <DebugView onClose={() => setShowDebugView(false)} />;
  }

  if (view === "history") {
    return (
      <div {...handlers} className="h-screen p-4">
        <HistoryView activities={activities} date={currentDate} />
      </div>
    );
  }

  return (
    <div {...handlers} className="h-screen p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-mono">
          {isLoading ? (
            <div className="flex space-x-1 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-12"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ) : (
            formatTime(activityDurations[activeActivityId] || 0)
          )}
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

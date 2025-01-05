import { Activity } from "~/types/activity";
import { calculateProgress } from "~/utils/duration";

interface ActivitiesProps {
  activities: Activity[];
  showProgress?: boolean;
  onActivityClick: (activity: Activity) => void;
}

export function Activities({
  activities,
  showProgress = true,
  onActivityClick,
}: ActivitiesProps) {
  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <button
          key={activity.id}
          onClick={() => onActivityClick(activity)}
          className="relative w-full p-4 mb-2 text-left rounded-lg border border-input hover:bg-accent hover:text-accent-foreground"
        >
          <span className="font-medium">{activity.label}</span>
          {showProgress && (
            <div className="absolute bottom-0 left-0 h-1 bg-secondary-foreground/20 rounded-b-lg overflow-hidden w-full">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${calculateProgress(activity)}%`,
                }}
              />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

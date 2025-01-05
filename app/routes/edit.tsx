import { useNavigate } from "@remix-run/react";
import { Activities } from "~/components/activities";
import { getStoredActivities } from "~/utils/storage";
import { useSwipeable } from "react-swipeable";

export default function EditActivitiesView() {
  const navigate = useNavigate();
  const activities = getStoredActivities();
  const filteredActivities = activities.filter((a) => a.id !== "unknown");

  const handlers = useSwipeable({
    onSwipedRight: () => {
      navigate("/");
    },
  });

  return (
    <div {...handlers} className="h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Activities</h1>
      <Activities
        activities={filteredActivities}
        showProgress={false}
        onActivityClick={(activity) =>
          navigate(`/edit-activity/${activity.id}`)
        }
      />
    </div>
  );
}

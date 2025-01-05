import { useNavigate, useParams } from "@remix-run/react";
import { CreateActivityForm } from "~/components/create-activity";
import { getActivity, updateActivity } from "~/utils/storage";
import { Activity } from "~/types/activity";

export default function EditActivityView() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return null;

  const activity = getActivity(id);
  if (!activity) return <div>Activity not found</div>;

  const handleSave = (updatedActivity: Activity) => {
    updateActivity(id, updatedActivity);
    navigate("/edit");
  };

  return (
    <div className="h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Activity</h1>
      <CreateActivityForm
        initialValues={activity}
        onSubmit={handleSave}
        onCancel={() => navigate("/edit")}
        submitLabel="Save"
      />
    </div>
  );
}

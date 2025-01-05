import { json, type LoaderFunction } from "@remix-run/node";
import { useNavigate, useParams } from "@remix-run/react";
import { CreateActivityForm } from "~/components/create-activity";
import { getActivity, updateActivity, deleteActivity } from "~/utils/storage";
import { Activity } from "~/types/activity";
import { Button } from "~/components/ui/button";

// Empty loader just to satisfy Remix's routing requirements
export const loader: LoaderFunction = async () => {
  return json({});
};

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

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this activity? This will also remove all historical data for this activity."
      )
    ) {
      deleteActivity(id);
      navigate("/edit");
    }
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
      <div className="mt-8 border-t border-destructive/20 pt-6">
        <h2 className="text-lg font-semibold text-destructive mb-4">
          Danger Zone
        </h2>
        <Button variant="destructive" className="w-full" onClick={handleDelete}>
          Delete Activity
        </Button>
      </div>
    </div>
  );
}

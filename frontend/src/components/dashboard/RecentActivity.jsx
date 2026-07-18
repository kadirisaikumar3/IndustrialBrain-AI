import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

import API from "../../services/api";

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await API.get("/dashboard/activity");
      setActivities(response.data);
    } catch (error) {
      console.error("Unable to load activities:", error);
    }
  };

  return (
    <div className="card-bg rounded-3xl border border-theme p-6 shadow-xl">

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
          <Upload
            size={24}
            className="text-cyan-500"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary">
            Recent Activity
          </h2>

          <p className="text-sm text-secondary">
            Latest document uploads and actions
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-theme p-10 text-center">
          <Upload
            size={42}
            className="mx-auto mb-4 text-secondary"
          />

          <h3 className="text-lg font-semibold text-primary">
            No Recent Activity
          </h3>

          <p className="mt-2 text-secondary">
            Your recent uploads and activities will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-theme p-4 transition-all duration-300 hover:bg-cyan-500/5"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Upload
                  size={22}
                  className="text-cyan-500"
                />
              </div>

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-lg font-semibold text-primary">
                  {activity.fileName}
                </h3>

                <p className="mt-1 text-secondary">
                  {activity.activity}
                </p>

                <p className="mt-2 text-xs text-secondary">
                  {new Date(activity.time).toLocaleString()}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default RecentActivity;
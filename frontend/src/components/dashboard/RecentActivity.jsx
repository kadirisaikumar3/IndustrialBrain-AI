import { useEffect, useState } from "react";

import API from "../../services/api";

import {
    Upload,
} from "lucide-react";



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

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
                ⚡ Recent Activity
            </h2>

            <div className="space-y-5">

                {activities.map((activity, index) => {



                    return (

                        <div
                            key={index}
                            className="flex items-center gap-4 rounded-xl bg-slate-900 p-4"
                        >

                            <Upload
                                size={26}
                                className="text-cyan-400"
                            />

                            <div>

                                <h3 className="font-semibold text-white">
                                    {activity.fileName}
                                </h3>

                                <p className="text-sm text-slate-400">
                                    {activity.activity}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {new Date(activity.time).toLocaleString()}
                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default RecentActivity;
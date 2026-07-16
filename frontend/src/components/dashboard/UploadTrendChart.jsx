import { useEffect, useState } from "react";
import API from "../../services/api";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";



function UploadTrendChart() {

    const [data, setData] = useState([]);

    useEffect(() => {

        loadTrend();

    }, []);

    const loadTrend = async () => {

        try {

            const response = await API.get("/dashboard/trend");

            setData(response.data);

        } catch (error) {

            console.error("Unable to load upload trend:", error);

        }

    };

    return (

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">

                📈 Weekly Upload Trend

            </h2>

            <ResponsiveContainer width="100%" height={300}>

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                    <XAxis dataKey="day" stroke="#94a3b8" />

                    <YAxis stroke="#94a3b8" />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="uploads"
                        stroke="#22d3ee"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}

export default UploadTrendChart;